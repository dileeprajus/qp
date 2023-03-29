//Inputs: input(JSON)
//output: result(JSON)
try{
    var configName =  input.configName;
    var retriveFor = input.type;
    var filterType = input.filterType; //to retrive the data by date or normal.
	//var providerPackageName = Subsystems["PlatformSubsystem"].GetAllPersistenceInformation().ToJSON().rows[0]["persistenceProviderPackage"];
   var providerPackageName = Subsystems["PlatformSubsystem"].GetDefaultDataPersistenceProviderPackageName();
    // logger.warn("INPUT FOR GetTransactionAudit DATA:  "+input);
    var q ="select * from data_table where entity_id='TransactionAuditTable' ORDER BY time DESC LIMIT 100";
    if(providerPackageName === "PostgresPersistenceProviderPackage"){
    	q = "select * from data_table where entity_id='TransactionAuditTable' ORDER BY time DESC LIMIT 100";
    } else { //for MSSql
    	q = "select TOP 100 * from data_table where entity_id='TransactionAuditTable' ORDER BY time DESC";
    }
    if (filterType !== '' && filterType === 'date' && providerPackageName === "PostgresPersistenceProviderPackage") {
        q = "select * from data_table where entity_id='TransactionAuditTable' AND time between '" + input.fromDate + "' and '" + input.toDate +"' LIMIT 200";
    } else if (filterType !== '' && filterType === 'date' && providerPackageName === "MssqlPersistenceProviderPackage") {
   		 q = "select TOP 200 * from data_table where entity_id='TransactionAuditTable' AND time between '" + input.fromDate + "' and '" + input.toDate +"'";
    } else {}
    var params = {
        query: q/* STRING */,
    };
    var logs_result =[];

	// result: INFOTABLE
    var logs_result = Things["IEDatabaseConfig"].getIELogsData(params);
    var logArr = logs_result.ToJSON().rows;
	var arr = [];
    for(var i=0;i<logArr.length;i++){
        var fieldValuesStr = logArr[i]["field_values"];
        if(fieldValuesStr){
            var fieldValuesObj = JSON.parse(fieldValuesStr);
            var obj={};
            obj["sourceId"]=fieldValuesObj["sourceId"];
            obj["targetId"]=fieldValuesObj["targetId"];
            obj["mccId"]=fieldValuesObj["mccId"];
            obj["sourceTime"]=fieldValuesObj["sourceTime"];
            obj["mappingTime"]=fieldValuesObj["mappingTime"];
            obj["targetRespTime"]=fieldValuesObj["targetRespTime"];
            obj["transactionSeq"]=fieldValuesObj["transactionSeq"];
            obj["transactionId"]=fieldValuesObj["transactionId"];
            if(retriveFor === "Dashboard"|| retriveFor ==="GenericIEMasterConfig"){
                arr.push(obj);
            }
        }//end of if
    }
    var result={"Result":arr};
}catch(e){
    var result ={"exception":e};
}
