//INPUTS: input(JSON)
//OUTPUT: result(JSON)
// var id = Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum()+1;
// //Record the source audit data when data is triggered from source
// var params1 = {
//     input: {
//         "sId": me.name,
//         "tId": "",
//         "mTime": new Date(),
//         "sTime": new Date(),
//         "tTime": new Date(),
//         "tSeq":id,
//         "mccId": me.name
//         // "transId": id +"-"+me.name
//     }
//     /* JSON */
// };
//
// // result: JSON
// var recordResult = Things["GenericIEMasterConfig"].RecordTransactionalAuditData(params1);
try{
    var primaryKey = new Date();
    var result = {};
    var triggerObjData = input.objectData[input.objectType]
    if(input.objectData[input.objectType].length!==undefined && input.objectData[input.objectType].length>=0){
            triggerObjData = input.objectData[input.objectType][0]
    }
    if(me.ConfigJson["PrimaryKey"]){
        var params = {"primaryKey": me.ConfigJson["PrimaryKey"],"inputData": triggerObjData}
        var p_value = Things["GenericIEMasterConfig"].GetPrimaryKeyValue(params);
        //logger.warn("Primary key Input: "+JSON.stringify(params));
        logger.warn("Primary key value: "+JSON.stringify(p_value));
        if(p_value.Result){
            primaryKey = p_value.Result;
        }
    }
        var count = me.tempCount + 1;
        me.tempCount = count;
        logger.warn("Update Trigger service called: input is: Count : "+count+input);
        // logger.warn("Update Trigger service in thing is: "+me.name);
         var temp_tags = "Applications:IE;Applications:DynamicConfig;Applications:Source";
        //Record the data in logDatatable
        var log_params = {
            configName: me.name /* configName */,
            tag: "IELogs:Info" /* TAGS */,
            updatedAt: new Date() /* DATETIME */,
            errorORInfo: input /* JSON */,
            primaryKey: new Date() /* STRING */
        };
    
        // result: INFOTABLE dataShape: Undefined
        var log_result = me.RecordLogsData(log_params);
    
        if(me.GetTags()==temp_tags){
            var obj = {};
            obj["config_name"] = me.name;
            obj["data"] = input.objectData;
            var params = {
                input_data: input.objectData[input.objectType] /* JSON */,
                config_name: me.name /* STRING */,
                typeName: input.typeName /* STRING */,
                objectType: input.objectType /* STRING */
            };
    
            // result: STRING
            result = me.HandleInputDataStream(params);
    
        }
    
        // logger.warn("Update Trigger service called: input is: "+input);
    }catch(e){
        var result = {"error":e};
        logger.warn("Exception in UpdateTrigger Service :"+e);
    //     var params = {
    //         input:{
    //            "convertedData": {} /* JSON */,
    //            "rawData": input.objectData /* STRING */,
    //            "primaryKey": primaryKey /* STRING */,
    //            "config_name": me.name,
    //            "updatedAt": new Date() /* DATETIME */,
    //         }
    //    };
    //
    //    // result: INFOTABLE dataShape: Undefined
    //    var recorded_result = me.RecordTransactionalData(params);
        var log_params = {
            configName: me.name /* configName */,
            tag: "IELogs:Error" /* TAGS */,
            updatedAt: new Date() /* DATETIME */,
            errorORInfo: result /* JSON */,
            primaryKey: new Date() /* STRING */
        };
    
        // result: INFOTABLE dataShape: Undefined
        var log_result = me.RecordLogsData(log_params);
    }
