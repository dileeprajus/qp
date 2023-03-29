try{
    var name = input.groupName;
    var type = input.type;
    var result_config = {};
    var temp_config = Things["GenericIEMasterConfig"].FlexDynamicGroupConfig;
    if(type === "socket"){
        temp_config = Things["GenericIEMasterConfig"].SocketDynamicGroupConfig;
    }else if(type === 'FTP') {
        temp_config = Things["GenericIEMasterConfig"].FTPDynamicGroupConfig;
    }else if(type === 'Publisher'){
        temp_config = Things["GenericIEMasterConfig"].GooglePubSubDynamicGroupConfig;
    }else {
        temp_config = Things["GenericIEMasterConfig"].FlexDynamicGroupConfig;
    }
    if(type === "socket"){
        if(temp_config[name] && temp_config[name] !== undefined){
           result_config = temp_config[name];
        }else{
            result_config = {"url":"","port":"","inputData":""};
        }
    
    } else if(type === "FTP") {
        if(temp_config[name] && temp_config[name] !== undefined){
            result_config = temp_config[name];
        }else{
            result_config = {"hostName":"","port":"","selectMode":"","userName":"","password":"", "rootDirectory": ""};
        }
    }else if(type === "Publisher") {
        if(temp_config[name] && temp_config[name] !== undefined){
            result_config = temp_config[name];
        }else{
            result_config = {"projectName":"","selectMode":"","privateKey": {}};
        }
    }else {
    	if(temp_config[name] && temp_config[name] !== undefined){
        	//temp_config[name]["midpoint"] = "Windchill/servlet/rest/cdee";
           result_config = temp_config[name];
        }else{
            result_config = {"hostname":"","midpoint":"Windchill/servlet/rest/cdee","username":"","password":""};
        }
    }
    
    var result = result_config;

}catch(e){
    var result = {"midpoint":"Windchill/servlet/rest/cdee"};
    logger.warn("Exception in GetGroupHostProperties service: "+e);
}