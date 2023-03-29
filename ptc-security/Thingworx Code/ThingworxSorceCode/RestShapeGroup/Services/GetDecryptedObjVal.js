try{
    var configJson = input["ConfigJson"];
    var authType = configJson['current_auth_type'];
    var inputVal = '';
    var authKey = "";
    var result = configJson;
    //logger.warn("GetDecryptedObjVal input: "+input);
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
    if (authType !== 'NoAuth' && authType !== '') {

        var pp = {
            input: inputVal /* STRING */
        };

        // result: JSON
        var parserResult = me.CustomJsonParser(pp);
        if(parserResult["exception"]) { //means inputVal is not json object 
            var params = {
                input: {"value": inputVal}         /* JSON */
            };

            // result: STRING
            var decryptedResult = me.GetDecryptedValue(params);
            if(decryptedResult !== ""){
              configJson[authKey] = JSON.parse(decryptedResult);
            }
        } else {        	 
        }

       
        result = configJson;
    }
}
catch(e){
    var result ={"Exception":e};
    logger.warn("Exception in service GetDecryptedObjVal: "+e);
}