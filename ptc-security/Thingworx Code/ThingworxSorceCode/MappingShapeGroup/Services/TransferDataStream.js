//INPUTS input_data(JSON), thing_name(String)
// OUTPUTS: result(JSON)
try{
    //    var data = input.data;
    //    var thing_name = input.thing_name;
    //    var type = input.type;
    //    var client_thing = input.client_name;
    //    var mapping_thing_name = input.mapping_thing_name;
    //
    //    var params = {
    //        input_data: input_data /* JSON */,
    //        coming_from: coming_from
    //    };
    //
    //    // result: JSON
    //    //var convert_result = Things["MappingThing"].ConvertDataStream(params);
    //    var convert_result = me.ConvertDataStream(params);
        
        var data = input_data;
        var thing_name = thing_name;
        var convertDataResult;
        var push_data_result;
        
        function convertDataStream(input_data, coming_from, mapping_thing_name){
            var temp = {"input_data":input_data,"coming_from":coming_from};
    
            var params = {
                input_data: input_data /* JSON */,
                coming_from: coming_from
            };
    
            // result: STRING
           // var transferDS_result = Things["MappingThing"].TransferDataStream(params);
            convertDataResult = Things[mapping_thing_name].ConvertDataStream(params);
            
            var client_thing_name;
            var current_thing;
            if (coming_from === "source") {
                client_thing_name = Things[mapping_thing_name].ConfigJson["DestinationThing"].Name;
                current_thing = "DestinationThing";
            }else {
                client_thing_name = Things[mapping_thing_name].ConfigJson["SourceThing"].Name;
                current_thing = "SourceThing";
            }
            
            //check if the source/destination thing trigger selection Data out is save or send
            //if save is selected  then save the data based on selection
            //if send is selected then send the data by calling pushDataToExternalSource service 
            var client_configJson = Things[client_thing_name].ConfigJson;
            var temp_dataOut = client_configJson["Triggers"].DataOut;
            if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn("Data out for destination: "+temp_dataOut);
            }
            if(temp_dataOut["DataSave"]===true){ //Data save option is true so save the data locally or gDrive or cloud (based on selection)
            
            } else { //Data send is true so call the PushDataToExternalSource service
                if(Things[client_thing_name].thingTemplate=="FlexThingTemplate"){
                    var new_obj = {};
                    new_obj["convertedData"] = convertDataResult;
                    new_obj["maapingConfigJson"] = me.ConfigJson;
                    new_obj["current_thing"] = current_thing;
                    var params = {
                        headers: {} /* JSON */,
                        url_params: {} /* JSON */,
                        body: new_obj /* JSON */
                    };
                    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                     logger.warn("Client thing name: : of flexthingemplate is: "+client_thing_name);
                     logger.warn("& source thing name"+thing_name);
                    }
                     // result: JSON
                    push_data_result = Things[client_thing_name].PushDataToExternalSource(params);    
                }else{
                    var params = {
                        headers: {} /* JSON */,
                        url_params: {} /* JSON */,
                        body: convertDataResult /* JSON */
                    };
                   if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                    logger.warn("Client thing name: :  "+client_thing_name);
                    logger.warn("& source thing name"+thing_name);
                   }
                    // result: JSON
                    push_data_result = Things[client_thing_name].PushDataToExternalSource(params);            
                }
            }
            
            
        }//end of convertDataStream service
        
        var config_json = me.ConfigJson;
        var flex_obj =config_json["SourceThing"];
        var client_obj = config_json["DestinationThing"];
        //logger.warn("configjson obj: "+JSON.stringify(config_json));
        var mapping_thing_name = me.name;
        if (thing_name===flex_obj["Name"]) {
            if (flex_obj["S2DTrigger"]===true) {
                if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                  logger.warn("s2d is true: "+thing_name);
                }
                convertDataStream(data,"source",mapping_thing_name);
            }
        }
        if (thing_name===client_obj["Name"]) {
            if (client_obj["D2STrigger"]===true) {
                if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                    logger.warn(" is true: "+thing_name);
                }
                convertDataStream(data,"destination",mapping_thing_name);
            }
        }
        var result = convertDataResult;
    
        //var result = handle_output_result;
        var result = push_data_result;
        if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            logger.warn("Result for TransferDataStream service is : "+result);
        }
    }catch(e){
        var result = {};
        logger.warn("Exception in TransferDataStream service::"+e);
    }
