//INPUTS config_name(JSON)
// OUTPUTS: result(JSON)
//Record the source audit data when data is triggered from source
//var params = {
//     input: {
//         "sId": me.name,
//         "tId": "",
//         "mTime": new Date(),
//         "sTime": new Date(),
//         "tTime": new Date(),
//         "tSeq": Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum()+1,
//         "mccId": me.name
//     }
//     /* JSON */
// };
//// result: JSON
//var recordResult = Things["GenericIEMasterConfig"].RecordTransactionalAuditData(params);
var primaryKey = new Date();
if(me.ConfigJson["PrimaryKey"]){
	primaryKey = me.ConfigJson["PrimaryKey"];
    var params = {"primaryKey": me.ConfigJson["PrimaryKey"],"inputData": input}
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
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   	 logger.warn("FTP Create Trigger service called: input is: "+input);
    }
    //logger.warn("Create Trigger service in thing is: "+me.name);
    var params = {
        input_data: input /* JSON */,
        config_name: me.name /* STRING */,
        typeName: undefined /* STRING */,
        objectType: undefined /* STRING */
    };

    // result: STRING
    var result = me.HandleInputDataStream(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn('FTP HandleInput DataStream Response'+JSON.stringify(result));
    }
    //logger.warn(" Success: "+result);
}catch(e){
    var result = {"error":e};
    logger.warn("Exception in FTP CreateTrigger Service :"+e);
//    var params = {
//        exception: result /* JSON */,
//        convertedData: {} /* JSON */,
//        rawData: input /* STRING */,
//        primaryKey: primaryKey /* STRING */,
//        status: "Source Validation Failed" /* STRING */,
//        config_name: me.name
//    };
//
//    // result: INFOTABLE dataShape: Undefined
//    var recorded_result = me.RecordTransactionalData(params);
}