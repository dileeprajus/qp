//Inputs: input(JSON)
//Output: result(String)
try{
    var value = input.value;
    var saltKey = me.saltKey;
    //logger.warn("Encrypted pwd with key: input: "+value);
	var result = "";
    var params = {
        InputValue: value /* STRING */,
        InputKey: saltKey /* STRING */
    };

    // result: STRING
    result = Things["MappingConfig"].EncryptPwdWithKey(params);
    //logger.warn("Encrypted pwd with key: input: "+value+ "saltKey: "+saltKey+" and encrypted val: "+result);
    //logger.warn("REsult for Get encrypted value: "+result);

}catch(e){
    var result = "Exception : "+e;
    logger.warn("Exception in service GetEncryptedValue: "+e);
}
