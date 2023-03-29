//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
var params = {
	input: input /* JSON */
};
// result: STRING
var input = Things["GenericIEMasterConfig"].ObjectStringify(params);
input = JSON.parse(input);

for(var i=0;i<3;i++){
var headers = {};
var input_headers = [];
var input_query_params = [];
if(input.sourceType=="schema_"){
    input_headers = input.schemafromurl_details.schema_headers;
    var url = input.schemafromurl_details.schema_data_url;
    input_query_params = input.schemafromurl_details.schema_query_params;
}
else{
    input_headers = input[input.sourceType+'headers'];
    var url = input[input.sourceType+'data_url'];
    input_query_params = input[input.sourceType+'query_params'];
}
if(input_headers.length>0){
    for(var j=0;j<input_headers.length;j++){
        headers[input_headers[j][0]] = input_headers[j][1];
    }
}
else{
    headers = {"Content-Type": "application/json"} //default header
}

var query_params = "?access_token="+input[input.sourceType+'oauth_token_data']['access_token'];
//sending params as query params if any
if(input_query_params.length>0){
    for(var k=0;k<input_query_params.length;k++){
        query_params=query_params+input_query_params[k][0]+"="+input_query_params[k][1]+"&"
    }
}
url=url+query_params;

var params = {
	headers: headers /* JSON */,	
    url: url,	
    //url: input.data_url+"?access_token="+input.oauth_token_data.access_token,
    //content: input,
};
// result: JSON
var result = Resources["ContentLoaderFunctions"].GetJSON(params);
logger.warn(input.sourceType+": "+"Get OAuth Response : "+JSON.stringify(result));
delete result.headers;

var  response_keys = 0;
    for(var ki in result){
        if(ki){
            response_keys = response_keys+1;
            break;
        }
    }
    if(response_keys>0){
        break;
    }
    else{//get new access_token and try    
		var params = {
			input: input /* JSON */
		};
		var tokenData = me.GetAccessTokenUsingRefreshToken(params);
        logger.warn("********************************TOKEN DATA : "+i+JSON.stringify(tokenData))
    	input = me.ConfigJson  //updating config json above
        //logger.warn("**************Token update into configjson3"+JSON.stringify(input))
    }

}