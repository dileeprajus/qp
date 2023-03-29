//inputs: input(JSON)
//output: result(STRING)
try{
	var config_name = input.configName;
    var configJson = input.configJson;
    var strParams1 = {
        input: Things[config_name].ConfigJson /* JSON */
    };

    // result: STRING
    var stringifyResult1 = me.ObjectStringify(strParams1);

    var params = {
        input: {"ConfigJson": JSON.parse(stringifyResult1)}
        /* JSON */
    };

    // result: JSON
    var decryptedResult = Things[config_name].GetDecryptedObjVal(params);
    //logger.warn("Decrypted Result obj: "+decryptedResult);

    var strParams = {
        input: decryptedResult /* JSON */
    };

    // result: STRING
    var stringifyResult = Things[config_name].ObjectStringify(strParams);
    var result = stringifyResult;
}
catch(e){
    var result = "";
    logger.warn("Exception in service HandleDecrytion is:"+e);
}
