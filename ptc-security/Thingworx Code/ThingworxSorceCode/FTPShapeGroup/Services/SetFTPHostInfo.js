//INPUT  input= {}
//OUTPUT  result= {}

try{
    if(input !== undefined){
        me.hostName = input.hostName;
        me.port = input.port;
        me.password = input.password;
        me.userName = input.userName;
        me.selectMode = input.selectMode;
        me.rootDirectory = input.rootDirectory;
        var getFTPHostInfo = me.GetFTPHostInfo();
    }
}catch(e){
    var result = {"error":e};
    logger.warn("Exception in SetFTPHostInfo Service: "+e);
}