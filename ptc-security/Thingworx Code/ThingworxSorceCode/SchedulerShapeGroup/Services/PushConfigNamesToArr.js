//Inputs: input(JSON)
//Output: result(JSON)
try{
    var result = {};
    var config_name = input.config_name;
    var allConfigsObj = me.GetAllConfigs();
    //logger.warn("input for PushConfigNamesToArr: "+input.config_name);
	var all_temp_configs = allConfigsObj.Configs;
    
    //Remove the given input thing name in all things hourly, daily & weekly 
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
       // logger.warn("type arr before: "+Array.isArray(arr));
        arr =  obj["Configs"];
        //logger.warn("type arr after: "+Array.isArray(arr));
        var temp = [];
        if(arr.length!==0){
            for(var j=0;j<arr.length;j++){
                if(arr[j]===config_name){
                	//var ind = arr.indexOf(config_name);
                   // logger.warn("is  obj :"+Object.keys(obj).length);
                   // logger.warn("type obj: "+obj["Configs"].length);
                    //logger.warn("temp is array: "+Array.isArray(temp));
                    //arr.splice(j,1);
                }else{
                	temp.push(arr[j]);
                }
            }
        }
        obj.Configs = temp;
        Things[tn].configNames = obj;
    }
    //Add the config_name in current config 
    var curr_obj = me.configNames;
    var c=0;
    for(var k in obj){
        c=c+1;
    }
    if(c===0){
        curr_obj["Configs"] = [];
    }else{
        var b = curr_obj["Configs"];
        curr_obj["Configs"] = b;
    }
    var curr_arr = curr_obj.Configs;
    if(curr_arr.length===0){
    	curr_arr.push(config_name);
    }else{
        var count = 0;
        for(var k=0;k<curr_arr.length;k++){
            if(curr_arr[k]!==config_name){
            	count = count + 1;
            }        	 
        }
        if(count===curr_arr.length){
        	curr_arr.push(config_name);
        }
    }
    curr_obj.Configs = curr_arr;
    me.configNames = curr_obj;
    var result = me.configNames;
    
}catch(e){
    logger.warn("Exception in PushConfigNamesToArr service: "+e);
    var result = "Exception: "+e;
}
