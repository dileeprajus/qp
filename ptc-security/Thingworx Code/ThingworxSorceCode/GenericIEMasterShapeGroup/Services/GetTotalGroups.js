//INPUTS Nothing
// OUTPUTS: result(JSON)
try{
    var params = {
        maxItems: undefined /* NUMBER */,
        nameMask: undefined /* STRING */,
        type: "ThingTemplate" /* STRING */,
        tags: "Applications:IE" /* TAGS */
    };

    // result: INFOTABLE dataShape: RootEntityList
    var temp_result = Resources["EntityServices"].GetEntityList(params);
    temp_result = temp_result.ToJSON().rows;
    var arr = [];
    for(var i=0;i<temp_result.length;i++){
        arr.push(temp_result[i].name);
    }
    var result= {"Groups":arr};
}
catch(e){
    var result = {"Groups":[]};
    logger.warn("Exception in GetTotalGroups Service: "+e);
}
