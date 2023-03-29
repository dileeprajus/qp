//Inputs: input:JSON ,Default Value: {"propertyArr":[]}
//Output: result:JSON

var propArr = input.propertyArr;
var resultObj={};

// result: INFOTABLE dataShape: "undefined"
var propsValuesTable = me.GetPropertyValuesAsMultiRowTable();
var propsValuesJson = propsValuesTable.ToJSON();
var propsValuesArr = propsValuesJson.rows;

for(var i=0;i<propArr.length;i++){
    for(var j=0; j<propsValuesArr.length; j++){
    	var obj = propsValuesArr[j];
        if(propArr[i]==obj.name){
        	resultObj[obj.name] = obj.value;
            break;
        }
    }
}

var result = resultObj;
