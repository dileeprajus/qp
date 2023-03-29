//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
var URL = "";
var input = input;
URL = input.auth_url+input.access_token_url+"?";
delete input["auth_url"];
delete input["access_token_url"];
delete input["auth_code_type"];
delete input["AuthorizationCodeGrant"];
delete input["token_name"];
for(var key in input){
    if(input[key]!==""){
		URL = URL+key+"="+input[key]+"&";
    }
}
URL=URL.replace(/\&$/, '');
logger.warn("URL: "+URL);
try{
var params = {
	headers: {"Content-Type": "application/json"} /* JSON */,	
    url: URL,
};
// result: JSON
var result = Resources["ContentLoaderFunctions"].PostJSON(params);
if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
	logger.warn("Oauth Token Response: "+JSON.stringify(result));
}
delete result.headers;
}
catch(err) {
    logger.warn('Exception in Rest TestOAuthToken'+e);
    result = {"Exception": "API Failed"};
}