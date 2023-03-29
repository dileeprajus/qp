//INPUTS  input(JSON) defaultValue: {"value":""} ,sample_script(JSON)
// OUTPUTS: result(JSON)
if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
	logger.warn("Test Script Input: "+sample_script);
}
try{
    var script_string = "";
    var input = input.value;

    //This is just an array join
    for(var i=0; i< sample_script["script_array"].length ; i++){
        script_string += sample_script["script_array"][i];
        script_string +="; "
    }
    script_string +="return output;";
   // logger.warn("ScriptString : "+script_string);
    var sample_output = new Function('input', script_string);
    var output = sample_output(input);
    //var o_type = typeof output;
    //logger.warn("OUTPUT: "+output);
    //if(output==NaN){
    //    output = 'NaN' //as thingworx raising exception for NaN output return
    //}
    if(output===null || output===undefined || String(output)=='NaN'){
		var result = {data_type:"",value:""};        
    }
    else{
    var result = {
        data_type:typeof output,value:output
    };
    }
    //logger.warn("Test Script Output: "+JSON.stringify(result));
    //logger.warn(output==NaN || String(output)=='NaN');
    //result = eval(script.script_array.join(";\n"));
}
catch(err) {
    logger.warn("Error in Generic TestScript: "+err);
    var result = {data_type:"",value:""};
}

