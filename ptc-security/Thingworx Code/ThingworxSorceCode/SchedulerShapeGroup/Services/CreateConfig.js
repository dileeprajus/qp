//Inputs: input(JSON)
//output: result(JSON)
try{
    var name = input.name;
    var description = input.description;
    var group_name = "SchedulerGroup";//input.group_name
    var tags = "Applications:IE;Applications:DynamicConfig;Applications:Scheduler";
    var configName = input.configName;
    
    var params = {
        name: name /* STRING */,
        description: description /* STRING */,
        thingTemplateName: group_name /* THINGTEMPLATENAME */,
        tags: tags /* TAGS */
    };
    // no return
    Resources["EntityServices"].CreateThing(params);
    
    Things[name].EnableThing();
    Things[name].RestartThing();
        
    var params = {
        projectName: "IntegrationEngine" /* PROJECTNAME */
    };

    // no return
    Things[name].SetProjectName(params);
    Things[name].configName = configName;
    
    //disable the configuration for scheduler after creation: by default it is enabled.
    var params = {
        configName: name /* STRING */,
        input: {"configName":name,"cronString":"0 0/1 * * * ?", "enabled":false} /* JSON */,
        cronString: "0 0/1 * * * ?" /* STRING */,
        enabled: false /* BOOLEAN */
    };

    // result: INFOTABLE
    var setConfResult = Things["GenericIEMasterConfig"].SetCronConfigurationForSchedular(params);


    var result = {"result":{"Name":name, "Description":Things[name].description, "Group": Things[name].thingTemplate,"configName":Things[name].configName}};
}
catch(e) {
    var result = {"exception":e};
    logger.warn("Exception in CreateConfig service in SchedulerShapeGroup: "+e);
}
