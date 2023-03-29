//INPUT: Nothing
//Output: result:JSON
try{
    var result={};
    var params = {
        oldestFirst: true /* BOOLEAN */,
        maxItems: 500 /* NUMBER */
    };
    var getdata =  Things["RecordMetricsDataStream"].GetStreamEntriesWithData(params);
    
    var tableLength = getdata.ToJSON().rows.length;
    for (var x = 0; x < tableLength; x++) {
        var row = getdata.ToJSON().rows[x];
      Things[row.configName].success = 0;
      Things[row.configName].failure = 0;
     Things["RecordMetricsDataStream"].DeleteStreamEntry({
		streamEntryId: row.id /* STRING */
	  });
    }
    result={"success":"Deleted summary table entries successfully"};
}
catch(e){
    var result={"exception":e.message};
    logger.warn("Exception in DeleteSummaryTableEntries "+e);
}
