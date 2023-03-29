// result: JSON
var result = {};
try {
	var boilerplate_config = me.BoilerPlateConfig;
	var group = input.Name;
	var config = Things["GenericIEMasterConfig"].FlexDynamicGroupConfig;
    logger.warn("Configuration Check"+JSON.stringify(config));
	boilerplate_config = config[group];
     logger.warn("Bolier Plate check"+JSON.stringify(boilerplate_config));
	if (boilerplate_config !== undefined) {
		var params = {
			headers: {
				"Content-Type": "application/json"
			},
			url: boilerplate_config.hostname + "/" + boilerplate_config.midpoint + "/getFlexObjects",
			password: boilerplate_config.password,
			username: boilerplate_config.username
		};
		var flex_obj_list = Resources["ContentLoaderFunctions"].GetJSON(params);
		if (Object.keys(flex_obj_list).length > 1 && flex_obj_list !== undefined) {
			var configsList = Things["GenericIEMasterConfig"].GetAllConfigs({
				groupName: group /* STRING */ ,
				type: "source" /* STRING */
			});
			var configs = configsList.Configs;
			if (configs.length) {
                var sstr = '';
                var fstr = '';
                var success = {};
                var failure = {};
				for (var i = 0; i < configs.length; i++) {
					if (configs[i]['CanBeUsable'] === true) {
						var ConfigJson_temp = configs[i]['ConfigJson'];
						var ConfigName = configs[i]['Name'];
						var selected_ouput_schema = ConfigJson_temp['SelectedOutputSchema'];
						var selected_Flex_obj = ConfigJson_temp['SelectedFlexObjects'];
						// result: JSON
						var hierarchylist = Things[ConfigName].GetTypeHierarchy({
							input: {
								"inputs": selected_Flex_obj
							} /* JSON */
						});
						var type_hierarchy = ConfigJson_temp['temp_hierarchy_name'];
						var typeid = hierarchylist[selected_Flex_obj][type_hierarchy];
						// result: JSON
						selected_Flex_obj = selected_Flex_obj[0];
						var Schema = Things[ConfigName].GetSchemaByTypeID({
							input: {
								"inputs": [{
									flexObject: selected_Flex_obj,
									typeId: typeid
								}]
							} /* JSON */
						});
						if (Things[ConfigName].tags == "Applications:IE;Applications:DynamicConfig;Applications:Source") {
							ConfigJson_temp['SelectedOutputSchema'] = Schema;
							Things[ConfigName].outputSchema = ConfigJson_temp['SelectedOutputSchema'];
							Things[ConfigName].ConfigJson = ConfigJson_temp;
						} else if (Things[ConfigName].tags == "Applications:IE;Applications:DynamicConfig;Applications:Target") {
							ConfigJson_temp['SelectedInputSchema'] = Schema;
							Things[ConfigName].inputSchema = ConfigJson_temp['SelectedInputSchema'];
							Things[ConfigName].ConfigJson = ConfigJson_temp;
						}
						sstr = sstr + ' ' + configs[i].Name;
						 success = {"status": "Success","data": sstr};
                        logger.warn("configuration name "+ConfigName+"Flex Trigger "+Things[ConfigName]['enableFlexTrigger']);
                         var endpointsobj = {};
                        if(Things[ConfigName]['enableFlexTrigger']){
                          endpointsobj.create_trigger = Things[ConfigName]['enableFlexTrigger'];
                          endpointsobj.update_trigger = Things[ConfigName]['enableFlexUpdateTrigger'];
                          endpointsobj.delete_trigger = Things[ConfigName]['enableFlexDeleteTrigger'];
                         var enable_params = {
fromDelete: false /* BOOLEAN */,
                         endpointsobj : endpointsobj
           				 };
            			var enable_result = Things[ConfigName].SetupFlexConnectionConfiguration(enable_params);
                        }
                        else{
                          endpointsobj.create_trigger = Things[ConfigName]['enableFlexTrigger'];
                          endpointsobj.update_trigger = Things[ConfigName]['enableFlexUpdateTrigger'];
                          endpointsobj.delete_trigger = Things[ConfigName]['enableFlexDeleteTrigger'];
                        var disable_params = {
fromDelete: false /* BOOLEAN */,
                         endpointsobj : endpointsobj
           				 };
            			var disbale_result = Things[ConfigName].SetupFlexConnectionConfiguration(disable_params);
                        
                        }
					} else {
						fstr = fstr + ' ' + configs[i].Name;
						 failure = {"status": "failure","data": fstr};
					}
                }
                if(failure["data"] !== undefined && failure["data"].length > 0)
            	{
            	result = {"status":"Failure","value":fstr};
           	    }
                else{
                result = {"status":"Success","value":sstr};
                }
			}
            else {
				result = {
					"status": "No Configs to update"
				};
			}
		} else {
			result = {
				"status": "Failed to connect to FlexPLM Server"
			};
		}
	} else {
        if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
		logger.warn("Please provide the host details");
        }
		result = {
			"status": "Wronghost"
		};
	}
} catch (e) {
	logger.warn('Error in Flex Domain Updates' + e.message);
 	result = {
		"status": "Error in domain updation"
	};
}