//INPUT  NoInput
//OUTPUT  result= {}

try{
    var result = {"hostName":me.hostName, "port":me.port,"userName": me.userName, "password": me.password, "selectMode":me.selectMode, "rootDirectory":me.rootDirectory};
}catch(e){
    var result = {"hostName":"", "port": "","userName": "", "password": "", "selectMode": "", "rootDirectory": ""};
    logger.warn("Exception in GetFTPHostInfo service: "+e);
}