//INPUTS : origin_str(String), dummy_str(String)
//OUTPUTS: result(BOOLEAN)
try{
    var result = false;
    var origin_arr = origin_str.split('\\');
    var dummy_arr = dummy_str.split('\\');
    var count=0;
    for(var x=0;x<origin_arr.length;x++){
        if(origin_arr[x]===dummy_arr[x]){// string should match at the same index
            count=count+1;
        }else{
            break;
        }
    }
    if(count===origin_arr.length){
		    var result = true;
    }else var result = false;
    logger.warn("Result for FindSubString service is : "+result);
}catch(e){
	var result = false;
  logger.warn("Exception in FindSubString service"+e);
}
