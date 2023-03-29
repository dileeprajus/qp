//Inputs: requestVariables(Json)
//Output: result(JSON)
try{
    var result = {};
   if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    logger.warn("Flex Test Request Variables: "+JSON.stringify(requestVariables));
   }
    var input = {};
    input["RequestVariables"]=requestVariables;
    var params = {
        input: input /* JSON */
    };

    // result: JSON
    result = me.GetInputData(params);

}
catch(e){
    logger.warn("Error in Flex TestAPIWithRequestVars"+e)
    var result={"error":e};

}
