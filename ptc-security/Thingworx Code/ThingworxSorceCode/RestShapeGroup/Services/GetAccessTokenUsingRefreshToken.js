for(var i=0;i<3;i++){
    var URL = "";
    var input = input;
    var auth_details = input[input.sourceType+'oauth_details'];
    var token_data = input[input.sourceType+'oauth_token_data'];
    URL = auth_details.auth_url+auth_details.access_token_url+"?";
    //delete input["auth_url"];
    //delete input["access_token_url"];
    //for(var key in input){
    //	URL = URL+key+"="+input[key]+"&";
    //}
    //URL=URL.replace(/\&$/, '');
    
    URL = URL+"client_id="+auth_details["client_id"]+"&client_secret="+auth_details["client_secret"]+"&grant_type=refresh_token&refresh_token="+token_data["refresh_token"];
    
    logger.warn("URL: "+URL);
    try{
    var params = {
        headers: {"Content-Type": "application/json"} /* JSON */,	
        url: URL,
    };
    // result: JSON
    var result = Resources["ContentLoaderFunctions"].PostJSON(params);
    logger.warn("GetAccessTokenUsingRefreshToken Response : "+JSON.stringify(result));
    delete result.headers;
        if(result.error!==undefined || result.error==="invalid_grant"){
            //GetAccess token using particular grant type
            var params = {
                input: input /* JSON */
            };
            // result: JSON
            var result = me.GetAccessTokenUsingAuthorizationGrantType(params);
            break;
        }
        else{
        var res = false;
        for(var key in result){ // ideally need to check status instead of response
            if(key==="access_token"){
               res = true;
               //var js =  me.ConfigJson
                 var params = {
                     input: {"configName":me.name, "configJson":me.ConfigJson} /* JSON */
                 };
    
                // result: STRING
                var stringifyResult = me.HandleDecryption(params);
                var js = JSON.parse(stringifyResult);
                js[input.sourceType+'oauth_token_data']=result;
                var params = {
                    input: {"ConfigJson":js} /* JSON */
                };
    
                // result: JSON
                var encryptedResult = me.GetEncryptedObjVal(params);
                var sp = {
                    input: encryptedResult /* JSON */
                };
    
                // result: STRING
                var strResult = me.ObjectStringify(sp);
                me.ConfigJson = JSON.parse(strResult);
                break;
            }
        }
        if(res){
            break;
        }
        //When refresh token is not working, getting accesstoken again using first api by whatever the authorization grant type is
        if(i===2 && res === false){
            //GetAccess token using particular grant type
            var params = {
                input: input /* JSON */
            };
            // result: JSON
            var result = me.GetAccessTokenUsingAuthorizationGrantType(params);
            break;
        }
        }
    }
    catch(err) {
        result = {"Exception": "API Failed"};
    }
}