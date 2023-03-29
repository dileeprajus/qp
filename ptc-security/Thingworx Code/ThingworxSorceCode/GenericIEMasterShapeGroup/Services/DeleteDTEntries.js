if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
  logger.warn("input value in delete entries is"+JSON.stringify(input));
  }
  var result = {},table;
  try{
      table = input.tableName;
    if(Things[table]){
      var fromDate = input.fromDate;
      var toDate = input.toDate;
      var nowdate =  new Date().toISOString();
       result = {};
      Things["AuditInfoStream"].PurgeStreamEntries({
          endDate: toDate /* DATETIME */,
          immediate: false /* BOOLEAN */,
          startDate: fromDate /* DATETIME */
       });
      Things["LogDataStream"].PurgeStreamEntries({
          endDate: toDate /* DATETIME */,
          immediate: false /* BOOLEAN */,
          startDate: fromDate /*DATETIME */
        });
      result={"success":"Datatable entries are deleted successfully"};
   }else {
     result={"waring":"Given datatable thing is not in thingworx"};
   }
  }catch(e){
      var result={"Exception":e.message};
      logger.warn("Exception in DeleteDTEntries service:  "+e.message);
  }