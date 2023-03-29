//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
try{//var input = JSON.parse(JSON.stringify(input));
    var params = {
        input: input /* JSON */
    };
    // result: STRING
    var input = Things["GenericIEMasterConfig"].ObjectStringify(params);
    input = JSON.parse(input);
    
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
    //else{
    //    headers = {"Content-Type": "application/json"} //default header
    //}
    //
    
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
        ignoreSSLErrors: true,
        url: encodeURI(url),
        //content: input,
    };
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {  
       logger.warn(input.sourceType+": "+"Get No auth headers : "+JSON.stringify(params.headers));
       logger.warn(input.sourceType+": "+"Get No auth url : "+JSON.stringify(params.url));
    }
    // result: JSON
    var result = Resources["ContentLoaderFunctions"].GetJSON(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {    
      logger.warn(input.sourceType+": "+"Get No auth Response : "+JSON.stringify(result));
    }
    delete result.headers;
    var k = JSON.stringify(result);
    result=k.replace(/,null/g , ',""');
    result = JSON.parse(result);
    }catch(e){
        var result={};
        logger.warn("Exception in NoAuthGet service: "+e);
        var params = {
            input: {"ShapeName":"RestShapeGroup","ServiceName":"NoAuthGet","timeStamp": new Date(),"Payload":input,"Exception":e.message}  
         }
        me.HandleCatchExceptions(params);
    }
