try{
    var type = input.type;
    var temp_config = Things["GenericIEMasterConfig"].FlexDynamicGroupConfig;
    if(type === "socket"){
        temp_config = Things["GenericIEMasterConfig"].SocketDynamicGroupConfig;
    }else if(type === "database"){
        temp_config = Things["GenericIEMasterConfig"].DataBaseDynamicGroupConfig;
    }else if(type === "FTP") {
        temp_config = Things["GenericIEMasterConfig"].FTPDynamicGroupConfig;
    }else if(type === "Publisher") {
        temp_config = Things["GenericIEMasterConfig"].GooglePubSubDynamicGroupConfig;
    }
    var groupName = input.groupName;
    var host_props = input.hostProperties;
    if(temp_config[groupName] !== undefined || temp_config[groupName]){

        //call Remove property defintion service if template contains property or not (call any case)
        var params = {
            groupName: groupName /* STRING */,
            propName: "BoilerPlateConfig" /* STRING */
        };

        // result: JSON
        var remove_prop_result = me.DeletePropertyDefintion(params);
       // logger.warn("Result for removeprop service"+remove_prop_result);
    }
    var params = {
        groupName: groupName /* STRING */,
        propertyName: "BoilerPlateConfig" /* STRING */,
        defaultValue: {"value":host_props} /* STRING */,
        dataType: "JSON" /* STRING */,
        description: "This is the property which holds the group host properties with default or updated values" /* STRING */,
        dataChangeType: "ALWAYS" /* STRING */,
        persistent: true /* BOOLEAN */
    };

    me.CreatePropertyDefintion(params);

    temp_config[groupName] = host_props;
    if(type === "socket"){
        Things["GenericIEMasterConfig"].SocketDynamicGroupConfig = temp_config;        //update SocketDynamicGroupConfig config property with new template host props
        var result = Things["GenericIEMasterConfig"].SocketDynamicGroupConfig[groupName];
    }else if(type === "database"){
        Things["GenericIEMasterConfig"].DataBaseDynamicGroupConfig = temp_config;        //update DataBaseDynamicGroupConfig config property with new template host props
        var result = Things["GenericIEMasterConfig"].DataBaseDynamicGroupConfig[groupName];
    }else if(type === "FTP"){
        Things["GenericIEMasterConfig"].FTPDynamicGroupConfig = temp_config;        //update FTPDynamicGroupConfig config property with new template host props
        var result = Things["GenericIEMasterConfig"].FTPDynamicGroupConfig[groupName];
        var params = {
            groupName: groupName /* STRING */,
            type: undefined
        };
        // result: JSON
        var tmp_configs = me.GetAllConfigs(params);
        tmp_configs = tmp_configs["Configs"]
        for(var i=0;i<tmp_configs.length;i++){
            var tName = tmp_configs[i].Name;
            var params = {
                input: host_props /* JSON */
            };
            // result: JSON
            var host_test = Things[tName].SetFTPHostInfo(params);
        }
        var obj = {
            "action": "connect",
            "hostProperties": host_props,
            "ftpFileInfo":{}
        }
        var params = {
            ftpJSON: obj  /* JSON */
        };
        // result: JSON
        var result = Things["FTPConfig"].CheckFTPConnection(params);
      Things["GenericIEMasterConfig"].GooglePubSubDynamicGroupConfig = temp_config;        //update GooglePubSubDynamicGroupConfig config property with new template host props
        var result = Things["GenericIEMasterConfig"].GooglePubSubDynamicGroupConfig[groupName];
        var params = {
            groupName: groupName /* STRING */,
            type: undefined
        };
        // result: JSON
        var tmp_configs = me.GetAllConfigs(params);
        tmp_configs = tmp_configs["Configs"]
        for(var i=0;i<tmp_configs.length;i++){
            var tName = tmp_configs[i].Name;
            var params = {
                input: host_props /* JSON */
            };
            // result: JSON
            var host_test = Things[tName].SetGooglePubSubHostInfo(params);
        }
         // result: JSON
     var result = Things["GCPAuthSvcThing"].LoginInputJSON({
	    privateKey: host_props.privateKey.fileData /* JSON */,
	    Scope: "https://www.googleapis.com/auth/pubsub" /* STRING */
      });
     }else {// for now else means type is flex
        Things["GenericIEMasterConfig"].FlexDynamicGroupConfig = temp_config;        //update FlexDynamicGroupConfig config property with new template host props
        var result = Things["GenericIEMasterConfig"].FlexDynamicGroupConfig[groupName];
        var params = {
            groupName: groupName /* STRING */,
            type: undefined
        };

        // result: JSON
        var tmp_configs = me.GetAllConfigs(params);

        tmp_configs = tmp_configs["Configs"];
        for(var i=0;i<tmp_configs.length;i++){
            var tName = tmp_configs[i].Name;
            var params = {
                input: host_props /* JSON */
            };
            // result: JSON
            var host_result = Things[tName].SetHostProperties(params);
        }
    }

}
catch(e){
    var result = {"error":e.message};
    logger.warn("Exception in SetGroupHostProperties service: "+e.message);
}
