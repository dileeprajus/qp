try{
    var result ={};
    var params = {
        tableName: "Settings" /* STRING */
    };

    // result: INFOTABLE dataShape: "undefined"
    var table = me.GetConfigurationTable(params);
	table = table.toJSON().rows[0];
    result = {"enabled":table.enabled, "schedule":table.schedule};
}catch(e){
    var result={"exception":e};
}