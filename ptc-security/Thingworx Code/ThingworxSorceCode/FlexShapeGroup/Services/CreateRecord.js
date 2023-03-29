//HOST : 16 Public IP
try{

    // result: JSON
    var config = me.FlexAPIConfig();
    // new payload for new api createOrUpdateFlexObject
    var newPayloadObj = {};
    if(input["search"]) {
      var typeId = input.typeId;
        delete input.typeId;
        newPayloadObj = input;
        newPayloadObj["payload"]["typeId"] = typeId;
    } else {
      newPayloadObj = {
           "search": {},
           "payload": input
       };
     }

    var obps = {
        input: newPayloadObj /* JSON */
    };

    // result: STRING
    var newpld = Things["FlexConfig"].ObjectStringify(obps);


    //logger.warn(config.midPoint + config.createRecord+":INPUT:"+newpld+ "objectType: "+objectType);
    var params = {
        headers: {
            "Content-Type": "application/json",
            "objectType": objectType
        } /* JSON */,	
        url: config.midPoint + config.createRecord,
        //url: config.midPoint + config.createOrUpdateFlexObject, //new api changes
        //content: input,
        content: newPayloadObj,
        password: config.password /* STRING */,
        username: config.username /* STRING */
    };
    // result: JSON
    var result = Resources["ContentLoaderFunctions"].PostJSON(params);  
    delete result.responseHeaders;
	delete result.responseStatus;
    //logger.warn("CreateRecordTotalInput : "+JSON.stringify(params));
    if(Object.keys(result).length===1){ //if the result contains only headers then the flex plm may be 11 verison so get the csrf token and then call the api
        var params = {
            endPoint: config.midPoint + config.createRecord /* STRING */,
            headersValue: {
                "Content-Type": "application/json",
                "objectType": objectType
            } /* JSON */,
            //contentValue: input /* JSON */,
            contentValue: newPayloadObj,
            methodType: "post" /* STRING */
        };

        // result: JSON
       	result = me.TestFlexAPI(params);
    }else delete result.headers;
}catch(e){
    logger.warn("Exception in CreateRecord service: "+e.message);
    //var result={"result":"Create Record failed"};
    var result={"result":"Create Record failed","error":e.message};
}