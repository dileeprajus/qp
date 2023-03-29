//INPUTS:	input(JSON) requestVariables(Json)
// OUTPUTS: result(JSON)
//var temp = me.ConfigJson['RequestVariables'];
var params = {
    input: input["RequestVariables"] //me.ConfigJson['RequestVariables'] /* JSON */
};
    // result: STRING
var temp = Things["GenericIEMasterConfig"].ObjectStringify(params);
temp = JSON.parse(temp);

for(var key in temp){
    //var param = temp[key];
    //for(var p in param){   //commented because request variables linearized
        if(request_variables[key]!==undefined){
            temp[key]=request_variables[key];
        }
    //}
    //temp[key]=param;
}

var config = input;
var variables = temp;//request_variables;
//logger.warn("OverRides config"+JSON.stringify(config));
//logger.warn("OverRides variables"+JSON.stringify(variables));
//var params = {
//	input: config /* JSON */
//};
// result: STRING
//logger.warn("*******: "+Things["GenericIEMasterConfig"].ObjectStringify(params));
var result = {};
for(var key in variables){
    var params = {
        input: config /* JSON */
    };
    config = Things["GenericIEMasterConfig"].ObjectStringify(params);
    config = config.replace("(("+key+"))",variables[key]);
    config = JSON.parse(config);
}
//for(var key in variables){
//    var obj = variables[key];
//    var dynamic_value = config[key];
//    if(dynamic_value!==undefined){
//        var v_type = typeof dynamic_value;
//        if(v_type!=="string"){
//            var params = {
//                input: dynamic_value /* JSON */
//            };
//            dynamic_value = Things["GenericIEMasterConfig"].ObjectStringify(params);
//        }
//
//            for(var variable in obj){
//                dynamic_value = dynamic_value.replace("(("+variable+"))",obj[variable]);
//            }
//        if(v_type!=="string"){
//            dynamic_value = JSON.parse(dynamic_value);
//        }
//        if(key==="headers" || key==="query_params"){
//            if(dynamic_value["array"]!==undefined){
//            	config[key]=dynamic_value["array"]; //as thingworx is making array as an object by adding array key
//            }
//            else{
//                config[key]=dynamic_value;
//            }
//        }
//        else{
//            config[key]=dynamic_value;
//        }
//   }
//}


//        if(typeof dynamic_value === "string"){
//        for(var variable in obj){
//            dynamic_value = dynamic_value.replace("(("+variable+"))",obj[variable]);
//        }
//        }
//        else if(typeof dynamic_value === "object" && dynamic_value.length!==undefined){
//            //Array -- This to handle array of arrays, not nested objects
//            var tmp_arr = dynamic_value;
//
//            if(key==="headers" || key==="query_params"){
//                var headers = {};
//
//                if(tmp_arr.length>0){
//                    //as arrays are not getting retrieved as expected, making json object first and then overriding varialbes and again making them as an array of arrays
//                    for(var i=0;i<tmp_arr.length;i++){
//                        headers[tmp_arr[i][0]] = tmp_arr[i][1];
//                    }
//                }
//
//                var f_obj = {};
//                for(var h in headers){
//                    //replacing variables and constructing new object
//                    var n_key = h;
//                    var n_value = headers[h];
//                    for(var variable in obj){
//                        n_key = h.replace("(("+variable+"))",obj[variable]);
//                        n_value = headers[h].replace("(("+variable+"))",obj[variable]);
//                    }
//                    f_obj[n_key]=n_value;
//                }
//
//                var tmp_arr = [];
//                for(var n in f_obj){
//                    //again forming array of arrays
//                    tmp_arr.push([n,f_obj[n]]);
//                }
//            }
//
//            dynamic_value = tmp_arr;
//        }
//        else if(typeof dynamic_value === "object" && dynamic_value.length===undefined){ //Json
//
//
//        }
//        else{
//        }

             var params = {
                 input: config /* JSON */
             };
// result: STRING
result = config;
