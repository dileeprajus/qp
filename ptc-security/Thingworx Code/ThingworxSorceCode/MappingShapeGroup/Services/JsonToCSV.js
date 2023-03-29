//Inputs: input(JSON),
//output: result (string)
try{
    //var jsonObject = input;
    var jsonObject = input['csvAsJson'];
    var delimeter = input['delimeter'];
    var unique_keys = [];

    function convertToCSV(objArray) {
        var array = objArray;
        // From input value, storing the unique keys into an array
        for(var key in array[0]){ //Push the first object keys to unique_keys array
            unique_keys.push(key);
        }
        var str = '';
        for (var i=0; i < array.length; i++) {
            var line = '';
            if((i+1) < array.length) {
                for(var key in array[i+1])  { //Check each object in array and push the new key to unique_keys array
                    if(unique_keys.indexOf(key) === -1) {
                        unique_keys.push(key);
                    }
                }
            }
            // Assigning each object's data to a line variable
            for (var index in array[i]){
                if (line != '') line = line+ ''+delimeter
                line += array[i][index];
            }
            //str += line + '\r\n';
            str += line + '\n';
        }
        return str;
    }
    var temp_result = convertToCSV(jsonObject["array"]);
    // Converting keys to string type
    var header_str = unique_keys.toString();
    header_str = header_str.replace(/,/g,delimeter); //replace comma with delimeter
    // concatenating the key and values and displaying in csv format
    header_str = header_str+'\r\n'+temp_result;
    //logger.warn("header string is..... "+header_str);
    //var result = {"RESULT":header_str};
    var result = header_str;
}
catch(e){
    var result={"Exception":e};
    logger.warn("Exception in JSON2CSV service is: "+e);
}
