//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
try{
    var arr = input.result;
    var transactionMT = Things["GenericIEMasterConfig"].TransactionMetricTable;
    for(var i=0;i<arr.length;i++){
        var obj = arr[i];
        var newRow = new Object();
        newRow.configName = obj.configName;
        newRow.groupName = obj.groupName;
        newRow.groupType = (obj.groupType).toLowerCase();
        newRow.ID = obj.id;
        newRow.transactionID = obj.id;
        newRow.success = obj.metric.success;
        newRow.failure = obj.metric.failure;
        //transactionMT.AddRow(newRow);
    }
    Things["GenericIEMasterConfig"].TransactionMetricTable = transactionMT;
    var result = Things["GenericIEMasterConfig"].TransactionMetricTable;
}catch(e){
    var result = {"error":e};
    logger.warn("Exception in service AddDM2TMT: "+e);
}