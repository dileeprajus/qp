try{
    logger.warn('-------SetCronConfigurationForSchedular--------->'+input);
    var cronString = input.cronString;
    var configName = input.configName;
    var enabled = input.enabled;
    var defaultCronValue="0 0/7 * * * ?";
  
    var runAsUser = input.runAsUser ? input.runAsUser : "Administrator"; // for example value is Administrator --username
    
   
    if (configName==='ThingSchedulerToPurgeEntries'){
           defaultCronValue="0 0 0 ? * MON *";
            }
    var obj ={"rows":[{"runAsUser":runAsUser,"schedule":cronString,"enabled":enabled} ],"dataShape":{"fieldDefinitions":{"runAsUser":{"name":"runAsUser","aspects":{ },"description":"User context in which to run event handlers","baseType":"USERNAME","ordinal":0} ,"schedule":{"name":"schedule","aspects":{"defaultValue":defaultCronValue} ,"description":"Execution Schedule (Cron String)","baseType":"SCHEDULE","ordinal":0} ,"enabled":{"name":"enabled","aspects":{"defaultValue":true} ,"description":"Automatically enable scheduler on startup","baseType":"BOOLEAN","ordinal":0} }} };

    var params = {
        json: obj /* JSON */
    };

    // result: INFOTABLE
    var table = Resources["InfoTableFunctions"].FromJSON(params);


    var params = {
        configurationTable: table /* INFOTABLE */,
        persistent: true /* BOOLEAN */,
        tableName: 'Settings' /* STRING */
    };

    Things[configName].SetConfigurationTable(params);
	Things[configName].Enabled=input.enabled;
    Things[configName].schedulerType = input.schedulerType ? input.schedulerType : 'Manual';
  
    Things[configName].EnableThing();
    Things[configName].RestartThing();  
    logger.warn('-------Config Name--------->'+configName);
    logger.warn('-------Given Cron--------->'+cronString);
    
    if(configName==='ThingSchedulerToPurgeEntries'){
        Things[configName].dateDuration =input.dateDuration;
        Things[configName].schedulerType = input.schedulerType ? input.schedulerType : 'Days';
       }
    var params = {
        tableName: 'Settings' /* STRING */
    };

    // result: INFOTABLE dataShape: "undefined"
    var result = Things[configName].GetConfigurationTable(params);
}catch(e) {
    var params = {
        tableName: "Settings" /* STRING */
    };

    // result: INFOTABLE
    var result = Things["DailySchedulerConfig"].GetConfigurationTable(params);
    logger.warn("Exception in SetCronConfigurationForSchedular service is: "+e.message);
}