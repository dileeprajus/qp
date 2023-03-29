//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)

//While getting the token
//{"error_description":"Invalid authorization code","error":"invalid_grant"}
logger.warn("GetAuthorizationCode Input"+JSON.stringify(input))
var code = input["oauth_details"]["code"]
var result = {'code': code}
if(code==="" || code===null || code===undefined){
    var params = {
        input: input["oauth_details"]["AuthorizationCodeGrant"] /* JSON */
    };
    // result: JSON
    result = me.GetAuthCodeFromExternalAPI(params);
    //Execute script here to get auth code from the response
    //**********Executing script in Oauth2-AuthorizationCode Grant*****************
    var oauth_config = input["oauth_details"]["AuthorizationCodeGrant"];
    var rules = [];
    if(oauth_config["TransformationRules"] && oauth_config["TransformationRules"].length>0){
        rules = oauth_config["TransformationRules"];
        var ps = {
            input: {"value": result}/* JSON */,
            sample_script: {"script_array": rules[0]["script"]}
            /* JSON */ //As allowing only one script in AuthorizationCode grant
        };
        var script_output = Things["GenericIEMasterConfig"].TestScript(ps);
        result = script_output.value;
        result = {'code': result}
    }
    //****************************************************
    //var temp = me.ConfigJson
    //temp['oauth_details']['code'] = result.code
    //me.ConfigJson = temp
    
    //*****************Updating code into Configjson
    var params = {
                 input: {"configName":me.name, "configJson":me.ConfigJson} /* JSON */
             };

            // result: STRING
            var stringifyResult = me.HandleDecryption(params);
            var js = JSON.parse(stringifyResult);
            js[input.sourceType+'oauth_details']['code'] = result.code
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
    //**********************************************    
}