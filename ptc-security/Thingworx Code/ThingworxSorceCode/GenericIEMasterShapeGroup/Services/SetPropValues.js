try{
    var config_name = me.name;
    var result = {};
    var inputObj = input;
    var strParams1 = {
        input: input /* JSON */
    };
    var temp_obj = {'create_trigger':Things[config_name].enableFlexTrigger,'update_trigger':Things[config_name].enableFlexUpdateTrigger,'delete_trigger':Things[config_name].enableFlexDeleteTrigger};
    var Triggerobj = input.Triggerobj?input.Triggerobj:temp_obj;
    delete input.Triggerobj;
    // result: STRING
    var strinfigyResult1 = me.ObjectStringify(strParams1);
    var testobj = JSON.parse(strinfigyResult1);
    var resultObj = {};
    var propArr = [];

    for(var key in inputObj){
        propArr.push(key);
        logger.warn("prop is:"+key+" and value is   "+inputObj[key]);
        if(key!=="config_name"){
            if(key==="inputSchema"||key==="outputSchema"){
//                var schema_keys = 0;
//				var prop_keys = 0;
//				var prop_key = false;
//                var schema = inputObj[key];
//				for(var key in schema){
//    				if(key){
//        				schema_keys = schema_keys+1;
//        				if(key==="properties"){
//            				prop_key=true;
//            				var prop_obj = schema['properties'];
//            				for(var ki in prop_obj){
//                				if(ki){
//                    				prop_keys = prop_keys+1;
//                    				break;
//                				}
//            				}
//        				}
//   			 		}
//				}
//                if((schema_keys>0) && (prop_key) && (prop_keys>0)){
//                    Things[config_name]['Schema'] = inputObj['Schema'];
//                    Things[config_name]['canBeUsable'] = true;
//                }else{
//                	Things[config_name]['canBeUsable'] = false;
//                }
                var sh = {};
                if(inputObj[key]['schema']!==undefined){
                    sh = inputObj[key]['schema'];
                }
                else{
                    sh = inputObj[key];
                }
                var params = {
                    input: sh /* JSON */
                };

                // result: BOOLEAN
                var isValidSchema = me.isSchemaValid(params);
				Things[config_name][key] = sh;
                //uncomment below lines after applying input and output schema changes from ui
				if(key==="outputSchema"&& me.tags == "Applications:IE;Applications:DynamicConfig;Applications:Source" && isValidSchema){
                   //Things[config_name]['canBeUsable'] = true;
                    me.canBeUsable = true;
                }
                if(key==="outputSchema"&& me.tags == "Applications:IE;Applications:DynamicConfig;Applications:Source" && !isValidSchema){//if source schema is not valid
                	me.canBeUsable = false;
                }
                if(key==="inputSchema"&& me.tags == "Applications:IE;Applications:DynamicConfig;Applications:Target" && isValidSchema ){
                	Things[config_name]['canBeUsable'] = true;
                }
                if(key==="inputSchema"&& me.tags == "Applications:IE;Applications:DynamicConfig;Applications:Target" && !isValidSchema ){ //if target schema is not valid
                	Things[config_name]['canBeUsable'] = false;
                }
            }else if(key==="SpecJson"){ //update the current mapping config name as primarykey for selected source thing if the property is specJson and specjson should be proper specJson object
                //var mapping_config_json = me.ConfigJson;
                var source_config_json = Things[me.SourceConfig].ConfigJson;
                //var target_config_json = Things[me.TargetConfig].ConfigJson;
               // source_config_json["PrimaryKey"] = me.name;
                Things[me.SourceConfig].ConfigJson = source_config_json; //update SourceConfig configjson with updated primary key value
                Things[config_name][key] = inputObj[key];
            } else if(key === "DataContent"){
               if(inputObj["DataContent"] === ""){
                	Things[config_name][key] = inputObj[key];
                    Things[config_name].JSONData = inputObj[key];
                } else if(inputObj["DataContent"]){
//                    var dataParams = {
//                        data_format: inputObj["DataFormat"] /* STRING */,
//                        delimeter: inputObj["CSVDelimeter"] /* STRING */,
//                        data: inputObj["DataContent"] /* STRING */
//                    };
//
//                    // result: JSON
//                    var updateDataResult = me.UpdateJsonDataProp(dataParams);
                    var params = {
                        input: {
                            "dataContent":inputObj["DataContent"],
                            "csvDelimeter":inputObj["CSVDelimeter"],
                            "dataFormat":inputObj["DataFormat"]
                        } /* JSON */
                    };

                    // result: JSON
                    var testResult = me.TestStaticData(params);
                    me.JSONData = testResult["JSONData"];
                    me.DataContent = inputObj["DataContent"];

                }
            } else if(key === "tenantIDs"){
                Things["GenericIEMasterConfig"].tenantIDs = inputObj["tenantIDs"]; 
            } else{
                if(me.dataSourceType==="Rest"&& key==='ConfigJson') { //do nothing for rest configjson, it will handle below
                } else{ 
                    Things[config_name][key] = inputObj[key];
                }
            }
        }
    }
    if(me.dataSourceType==="Rest"){
        if(input['ConfigJson']!==undefined){
//         	var params = {
//        		input: input['ConfigJson'] /* JSON */
//   		 	};
//        	logger.warn("#####Rest Schema Fetch#####");
        	//Things[config_name].FetchSchemaUsingConfigJson(params);
           
			// encrypt the auth details in configjson
            var params = {
                input: {"ConfigJson":input["ConfigJson"]} /* JSON */
            };

            // result: JSON
            var encryptedResult = me.GetEncryptedObjVal(params);
            var sp = {
                input: encryptedResult /* JSON */
            };

            // result: STRING
            var strResult = me.ObjectStringify(sp);
            Things[config_name].ConfigJson = JSON.parse(strResult);
        }
    }else if (me.dataSourceType==="Flex"){
        if(Things[config_name]['canBeUsable'] && Things[config_name]['enableFlexTrigger'] || Things[config_name]['enableFlexDeleteTrigger'] || Things[config_name]['enableFlexUpdateTrigger']){ //call setup flex configuration service
            // result: JSON
            var params = {
                endpointsobj:Triggerobj,
                fromDelete: false /* BOOLEAN */
            };
            var setup_result = Things[config_name].SetupFlexConnectionConfiguration(params);        	
        }
        if (Things[config_name]['canBeUsable'] && Things[config_name]['enableFlexTrigger'] === false && Things[config_name]['enableFlexDeleteTrigger'] === false &&Things[config_name]['enableFlexUpdateTrigger'] === false) {
          var params = {
              fromDelete: true /* BOOLEAN */
          };
          var setup_result = Things[config_name].SetupFlexConnectionConfiguration(params);
        }
    } else if (me.dataSourceType==="Static"){
       // if(inputObj["DataContent"]){
//            var dataParams = {
//                data_format: inputObj["DataFormat"] /* STRING */,
//                delimeter: inputObj["CSVDelimeter"] /* STRING */,
//                data: inputObj["DataContent"] /* STRING */
//            };
//
//            // result: JSON
//            var updateDataResult = me.UpdateJsonDataProp(dataParams);
      // }
    }else if (me.dataSourceType==="FTP"){
        Things[config_name].ftpFileInfo = me.ftpFileInfo;
    }else if(me.dataSourceType==="Google Pub/Sub"){
         Things[config_name].googlePubSubEditFileInfo = me.googlePubSubEditFileInfo;
    }
    var jsonObj = {"propertyArr":propArr,"config_name":config_name};//Add thing name also along with the property arr
    var params = {
        input: jsonObj /* JSON */
    };
    // result: STRING
    result = Things[config_name].GetPropValues(params);
    //result = testobj;
}
catch(e){
    var result = {};
    logger.warn("Exception in SetPropValues service:"+e.message);
}