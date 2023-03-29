//INPUT  input={}
//OUTPUT  result= {}
var tObj = transactionObj;
var result = {"result":[]};
try {
    var configJson = me.ConfigJson;
    var scriptResponse = input.scriptResponse;
    var hostInfoObj = me.GetGooglePubSubHostInfo();
    var googlePubSubDataQueryObj = {
        "action": "fileSortedList",
        "googlePubSubEditFileInfo" :scriptResponse,
        "hostProperties" :hostInfoObj
    };
    var params = {
        inputJson: googlePubSubDataQueryObj /* JSON */
    };
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn('**************** getFileSortedList ****************'+JSON.stringify(params));
    }
    // result: JSON
    var res = Things["GooglePubSubConfig"].getFileSortedList(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn('***********Array FilesListNames*************'+JSON.stringify(res));
    }
    var arrayList = res["result"]["filesList"];
    var tempArray = [];
    if(Array.isArray(arrayList)===true){
        for(var i=0; i<arrayList.length; i++) {
            hostInfoObj = me.GetGooglePubSubHostInfo();
            var k = arrayList[i].split(".")[1].toUpperCase();
            var filepathObj = {
                "action": "readFileContent",
                "googlePubSubEditFileInfo" :{
                    "filePath" :  scriptResponse.filePath+arrayList[i],
                    "fileType" : k
                },
                "hostProperties" :hostInfoObj
            };
            var params3 = {
                inputJson: filepathObj /* JSON */
            };
            var rrr = Things["GooglePubSubConfig"].readDataFromFile(params3);
             var parseRes = {};
            if(k==="JSON") {
                if(Object.keys(rrr.result).length!== 0) {
                    parseRes = JSON.parse(rrr["result"]["filesList"]);
                }
            }else if(k==="XML") {
                if (Object.keys(rrr.result).length !== 0) {
                    var params1 = {
                        input: rrr["result"]["filesList"]  /* STRING */,
                    };
                    var convertedRes = Things["MappingConfig"].GetJsonFromXML(params1);
                    if (convertedRes.root) {
                        parseRes = convertedRes.root;
                    } else {
                        parseRes = convertedRes;
                    }
                }
            }else {
                var csvDelimeter = configJson['googlePubSubEditFileInfo'].csvDelimeter;
                if (Object.keys(rrr.result).length !== 0) {
                    var params2 = {
                        delimeter: csvDelimeter /* STRING */,
                        csv_data:  rrr["result"]["filesList"]  /* STRING */
                    };

                    // jsonFromCSV: JSON
                     parseRes = Things["MappingConfig"].GetJsonFromCSV(params2);
                }
            }
            tempArray.push(parseRes);
        }}
    if(tempArray.length) {
    result = {"result":tempArray};
    }
}catch(e) {
    result = {
        "Exception in Script Result: ": e.message
    };
    logger.warn("Exception in GetFilesListData Script Result"+e.message);
}