//INPUTS input_data(JSON),thing_name:name of the thing(String), objectType(String), typeName(String), MCC(JSON), transactionObj(JSON)
// OUTPUTS: result (String)
pause(50);
var tObj = transactionObj;
function recordLogData(configName, tag, updatedAt, errorORInfo, primaryKey) {
    var log_params = {
        configName: configName /* configName */ ,
        tag: tag /* TAGS */ ,
        updatedAt: new Date() /* DATETIME */ ,
        errorORInfo: errorORInfo /* JSON */ ,
        primaryKey: new Date() /* STRING */
    };

    // result: INFOTABLE dataShape: Undefined
    var log_result = me.RecordLogsData(log_params);
}
try {
    if(Things[me.name].selectMode !== 'Subscriber')
    {
    if (input_data['data']) {
        input_data = input_data['data'];
    }
    }
    var data = input_data; //need to remove MCC from input, before transformation which is done below
    logger.warn('Input data for HandleInputDataStream'+JSON.stringify(data));
    var config_name = config_name;
    var primaryKey = new Date(); // primary key is the unique key for datatrasaction table.
    var logPrimaryKey = new Date();

    //Things[config_name].hold = false;
     var sourcePostHold = false;
    // execute pre tranThings[config_name].transactionHold = false;sformation rules before sending the data to mapping
    var source_configJson = Things[config_name].ConfigJson;
    var src_pre_rules = [];
    if (source_configJson["TransformationRules"] && source_configJson["TransformationRules"].length > 0) {
        src_pre_rules = source_configJson["TransformationRules"];
        if (src_pre_rules[0]["script"].length > 0) {
            var sps = {
                input: {
                    "value": data
                } /* JSON */ ,
                transactionObj: tObj,
                sample_script: {
                    "script_array": src_pre_rules[0]["script"]
                },
                /* JSON */ //As allowing only one script in target
                configName: config_name
            };
            logger.warn("Transformation Test Input"+JSON.stringify(sps));
            var src_pre_script_output = Things["GenericIEMasterConfig"].TestScript(sps);
            data = src_pre_script_output.value;
            if(src_pre_script_output.value && src_pre_script_output.value.Hold) {
                sourcePostHold = true;
            }
            logger.warn("Source output"+data);
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("*********** Soure PostScript Response(before EnterInto Mapping) *******" + JSON.stringify(data));
            }
        }

    }
    if (sourcePostHold === false) { //continue the transaction if transactionHold is false

        if (me.ConfigJson["PrimaryKey"]) { //if the config contains primary key in config json then take that primary key other wise take the date time value as primary key
            primaryKey = me.ConfigJson["PrimaryKey"];
            var primaryKeyParams = {
                inputData: data, //[objectType] /* JSON */,
                primaryKey: me.ConfigJson["PrimaryKey"] /* STRING */
            };

            // result: JSON
            var primary_key_result = me.GetPrimaryKeyValue(primaryKeyParams);
            if (primary_key_result["Result"] !== "InvalidData") {
                primaryKey = primary_key_result["Result"];
            } else if (primary_key_result["Exception"]) {
                primaryKey = "InvalidData";
            } else {}

        }
        var result = {};
        var mappingCount = 0;
        var mapping_configs = {};
        if((Things['GenericIEMasterConfig'].getMappingConfigsData) && (Things['GenericIEMasterConfig'].getMappingConfigsData.Configs!== undefined)){
       //     logger.warn('*******ConfigsAlreadyExists************');
            mapping_configs = Things['GenericIEMasterConfig'].getMappingConfigsData;
        }else {
            var paramsToGetMappingList = {
                maxItems: 200 /* NUMBER */ ,
                modelTags: "Applications:IE;Applications:DynamicConfig;Applications:Mapping" /* TAGS */ ,
                query: undefined /* QUERY */
            };
            // result: INFOTABLE dataShape: SearchResults
            var table = Resources["SearchFunctions"].SearchThings(paramsToGetMappingList);
            var things_arr = [];
            var config_obj_arr = table.ToJSON().rows[0].commonResults.rows;
            for (var k = 0; k < config_obj_arr.length; k++) {
                things_arr.push(config_obj_arr[k].name);
            }
              mapping_configs = {"Configs": things_arr };
              Things['GenericIEMasterConfig'].getMappingConfigsData = mapping_configs;
            // logger.warn('*******NOConfigExists************');

        }
        var typeName = typeName; // typeName is like "Material\\Apparel\\Artwork\\Prints"

        if (data["schema"]) { // if data contains schema then leave the data as it is
        } else {
            if (Things[config_name].dataSourceType == "Flex") {
                data = {
                    "schema": data
                };  //In UI for converted the data entire data of typename(like material) is given as value to schema key in object
            }else if(Things[config_name].dataSourceType == "FTP"){
                data = {
                    "schema": data[0]
                }; //In UI for converted the data entire data is given as value to schema key in object
            }
            else {
                data = {
                    "schema": data
                };
            }
        }
        //Check all mapping configs which contains given input thing as SourcConfig
        for (var i = 0; i < mapping_configs.Configs.length; i++) {
            var map_config_name = mapping_configs.Configs[i];
          if(Things[map_config_name] && Things[map_config_name].SourceConfig && Things[map_config_name].TargetConfig) {
             var source_config = Things[map_config_name].SourceConfig;
            var target_config = Things[map_config_name].TargetConfig;
            var spec_json = Things[map_config_name].SpecJson;
            var isTargetValid = true;
            if (MCC) { //***IF MCC is there the data sould flow thorough that mapping group path only
                if (MCC.mapping_config_name === map_config_name && MCC.target_config_name === target_config && MCC.source_config_name === source_config) {
                    isTargetValid = true;
                } else {
                    isTargetValid = false;
                }
            }
            if (me.name === source_config && isTargetValid) { //current config is as SourcConfig for map_config_name
                //check validation rules or configuariton rules(triggers)
                //update transaction sequence value. concatinate the tSeq with mapping config name because one source can have multiple mappings
                var time = new Date().getTime() + Math.floor((1 + Math.random()) * 0x1000000);
                //TODO : if MCC is there is should travel thorough that path only
                tObj.tSeq = new Date().getTime() + Math.floor((1 + Math.random()) * 0x1000000);
                if (tObj.transactionId !== tObj.parentTSeq) {
                    tObj.parentTSeq = tObj.parentTSeq;
                } else {
                    tObj.parentTSeq = time;
                }
                tObj.transactionId = time;
                mappingCount = mappingCount + 1;
                var MasterCreateContext = MCC; //input_data["MasterCreateContext"];

                if (CFC === undefined) {
                    CFC = {};
                }
                if (MasterCreateContext === undefined) {
                    MasterCreateContext = {};
                }
               tObj.mappingConfig = map_config_name;
                logger.warn("Mapping config name"+map_config_name);
                logger.warn("Spec json value"+Things[map_config_name].SpecJson.Spec);
                var params = {
                    SpecJson: Things[map_config_name].SpecJson /* JSON */ ,
                    InputJson: data /* JSON */ ,
                    CFC: CFC,
                    transactionObj: tObj,
                    MCC: MasterCreateContext
                };
                logger.warn("Transaction object check"+JSON.stringify(transactionObj));
                // result: STRING
                if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                    logger.warn("***********Input for Mapping JOLT********" + JSON.stringify(params));
                }
                 var mappingHold = false;
                var data_transf_result = Things[map_config_name].customTransformer(params);
                logger.warn("Custom transformed data"+JSON.stringify(data_transf_result));
                var mappingCFC = {};
                if(data_transf_result && data_transf_result["Result"] && data_transf_result["Result"]["schema"]) {
                    if(data_transf_result["Result"]["schema"].Hold){
                        mappingHold=true;
                    }
                    if(data_transf_result["Result"]["schema"].MappingCFC) {
                        mappingCFC=data_transf_result["Result"]["schema"].MappingCFC;
                        delete data_transf_result["Result"]["schema"].MappingCFC;
                    }
                }
                var mapTime = new Date(); // here data is converted so note the converted time in mTime.
                // recordAuditData whether mapping conversion failed or not.sedn the mapping config name as source config to differntiatte the  mccid value in flow

                var removeKeyParams = {
                    jsonKey: "_index" /* STRING */ ,
                    jsonObject: data_transf_result /* JSON */
                };

                // result: JSON
                data_transf_result = Things[map_config_name].removeAllOccurancesOfJsonKey(removeKeyParams);
                tObj.mappingTime=new Date().getTime();
                tObj.targetConfig = target_config;
                tObj.targetType = Things[target_config].dataSourceType;
                if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                    logger.warn("************ Data Trasfer Result(JOLT Response) *******" + JSON.stringify(data_transf_result));
                }
                //******************if hold attribute true in mapping , stopping target push******************
                if (mappingHold === false) {
                    if (data_transf_result) {
                        //***************Handling CC and MCC before target pushing
                        if (data_transf_result["schema"]) {

                            //recording mappingTime and mappingData
                            tObj.mappingTime = new Date().getTime();
                            tObj.mappingData = data_transf_result["schema"];
                             tObj.status = "Success";
                            ////////////////
                            data_transf_result = data_transf_result["schema"];
                            recordLogData(map_config_name, "IELogs:Info", new Date(), {
                                "Mapping Validation Success": data_transf_result
                            }, logPrimaryKey); // log the data after mapping validation rules Success
                            // record mapping transaction data because mapping validations are successfull
                        } else if (data_transf_result["Result"]) {
                            if (data_transf_result["Result"]["schema"]) {
                                tObj.mappingTime = new Date().getTime();
                                tObj.mappingData = data_transf_result["Result"]["schema"];
                                data_transf_result = data_transf_result["Result"]["schema"];
                                recordLogData(map_config_name, "IELogs:Info", new Date(), {
                                    "Mapping Validation Success": data_transf_result
                                }, logPrimaryKey); // log the data after mapping validation rules Success
                                // record mapping transaction data because mapping validations are successfull
                            } else {
                                tObj.mappingData = data_transf_result;
                                tObj.status = "Mapping Script Failed";
                                recordLogData(map_config_name, "IELogs:Warning", new Date(), {
                                    "Mapping Validation Failed": {}
                                }, logPrimaryKey); // log the data after mapping validation rules Failed
                            }

                        } else {
                            tObj.mappingTime = new Date().getTime();
                            tObj.mappingData = data_transf_result;
                             tObj.status = "No data in Mapping";
                            recordLogData(map_config_name, "IELogs:Warning", new Date(), {
                                "Mapping Validation Failed": data_transf_result
                            }, logPrimaryKey); // log the data after mapping validation rules Failed
                            // record mapping transaction data because mapping validations are failed
                        }
                    } else if (data_transf_result === undefined) {
                        tObj.mappingTime = new Date().getTime();
                        tObj.mappingData = data_transf_result;
                        recordLogData(map_config_name, "IELogs:Warning", new Date(), {
                            "Mapping Validation Failed": {}
                        }, logPrimaryKey); // log the data after mapping validation rules Failed
                    } else {}

                    //***Target schema object-array handling to push data***
                    var target_schema = Things[target_config].inputSchema;
                    var iteration = 1;
                    var new_data_transf_result = {};
                    if (data_transf_result && target_schema.type === 'object' && typeof data_transf_result === 'object' && Array.isArray(data_transf_result) === false) { //datatransf2Schema : object-object
                        iteration = 1;
                        new_data_transf_result = [data_transf_result];
                    } else if (data_transf_result && target_schema.type === 'array' && typeof data_transf_result === 'object' && Array.isArray(data_transf_result) === false) { //datatransf2Schema : object-array
                        new_data_transf_result = [
                            [data_transf_result]
                        ];
                        iteration = 1;
                    } else if (data_transf_result && target_schema.type === 'object' && typeof data_transf_result === 'object' && Array.isArray(data_transf_result) === true) { //datatransf2Schema : array-object
                        iteration = data_transf_result.length;
                        new_data_transf_result = data_transf_result;
                    } else if (data_transf_result && target_schema.type === 'array' && typeof data_transf_result === 'object' && Array.isArray(data_transf_result) === true) { //datatransf2Schema : array-array
                        iteration = 1;
                        new_data_transf_result = [data_transf_result];
                    } else {
                        iteration = 1;
                        new_data_transf_result = [data_transf_result];
                    }
                    if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                        logger.warn('*************** PUSH DATA TO EXTERNAL SOURCE INPUT *****************' + JSON.stringify(new_data_transf_result));
                    }
                    for (var target_itr = 0; target_itr < iteration; target_itr++) {
                        data_transf_result = new_data_transf_result[target_itr];
                        var tempTranfResult = data_transf_result;
                        // execute pre transformation rules before pushing the data to target
                        var tar_config = Things[target_config].ConfigJson;
                        var pre_rules = [];
                        if (tar_config["PreTransformationRules"] && tar_config["PreTransformationRules"].length > 0) {
                            pre_rules = tar_config["PreTransformationRules"];
                            if (pre_rules[0]["script"].length > 0) {
                                tObj.level = "PreScript";
                                var ps = {
                                    input: {
                                        "value": data_transf_result
                                    } /* JSON */ ,
                                    transactionObj: tObj,
                                    /* JSON */
                                    sample_script: {
                                        "script_array": pre_rules[0]["script"]
                                    } /* JSON */ //As allowing only one script in target
                                };
                                var pre_script_output = Things["GenericIEMasterConfig"].TestScript(ps);
                                data_transf_result = pre_script_output.value;
                            }
                            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                                logger.warn('**************** PreScript OutPut *****************' + JSON.stringify(data_transf_result));
                            }
                        }
                        //FINAL DATA PUSHING TO TARGET : This should not be done immediately, once it passes criteria at target level, then only this should be called
                        var targetInputParams = {
                            headers: undefined /* JSON */ ,
                            url_params: undefined /* JSON */ ,
                            body: data_transf_result,
                            /* JSON */
                            transactionObj: tObj
                        };
                        if (data_transf_result.requestVariables && data_transf_result.inputData === undefined) {
                            targetInputParams = {
                                headers: undefined /* JSON */ ,
                                url_params: undefined /* JSON */ ,
                                body: data_transf_result /* JSON */ ,
                                requestVariables: data_transf_result.requestVariables,
                                transactionObj: tObj
                            };
                            if (Things["GenericIEMasterConfig"].isEnableScriptLogs) {
                                logger.warn('^^^^^^^^^^^^ Target OverideRequestVariables ^^^^^^^^^^^^^^^' + JSON.stringify(data_transf_result.requestVariables) + typeof data_transf_result.requestVariables)
                            }
                        }
                        if (data_transf_result.inputData && data_transf_result.requestVariables === undefined) {
                            targetInputParams = {
                                headers: undefined /* JSON */ ,
                                url_params: undefined /* JSON */ ,
                                body: data_transf_result.inputData,
                                /* JSON */
                                transactionObj: tObj
                            };
                        }
                        if (data_transf_result.requestVariables && data_transf_result.inputData) {
                            targetInputParams = {
                                headers: undefined /* JSON */ ,
                                url_params: undefined /* JSON */ ,
                                body: data_transf_result.inputData /* JSON */ ,
                                requestVariables: data_transf_result.requestVariables,
                                transactionObj: tObj
                            };
                            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                                logger.warn('^^^^^^^^^^^^ Target OverideRequestVariables ^^^^^^^^^^^^^^^' + JSON.stringify(data_transf_result.requestVariables) + typeof data_transf_result.requestVariables);
                            }
                        }
                        targetInputParams["isTarget"] = "false"; //pass transaction object to PushDataToExternalService through params
                        pause(10)
                        // result: JSON
                        var push_data_result = Things[target_config].PushDataToExternalSource(targetInputParams);
                        var push_params = {
                            input: push_data_result /* JSON */
                        };
                        // result: INTEGER
                        var push_data_length = me.GetObjectLength(push_params);
                        if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                            logger.warn("PUSH DATA TO EXTERNAL SOURCE RESULT: " + JSON.stringify(push_data_result));
                        }
                        // save target transactional data
                        if (push_data_result && push_data_result["Exception"]) {
                            recordLogData(target_config, "IELogs:Warning", new Date(), {
                                "Exception": push_data_result
                            }, logPrimaryKey); // log the data after target validation rules Failed
                        } else if (push_data_result !== undefined && push_data_result != "{}" || push_data_length !== 0) {
                            recordLogData(target_config, "IELogs:Info", new Date(), {
                                "Success": push_data_result
                            }, logPrimaryKey); // log the data after mapping validation rules Failed
                        } else if (push_data_length === 0) {
                            recordLogData(target_config, "IELogs:Warning", new Date(), {
                                "Exception": push_data_result
                            }, logPrimaryKey); // log the data after target validation rules Failed
                        } else {}
                        //**********Executing script in target if any after posting
                        var tar_config = Things[target_config].ConfigJson;
                        var rules = [];
                        if (tar_config["TransformationRules"] && tar_config["TransformationRules"].length > 0) {
                            rules = tar_config["TransformationRules"];
                            tObj.level = "PostScript";
                            var ps = {
                                input: {
                                    "value": push_data_result
                                } /* JSON */ ,
                                transactionObj: tObj,
                                MappingCFC : mappingCFC,
                                sample_script: {
                                    "script_array": rules[0]["script"]
                                } /* JSON */ //As allowing only one script in target
                            };
                            var script_output = Things["GenericIEMasterConfig"].TestScript(ps);
                            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                                logger.warn('*************** Post Script Output *****************' + JSON.stringify(script_output))
                            }
                        }

                    } // ***** target iteration*******
                    //****************************************************
                
                } else { //*******Hold if**********
                    tObj.mappingData = {"status": "Transaction stopped in Mapping"}
                    tObj.targetData = {};
                    tObj.status = "Transaction stopped in Mapping";
                    tObj.targetType = "";
                    Things["GenericIEMasterConfig"].InvokeRecordData({
                        input: tObj /* JSON */
                    });
                }
            }
               }
            delete transactionObj.targetData;
            delete transactionObj.mappingData;
            delete transactionObj.mappingTime;
            delete transactionObj.targetConfig;
            delete transactionObj.targetType;
            delete transactionObj.targetTime;
        }
        var result = {};
        if (mappingCount === 0) {
            result = {
                "Warning": "There are no mappings for current source"
            };
            tObj.mappingData = result;
            tObj.targetData = {
                "status": "Mapping not defined"
            };
            tObj.targetType = "";
            tObj.status = "Info:Mapping not defined";
            Things["GenericIEMasterConfig"].InvokeRecordData({
                input: tObj /* JSON */
            });
        } else {
            result = {
                "Success": push_data_result
            };
        }
    } else { //me.hold is false
        var text = "Transaction is holded for " + config_name;
        var result = {
            "Status": text,
             "data": input_data
        };
        logger.warn("Warning: " + text);
        tObj.sourceData = {"warning": text, "data": input_data}
        tObj.mappingData = { "status": "Transaction stopped before Mapping"}
        tObj.targetData = {"warning": "Nodata"}
        tObj.status = "Transaction stopped before Mapping"
        tObj.targetType = "";
        Things["GenericIEMasterConfig"].InvokeRecordData({
            input: tObj /* JSON */
        });
    }
} catch (e) {
    var error = e.message ? e.message : e
    var result = {
        "error": error
    };
    tObj.mappingData = {
        "error": error
    };
    tObj.targetType = "";
    tObj.targetData = {
        "status": "Target failed"
    };
    tObj.status = "Target Failed";
    Things["GenericIEMasterConfig"].InvokeRecordData({
        input: tObj /* JSON */
    });
    logger.warn("Exception in " + me.name + " HandleInputDataStream Service: " + e.message);
    if (tObj.tSeq) {
        delete tObj.tSeq;
    }
    if(tObj.transactionId){
    tObj.transactionId = tObj.transactionId.toString();
    }
    if(tObj.parentTSeq){
    tObj.parentTSeq = tObj.parentTSeq.toString();
    }
    var mailService = Things["GenericIEMasterConfig"].HandleCatchExceptions({
        input: {
            payload: {
                message: e.message,
                transactionObj: tObj
            },
            Subject: "Error in " + me.name
        }
    });
    var log_params = {
        configName: me.name /* configName */,
        tag: "IELogs:Error" /* TAGS */,
        updatedAt: new Date() /* DATETIME */,
        errorORInfo: {} /* JSON */,
        primaryKey: new Date() /* STRING */
    };

    // result: INFOTABLE dataShape: Undefined
    var log_result = Things["GenericIEMasterConfig"].RecordLogsData(log_params);
}