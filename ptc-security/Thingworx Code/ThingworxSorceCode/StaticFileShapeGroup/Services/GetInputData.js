//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
try{
    var mapping_config = input.mapping_config;
    var result = me.JSONData;
     //result = {"TechPack": result}; //TODO : Need to remove this
}catch(e){
    var result = {};
    logger.warn("Exception in GetInputData service: "+e);
}
