//INPUT  input= {}
//OUTPUT  result= {}

try{
    if(input !== undefined){
        me.projectName = input.privateKey.fileData.project_id;
        me.selectMode = input.selectMode;
        me.privateKey = input.privateKey;
        var getGooglePubSubHostInfo = me.GetGooglePubSubHostInfo();
    }
}catch(e){
    var result = {"error":e.message};
    logger.warn("Exception in SetGooglePubSubHostInfo Service: "+e.message);
}