//INPUTS input(JSON)
// OUTPUTS: result(XML)
//logger.warn("INPUTTT : "+input);
var input = input;//JSON.parse(JSON.stringify(input));
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
    for(var i=0;i<input_headers.length;i++){
        headers[input_headers[i][0]] = input_headers[i][1];
    }
}

var external_headers = input[input.sourceType+'external_data_headers']
if(external_headers!=undefined){
    for(var header in external_headers){
        headers[header]=external_headers[header];
    }
}
//else{
//    headers = {"Content-Type": "application/json"} //default header
//}


//sending params as query params if any
if(input_query_params.length>0){
    var query_params = "?"
    for(var i=0;i<input_query_params.length;i++){
        query_params=query_params+input_query_params[i][0]+"="+input_query_params[i][1]+"&"
    }
    url=url+query_params;
}

var external_url_params = input[input.sourceType+'external_data_url_params']
if(external_url_params!==undefined){
    var ps = "";
    for(var param in external_url_params){
        //external_url_params[header]=external_headers[header];
        ps=ps+param+"="+external_url_params[param]+"&"
    }
    if(ps!==""){
        url=url+ps
    }
}



var params = {
	headers: headers /* JSON */,	
    url: url,
    //content: input,
    password: input[input.sourceType+'basic_auth_details']['password'] /* STRING */,
	username: input[input.sourceType+'basic_auth_details']['username'] /* STRING */
};
// result: JSON
var result = Resources["ContentLoaderFunctions"].GetXML(params);
if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
	logger.warn(input.sourceType+": "+"Get Basic auth XML Response : "+result);
}
//delete result.headers