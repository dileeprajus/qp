try{
    var temp_data;
    var data = input.dataContent;
    logger.warn("input data in teststaticdata"+data);
    var csvDelimeter = input.csvDelimeter;
    var dataFormat = input.dataFormat;
    if(data !== ""){
        if(dataFormat==="JSON"){
            temp_data = JSON.parse(data);
            var params = {
                input: temp_data /* JSON */
            };

            // result: STRING

        }
        else if(dataFormat==="XML"){
            var params = {
                InputXML: data /* STRING */
            };

            // result: JSON
            var jsonFromXml = me.XMLToJson(params);
            logger.warn("jsonfromxml result"+JSON.stringify(jsonFromXml));
            temp_data = jsonFromXml;
            //store the data of xml in json format
        }
        else if(dataFormat==="CSV"){
            var params = {
                delimeter: csvDelimeter /* STRING */,
                csv_data: data /* STRING */
            };

            // jsonFromCSV: JSON
            var jsonFromCSV = Things["MappingConfig"].GetJsonFromCSV(params);
            temp_data = jsonFromCSV;
        }
        else{
        }
        if(data === ""||data===undefined || data === null) {
            temp_data = {};
        }
        var params = {
            input: temp_data /* JSON */,
            draft_type: "3" /* INTEGER */
        };

        // result: JSON
        var tempSchema = Things["MappingConfig"].GetSchemaFromJson(params);
        //Save the schema in schema property
        if(tempSchema['schema']!==undefined){
            tempSchema = tempSchema['schema'];
        }
        else{
            tempSchema = tempSchema;
        }
        //logger.warn("TempSchema aaa"+JSON.stringify(tempSchema));

        var params = {
            input: tempSchema /* JSON */
        };

        // result: BOOLEAN
        var isValidSchema = me.isSchemaValid(params);
    }
    else{
        temp_data = "";
        tempSchema = {};
    }
    var result = {"JSONData":temp_data, "SchemaFromData":tempSchema};
}
catch(e){
    var result = {"error":{"message":"please select correct data type","status":"fail","statusCode":"400"}};
    logger.warn("Exception in TestStaticData service: "+e.message);
}