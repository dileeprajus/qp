//INPUTS: input(JSON), async type
//OUTPUT: result(JSON)

try{
    var params = {
        input: input /* JSON */
    };
    // result: JSON
    var result = me.SynchronousUpdateTrigger(params);
    }catch(e) {
        var result = {};
        logger.warn("Exception in ASynchronousUpdateTrigger Service: "+e);
}
