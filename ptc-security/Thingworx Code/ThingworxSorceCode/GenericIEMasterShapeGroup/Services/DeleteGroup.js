//INPUTS input(String), isHardDelete(BOOLEAN)
// OUTPUTS: JSON
try{
    //TODO: Group deletion should be like soft/hard (archive). if group deletion is called from sourceGroup/TargetGroup/MappingGroup screen
    // then archive the Group(soft delete means update Group property isActive to false).
    //If Group deletion is called from archivedGroups page then completely delete the Group from composer
    
    
    //To delete Group first delete all things under the given input Group
    //first get all the configs under input Group
    // then delete all the configs and then delete the Group
    //TODO if the template is source or target first find whether the Group is used in any mapping Groups
    // if yes first soft delete that mapping Group and then delete given source/target Group
    var result={};
    var data_source = me.GroupDataSourceType;
    var data_source_type = data_source[input].dataSourceType;
    var temp_tags = ThingTemplates[input].GetTags();
    if(isHardDelete){ //check if the Groups is dependent in any other Group, if yes remove all the dependents first
        
        
        if(temp_tags=="Applications:IE;Applications:DynamicGroup;Applications:Source"||temp_tags=="Applications:IE;Applications:DynamicGroup;Applications:Target"){//check dependents if the Group is source or taget
        	//Find all dependent mapping Groups
            //first get all mapping Groups
            var mapping_groups=[];

            var params = {
                tags: "Applications:IE;Applications:DynamicGroup;Applications:Mapping" /* TAGS */
            };

            // result: JSON
            mapping_groups = me.GetConfigsByTags(params);
            mapping_groups = mapping_groups.Configs; //mapping_groups variable is an array of dyanmically created mapping config names
            for(var i=0;i<mapping_groups.length;i++){ // loop through with all mapping config names and check given input is used in the mapping config
                var source_group = data_source[mapping_groups[i]].selectedSourceGroup;
                var target_group = data_source[mapping_groups[i]].selectedTargetGroup;
                if(input==source_group||input==target_group){ //if given input config is as source or target config in mapping config[i], so delete that mapping config
                    var params = {
                        input: mapping_groups[i] /* THINGTEMPLATENAME */,
                        isHardDelete: true /* BOOLEAN */
                    };

                    // result: JSON
                    var mapping_delete_result = me.DeleteGroup(params);
                }
            }//end of for loop
            
        }//end of if condition
		logger.warn("Given Group name to delete is: "+input);
        var params = {
            groupName: input /* STRING */,
            type: "delete"
        };

        // result: JSON
        var allConfigs = me.GetAllConfigs(params);
        if(allConfigs["Configs"]){
            allConfigs = allConfigs["Configs"];
        }else allThings = [];
        for(var i=0; i<allConfigs.length;i++){
         var configName = allConfigs[i]["Name"];
            logger.warn("config name to delete: "+configName);
            var params = {
                input: configName /* THINGNAME */
            };

            // result: JSON
            var configDelete_result = me.DeleteConfig(params);
        }    
       
        var isFlex= false;
        if(data_source_type !=='' && data_source_type.toLowerCase()==="flex"){
         isFlex = true;
        }

        var params = {
            name: input /* THINGTEMPLATENAME */
        };

        // no return
        Resources["EntityServices"].DeleteThingTemplate(params);
        logger.warn("Group "+input+" Successfully");
        if(isFlex||data_source_type.toLowerCase()==="flex"){ //if flex remove the default hostproperties object from flexDynamicGroupConfig property
            var temp_config = me.FlexDynamicGroupConfig;
            delete temp_config[input];
            me.FlexDynamicGroupConfig = temp_config;
        }
        if(data_source_type.toLowerCase()==="soap"){
            var temp_config = me.SoapDynamicGroupConfig;
            delete temp_config[input];
            me.SoapDynamicGroupConfig = temp_config;
        }
        if(data_source_type.toLowerCase()==="socket"){
            var temp_config = me.SocketDynamicGroupConfig;
            delete temp_config[input];
            me.SocketDynamicGroupConfig = temp_config;
        }if(data_source_type.toLowerCase()==="database"){
            var temp_config = me.DataBaseDynamicGroupConfig;
            delete temp_config[input];
            me.DataBaseDynamicGroupConfig = temp_config;
        }
        if(data_source_type.toLowerCase()==="ftp"){
            var temp_config = me.FTPDynamicGroupConfig;
            delete temp_config[input];
            me.FTPDynamicGroupConfig = temp_config;
        }
        delete data_source[input]; //remove the group basic details from GroupDataSourceType json object
        me.GroupDataSourceType = data_source; //update the groupDatasourcetype property
        result = {"Success":"Template Deleted Successfully"};    	
    } else{//soft delete . so change the group isActive property from true to false and update the group data in generic master config property
    	data_source[input]["isActive"]=false;
         me.GroupDataSourceType = data_source; //update the groupDatasourcetype property
        
        //first delete the property and then recreate the property because the entity is thingtemplate
        if(data_source[input] !== undefined || data_source[input]){    
            //call Remove property defintion service if template contains property or not (call any case)
            var params = {
                groupName: input /* STRING */,
                propName: "isActive" /* STRING */
            };

            // result: JSON
            var remove_prop_result = me.DeletePropertyDefintion(params);
            logger.warn("Result for removeprop service"+remove_prop_result);
        }
        
        // Create property isActive for newly create group. this property will used while deletion of Group
        var params = {
            groupName: input /* STRING */,
            propertyName: "isActive" /* STRING */,
            defaultValue: {"value":false} /* JSON */,
            dataType: "BOOLEAN" /* STRING */,
            description: "This property will tell you the current group is either active or not" /* STRING */,
            dataChangeType: "ALWAYS" /* STRING */,
            persistent: true /* BOOLEAN */
        };

        me.CreatePropertyDefintion(params);
        var allConfParams = {
            groupName: input /* STRING */,
            type: "delete" /* STRING */
        };

        // result: JSON
        var allConfResult = me.GetAllConfigs(allConfParams);
        allConfResult=allConfResult["Configs"];
        for(var x=0;x<allConfResult.length;x++){
        	var confName = allConfResult[x].Name;
            Things[confName].isActive = false;
            if(temp_tags=="Applications:IE;Applications:DynamicGroup;Applications:Source"){ //disable the scheduler config if the current source config is inactive

                //first get all mapping Groups
                var scheduler_configs=[];

                var params = {
                    tags: "Applications:IE;Applications:DynamicConfig;Applications:Scheduler" /* TAGS */
                };

                scheduler_configs = me.GetConfigsByTags(params);
                scheduler_configs = scheduler_configs.Configs; //scheduler_configs variable is an array of dyanmically created scheduler config names
                logger.warn("ScheulerCONFFFFFF: "+scheduler_configs);
                for(var i=0;i<scheduler_configs.length;i++){ // loop through with all scheduler config names and check given input is used in the scheduler config
                    var source_config = Things[scheduler_configs[i]].configName;
                    if(confName==source_config){ //if given input config is as source  config in sceduler config[i], so delete that scheduler config

                        Things[scheduler_configs[i]].Enabled = false;
                        // change the enable value of settings table modal_store
                        var params1 = {
                            tableName: 'Settings' /* STRING */
                        };

                        // result: INFOTABLE dataShape: "undefined"
                        var settingsResult = Things[scheduler_configs[i]].GetConfigurationTable(params1);
                        settingsResult = settingsResult.ToJSON().rows[0];
                        var cronStr = settingsResult.schedule;
                        var obj = {"rows":[{"runAsUser":"","schedule":cronStr,"enabled":false}
                                          ],"dataShape":{"fieldDefinitions":{"runAsUser":{"name":"runAsUser","aspects":{
                                          },"description":"User context in which to run event handlers","baseType":"USERNAME","ordinal":0}
                                                                             ,"schedule":{"name":"schedule","aspects":{"defaultValue":"0 0/7 * * * ?"}
                                                                                          ,"description":"Execution Schedule (Cron String)","baseType":"SCHEDULE","ordinal":0}
                                                                             ,"enabled":{"name":"enabled","aspects":{"defaultValue":true}
                                                                                         ,"description":"Automatically enable scheduler on startup","baseType":"BOOLEAN","ordinal":0}
                                                                            }}
                                  };

                        var params = {
                            json: obj /* JSON */
                        };

                        // result: INFOTABLE
                        var table = Resources["InfoTableFunctions"].FromJSON(params);


                        var params = {
                            configurationTable: table /* INFOTABLE */,
                            persistent: true /* BOOLEAN */,
                            tableName: 'Settings' /* STRING */
                        };

                        Things[scheduler_configs[i]].SetConfigurationTable(params);
                        break;
                    }
                }//end of for loop

            }//end of if condition
        }
    }  
 

}catch(e){
    var result = {"Exception":e};
    logger.warn("Exception in DeleteGroup service: "+e);
}
