//INPUTS input(JSON)
// OUTPUTS: result(XML)
var result=""
var input = input;//JSON.parse(JSON.stringify(input));
//var params = {
//	input: input /* JSON */
//};
//// result: STRING
//var input = Things["GenericIEMasterConfig"].ObjectStringify(params);
//input = JSON.parse(input);

var headers = {};
var input_headers = [];
var input_query_params = [];
var payload = {};
if(input.sourceType=="schema_"){
    input_headers = input.schemafromurl_details.schema_headers;
    var url = input.schemafromurl_details.schema_data_url;
    input_query_params = input.schemafromurl_details.schema_query_params;
    if(input.schemafromurl_details.schema_current_payload_option==="raw"){
    	payload = input.schemafromurl_details.schema_payload;
	}  
}
else{
    input_headers = input[input.sourceType+'headers'];
    var url = input[input.sourceType+'data_url'];
    input_query_params = input[input.sourceType+'query_params'];
//    if(input[input.sourceType+'current_payload_option']==="raw"){
//    	payload = input[input.sourceType+'payload'];
//        //payload = JSON.parse(JSON.stringify(input[input.sourceType+'payload']));
//	}
//    var external_payload = input[input.sourceType+'external_data_payload'];
//    if(external_payload!==undefined){
//        for(var bdy in external_payload) payload[bdy] = external_payload[bdy];
//    }
    var external_payload = input[input.sourceType+'external_data_payload'];
    payload = external_payload //TODO : need to append two bodies
    if(input[input.sourceType+'current_payload_option']==="x-www-form-urlencoded"){
        //input_headers.push(["Content-Type","application/x-www-form-urlencoded"])
        var tempInput = {"arr":input[input.sourceType+'payload_form_url_encoded']};

        var formPs = {
            input: tempInput /* JSON */
        };

        // result: STRING
        payload = me.GetFormUrlEncodedPayload(formPs);

    }
}

if(input_headers.length>0){
    for(var i=0;i<input_headers.length;i++){
        headers[input_headers[i][0]] = input_headers[i][1];
    }
}
//Add default headers if content type is not there in the headers
if(headers["Content-Type"]){
}else{
	if(input[input.sourceType+'current_payload_option']==="raw"){
        headers["Content-Type"]="application/xml";
    } else if(input[input.sourceType+'current_payload_option']==="x-www-form-urlencoded"){
        headers["Content-Type"]="application/x-www-form-urlencoded";
    }
}
//else{
//    headers = {"Content-Type": "application/json"} //default header
//}

var external_headers = input[input.sourceType+'external_data_headers']
if(external_headers!=undefined){
    for(var header in external_headers){
        headers[header]=external_headers[header];
    }
}


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
    content: payload
};
if(input[input.sourceType+'current_payload_option']==="x-www-form-urlencoded"){
    result = Resources["ContentLoaderFunctions"].PostText(params);
    logger.warn(input.sourceType+": "+"Post text No auth Response : "+JSON.stringify(result));
}else{
    // result: JSON
    result = Resources["ContentLoaderFunctions"].PostXML(params);
    logger.warn(input.sourceType+": "+"Post No auth Response : "+result);
    //delete result.headers;
}