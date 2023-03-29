//INPUTS:	body(JSON),headers(JSON),url_params(JSON), requestVariables(JSON), transactionObj(JSON)
// OUTPUTS: result(JSON)
var tObj = transactionObj || {};
if (isTarget === undefined) {
    tObj = {
        tSeq: new Date(),
        transactionId: tObj.transactionId,
        sourceConfig: "-",
        sourceType: "",
        sourceTime: "",
        sourceData: {
            "status": "No Source"
        },
        mappingConfig: "-",
        mappingTime: "",
        mappingData: {
            "status": "No Mapping"
        },
        targetConfig: me.name ? me.name : "",
        targetType: me.dataSourceType ? me.dataSourceType : "",
        status: "Info:Success Only Target",
        parentTSeq: tObj.transactionId
    };
}
var tTime = new Date().getTime();
var result = {};
try {
    if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn('******PushDataToExternalSource Input******' + Things['GenericIEMasterConfig'].ObjectStringify({
            'input': body
        }));
    }
    var params = {
        input: {
            "configName": me.name,
            "configJson": me.ConfigJson
        } /* JSON */
    };

    // result: STRING
    var stringifyResult = me.HandleDecryption(params);
    input = JSON.parse(stringifyResult);
    input["sourceType"] = "";
    input["external_data_payload"] = body;
    input["external_data_headers"] = headers;
    input["external_data_url_params"] = url_params;


    var temp_rvs = {}; //which are stored in configjson, can be updated in mapping script  
    var c_r;
    if (requestVariables !== undefined) {
        c_r = requestVariables;
    } else {
        c_r = input["RequestVariables"];
    }
    for (var key in c_r) {
        temp_rvs[key] = c_r[key];
    }
    if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn("Target RequestVariables : " + JSON.stringify(temp_rvs));
    }
    var params = {
        input: input /* JSON */ ,
        request_variables: temp_rvs,
        transactionObj: tObj
    };
    if (input.current_data_format === "JSON") {
        // result: JSON
        result = me.TestApi(params);
        result = result["result"];
    } else if (input.current_data_format === "XML") {
        // result: XML
        result = me.TestApiXML(params);
        result = result["result"];
        result = String(result)
        var params = {
            input: result /* STRING */ ,
        };
        result = Things["MappingConfig"].GetJsonFromXML(params);
    } else if (input.current_data_format === "CSV") {
        // result: String
        result = me.TestApiCSV(params);
        result = result["result"];
        var params = {
            delimeter: input["csv_delimeter"],
            csv_data: result
        };
        // jsonFromCSV: JSON
        result = Things["MappingConfig"].GetJsonFromCSV(params);

    } else {
        result = {};
    }
    //Record Transactional Audit Data after posting the data to target
    if(result && result["responseStatus"]["statusCode"] == 200){
    tObj.status = "Info:Success";
    }else{
    tObj.status = "Info:Failed in Target";
    }
    tObj.targetTime = tTime;
    tObj.targetData = result;
    tObj.targetType = me.dataSourceType ? me.dataSourceType : "";
    //call InvokeReordData service to record the logger and table data
    if (isTarget !== undefined) {
        Things["GenericIEMasterConfig"].InvokeRecordData({
            input: tObj /* JSON */
        });
    }
} catch (e) {
    var result = {
        "Exception": e.message
    };
    tObj.targetTime = tTime;
    tObj.targetType = me.dataSourceType ? me.dataSourceType : "";
    
    tObj.targetData = {
        "error": "Connection Timed Out",
        "statusCode":400
    };
    
    tObj.status = "Info:Failed in Target";
    if (isTarget !== undefined) {
    Things["GenericIEMasterConfig"].InvokeRecordData({
        input: tObj /* JSON */
    });
    }
    logger.warn("Exception in PushDataToExternalSource service  " + e.message);
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
            Subject: "Error in Target Rest PushDataToExternalSource for " + me.name
        }
    });
}