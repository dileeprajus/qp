//INPUTS:	input(JSON) 
// OUTPUTS: result(JSON)
// try{
// var temp_rv = me.ConfigJson["RequestVariables"];
// var params = {
//     input: temp_rv /* JSON */
// };
// // result: STRING
// var temp = Things["GenericIEMasterConfig"].ObjectStringify(params);
// temp = JSON.parse(temp);
//
// for(var key in temp){
//         if(input[key]!==undefined){
//             temp[key]=input[key];
//         }
// }
// var result = temp;
// }catch(e) {
//   var result = {};
//   logger.warn("Exception in OverrideRequestVariables service : "+e);
// }
//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
try{
    var temp_rv = me.ConfigJson["RequestVariables"];
    var params = {
        input: temp_rv /* JSON */
    };
    // result: STRING
    var temp = Things["GenericIEMasterConfig"].ObjectStringify(params);
    temp = JSON.parse(temp);
    // logger.warn("Soap Override Variables Input: "+JSON.stringify(input))
    // logger.warn("Soap Override Variables Config Previous: "+JSON.stringify(temp))
    var objLength =  Things["GenericIEMasterConfig"].GetObjectLength({
        input: temp /* JSON */
    });
    if(objLength === 0){
        temp = input;
    }
    for(var key in temp){
       //var param = input[key] ? input[key]:temp[key];
        //for(var p in param){
            if(input[key]!==undefined){
                temp[key]=input[key];
            }
        //}
        //temp[key]=param;
    }
    var result = temp;
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn("Soap Override Variables Config After: "+JSON.stringify(result))
    }
}catch(e){
    var result = {};
    logger.warn("Exception in service OverrideRequestVariables: "+e);
}
