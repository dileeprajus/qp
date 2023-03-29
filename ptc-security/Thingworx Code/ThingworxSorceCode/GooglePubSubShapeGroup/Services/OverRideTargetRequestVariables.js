//INPUT  input= {}
//request_variables = {}
//OUTPUT  result= {}
try {
    var googlePubSubEditFileInfo = me.googlePubSubEditFileInfo;
    var hostInfoObj = me.GetGooglePubSubHostInfo();
    var configJson = Things[me.name].ConfigJson;
    var data = input;
    var params = {
        input: configJson["RequestVariablesConfig"]['filePath'] /* JSON */
    };
    // result: STRING
    var temp = Things["GenericIEMasterConfig"].ObjectStringify(params);
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

    var path = googlePubSubEditFileInfo.filePath;
    for(var key in requestVariablesConfig){
        if(requestVariablesConfig[key]) {
            var temFilePath = '';
            if(requestVariablesConfig[key]['fileNameFormat']==='Date'){
                //if(requestVariablesConfig[key]['DateFormat']){
                //  if(requestVariablesConfig[key]['DateFormat']=== 'MMDDYY') {
                //   temFilePath= ftpFileInfo.filePath.replace("(("+key+"))", day + "/" + month + "/" + year)
                // }else if(requestVariablesConfig[key]['DateFormat']=== 'MMDD') {
                //  temFilePath= ftpFileInfo.filePath.replace("(("+key+"))", day)
                //} else {
                //   temFilePath= ftpFileInfo.filePath.replace("(("+key+"))", seconds)
                // }
                //}else {
                temFilePath= path.replace("(("+key+"))",day+month+year+hour+minutes+seconds);
                //}
                path = temFilePath;
            }else if(requestVariablesConfig[key]['fileNameFormat']==='Oid'){
                if(data['oid']!==undefined  && data['oid']!=='' && data['oid']!==null){
                    temFilePath= path.replace("(("+key+"))", data['oid'].replace(/\:/g, '').replace(/\./g, ''));
                }else {
                    temFilePath= path.replace("(("+key+"))", 'oid');
                }
                path = temFilePath;
            }
        }
    }
    var finalPath = googlePubSubEditFileInfo['fileType'].toLowerCase();
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
     logger.warn("^^^^^^^^^^^^^^^finalPath^^^^^^^^^^^^"+JSON.stringify(finalPath));
    }
    var result = {'filePath': finalPath, 'fileType': googlePubSubEditFileInfo.fileType };
}catch(e) {
    var result ={"Exception":e.message};
    logger.warn("Exception in GooglePubSub overRideTargetRequestVariables service  "+e.message);
}