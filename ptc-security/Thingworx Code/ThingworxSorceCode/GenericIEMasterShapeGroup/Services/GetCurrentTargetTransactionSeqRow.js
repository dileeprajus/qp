//INPUTs: input(JSON)
//output: result(JSON)
try{
  var target = input.name ? input.name : me.name;
  var tTime = input.tTime ? input.tTime : new Date();
  var tSeq = input.tSeq ? input.tSeq : Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum();
  //Get source and mapping time for the transaction using transaction id(tSeq + "-" + mccId)
  var q = {
    "filters": {
      "type": "AND",
      "filters": [
        {
          "fieldName": "transactionSeq",
          "type": "EQ",
          "value": tSeq
        },
        {
          "fieldName": "targetId",
          "type": "EQ",
          "value": target
        }
      ]
    }
  };
  var params = {
      maxItems: 10 /* NUMBER */,
      searchExpression: undefined /* STRING */,
      query: q /* QUERY */,
      source: undefined /* STRING */,
      tags: undefined /* TAGS */
  };
  // result: INFOTABLE
  var queryResult = Things["TransactionAuditTable"].SearchDataTableEntries(params);
  var params1 = {
      table: queryResult /* INFOTABLE */
  };
  // result: JSON
  var queryResultObj = Resources["InfoTableFunctions"].ToJSON(params1);
  var findResult = queryResultObj.rows[0];
var sId = findResult.sourceId;
var sTime = findResult.sourceTime;
  var mTime = findResult.mappingTime;
  //logger.warn("sId "+sId+ "   sTime   -----"+sTime+ "    mTime ----- "+mTime );
  var params = {
      input: {
          "sId": sId,
          "tId": target,
          "mccId": (sId+"-"+me.name),
          "mTime": mTime,
          "sTime": sTime,
          "tTime": tTime,
          "tSeq": tSeq
      } /* JSON */
  };
  // result: JSON
  var recordResult = Things["GenericIEMasterConfig"].RecordTransactionalAuditData(params);
  var result = recordResult;
}catch(e){
  var result = {"exception": e};
  logger.warn("Exception in service GetCurrentTargetTransactionSeqRow: "+e);
}
