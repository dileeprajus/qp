//INPUTS: requestVariables(JSON)
//OUTPUTS: result(JSON)
try{
    var tempReqVars=requestVariables;
        // result: INTEGER
    var objLength =  Things["GenericIEMasterConfig"].GetObjectLength({
        input: requestVariables /* JSON */
    });
    if(objLength === 0) {
        var tempCon = me.ConfigJson;
        var selectedReqSchema = tempCon["SelectedRequestSchema"]["properties"];
        var reqPs = "";
        for(var k in selectedReqSchema){
            reqPs = k;
            break;
        }
        tempReqVars = {};
        tempReqVars[reqPs]={};
    }
    var params = {
        headers: undefined /* JSON */,
        url_params: undefined /* JSON */,
        body: tempReqVars, //{"ROOT":requestVariables}
        from: "TestAPIWithRequestVars"

    };

    // result: JSON
    var result = me.PushDataToExternalSource(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   	 logger.warn("Result from Soap TestAPIWithRequestVars : "+result.result);
    }
}
catch(e){
    result = {"Error": e};
    logger.warn("Exception in service TestAPIRequestVars: "+e);
}
