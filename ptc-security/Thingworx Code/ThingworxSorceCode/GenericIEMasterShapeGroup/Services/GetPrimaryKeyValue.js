//INPUTS: primaryKey(String), inputData(JSON)
//OUTPUT: Json
try{
    var arr=[];
    if(primaryKey){
        primaryKey = primaryKey.replace('.schema.', '');
		arr=primaryKey.split(".");    
    }
    var resultObj={};
    var inputObj={};
    if(inputData){
    	inputObj = inputData;
    }
    for(var i=0;i<arr.length;i++){
        if(inputObj[arr[i]]){
        	inputObj=inputObj[arr[i]];
        }else if(inputObj[arr[i]] === undefined || inputObj[arr[i]] === null){
            inputObj={};
        } else{}
    }
    if(typeof inputObj === 'object'){
    	var result ={"Result": "InvalidData"};
    } else var result ={"Result": inputObj};
}catch(e){
    var result={"Exception":e};
}