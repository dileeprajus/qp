//INPUTS config_name(JSON)
// OUTPUTS: result(JSON)
var primaryKey = new Date().getTime() + Math.floor((1 + Math.random()) * 0x10000);
var tObj = {tSeq: primaryKey, transactionId: primaryKey, sourceConfig: me.name ? me.name : "", sourceType: me.dataSourceType ? me.dataSourceType : "", sourceTime: primaryKey, parentTSeq: primaryKey, sourceData: input, status:"Info:Success"};
if(transactionObj!== undefined) {
 tObj.parentTSeq = transactionObj.transactionId;
}
if(me.ConfigJson["PrimaryKey"]){
	primaryKey = me.ConfigJson["PrimaryKey"];
    var params = {"primaryKey": me.ConfigJson["PrimaryKey"],"inputData": input};
    var p_value = Things["GenericIEMasterConfig"].GetPrimaryKeyValue(params);
    logger.warn("Primary key value: "+JSON.stringify(p_value));
    if(p_value.Result){
        primaryKey = p_value.Result;
    }
}
//Record the data in logDatatable
var log_params = {
    configName: me.name /* configName */,
    tag: "IELogs:Info" /* TAGS */,
    updatedAt: new Date() /* DATETIME */,
    errorORInfo: {"Info":input} /* JSON */,
    primaryKey: primaryKey ? primaryKey : new Date() /* STRING */
};

// result: INFOTABLE dataShape: Undefined
var log_result = me.RecordLogsData(log_params);
try{
    if(input !== undefined || Object.keys(input).length > 0){
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   	 logger.warn("GooglePubSub Create Trigger service called: input is: "+input);
    }
    //logger.warn("Create Trigger service in thing is: "+me.name);
    var params = {
        input_data: input /* JSON */,
        config_name: me.name /* STRING */,
        typeName: undefined /* STRING */,
        objectType: undefined /* STRING */,
        transactionObj: tObj
    };
    }
    // result: STRING
    var result = me.HandleInputDataStream(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn('GooglePubSub HandleInput DataStream Response'+JSON.stringify(result));
    }
    //logger.warn(" Success: "+result);
}
catch(e){
    var result = {"error":e.message};
    tObj.sourceData = {"status": "Source failed in  CreateTrigger"};
    tObj.targetData = {"status":"Target failed"};
    tObj.targetType = "";
    tObj.mappingData = {"status":"Mapping failed"};
    tObj.status = "Info:Failed in CreateTrigger";
    Things["GenericIEMasterConfig"].InvokeRecordData({
        input: tObj /* JSON */
    });
    logger.warn("Exception in GooglePubSub CreateTrigger Service :"+e.message);
    if(tObj.tSeq){
    delete tObj.tSeq;
    }
    if(tObj.transactionId){
    tObj.transactionId = tObj.transactionId.toString();
    }
    if(tObj.parentTSeq){
    tObj.parentTSeq = tObj.parentTSeq.toString();
    }
	var mailService =  Things["GenericIEMasterConfig"].HandleCatchExceptions({
        input: {
            payload:{message:e.message, transactionObject: tObj},
            Subject:"CreateTrigger Service failed in "+ me.name
        }
    });
}