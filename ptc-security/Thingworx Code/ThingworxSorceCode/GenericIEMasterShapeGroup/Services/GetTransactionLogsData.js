//Inputs: Input (JSON)
//Output : JSON
try{
  var configName =  input.configName;
  var retriveFor = input.type;
  var filterType = input.filterType; //to retrive the data by date or week.
//var providerPackageName = Subsystems["PlatformSubsystem"].GetAllPersistenceInformation().ToJSON().rows[0]["persistenceProviderPackage"];
 var providerPackageName = Subsystems["PlatformSubsystem"].GetDefaultDataPersistenceProviderPackageName();
  // logger.warn("INPUT FOR GETTRANSACTIONLOGS DATA:  "+input);
  var q ="select * from data_table where entity_id='IELogsDataTable' ORDER BY time DESC LIMIT 100";
  if(providerPackageName === "PostgresPersistenceProviderPackage"){
    q = "select * from data_table where entity_id='IELogsDataTable' ORDER BY time DESC LIMIT 100";
  } else { //for MSSql
    q = "select TOP 100 * from data_table where entity_id='IELogsDataTable' ORDER BY time DESC";
  }
  if (filterType !== '' && filterType === 'date' && providerPackageName === "PostgresPersistenceProviderPackage") {
      q = "select * from data_table where entity_id='IELogsDataTable' AND time between '" + input.fromDate + "' and '" + input.toDate + "' LIMIT 500";
  } else if (filterType !== '' && filterType === 'date' && providerPackageName === "MssqlPersistenceProviderPackage") {
      q = "select TOP 500 * from data_table where entity_id='IELogsDataTable' AND time between '" + input.fromDate + "' and '" + input.toDate + "'";
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
      delete logArr[i]["full_text"]
      var fieldValuesStr = logArr[i]["field_values"];
      if(fieldValuesStr){
          var fieldValuesObj = JSON.parse(fieldValuesStr);
          var obj={};
          obj["configName"]=fieldValuesObj["configName"];
          obj["configType"]=fieldValuesObj["configType"];
          if(fieldValuesObj["groupName"]){
              obj["groupName"]=fieldValuesObj["groupName"];
          }else{
              obj["groupName"]=Things[fieldValuesObj["configName"]].thingTemplate;
          }
          obj["timeStamp"]=fieldValuesObj["timeStamp"];
          obj["updatedAt"]=fieldValuesObj["updatedAt"];
          obj["primaryKey"]=fieldValuesObj["primaryKey"];
          //obj["errorORInfo"]=JSON.stringify(fieldValuesObj["errorORInfo"]);
          if(fieldValuesObj["tag"]){
              var tagArr=fieldValuesObj["tag"];
              var str="";
              for(var k=0;k<tagArr.length;k++){
                  if(k===0){
                      str=str+tagArr[k].vocabulary+":"+tagArr[k].vocabularyTerm;
                  }else if(k<=tagArr.length-1){
                      str=str+"; "+tagArr[k].vocabulary+":"+tagArr[k].vocabularyTerm;
                  } else {}                    
              }
              obj["tag"]=str;
          }
          if(Things[fieldValuesObj["configName"]]){ 
              if(Things[fieldValuesObj["configName"]].dataSourceType === ""){
                  obj["dataSourceType"]="Mapping";
              } else {
                  if(Things[fieldValuesObj["configName"]]){                
                      obj["dataSourceType"]=Things[fieldValuesObj["configName"]].dataSourceType;
                  }
              }
          }
          if(retriveFor === "Dashboard"|| retriveFor ==="GenericIEMasterConfig"){
              arr.push(obj);
          } else if (retriveFor === "Config"){
              if(fieldValuesObj["configName"]===configName){
                  arr.push(obj);
              }
          }
    }// end of if
  }
  var result={"Result":arr};
  //logger.warn("RESULT FOR TRASACTION LOGS DATA================"+result);
}catch(e){
  logger.warn("EXCEPTION IN TRASACTION LOGS DATA================ "+e);
//    var params = {
//        maxItems: 200 /* NUMBER */
//    };
//
//    // result: INFOTABLE
//    var logs_result = Things["IELogsDataTable"].GetDataTableEntries(params);
//    var logArr = logs_result.ToJSON().rows;
//    var arr = [];
//    for(var i=0;i<logArr.length;i++){
//        // var fieldValuesStr = logArr[i]["field_values"];
//        var fieldValuesObj = logArr[i];
//        var obj={};
//        obj["configName"]=fieldValuesObj["configName"];
//        obj["configType"]=fieldValuesObj["configType"];
//        if(fieldValuesObj["groupName"]){
//            obj["groupName"]=fieldValuesObj["groupName"];
//        }else{
//            obj["groupName"]=Things[fieldValuesObj["configName"]].thingTemplate;
//        }
//        obj["timeStamp"]=fieldValuesObj["timeStamp"];
//        obj["updatedAt"]=fieldValuesObj["updatedAt"];
//        obj["primaryKey"]=fieldValuesObj["primaryKey"];
//        obj["errorORInfo"]=JSON.stringify(fieldValuesObj["errorORInfo"]);
//        if(fieldValuesObj["tag"]){
//            var tagArr=fieldValuesObj["tag"];
//            var str="";
//            for(var k=0;k<tagArr.length;k++){
//                if(k===0){
//                    str=str+tagArr[k].vocabulary+":"+tagArr[k].vocabularyTerm;
//                }else if(k<=tagArr.length-1){
//                    str=str+"; "+tagArr[k].vocabulary+":"+tagArr[k].vocabularyTerm;
//                } else {}
//            }
//            obj["tag"]=str;
//        }
//        if(Things[fieldValuesObj["configName"]]){
//            if(Things[fieldValuesObj["configName"]].dataSourceType === ""){
//                obj["dataSourceType"]="Mapping";
//            } else {
//                if(Things[fieldValuesObj["configName"]]){
//                    obj["dataSourceType"]=Things[fieldValuesObj["configName"]].dataSourceType;
//                }
//            }
//        }
//        if(retriveFor === "Dashboard"|| retriveFor ==="GenericIEMasterConfig"){
//            arr.push(obj);
//        } else if (retriveFor === "Config"){
//            if(fieldValuesObj["configName"]===configName){
//                arr.push(obj);
//            }
//        }
//    }
//    var result={"Result":arr};
    var result={"Result":[]};
}
