//INPUTS:	input flexObject:"", typeID:{}
// OUTPUTS: result(JSON)


// result: JSON
var config = me.FlexAPIConfig();

//HOST : 16 Public IP
if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
logger.warn(config.midPoint + config.deleteRecord+"/"+typeID+"?type="+flexObject);
}
var params = {
	headers: {"Content-Type": "application/x-www-form-urlencoded"} /* JSON */,	
    url: config.midPoint + config.deleteRecord+"/"+typeID+"?type="+flexObject,
    password: config.password /* STRING */,
	username: config.username /* STRING */
};
// result: JSON
var result = Resources["ContentLoaderFunctions"].Delete(params);
delete result.responseHeaders;
delete result.responseStatus;
//delete result.headers;
if(Object.keys(result).length===1){//if the result contains only headers then the flex plm may be 11 verison so get the csrf token and then call the api
    var params = {
        endPoint: config.midPoint + config.deleteRecord+"/"+typeID+"?type="+flexObject /* STRING */,
        headersValue: {"Content-Type": "application/x-www-form-urlencoded"} /* JSON */,
        contentValue: {} /* JSON */,
        methodType: "delete" /* STRING */
    };

    // result: JSON
    result = me.TestFlexAPI(params);
}
