/**
 * Created by mohanjutru on 5/7/19.
 */

//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
try {
    var params = {
        groupName: input.groupName /* STRING */,
        type: input.groupType /* STRING */
    };

    // result: JSON
    const group = Things["GenericIEMasterConfig"].GetAllConfigs(params);
    var configList = group.Configs;
    if(configList.length) { 
        var array = [];
     for(var i=0; i< configList.length; i++) {
        var configJson = Things[configList[i].Name].ConfigJson;
         if(configJson.data_url.length) {
             var url = configJson.data_url;
              var obj = {};
             if(url.search(input.oldDomain) !== -1) {
                 configJson.data_url = url.replace(input.oldDomain, input.newDomain)
                 if(configJson.current_auth_type === 'CustomAuth') {
                     if(configJson.customAuthDetails.length) {
                        // logger.warn('encryptStr'+configJson.customAuthDetails)        
                         var decryptParams = {
                             input: {value: configJson.customAuthDetails} /* JSON */
                         };
                         // result: STRING
                         var customAuthObj = Things["GenericIEMasterConfig"].GetDecryptedValue(decryptParams);
                         customAuthObj = JSON.parse(customAuthObj);
                         var customAuthURL = customAuthObj.customAuthUrl;                            
                         customAuthObj.customAuthUrl = customAuthURL.replace(input.oldDomain, input.newDomain)
                         logger.warn('ReplacedUUUUUU'+customAuthObj.customAuthUrl)                                          
                         var encryptParams = {
                             input: {value: customAuthObj} /* JSON */
                         };
                         // result: STRING
                         var newCustomAuthObj = Things["GenericIEMasterConfig"].GetEncryptedValue(encryptParams);
                         //logger.warn('++++++++AfterDecrpt+++++++++++++++++++'+newCustomAuthObj)
                         configJson.customAuthDetails = newCustomAuthObj;
                     }
                 }
                  obj[configList[i].Name] = 'success';
                  array.push(obj)
             }else {
                 obj[configList[i].Name] = "failure";
                 array.push(obj)
             }
         }
           Things[configList[i].Name].ConfigJson = configJson;
         
     }
    }else {
        array = [];
    }
   
    result = {"res": array, "count": configList.length}
}catch(e) { 
    logger.warn('Error in Rest UpdateDomain'+e)
  result = {"res": "error in domain updation"} 
}