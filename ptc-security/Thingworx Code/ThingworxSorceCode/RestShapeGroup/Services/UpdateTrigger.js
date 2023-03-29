//INPUTS:input(JSON)
//OUTPUTS: result(JSON)
try{
    var result = {};
   //logger.warn("Input for update trigger: type:  "+type+"   "+input);
    if(type && type === 'ASYNC'){
     if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn("***ASynchronousUpdateTrigger***");
     }
        var params = {
            input: input /* JSON */
        };
        // result: JSON
        var result = me.ASynchronousUpdateTrigger(params);
        result = {"Status":"Success","Description":"Async service received the object and data flow will start"};

    }
    else {
       if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
          logger.warn("***SynchronousUpdateTrigger***");
       }
       var params = {
            input: input /* JSON */
        };
        // result: JSON
        var result = me.SynchronousUpdateTrigger(params);
    }
}
catch(e) {
    logger.warn('Exception in Rest UpdateTrigger'+e)
    var result = {"exception":e};
}
