//INPUTS: input(JSON), async type
//OUTPUT: result(JSON)

//logger.warn("Input for AsynCreateTrigger is :"+input);
try{
    var params = {
        input: input /* JSON */
    };

    // result: JSON
    var result = me.SynchronousCreateTrigger(params);
}
catch(e){
    var result = {
    };
    logger.warn("Exception in AsyncCreateTrigger: "+e);
}
