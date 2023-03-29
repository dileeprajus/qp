//INPUTS:	input (JSON)
// OUTPUTS: result(JSON)
try{
    var result={};
    var config_json = me.ConfigJson;
 	 if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn("INPUT FOR Flex GetInput data service: "+input);
     }
    if(config_json["FlexPrimaryAPI"]==="GetAssociatedRecords"){
        var params = {
            input: input["RequestVariables"] /* JSON */
        };

        // result: JSON
        var association_result = me.GetAssociationsofRecord(params);
        if(association_result["statusCode"]===400){            
            result = {
                "objectType": undefined,
                "objectData": {},
                 "statusCode": 400
            }
        } else{
        	 result = {
                "objectType": input['RequestVariables'].objectType,
                "objectData": association_result,
                "statusCode": 200
            }
        } 
            
    } else if(config_json["FlexPrimaryAPI"]==="GetRecords"){
        var tmp = {};
        input = input["RequestVariables"];
         var config = me.FlexAPIConfig();
        var content = {
            "objectType":input.objectType,
            "fromIndex": input.fromIndex,
        }
        var rv=content;
        //logger.warn("Content : "+JSON.stringify(content)+"  url: "+config.midPoint + config.getRecordsData );
        var params = {
            headers: {
                "Content-Type": "application/json"
            } /* JSON */,	
            url: config.midPoint + config.getRecordsData,
            content: content,
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
                }/* JSON */,
                contentValue: content /* JSON */,
                methodType: "post" /* STRING */
            };

            // result: JSON
            result = me.TestFlexAPI(params);
        }
        else delete result.headers;
    }
    else{
        //nothing
    }
}catch(e){
    var result = {"error":e.message};
    logger.warn("Exception in Flex GetInputData service: "+e.message);
}