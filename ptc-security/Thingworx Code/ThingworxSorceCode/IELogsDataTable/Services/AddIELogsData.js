//Inputs: primaryKey(string),updatedAt(DateTime),configName(ThingName),tag(TAGS),errorORInfo(JSON)
//Output: INFOTABLE
try{
	//Save the transactional logs data when
    logger.warn("config name in AddIELogsData"+configName);
    logger.warn("input primarykey: "+primaryKey);
    var configType = "";
    if(Things[configName].name){
    	//var tempTags = "Applications:IE;Applications:DynamicConfig;Applications:Mapping";
        // result: TAGS
        var tags_result = Things[configName].GetTags();
        logger.warn("Tag_result:::::::::::::::::"+tags_result);
        if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
        	configType = "Source";
        } else if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
        	configType = "Target";
        } else if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Mapping"){
        	configType = "Mapping";
        } else {}
    }
    var values = me.CreateValues();

    values.configName = configName;    //configName
    values.errorORInfo = errorORInfo;    //JSON
    values.timeStamp = new Date();    //DATETIME [Primary Key]
	values.configType = configType;   //STRING
    values.tag = tag;   //TAGS
    values.updatedAt = updatedAt;   //DATETIME
    values.groupName = Things[configName].thingTemplate;
    if(primaryKey){
    	values.primaryKey = primaryKey;  //STRING
    } else values.primaryKey = new Date();  //STRING

    var params = {
        sourceType: undefined /* STRING */,
        values: values /* INFOTABLE*/,
        location: undefined /* LOCATION */,
        source: configName /* STRING */,
        tags: undefined /* TAGS */
    };

    // result: STRING
    //var add_result = Things["IELogsDataTable"].AddDataTableEntry(params);

	var add_result = me.AddDataTableEntry(params);
    var params = {
        maxItems: 500 /* NUMBER */
    };

    // result: INFOTABLE dataShape: "undefined"
    var result = me.GetDataTableEntries(params);


}
catch(e){
    var params = {
        maxItems: 500 /* NUMBER */
    };

    // result: INFOTABLE dataShape: "undefined"
    var result = me.GetDataTableEntries(params);
    logger.warn("Exception in AddIELogsData service:"+e);
}
