//INPUTS : Nothingg
//Output: result(JSON)
try{
    var result = {};
	var arr = [];
    var params = {
        tags: "Applications:IE;Applications:DynamicConfig;Applications:Mapping" /* TAGS */
    };

    // result: JSON
    var mappingConfigs = me.GetConfigsByTags(params);
	mappingConfigs = mappingConfigs["Configs"];
    //result = mappingConfigs;
    for(var i=0;i<mappingConfigs.length;i++){
        var obj = {};
		var mapConfName = mappingConfigs[i];
        var sourceConfig = Things[mapConfName].SourceConfig;
        var targetConfig = Things[mapConfName].TargetConfig;
        var primaryKey = "";
        if(Things[sourceConfig]&&Things[targetConfig]){
            if(Things[sourceConfig].ConfigJson){
                if(Things[sourceConfig].ConfigJson["PrimaryKey"]){
                    primaryKey = Things[sourceConfig].ConfigJson["PrimaryKey"];
                }
            }
          obj={
          "source_group_name": Things[sourceConfig].thingTemplate,
          "source_config_name": sourceConfig,
          "target_group_name": Things[targetConfig].thingTemplate,
          "target_config_name": targetConfig,
          "mapping_group_name": Things[mapConfName].thingTemplate,
          "mapping_config_name": mapConfName,
          "primary_key_at_dataprovider": primaryKey
      };
        arr.push(obj);
        }
        
    }
    result = {"result":arr};
}catch(e){
    var result = {"result":e};
    logger.warn("Exception in GetAllMCCData service: "+e);
}
//var result = {"Sucess": "GetALLMCCDATA called "};
