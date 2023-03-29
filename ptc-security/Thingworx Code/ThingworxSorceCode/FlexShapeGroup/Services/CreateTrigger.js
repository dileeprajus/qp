//INPUTS: input(Json), type(String)
// OUTPUTS: result(JSON)
var primaryKey = new Date();
var tObj = {tSeq: primaryKey, transactionId: primaryKey, sourceConfig: me.name ? me.name : "", sourceType: me.dataSourceType ? me.dataSourceType : "", sourceTime: primaryKey, parentTSeq: primaryKey, status:"Info:Success"};
if(transactionObj!== undefined) {
 	tObj.parentTSeq = transactionObj.transactionId;
    if(transactionObj.test === "yes"){
        tObj = transactionObj;
        tObj.sourceConfig = me.name;
        tObj.sourceType = me.dataSourceType;
    }
}
try{

   if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    logger.warn("CreateTrigger Initiated: type:  "+type+"   "+JSON.stringify(input));
   }
    //Transaction Hold functionality in Pre  script of flex
    //Transaction will be holded by me.hold = true
    Things[me.name].hold = false;
    var source_configJson = Things[me.name].ConfigJson;
    var src_pre_rules = [];
    if(source_configJson["PreTransformationRules"] && source_configJson["PreTransformationRules"].length>0){
        src_pre_rules = source_configJson["PreTransformationRules"];
        if (src_pre_rules[0]["script"].length > 0) {
           var data = input ? input : {};
            var sps = {
                input: {"value": data} /* JSON */,
                transactionObj: tObj,
                sample_script: {"script_array": src_pre_rules[0]["script"]}, /* JSON */ //As allowing only one script in target
                configName: me.name
            };
            var src_pre_script_output = Things["GenericIEMasterConfig"].TestScript(sps);
            data = src_pre_script_output.value;
            if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
             logger.warn("*********** Soure PreScript Response(before EntersInto TRC Queue) *******"+JSON.stringify(data));
            }
        }

    }
    
    if(Things[me.name].hold === false){
  		// result: JSON
        tObj.sourceData = input;
        if(type && type === 'ASYNC'){
           if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {  
            logger.warn("***************ASynchronousCreateTrigger*****************");
           }
           if(tObj.sourceData) {
            delete tObj.sourceData;
           }
            var Async_params = {
                input: input, /* JSON */
                transactionObj:tObj
            };
            // result: JSON
            var result = me.ASynchronousCreateTrigger(Async_params);
            function sleep(milliseconds) {
                  var date = Date.now();
                  var currentDate = null;
                  do {
                    currentDate = Date.now();
                  } while (currentDate - date < milliseconds);
                }
             //  sleep(60000);
        result = {"Status":"Success","Description":"Async service received the object and data flow will start"};

        }else{
          if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            logger.warn("***************SynchronousCreateTrigger******************");
          }

           var params = {
                input: input, /* JSON */
                transactionObj:tObj 
            };
            // result: JSON
            var result = me.SynchronousCreateTrigger(params);
        }
    }else{
        var text = 'Transaction Holded for '+me.name;
       var result = {'Status': text};
      logger.warn('ME.HOLD IS TRUE FOR' + me.name);
          tObj.sourceData = {"warning":text};
          tObj.mappingData = {"warning": "Nodata"};
          tObj.targetData = {"warning": "Nodata"};
          tObj.status = "Source Holded";
          tObj.targetType = "";
          Things["GenericIEMasterConfig"].InvokeRecordData({
            input: tObj /* JSON */
       	  });
    }
}
catch(e){
    var result ={"exception: Issue in CreateTrigger Service ":e.message};
    logger.warn("Exception in CreateTrigger Service: "+e);
}