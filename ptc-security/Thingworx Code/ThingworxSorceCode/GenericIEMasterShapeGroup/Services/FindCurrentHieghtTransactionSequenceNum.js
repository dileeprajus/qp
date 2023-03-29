//INPUTS: NOTHING
//Output: result(NUMBER)
try{
    var count = Things["TransactionAuditTable"].GetDataTableEntryCount();
    if(count == 0){
      var result = 0;
    } else{
        var params = {
            maxItems: Number(count)+1 /* NUMBER */
        };
        // result: INFOTABLE
        var result = Things["TransactionAuditTable"].GetDataTableEntries(params);
    //    var arr = ["targetId","mccId","key","location","source","sourceType","sourceId","targetId","tags","timestamp,","transactionId","sourceTime","mappingTime","targetRespTime","timestamp"];
    //
    //    for(var i=0;i<arr.length;i++){
    //        result.RemoveField(arr[i]);
    //    }
        var params = {
            table: result /* INFOTABLE */
        };
        // result: JSON
        var result = Resources["InfoTableFunctions"].ToJSON(params);
        var arr =[];
        for(var k=0;k<result.rows.length;k++){
            arr.push(result.rows[k].transactionSeq);
        }
        //result = arr;
        result = Math.max.apply(null,arr);
    }
}
catch(e) {
    var result = 0;
    logger.warn("Exception in FindCurrentHieghtTransactionSequenceNum service: "+e);
}
