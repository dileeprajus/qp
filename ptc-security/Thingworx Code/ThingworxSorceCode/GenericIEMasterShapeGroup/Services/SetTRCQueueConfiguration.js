try{
    //{"configName":"ThingSchedulerToInvokeSourceQueue","cronString":"0/40 * * * * ? *","scheduarEnabled":false,"RequestCount":"40","status":"PostData"}
   if(input.status === 'PostData') {
    var cronString = input.cronString;
    var configName = input.configName;
    var enabled = input.scheduarEnabled;
    var runAsUser = "Administrator";
    me.RequestCount = input.RequestCount;
    me.SleepTime = input.SleepTime;
   if(input.RequestCount) {
       //me.SchedularStreamCount = input.RequestCount;
       Things["SourceQueueStreams"].SchedularStreamCount = input.RequestCount;
    }
    if(input.SleepTime) {
       Things["SourceQueueStreams"].SleepTime = input.SleepTime;
    }
    if(input.cronString){
    Things["SourceQueueStreams"].cronString = input.cronString;
    }
    var obj = {"rows":[{"runAsUser":runAsUser,"schedule":cronString,"enabled":enabled} ],"dataShape":{"fieldDefinitions":{"runAsUser":{"name":"runAsUser","aspects":{ },"description":"User context in which to run event handlers","baseType":"USERNAME","ordinal":0} ,"schedule":{"name":"schedule","aspects":{"defaultValue":"0 0/7 * * * ?"} ,"description":"Execution Schedule (Cron String)","baseType":"SCHEDULE","ordinal":0} ,"enabled":{"name":"enabled","aspects":{"defaultValue":true} ,"description":"Automatically enable scheduler on startup","baseType":"BOOLEAN","ordinal":0} }} };
      // result: INFOTABLE dataShape: ""
    var table =  Resources["InfoTableFunctions"].FromJSON({
        json: obj /* JSON */
    });
   var params = {
        configurationTable: table /* INFOTABLE */,
        persistent: true /* BOOLEAN */,
        tableName: 'Settings' /* STRING */
    };

    Things["ThingSchedulerToInvokeSourceQueue"].SetConfigurationTable(params);
	 Things["ThingSchedulerToInvokeSourceQueue"].Enabled= enabled;
     //Things[configName].RestartThing();
    //To remove mappings List from getMappingConfigsData propery to update new mappings when any new config created
    Things['GenericIEMasterConfig'].getMappingConfigsData = {};
   }
      var params = {
        tableName: 'Settings' /* STRING */
    };

    // result: INFOTABLE dataShape: "undefined"
    var result = Things["ThingSchedulerToInvokeSourceQueue"].GetConfigurationTable(params);
}catch(e){
	logger.warn('error in set TRC Queue configuration'+e.message);
}