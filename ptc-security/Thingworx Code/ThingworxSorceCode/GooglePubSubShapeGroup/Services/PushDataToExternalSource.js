//INPUT  body={} headers={} url_params = {}, transactionObj(JSON)
//OUTPUT  result= {}
var tObj = transactionObj || {};
if(isTarget===undefined) {
 tObj = {tSeq: new Date(), transactionId: tObj.transactionId, sourceConfig:"-", sourceType: "", sourceTime: "", sourceData: {"status":"No Source"}, mappingConfig: "-",mappingTime:"",mappingData:{"status":"No Mapping"}, targetConfig: me.name ? me.name : "", targetType: me.dataSourceType ? me.dataSourceType : "",status:"Info:Success Only Target", parentTSeq: tObj.transactionId};
}
 var tTime = new Date().getTime();
try{
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   	 logger.warn('*************GooglePubSub PushDataToExternalSource Input************'+JSON.stringify(body));
    }
    var googlePubSubEditFileInfo = me.googlePubSubEditFileInfo;
    var hostInfoObj = me.GetGooglePubSubHostInfo();
    var data = body;

    var params = {
        input: body /* JSON */
    };
    // result: JSON
    var googlepubsubPathObj = Things[me.name].OverRideTargetRequestVariables(params);

    var temp_data;
    var result;
    if(body !== ""){
        var googlePubSubEditFileInfo = googlepubsubPathObj;
        if(googlePubSubEditFileInfo.fileType=== 'JSON'){
            temp_data = data;
            logger.warn("Check enter");
            if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
	           logger.warn("GooglePubSub JSONdata  :::"+temp_data);
            }
            // result: STRING
        } else if(googlePubSubEditFileInfo.fileType === 'XML'){
           //var rootObj = {"root": data};
             var rootObj = data ? data : {"root": data};
            var params = {
                InputJson: rootObj /* JSON */
            };
            // result: STRING
            var temp_data = me.JsonToXML(params);
            if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            	logger.warn("GooglePubSub XMLdata  :::"+temp_data);
            }
        }else {}
      
        // result: JSON
             result = me.SetDataToTopic({
            	privateKey: me.privateKey.fileData/* JSON */,
            	sampleJSON: temp_data /* JSON */,
            	scope: 'https://www.googleapis.com/auth/pubsub' /* STRING */,
                projectName: me.privateKey.fileData.project_id,
                topicName: me.googlePubSubEditFileInfo.topicName
                           });
        if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
       	 logger.warn("Data sent successfully to GooglePubSub"+JSON.stringify(result));
        }
    }
    if(result && result["responseStatus"]["statusCode"] == 200){
       tObj.status = "Info:Success"; 
    }else{
       tObj.status = "Info:Failed in Target";
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
    tObj.targetData = {"error":"no response"};
    tObj.status = "Info:Failed in Target";
    if (isTarget !== undefined) {
    Things["GenericIEMasterConfig"].InvokeRecordData({
        input: tObj /* JSON */
    });
    }
    logger.warn("Exception in GooglePubSub PushDataToExternalSource service  "+e.message);
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
            Subject:"Error in Target GooglePubSub PushDataToExternalSource for "+me.name
        }
    });
}