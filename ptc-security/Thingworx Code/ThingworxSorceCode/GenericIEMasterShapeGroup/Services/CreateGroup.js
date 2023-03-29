try{
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    logger.warn("Input for Create Group service is: "+input);
    }
	var name = input.name;
    var description = input.description;
    var dataSourceType = input.dataSourceType; //flex or rest or staticfile or soap
    var tempType = input.groupType; //source or target or mapping
    var groupName = "MappingGroup";
    var shape_groups_arr = [];
    var tempTags = "";
    var selectedSourceGroup = "";
    var selectedTargetGroup = "";    
    if(tempType.toLowerCase() === "source"){
        tempTags = "Applications:IE;Applications:DynamicGroup;Applications:Source";
        groupName = "SourceGroup";
    }else if(tempType.toLowerCase() === "target"){
        tempTags = "Applications:IE;Applications:DynamicGroup;Applications:Target";
        groupName = "TargetGroup";
    }else if(tempType.toLowerCase() === "mapping"){
        tempTags = "Applications:IE;Applications:DynamicGroup;Applications:Mapping";
        groupName = "MappingGroup";
//        selectedSourceGroup = input.selectedSourceGroup;
//		selectedTargetGroup = input.selectedTargetGroup;
//        name = selectedSourceGroup+"-"+selectedTargetGroup;
    }else {
    }

    var params = {
        name: name /* STRING */,
        description: description /* STRING */,
        thingTemplateName: groupName /* THINGTEMPLATENAME */,
        tags: tempTags /* TAGS */
    };

    // no return
    Resources["EntityServices"].CreateThingTemplate(params);
    //Add project to newly created thing template
    
    var params = {
        projectName: "IntegrationEngine" /* PROJECTNAME */
    };

    ThingTemplates[name].SetProjectName(params);
    
    if(dataSourceType.toLowerCase() === "flex"){ //for all datasource gorups parent template implementing Generic and datasource shapegroupss already
        shape_groups_arr = ["FlexShapeGroup"];
    }
    else if(dataSourceType.toLowerCase() === "rest"){
        shape_groups_arr = ["RestShapeGroup"];
    }
    else if(dataSourceType.toLowerCase() === "static"){
        shape_groups_arr = ["StaticFileShapeGroup"];
    }
    else if(dataSourceType.toLowerCase() === "soap"){
        shape_groups_arr = ["SoapShapeGroup"];
    }
    else if(dataSourceType.toLowerCase() === "socket"){
        shape_groups_arr = ["SocketShapeGroup"];
    }else if(dataSourceType.toLowerCase() === "database"){
        shape_groups_arr = ["DataBaseShapeGroup"];
    }else if(dataSourceType.toLowerCase() === "ftp"){
        shape_groups_arr = ["FTPShapeGroup"];
    }else if(dataSourceType.toLowerCase() === "google pub/sub"){
        shape_groups_arr = ["GooglePubSubShapeGroup"];
    }else{ //if mapping group add below shapes because there is no manually create parent group for dataHandlerGroup
        shape_groups_arr = [];
    }

    for(var i=0;i<shape_groups_arr.length;i++){        //Add required shapeGroups to newly created Group
        var params = {
            name: name /* THINGTEMPLATENAME */,
            thingShapeName: shape_groups_arr[i] /* THINGSHAPENAME */
        };

        // no return
        Resources["EntityServices"].AddShapeToThingTemplate(params);
    }
    function tempCreateGroupProp(groupName,propName,defaultVal,dataType,description,dataChange,persistent){
    	var params = {
            groupName: groupName /* STRING */,
            propertyName: propName /* STRING */,
            defaultValue: {"value": defaultVal} /* JSON */,
            dataType: dataType /* STRING */,
            description:  description/* STRING */,
            dataChangeType: dataChange /* STRING */,
            persistent: persistent /* BOOLEAN */
        };

        me.CreatePropertyDefintion(params);
    }
	tempCreateGroupProp(name,"dataSourceType",dataSourceType,"STRING","This property will tell you the current group is which datasource (FLEX or REST or STATIC or SOAP)","ALWAYS",true);
    tempCreateGroupProp(name,"isActive",true,"BOOLEAN","This property will tell you the current template is either active or not","ALWAYS",true); // Create property isActive for newly create thing group. this property will used while deletion of thingGroup
    //if (tempType.toLowerCase() !== 'mapping') { // only for source and target group
      var tenantID = input.tenantID; //need to validate all apis with this tenantID
      tempCreateGroupProp(name,"tenantID",tenantID,"STRING","This property will be used for api validation","ALWAYS",true); // Create property tenantID for newly create thing group. this property will used while validations of config api
    //}
//    if(tempType.toLowerCase() === "mapping"){ //if group type is mapping then create two properties for newly created mapping group
//		tempCreateGroupProp(name,"selectedTargetGroup",selectedTargetGroup,"STRING","This property will hold the target group for current mappinggroup","ALWAYS",true);
//    	tempCreateGroupProp(name,"selectedSourceGroup",selectedSourceGroup,"STRING","This property will hold the source group for current mappinggroup","ALWAYS",true);
//    }
        
    //Save the template datasource type in json prop. this will help while retriving the all templates
    var data_source = me.GroupDataSourceType;    
    
    if(tempType.toLowerCase() === "mapping"){ //if group type is mapping then store the selected source and target group values in datasourcetype property
    	//data_source[name] = {"dataSourceType":dataSourceType, "isActive":true,"selectedTargetGroup":selectedTargetGroup, "selectedSourceGroup": selectedSourceGroup};
        data_source[name] = {"dataSourceType":dataSourceType, "isActive":true,"tenantID": input.tenantID };
    }else{
    	data_source[name] = {"dataSourceType":dataSourceType, "isActive":true, "tenantID": input.tenantID};
    }
    if(dataSourceType.toLowerCase() === "flex"){ //for all datasource gorups parent template implementing Generic and datasource shapegroupss already
        tempCreateGroupProp(name,"BoilerPlateConfig",{},"JSON","This property will contain the boilerPlateConfig json value host props value","ALWAYS",true);

    }
    me.GroupDataSourceType = data_source;
   //To remove mappings List from getMappingConfigsData propery to update new mappings when any new config created
     Things['GenericIEMasterConfig'].getMappingConfigsData = {};
}
catch(e){
    logger.warn("Exception in CreateGroup service :"+e.message);
}