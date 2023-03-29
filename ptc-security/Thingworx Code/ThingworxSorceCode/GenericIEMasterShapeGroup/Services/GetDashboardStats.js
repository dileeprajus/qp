try{
    var obj = {
      "transactions": 'N/A',
      "averageTransactionTime": 0,
      "clients": 18,
      "mappings": 90,
      "totalSuccess": 'N/A',
      "totalFailures": 'N/A',
        "schedularCount":0,
        "streamCount":0,
        "recordCount":0,
        "Frequency":0,
        "schedulerStatus":''
    };
    var streamCount = Things["SourceQueueStreams"].GetStreamEntryCount();
    var schedularCount = Things["SourceQueueStreams"].schedularCount;
    var params = {
        tableName: 'Settings' /* STRING */
    };
    var result1 = Things["ThingSchedulerToInvokeSourceQueue"].GetConfigurationTable(params);
    var Frequency = result1.ToJSON().rows[0].schedule.split(' ')[0].replace('0/','');
    var schedulerStatus = result1.ToJSON().rows[0].enabled;
    if(schedulerStatus === true){
    schedulerStatus = 'Active';
    }
    else{
    schedulerStatus = 'Inactive';
    }
    var recordCount = me.RequestCount;
    var mapping_configs = {"Configs":[]};
    var client_configs = {"Configs":[]};
    var mapping_tags = "Applications:IE;Applications:DynamicConfig;Applications:Mapping";
    var client_tags = "Applications:IE;Applications:DynamicConfig;Applications:Target";
    function getConfigsByTags(temp_tags){
    	 var params = {
            tags: temp_tags /* TAGS */
        };

        // result: JSON
        var config_result = me.GetConfigsByTags(params);
        return config_result["Configs"];
    }
   	mapping_configs["Configs"] = getConfigsByTags(mapping_tags);
    client_configs["Configs"] = getConfigsByTags(client_tags);
	obj["mappings"] = mapping_configs.Configs.length;
    obj["clients"] = client_configs.Configs.length;
    obj["streamCount"] = streamCount;
    obj["schedularCount"] = schedularCount;
    obj["Frequency"] = Frequency;
    obj["recordCount"] = recordCount;
    obj["schedulerStatus"] = schedulerStatus;
    var result = {"result":obj};

}catch(e){
    var result = {};
}