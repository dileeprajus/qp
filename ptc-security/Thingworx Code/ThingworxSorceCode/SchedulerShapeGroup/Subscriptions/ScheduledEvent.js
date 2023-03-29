try{
    logger.warn("Schedule subscription called: "+me.name);
    var tempObj = me.configNames;
    var temp_names = tempObj["Configs"];
    var  configName = me.configName;

    if(Things[configName]) {
        if(me.Enabled) {
            logger.warn("Scheduler Subscription called for  config: "+configName);
            Things[configName].PullInputDataStream();
        }
    }
//    for(var i=0;i<temp_names.length;i++){
//        var tmp_name = temp_names[i];
//        if(Things[tmp_name]){
//			// no return
//
//        	//Things[tmp_name].PullInputDataStream();
//            //Things[tmp_name].SchedulerServiceTesting();
//        }
//
//    }
}catch(e){
    logger.warn("Exception in schedule subscription in "+me.name+" thing: "+e);
}
