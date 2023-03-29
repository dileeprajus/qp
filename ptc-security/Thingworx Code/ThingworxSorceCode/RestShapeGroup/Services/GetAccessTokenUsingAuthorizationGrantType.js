//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)

logger.warn("Input: "+input);
var totalInput = input
input = input["oauth_details"]
if(input.grant_type==='authorization_code'){
    if(input.auth_code_type==='Dynamic' && (input.code==='' || input.code===null || input.code===undefined) ){      
		var params = {
			input: totalInput /* JSON */
		};
		// result: JSON
		var res = me.GetAuthorizationCode(params);
        input.code = res.code
    }
}
function fetchAccessToken(input){
    var URL = "";
    var input = input;
    URL = input.auth_url+input.access_token_url+"?";
//    delete input["auth_url"];
//    delete input["access_token_url"];
//    delete input["auth_code_type"];
//    delete input["AuthorizationCodeGrant"];
    var exclude_arr = ["auth_url","access_token_url","auth_code_type","AuthorizationCodeGrant"]
    for(var key in input){
        if(input[key]!=="" && exclude_arr.indexOf(key)===-1){
            URL = URL+key+"="+input[key]+"&";
        }
    }
    URL=URL.replace(/\&$/, '');
    logger.warn("URL: "+URL);
    var params = {
        headers: {"Content-Type": "application/json"}
        /* JSON */,	
        url: URL,
    };
    // result: JSON
    var result = Resources["ContentLoaderFunctions"].PostJSON(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
	    logger.warn("GetAccessTokenUsingAuthorizationGrantType Response : "+JSON.stringify(result));
     }
    delete result.headers;
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
            js['oauth_token_data']=result;
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
    return {"res":res,"result":result}
}
try{
    var result = fetchAccessToken(input)
    //if auth code is expired or corrupted get new authcode again and try the accesstoken using that
    if(result.res===false && result.result.error==="invalid_grant"){
        totalInput["oauth_details"]["code"] = "";
        var params = {
			input: totalInput /* JSON */
		};
		// result: JSON
		var res = me.GetAuthorizationCode(params);
          if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            logger.warn("GetAuthorizationCode Response in GrantType"+JSON.stringify(res))
          }
        totalInput["oauth_details"]["code"] = res.code
        result = fetchAccessToken(totalInput["oauth_details"])
    }
    result = result.result;
}
catch(err) {
    result = {"Exception": "API Failed"};
}