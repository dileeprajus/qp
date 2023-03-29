logger.warn('RestInputObj+++'+JSON.stringify(input));
logger.warn('InitialRequestVariables+++'+JSON.stringify(Things[input.configName].ConfigJson));
try {
    var configJson = JSON.parse(JSON.stringify(Things[input.configName].ConfigJson));
    
     var params = {
         input: {"configName":Things[input.configName].name, "configJson":configJson} /* JSON */
     };

    // result: STRING
    var stringifyResult = Things[input.configName].HandleDecryption(params);
    configJson = JSON.parse(stringifyResult);
    var reqVar = configJson.RequestVariables;
    logger.warn('SecondaryRequestVariables+++'+JSON.stringify(Things[input.configName].ConfigJson.RequestVariables)+' gap '+JSON.stringify(configJson.RequestVariables));
    var tempRequestVariables = {};
    tempRequestVariables = reqVar;
 //   tempRequestVariables = RequestVariables;
    if(tempRequestVariables !== undefined) {
        tempRequestVariables = input.requestVariables;
    }
    logger.warn('RequestVariables+++++'+JSON.stringify(configJson.RequestVariables)+JSON.stringify(tempRequestVariables));
//    if(tempRequestVariables !== undefined) {
//         logger.warn('++++++1+++++'+JSON.stringify(tempRequestVariables)+JSON.stringify(input.requestVariables));
//        if(input.requestVariables !== undefined) {
//           logger.warn('+++++++2++++'+JSON.stringify(tempRequestVariables)+JSON.stringify(input.requestVariables));
//        for(var key1 in tempRequestVariables){ 
//           for(var key2 in input.requestVariables) {
//               if(key1 === key2) {
//                    logger.warn('+++++++3++++'+key1+key2);
//               tempRequestVariables[key2] = input.requestVariables[key2];
//               }
//           }
//       }
//     }
//    }
  logger.warn('Temp RequestVariables+++++'+JSON.stringify(configJson.RequestVariables)+JSON.stringify(tempRequestVariables));
    
     var objStringifyParams = {
        input: configJson /* JSON */
    };
    // result: STRING
    var tempConfigJson = Things["GenericIEMasterConfig"].ObjectStringify(objStringifyParams);
    configJson = JSON.parse(tempConfigJson);
    if(configJson['current_auth_type']==='CustomAuth'){
        var CustomAuthparams = {
            input: configJson["customAuthDetails"] /* JSON */
        };
        // result: JSON
        var custom_auth_response = Things[input.configName].ExecuteCustomAuth(CustomAuthparams);
        //**********Executing script in CustomAuth
            var tar_config = configJson["customAuthDetails"];
            var rules = [];
        	var script_output = {};
            if(tar_config["TransformationRules"] && tar_config["TransformationRules"].length>0){
                rules = tar_config["TransformationRules"];
                var customPs = {
                    input: {"value": custom_auth_response} /* JSON */,
                    sample_script: {"script_array": rules[0]["script"]} /* JSON */ //As allowing only one script in CustomAuth
            	};
                script_output = Things["GenericIEMasterConfig"].TestScript(customPs);
                script_output = script_output.value;
            }
          //****************************************************
            for(var key in script_output){ //replacing values from script_output RVs
                tempRequestVariables[key] = script_output[key];
            }
    }
    var OverRideReqVarParams = {
            input: configJson /* JSON */,
            request_variables: tempRequestVariables /* JSON */
        };
        // result: JSON
     configJson = Things[input.configName].OverrideRequestVariables(OverRideReqVarParams);
        var method_type = "";
        var auth_type = "";
        if(configJson.sourceType==="schema_") {
            method_type = configJson.schemafromurl_details.schema_current_method_type;
            auth_type = configJson.schemafromurl_details.schema_current_auth_type;
        }else{
            method_type = configJson[configJson.sourceType+'current_method_type'];
            auth_type = configJson[configJson.sourceType+'current_auth_type'];
        }
   
    logger.warn('+++++++++++Rest++++++++++++++'+JSON.stringify(configJson));
    //***************Oauth2***********************
    if(auth_type==="OAuth2.0" && input['oauth_details']['grant_type']==="authorization_code"){
        var authParams = {
            input: configJson /* JSON */
        };
        // result: JSON
        var auth_code = Things[input.configName].GetAuthorizationCode(authParams);
        configJson['oauth_details']['code'] = auth_code.code;
    }
    var result = {};
     if(method_type==="GET"){
        if(auth_type==="BasicAuth"){
            var BasicAuthGetParams = {
                input: configJson /* JSON */,
                type: 'FileTransfer'
            };
            // result: JSON
            result = Things[input.configName].BasicAuthGet(BasicAuthGetParams);
            logger.warn('testBasicAuthResponse++++++++++++'+JSON.stringify(result));
        }
        else if(auth_type==="OAuth2.0"){

            var OAuthGetParams = {
                input: configJson /* JSON */,
                type: 'FileTransfer'
            };
            // result: JSON
            result = Things[input.configName].OAuthGet(OAuthGetParams);
             logger.warn('testOAuthGetResponse++++++++++++'+JSON.stringify(result));
        }
        else if(auth_type==="NoAuth" || auth_type==="CustomAuth"){

            var NoAuthGetParams = {
                input: configJson /* JSON */,
                type: 'FileTransfer'
            };
            // result: JSON
            result = Things[input.configName].NoAuthGet(NoAuthGetParams);
             logger.warn('testNoORCustomAuthResponse++++++++++++'+JSON.stringify(result));
        }
        else{
        }
    }
    else if(method_type==="POST"){

        if(auth_type==="BasicAuth"){
            var BasicAuthPostParams = {
                input: configJson /* JSON */,
                type: 'FileTransfer'
            };
            // result: JSON
            result = Things[input.configName].BasicAuthPost(BasicAuthPostParams);
             logger.warn('testBasicAuthResponse++++++++++++'+JSON.stringify(result));
        }
        else if(auth_type==="OAuth"){

            var OAuthPostParams = {
                input: configJson /* JSON */,
                type: 'FileTransfer'
            };
            // result: JSON
            result = Things[input.configName].OAuthPost(OAuthPostParams);
            logger.warn('testOAuthResponse++++++++++++'+JSON.stringify(result));
        }
        else if(auth_type==="NoAuth" || auth_type==="CustomAuth"){
          logger.warn('NoAuthData'+JSON.stringify(configJson))
            var NoAuthPostParams = {
                input: configJson /* JSON */,
                type: 'FileTransfer'
            };
            // result: JSON
            result = Things[input.configName].NoAuthPost(params);
             logger.warn('NoAuthPostParams++++++++++++'+JSON.stringify(result));
        }
        else{
        }

    }
    else if(method_type==="PUT"){

        if(auth_type==="BasicAuth"){
            var BasicAuthPutParams = {
                input: configJson /* JSON */,
                type: 'FileTransfer'
            };
            // result: JSON
            result = Things[input.configName].BasicAuthPut(params);
            logger.warn('BasicAuthPut++++++++++++'+JSON.stringify(result));
        }
        else if(auth_type==="OAuth"){

            var OAuthPutParams = {
                input: configJson /* JSON */,
                type: 'FileTransfer'
            };
            // result: JSON
            result = Things[input.configName].OAuthPut(params);
        }
        else if(auth_type==="NoAuth"|| auth_type==="CustomAuth"){

            var NoAuthPutParams = {
                input: configJson /* JSON */,
                type: 'FileTransfer'
            };
            // result: JSON
            result = Things[input.configName].NoAuthPut(params);
        }
        else{
        }

    }
    else{
        //other method types
    }
    result = {"D":"D"};
}catch(e) {
logger.warn('Error in GetRestFileTransferObject'+e);
}