try{
	var result = "";
    var name = input.name;
    var data_shape_name = "";
    var description = input.description;
    var data_source_cat = input.configDataSourceCategory; //datasource either "source/target/mapping" if not it is mapping
    var group_name = input.groupName;
    var isFlex = input.isFlex;
    var isFTP = input.isFTP;
    var isGooglePubSub = input.isGooglePubSub;
    var temp_tags;
    var data_source = me.GroupDataSourceType;
    var data_source_type = ''; //this will be used if config is static
    var sourceConfig;
    var targetConfig;
    //To remove mappings List from getMappingConfigsData propery to update new mappings when any new config created
     Things['GenericIEMasterConfig'].getMappingConfigsData = {};
    if(data_source[group_name]){ 
        data_source_type = data_source[group_name]["dataSourceType"]; //flex or rest or static or soap
    }
    if(data_source_cat==="source"){    //decide model tags based on Group
        name = group_name+"-"+name;
        temp_tags = "Applications:IE;Applications:DynamicConfig;Applications:Source";
        data_shape_name = "SourcePersistantObject";
    }else if(data_source_cat==="target"){
        name = group_name+"-"+name;
        temp_tags = "Applications:IE;Applications:DynamicConfig;Applications:Target";
        data_shape_name = "TargetPersistantObject";
    }else if(data_source_cat==="mapping"){// data handler config (mapping config)
        name = group_name+"-"+name;
        temp_tags = "Applications:IE;Applications:DynamicConfig;Applications:Mapping";
        data_shape_name = "DataTransactionTable";
    } else {
        temp_tags = "";
        data_shape_name = "DataTransactionTable";
    }
    var params = {
        name: name /* STRING */,
        description: description /* STRING */,
        thingTemplateName: group_name /* THINGTEMPLATENAME */,
        tags: temp_tags /* TAGS */
    };
    // no return
    Resources["EntityServices"].CreateThing(params);
    //set datashape name because the create dynamic thing is datatable config so datashape is mandatory field.(before enabling the config first add the mandatory fields)
    var params = {
        name: data_shape_name /* DATASHAPENAME */
    };

    Things[name].SetDataShape(params);

    Things[name].EnableThing();
    Things[name].RestartThing();
    //set the persistence provider name because the thing is datatable thing
    var params = {
        name: "ThingworxPersistenceProvider"//"PersistenceDataProvider" /* PERSISTENCEPROVIDERNAME */
    };

    Things[name].SetPersistenceProvider(params);
    
    var params = {
        projectName: "IntegrationEngine" /* PROJECTNAME */
    };

    // no return
    Things[name].SetProjectName(params);
    group_name = Things[name].thingTemplate;
    if(isFlex){  //Initilize the hostproperties with default value to the newly created config if it is flex
        Things[name].InitilizeHostProperties();
    }
    if(isFTP) {
        Things[name].InitilizeFTPHostProperties();
    }
    if(isGooglePubSub) {
        Things[name].InitializeGooglePubSubHostProperties();
    }
    if(data_source_cat==="mapping"){ //of created onfig is mapping config then update the configJson of newly created mappingConfig
        var config_json = input.ConfigJson;
        Things[name].ConfigJson = config_json;
        var title = input.title;
		Things[name].Title = title;        
        sourceConfig = config_json.SourceConfig.Name;
        targetConfig = config_json.TargetConfig.Name;
        Things[name].SourceConfig = sourceConfig;
        Things[name].TargetConfig = targetConfig;
    }

    var params = {
        groupName: group_name /* STRING */,
        type: undefined  /* STRING */
    };

    // result: JSON
    var result = me.GetAllConfigs(params);
 result = {"result":{"Name":name, "Description":Things[name].description, "Group": Things[name].thingTemplate,"CanBeUsable":Things[name].canBeUsable}};
}catch(e){
    var result = {"error":[]};
    logger.warn("Exception in CreateConfig service :"+e.message);
}