try {
    var hostInfoObj = Things[input.configName].GetFTPHostInfo();
    logger.warn('+++++++++hostInfoObj GetFTPFileTransferObject'+JSON.stringify(hostInfoObj));
     var configJson = Things[input.configName].ConfigJson;
     var ftpFileInfo = Things[input.configName].ftpFileInfo;
     var result = {};
    if(input.GroupType === 'Source') {
      var RequestVariables = configJson.RequestVariables;
        var schedularScript = configJson.schedularScript;
        var inputObj = {
            "schedularScript": schedularScript,
            "requestVariables": RequestVariables
        };
        var params = {
            input: inputObj /* JSON */
        };
        // result: JSON
        var reqVar = Things[input.configName].TestSchedularScript(params);
       logger.warn('FTPObject1+++++++++'+JSON.stringify(reqVar)+JSON.stringify(configJson.RequestVariables));

        var configObj = configJson['ftpFileInfo'];
        var configReq = configJson['RequestVariables'];
        logger.warn('reqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq'+input.requestVariables);
        var tempObj = {};
        tempObj["fileName"] = configReq["fileName"];
        tempObj["filePath"] = configReq["filePath"];
         Things[input.configName].ConfigJson['RequestVariables'] = tempObj;

       logger.warn('FTPObject2+++++++++'+JSON.stringify(configReq));
        if(input.requestVariables !== undefined) {
          reqVar.value.filePath = input.requestVariables.filePath;
         reqVar.value.fileName = input.requestVariables.fileName;

         logger.warn('FTPObject2d+++++++++'+JSON.stringify(reqVar.value));
        }
        var ORparams = {
            input: Things[input.configName].ConfigJson /* JSON */,
            request_variables: reqVar.value /* JSON */,
            configObj: configObj /* JSON */
        };
        // result: JSON
        var res = Things[input.configName].OverRideRequestVariables(ORparams);
        var scriptRes = reqVar.value;
           logger.warn('FTPObject3+++++++++'+JSON.stringify(scriptRes));

       scriptRes["filePath"] = hostInfoObj.rootDirectory+res["filePath"];
        if(res["fileName"].lastIndexOf('json') !== -1){
            scriptRes["fileName"] = res["fileName"];
        }else if(res["fileName"].lastIndexOf('xml') !== -1) {
            scriptRes["fileName"] = res["fileName"];
        }else {
            scriptRes["fileName"] = res["fileName"]+'.'+configObj['fileType'].toLowerCase();
        }
        scriptRes["type"] = scriptRes["fileName"].split(/\.(?=[^\.]+$)/)[1];
        result = scriptRes;
        result = {"ftpHostInfo": hostInfoObj, "ftpFileInfo" : scriptRes, "groupType": input.GroupType, "dataSourceType": Things[input.MCC.source_config_name].dataSourceType};
	}else {
         var stringfyParams = {
        input: configJson["RequestVariablesConfig"]['filePath'] /* JSON */
    };
    // result: STRING
    var temp = Things["GenericIEMasterConfig"].ObjectStringify(stringfyParams);
    temp = JSON.parse(temp);
    var requestVariablesConfig = temp;//req_variables;

    var today = new Date();
    var day = today.getDate() + "";
    var month = (today.getMonth() + 1) + "";
    var year = today.getFullYear() + "";
    var hour = today.getHours() + "";
    var minutes = today.getMinutes() + "";
    var seconds = today.getSeconds() + "";
    function checkZero(data){
        if(data.length == 1){
            data = "0" + data;
        }
        return data;
    }
    day = checkZero(day);
    month = checkZero(month);
    year = checkZero(year);
    hour = checkZero(hour);
    mintues = checkZero(minutes);
    seconds = checkZero(seconds);
   logger.warn('ftpFileInfo in 86 line'+ftpFileInfo+JSON.stringify(ftpFileInfo));
    var path = ftpFileInfo.filePath;
    for(var key in requestVariablesConfig){
        if(requestVariablesConfig[key]) {
            var temFilePath = '';
            if(requestVariablesConfig[key]['fileNameFormat']==='Date'){
                temFilePath= path.replace("(("+key+"))",day+month+year+hour+minutes+seconds);
                path = temFilePath;
            }else if(requestVariablesConfig[key]['fileNameFormat']==='Oid'){
//                if(data['oid']!==undefined  && data['oid']!=='' && data['oid']!==null){
//                    temFilePath= path.replace("(("+key+"))", data['oid'].replace(/\:/g, '').replace(/\./g, ''));
//                }else {
                    temFilePath= path.replace("(("+key+"))", 'Oid');
//                }
                path = temFilePath;
            }
        }
    }
    var finalPath = hostInfoObj.rootDirectory+path+'.'+ftpFileInfo['fileType'].toLowerCase();
     logger.warn("^^^^^^^^^^^^^^^FileStreamfinalPath^^^^^^^^^^^^"+JSON.stringify(finalPath));
     result ={"ftpHostInfo": hostInfoObj, "ftpFileInfo": {'filePath': finalPath, 'fileType': ftpFileInfo.fileType },"groupType": input.GroupType, "dataSourceType": Things[input.MCC.source_config_name].dataSourceType};
    }
    logger.warn('result'+JSON.stringify(result));
}catch(e) {
    logger.warn('Error in GetFTPFileTransferObject'+e);
}