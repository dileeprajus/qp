//This service and GetRecordsByOid is same.

//HOST : 16 Public IP
try{
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    logger.warn("http://"+me.host_url+"/Windchill/servlet/rest/rfa/CDEE/getRecordByOid/"+flexObject+"/"+Id);
    }
    var params = {
        headers: {"Content-Type": "application/json"} /* JSON */,	
        url: "http://"+me.host_url+"/"+me.host_name+"/schema/getRecordByOid/"+flexObject+"/"+Id,
        password: me.password /* STRING */,
        username: me.username /* STRING */
    };
    // result: JSON
    var result = Resources["ContentLoaderFunctions"].GetJSON(params);
    delete result.responseHeaders;
	delete result.responseStatus;
    if(Object.keys(result).length===1){//if the result contains only headers then the flex plm may be 11 verison so get the csrf token and then call the api
        var params = {
            endPoint: "http://"+me.host_url+"/"+me.host_name+"/schema/getRecordByOid/"+flexObject+"/"+Id /* STRING */,
            headersValue: {"Content-Type": "application/json"} /* JSON */,
            contentValue: {} /* JSON */,
            methodType: "get" /* STRING */
        };

        // result: JSON
        result = me.TestFlexAPI(params);
    }else delete result.headers;
}
catch(e){
    logger.warn("Exception in Flex ShowRecord service: "+e.message);
    var result = {};
}