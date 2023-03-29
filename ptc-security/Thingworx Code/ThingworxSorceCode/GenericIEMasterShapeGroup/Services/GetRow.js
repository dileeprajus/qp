//INPUTs: input(JSON)
//output: result(JSON)
try{
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
      logger.warn("Input for GetRow service: "+input);
     }
      input = input.filter;
      var tableName = input.tableName;
      var columnName = input.columnName;
      var result = {};
      var val = "";
     if(input.tableType === 'Logger') {  
      if(Things[tableName]) {  
          var params = {
              key: input.columnValue
          };
          // result: INFOTABLE
          var tableResp = Things[tableName].GetDataTableEntryByKey(params);
          var params1 = {
              table: tableResp /* INFOTABLE */
          };
          // result: JSON
          var obj = Resources["InfoTableFunctions"].ToJSON(params1);
          //logger.warn("TABLE RESP: "+JSON.stringify(obj));
          var rowVal = obj.rows[0];
          if(Object.keys(rowVal).length>0) {
              if(columnName){
                  val = tableResp[columnName];
              }else{
                  val = obj
              }
          } else {
              val = "";
          }
     } else {}
      result = {"value": val};
      result={"Result": result};
     }else {
         var values1 = Things["TRCLoggerTable"].CreateValues();
         values1.tSeq = input.columnValue;
             var tableResp2 =  Things["TRCLoggerTable"].QueryDataTableEntries({
              maxItems: undefined /* NUMBER */,
              values: values1 /* INFOTABLE */
          });
         var params3 = {table: tableResp2 /* INFOTABLE */};
          var obj2 = Resources["InfoTableFunctions"].ToJSON(params3);
         var rowVal2 = obj2.rows[0];
         if(Object.keys(rowVal2).length>0) {
             val = {
                "SOURCEDATA": rowVal2.sourceData ? rowVal2.sourceData: {"status":"No sourceData"},
                "MAPPINGDATA": rowVal2.mappingData ? rowVal2.mappingData: {"status":"No mappingData"},
                "TARGETDATA": rowVal2.targetData ? rowVal2.targetData: {"status":"No targetData"},
                "TSEQ":rowVal2.tSeq
            };
          } else {
              val = {};
          }
          result = {"value": val};
         result={"Result": result};
     }
      
  }catch(e){
      var result = {"value": ""};
      result={"Result": result};
      logger.warn("Exception in  GetRow service: "+e);
  }