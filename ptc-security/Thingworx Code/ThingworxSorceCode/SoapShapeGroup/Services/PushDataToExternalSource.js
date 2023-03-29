//INPUTS: body(JSON),headers(JSON),url_params(JSON), from(String)
//OUTPUTS: result(JSON)
try{
    //To post the converted data to soap endpoint we need 3 values
    //1:Converted data to post
    //2: end point to post data
    //3: selected service(operation name) soapAction
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   	 logger.warn("Converted data for pushDataToExternalSource service in "+me.name+"  is:"+body);
    }
    var form_obj = {};
    var result={};
    var temp_obj = body;
    var json2xml = "";
    var soap_rest_config = {
        current_method_type: 'GET',
        data_url: '',
        basic_auth_details: {
            username: '',
            password: '',
        },        current_auth_type: 'NoAuth',
        sourceType: '',
        headers: '',
        query_params: '',
        current_data_format: '',
        body: {},
    };
    // to use default no auth for fileupload wsdls also
    if(from){
        var params = {
            input: body /* JSON */
        };
        // result: JSON
       body = me.OverrideRequestVariables(params);
        body = body//["payload"];


        var params = {
            input: body.payload ? body.payload :body /* JSON */
        };
        // result: JSON
        body = me.ConstructObject(params);
    }
    if(body===undefined || body===null || body===""){
        body = {}
    }

    if(body!==undefined){
        //if converted data is not empty json then change the converted data to xml string
        //     var params = {
        //             InputJson: {"ROOT":body} /* JSON */
        //        };
        //
        //        // result: STRING
        //        json2xml = me.JsonToXML(params);

        var params = {
            data: body /* JSON */
        };

        // result: STRING
        json2xml = me.AddTNSToPostBody(params);
    }

    // get payload by giving converted xml

    var params = {
        Inputxml: json2xml /* STRING */
    };
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
     logger.warn("GetSOAPRequestPayLoad INPUT::::"+json2xml);
    }
    // result: JSON
    var requestPayload = me.GetSOAPRequestPayLoad(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn("REQUEST PAYLOAD::::"+requestPayload.result);
    }
    var config_json = me.ConfigJson;
    var soap_action = "";
    var selected_wsdl="";
    var selected_portBinding = "";
    var input_wsdl = "";
    var wsdl_url = "";
    var selected_endPointUrl= "";
    if(config_json["SelectedSoapAction"]){
        //get soap for selected service name from config json
        soap_action = config_json["SelectedSoapAction"];
    }
    if(config_json["SelectedWsdl"]){
        selected_wsdl = config_json["SelectedWsdl"];
        //get the selected wsdl which will be used to get the data of the selected wsdl
    }
    if(config_json["SelectedEndPointUrl"]){
        selected_endPointUrl = config_json["SelectedEndPointUrl"];
        //get the selected wsdl url which will be used to post the soap request data
    }
    if(config_json["SelectedPortBinding"]){
        selected_portBinding = config_json["SelectedPortBinding"];
        //get the selected port binding which will be used to get the endpoint of the selected wsdl
    }
    var boilerplate_config = me.BoilerPlateConfig;
    //get the seleted wsdl data from boilerplateconfig property
    if(boilerplate_config["uploadedWSDLS"][selected_wsdl]){
        //if selected wsdl is in boilerplate config json then assign the wsdl data to input_wsdl variable
        input_wsdl = boilerplate_config["uploadedWSDLS"][selected_wsdl]["data"];
        if(boilerplate_config["uploadedWSDLS"][selected_wsdl]["SoapRestConfig"]){
            soap_rest_config = boilerplate_config["uploadedWSDLS"][selected_wsdl]["SoapRestConfig"]
        }
    }

    //    if(input_wsdl!==""&&input_wsdl!==undefined){//get the soap endpoint url by passing inputwsdl to getSoapEndPoint service
    //
    //        var params = {
    //            InputWSDL: input_wsdl /* STRING */
    //        };
    //
    //        // result: JSON
    //        var wsdl_obj = me.GetSoapEndPoint(params); //result for GetSoapEndPoint service is json object contains array of object, each object contains diff url
    //        wsdl_url = wsdl_obj.Result[0].EndPointUrl; //TODO: for now we are taking first object endpointurl as inputurl
    //        var wsdl_arr = wsdl_obj["Result"];
    //        //Get the end point for the selected port binding
    //        for(var i=0; i<wsdl_arr.length;i++){ // loop through wsdl_obj and get the end point where the selected port binding is matches with the port binding value in one of the wsdl obj
    //            if(selected_portBinding===wsdl_arr[i]["Port Binding"]){ //get that endpointurl if selected port binding is same as port binding value in wsdl_arr[i]
    //             wsdl_url = wsdl_arr[i].EndPointUrl;
    //            }
    //        }
    //    }
    var Result = "";
    //post the converted data to soap end point after collecting the all the input data
    var params = {
        InputRequestBody: requestPayload.result /* STRING */,
        InputURL: selected_endPointUrl /* STRING */,
        SoapAction: soap_action /* STRING */,
        ConfigJson : soap_rest_config
    };
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   	 logger.warn("InputURL:"+selected_endPointUrl+" SoapAction : "+soap_action);
    }
    // result: STRING(xml)
    var Result = me.SendRequestObject(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn("RESULT FROM SOAP POST:"+Result);
    }
    var params = {
        InputXML: Result /* JSON */
    };
    // result: JSON
    result = Things["MappingConfig"].XMLToJson(params);
    if(result["soap:Envelope"]){
        if(result["soap:Envelope"]["soap:Body"]){
            result = result["soap:Envelope"]["soap:Body"]
        }
    }
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn("Converted JSON from XSD in SOAP is  : "+JSON.stringify(result));
    }
    //Record the data in logDatatable
    var log_params = {
        configName: me.name /* ThingName */,
        tag: "IELogs:Info" /* TAGS */,
        updatedAt: new Date() /* DATETIME */,
        errorORInfo: {"Info":{"InputRequestBody":json2xml,"InputURL":selected_endPointUrl,"SoapAction":soap_action, "RequestPayload":requestPayload }
                     } /* JSON */,
        primaryKey: new Date() /* STRING */
    };

    // result: INFOTABLE dataShape: Undefined
    //var log_result = me.RecordLogsData(log_params);

    //Convert the Result (XML)
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn("inputs for sendRequestObject is : InputRequestBody: "+json2xml+"  InputURL:  "+selected_endPointUrl+" SoapAction:  "+soap_action);
    }
    //var result ={"result": Result};
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
     logger.warn("Data is pushed to SOAP Successfully to "+me.name+" Thing: "+result);
    }
}catch(e){
    var result = {"error":e};
//    var tTime = new Date();
//   var getParams = {
//       input: {
//           "tSeq" : Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum(),
//           "name" : me.name,
//           "tTime": tTime
//
//       } /* JSON */
//   };
//
//   // result: JSON
//   var tranSeqresult = Things[me.name].GetCurrentTargetTransactionSeqRow(getParams);
    //Record the data in logDatatable
        var log_params = {
            configName: me.name /* ThingName */,
            tag: "IELogs:Warning" /* TAGS */,
            updatedAt: new Date() /* DATETIME */,
            errorORInfo: {"Exception":e} /* JSON */,
            primaryKey: new Date() /* STRING */
        };

        // result: INFOTABLE dataShape: Undefined
        //var log_result = me.RecordLogsData(log_params);
    logger.warn("Exception in SOAP PushDataToExternalSource service  "+e);
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
