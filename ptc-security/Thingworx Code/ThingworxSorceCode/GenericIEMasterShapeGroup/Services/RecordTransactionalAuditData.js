//Inputs: input(json)
//output:
//Async: true
try{

    //logger.warn("tSeq in RecordTAD service: "+ input.tSeq);

    var values = Things["TransactionAuditTable"].CreateValues();

    values.sourceId = input.sId; //STRING
    values.targetId = input.tId; //STRING
    values.mappingTime = input.mTime; //DATETIME
    values.mccId = input.mccId ? input.mccId : (input.tId !== "" ? input.sId +"-" +input.tId : input.sId); //STRING
    values.sourceTime = input.sTime; //DATETIME
    values.targetRespTime = input.tTime; //DATETIME
    values.transactionSeq = input.tSeq; //STRING
    values.transactionId = input.transId ? input.transId : (input.tSeq + "-" +values.mccId); //STRING [Primary Key]
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   	 logger.warn("values.transactionId : "+values.transactionId);
    }
    // Check whether same key existed in the datatable or not
    try{
         var p1 = {
            key: values.transactionId /* STRING */
        };

        // result: INFOTABLE
        var findRow = Things["TransactionAuditTable"].GetDataTableEntryByKey(p1);
        findRow = findRow.ToJSON().rows;
        if(findRow.length !== 0) {
            var newTSeq = input.tSeq+1;
            values.transactionId = newTSeq + "-" +values.mccId;
            values.transactionSeq = newTSeq;
            if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            	logger.warn("New values.transactionID: "+values.transactionId);
            }
        }
    }catch(er) {
   		logger.warn("New record");
    }
    var params = {
        sourceType: undefined /* STRING */,
        values: values /* INFOTABLE*/,
        location: undefined /* LOCATION */,
        source: values.transactionId /* STRING */,
        tags: undefined /* TAGS */
    };

    // result: STRING
    var result = Things["TransactionAuditTable"].AddDataTableEntry(params);
    //logger.warn("result of add audit table : "+result);

}catch(e){
    var result={"exception":e};
    logger.warn("Exception in service RecordTransactionalAuditData : "+e);
}
