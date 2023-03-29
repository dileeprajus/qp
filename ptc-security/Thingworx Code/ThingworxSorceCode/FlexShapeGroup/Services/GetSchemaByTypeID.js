//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
//HOST : 16 Public IP
  //config : JSON
  var config = me.FlexAPIConfig();
  if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
  logger.warn(config.midPoint + config.getFlexSchema);
  }
  var params = {
      headers: {"Content-Type": "application/json"} /* JSON */,	
      url: config.midPoint + config.getFlexSchema,
      content: input,
      password: me.password /* STRING */,
      username: me.username /* STRING */
  };
  // result: JSON
  var result = Resources["ContentLoaderFunctions"].PostJSON(params);
  delete result.responseHeaders;
  delete result.responseStatus;
  if(Object.keys(result).length===1){//if the result contains only headers then the flex plm may be 11 verison so get the csrf token and then call the api
      var params = {
          endPoint: config.midPoint + config.getFlexSchema /* STRING */,
          headersValue: {"Content-Type": "application/json"} /* JSON */,
          contentValue: input /* JSON */,
          methodType: "post" /* STRING */
      };
  
      // result: JSON
      result = me.TestFlexAPI(params);
  }else delete result.headers;
  
  