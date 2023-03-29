//INPUTS input(JSON)
//OUTPUT: result(JSON)

try{
  var transactionMT = Things["GenericIEMasterConfig"].TransactionMetricTable;
  var configName = input.configName;
  var groupName = input.groupName;
  var ID = input.ID;
  var transactionID = ID;
  var tag = input.tag;
  var success = 0;
  var failure = 0;
  var groupType = "source";
  var tags_result = Things[configName].GetTags();

  if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
      groupType = "source";
  } else if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
      groupType = "target";
  } else if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Mapping"){
      groupType = "mapping";
  } else {}
  var query = {
    "filters": {
      "type": "AND",
      "filters": [
        {
          "fieldName": "configName",
          "type": "EQ",
          "value": configName
        },
        {
          "fieldName": "groupName",
          "type": "EQ",
          "value": groupName
        },
        {
          "fieldName": "groupType",
          "type": "EQ",
          "value": groupType
        }
      ]
    }
  };// end of query

  var params = {
      t: transactionMT /* INFOTABLE */,
      query: query /* QUERY */
  };

  // result: INFOTABLE
  var queryResult = Resources["InfoTableFunctions"].Query(params);
var result = queryResult;
  if(queryResult.rows.length === 0){ //add mew row for current config
      var newRow = new Object();
      newRow.configName = configName;
      newRow.groupName = groupName;
      newRow.groupType = groupType;
      newRow.ID = ID;
      newRow.transactionID = transactionID;
      if(tag == "IELogs:Info") {
          newRow.success = success+1;
        newRow.failure = failure;
      } else if(tag == "IELogs:Warning" || tag == "IELogs:Error") {
        newRow.success = success;
        newRow.failure = failure+1;
      } else {
        newRow.success = success;
        newRow.failure = failure;
      }
      transactionMT.AddRow(newRow);
      var result = transactionMT;

  }else{ //configName already exists in infotable so update the success and failure columns values
      //success = queryResult.success + 1; //add one more value to it
      //failure = queryResult.failure + 1; //add one more value to it
      queryResult.success = success;
      queryResult.failure = failure;
      
      var tableLength = transactionMT.rows.length;
  var index = 0;
      for (var x = 0; x < tableLength; x++) {
          var row = transactionMT.rows[x];
          if(row.configName === configName && row.groupName === groupName && row.groupType === groupType){
            index = x;
              success = row.success;
              failure = row.failure;
              break;
          }
          //Your code here
      }
      transactionMT.RemoveRow(index);        
      var newRow1 = new Object();
      newRow1.configName = queryResult.configName;
      newRow1.groupName = queryResult.groupName;
      newRow1.groupType = queryResult.groupType;
      newRow1.ID = queryResult.ID;
      newRow1.transactionID = queryResult.transactionID;
      if(tag == "IELogs:Info") {
          newRow1.success = success+1;
        newRow1.failure = failure;
      } else if(tag == "IELogs:Warning" || tag == "IELogs:Error") {
        newRow1.success = success;
        newRow1.failure = failure+1;
      } else {
        newRow1.success = success;
        newRow1.failure = failure;
      }
      
//        var row = transactionMT.Find(newRow1);
//		row.success = success;        
//		row.failure = failure;
      transactionMT.AddRow(newRow1);
      Things["GenericIEMasterConfig"].TransactionMetricTable = transactionMT;
//        var params = {
//            t: transactionMT /* INFOTABLE */,
//            query: query /* QUERY */,
//            values: queryResult /* INFOTABLE */
//        };
//
//        // result: INFOTABLE
//        var updateResult = Resources["InfoTableFunctions"].UpdateQuery(params);  
      var result = transactionMT;
  }
 Things["GenericIEMasterConfig"].TransactionMetricTable = transactionMT;
  
}catch(e){
  var result = Things["GenericIEMasterConfig"].TransactionMetricTable;
  logger.warn("Exception in RecordTransactionMetrics service: "+e);
} 
