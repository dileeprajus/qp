//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
try{
    //var input = JSON.parse(JSON.stringify(input));
    var params = {
        input: input /* JSON */
    };
    // result: STRING
    var input = Things["GenericIEMasterConfig"].ObjectStringify(params);
    input = JSON.parse(input);
    var headers = {};
    var input_headers = [];
    var input_query_params = [];
    var payload = {};
    var result={};
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
        if(input[input.sourceType+'current_payload_option']==="raw"){
           try {
                if(input[input.sourceType+'external_data_payload'] && input[input.sourceType+'external_data_payload'] !== undefined && Object.keys(input[input.sourceType+'external_data_payload']).length !==0) {
                    payload = input[input.sourceType+'external_data_payload'];
                }else {
                    payload = input[input.sourceType+'payload'];
                }
            }catch(e) {
                payload = input[input.sourceType+'payload'];
            }
           // payload = JSON.parse(JSON.stringify(input[input.sourceType+'payload']));
            if(typeof payload==='string'){
                payload = JSON.parse(payload);
            }
        }else if(input[input.sourceType+'current_payload_option']==="x-www-form-urlencoded"){
	        //input_headers.push(["Content-Type","application/x-www-form-urlencoded"])
	        var tempInput = {"arr":input[input.sourceType+'payload_form_url_encoded']};

	        var formPs = {
	            input: tempInput /* JSON */
	        };

	        // result: STRING
	        payload = me.GetFormUrlEncodedPayload(formPs);

	    }
        var external_payload = input[input.sourceType+'external_data_payload'];
        if(external_payload!==undefined){
            for(var bdy in external_payload) payload[bdy] = external_payload[bdy];
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
            headers["Content-Type"]="application/json";
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
            ps=ps+param+"="+external_url_params[param]+"&";
        }
        if(ps!==""){
            url=url+ps;
        }
    }
    if(typeof payload==='string'){
        payload = JSON.parse(payload);
    }

    var params = {
        headers: headers /* JSON */,	
        url: url.trim(),
        //content: input,
        password: input[input.sourceType+'basic_auth_details']['password'] /* STRING */,
        username: input[input.sourceType+'basic_auth_details']['username'] /* STRING */,
        content : payload
    };
    //logger.warn("BasicAuth Post "+JSON.stringify(params));
        // result: JSON
    if(input[input.sourceType+'current_payload_option']==="raw"){
        // result: JSON
    	result = Resources["ContentLoaderFunctions"].PostJSON(params);
        delete result.headers;
    } else if(input[input.sourceType+'current_payload_option']==="x-www-form-urlencoded"){
        result = Resources["ContentLoaderFunctions"].PostText(params);
        if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        	logger.warn(input.sourceType+": "+"BasicAuthPost text Response : "+JSON.stringify(result))
        } 
    }
    
    var ps = {
        input: result /* JSON */
    };
    // result: STRING
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   	 logger.warn("typeof result  "+typeof result+" BasicAuthPost Response : "+Things["GenericIEMasterConfig"].ObjectStringify(ps));
    }

    //logger.warn(input.sourceType+": "+"Post Basic auth Response : "+JSON.stringify(result));
    //delete result.headers;
}
catch(e){
    var result = {"exception":e};
    logger.warn("Exception in BasicAuthPost: "+e);
}
