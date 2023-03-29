//INPUT  input={}
//OUTPUT  result= {}

try{
    var configJson = me.ConfigJson;
    var RequestVariables = configJson.RequestVariables;
    //This Condition for call the pullInputDataStream from External Source or 
    if(input !== undefined && input.RequestVariables !== undefined) {
        RequestVariables = input.RequestVariables
    }
    var params = {
        input:  {"requestVariables":RequestVariables, "schedularScript":configJson.schedularScript}  /* JSON */
    };
    // result: JSON
    var scriptResponse = me.TestAPIWithRequestVars(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
       logger.warn('FTP Schedular Script Response'+scriptResponse);
    }
    var sTime = new Date();
    //Record the source audit data when data is pull from source
//    var sParams = {
//        input: {
//            "sId": me.name,
//            "tId": "",
//            "mTime": new Date(),
//            "sTime": sTime,
//            "tTime": new Date(),
//            "tSeq": Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum()+1,
//            "mccId": me.name
//        }
//        /* JSON */
//    };
//   // result: JSON
//   var recordResult = Things["GenericIEMasterConfig"].RecordTransactionalAuditData(sParams);
    var params = {
        input:{
            scriptResponse:scriptResponse /* JSON */
        }
    };

    // result: JSON
    var result = me.GetFilesListData(params);
}catch(e){
    logger.warn('Exception in FTP GetInputData'+e);
    var result = {"Error in FTP GetInputData":e};
        var mailService =  Things["GenericIEMasterConfig"].HandleCatchExceptions({
        input: {
            CC: Things["GenericIEMasterConfig"].EmailConfiguration.CC,
            BCC:Things["GenericIEMasterConfig"].EmailConfiguration.BCC,
            To:Things["GenericIEMasterConfig"].EmailConfiguration.To,
            payload:e.message,
            Subject:"GetInputData"
        }
    });
}