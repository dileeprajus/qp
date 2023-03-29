//INPUTS input(JSON)
// OUTPUTS: JSON
//INPUTS input(JSON)
// OUTPUTS: JSON
try{
    var temp_config = Things["GenericIEMasterConfig"].SoapDynamicGroupConfig;

    //logger.warn("input for setgroup wsdl data: "+input);
    var groupName = input.groupName;
    var uploadedWSDLS = input.uploadedWSDLS;
    //var wsdlType = input.wsdlType; //FileUpload or FromURL
    var obj = { "uploadedWSDLS": uploadedWSDLS};


    if(temp_config[groupName] !== undefined || temp_config[groupName]){
        //call Remove property defintion service if group contains property or not (call any case)
        var params = {
            groupName: groupName /* STRING */,
            propName: "BoilerPlateConfig" /* STRING */
        };

        // result: JSON
        var remove_prop_result = me.DeletePropertyDefintion(params);
        logger.warn("Result for removeprop service"+remove_prop_result);
    }
    var params = {
        groupName: groupName /* STRING */,
        propertyName: "BoilerPlateConfig" /* STRING */,
        defaultValue: {"value":obj} /* STRING */,
        dataType: "JSON" /* STRING */,
        description: "This is the property which holds the group wsdl data with default or updated values" /* STRING */,
        dataChangeType: "ALWAYS" /* STRING */,
        persistent: true /* BOOLEAN */
    };

    me.CreatePropertyDefintion(params);

	temp_config[groupName] = obj;
    Things["GenericIEMasterConfig"].SoapDynamicGroupConfig = temp_config; //update flexdynamicgroup config property with new group host props
    //logger.warn("=======SoapDynamicGroupConfig========="+Things["GenericIEMasterConfig"].SoapDynamicGroupConfig);

    var result = Things["GenericIEMasterConfig"].SoapDynamicGroupConfig[groupName];
    //Update the host properties of each things under this group

//    var params = {
//        groupName: groupName /* STRING */
//    };
//
//    // result: JSON
//    var tmp_things = me.GetAllConfigs(params);
//	tmp_things = tmp_things["Configs"]
//    for(var i=0;i<tmp_things.length;i++){
//        var tName = tmp_things[i].Name;
//        var params = {
//            input: host_props /* JSON */
//        };
//        // result: JSON
//        var host_result = Things[tName].SetHostProperties(params);
//    }
//
   if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    logger.warn("Result for UpdateWSDL for group "+groupName+" is:"+result);
   }

}catch(e){
    var result = Things["GenericIEMasterConfig"].SoapDynamicGroupConfig[groupName];
    logger.warn("Exception in UpdateWSDL service: "+e);
}
