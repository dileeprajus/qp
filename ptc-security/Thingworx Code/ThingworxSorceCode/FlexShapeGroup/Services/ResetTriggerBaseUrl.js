//INPUTS:	input (JSON)
// OUTPUTS: result(JSON)
try{

    // result: JSON
    var config = me.FlexAPIConfig();
    var params = {
        headers: {
            "Content-Type": "application/json",
        } /* JSON */,
        url: config.midPoint + config.resetTriggerBaseUrl,
        content: input,
        password: config.password /* STRING */,
        username: config.username /* STRING */
    };
    // result: JSON
    var result = Resources["ContentLoaderFunctions"].PostJSON(params);
    delete result.responseHeaders;
	delete result.responseStatus;
    if(Object.keys(result).length===1){ //if the result contains only headers then the flex plm may be 11 verison so get the csrf token and then call the api
        var params = {
            endPoint: config.midPoint + config.resetTriggerBaseUrl,
            headersValue: {
                "Content-Type": "application/json",
            } /* JSON */,
            contentValue: input /* JSON */,
            methodType: "post" /* STRING */
        };

        // result: JSON
       	result = me.TestFlexAPI(params);
    }else delete result.headers;
}
catch(e){
    logger.warn("Exception in ResetTriggerBaseUrl service: "+e.message);
    var result={};
}
