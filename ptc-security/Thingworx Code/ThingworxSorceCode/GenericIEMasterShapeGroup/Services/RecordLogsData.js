//Inputs:thingName: configName(THINGNAME),errorORInfo(JSON),updatedAt: updatedAt(DATETIME),tag: (TAGS),primaryKey:(STRING)
//Output: Infotable

try{
    var configName = configName;
    var groupName = Things[configName].thingTemplate;
    var ID = primaryKey;
    var transactionID = primaryKey;
    var success = Things[configName].success;
    var failure = Things[configName].failure;
    var groupType = "source";
    var tags_result = Things[configName].GetTags();
	var result;
    if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
        groupType = "source";
    } else if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
        groupType = "target";
    } else if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Mapping"){
        groupType = "mapping";
    } else {}
    
   if((success===0)&&(failure===0)) {
	// Values: INFOTABLE dataShape: ""
		var newRow =  DataShapes["TransactionMetricDS"].CreateValues();
       newRow.configName = configName;
       newRow.groupName = groupName;
       newRow.groupType = groupType;
       newRow.ID = ID;
       newRow.transactionID = transactionID;
        if(tag == "IELogs:Info") {
           success = success+1;
        	failure = failure;
        } else if(tag == "IELogs:Warning" || tag == "IELogs:Error") {
        	success = success;
        	failure = failure+1;
        } else {
        	success = success;
        	failure = failure;
        }
       Things[configName].success = success;
       Things[configName].failure = failure;
       newRow.success = Things[configName].success;
       newRow.failure = Things[configName].failure;
   		// id: STRING
        var id =  Things["RecordMetricsDataStream"].AddStreamEntry({
           sourceType: undefined /* STRING */,
            values: newRow /* INFOTABLE */,
            location: undefined /* LOCATION */,
            source:  configName/* STRING */,
            tags: undefined /* TAGS */
        });
        result = {"success":Things[configName].success,"failure":Things[configName].failure};
  }else {
       if(tag == "IELogs:Info") {
           success = success+1;
        	failure = failure;
        } else if(tag == "IELogs:Warning" || tag == "IELogs:Error") {
        	success = success;
        	failure = failure+1;
        } else {
        	success = success;
        	failure = failure;
        }
       Things[configName].success = success;
       Things[configName].failure = failure;
      result = {"success":Things[configName].success,"failure":Things[configName].failure};
    
}   
}catch(e){
    logger.warn('Exception in Record logs table'+e.message);
}
