//INPUTS input(JSON)
// OUTPUTS: result(JSON)
try{
    //logger.warn("GetPropValues service input"+input);
    var config_name = me.name;
    var propArr = input.propertyArr;
    var resultObj={};

    // result: INFOTABLE dataShape: "undefined"
    var propsValuesTable = Things[config_name].GetPropertyValuesAsMultiRowTable();
    var propsValuesJson = propsValuesTable.ToJSON();
    var propsValuesArr = propsValuesJson.rows;

    for(var i=0;i<propArr.length;i++){
        for(var j=0; j<propsValuesArr.length; j++){
            var obj = propsValuesArr[j];
            if(propArr[i]==="Schema"){// change the schema prop value if the config contains newly updateSchema
                resultObj["Schema"] = Things[config_name].Schema;
//                var temp_schema = Things[config_name].updatedSchema;
//                logger.warn("updated Schema"+Things[config_name].updatedSchema);
//
//                var params = {
//                    input: temp_schema /* JSON */
//                };
//                // result: INTEGER
//                var temp_schema_len = me.GetObjectLength(params);
//
//                if(temp_schema_len>0){
//                    var prop_key=false
//                    for(var key in temp_schema){
//                        if(key==="properties"){
//                            prop_key=true
//                            break;
//                        }
//                    }
//                    //if(temp_schema.hasOwnProperty("properties")){
//                    if(prop_key){
//                        var prop_obj = temp_schema.properties;
//                        var params = {
//                            input: temp_schema /* JSON */
//                        };
//                        // result: INTEGER
//                        var prop_obj_len = me.GetObjectLength(params);
//                        if(prop_obj_len>0){
//                            resultObj["Schema"] = Things[config_name].updatedSchema;// reassaign the Schema prop value with updatedSchema prop value
//                        }
//                    }
//
//                }
//               break;
            } else if(propArr[i] === "tenantIDs"){
                resultObj["tenantIDs"] = Things["GenericIEMasterConfig"].tenantIDs;
           } 
            else if(propArr[i] === "ConfigJson" && Things[config_name].ConfigJson !== undefined){
                if(Things[config_name].dataSourceType==="Rest"){
                     var params = {
                            input: {"configName":config_name, "configJson":Things[config_name].ConfigJson} /* JSON */
                        };

                        // result: STRING
                        var stringifyResult = Things[config_name].HandleDecryption(params);


//                     var strParams1 = {
//                        input: Things[config_name].ConfigJson /* JSON */
//                    };
//
//                    // result: STRING
//                    var stringifyResult1 = me.ObjectStringify(strParams1);
//
//                     var params = {
//                        input: {"ConfigJson": JSON.parse(stringifyResult1)} /* JSON */
//                    };
//
//                    // result: JSON
//                    var decryptedResult = Things[config_name].GetDecryptedObjVal(params);
//                    logger.warn("Decrypted Result obj: "+decryptedResult);
//
//                    var strParams = {
//                        input: decryptedResult /* JSON */
//                    };
//
//                    // result: STRING
//                    var stringifyResult = me.ObjectStringify(strParams);
					resultObj[propArr[i]] = JSON.parse(stringifyResult);
                } else {
                	resultObj[propArr[i]] =Things[config_name]['ConfigJson'];
                }
                break;
            }
                else{
                if(propArr[i]==obj.name){
                    resultObj[obj.name] = obj.value;
                    break;
                }
            }
        }
    }

    var result = resultObj;
    //logger.warn("Result for GetPropValues service: "+JSON.stringify(result));
}catch(e){
    var result = {"Exception":e};
    logger.warn("Exception in GetHostProperties service:"+e);
}