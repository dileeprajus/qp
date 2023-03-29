//Inputs: input(JSON)
//Output: result(String)
try{
    var value = input.value;
    var saltKey = me.saltKey;
	  var result = "";
    //logger.warn("Input for GetDecryptedValue: "+value);
    var params = {
        EncryptValue: value /* STRING */,
        InputKey: saltKey /* STRING */
    };

    // result: STRING
    result = Things["MappingConfig"].DecryptPwdWithKey(params);
    //logger.warn("Decrypted pwd with key: input: "+value+ "saltKey: "+saltKey+" and decrypted val: "+result);

}catch(e){
    var result = "Exception : "+e;
    //logger.warn("Exception in service GetDecryptedValue: "+e);
}
