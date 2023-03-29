//INPUT  body={} headers={} url_params = {}, transactionObj(JSON)
//OUTPUT  result= {}
var tObj = transactionObj || {};
if(isTarget===undefined) {
 tObj = {tSeq: new Date(), transactionId: tObj.transactionId, sourceConfig:"-", sourceType: "", sourceTime: "", sourceData: {"status":"No Source"}, mappingConfig: "-",mappingTime:"",mappingData:{"status":"No Mapping"}, targetConfig: me.name ? me.name : "", targetType: me.dataSourceType ? me.dataSourceType : "",status:"Info:Success Only Target", parentTSeq: tObj.transactionId};
}
 var tTime = new Date().getTime();
try{
   // if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   //     logger.warn('*************FTP PushDataToExternalSource Input************'+JSON.stringify(body));
   //  logger.warn('*************FTP transactionobject tObj************'+tObj);
   //  logger.warn('*************FTP transactionId.toString() sourceTime************'+tObj.sourceTime);
   // }
    var ftpFileInfo = me.ftpFileInfo;
    var hostInfoObj = me.GetFTPHostInfo();
    var data = body;
    var params = {
        input: body, /* JSON */
        transId:tObj.transactionId.toString(),
        sourceTime:tObj.sourceTime.toString()
    };
    // result: JSON
    var ftpPathObj = Things[me.name].OverRideTargetRequestVariables(params);
    var temp_data;
    var result;
    if(body !== ""){
        var ftpFileInfo = ftpPathObj;
        if(ftpFileInfo.fileType=== 'JSON'){
            temp_data = JSON.parse(data);
            logger.warn("Check enter");
            if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
               logger.warn("FTP JSONdata  :::"+temp_data);
            }
            // result: STRING
        } else if(ftpFileInfo.fileType === 'XML'){
           //var rootObj = {"root": data};
             var rootObj = data ? data : {"root": data};
            var params = {
                InputJson: rootObj /* JSON */
            };
            // result: STRING
            var temp_data = me.JsonToXML(params);
            if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("FTP XMLdata  :::"+temp_data);
            }
        }else {}
        var inputObj = {
            "action": "writeDataToFile",
            "ftpFileInfo": {
                "filePath": ftpFileInfo.filePath,
                "fileData": temp_data,
                "fileType": ftpFileInfo.fileType
            },
            hostProperties: hostInfoObj
        };
        if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            logger.warn('FTPServerObject++++++++++++++++'+JSON.stringify(inputObj));
        }
        var params = {
            inputJson: inputObj /* JSON */
        };
        // result: JSON
         if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            logger.warn("Before writing to file : " + ftpFileInfo.filePath);
         }
        var textTry = true;
        var count = 0;
        while(textTry && count < 3){
            try{
                 result = Things["FTPConfig"].WriteDataToFile(params);
                textTry = false;
            }catch(e){
                count++;
                if(count == 3)
                    throw e;
                logger.warn("In catch in FTP PushDataToExternalSource service : " + count + " , error : "+e.message);
            }
        }
        // result = Things["FTPConfig"].WriteDataToFile(params);
        if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            logger.warn("File Created Successfully in FTP"+JSON.stringify(result));
        }
    }
    tObj.targetTime = tTime;
    tObj.targetData = result;
    tObj.status = "Info:Success";
    tObj.targetType = me.dataSourceType ? me.dataSourceType : "";
    //call InvokeReordData service to record the logger and table data
    if(isTarget!==undefined) {
        Things["GenericIEMasterConfig"].InvokeRecordData({
            input: tObj /* JSON */
        });
    }
}catch(e){
    var result ={"Exception":e.message};
    tObj.targetTime = tTime;
    tObj.targetType = me.dataSourceType ? me.dataSourceType : "";
    //tObj.targetData = {"error":"no response"};
    tObj.targetData = {"error":e.message};
    tObj.status = "Info:Failed in Target";
    if (isTarget !== undefined) {
    Things["GenericIEMasterConfig"].InvokeRecordData({
        input: tObj /* JSON */
    });
    }
    logger.warn("Exception in FTP PushDataToExternalSource service  "+e.message);
    if(tObj.tSeq){
    delete tObj.tSeq;
    }
    if(tObj.transactionId){
    tObj.transactionId = tObj.transactionId.toString();
    }
    if(tObj.parentTSeq){
    tObj.parentTSeq = tObj.parentTSeq.toString();
    }
    var mailService =  Things["GenericIEMasterConfig"].HandleCatchExceptions({
        input: {
            payload:{message: e.message, transactionObject: tObj},
            Subject:"Error in Target FTP PushDataToExternalSource for "+me.name
        }
    });
}

