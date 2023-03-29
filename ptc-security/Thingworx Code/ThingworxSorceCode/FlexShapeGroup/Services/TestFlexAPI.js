//INPUTS: endPoint(String), headersValue(JSON), contentValue(JSON), methodType(String)
//OUTPUTS:JSON
var result="";
try{
var uName = me.username;
var pWord = me.password;
//var end_point = "http://PP-20170907021949733.portal.ptc.io/Windchill/servlet/rest/rfa/CDEE/schema/getFlexTypeHierarchy";
var end_point = endPoint;
var temp_headers = headersValue;

var temp_data = contentValue;
var flex_result = {};
var count = 0;

function callFlexAPI(username,pwd,data,url,headers){
	
    var params = {
        proxyScheme: undefined /* STRING */,
        headers: headers        /* JSON */,
        ignoreSSLErrors: undefined /* BOOLEAN */,
        useNTLM: undefined /* BOOLEAN */,
        workstation: undefined /* STRING */,
        useProxy: undefined /* BOOLEAN */,
        withCookies: undefined /* BOOLEAN */,
        proxyHost: undefined /* STRING */,
        url: url /* STRING */,
        content: data        /* JSON */,
        timeout: 10000 /* NUMBER */,
        proxyPort: undefined /* INTEGER */,
        password: pwd /* STRING */,
        domain: undefined /* STRING */,
        username: username /* STRING */
    };
	
    // result: JSON
    if(methodType.toLowerCase()==="get"){
        delete params.content;
    	flex_result = Resources["ContentLoaderFunctions"].GetJSON(params);
    }else if(methodType.toLowerCase()==="post"){
        flex_result = Resources["ContentLoaderFunctions"].PostJSON(params);
    }else if (methodType.toLowerCase()==="delete"){
       Resources["ContentLoaderFunctions"].Delete(params);
    }else{
    }
    delete flex_result.responseHeaders;
    delete flex_result.responseStatus;
    //logger.warn("flex api called "+count+"  result: "+JSON.stringify(flex_result));
	count = count+1;
}
callFlexAPI(uName,pWord,temp_data,end_point,temp_headers); //initiate first call by manually
function test(){
    if(count<3){
        if(Object.keys(flex_result).length===1){
            if(flex_result["headers"]){
                var csrf = me.getCSRFToken();
                csrf = csrf["Result"];
                temp_headers[csrf[0]] = csrf[1];
				callFlexAPI(uName,pWord,temp_data,end_point,temp_headers);
            }
        }else if(Object.keys(flex_result).length>1){
            result = flex_result;
            delete result.headers;
            delete result.CSRF_NONCE;
            count = 3;
        }else{
        }
    }else{
        //logger.warn("count is: above 3 and the count value is : "+count);
    }
    
}
test();
test();
test();
}catch(e) {
   result = {"error":"Flex Connection Failed"};
}