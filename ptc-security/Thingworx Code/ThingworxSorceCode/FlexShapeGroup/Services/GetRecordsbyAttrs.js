//INPUTS input(JSON)
//OUTPUT JSON
//HOST : 16 Public IP
//var result={};
//HOST : 16 Public IP
//var result={};
try{
    var config = me.FlexAPIConfig();
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    logger.warn(config.midPoint + config.getRecordsData);
    }
    var params = {
        headers: {
            "Content-Type": "application/json"
        } /* JSON */,	
        //url: "http://"+me.host_url+"/"+me.host_name+"/schema/getRecords/"+flexObject+"?typeId="+typeId+"&fromIndex="+fromIndex,
        url: config.midPoint + config.getRecordsData,
        content: {
            "attributes":input.RequestVariables,
            "objectType": input.objectType,
            //"fromIndex": fromIndex
        },
        password: config.password /* STRING */,
        username: config.username /* STRING */
    };
    // result: JSON
    result = Resources["ContentLoaderFunctions"].PostJSON(params);
    delete result.responseHeaders;
	delete result.responseStatus;
    if(Object.keys(result).length===1){//if the result contains only headers then the flex plm may be 11 verison so get the csrf token and then call the api
        var params = {
            endPoint: config.midPoint + config.getRecordsData /* STRING */,
            headersValue: {
                "Content-Type": "application/json"
            }  /* JSON */,
            contentValue: {
                 "attributes":input.RequestVariables,
            	 "objectType": input.objectType,
            } /* JSON */,
            methodType: "post" /* STRING */
        };

        // result: JSON
        result = me.TestFlexAPI(params);
    }else delete result.headers;

}
catch(e){
    var result = {};
    logger.warn("Exception in GetRecordsbyAttrs Service: "+e.message);
}

