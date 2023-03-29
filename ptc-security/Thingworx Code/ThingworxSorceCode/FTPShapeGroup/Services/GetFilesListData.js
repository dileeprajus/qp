//INPUT  input={}
//OUTPUT  result= {}

try {
    var configJson = me.ConfigJson;
    var scriptResponse = input.scriptResponse;
    var hostInfoObj = me.GetFTPHostInfo();
    var ftpDataQueryObj = {
        "action": "fileSortedList",
        "ftpFileInfo" :scriptResponse,
        "hostProperties" :hostInfoObj
    }
    var params = {
        inputJson: ftpDataQueryObj /* JSON */
    };
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn('**************** getFileSortedList ****************'+JSON.stringify(params));
    }
    // result: JSON
    var res = Things["FTPConfig"].getFileSortedList(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn('***********Array FilesListNames*************'+JSON.stringify(res));
    }
    var arrayList = res["result"]["filesList"];
    var tempArray = [];
    if(Array.isArray(arrayList)===true){
        for(var i=0; i<arrayList.length; i++) {
            var hostInfoObj = me.GetFTPHostInfo();
            var k = arrayList[i].split(".")[1].toUpperCase();
            var filepathObj = {
                "action": "readFileContent",
                "ftpFileInfo" :{
                    "filePath" :  scriptResponse.filePath+arrayList[i],
                    "fileType" : k
                },
                "hostProperties" :hostInfoObj
            }
            var params = {
                inputJson: filepathObj /* JSON */
            };
            var rrr = Things["FTPConfig"].readDataFromFile(params);
          // logger.warn('++++++++++++++++++++++++++rrr+++++++++++++++++'+JSON.stringify(filepathObj))
         //  logger.warn('++++++++++++++++++++++++++k+++++++++++++++++'+JSON.stringify(rrr))
//            if(k==="JSON") {
//                var parseRes = JSON.parse(rrr["result"]["filesList"]);
//            }else {
//                var params = {
//                    input:  rrr["result"]["filesList"]  /* STRING */,
//                };
//                var convertedRes = Things["MappingConfig"].GetJsonFromXML(params);
//                if(convertedRes.root) {
//                    parseRes = convertedRes.root;
//                }else {
//                    parseRes = convertedRes
//                }
//            }
   // logger.warn('++++++++++++++++++++++++++parseRes+++++++++++++++++'+JSON.stringify(parseRes))
            if(k==="JSON") {
                var parseRes = {};
                if(Object.keys(rrr.result).length!== 0) {
                    parseRes = JSON.parse(rrr["result"]["filesList"]);
                }
            }else if(k==="XML") {
                var parseRes = {}
                if (Object.keys(rrr.result).length !== 0) {
                    var params = {
                        input: rrr["result"]["filesList"]  /* STRING */,
                    };
                    var convertedRes = Things["MappingConfig"].GetJsonFromXML(params);
                    if (convertedRes.root) {
                        parseRes = convertedRes.root;
                    } else {
                        parseRes = convertedRes
                    }
                }
            }else {
                var csvDelimeter = configJson['ftpFileInfo'].csvDelimeter;
                if (Object.keys(rrr.result).length !== 0) {
                    var params = {
                        delimeter: csvDelimeter /* STRING */,
                        csv_data:  rrr["result"]["filesList"]  /* STRING */
                    };

                    // jsonFromCSV: JSON
                     parseRes = Things["MappingConfig"].GetJsonFromCSV(params);
                }
            }
            tempArray.push(parseRes)
        }}
    var result = {"result":tempArray}
}catch(e) {
    result = {
        "Exception in Script Result: ": e.message
    }
    logger.warn("Exception in GetFilesListData Script Result"+e)
}