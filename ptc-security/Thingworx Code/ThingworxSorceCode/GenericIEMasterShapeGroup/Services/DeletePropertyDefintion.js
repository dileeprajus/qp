//INPUTS groupName(String) propertyName(String)
// OUTPUTS: JSON
try{
    var params = {
        name: propName /* STRING */
    };

    ThingTemplates[groupName].RemovePropertyDefinition(params);
    var result = {"Success":"property deleted successfully"};
    logger.warn(groupName+"Template"+propName+" property Deleted Successfully");
}
catch(e){
    var result = {"Exception":e};
    logger.warn("Exception in DeletePropService : can't delete property for template"+groupName+" exception: "+e);
}