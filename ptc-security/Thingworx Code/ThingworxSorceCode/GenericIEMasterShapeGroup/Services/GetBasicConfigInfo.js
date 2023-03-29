try{
    var config_name = me.name;
    var result = {};
    //var type = input.type; //type may be flex/soap/rest/static/mapping
    var type = me.dataSourceType;
    if(type.toLowerCase() === "static"){
    	var data;
        if(me.DataFormat==="JSON"){
            // result: JSON
            data = me.GetJSONData();
            data = JSON.stringify(data);
        }
        else if(me.DataFormat==="XML"){
            // result: XML
            data = me.GetXMLData();
            logger.warn("xmldata in basic"+data);
        }
        else if(me.DataFormat==="CSV"){
            // result: TEXT
            data = me.GetCSVData();
        }
        else{
        }

        result = {"Name":me.name,"Description":me.description,"ConfigJson":me.ConfigJson,"Group":me.thingTemplate,"inputSchema":me.inputSchema,"outputSchema":me.outputSchema,"CanBeUsable":me.canBeUsable,"Delimeter":me.CSVDelimeter,"DataFormat":me.DataFormat,"JSONData":me.JSONData,"DataSourceType":me.dataSourceType,"Data":data ? data : ''};
       // logger.warn("basicthing info");
    }else {
		var tempSchema = {};
        if(me.tags == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
           tempSchema = me.outputSchema;
        }
        if(me.tags == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
            tempSchema = me.inputSchema;
        }
        if(tempSchema['schema']!==undefined){
            tempSchema = tempSchema['schema'];
        }
        else{
            tempSchema = tempSchema;
        }
		Things[config_name].canBeUsable = false;
        
        var params = {
            input: tempSchema /* JSON */
        };

        // result: BOOLEAN
        var isValidSchema = me.isSchemaValid(params);
		if(isValidSchema){//change the canbeUsable property for config based on schema. 
           Things[config_name].canBeUsable = true;
        }else{
           Things[config_name].canBeUsable = false;
        }
        var configJson = Things[config_name].ConfigJson; 
        if(Things[config_name].dataSourceType==="Rest"){ // get the decrypted auth details of configjson.
            var confObj = Things[config_name].ConfigJson;
           var params = {
                input: {"configName":config_name, "configJson":Things[config_name].ConfigJson} /* JSON */
            };

            // result: STRING
            var stringifyResult = Things[config_name].HandleDecryption(params);
            configJson = JSON.parse(stringifyResult);                 
        }
		
        if(Things[config_name].dataSourceType==="FTP") {
            // result: JSON
            var ftpHostInfo = Things[config_name].GetFTPHostInfo();
        }
        result = {"Name":Things[config_name].name,"Description":Things[config_name].description,"ConfigJson": configJson,"inputSchema":me.inputSchema,"outputSchema":me.outputSchema,"Group":Things[config_name].thingTemplate,"CanBeUsable":Things[config_name].canBeUsable,"dataSourceType":me.dataSourceType, "ftpFileInfo": Things[config_name].ftpFileInfo,"ftpHostInfo":ftpHostInfo};
    	if(Things[config_name].dataSourceType==="Flex") {
           result["enableFlexTrigger"] = Things[config_name].enableFlexTrigger;
            result["enableFlexUpdateTrigger"] = Things[config_name].enableFlexUpdateTrigger;
            result["enableFlexDeleteTrigger"] = Things[config_name].enableFlexDeleteTrigger;
        }
        if(Things[config_name].dataSourceType==="Google Pub/Sub"){
             var googlePubSubHostInfo = Things[config_name].GetGooglePubSubHostInfo();
            result = {"Name":Things[config_name].name,"Description":Things[config_name].description,"ConfigJson": configJson,"inputSchema":me.inputSchema,"outputSchema":me.outputSchema,"Group":Things[config_name].thingTemplate,"CanBeUsable":Things[config_name].canBeUsable,"dataSourceType":me.dataSourceType, "googlePubSubHostInfo":googlePubSubHostInfo, "googlePubSubEditFileInfo":Things[config_name].googlePubSubEditFileInfo};
            var topic_Name = Things[config_name].googlePubSubEditFileInfo.topicName;
            var group_Name = Things[config_name].thingTemplate;
            if(Things[config_name].selectMode === 'Subscriber'){
                Things[config_name].GetListOfSubscriptions({input:{groupName : group_Name,topicName : topic_Name}});
                logger.warn("Service Called Check");
            }
        }
    }
	if(Things[config_name].tags != "Applications:IE;Applications:DynamicConfig;Applications:Mapping"){
        result["TenantID"] = Things[config_name].tenantID ? Things[config_name].tenantID : "";
    } else {
        result["TenantID"] = Things[config_name].tenantID ? Things[config_name].tenantID : "";
    	result["GroupType"] = "mapping";
    }
    if(Things[config_name].tags == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
        result["GroupType"] = "source";
    }
    if(Things[config_name].tags == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
 		result["GroupType"] = "target";
    } 
}catch(e){
    var result={};
    logger.warn("Exception in GetBasicConfigInfo service in config: "+e.message);
}