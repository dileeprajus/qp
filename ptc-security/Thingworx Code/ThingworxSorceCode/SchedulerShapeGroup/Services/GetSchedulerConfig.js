//inputs: input(JSON)
//output: result(JSON)
try{
    var configName = input.configName;
    var result = {};
    var params = {
        maxItems: 100 /* NUMBER */,
        nameMask: "" /* STRING */,
        query: "" /* QUERY */,
        thingTemplate: "SchedulerGroup" /* THINGTEMPLATENAME */,
        tags: "Applications:IE;Applications:DynamicConfig;Applications:Scheduler" /* TAGS */
    };

    // table: INFOTABLE dataShape: RootEntityList
    var table = Resources["SearchFunctions"].SearchThingsByTemplate(params);

    var obj = table.ToJSON();
    for(var i=0;i<obj.rows.length;i++){
        //loop through the object rows, and check the configName with schedulerConfig property configName, if equal then return the object
        if(configName === Things[obj.rows[i].name].configName){
        	result["Name"] = obj.rows[i].name;
            result["Description"] = obj.rows[i].description;
            result["Group"] = obj.rows[i].thingTemplate;
            result["ConfigName"] = obj.rows[i].configName;            

            // result: JSON
            var configuration = Things[obj.rows[i].name].GetConfTableJson();            
            result["CronString"] = configuration["schedule"];
            result["Enabled"] = configuration["enabled"];
            break;
        }    
    }
    result={"result":result};
}catch(e){
    var result = {"exception":e};
    logger.warn("Exception in service GetSchedulerConfig: "+e);
}
