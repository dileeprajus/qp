//INPUTS groupName(String) propertyName(String) dataType(String) dataChangeType(String) persistent(boolean) defaultValue(JSON) description(String)
// OUTPUTS: Nothing
try{
    var default_val = defaultValue.value;  //get the value for newly created property
    var params = {
        defaultValue:  default_val/* STRING */,
        remoteBindingAspects: undefined /* JSON */,
        description: description /* STRING */,
        readOnly: undefined /* BOOLEAN */,
        type: dataType /* BASETYPENAME */,
        remote: undefined /* BOOLEAN */,
        remotePropertyName: undefined /* STRING */,
        timeout: undefined /* INTEGER */,
        pushType: undefined /* STRING */,
        dataChangeThreshold: undefined /* NUMBER */,
        logged: undefined /* BOOLEAN */,
        name: propertyName /* STRING */,
        pushThreshold: undefined /* NUMBER */,
        dataChangeType: dataChangeType /* STRING */,
        category: undefined /* STRING */,
        persistent: persistent /* BOOLEAN */,
        dataShape: undefined /* DATASHAPENAME */
    };

    // no return
    ThingTemplates[groupName].AddPropertyDefinition(params);

}
catch(e){
    logger.warn("Exception in CreatePropertyDefition service for group: "+groupName+" excepition is :"+e);
}
