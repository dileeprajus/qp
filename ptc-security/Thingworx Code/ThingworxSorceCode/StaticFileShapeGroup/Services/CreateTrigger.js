//Record the source audit data when data is triggered from source
//var params = {
//     input: {
//         "sId": me.name,
//         "tId": "",
//         "mTime": new Date(),
//         "sTime": new Date(),
//         "tTime": new Date(),
//         "tSeq": Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum()+1,
//         "mccId": me.name
//     }
//     /* JSON */
// };
//// result: JSON
//var recordResult = Things["GenericIEMasterConfig"].RecordTransactionalAuditData(params);
var tempData = input;
if(input["input"]){
	tempData = input.input;
}

var primaryKey = new Date();
if(me.ConfigJson["PrimaryKey"]){
	primaryKey = me.ConfigJson["PrimaryKey"];
}
try{
    //Get the data in json object
    var obj = {};
    obj["dataContent"] = tempData;
    obj["csvDelimeter"] = me.CSVDelimeter;
    obj["dataFormat"] =  me.DataFormat;

    var params = {
        input: obj /* JSON */
    };

    // result: JSON
    var dataResult = me.TestStaticData(params);
	tempData = dataResult["JSONData"];
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true)  {
		logger.warn("Static Create Trigger Service called: input is: "+input);
    }
    //logger.warn("Create Trigger service in thing is: "+me.name);
    var params = {
        input_data: tempData /* JSON */,
        config_name: me.name /* STRING */,
        typeName: undefined /* STRING */,
        objectType: undefined /* STRING */
    };

    // result: STRING
    var result = me.HandleInputDataStream(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn(" HandleInputDataStream result: "+result);   
    }
}catch(e){
    var result = {"error":e};
    logger.warn("Exception in Static CreateTrigger Service :"+e);
    var mailService =  Things["GenericIEMasterConfig"].HandleCatchExceptions({
        input: {
            CC: Things["GenericIEMasterConfig"].EmailConfiguration.CC,
            BCC:Things["GenericIEMasterConfig"].EmailConfiguration.BCC,
            To:Things["GenericIEMasterConfig"].EmailConfiguration.To,
            payload:e.message,
            Subject:"CreateTrigger"
        }
    });
//    var params = {
//        input:{
//            exception: result /* JSON */,
//            convertedData: {} /* JSON */,
//            rawData: tempData /* STRING */,
//            primaryKey: primaryKey /* STRING */,
//            status: "Source Validation Failed" /* STRING */,
//            config_name: me.name
//        }
//    };
//
//    // result: INFOTABLE dataShape: Undefined
//    var recorded_result = me.RecordTransactionalData(params);    
}