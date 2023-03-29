//Inputs: input:json
//Output: JSON

try{
    //logger.warn("CustomAuth Input"+JSON.stringify(input));
    var method_type = input.custom_auth_method_type;
    var url = input.customAuthUrl
    var headers = {}
    if(input.headers!=="" && input.headers!==null && input.headers!==undefined && typeof input.headers ==='object'){
    	headers = input.headers;
    }
    if(method_type === "GET"){
        var params = {
            headers: headers /* JSON */,
            withCookies: true /* BOOLEAN */,
            ignoreSSLErrors: true,
            url: url /* STRING */,
        };
        // result: JSON
        var result = Resources["ContentLoaderFunctions"].GetJSON(params);
        result = {"result": result}   
    }
    else if(method_type === "POST"){
        var payload = {}
        if(input.payload!=="" && input.payload!==null && input.payload!==undefined && typeof input.payload ==='object'){
    		payload = input.payload;
    	}
        if(input.custom_auth_current_payload_option==='raw'){
            var params = {
                headers: headers /* JSON */,
                withCookies: true /* BOOLEAN */,
                ignoreSSLErrors: true,
                url: url /* STRING */,
                content: payload /* JSON */,
            };
            // result: JSON
            var result = Resources["ContentLoaderFunctions"].PostJSON(params);
            result = {"result": result}
        }
       else if(input.custom_auth_current_payload_option==='x-www-form-urlencoded' || input.custom_auth_current_payload_option==='form-data'){
        	var objectCount = 0;
            for (var k in payload) {
               objectCount++;
            }
            var count = 1;
            var content = '';
            for(var key in payload){
            if(objectCount===count) {
              content = content + encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]);
            }else {
              content =content + encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]) + '&';
            }
            count++;
            }
           // logger.warn('TestCoustomAuthPayload+++++'+JSON.stringify(payload)+content);
            var params = {
    			headers:  headers /* JSON */,
				withCookies: true /* BOOLEAN */,
    			ignoreSSLErrors: true /* BOOLEAN */,
				url: url /* STRING */,
				content: content /* STRING */,
			};
			// result: STRING
			var tempResult = Resources["ContentLoaderFunctions"].PostText(params);
            logger.warn("CustomAuth formurlencoded or Formdata Output"+JSON.stringify(tempResult));
            if(tempResult.indexOf("^") === 0){
            	tempResult =JSON.parse(tempResult.split("^")[1]);
            }
            result = {"result": tempResult}
        }else{}
    }
    else{
    }
    //logger.warn("CustomAuth Output"+JSON.stringify(result));
}catch(e){
    logger.warn("Exception in ExecuteCustomAuth service: "+e);
    var result={};
}
