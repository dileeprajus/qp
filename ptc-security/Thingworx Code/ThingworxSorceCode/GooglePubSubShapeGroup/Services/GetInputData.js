var tObj = transactionObj || {};
try{
    var params = {
        transactionObj: tObj
    };

    // result: JSON
    var result = me.PullDataFromExternalSource(params);
}catch(e){
    var result = {};
    logger.warn("Exception in GetInputData service GooglePubSub: "+e.message);
}