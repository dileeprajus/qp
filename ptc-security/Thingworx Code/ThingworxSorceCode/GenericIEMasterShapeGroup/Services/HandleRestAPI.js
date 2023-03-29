/*INPUTS:  headers(JSON),
	         auth_type(STRING),
	         method(STRING),
	         payload(STRING),
	         query_params(JSON),
	         oauth_details:(JSON),
	         basic_auth_details:(JSON),
	         url(STRING)
OUTPUTS: result(JSON)
*/
logger.warn("Handle Rest API called");
url=url.trim();
url=url.replace(/\;$/, '');
var config ={
	"basic_auth_details": basic_auth_details,
	"current_method_type": method,
	"current_data_format": "JSON",
	"data_url": url,
	"query_params": [],
	"current_auth_type": auth_type,
	"headers": [],
	"body": payload,
	"current_body_option": "raw",
	"body_form_data": [],
	"body_form_url_encoded": [],
	"sourceType": "",
	"external_data_body": {},
	"external_data_headers": headers,
	"external_data_url_params": query_params
}
//TODO : need to update config json for oauth
//logger.warn("Handle Rest API INPUT : "+JSON.stringify(config));
var params = {
	input: config /* JSON */
};
// result : JSON
var result = Things["RestConfig"].TestApi(params);
if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
	logger.warn("Handle Rest API OUTPUT : "+JSON.stringify(result));
}
