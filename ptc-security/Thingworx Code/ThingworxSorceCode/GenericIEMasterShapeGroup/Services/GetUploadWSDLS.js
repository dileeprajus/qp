//INPUTS input(JSON)
// OUTPUTS: JSON

try{
    var name = input.groupName;
    if(name===''||name===undefined){
        name= me.thingTemplate;
    }
    var temp_config = Things["GenericIEMasterConfig"].SoapDynamicGroupConfig;
      // logger.warn("=======SoapDynamicGroupConfig wsdls========="+temp_config);
    if(temp_config[name] && temp_config[name] !== undefined){
       var result_config = temp_config[name];
    }else{
        var result_config = {"uploadedWSDLS": {}};
    }
    var result = result_config;
   // logger.warn("Result for GetUploadWSDLS for template "+name+" is:"+result);

}catch(e){
    var result = {"uploadedWSDLS": {}};
    logger.warn("Exception in GetUploadWSDLS service: "+e);
}
