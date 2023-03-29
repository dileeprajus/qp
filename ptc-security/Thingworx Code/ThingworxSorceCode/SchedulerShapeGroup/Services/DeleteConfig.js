//Inputs: input(Thingname)
//output: result(json)

try{
    var temp_tags = Things[input].GetTags();
    var result = {};
    if(temp_tags=="Applications:IE;Applications:DynamicConfig;Applications:Scheduler"){//this condition is only for if the thing is scheduler config
    	var params = {
            name: input /* THINGNAME */
        };

        // no return
        Resources["EntityServices"].DeleteThing(params);
        result={"success":"Scheduler Config "+input+" deleted successfully"};
    }
}catch(e){
    var result={"exception":e};
    logger.warn("Exception in service DeleteConfig in SchedulerShapeGroup:"+e);
}
