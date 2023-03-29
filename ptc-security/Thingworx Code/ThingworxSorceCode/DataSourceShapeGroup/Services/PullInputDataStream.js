//INPUTS RequestVariables(JSON), MasterCreateContext(JSON)
// OUTPUTS: result(String)
logger.warn("Request variables---->"+JSON.stringify(RequestVariables));
var primaryKey = new Date().getTime() + Math.floor((1 + Math.random()) * 0x10000);
var srcTime = new Date();
var tObj = {
    tSeq: primaryKey,
    transactionId: primaryKey,
    sourceConfig: me.name ? me.name : "",
    sourceType: me.dataSourceType ? me.dataSourceType : "",
    sourceTime: srcTime,
    parentTSeq: primaryKey,
    status: "Info:Success"
};
logger.warn(':::::::::::$$$$$$$$$::::::::::::'+JSON.stringify(transactionObj));
if(transactionObj && transactionObj.TIMESTAMP) {
 tObj.TIMESTAMP = transactionObj.TIMESTAMP;
}
logger.warn(':::::::::::2222222::::::::::::'+JSON.stringify(tObj));

if (transactionObj !== undefined) {
    tObj.parentTSeq = transactionObj.transactionId;
}
try {
    if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn("************** PullInputDataStream  Initialised ****************" + me.name);
        logger.warn("PullReq --- REQUESTVARIABLES : " + JSON.stringify(RequestVariables));
        logger.warn("PullReq --- MASTERCREATECONTEXT : " + JSON.stringify(MasterCreateContext));
    }
    var srcPreScriptExist = false;
    var temp_result_data = {};
    var result = {};
    var temp_input = {};
    temp_input["RequestVariables"] = RequestVariables;
    temp_input["MasterCreateContext"] = MasterCreateContext;
    var MCC = MasterCreateContext;
    var temp_group = me.thingTemplate;
    var config_name = me.name;
    var tmp_configJson = me.ConfigJson;
    var things_arr = [];

    // result: INFOTABLE dataShape: SearchResults
    //if current config is as SourceConfig in mappingConfig then only call the inputdata service and pass the data to handleinputdatastream
    //call GetDataInput service
    var params = {
        input: temp_input /* JSON */ ,
        transactionObj: tObj
    };
    // result: STRING
    var temp_data = me.GetInputData(params);
    var source_configJson = Things[config_name].ConfigJson;
    var src_pre_rules = [];
    var data;
    var sourcePreHold = false;
    var src_pre_script_output;
    if (source_configJson["PreTransformationRules"] && source_configJson["PreTransformationRules"].length > 0) {
        src_pre_rules = source_configJson["PreTransformationRules"];
        if (src_pre_rules[0]["script"].length > 0) {
            srcPreScriptExist = true;
        }
    }
    function preScript()
    {
            var sps = {
                input: {
                    "value": temp_data
                } /* JSON */ ,
                transactionObj: tObj,
                sample_script: {
                    "script_array": src_pre_rules[0]["script"]
                },
                /* JSON */ //As allowing only one script in target
                configName: config_name
            };
          src_pre_script_output = Things["GenericIEMasterConfig"].TestScript(sps);
            data = src_pre_script_output.value;
        return data;
   }
    if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn("Data From PullInputDataSource : " + JSON.stringify(temp_data));
    }
    var ps = {
        input: MCC /* JSON */
    };
    // result: STRING
    var s_mcc = Things["GenericIEMasterConfig"].ObjectStringify(ps);
    logger.warn("MCC data check "+s_mcc);
    if (MCC) {
        //if MCC is there
        var arr = [];
        for (var key in MCC) {
            if (arr.indexOf(MCC[key]) === -1) {
                arr.push(MCC[key]);
            }
        }
        if (arr.length === 1 && arr[0] === "") { //if all values of keys are null then it is from JoltRemoteAPIFetch
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("MCC(True) FROM Jolt RemoteAPIFetch: " + temp_data);
            }
            result = {
                'result': temp_data
            };
        } else { //From Jolt initiate source trigger
            //Record the data in logDatatable
            if (srcPreScriptExist == true) {
                var preScriptData = preScript();
                 if (preScriptData) {
                 sourcePreHold = preScriptData.Hold?true:false;
                temp_data = sourcePreHold?temp_data:preScriptData;
}
}
            if(sourcePreHold == false)
            {
            var log_params = {
                configName: me.name /* configName */ ,
                tag: "IELogs:Info" /* TAGS */ ,
                updatedAt: new Date() /* DATETIME */ ,
                errorORInfo: {
                    "Info": temp_data
                } /* JSON */ ,
                primaryKey: new Date() /* STRING */
            };

            // result: INFOTABLE dataShape: Undefined
            // var log_result = me.RecordLogsData(log_params);
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("MCC FROM Jolt InitiateSourceTrigger: ");
            }
            if (me.dataSourceType === "Flex") {
                var objType = temp_data.objectType;
                if (temp_data["statusCode"] === 200) {
                    var objArrData = temp_data.objectData[objType];
                    for (var x = 0; x < objArrData.length; i++) {
                        tObj.tSeq = new Date().getTime();
                        tObj.sourceData = objArrData[x];
                        if (transactionObj !== undefined) {
                            tObj.parentTSeq = transactionObj.transactionId;
                        }
                        //obj[objType] = objArrData[x]; //form data object like {"Material":{"typeid":"","ptcmaterialName":""........etc.}}
                        var params = {
                            input_data: objArrData[x] /* JSON */ ,
                            config_name: config_name /* STRING */ ,
                            typeName: undefined /* STRING */ ,
                            objectType: objType /* STRING */ ,
                            MCC: MasterCreateContext,
                            CFC: CFC,
                            transactionObj: tObj
                        };
                        // result: JSON
                        var handle_input_result = me.HandleInputDataStream(params);
                    }
                } else if (temp_data["statusCode"] === 400) { //not found if input search criteria doesnot match in flex side then it will result 400 as statusCode

                } else {}
            } else {
                //update sourcedata property in transaction object
                tObj.tSeq = new Date().getTime();
                tObj.sourceData = temp_data;
                var params = {
                    input_data: temp_data /* JSON */ ,
                    config_name: config_name /* STRING */ ,
                    typeName: undefined /* STRING */ ,
                    objectType: undefined /* STRING */ ,
                    MCC: MasterCreateContext,
                    CFC: CFC,
                    transactionObj: tObj
                };
                // result: JSON
                var handle_input_result = me.HandleInputDataStream(params);
                logger.warn("parameters for HandleInputDataStream"+JSON.stringify(params));
                if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                    logger.warn("Result for PullInputDataStream: " + handle_input_result);
                }
                result = handle_input_result;
                //result = "";
            }


        }
        else { //source pre hold is true
        var text = "Transaction is holded for " + config_name;
        var result = {
            "Status": text,
             "data": temp_data
        };
        logger.warn("Warning: " + text);
        tObj.sourceData = {"warning": text, "data": temp_data}
        tObj.mappingData = { "status": "Transaction stopped before Mapping"}
        tObj.targetData = {"warning": "Nodata"}
        tObj.status = "Transaction stopped before Mapping due to source pre hold is true"
        tObj.targetType = "";
        Things["GenericIEMasterConfig"].InvokeRecordData({
            input: tObj /* JSON */
        });
    }
    }
    }
    else {
        //Record the data in logDatatable
         if (srcPreScriptExist == true) {
var preScriptData = preScript();
if (preScriptData) {
sourcePreHold = preScriptData.Hold?true:false;
temp_data = sourcePreHold?temp_data:preScriptData;
logger.warn("Update source data"+temp_data);
}
            }
        if(sourcePreHold == false)
         {
        var log_params = {
            configName: me.name /* configName */ ,
            tag: "IELogs:Info" /* TAGS */ ,
            updatedAt: new Date() /* DATETIME */ ,
            errorORInfo: {
                "Info": temp_data
            } /* JSON */ ,
            primaryKey: new Date() /* STRING */
        };

        // result: INFOTABLE dataShape: Undefined
        var log_result = me.RecordLogsData(log_params);

        if (me.dataSourceType === "Flex") {
            var objType = me.ConfigJson["SelectedFlexObjects"][0];
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn(objType + " : Flex Schedular : " + JSON.stringify(temp_data));
            }
            var objArrData = temp_data[objType]
            for (var x = 0; x < objArrData.length; x++) {
                tObj.tSeq = new Date().getTime();
                tObj.sourceData = objArrData[x];
                if (transactionObj !== undefined) {
                    tObj.parentTSeq = transactionObj.transactionId;
                }
                var params = {
                    input_data: objArrData[x] /* JSON */ ,
                    config_name: config_name /* STRING */ ,
                    typeName: undefined /* STRING */ ,
                    objectType: objType /* STRING */ ,
                    CFC: CFC,
                    transactionObj: tObj
                };
                if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                    logger.warn("Flex HandleInputDataStream Input " + x + " " + JSON.stringify(params));
                }
                var handle_input_result = me.HandleInputDataStream(params);
                if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                    logger.warn("Flex HandleInputDataStream Output " + x + " " + JSON.stringify(handle_input_result));
                }
            }
        } else if (me.dataSourceType === "FTP") {
            if(temp_data.hasOwnProperty('result')){
                var tempArr = temp_data.result;
            }else{
                tempArr = temp_data;
            }
            tObj.tSeq = new Date().getTime();
            tObj.sourceData = {'data': tempArr};
            if (transactionObj !== undefined) {
                tObj.parentTSeq = transactionObj.transactionId;
            }
            var params = {
                input_data: {'data':tempArr} /* JSON */,
                config_name: config_name /* STRING */ ,
                typeName: undefined /* STRING */ ,
                objectType: undefined /* STRING */ ,
                CFC: CFC,
                transactionObj: tObj
            };
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("FTP HandleInputDataStream Input" + JSON.stringify(params));
            }
            // result: JSON
            var handle_input_result = me.HandleInputDataStream(params);
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("FTP HandleInputDataStream Output" + JSON.stringify(handle_input_result));
            }
            if(tempArr.length===0) {
                tObj.status = "Failed at source";
            }
        } else if (me.dataSourceType === "Google Pub/Sub") {
            if(temp_data.hasOwnProperty('result')){
                var tempArr = temp_data.result;
            }else{
                tempArr = temp_data;
            }
            tObj.tSeq = new Date().getTime();
            tObj.sourceData = {'data': tempArr};
            if (transactionObj !== undefined) {
                tObj.parentTSeq = transactionObj.transactionId;
            }
            var params = {
                input_data: {'data':tempArr} /* JSON */,
                config_name: config_name /* STRING */ ,
                typeName: undefined /* STRING */ ,
                objectType: undefined /* STRING */ ,
                CFC: CFC,
                transactionObj: tObj
            };
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("GooglePubSub HandleInputDataStream Input" + JSON.stringify(params));
            }
            // result: JSON
            var handle_input_result = me.HandleInputDataStream(params);
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("GooglePubSub HandleInputDataStream Output" + JSON.stringify(handle_input_result));
            }
            if(tempArr.length===0) {
                tObj.status = "Failed at source";
            }
        }else {
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("MCC FROM Pull Schedular: " + MCC + " Result :" + result);
            }
            //update sourcedata property in transaction object
            tObj.tSeq = new Date().getTime();
            if (transactionObj !== undefined) {
                tObj.parentTSeq = transactionObj.transactionId;
            }
            tObj.sourceData = temp_data;
            var params = {
                input_data: temp_data /* JSON */ ,
                config_name: config_name /* STRING */ ,
                typeName: undefined /* STRING */ ,
                objectType: undefined /* STRING */ ,
                CFC: CFC,
                transactionObj: tObj
            };
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("HandleInputDataStream Input for " + config_name + " " + JSON.stringify(params));
            }
            // result: JSON
            //var handle_input_result = {};
            var handle_input_result = me.HandleInputDataStream(params);
            result = handle_input_result;
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("HandleInputDataStream Output for " + config_name + " " + JSON.stringify(handle_input_result));
            }
        }
        }
       else { //source pre hold is true
        var text = "Transaction is holded for " + config_name;
        var result = {
            "Status": text,
             "data": temp_data
        };
        logger.warn("Warning: " + text);
        tObj.sourceData = {"warning": text, "data": temp_data}
        tObj.mappingData = { "status": "Transaction stopped before Mapping"}
        tObj.targetData = {"warning": "Nodata"}
        tObj.status = "Transaction stopped before Mapping due to source pre hold is true"
        tObj.targetType = "";
        Things["GenericIEMasterConfig"].InvokeRecordData({
            input: tObj /* JSON */
        });
    }
    }
}catch (e) {
    logger.warn("Exception in PullInputDataStream Service in :" + me.name + " is:::" + e.message);
    var result = { "error": e.message};
    tObj.sourceData =  tObj.sourceData ?  tObj.sourceData : { "status": "Source failed"};
    tObj.targetData = { "status": "Target failed" };
    tObj.targetType = "";
    tObj.mappingData = {"status": "Mapping failed"};
    tObj.status = "Info:Failed in PullInputDataStream";
    Things["GenericIEMasterConfig"].InvokeRecordData({
        input: tObj /* JSON */
    });
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
                transactionObject: tObj
            },
            Subject: "Error in fetch data from PullInputDataStream for "+me.name
        }
    });
}