//Inputs: json1(JSON), json2(JSON)
//OUTPUT: result(JSON)
try{
    function mergeDeep (o1, o2) {
        logger.warn("json 1:"+o1+"  json2:::"+o2);
        var tempNewObj = o1;

        //if o1 is an object - {}
        if (o1.length === undefined && typeof o1 !== "number") {
            for (var property in o2) {
                if (o2[property]) {  //hasOwnProperty function is not working in thingworx it is resulting java heap space error
                    var key = property;
                    var value = o2[key];
                    if (o1[key] === undefined) {
                        tempNewObj[key] = value;
                    }
                    else {
                        tempNewObj[key] = mergeDeep(o1[key], o2[key]);
                    }
                }
            }
        }

        //else if o1 is an array - []
        else if (o1.length > 0 && typeof o1 !== "string") {
            for (var i = 0; i < o2.length; i++) {
                if (JSON.stringify(o1).indexOf(JSON.stringify(o2[i])) === -1) {
                    // tempNewObj.push(o2[i]);
                    if (o1[i] === undefined) {
                        tempNewObj[i] = value;
                    }
                    else {
                        tempNewObj[i] = mergeDeep(o1[i], o2[i]);
                    }
                }
            }
        }

        //handling other types like string or number
        else {
            //taking value from the second object o2
            //could be modified to keep o1 value with tempNewObj = o1;
            tempNewObj = o2;
        }
        return tempNewObj;
    };
    var result = mergeDeep(json1, json2);
}
catch(e){
    var result = {"error":e};
}
