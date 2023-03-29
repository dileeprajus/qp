//Inputs: input(JSON)
//Output: result(JSON)
try{
    var result={};
    result["schedule_config"] = "";
    var temp_source_config = input.config_name;
     var allConfigsObj = me.GetAllConfigs();
    
	var all_temp_configs = allConfigsObj.Configs;
    
    //Remove the given input config name in all things hourly, daily & weekly 
    for(var i=0; i<all_temp_configs.length;i++){
    	var tn = all_temp_configs[i].Name;
        var obj ={};
        obj = Things[tn].configNames;
        var arr = [];
        var c=0;
        for(var k in obj){
        	c=c+1;
        }
        if(c===0){
        	obj["Configs"] = [];
        }else{
        	var a = obj["Configs"];
            obj["Configs"] = a;
        }
        arr =  obj["Configs"];
        var temp = [];
        if(arr.length!==0){
            for(var j=0;j<arr.length;j++){
                if(arr[j]===temp_source_config){
                	result["schedule_config"] = tn;
                    break;
                }
            }
        }
    }
}catch(e){
    var result ={"schedule_config":""};
    logger.warn("Exception in getScheduleConfig service: "+e);
}
