//INPUT  input= {}
//OUTPUT  result= {}

try{
    var temp_data;
    var data = input.fileData;
    if(data !== ""){
        if(input.fileType==="JSON"){
            temp_data = JSON.parse(data);
            var params = {
                input: temp_data /* JSON */
            };
            // result: STRING
        }else if(input.fileType==="XML"){
            var params = {
                InputXML: data /* STRING */
            };
            // result: JSON
            var jsonFromXml = me.XMLToJson(params);
            temp_data = jsonFromXml;
            //store the data of xml in json format
        }
        else if(input.fileType==="CSV"){
            var params = {
                delimeter: input.csvDelimeter /* STRING */,
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
    var result = {"error":e.message};
    logger.warn("Exception in TestGooglePubSubData service: "+e.message);
}