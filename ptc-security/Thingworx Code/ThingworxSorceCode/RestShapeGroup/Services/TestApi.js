//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
try{
    //var input = input; //me.ConfigJson;
    //var input = me.ConfigJson;
    logger.warn('++++Test++++++'+request_variables)
    var masterObj = "";
    if(input["master_obj"]){
        if(input["master_obj"] !== ""){
        	masterObj = input["master_obj"];
        }
    }	
    var params = {
        input: input /* JSON */
    };
    // result: STRING
    var input = Things["GenericIEMasterConfig"].ObjectStringify(params);
    input = JSON.parse(input);


//    var params = {
//        input: input /* JSON */,
//        request_variables: input["RequestVariables"] /* JSON */
//    };
//
//    // result: JSON
//    input = me.OverrideRequestVariables(params);
    
    
    
     if(input['current_auth_type']==='CustomAuth'){ //Getting varialbes from customauth script and merging input variables also with them to form final RV's Json
        var params = {
            input: input["customAuthDetails"] /* JSON */
        };
        // result: JSON
        var custom_auth_response = me.ExecuteCustomAuth(params);
        //**********Executing script in CustomAuth
            var tar_config = input["customAuthDetails"];
            var rules = [];
            if(tar_config["TransformationRules"] && tar_config["TransformationRules"].length>0){
                rules = tar_config["TransformationRules"];
                var ps = {
                    input: {"value": custom_auth_response} /* JSON */,
                    sample_script: {"script_array": rules[0]["script"]} /* JSON */ //As allowing only one script in CustomAuth
            	};
            var script_output = Things["GenericIEMasterConfig"].TestScript(ps);
                script_output = script_output.value;
            }
          //****************************************************
            for(var key in script_output){ //replacing values from script_output RVs
                request_variables[key]=script_output[key];
            }
    }
    else{}
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
  	  logger.warn("CustomAuth RVS : "+JSON.stringify(request_variables))
    }
    var params = {
            input: input /* JSON */,
            request_variables: request_variables /* JSON */
        };
        // result: JSON
    input = me.OverrideRequestVariables(params);
     if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
		 logger.warn("Data After Rest OverrideRequestVariables : "+JSON.stringify(input))
     }
    var result = {
    };
    //var params = {
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
    
    //***************Oauth2***********************
    if(auth_type==="OAuth2.0" && input['oauth_details']['grant_type']==="authorization_code"){
        var params = {
            input: input /* JSON */
        };
        // result: JSON
        var auth_code = me.GetAuthorizationCode(params);
        input['oauth_details']['code'] = auth_code.code
    }
    //***************Oauth2***********************

    //GET API
    if(method_type==="GET"){
        if(auth_type==="BasicAuth"){
            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            result = me.BasicAuthGet(params);
        }
        else if(auth_type==="OAuth2.0"){

            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            var result = me.OAuthGet(params);
        }
        else if(auth_type==="NoAuth" || auth_type==="CustomAuth"){

            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            var result = me.NoAuthGet(params);
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
            result = me.BasicAuthPost(params);
        }
        else if(auth_type==="OAuth"){

            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            var result = me.OAuthPost(params);
        }
        else if(auth_type==="NoAuth" || auth_type==="CustomAuth"){

            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            var result = me.NoAuthPost(params);
        }
        else{
        }

    }
    else if(method_type==="PUT"){

        if(auth_type==="BasicAuth"){
            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            result = me.BasicAuthPut(params);
        }
        else if(auth_type==="OAuth"){

            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            var result = me.OAuthPut(params);
        }
        else if(auth_type==="NoAuth" || auth_type==="CustomAuth"){

            var params = {
                input: input /* JSON */,
            };
            // result: JSON
            var result = me.NoAuthPut(params);
        }
        else{
        }

    }
    else{
        //other method types
    }
    var obj = {};
    if(masterObj !==""){
       obj[masterObj] = result;
       result = {"result":obj};
    } else {
        result = {"result":result};
    }
    //logger.warn("type of result: "+typeof result+" TEST API response: "+JSON.stringify(result));   
}
catch(e){
    var result = {"error":e};
    logger.warn("Exception in TestApi service: "+e);
}