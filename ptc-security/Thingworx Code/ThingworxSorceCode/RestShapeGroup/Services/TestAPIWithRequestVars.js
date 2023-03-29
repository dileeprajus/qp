//Input: requestVariables(Json)
//Output: result(JSON)
try{
    var input = input;
    //me.ConfigJson;
    var result = {};
    var params = {
        input: input /* JSON */,
        request_variables: input["RequestVariables"] /* JSON */
    };

    // result: JSON
	if(input["RequestVariables"]!=undefined){
    	// result: JSON
    	input = me.OverrideRequestVariables(params);
    }    //var params = {
    //	input: input /* JSON */
    //};
    //// result: STRING
    //var kk = me.ObjectStringify(params);
    //logger.warn("JSON STRING: "+kk);
    //logger.warn("TestAPI : "+JSON.stringify(input));
    //logger.warn("TEST API HEADERS  : "+input.headers);
    var method_type = "";
    var auth_type = "";
    if(input.sourceType==="schema_"){
        method_type = input.schemafromurl_details.schema_current_method_type;
        auth_type = input.schemafromurl_details.schema_current_auth_type;
    }
    else{
        method_type = input[input.sourceType+'current_method_type'];
        auth_type = input[input.sourceType+'current_auth_type'];
    }

    //GET API
    if(method_type==="GET"){
        if(auth_type==="BasicAuth"){
            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            result = me.BasicAuthGetXML(params);
        }
        else if(auth_type==="OAuth"){

            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            var result = me.OAuthGetXML(params);
        }
        else if(auth_type==="NoAuth"){

            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            var result = me.NoAuthGetXML(params);
        }
        else{
        }
    }
    else if(method_type==="POST"){

        if(auth_type==="BasicAuth"){
            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            result = me.BasicAuthPostXML(params);
        }
        else if(auth_type==="OAuth"){

            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            var result = me.OAuthPostXML(params);
        }
        else if(auth_type==="NoAuth"){

            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            var result = me.NoAuthPostXML(params);
        }
        else{
        }

    }
    else{
        //other method types
    }

    //result = String(result);
    //result = {"XML":"XML RESPONSE"}
    //logger.warn("TEST API XML RESPONSE : "+result);
    //logger.warn("TEST API XML RESPONSE TYPE : "+typeof result);
    //logger.warn("TEST API XML RESPONSE: "+JSON.stringify(result));
    result = {"result": result};
    

}
catch(e){
    var result = {"error":e};
}
