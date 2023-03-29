//INPUTS:	Nothing
// OUTPUTS: result(JSON)
try{
    //logger.warn("GetHostProperties Service");
    var result = {"midpoint":me.midpoint, "hostname":me.hostname,"username": me.username, "password": me.password};
}catch(e){
    var result = {"midpoint":"", "hostname":"","username": "", "password": ""};
    logger.warn("Exception in Flex GetHostPropeties service: "+e);
}
