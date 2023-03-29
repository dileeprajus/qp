//INPUT  input={}
//OUTPUT  result= {}

try {
    var hostInfoObj = me.GetFTPHostInfo();
    var inputObj = {
        "schedularScript": input.schedularScript,
        "requestVariables": input.requestVariables
    }
    var params = {
        input: inputObj /* JSON */
    };
    // result: JSON
    var reqVar = me.TestSchedularScript(params);
    var configObj = me.ConfigJson['ftpFileInfo'];
    var configReq = me.ConfigJson['RequestVariables'];
    var tempObj = {};
    tempObj["fileName"] = configReq["fileName"];
    tempObj["filePath"] = configReq["filePath"];
    me.ConfigJson['RequestVariables'] = tempObj;
    var params = {
        input: me.ConfigJson /* JSON */,
        request_variables: reqVar.value /* JSON */,
        configObj: configObj /* JSON */
    };
    // result: JSON
    var res = me.OverRideRequestVariables(params);
    var scriptRes = reqVar.value;
   scriptRes["filePath"] = hostInfoObj.rootDirectory+res["filePath"];
    if(res["fileName"].lastIndexOf('json') !== -1){
        scriptRes["fileName"] = res["fileName"]
    }else if(res["fileName"].lastIndexOf('xml') !== -1) {
        scriptRes["fileName"] = res["fileName"]
    }
//    else if(res["fileName"].lastIndexOf('*') !== -1) {
//        scriptRes["fileName"] = res["fileName"]
//    }
    else {
        scriptRes["fileName"] = res["fileName"]+'.'+configObj['fileType'].toLowerCase();
    }
    scriptRes["type"] = scriptRes["fileName"].split(/\.(?=[^\.]+$)/)[1];
    var result = scriptRes;
}catch(e) {
    logger.warn("Exception in TestRequestVariables"+ e)
}