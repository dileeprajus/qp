//Inputs input(STRING)
//output: JSON
try{
    var o = "";
    o=JSON.parse(input);
    var result ={"result": o};
}catch(e){
    var result ={"exception":"json parser exception"};
}
