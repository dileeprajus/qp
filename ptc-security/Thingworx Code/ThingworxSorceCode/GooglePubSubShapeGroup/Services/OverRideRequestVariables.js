//INPUT  input= {}
//request_variables = {}
//OUTPUT  result= {}

try{
    var config = configObj;
   var variables = request_variables;//req_variables;
    for(var type in variables){
        for(var key in variables[type]){
            var params = {
                input: config /* JSON */
            };
            config = Things["GenericIEMasterConfig"].ObjectStringify(params);
            config = config.replace("(("+key+"))", variables[type][key]);
            config = JSON.parse(config);
        }
    }
    var result = config;
}catch(e){
    var result ={"Exception":e.message};
    logger.warn("Exception in OverRideRequestVariables service  "+e.message);
}