//INPUTS:	Nothing
// OUTPUTS: result(JSON)
try{
    var result = {};
    var config_arr = [];
    var params = {
        maxItems: 100 /* NUMBER */,
        nameMask: "" /* STRING */,
        query: "" /* QUERY */,
        thingTemplate: "SchedulerGroup" /* THINGTEMPLATENAME */,
        tags: "Applications:IE;Applications:StaticConfig" /* TAGS */
    };

    // table: INFOTABLE dataShape: RootEntityList
    var table = Resources["SearchFunctions"].SearchThingsByTemplate(params);

    var obj = table.ToJSON();
    for(var i=0;i<obj.rows.length;i++){
        //loop through the object rows, get the config name,description and configJson property in jsonObj and push that object to thing_arr
        var jsonObj = {};
        jsonObj["Name"] = obj.rows[i].name;
        jsonObj["Description"] = obj.rows[i].description;
        jsonObj["Group"] = obj.rows[i].thingTemplate;
        jsonObj["ConfigNames"] = obj.rows[i].configNames;
        config_arr.push(jsonObj);
    }

    result = {"Configs":config_arr};
    //logger.warn("Result for GetAllConfigs service:"+result);
}
catch(e){
    var result = {};
    logger.warn("Exceptiton in GetAllConfigs service:"+e);
}
