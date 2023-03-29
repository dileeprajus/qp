//INPUT  input={}
//OUTPUT  result= {}

try{
    var boilerplate_config,group,config;
    boilerplate_config = me.BoilerPlateConfig;
    group = me.thingTemplate;
    config = Things["GenericIEMasterConfig"].FTPDynamicGroupConfig;
    boilerplate_config = config[group];
    var paramsUsername = {
      data: boilerplate_config.userName /* STRING */
      };
    // result: STRING
    me.userName = Resources["EncryptionServices"].EncryptPropertyValue(paramsUsername);
     var paramsPassword = {
      data: boilerplate_config.password /* STRING */
      };
    me.password = Resources["EncryptionServices"].EncryptPropertyValue(paramsPassword);
    me.hostName = boilerplate_config.hostName;
    me.port = boilerplate_config.port;
    me.selectMode = boilerplate_config.selectMode;
    me.rootDirectory = boilerplate_config.rootDirectory;
    var result = {"hostName":me.hostName, "port": me.port, "userName": me.userName, "password":me.password, "selectMode":me.selectMode, "rootDirectory": me.rootDirectory};
}catch(e){
    var result={"Exception":+e.message};
    logger.warn("Exception in Initilize FTP Host propeties service: "+e.message);
}