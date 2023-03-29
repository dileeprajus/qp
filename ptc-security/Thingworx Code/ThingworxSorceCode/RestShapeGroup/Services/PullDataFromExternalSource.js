//INPUTS:	body(JSON),headers(JSON),url_params(JSON),request_variables(JSON)
// OUTPUTS: result(JSON)
try{
    //var input = me.ConfigJson;
//    var params = {
//        input: me.ConfigJson /* JSON */
//    };
//    // result: STRING
//    var input = Things["GenericIEMasterConfig"].ObjectStringify(params);
//    input = JSON.parse(input);
    var params = {
         input: {"configName":me.name, "configJson":me.ConfigJson} /* JSON */
     };

    // result: STRING
    var stringifyResult = me.HandleDecryption(params);
    input = JSON.parse(stringifyResult);
    
    input["sourceType"] = "";
    input["external_data_payload"]=payload;
    input["external_data_headers"]=headers;
    input["external_data_url_params"]=url_params;

    var request_variables = (request_variables !== undefined) ? request_variables : {};
    var params = {
        input: input /* JSON */,
        request_variables: request_variables
    };

    if(input.current_data_format==="JSON"){
        // result: JSON
        var result = me.TestApi(params);
        var sTime = new Date();
        result = result["result"];
    }
    else if(input.current_data_format==="XML"){
        // result: XML
        var result = me.TestApiXML(params);
        var sTime = new Date();
        result = result["result"];
        result = String(result);

        var params = {
            input:  result  /* STRING */,
        };
        result = Things["MappingConfig"].GetJsonFromXML(params);
    }
    else if(input.current_data_format==="CSV"){
        // result: String
        var result = me.TestApiCSV(params);
        var sTime = new Date();
        result = result["result"];
        var params = {
            delimeter: input["csv_delimeter"],
            csv_data: result
        };
        // jsonFromCSV: JSON
        result = Things["MappingConfig"].GetJsonFromCSV(params);

    }
    else{
        var result = {};
    }
        //Record the source audit data when data is pull from source
//     var params = {
//         input: {
//             "sId": me.name,
//             "tId": "",
//             "mTime": new Date(),
//             "sTime": sTime,
//             "tTime": new Date(),
//             "tSeq": Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum()+1,
//             "mccId": me.name
//         }
//         /* JSON */
//     };
//    // result: JSON
//    var recordResult = Things["GenericIEMasterConfig"].RecordTransactionalAuditData(params);
}
catch(e){
    var result = {"error":e};
    logger.warn("Exception in PullDataFromExternalSource is : "+e);
}