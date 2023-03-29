//INPUTS:   data_format(String), delimeter(string), data(String)
// OUTPUTS: result(JSON)

try{
    var temp_data;
    //me.canBeUsable = false;
    if(data_format==="JSON"){
        temp_data = JSON.parse(data);
        var params = {
            input: temp_data /* JSON */
        };

        // result: STRING

    }else if(data_format==="XML"){
        var params = {
            //input: data /* STRING */
            InputXML: data /* STRING */
        };

        // result: JSON
        var jsonFromXml = me.XMLToJson(params);
        temp_data = jsonFromXml;  //store the data of xml in json format
    }else if(data_format==="CSV"){
        var params = {
            delimeter: delimeter /* STRING */,
            csv_data: data /* STRING */
        };

        // jsonFromCSV: JSON
        var jsonFromCSV = Things["MappingConfig"].GetJsonFromCSV(params);
        temp_data = jsonFromCSV;
    }else{
    }
    //logger.warn("TEMP DATA:::::"+temp_data);
    if(data === ""||data===undefined || data === null) {
        temp_data = {};
    }
	me.JSONData = temp_data;
    
	//Update the schema from updated jsonData
    var params = {
        input: temp_data /* JSON */,
        draft_type: "3" /* INTEGER */
    };

    // result: JSON
    var tempSchema = Things["MappingConfig"].GetSchemaFromJson(params); //Save the schema in schema property
    if(tempSchema['schema']!==undefined){
        tempSchema = tempSchema['schema'];
    }
    else{
        tempSchema = tempSchema;
    }
    if(me.tags == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
        me.outputSchema = tempSchema;
    }
    if(me.tags == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
        me.inputSchema = tempSchema;
    }
    

    var params = {
        input: tempSchema /* JSON */
    };

    // result: BOOLEAN
    var isValidSchema = me.isSchemaValid(params);

    if(isValidSchema){
      me.canBeUsable = true;
    } else {
      me.canBeUsable = false;
    }
    
    var result = temp_data;
}catch(e){
    logger.warn("Error in UpdateJsonDataProp Service: "+e);
    var result =  me.JSONData;
}
