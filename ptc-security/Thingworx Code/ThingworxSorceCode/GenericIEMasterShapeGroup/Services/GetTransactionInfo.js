//Inputs : Nothing
//Output: JSON
try{
    var result = {};
    var mapping_configs = {"Configs":[]};
    var client_configs = {"Configs":[]};
    var mapping_tags = "Applications:IE;Applications:DynamicConfig;Applications:Mapping";
    var client_tags = "Applications:IE;Applications:DynamicConfig;Applications:Target";
    function getConfigsByTags(temp_tags){
    	 var params = {
            tags: temp_tags /* TAGS */
        };

        // result: JSON
        var config_result = me.GetConfigsByTags(params);
        return config_result["Configs"];
    }
   	mapping_configs["Configs"] = getConfigsByTags(mapping_tags);
    client_configs["Configs"] = getConfigsByTags(client_tags);
	result["Mappings"] = mapping_configs;
    result["Targets"] = client_configs;

}catch(e){
    var result = {};
}