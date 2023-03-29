//INPUT  input= {}
//OUTPUT  result= {}

try {
    var script_string = "";
    var sample_script =  input.schedularScript;
    var input = input.requestVariables;
    for(var i=0; i< sample_script.length ; i++){
        script_string += sample_script[i];
        script_string +="; ";
    }
    script_string +="return output;";
    var sample_output = new Function('input', script_string);
    var output = sample_output(input);
    if(output===null || output===undefined || String(output)=='NaN'){
        var result = {data_type:"",value:""};
    }
    else{
        var result = {
            data_type:typeof output,value:output
        };
    }
}catch(e) {
    logger.warn("Error in GooglePubSub TestSchedularScript: "+e.message);
    var result = {data_type:"",value:""};
}