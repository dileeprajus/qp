try{
    var result = {};
    var serverUrl = Things["GenericIEMasterConfig"].serverName;
    var entityResult = Subsystems["PlatformSubsystem"].GetEntityUsageReport();
	entityResult = entityResult.ToJSON().rows[0];
    var thingworxVesion = entityResult["thingworxVersion"];

    // result: STRING
    var dbVersion = Things["IEDatabaseConfig"].getVersion().ToJSON().rows[0].version;
    result = {"ServerVersion":thingworxVesion, "DBVersion":dbVersion,"ProductionBuildVersion": "1.6.0 patch1", "UIBuildVersion": "21.1.1.1", "ServerUrl": serverUrl};

}catch(e){
    var result={"error":e.message};
    logger.warn("Exception in service GetDBVersion :"+e.message);
}