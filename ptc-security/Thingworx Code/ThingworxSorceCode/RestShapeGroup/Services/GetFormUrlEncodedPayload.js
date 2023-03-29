//Inputs: input: Json
//output: result: string
try{
  var arr = input.arr ? input.arr : []
  var modifiedPayload = ""
  for(var i=0;i<arr.length;i++){
    var str="";
    var arrVal=arr[i];
    str = encodeURIComponent(arrVal[0])+"="+encodeURIComponent(arrVal[1]);
    if (i === 0  || i===arr.length-1) {
      modifiedPayload = i==0 ? str : modifiedPayload+"&"+str;
    } else {
      modifiedPayload = modifiedPayload+"&"+str;
    }
  }
  var result = modifiedPayload;
}catch(e){
  var result="Exception: "+e;
  logger.warn("Exception in GetFormurlEncoded payload service: "+e)
}
