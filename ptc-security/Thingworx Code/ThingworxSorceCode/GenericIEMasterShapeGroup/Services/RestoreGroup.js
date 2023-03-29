//INPUTS input(ThingTemplateName)
// OUTPUTS: Json
try{
    var result={};
    var data_source = me.GroupDataSourceType;
    var data_source_type = data_source[input].dataSourceType;
    data_source[input]["isActive"]=true;
    me.GroupDataSourceType = data_source; //update the GroupDataSourceType property
    
    //first delete the property and then recreate the property because the entity is Group
    if(data_source[input] !== undefined || data_source[input]){    
        //call Remove property defintion service if template contains property or not (call any case)
        var params = {
            groupName: input /* STRING */,
            propName: "isActive" /* STRING */
        };

        // result: JSON
        var remove_prop_result = me.DeletePropertyDefintion(params);
       // logger.warn("Result for removeprop service"+remove_prop_result);
    }
        
    // Create property isActive for newly create group. this property will used while deletion of Group
    var params = {
        groupName: input /* STRING */,
        propertyName: "isActive" /* STRING */,
        defaultValue: {"value":true} /* JSON */,
        dataType: "BOOLEAN" /* STRING */,
        description: "This property will tell you the current grouup is either active or not" /* STRING */,
        dataChangeType: "ALWAYS" /* STRING */,
        persistent: true /* BOOLEAN */
    };

    me.CreatePropertyDefintion(params);
      var allConfParams = {
            groupName: input /* STRING */,
            type: "restore" /* STRING */
        };

        // result: JSON
        var allConfResult = me.GetAllConfigs(allConfParams);
        allConfResult=allConfResult["Configs"];
        for(var x=0;x<allConfResult.length;x++){
        	var confName = allConfResult[x].Name;
            Things[confName].isActive = true;
        }
    var result={};
	
}catch(e){
    var result={};
}