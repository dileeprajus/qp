//INPUT: input(Json)
//Output: Json
try{
    var config = input.configName;
    var type = input.groupType;
    var arr = [];
    var result = {};

    var params = {
        tags: "Applications:IE;Applications:DynamicConfig;Applications:Mapping" /* TAGS */
    };

    // result: JSON
    var mappings = me.GetConfigsByTags(params);
	mappings = mappings["Configs"];
    for(var i=0;i<mappings.length;i++){
        var obj = {};
        if(type === 'source'){
            if(config === Things[mappings[i]].SourceConfig){
                obj["configName"] = mappings[i];
                obj["groupName"] = Things[mappings[i]].thingTemplate;
            	arr.push(obj);
            }
        } else if(type === 'target'){
            if(config === Things[mappings[i]].TargetConfig){
            	obj["configName"] = mappings[i];
                obj["groupName"] = Things[mappings[i]].thingTemplate;
            	arr.push(obj);
            }
        }
    }
    result = {"Configs":arr};

}catch(e){
    var result = {"error":e};
    logger.warn("Exception in GetAllMappingsForConfig service: "+e);
}
