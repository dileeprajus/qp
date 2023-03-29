//INPUTS input(JSON)
// OUTPUTS: result(JSON)
try{
    var groupName= input.groupName;
    var description  = input.description;
    var params = {
        description: description /* STRING */
    };
    ThingTemplates[groupName].SetDescription(params);
    var result = {"Result":description};
}catch(e){
    var result = {"Result":e};
    logger.warn("Exception in SetGroupDescription Service");
}
