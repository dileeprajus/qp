//INPUT  input={}
//OUTPUT  result= {}

try{
    var boilerplate_config,group,config;
    boilerplate_config = me.BoilerPlateConfig;
    group = me.thingTemplate;
    config = Things["GenericIEMasterConfig"].GooglePubSubDynamicGroupConfig;
    boilerplate_config = config[group];
    me.projectName = boilerplate_config.projectName;
    me.selectMode = boilerplate_config.selectMode;
    me.privateKey = boilerplate_config.privateKey;
    var result = {"projectName":me.projectName, "selectMode":me.selectMode, "privateKey": me.privateKey};
}catch(e){
    var result={"Exception":+e.message};
    logger.warn("Exception in Initialize GooglePubSub Host Properties service: "+e.message);
}