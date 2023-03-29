// INPUTS: input(JSON)
// OUTPUTS: result(JSON)

var inputObj = input;
var resultObj = {};
var propArr = [];
var result;

for(var key in inputObj){
    propArr.push(key);
    logger.warn("prop is:  "+key);
	me[key] = inputObj[key];
}

var jsonObj = {"propertyArr":propArr}
var params = {
	input: jsonObj /* JSON */
};

// result: STRING
var result = me.GetPropValues(params);
