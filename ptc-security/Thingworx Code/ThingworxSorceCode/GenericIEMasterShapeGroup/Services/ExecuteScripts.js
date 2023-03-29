//INPUTS: input(String), scripts(JSON)
//OUTPUT: Json
var result = {};
logger.warn("Execute scritps called***************** : ");
logger.warn("Input Value : "+input);
logger.warn("Scripts array : "+JSON.stringify(scripts));
try{
var script_string = scripts["scripts"];
script_string +="return output;";
var sample_output = new Function('input', script_string);
 var output = sample_output(input);
var result = {
        data_type:typeof output,value:output
    };
}catch(err) {
    logger.warn("Error in ExecuteScript: "+err);
    var result = {
        data_type:"",value:""};
}