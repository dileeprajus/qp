//INPUTS input(JSON)
// OUTPUTS: result(String)
try{
    //var input = me.ConfigJson;
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn("REST Test Request Variables: "+JSON.stringify(requestVariables));
     }
//    var params = {
//        input: me.ConfigJson /* JSON */
//    };
//    // result: STRING
//    var input = Things["GenericIEMasterConfig"].ObjectStringify(params);
//    input = JSON.parse(input);
    var params = {
         input: {"configName":me.name, "configJson":me.ConfigJson} /* JSON */
     };

    // result: STRING
    var stringifyResult = me.HandleDecryption(params);
    input = JSON.parse(stringifyResult);

    var params = {
        input: input /* JSON */,
        request_variables: requestVariables /* JSON */
    };

    // result: JSON
    //input = me.OverrideRequestVariables(params);

    //input["sourceType"] = "";
    //input["external_data_payload"]=payload;
    //input["external_data_headers"]=headers;
    //input["external_data_url_params"]=url_params;


    var params = {
        input: input /* JSON */,
        request_variables:requestVariables
        
    };

    if(input.current_data_format==="JSON"){
        // result: JSON
        var result = me.TestApi(params);
        result = result["result"];
    }
    else if(input.current_data_format==="XML"){
        // result: XML
        var result = me.TestApiXML(params);
        result = result["result"];
        result = String(result)

        var params = {
            input:  result  /* STRING */,
        };
        result = Things["MappingConfig"].GetJsonFromXML(params);
    }
    else if(input.current_data_format==="CSV"){
        // result: String
        var result = me.TestApiCSV(params);
        result = result["result"];
        var params = {
            delimeter: input["csv_delimeter"],
            csv_data: result
        };
        // jsonFromCSV: JSON
        result = Things["MappingConfig"].GetJsonFromCSV(params);

    }
    else{
        var result = {};
    }
}
catch(e){
    var result ={"error":e};
}
