//INPUTS: input(JSON)
//OUTPUTS: result(JSON)
//Record the source audit data when data is triggered from source
// var params = {
// 		 input: {
// 				 "sId": me.name,
// 				 "tId": "",
// 				 "mTime": new Date(),
// 				 "sTime": new Date(),
// 				 "tTime": new Date(),
// 				 "tSeq": Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum()+1,
// 				 "mccId": me.name
// 		 }
// 		 /* JSON */
//  };
//
//  // result: JSON
//  var recordResult = Things["GenericIEMasterConfig"].RecordTransactionalAuditData(params);
try{
    //var result = {};
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   		 logger.warn("Input for Rest CreateTrigger: type:  "+type+"   "+input);
    }
    if(type && type === 'ASYNC'){
        logger.warn("***ASynchronousCreateTrigger***");

        var Async_params = {
            input: input /* JSON */
        };
        var result = me.ASynchronousCreateTrigger(Async_params);
        result = {"Status":"Success","Description":"Async service received the object and data flow will start"};
    }
    else{
        logger.warn("***SynchronousCreateTrigger***");
        var params = {
            input: input /* JSON */
        };
        // result: JSON
        var result = me.SynchronousCreateTrigger(params);
    }
}
catch(e){
    var result ={"exception":e};
    logger.warn("Exception in Rest CreateTrigger Service: "+e);
}