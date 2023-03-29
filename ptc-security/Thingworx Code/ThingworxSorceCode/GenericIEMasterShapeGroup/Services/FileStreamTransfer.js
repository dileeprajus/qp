logger.warn('++++++++++++++MCC'+Payload+MCC);
var FTPaylodObject = {};
try {
//if(RequestVariables === undefined) {
// RequestVariables = {};
//}
//var masterCreateContext = MCC;
//if((MasterCreateContext !== undefined) && (Object.keys(MasterCreateContext).length > 0)) {
// MCC = MasterCreateContext;
//}
    logger.warn('(MCC.source_config_name.dataSourceType'+Things[MCC.source_config_name].dataSourceType);
 if(Things[MCC.source_config_name].dataSourceType === 'Rest') {
      var tempRestSrcObj =  me.GetRestFileTransferObject({
	input: {"MCC": MCC, "configName": MCC.source_config_name, requestVariables: RequestVariables, "GroupType": "Source"}
  });
   FTPaylodObject.SourceObject = tempRestSrcObj;
     logger.warn('TTTTTTTTSourceRestTTTTTTTTTT');
 }else if(Things[MCC.source_config_name].dataSourceType === 'Flex') {
      logger.warn('TTTTTTTTSourceFlexTTTTTTTTTT');
  var tempSrcObj =  me.GetFlexFileTransferObject({
	input: {"MCC": MCC, "configName": MCC.source_config_name, "GroupType": "Source"}
  });
  FTPaylodObject.SourceObject = tempSrcObj;
  logger.warn('TTTTTTTTSourceFlexRespTTTTTTTTTT'+FTPaylodObject);
 }else if(Things[MCC.source_config_name].dataSourceType === 'FTP') {
     var tempFTPSrcObj =  me.GetFTPFileTransferObject({
	input: {"MCC": MCC, "configName": MCC.source_config_name, requestVariables: RequestVariables, "GroupType": "Source"}
  });
   FTPaylodObject.SourceObject = tempFTPSrcObj;
    logger.warn('TTTTTTTTSourceFTPTTTTTTTTT');
 }else {}   
    
 if(Things[MCC.target_config_name].dataSourceType === 'Rest') {
  // logger.warn('TTTTTTTargetRestTTTTTTTTTTTT'+Things[MCC.source_config_name].ConfigJson);
 }else if(Things[MCC.target_config_name].dataSourceType === 'Flex') {
     var tempTgtObj =  me.GetFlexFileTransferObject({
	input: {"MCC": MCC, "configName": MCC.target_config_name, "GroupType": "Target"}
  });
  FTPaylodObject.TargetObject = tempTgtObj;
  logger.warn('TTTTTTTargetFlexTTTTTTTTTTTT'+Things[MCC.target_config_name].ConfigJson);
 }else if(Things[MCC.source_config_name].dataSourceType === 'FTP') {
     var tempFTPTgtObj =  me.GetFTPFileTransferObject({
	input: {"MCC": MCC, "configName": MCC.target_config_name, "GroupType": "Target"}
  });
   FTPaylodObject.TargetObject = tempFTPTgtObj;
     logger.warn('TTTTTTTTTargetFTPTTTTTTTTT');
 }else {}   
     FTPaylodObject.Payload = Payload;
     logger.warn('FinalNodePayloadObject_________________'+JSON.stringify(FTPaylodObject));
//if(Things[MCC.source_config_name].tags === 'Applications:IE;Applications:DynamicConfig;Applications:Source') {

//}else {}
var result = {};
}catch(e) {
logger.warn('Error in FileTransfer Api '+e);
}