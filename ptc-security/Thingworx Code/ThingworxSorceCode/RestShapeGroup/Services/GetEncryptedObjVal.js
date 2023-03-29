//Inputs: input(JSON)
//output: result(JSON)
try{
    var configJson = input["ConfigJson"];
    var authType = configJson['current_auth_type'];
    var inputVal = '';
    var authKey = "";
    var result = configJson;
    if (authType === "BasicAuth") {
        inputVal = configJson["basic_auth_details"];
        authKey = "basic_auth_details";
    }
    else if (authType === "OAuth") {
        inputVal = configJson["oauth_details"];
        authKey = "oauth_details";
    }
    else if (authType === "CustomAuth") {
        inputVal = configJson["customAuthDetails"];
        authKey = "customAuthDetails";
    }
    else {
        //no auth

    }
    if (authType !== 'NoAuth' && authType !== "") {
        var params = {
            input: {"value": inputVal}
            /* JSON */
        };

        // result: STRING
        var encryptedResult = me.GetEncryptedValue(params);
        if(encryptedResult !== ""){
        	configJson[authKey] = encryptedResult;
        }
        //logger.warn("after Encryption config json is: "+configJson);
        //me.ConfigJson = configJson;
        result =configJson;
    }
}
catch(e){
    var result ={"Exception":e};
    logger.warn("Exception in service GetEncryptedObjVal: "+e);
}
