//INPUTS: Nothing
//OUTPUT: result(JSON)
try{
    var resultArr = [];
//    function isNameExist(type,name,groupName){
//        for (var i = 0; i < resultArr.length; i++) {
//            if (name === resultArr[i].configName && type === resultArr[i].groupType && groupName === resultArr[i].groupName) {
//                return true;
//                break;
//            }
//        }
//        return false;
//    }
//    function returnRowCount(term, type, name) {
//        var QP ={
//            "filters": {
//                "type": "AND",
//                "filters": [
//                    {
//                        "fieldName": "configName",
//                        "type": "EQ",
//                        "value": name
//                    }
//                    ,
//                    {
//                        "fieldName": "configType",
//                        "type": "EQ",
//                        "value": type
//                    }
//                    ,
//                    {
//                        "fieldName": "tag",
//                        "type": "TAGGED",
//                        "tags": [
//                            {
//                                "vocabulary": "IELogs",
//                                "vocabularyTerm": term
//                            }
//                        ]
//                    }
//                ]
//            }
//        }
//
//        var params = {
//            maxItems: 500 /* NUMBER */,
//            values: undefined /* INFOTABLE*/,
//            query: QP /* QUERY */,
//            source: undefined /* STRING */,
//            tags: undefined /* TAGS */
//        };
//
//        // result: INFOTABLE
//        var r = Things["IELogsDataTable"].QueryDataTableEntries(params);
//        return r.ToJSON().rows.length;
//    }
//    function returnObj(type, arr) {
//        for (var i = 0; i < arr.length; i++) {
//            var obj={
//            };
//            var s=0;
//            var f=0;
//            var name = arr[i].configName;
//            var isExists = isNameExist(type, name, arr[i].groupName);// check whether the configName is already exists in resultant Array or not.
//            if (!isExists) {
//                s=returnRowCount("Info", type, name);
//                f=returnRowCount("Warning", type, name);
//                obj =  {
//                    "groupName": arr[i].groupName,
//                    "configName": name,
//                    "groupType": type,
//                    "metric": {
//                        "success": s,
//                        "failure": f
//                    }
//                    ,
//                    "id": arr[i].primaryKey
//                }
//                resultArr.push(obj);
//            }
//        }
//    }
//    function returnArr(type) {
//        var query = {
//            "filters": {
//                "fieldName": "configType",
//                "type": "EQ",
//                "value": type
//            }
//        };
//        var params = {
//            maxItems: undefined /* NUMBER */,
//            values: undefined /* INFOTABLE*/,
//            query: query /* QUERY */,
//            source: undefined /* STRING */,
//            tags: undefined /* TAGS */
//        };
//
//        // result: INFOTABLE
//        var qr = Things["IELogsDataTable"].QueryDataTableEntries(params);
//        return qr.ToJSON().rows;
//
//    }
//    var srcArr = returnArr("Source");
//    var tarArr = returnArr("Target");
//    var mapArr = returnArr("Mapping");
//    returnObj("Source", srcArr);
//    returnObj("Target", tarArr);
//    returnObj("Mapping", mapArr);
var params = {
    oldestFirst: true /* BOOLEAN */,
    maxItems: 500 /* NUMBER */
}
// result: INFOTABLE dataShape: ""
var getdata =  Things["RecordMetricsDataStream"].GetStreamEntriesWithData(params);

var tableLength = getdata.ToJSON().rows.length;
for (var x = 0; x < tableLength; x++) {
    var row = getdata.ToJSON().rows[x];
    var obj = {};
    obj =  {
        "groupName": row.groupName,
        "configName": row.configName,
        "groupType": row.groupType,
        "dataSourceType":  Things[row.configName] ? Things[row.configName].dataSourceType: "mapping",
        "metric": {
            "success": Things[row.configName].success,
            "failure": Things[row.configName].failure
        },
        "id": row.ID
    };
    resultArr.push(obj);
}
var result={"result": resultArr};
}
catch(e){
    var result = {"error":e};
    logger.warn("Exception in service GetDashboardMetrics is: "+e.message);
}
