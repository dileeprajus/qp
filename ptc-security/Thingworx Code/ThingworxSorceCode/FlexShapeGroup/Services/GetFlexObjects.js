//INPUTS:	Nothing
// OUTPUTS: result(JSON)
try{
    var config = me.FlexAPIConfig();
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    logger.warn("config detais in getflexobejcts"+JSON.stringify(config));
    }
    var params = {
        headers: {"Content-Type": "application/json"} /* JSON */, 
        url: config.midPoint + config.getFlexObjects,
        password: config.password /* STRING */,
        username: config.username /* STRING */,
        timeout: 10000
    };
    // result: JSON
    var flex_obj_list = Resources["ContentLoaderFunctions"].GetJSON(params);
    delete flex_obj_list.responseHeaders;
	delete flex_obj_list.responseStatus;
    //delete flex_obj_list.headers;
    if(Object.keys(flex_obj_list).length===1){//if the result contains only headers then the flex plm may be 11 verison so get the csrf token and then call the api
        var params = {
            endPoint: config.midPoint + config.getFlexObjects /* STRING */,
            headersValue: {"Content-Type": "application/json"} /* JSON */,
            contentValue: {} /* JSON */,
            methodType: "get" /* STRING */
        };
        // result: JSON
        flex_obj_list = me.TestFlexAPI(params);
    }else delete flex_obj_list.headers;;
    var result = {};
    if(flex_obj_list!==undefined||flex_obj_list!==null){
        var obj_arr = flex_obj_list.array;
        result["FlexObjects"] = obj_arr;
    } else {
        flex_obj_list["FlexObjects"] = {};
    }
}
catch(e){
    logger.warn("Exception in GetFlexObjects Service: "+e.message);
    var result={"FlexObjects":[]};
}