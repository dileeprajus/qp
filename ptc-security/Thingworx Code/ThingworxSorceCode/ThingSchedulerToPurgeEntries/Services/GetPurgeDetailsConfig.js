//Inputs: input(JSON)
//output: result(JSON)

try{
    var result = {};
    result["Name"] =me.name;
    result["Description"] = me.description;
    result["Group"] =me.thingTemplate;
    result["schedulerType"] = me.schedulerType ? me.schedulerType: 'Days';
    result["DateDuration"] =me.dateDuration;
    var params = {
        tableName: "Settings" /* STRING */
    };

    // result: INFOTABLE dataShape: "undefined"
    var table = me.GetConfigurationTable(params);
    table = table.toJSON().rows[0];
    configuration = {"enabled":table.enabled, "schedule":table.schedule};
    result["CronString"] = configuration["schedule"];
    result["Enabled"] = configuration["enabled"];

    result={"result":result};
}catch(e){
    var result = {"exception":e};
    logger.warn("Exception in service GetPurgeDetailsConfig: "+e);
}
