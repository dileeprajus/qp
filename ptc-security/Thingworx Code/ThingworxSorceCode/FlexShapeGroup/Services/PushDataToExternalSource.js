//INPUTS: body(JSON),headers(JSON),url_params(JSON)
//OUTPUTS: result(JSON)
var tObj = transactionObj || {};
if(isTarget===undefined) {
 tObj = {tSeq: new Date(), transactionId: tObj.transactionId, sourceConfig:"-", sourceType: "", sourceTime: "", sourceData: {"status":"No Source"}, mappingConfig: "-",mappingTime:"",mappingData:{"status":"No Mapping"}, targetConfig: me.name ? me.name : "", targetType: me.dataSourceType ? me.dataSourceType : "", status:"Info:Success Only Target", parentTSeq: tObj.transactionId};
}
var tTime = new Date().getTime();
try{
    var result = {};
    var config_json = me.ConfigJson;
    var flex_obj = "";
    var type_id = "";
    if(config_json["SelectedTypeHierarchy"]){
        flex_obj = config_json["SelectedTypeHierarchy"][0].flexObject;
        type_id = config_json["SelectedTypeHierarchy"][0].typeId;
    }
    var form_obj = {};
    // form the object like {"Material":{"typeId":"", .......}} so that new record can be created easily in flex side
    //check converted data result contains the typeid value in it or not
    if(type_id !=="" ){
         form_obj = body;
         form_obj["typeId"] = type_id;
    }

	var convertDataResult = form_obj;
	var create_result = {};
    if(convertDataResult['oid']!==undefined && convertDataResult['oid']!=='' && convertDataResult['oid']!==null){
		var oid = convertDataResult['oid'];
        delete convertDataResult['oid'];
        delete convertDataResult['typeId'];
        var params = {
            input: convertDataResult /* JSON */,
            objectType: flex_obj /* STRING */,
            oid: oid /* STRING */
        };
        if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
       		logger.warn("Flex PushDataToExternalSource Input"+JSON.stringify(params));
     	}
        // result: JSON
        create_result = me.UpdateRecord(params);
        tTime = new Date().getTime();
         tObj.status = "Info:Success";
    } else{
        var createRecordParams = {
            input: convertDataResult /* JSON */,
            objectType: flex_obj
        };
        if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
           logger.warn("Flex PushDataToExternalSource Input"+JSON.stringify(createRecordParams));
        }
    // result: JSON
      create_result = me.CreateRecord(createRecordParams);
       tTime = new Date().getTime();
         tObj.status = "Info:Success";
    }
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn("Flex PushDataToExternalSource Result"+JSON.stringify(create_result));
    }
    if(create_result[flex_obj]){
    	var obj = create_result[flex_obj];
         if(obj["statusCode"] !== 200 || obj["status"] !=="Success" ){
            result = {"Exception":create_result};
            tObj.status = "Failed in Target";
            
        } else {result = create_result;
         tObj.status = "Info:Success";
               }
    }
    else if (create_result.statusCode !=200){
    result = {"Exception":create_result};
            tObj.status = "Failed in Target";
    }
    else {
        if(create_result && create_result.error) {
           tObj.status = "Failed in Target";
//             tObj.targetTime = new Date().getTime();
//              tObj.targetData = create_result;
//            var mailService =  Things["GenericIEMasterConfig"].HandleCatchExceptions({
//            input: {
//                payload:{message: create_result.error ? create_result.error: "error in flex target", transactionObject: tObj},
//                Subject:"Error in Target Flex PushDataToExternalSource for"+me.name
//            }
//    		});
        }
        result = create_result;
    }
     if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn("Data is pushed successfully to "+me.name+" Thing: "+result);
     }
    tObj.targetTime = tTime;
    tObj.targetData = result;
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
    tObj.targetData = {error:""};
    tObj.status = "Info:Failed in Target";
    if (isTarget !== undefined) {
    Things["GenericIEMasterConfig"].InvokeRecordData({
        input: tObj /* JSON */
    });
    }
    logger.warn("Exception in Flex PushDataToExternalSource service  "+e.message);
   	if(tObj.tSeq){
   		delete tObj.tSeq;
    }
    if(tObj.transactionId){
    tObj.transactionId = tObj.transactionId.toString();
    }
    if(tObj.parentTSeq){
    tObj.parentTSeq = tObj.parentTSeq.toString();
    }
    var mailService =  Things["GenericIEMasterConfig"].HandleCatchExceptions({
        input: {
            payload:{message: e.message, transactionObject: tObj},
            Subject:"Error in Target Flex PushDataToExternalSource for"+me.name
        }
    });
}
