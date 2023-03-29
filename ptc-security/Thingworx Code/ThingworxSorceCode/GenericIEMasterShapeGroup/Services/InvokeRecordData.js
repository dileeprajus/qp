//logger.warn(':::::::::::InvokeRecordDataAPI:::::::::::'+input);
//if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
//logger.warn(':::::::::::InvokeRecordDataAPI:::::::::::'+input);
//}
//try{
//    var values1 = DataShapes["TRCTransactionAuditDS"].CreateValues();
//    values1.primaryKey = new Date()+"_"+input.tSeq;
//    values1.tSeq = input.tSeq ? input.tSeq : ""; //STRING
//    values1.transactionId = input.transactionId ? input.transactionId : "";
//    values1.sourceConfig = input.sourceConfig ? input.sourceConfig : ""; //STRING
//    values1.targetConfig = input.targetConfig ? input.targetConfig : ""; //STRING
//    values1.mappingConfig = input.mappingConfig ? input.mappingConfig : ""; //STRING
//    values1.flowDataSourceType = input.sourceType + "-" + input.targetType ? input.sourceType + "-" + input.targetType : "";
//    values1.sourceTimeStamp = input.sourceTime ? input.sourceTime : ""; //DATETIME
//    values1.targetTimeStamp = input.targetTime ? input.targetTime : ""; //STRING
//    values1.mappingTimeStamp = input.mappingTime ? input.mappingTime : "";
//    values1.status = input.status ? input.status : "";
//       values1.parentTSeq = input.parentTSeq ? input.parentTSeq : "";
//    values1.sourceData = input.sourceData ? input.sourceData : ""; //DATETIME
//    values1.targetData = input.targetData ? input.targetData : ""; //STRING
//    values1.mappingData = input.mappingData ? input.mappingData : "";
//    // Check whether same key existed in the datatable or not
//    var uniqueTimeStamp = new Date().getTime()+(Math.random())*123456;
//    var params1 = {
//        sourceType: undefined /* STRING */,
//        values: values1 /* INFOTABLE*/,
//        location: undefined /* LOCATION */,
//        tags: undefined /* TAGS */,
//        timestamp: uniqueTimeStamp
//    };
//    if(Things["GenericIEMasterConfig"].testApi === false){
//     Things["AuditInfoStream"].AddStreamEntry(params1);
//    }
//}catch(e){
//    var result = {error: e.message};
//    logger.warn("error in InvokeRecordData service: "+e.message);
//}
pause(50);
//if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
//}
//logger.warn(':::::::::::InvokeRecordDataAPIWWWWWWQQQQQ'+JSON.stringify(input));
try{
    var values1 = DataShapes["TRCTransactionAuditDS"].CreateValues();
    values1.primaryKey = new Date()+"_"+input.tSeq;
    values1.tSeq = input.tSeq ? input.tSeq.toString()  : ""; //STRING
    values1.transactionId = input.transactionId ? input.transactionId.toString() : "";
    values1.sourceConfig = input.sourceConfig ? input.sourceConfig : ""; //STRING
    values1.targetConfig = input.targetConfig ? input.targetConfig : ""; //STRING
    values1.mappingConfig = input.mappingConfig ? input.mappingConfig : ""; //STRING
    values1.flowDataSourceType = input.sourceType + "-" + input.targetType ? input.sourceType + "-" + input.targetType : "";
    values1.sourceTimeStamp = input.sourceTime ? input.sourceTime : ""; //DATETIME
    values1.targetTimeStamp = input.targetTime ? input.targetTime : ""; //STRING
    values1.mappingTimeStamp = input.mappingTime ? input.mappingTime : "";
    values1.status = input.status ? input.status : "";
       values1.parentTSeq = input.parentTSeq ? input.parentTSeq.toString()  : "";
    values1.sourceData = input.sourceData ? input.sourceData : ""; //DATETIME
    values1.targetData = input.targetData ? input.targetData : ""; //STRING
    values1.mappingData = input.mappingData ? input.mappingData : "";
    // Check whether same key existed in the datatable or not
     var time = new Date().getTime().toString();
    var random =(Math.random())*123456789;
    var uniqueTimeStamp = time+random.toString();
    var timestamp = new Date().getTime()+(Math.random())*123456;
    var params1 = {
        sourceType: undefined /* STRING */,
        values: values1 /* INFOTABLE*/,
        location: undefined /* LOCATION */,
        tags: undefined /* TAGS */,
        timestamp: input.TIMESTAMP ? input.TIMESTAMP : timestamp ,
        source: input.sourceConfig+uniqueTimeStamp
    };
    //    logger.warn(':::::::::::InvokeRecordDataAPIBBBBBBBBBBB:::::::::::'+JSON.stringify(params1));
    if(Things["GenericIEMasterConfig"].testApi === false){
     Things["AuditInfoStream"].AddStreamEntry(params1);
    }
}catch(e){
    var result = {error: e.message};
    logger.warn("error in InvokeRecordData service: "+e.message);
}