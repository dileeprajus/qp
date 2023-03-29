//INPUTS:	input (JSON), objectType (STRING), oid (String)
// OUTPUTS: result(JSON)
//HOST : 16 Public IP
try{
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn('****************UpdateRecordInput**************'+JSON.stringify(input)+oid+objectType);
    }
   // result: JSON
   var config = me.FlexAPIConfig();
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
       logger.warn(config.midPoint + config.updateRecord+":INPUT:"+input+ "objectType: "+objectType);
    }
   var params = {
       headers: {
           "Content-Type": "application/json",
           "objectType": objectType
       } /* JSON */,
       url: config.midPoint + config.updateRecord + '/' + oid,
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
           endPoint: config.midPoint + config.updateRecord + '/' + oid,
           headersValue: {
               "Content-Type": "application/json",
               "objectType": objectType
           } /* JSON */,
           contentValue: input /* JSON */,
           methodType: "post" /* STRING */
       };

       // result: JSON
          result = me.TestFlexAPI(params);
   }else delete result.headers;
   if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
       logger.warn("************Resp in Update Record:**************"+JSON.stringify(result));
   }
}
catch(e){
   logger.warn("Exception in UpdateRecord service: "+e.message);
   //var result={"result":"Update Record failed"};
   var result={"result":"UpdateRecord failed","error":e.message};
}
