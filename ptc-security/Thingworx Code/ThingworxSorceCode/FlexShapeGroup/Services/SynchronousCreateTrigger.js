//INPUTS: input(JSON)
//OUTPUT: result(JSON)

//**Checking if the input has MasterCreateContext**/
//if(input["MasterCreateContext"]===undefined){ //it will be avialable when it is triggered by TRC
//    updated_input["MasterCreateContext"] = null;
//}
//else{
//    updated_input["MasterCreateContext"] = input["MasterCreateContext"];
//}
// var id = Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum()+1;
// //logger.warn("hieghest seq no of Audti table: "+(Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum()));
// //Record the source audit data when data is triggered from source
// var params1 = {
//     input: {
//         "sId": me.name,
//         "tId": "",
//         "mTime": new Date(),
//         "sTime": new Date(),
//         "tTime": new Date(),
//         "tSeq": id,
//         "mccId": me.name
//         //"transId": id +"-"+me.name
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
            //Record the data in logDatatable
            var log_params = {
                configName: me.name /* configName */,
                tag: "IELogs:Info" /* TAGS */,
                updatedAt: new Date() /* DATETIME */,
                errorORInfo: {"Info":input} /* JSON */,
                primaryKey: new Date() /* STRING */
            };
    
            // result: INFOTABLE dataShape: Undefined
            var log_result = me.RecordLogsData(log_params);
        
        //Call Handle input data stream service means data flow by only if the thing is souce thing
        var temp_tags = "Applications:IE;Applications:DynamicConfig;Applications:Source";
    
        if(me.GetTags()==temp_tags){
            var obj = {};
            obj["config_name"] = me.name;
            obj["data"] = input.objectData;
            //obj["data"] = input;
    
            //    var params = {
            //        input: obj /* JSON */
            //    };
            //    // result: STRING
            //    var result = Things["GenericCDEEMasterThing"].HandleInputDataStream(params);
    
            var params = {
                input_data: input.objectData[input.objectType] /* JSON */,
                config_name: me.name /* STRING */,
                typeName: input.typeName /* STRING */,
                objectType: input.objectType /* STRING */,
                MCC: null
            };
    
            // result: STRING
            result = me.HandleInputDataStream(params);
    
        }
    
    }
    catch(e){
        var result = {"Exception":e};
        logger.warn("Exception in Synchronous Flex CreateTrigger Service :"+e);
    //    var params = {
    //        input:{
    //            "convertedData": {} /* JSON */,
    //            "rawData": input.objectData /* STRING */,
    //            "primaryKey": primaryKey /* STRING */,
    //            "config_name": me.name
    //        }
    //    };
    //
    //    // result: INFOTABLE dataShape: Undefined
    //    var recorded_result = me.RecordTransactionalData(params);
        var log_params = {
            configName: me.name /* configName */,
            tag: "IELogs:Error" /* TAGS */,
            updatedAt: new Date() /* DATETIME */,
            errorORInfo: {"Warning":result} /* JSON */,
            primaryKey: new Date() /* STRING */
        };
    
        // result: INFOTABLE dataShape: Undefined
        var log_result = me.RecordLogsData(log_params);
    }
