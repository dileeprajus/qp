//INPUTs: input(JSON)
//output: result(JSON)
try{
    var tableName = input.tableName;
    var key = input.key;
    var columnName = input.columnName;
    var result = {};
    var val = "";
    if(Things[tableName]) {
        var params = {
            key: key /* STRING */
        };
        // result: INFOTABLE
        var tableResp = Things[tableName].GetDataTableEntryByKey(params);
        var params1 = {
            table: tableResp /* INFOTABLE */
        };
        // result: JSON
        var obj = Resources["InfoTableFunctions"].ToJSON(params1);
        // logger.warn("TABLE RESP: "+JSON.stringify(obj));
        var rowVal = obj.rows[0];
        if(Object.keys(rowVal).length>0) {
            val = tableResp[columnName];
        } else {
        	val = "";
        }
   } else {}
    result = {"value": val};
}catch(e){
    var result = {"value": ""};
    logger.warn("Exception in  GetDataTableColumnValWithKey service: "+e);
}
