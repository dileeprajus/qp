try{
    //TODO if the config is source or target first find whether the config is used in any mapping config
   // if yes first soft delete that mapping config and then delete given source/target config

   // result: TAGS
   var temp_tags = Things[input].GetTags();
var triggerflag="Success";




   if(temp_tags=="Applications:IE;Applications:DynamicConfig;Applications:Source"||temp_tags=="Applications:IE;Applications:DynamicConfig;Applications:Target"){//this condition is only for if the thing is source thing or target config not for mapping config
       //Get all mapping configs to find the given input config is used in mapping either as source or target
       var mapping_configs=[];



       var params = {
           tags: "Applications:IE;Applications:DynamicConfig;Applications:Mapping" /* TAGS */
       };



       // result: JSON
       mapping_configs = me.GetConfigsByTags(params);
       mapping_configs = mapping_configs.Configs; //mapping_configs variable is an array of dyanmically created mapping config names
       for(var i=0;i<mapping_configs.length;i++){ // loop through with all mapping config names and check given input is used in the mapping config
           var source_config = Things[mapping_configs[i]].SourceConfig;
           var target_config = Things[mapping_configs[i]].TargetConfig;
           if(input==source_config||input==target_config){ //if given input config is as source or target config in mapping config[i], so delete that mapping config
               var params = {
                   input: mapping_configs[i] /* THINGNAME */
               };



               // result: JSON
               var mapping_delete_result = me.DeleteConfig(params);
           }
       }//end of for loop
   }//end of if condition



   //ApplicationsIEApplicationsDynamicGroupApplicationsTarget
   // result: TAGS
   var enableAPI = false; //this variable is used to call the flex triggerConfig API to update the flex connection config json of deleted thing

   var name = input;
   if(temp_tags=="Applications:IE;Applications:DynamicConfig;Applications:Source"&&Things[name].dataSourceType.toLowerCase()==="flex"){ //check if the the thing is flex type and source flex
       enableAPI = true;
       //call the flex trigger api with updated flex connection config json
       var params = {
           fromDelete: true /* BOOLEAN */
       };



       // result: JSON
       var setup_result = Things[input].SetupFlexConnectionConfiguration(params);

       if (setup_result.hasOwnProperty('Status')) {
           triggerflag=setup_result.Status;
           }
       else{
           triggerflag="Exception";
       }


logger.warn("called from GISG DeleteConfig"+JSON.stringify(setup_result));
   }



if(triggerflag=="Success")
  {   if(temp_tags=="Applications:IE;Applications:DynamicConfig;Applications:Source"){ //check if the the thing is source type and check if there is arny scheduler config under that source, if yes delete that scheduler config
        var scheduler_configs=[];



       var params = {
           tags: "Applications:IE;Applications:DynamicConfig;Applications:Scheduler" /* TAGS */
       };



       // result: JSON
       scheduler_configs = me.GetConfigsByTags(params);
       scheduler_configs = scheduler_configs.Configs; //mapping_configs variable is an array of dyanmically created mapping config names
       for(var i=0;i<scheduler_configs.length;i++){ // loop through with all mapping config names and check given input is used in the mapping config
           var source_config = Things[scheduler_configs[i]].configName;
           if(input==source_config){ //if given input config is as source  config in sceduler config[i], so delete that scheduler config
               var params = {
                   name: scheduler_configs[i] /* THINGNAME */
               };



               // result: JSON
               var scheduler_delete_result = Resources["EntityServices"].DeleteThing(params);
             break;
         }
      }//end of for loop
  }
   var groupName = Things[name].thingTemplate;
   //logger.warn("thingname and group name "+name+"   "+groupName);
   Things[name].RestartThing();
   Things[name].EnableThing();
   Things[name].RestartThing();
   var params = {
       name: name /* THINGNAME */
   };



   // no return
  Resources["EntityServices"].DeleteThing(params);


   var params = {
       groupName: groupName /* STRING */
   };



   // result: JSON
   var result = Things["GenericIEMasterConfig"].GetAllConfigs(params);


  //To remove mappings List from getMappingConfigsData propery to update new mappings when any new config created
    Things['GenericIEMasterConfig'].getMappingConfigsData = {};
}}




catch(e){
   var result = {"Cant delete config: ":e.message};
   logger.warn("Exception in delete config service: "+e.message);
}
