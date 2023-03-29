//INPUTS:	Nothing
// OUTPUTS: result(STRING)
try{
    var csvAsJson = me.JSONData;
    var params = {
        input: {"csvAsJson":csvAsJson, "delimeter": me.CSVDelimeter} /* JSON */
    };

    // result: JSON
    var result = Things["MappingConfig"].JsonToCSV(params);

    //TODO need to convert the json to csv
    //var result = csvAsJson;
}
catch(e){
    var result = {"error":e};
    logger.warn("Error in GetCSVData service");
}
