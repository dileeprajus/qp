//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
try{
    var tempReqVars=input["RequestVariables"] ? input["RequestVariables"] :{};
       // result: INTEGER
   var objLength =  Things["GenericIEMasterConfig"].GetObjectLength({
       input: input["RequestVariables"] /* JSON */
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
       body: tempReqVars//, //{"ROOT":requestVariables}
       //from: "GetInputData"
       /* JSON */
   };

   // result: JSON
   var result = me.PushDataToExternalSource(params);
   if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
       logger.warn("Result from GetInputData of SOAP is  : "+JSON.stringify(result));
   }
  //below code will be in PushDataToExternalSource service so no need to convet here
   //Uncomment while testing
//    var params = {
//      InputXML: result.result /* JSON */
//  };
//  // result: JSON
//  result = Things["MappingConfig"].XMLToJson(params);
//    if(result["soap:Envelope"]){
//        if(result["soap:Envelope"]["soap:Body"]){
//            result = result["soap:Envelope"]["soap:Body"];
//            //logger.warn("REMOVE SOAP ENV AND BODY"+result);
//        }
//    }
   //logger.warn("Converted JSON from XSD in SOAP is  : "+JSON.stringify(result));
}catch(e){
   var result = {};
   logger.warn("Exception in GetInputData service: "+e);
}
