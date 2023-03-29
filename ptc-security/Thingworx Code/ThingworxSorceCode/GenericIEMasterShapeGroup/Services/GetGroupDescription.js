//INPUTS: input(JSON)
//OUTPUT: JSON
try{
    var groupName = input.groupName;
    var desc = ThingTemplates[groupName] ? ThingTemplates[groupName].GetDescription() :"";
    var result = {"result":desc};
}catch(e){
    var result = {"result":e};
    logger.warn("Exception in getDescription Service");
}