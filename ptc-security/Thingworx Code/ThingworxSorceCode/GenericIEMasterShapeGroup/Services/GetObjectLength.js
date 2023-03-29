//INPUTS input(JSON)
// OUTPUTS: result(123Integer)
try{
    var result=0;    
    for(var key in input){
    	result = result+1;
    }
}
catch(e){
   	var result = 0;
    logger.warn("Exception in GetObjectLength service:"+e);
}
