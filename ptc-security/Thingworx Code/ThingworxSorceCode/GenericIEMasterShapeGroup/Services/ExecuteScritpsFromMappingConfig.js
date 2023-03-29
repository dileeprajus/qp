//INPUTS: input(JSON) defaultValue: {"inputValue":""}, index(Integer)
//OUTPUT: Json
//var mappingConfigName = config.mappingConfigName;
//var mappingSpecIndex = config.mappingSpecIndex;
//var result = {};
//
//var mapping_config_json = Things[mappingConfigName].ConfigJson;
////var mappingConfigName = config.mappingConfigName;
////var mappingSpecIndex = config.mappingSpecIndex;
////var result = {};
////
////var mapping_config_json = Things[mappingConfigName].ConfigJson;
//logger.warn("Called ExecuteScritpsFromMappingConfig: "+"index: "+index+" TYPE: "+typeof input.inputValue);
//try{
//var config_json = me.ConfigJson;
//    
//var pa = {
//	input: input /* JSON */
//};
//// result: STRING
//var input = me.ObjectStringify(pa);
//    input = JSON.parse(input);
//var input = input["inputValue"]//inputValue;
//var current_mapping_spec_obj = config_json.mappingSpec[parseInt(index)];
//var input_val = input;
//var result = {data_type:"",value:""};
//if(current_mapping_spec_obj["mappingConf"]){
//    var rules = current_mapping_spec_obj["mappingConf"]["TransformationRules"]
//    if(rules){
//        for(var i=0;i<rules.length;i++){
//            var script_arr = rules[i]["script"];
//            var script_string = '';
//            for(var k=0; k<script_arr.length ; k++){
//               script_string += script_arr[k];
//               script_string +="; "
//             }
//            script_string +="return output;";
//            var sample_output = new Function('input', script_string);
// 			var output = sample_output(input_val);
//            input_val = output;
//        }
//        if(output===null || output===undefined || String(output)=='NaN'){
//			var result = {data_type:"",value:""};        
//    	}
//    	else{
//    		var result = {
//        		data_type:typeof output,value:output
//    		};
//    	}
//    }
//}
//    //logger.warn("Execute Script Output: "+JSON.stringify(result));
//}catch(err) {
//    logger.warn("Error in ExecuteScritpsFromMappingConfig: "+err);
//    var result = {data_type:"",value:""};
//}
//



//var mappingConfigName = config.mappingConfigName;
//var mappingSpecIndex = config.mappingSpecIndex;
//var result = {};
//
//var mapping_config_json = Things[mappingConfigName].ConfigJson;
if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    logger.warn("Called ExecuteScritpsFromMappingConfig: "+input+"index: "+index+" TYPE: "+typeof input+" CFC "+CFC);
    logger.warn("CFC From ExecuteScritpsFromMappingConfig: "+JSON.stringify(CFC));
   }
   try{
       //var input = input.value;  //TODO : uncomment this line after adding new extension
       var config_json = me.ConfigJson;
       var current_mapping_spec_obj = config_json.mappingSpec[parseInt(index)];
       var input_val = input.inputValue;
       var result = {data_type:"",value:""};
       if(current_mapping_spec_obj["mappingConf"]){
           var rules = current_mapping_spec_obj["mappingConf"]["TransformationRules"]
           if(rules){
               for(var i=0;i<rules.length;i++){
                   var script_arr = rules[i]["script"];
                   var script_string = '';
                   for(var k=0; k<script_arr.length ; k++){
                       script_string += script_arr[k];
                       script_string +="; "
                   }
                   script_string +="return output;";
                   var sample_output = new Function('input', script_string);
                   var output = sample_output(input_val);
                   if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                     logger.warn("output in  executescriptfrommappingconfig: "+output+" typeof output is : "+typeof output);
                   }
                   input_val = output;
               }
               if(output===null || output===undefined ){
                   var result = {data_type:"",value:""};
   
               }
               else{
                   var result = {
                       data_type:typeof output,value:output
                   };
               }
           }
       }
       if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
           logger.warn("Execute Script Output: "+JSON.stringify(result));
       }
   }
   catch(err) {
       logger.warn("Error in ExecuteScritpsFromMappingConfig: "+err);
       var result = {
           data_type:"",value:""};
   }