//INPUT  input= {}
// request_variables = {}
//OUTPUT  result= {}

try{
    var hostInfoObj = me.GetFTPHostInfo();
    var configObj = input.configJson['ftpFileInfo'];
    var params = {
        input: input /* JSON */,
        request_variables: request_variables /* JSON */,
        configObj: configObj /* JSON */
    };
    // result: JSON
    var config = me.OverRideRequestVariables(params);

    var filepathObj = {
        "action": "readFileContent",
        "ftpFileInfo" :{
            "filePath" : hostInfoObj.rootDirectory+config.filePath+config.fileName +"."+config.fileType.toLowerCase(),
            "fileType" : config.fileType
        },
        "hostProperties" :hostInfoObj
    }
    var params = {
        inputJson: filepathObj /* JSON */
    };

    // result: JSON
    var res = Things["FTPConfig"].readDataFromFile(params);
      
    var result = {"fileType": config.fileType, "response":res["result"]["filesList"]}
}
catch(e){
    var result = {"error":e};
}