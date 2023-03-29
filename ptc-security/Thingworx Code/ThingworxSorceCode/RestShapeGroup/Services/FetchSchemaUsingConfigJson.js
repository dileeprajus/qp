//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
try{
    var config_json = input;
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   		logger.warn("FetchSchemaUsingConfigJson Input: ",JSON.stringify(input));
    }
    var result = {};
    var schema = "";
    var masterObj = "";
    if(input["master_obj"]){
        if(input["master_obj"] !== ""){
        	masterObj = input["master_obj"];
        }
    }
    if(config_json["schema_source"]==="SchemaFromFile"){
        //me.updatedSchema=config_json["schema_from_file_data"] //TODO : need to validate schema
        schema = config_json["schema_from_file_data"];
        //me.canBeUsable = true
    }
    else if(config_json["schema_source"]==="SchemaFromURL"){
        //me.updatedSchema
        config_json["sourceType"] = "schema_"    
        var params = {
            input: config_json /* JSON */
        };
        // result: JSON
        //me.updatedSchema = me.TestApi(params);
        schema = me.TestApi(params);
        //me.canBeUsable = true
    }
    else if(config_json["schema_source"]==="SchemaFromData"){
        var obj = {};
        var data_format = config_json["current_data_format"];
        config_json["sourceType"] = "";
        var rv_json = {};
    var rv = input.RequestVariables;
    for(var key in rv){
      var s_rv = rv[key];
      for(var k in s_rv){
        rv_json[k]=s_rv[k]
      }
    }
        var params = {
            input: config_json /* JSON */,
            request_variables: rv_json
        };
        if(data_format==="JSON"){
            // result: JSON
            var data = me.TestApi(params);
//            if(masterObj !== ""){
//            	obj[masterObj] = data["result"];
//                data = obj;
//            } else {
                data =  data["result"];
           // }
            var params = {
                input:  data  /* JSON */,
                draft_type : 3
            };
            //me.Schema = Things["MappingThing"].GetSchemaFromJson(params);
            schema = Things["MappingConfig"].GetSchemaFromJson(params);
            //me.canBeUsable = true
        }
        else if(data_format==="XML"){
            // result: XML
            var data = me.TestApiXML(params);
            data = data["result"];
            data = String(data);
            var params = {
               // input:  data  /* STRING */,
                InputXML: data
            };
            //data = Things["MappingConfig"].GetJsonFromXML(params);
            data = Things["MappingConfig"].XMLToJson(params);
//            if(masterObj !== ""){
//            	obj[masterObj] = data;
//                data = obj;
//            }
            var params = {
                input:  data  /* JSON */,
                draft_type : 3
            };
            //me.Schema = Things["MappingThing"].GetSchemaFromJson(params);
            schema = Things["MappingConfig"].GetSchemaFromJson(params);
            //me.canBeUsable = true
        }
        else if(data_format==="CSV"){
            //         var params = {
            //			input:  data  /* JSON */,
            //            draft_type : 3
            //		};
            //        //me.Schema = Things["MappingConfig"].GetSchemaFromCSV(params);
            //        schema = Things["MappingConfig"].GetSchemaFromCSV(params);
            //    	//me.canBeUsable = true

            // result: String
            var data = me.TestApiCSV(params);
            data = data["result"];
            var params = {
                delimeter: config_json["csv_delimeter"],
                csv_data: data
            };
            // jsonFromCSV: JSON
            data = Things["MappingConfig"].GetJsonFromCSV(params);
//			if(masterObj !== ""){
//            	obj[masterObj] = data;
//                data = obj;
//            }
            var params = {
                input:  data  /* JSON */,
                draft_type : 3
            };
            //me.Schema = Things["MappingThing"].GetSchemaFromJson(params);
            schema = Things["MappingConfig"].GetSchemaFromJson(params);
            //me.canBeUsable = true
        }
        else{
        }
    }
    else{
    }

    var schema_keys = 0;
    var prop_keys = 0;
    var prop_key = false;
    for(var key in schema){
        if(key){
            schema_keys = schema_keys+1;
            if(key==="properties"){
                prop_key=true;
                var prop_obj = schema.properties;
                for(var ki in prop_obj){
                    if(ki){
                        prop_keys = prop_keys+1;
                        break;
                    }
                }
            }
        }
    }
    if((schema_keys>0) && (prop_key) && (prop_keys>0)){
       // me.canBeUsable = true;
        if((config_json["schema_source"]==="SchemaFromFile") || (config_json["schema_source"]==="SchemaFromURL")){
            //me.updatedSchema = schema;
        }
        else if (config_json["schema_source"]==="SchemaFromData"){
           // me.Schema = schema;
        }
        else{
        }
    }
    result = schema;
}
catch(e){
    var result = {"error":e};
    logger.warn("Exception in FecthSchemaUsingConfigJso service: "+e);
}
