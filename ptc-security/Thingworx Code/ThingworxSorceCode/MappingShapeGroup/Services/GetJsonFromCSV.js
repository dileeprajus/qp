//INPUTS:	inputs: csv_data(STRING), delimeter(STRING)
// OUTPUTS: result(JSON)

try{
    //convert the csv string to encoded format
    //var encodedCSVData = encodeURIComponent(csvData,"utf-8");
    //var params = {
    //	CSVString: encodedCSVData /* STRING */,
    //	Delimitor: delimeter /* STRING */
    //};
    //
    //// result: JSON
    //var result = me.CSVtoJSON(params);
    function csvJSON(csv){
        //var lines=csv.split("↵");
        var lines = csv.split("\n");
        var result = [];
        var del = ',';
        if(delimeter){
            del= delimeter;
        }
        var headers=lines[0].split(del);
        //logger.warn("HEADERS: "+JSON.stringify(headers));
        for(var i=1;i<lines.length;i++){
            var obj = {};
            var currentline=lines[i].split(del);
            //logger.warn("currentline length    "+currentline.length);
            if(currentline.length !==1 && currentline !== undefined && currentline !== " "){
                for(var j=0;j<headers.length;j++){
                    //logger.warn("headers[j]:: and :"+headers[j]+"  currentline[j]:  "+currentline[j]);
                    var h=headers[j].replace(/^[ ]+|[ ]+$/g,'');
                    h = h.replace(/\r?|\t?/g,'');
                    h= h.trim(); //String.trim() removes whitespace from the beginning and end of strings... including newlines
                    var c=currentline[j].replace(/^[ ]+|[ ]+$/g,'');
                    c = c.trim();
                    obj[h] = c;
                }
                result.push(obj);
            }
        }
        return result;
        //JavaScript object
    }

    //var csv is the CSV file with headers
    var result ={"array": csvJSON(csv_data)};

}
catch(e){
    var result={"error":e};
    logger.warn("Exception in GetJsonFromCSV service: "+e);
}
