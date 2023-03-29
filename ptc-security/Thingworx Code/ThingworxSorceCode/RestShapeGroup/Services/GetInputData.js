//INPUTS:	input (JSON)
// OUTPUTS: result(JSON)
try{
    var mapping_thing = input.mapping_thing;

    var params = {
        headers: {} /* JSON */,
        url_params: {} /* JSON */,
        payload: undefined /* JSON */,
        request_variables: input["RequestVariables"],
    };

    // result: JSON
    var result = me.PullDataFromExternalSource(params);
    //result = {"TechPack": result};
    //logger.warn("Result for getInputData service in "+me.name+" is : "+JSON.stringify(result));
}catch(e){
    var result = {};
    logger.warn("Exception in GetInputData service: "+e);
}
