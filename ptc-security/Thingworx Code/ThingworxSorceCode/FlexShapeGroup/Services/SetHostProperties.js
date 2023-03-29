//INPUTS:	input(JSON) {"propertyName": propertyValue}
// OUTPUTS: result(JSON)
try{
    var result;
    var flex_config_json;
    // logger.warn("Set host properties Input json :"+JSON.stringify(input));
    if(input !== undefined){
        // logger.warn("Set host properties  IF condition json :"+JSON.stringify(input));
        me.hostname = input.hostname;
        me.midpoint = input.midpoint;
        var params = {
          data: input.password /* STRING */
        };
        // result: STRING
        var ecyptedPwd = Resources["EncryptionServices"].EncryptPropertyValue(params);

        me.password = ecyptedPwd;
        me.username = input.username;
        result = me.GetHostProperties();

        // flex_objs: JSON
//            var flex_objs = me.GetFlexObjects();//Get the flex objects.
//            if(flex_objs.FlexObjects.length>0){//check whether we are getting flex objects by given host properties
//                // result: JSON
//                flex_config_json = me.SetupFlexConnectionConfiguration();//setup the flex connection configuration json
//                me.canBeUsable = true;
//                logger.warn("flex config json is :"+JSON.stringify(flex_config_json));
//            }else{
//                me.canBeUsable = false;
//                logger.warn("unable to set the flex config json");
//            }
        me.canBeUsable = false;
        var tempSchema = {};
        if(me.tags == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
           tempSchema = me.outputSchema;
        }
        if(me.tags == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
            tempSchema = me.inputSchema;
        }
        if(tempSchema['schema']!==undefined){
            tempSchema = tempSchema['schema'];
        }
        else{
            tempSchema = tempSchema;
        }
        var params = {
            input: tempSchema /* JSON */
        };

        // result: BOOLEAN
        var isValidSchema = me.isSchemaValid(params);
		if(isValidSchema){//change the canbeUsable property for config based on schema. 
           me.canBeUsable = true;
        }else{
           me.canBeUsable = false;
        }
    }
    else{
        result ={};
    }
}
catch(e){
    logger.warn("Exception in Flex SetHost properties is: "+e);
        result ={};
}
