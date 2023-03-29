//Inputs: Nothing
//Output: JSON
try{
  var boilerplate_config = me.BoilerPlateConfig;
  //if(boilerplate_config === undefined || Object.keys(boilerplate_config).length === 0){
  var group = me.thingTemplate;
  var config = Things["GenericIEMasterConfig"].FlexDynamicGroupConfig;
  boilerplate_config = config[group];
  //}
  //logger.warn("Things[GenericIEMasterConfig].FlexDynamicGroupConfig;"+Things["GenericIEMasterConfig"].FlexDynamicGroupConfig);
  //	logger.warn("Initilize Host Properties service"+JSON.stringify(boilerplate_config));
  me.hostname = boilerplate_config.hostname;
 // me.hosturl = boilerplate_config.hosturl;
  me.midpoint = boilerplate_config.midpoint;
  me.username = boilerplate_config.username;
  var params = {

       data: boilerplate_config.password /* STRING */
   };
  // result: STRING
  var ecyptedPwd = Resources["EncryptionServices"].EncryptPropertyValue(params);

  me.password = ecyptedPwd;
  var result = {"hostname":me.hostname, "midpoint": me.midpoint, "username": me.username, "password":me.password}
}catch(e){
  var result={"Exception":+e};
  logger.warn("Exception in Initilize Host propeties service: "+e);
}
