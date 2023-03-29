//INPUTS groupName(String), type(String)
// OUTPUTS: result(JSON)
try{
    var result = {};
    var configs_arr = [];
    var group_name = groupName;
    var obj = {};
    //logger.warn("GetAllConfigs input is : "+groupName);
    if(type==="allSourceConfigs"||type==="allTargetConfigs"){
        var tempTags = "";
        if(type==="allSourceConfigs"){
        	tempTags = "Applications:IE;Applications:DynamicConfig;Applications:Source";
        } else if(type==="allTargetConfigs"){
            tempTags = "Applications:IE;Applications:DynamicConfig;Applications:Target";
        }else{}
            var params = {
            maxItems: 500 /* NUMBER */,
            modelTags: tempTags /* TAGS */,
        };

        // result: INFOTABLE dataShape: SearchResults
        var configs = Resources["SearchFunctions"].SearchThings(params);
        obj = configs.ToJSON().rows[0].thingResults;        
    } else{
        var params = {
            maxItems: 100 /* NUMBER */,
            nameMask: "" /* STRING */,
            query: "" /* QUERY */,
            thingTemplate: group_name /* THINGTEMPLATENAME */,
            tags: "Applications:IE;Applications:DynamicConfig" /* TAGS */
        };

        // table: INFOTABLE dataShape: RootEntityList
        var table = Resources["SearchFunctions"].SearchThingsByTemplate(params);

        obj = table.ToJSON();
    }
	
    
    //logger.warn("total configs after creation/deletion in current group is: "+obj.rows.length);
    for(var i=0;i<obj.rows.length;i++){        //loop through the object rows, get the thing name,description and configJson property in jsonObj and push that object to thing_arr
        var jsonObj = {};
        jsonObj["Name"] = obj.rows[i].name;
        jsonObj["Description"] = obj.rows[i].description;
        jsonObj["ConfigJson"] = Things[obj.rows[i].name].ConfigJson;
        if(Things[obj.rows[i].name].dataSourceType==="Rest"){ //Get the decrypted auth details of config json
           var confObj = Things[obj.rows[i].name].ConfigJson;
			var params = {
                input: {"configName":obj.rows[i].name, "configJson":Things[obj.rows[i].name].ConfigJson} /* JSON */
            };

            // result: STRING
            var stringifyResult = Things[obj.rows[i].name].HandleDecryption(params);
//            var sp = {
//                input: confObj/* JSON */
//            };
//
//            // result: STRING
//            var strResult = me.ObjectStringify(sp);
//            var params = {
//                input: {"ConfigJson": JSON.parse(strResult)} /* JSON */
//            };
//
//            // result: JSON
//            var decryptedResult = Things[jsonObj["Name"]].GetDecryptedObjVal(params);
//            var sp1 = {
//                input: decryptedResult /* JSON */
//            };
//
//            // result: STRING
//            var stringifyResult = me.ObjectStringify(sp1);
            jsonObj["ConfigJson"] = JSON.parse(stringifyResult);             
        }
        jsonObj["Group"] = Things[obj.rows[i].name].thingTemplate;
        jsonObj["CanBeUsable"] = Things[obj.rows[i].name].canBeUsable;
        jsonObj["DataSourceType"] = Things[obj.rows[i].name].dataSourceType;
        jsonObj["PriorityOrder"] = Things[obj.rows[i].name].PriorityOrder;
        if(Things[obj.rows[i].name].tags=="Applications:IE;Applications:DynamicConfig;Applications:Mapping"){
        	var sourceConfig = Things[obj.rows[i].name].SourceConfig;
            var targetConfig = Things[obj.rows[i].name].TargetConfig;
            jsonObj["SelectedSourceType"] = Things[sourceConfig].dataSourceType;
            jsonObj["SelectedTargetType"] = Things[targetConfig].dataSourceType;
            jsonObj["Title"] = Things[obj.rows[i].name].Title;
        } 
        	jsonObj["TenantID"] = Things[obj.rows[i].name].tenantID ? Things[obj.rows[i].name].tenantID : "";
        
     	if(type==="restore"||type==="delete"){ //if type is restore then service is calling from restoreGroup, so we need to send all configs whether active is false or true
           configs_arr.push(jsonObj);
        } else{
            if(Things[obj.rows[i].name]){
                if(Things[obj.rows[i].name].isActive){
                   configs_arr.push(jsonObj);
                }
            }
        }
    }

    result = {"Configs":configs_arr};
   // logger.warn("Result for GetAllConfigs service: "+JSON.stringify(result));
}
catch(e){
    var result = {"Configs":[]};
    logger.warn("Exception in GetAllConfigs service: "+e);
}
