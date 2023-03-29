//INPUT  NoInput
//OUTPUT  result= {}

try{
    var result = {"projectName":me.projectName,"selectMode":me.selectMode, "privateKey":me.privateKey};
}catch(e){
    var result = {"projectName":"", "selectMode": "", "privateKey": ""};
    logger.warn("Exception in GetGooglePubSubHostInfo service: "+e.message);
}