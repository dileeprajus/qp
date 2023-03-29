//INPUTS input(JSON)
// OUTPUTS: result (INFOTABLE)
try{
    function UpdateSourcePersistentObject(input,config_name){
        var values = Things[config_name].CreateValues();
        values.primary_key_at_dataprovider = input.primary_key_at_dataprovider; 
        var params = {
            values: values /* INFOTABLE*/
        };
        // result: INFOTABLE dataShape: "undefined"
        var entries = Things[config_name].QueryDataTableEntries(params);
        
        var values = Things[config_name].CreateValues();
        values.raw_data = input.raw_data;
        values.converted_data = input.converted_data;
        values.created_at = new Date();    //DATETIME
        values.updated_at = new Date();   //DATETIME
        values.created_at_dataprovider = new Date();//input.created_at_dataprovider;    //DATETIME
        values.updated_at_dataprovider = new Date();//input.updated_at_dataprovider;    //DATETIME
    	values.primary_key_at_dataprovider = input.primary_key_at_dataprovider;    //STRING [Primary Key]
    	values.source_group_name = Things[config_name].thingTemplate;     //THINGTEMPLATENAM
        values.source_config_name = config_name;    //THINGNAME
        
        if(entries.length==0){//create new record
            var params = {
                sourceType: undefined /* STRING */,
                values: values /* INFOTABLE*/,
                location: undefined /* LOCATION */,
                source: undefined /* STRING */,
                tags: undefined /* TAGS */
        	};
       		 // result: STRING
        	Things[config_name].AddDataTableEntry(params);
        }
        else if(entries.length===1){//update record
            var params = {
                sourceType: undefined /* STRING */,
                values: values /* INFOTABLE*/,
                location: undefined /* LOCATION */,
                source: undefined /* STRING */,
                tags: undefined /* TAGS */
            };
            Things[config_name].UpdateDataTableEntry(params);
        }
        else{
          if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            logger.warn("Error in UpdateSourcePersistentObject");
          }
        }
    }
	//Save the transactional data when
    //1: source (incoming data) data is valid or not according to the source validation rules [source validation success, source validation failed]
    //2: mapping (converted data) converted data is valid or not according to the mapping rules/schema rules etc [mapping validation success, mapping validation failed]
    //3: OPTIONAL -  target (outgoing data means converted data) [target validation success, target validation failed]
    var config_name = input.config_name;
    //var pk = input.primaryKey//primary_key_at_dataprovider;
    //logger.warn("PARAMS DATA OF TABLE"+JSON.stringify(input))
    //logger.warn("thing name in recordTransactional Data"+config_name);
    var configType = "";
    if(Things[config_name].name){
    	//var tempTags = "Applications:IE;Applications:DynamicConfig;Applications:Mapping";
        // result: TAGS
        var tags_result = Things[config_name].GetTags();
        if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
        	configType = "Source";
        } else if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
        	configType = "Target";
        } else if(tags_result == "Applications:IE;Applications:DynamicConfig;Applications:Mapping"){
        	configType = "Mapping";
        } else {}
    }
    //TODO  : need to find record by primary key and update it, if it is existed and need to handle created at and updated at fields properly
    if(configType==="Source"){  
        var entries = UpdateSourcePersistentObject(input,config_name);  
    }
    else{
    if(configType==="Target"){
        var values = Things[config_name].CreateValues();

        values.id = new Date();   //DATETIME [Primary Key]
        values.raw_data = input.raw_data;    //JSON   In target Raw object refers to converted data
        values.converted_data = input.converted_data;
        values.created_at = "";    //DATETIME
        values.updated_at = "";    //DATETIME
    	values.target_group_name = Things[config_name].thingTemplate;     //THINGTEMPLATENAME
        values.target_config_name = config_name;    //THINGNAME
    }
    else{
         var values = Things[config_name].CreateValues();

    values.convertedData = input.convertedData;    //JSON
    values.configName = config_name;    //THINGNAME
    values.rawData = input.rawData;    //STRING
    values.primaryKey = input.primaryKey;    //STRING [Primary Key]
    //values.primaryKey = new Date();
    values.timestamp = new Date();    //DATETIME
	values.configType = configType;  //STRING
    values.updatedAt = input.updatedAt;  //DATETIME
    values.tag = Things[config_name].GetTags();  //TAGS
    values.groupName = Things[config_name].thingTemplate;
    }


    var params = {
        sourceType: undefined /* STRING */,
        values: values /* INFOTABLE*/,
        location: undefined /* LOCATION */,
        source: config_name /* STRING */,
        tags: undefined /* TAGS */
    };

    // result: STRING
    var add_result = Things[config_name].AddDataTableEntry(params);
    }


    var params = {
        maxItems: 500 /* NUMBER */
    };

    // result: INFOTABLE dataShape: "undefined"
    var result = Things[config_name].GetDataTableEntries(params);


}
catch(e){
    var params = {
        maxItems: 500 /* NUMBER */
    };

    // result: INFOTABLE dataShape: "undefined"
    var result = me.GetDataTableEntries(params);
    logger.warn("Exception in Record Transactional Data service:"+e);
}
