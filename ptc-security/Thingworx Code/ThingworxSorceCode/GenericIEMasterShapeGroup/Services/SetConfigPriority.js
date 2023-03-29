//INPUTS input(JSON)
// OUTPUTS: result(JSON)
try{
    var name = input.name;
    var priority = input.priority;
    Things[name].PriorityOrder = priority;
    var result = {"Config":name, "PriorityOrder":priority};
}catch(e){
    var result = {};
    logger.warn("Error in SetConfigPriority service: "+e);
}