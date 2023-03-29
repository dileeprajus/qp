var result = {};
try {
   // logger.warn('ffffffffffffffffffff+++++++++++++++'+Things[input.configName].hostname);
    var headers = {"Accept": "application/json", "Content-Type": "application/octet-stream"};
	//var flexObject = input;
    var hostname = Things[input.configName].hostname;
    var midpoint = Things[input.configName].midpoint;
    var username = Things[input.configName].username;
    var password = Things[input.configName].password;
    var ConfigJson = {};
     ConfigJson.hostname = hostname;
     ConfigJson.midpoint = midpoint;
     ConfigJson.username = username;
     ConfigJson.password = password;
     ConfigJson.dataSourceType = Things[input.configName].dataSourceType;
     ConfigJson.methodType = 'Post';
     ConfigJson.endpointType = (input.GroupType === 'Source') ? '/download' : '/upload';
     ConfigJson.groupType = input.GroupType;
    result.headers = headers;
    result.ConfigJson = ConfigJson;
}catch(e) {
    result = {};
  logger.warn('Error in GetFlexFileTransferObject service'+e);
}