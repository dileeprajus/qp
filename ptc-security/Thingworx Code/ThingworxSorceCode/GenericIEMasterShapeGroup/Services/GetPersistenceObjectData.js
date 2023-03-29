//INPUTS input(JSON)
//OUTPUTS: result(JSON)
try{
    var configName =  input.configName;
    var retriveFor = input.type;
    var filterType = input.filterType; //to retrive the data by date or week.
    //var providerPackageName = Subsystems["PlatformSubsystem"].GetAllPersistenceInformation().ToJSON().rows[0]["persistenceProviderPackage"];
	var providerPackageName = Subsystems["PlatformSubsystem"].GetDefaultDataPersistenceProviderPackageName();
    if(retriveFor === "Dashboard" || retriveFor ==="GenericIEMasterConfig"){
        var q = "source_type='Thing' AND entity_id!='IELogsDataTable' ORDER BY time DESC LIMIT 100";
        if (filterType !== '' && filterType === 'date') {
        	q = "entity_id='IELogsDataTable' AND time between '" + input.fromDate + "' and '" + input.toDate + "'";
        }
        var params = {
            query: q/* STRING */,
            configName: configName /* configName */
        };

        // result: INFOTABLE
        var logs_result = Things["IEDatabaseConfig"].getDataTablesData(params);
    } else if (retriveFor === "Config"){
        var tempConfigType = "";
        if(Things[configName].tags == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
            tempConfigType = "Source";        	
        } else if(Things[configName].tags == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
        	tempConfigType = "Target";
        } else {}
        
        var str ="select * from data_table where entity_id='"+configName+"' ORDER BY time DESC LIMIT 100";
        if(providerPackageName === "PostgresPersistenceProviderPackage"){
            str = "select * from data_table where entity_id='"+configName+"' ORDER BY time DESC LIMIT 100";
        } else { //for MSSql
            str = "select TOP 100 * from data_table where entity_id='"+configName+"' ORDER BY time DESC";
        }
        if (filterType !== '' && filterType === 'date' && providerPackageName === "PostgresPersistenceProviderPackage") {
            str = "select * from data_table where entity_id='"+configName+"' AND time between '" + input.fromDate + "' and '" + input.toDate + "' LIMIT 200";
        } else if (filterType !== '' && filterType === 'date' && providerPackageName === "MssqlPersistenceProviderPackage") {
             str = "select TOP 200 * from data_table where entity_id='"+configName+"' AND time between '" + input.fromDate + "' and '" + input.toDate + "'";
        } else {}
        
        //var str="entity_id='"+configName+"' ORDER BY time DESC LIMIT 100";
        //logger.warn("Query conditon: "+str);
        var params = {
            query: str /* STRING */,
            configName: configName /* configName */
        };

        // result: INFOTABLE
        var logs_result = Things["IEDatabaseConfig"].getDataTablesData(params);
    }
    

    var logArr = logs_result.ToJSON().rows;
   if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    logger.warn("config type: "+tempConfigType+"ROWSSSS DATA:: "+logArr);
   }
	var arr = [];
    for(var i=0;i<logArr.length;i++){
        var entityID = logArr[i]["entity_id"]; // entity_Id is nothing but config name
        var fieldValuesStr = logArr[i]["field_values"];
        var fieldValuesObj = JSON.parse(fieldValuesStr);
        var obj={};
        var entityType = "";
        //logger.warn("ENTITY IDDD: "+entityID);
        if(Things[entityID].tags == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
            entityType = "Source";
        }else if(Things[entityID].tags == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
            entityType = "Target";
        }else{}
        if(tempConfigType === "Source" || entityType === "Source"){
           obj["configName"]=fieldValuesObj["source_config_name"]; 
            if(fieldValuesObj["source_group_name"]){
                obj["groupName"]=fieldValuesObj["source_group_name"];
            }else if(fieldValuesObj["source_config_name"]){
                obj["groupName"]=Things[fieldValuesObj["source_config_name"]].thingTemplate;
            }
            obj["primaryKey"] = fieldValuesObj["primary_key_at_dataprovider"];
			obj["createdAtDataProvider"] = fieldValuesObj["created_at_dataprovider"];
            obj["updatedAtDataProvider"] = fieldValuesObj["updated_at_dataprovider"];
        } else if(tempConfigType === "Target" || entityType === "Target"){
			obj["configName"]=fieldValuesObj["target_config_name"]; 
            if(fieldValuesObj["target_group_name"]){
                obj["groupName"]=fieldValuesObj["target_group_name"];
            }else if(fieldValuesObj["source_config_name"]){
                obj["groupName"]=Things[fieldValuesObj["target_config_name"]].thingTemplate;
            }
            if(retriveFor === "Dashboard"){
                obj["primaryKey"] = fieldValuesObj["id"]; 
            } else if(retriveFor === "Config"){
              obj["id"] = fieldValuesObj["id"];            
            } else{}
        } else {}
        
        if(retriveFor === "Config"){
            obj["configType"]=tempConfigType;
        }else if(retriveFor === "Dashboard"){
            obj["configType"]=entityType;
        } else {}
        obj["configType"]=tempConfigType;        
        obj["createdAt"]=fieldValuesObj["created_at"];
        obj["updatedAt"]=fieldValuesObj["updated_at"];
        //obj["convertedData"]=JSON.stringify(fieldValuesObj["converted_data"]);
        obj["convertedData"]=fieldValuesObj["converted_data"];
        //obj["rawData"]=JSON.stringify(fieldValuesObj["raw_data"]);
        obj["rawData"]=fieldValuesObj["raw_data"];
//        if(fieldValuesObj["tag"]){
//         	var tagArr=fieldValuesObj["tag"];
//            var str="";
//            for(var k=0;k<tagArr.length;k++){
//                if(k===0){
//                	str=str+tagArr[k].vocabulary+":"+tagArr[k].vocabularyTerm;
//                }else if(k<=tagArr.length-1){
//                	str=str+"; "+tagArr[k].vocabulary+":"+tagArr[k].vocabularyTerm;
//                } else {}                    
//            }
//            obj["tag"]=str;
//        }
        if(obj["configName"]){
        	arr.push(obj);
        }
    }
    var result={"Result":arr};
}catch(e){
    var result={"Result":[]};
    logger.warn("Exception in get persistence object data:"+e);
}
