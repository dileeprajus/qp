//Inputs: Input (JSON)
//Output : JSON
var defaultArr = {};
var output,logs_result;
try {
    var maxitems = input.maxitems ? input.maxitems : 500 ;
    var result = {};
    var query = {};
    if (input.groupType === 'source') {
         query = {
            "filters": {
                "fieldName": "sourceConfig",
                "value": input.configName,
                "type": "EQ"
            }
        };
        var params1 = {
                oldestFirst: false /* BOOLEAN */ ,
                maxItems: maxitems /* NUMBER */ ,
                sourceTags: undefined /* TAGS */ ,
                endDate: undefined /* DATETIME */ ,
                query: query /* QUERY */ ,
                source: undefined /* STRING */ ,
                startDate: undefined /* DATETIME */ ,
                tags: undefined /* TAGS */
            };
        if (input.serviceInfo === 'fetchLogsInfo') {
             params1 = {
                oldestFirst: false /* BOOLEAN */ ,
                maxItems: maxitems /* NUMBER */ ,
                sourceTags: undefined /* TAGS */ ,
                endDate: input.toDate /* DATETIME */ ,
                query: query /* QUERY */ ,
                source: undefined /* STRING */ ,
                startDate: input.fromDate /* DATETIME */ ,
                tags: undefined /* TAGS */
            };

        } else {
        }
        logs_result = Things["AuditInfoStream"].QueryStreamEntriesWithData(params1);
        if (logs_result) {
            for (var i = 0; i < logs_result.length; i++) {
                logs_result.rows[i].tSeq = logs_result.rows[i].id;
                delete logs_result.rows[i].sourceData;
                delete logs_result.rows[i].targetData;
                delete logs_result.rows[i].mappingData;
                delete logs_result.rows[i].primaryKey;
                delete logs_result.rows[i].targetConfig;
                delete logs_result.rows[i].mappingTimeStamp;
                delete logs_result.rows[i].mappingConfig;
                delete logs_result.rows[i].targetTimeStamp;
                delete logs_result.rows[i].parentTSeq;
                logs_result.rows[i].timeStamp = logs_result.rows[i].sourceTimeStamp;
                logs_result.rows[i].groupType = 'source';
                var flowDataSourceType = logs_result.rows[i].flowDataSourceType;
                flowDataSourceType = flowDataSourceType.split("-");
                logs_result.rows[i].flowDataSourceType = flowDataSourceType[0];
            }
        }
        var paramsConversion = {
            table: logs_result /* INFOTABLE */
             };
            output = Resources["InfoTableFunctions"].ToJSON(paramsConversion);
            defaultArr = output.rows;
            result = {
                "Result": defaultArr
            };

    } else if (input.groupType === 'target') {
         query = {
            "filters": {
                "fieldName": "targetConfig",
                "value": input.configName,
                "type": "EQ"
            }
        };
        var params2 = {
                oldestFirst: false /* BOOLEAN */ ,
                maxItems: maxitems /* NUMBER */ ,
                sourceTags: undefined /* TAGS */ ,
                endDate: undefined /* DATETIME */ ,
                query: query /* QUERY */ ,
                source: undefined /* STRING */ ,
                startDate: undefined /* DATETIME */ ,
                tags: undefined /* TAGS */
            };
        if (input.serviceInfo === 'fetchLogsInfo') {
             params2 = {
                oldestFirst: false /* BOOLEAN */ ,
                maxItems: maxitems /* NUMBER */ ,
                sourceTags: undefined /* TAGS */ ,
                endDate: input.toDate /* DATETIME */ ,
                query: query /* QUERY */ ,
                source: undefined /* STRING */ ,
                startDate: input.fromDate /* DATETIME */ ,
                tags: undefined /* TAGS */
            };

        } else {

        }
        logs_result = Things["AuditInfoStream"].QueryStreamEntriesWithData(params2);
        if (logs_result) {
            for (var m = 0; m < logs_result.length; m++) {
                logs_result.rows[m].tSeq = logs_result.rows[m].id;
                delete logs_result.rows[m].sourceData;
                delete logs_result.rows[m].targetData;
                delete logs_result.rows[m].mappingData;
                delete logs_result.rows[m].primaryKey;
                delete logs_result.rows[m].sourceConfig;
                delete logs_result.rows[m].mappingTimeStamp;
                delete logs_result.rows[m].mappingConfig;
                delete logs_result.rows[m].sourceTimeStamp;
                delete logs_result.rows[m].parentTSeq;
                logs_result.rows[m].timeStamp = logs_result.rows[m].targetTimeStamp;
                logs_result.rows[m].groupType = 'target';
                var flowDataSourceType1 = logs_result.rows[m].flowDataSourceType;
                flowDataSourceType1 = flowDataSourceType1.split("-");
                logs_result.rows[m].flowDataSourceType = flowDataSourceType1[1];
            }
        }
        var paramsConversion = {
            table: logs_result /* INFOTABLE */
             };
            output = Resources["InfoTableFunctions"].ToJSON(paramsConversion);
            defaultArr = output.rows;
            result = {
                "Result": defaultArr
            };
    } else {
        if (input.serviceInfo === 'fetchLogsInfo') {
            // result: INFOTABLE dataShape: ""
            var paramsFetch = {
                oldestFirst: false /* BOOLEAN */ ,
                maxItems: maxitems /* NUMBER */ ,
                sourceTags: undefined /* TAGS */ ,
                endDate: input.toDate /* DATETIME */ ,
                query: undefined /* QUERY */ ,
                source: undefined /* STRING */ ,
                startDate: input.fromDate /* DATETIME */ ,
                tags: undefined /* TAGS */
            };
            logs_result = Things["AuditInfoStream"].QueryStreamEntriesWithData(paramsFetch);
            for(var k =0;k<logs_result.length;k++){
             logs_result.rows[k].tSeq = logs_result.rows[k].id;
                delete logs_result.rows[k].sourceData;
                delete logs_result.rows[k].targetData;
                delete logs_result.rows[k].mappingData;
            }
            var paramsConversion = {
            table: logs_result /* INFOTABLE */
             };
            output = Resources["InfoTableFunctions"].ToJSON(paramsConversion);
            defaultArr = output.rows;
            result = {
                "Result": defaultArr
            };
        }else if(input.serviceInfo === 'search'){
         var num = input.filtervalue;
			num = num+"E12";
			num = num.split("");
			num.splice(1,0,".");
			num = num.join("");
            query = {
            "filters": {
                "fieldName": "transactionId",
                "value": num,
                "type": "EQ"
            }
        };
             paramsSearch = {
                oldestFirst: false /* BOOLEAN */ ,
                maxItems: maxitems /* NUMBER */ ,
                sourceTags: undefined /* TAGS */ ,
                endDate: undefined /* DATETIME */ ,
                query: query /* QUERY */ ,
                source: undefined /* STRING */ ,
                startDate: undefined /* DATETIME */ ,
                tags: undefined /* TAGS */
            };
           logs_result = Things["AuditInfoStream"].QueryStreamEntriesWithData(paramsSearch);
            for(var l =0;l<logs_result.length;l++){
           logs_result.rows[l].tSeq = logs_result.rows[l].id;
                delete logs_result.rows[l].sourceData;
                delete logs_result.rows[l].targetData;
                delete logs_result.rows[l].mappingData;
            }
            var paramsConversion = {
            table: logs_result /* INFOTABLE */
             };
            output = Resources["InfoTableFunctions"].ToJSON(paramsConversion);
            defaultArr = output.rows;
            result = {
                "Result": defaultArr
            };
        }
        else {
             logs_result = Things["AuditInfoStream"].GetStreamEntriesWithData({
                oldestFirst: false /* BOOLEAN */ ,
                maxItems: maxitems/* NUMBER */
            });
            logs_result.Sort({ name: "sourceTimeStamp", ascending: false });
            for(var x =0;x<logs_result.length;x++){
               logs_result.rows[x].tSeq = logs_result.rows[x].id;
                delete logs_result.rows[x].sourceData;
                delete logs_result.rows[x].targetData;
                delete logs_result.rows[x].mappingData;
            }
            var paramsDefault = {
            table: logs_result /* INFOTABLE */
             };
            output = Resources["InfoTableFunctions"].ToJSON(paramsDefault);
            defaultArr = output.rows;
            result = {
                "Result": defaultArr
            };
        }
    }
} catch (e) {
    var result = {
        "exception": e.message
    };
}
