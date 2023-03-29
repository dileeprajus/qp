//INPUT : input(Json)
//OUTPUT: result(String)


//
//HOST : 16 Public IP
//var result={};
try{
    var config = me.FlexAPIConfig();
    //logger.warn("GetAssociationsofRecord input: "+input);
    //logger.warn(config.midPoint + config.getAssociationsofRecord);
    var content = {
        "objectType":input.objectType,
        "oid": input.oid,
        "association": input.association
    }
    var rv=content;
    //Only payload is getting variables for now
//    for(var key in rv){
//        content[key]=rv[key];
//    }
    //logger.warn("Content : "+JSON.stringify(content)+"  url: "+config.midPoint + config.getAssociationsofRecord );
    var params = {
        headers: {
            "Content-Type": "application/json"
        }
        /* JSON */,
        //url: "http://"+me.host_url+"/"+me.host_name+"/schema/getRecords/"+flexObject+"?typeId="+typeId+"&fromIndex="+fromIndex,
        url: config.midPoint + config.getAssociationsofRecord,
        content: content,
        password: config.password /* STRING */,
        username: config.username /* STRING */
    };
    // result: JSON
    result = Resources["ContentLoaderFunctions"].PostJSON(params);
    //logger.warn("Resul for getAssociationRecord service: "+JSON.stringify(result));
    if(Object.keys(result).length===1){//if the result contains only headers then the flex plm may be 11 verison so get the csrf token and then call the api
        var params = {
            endPoint: config.midPoint + config.getAssociationsofRecord /* STRING */,
            headersValue: {
                "Content-Type": "application/json"
            }
            /* JSON */,
            contentValue: content /* JSON */,
            methodType: "post" /* STRING */
        };

        // result: JSON
        result = me.TestFlexAPI(params);
    }
    else delete result.headers;

}
catch(e){
    var result = {"error":e};
    logger.warn("Exception in GetAssociationsofRecord Service: "+e);
}
logger.warn("GetAssociationsofRecord input: "+input);
logger.warn("GetAssociationsofRecord Result: "+result);
