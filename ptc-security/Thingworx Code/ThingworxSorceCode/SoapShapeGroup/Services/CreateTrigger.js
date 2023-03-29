//Inputs: input(JSON)
//output: result(JSON)
//Record the source audit data when data is triggered from source
//var params = {
//       input: {
//           "sId": me.name,
//           "tId": "",
//           "mTime": new Date(),
//           "sTime": new Date(),
//           "tTime": new Date(),
//           "tSeq": Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum()+1,
//           "mccId": me.name
//       }
//       /* JSON */
//   };
//
//   // result: JSON
//   var recordResult = Things["GenericIEMasterConfig"].RecordTransactionalAuditData(params);
try{

    var params = {
        input_data: input /* JSON */,
        config_name: me.name /* STRING */,
        CFC: undefined /* JSON */,
        typeName: undefined /* STRING */,
        MCC: undefined /* JSON */,
        objectType: undefined /* STRING */
    };

    // result: JSON
    var result = me.HandleInputDataStream(params);
     if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
         logger.warn('Soap HandleInput DataStream Response'+JSON.stringify(result))
     }
}catch(e){
var result = {"exception":e};
 var mailService =  Things["GenericIEMasterConfig"].HandleCatchExceptions({
     input: {
         CC: Things["GenericIEMasterConfig"].EmailConfiguration.CC,
         BCC:Things["GenericIEMasterConfig"].EmailConfiguration.BCC,
         To:Things["GenericIEMasterConfig"].EmailConfiguration.To,
         payload:e.message,
         Subject:"PushDataToExternalSource"
     }
 });
}
