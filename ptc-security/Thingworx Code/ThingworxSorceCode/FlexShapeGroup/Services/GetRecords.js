//INPUTS:	input {"flexObject":"", "typeID":"", "fromIndex":123}
// OUTPUTS: result(JSON)

//HOST : 16 Public IP
//var result={};
try{
    var config = me.FlexAPIConfig();
    var flexObject = input.flexObject;
    var typeId = input.typeId;
    var fromIndex = input.fromIndex;
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
            //"attributes":{"typeId":typeId},
            "typeId":typeId,
            "objectType": flexObject,
            "fromIndex": fromIndex
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
                 //"attributes":{"typeId":typeId},
            	"typeId":typeId,
                "objectType": flexObject,
                "fromIndex": fromIndex
            } /* JSON */,
            methodType: "post" /* STRING */
        };

        // result: JSON
        result = me.TestFlexAPI(params);
    }else delete result.headers;

}
catch(e){
    var result = {};
    logger.warn("Exception in GetRecords Service: "+e.message);
}