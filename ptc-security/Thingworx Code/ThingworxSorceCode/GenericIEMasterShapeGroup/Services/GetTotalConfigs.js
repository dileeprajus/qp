//INPUTS: Nothing
//OUTPUT: result (JSON)
try{
    var result = {};
    var configs_arr = [];
    var params = {
        maxItems: 500 /* NUMBER */,
        searchExpression: undefined /* STRING */,
        types: undefined /* JSON */,
        thingTemplates: undefined /* JSON */,
        identifierSearchExpression: undefined /* STRING */,
        modelTags: "Applications:IE" /* TAGS */,
        thingShapes: undefined /* JSON */,
        query: undefined /* QUERY */,
        aspects: undefined /* JSON */,
        excludedAspects: undefined /* JSON */,
        networks: undefined /* JSON */,
        maxSearchItems: undefined /* NUMBER */
    };

    // result: INFOTABLE dataShape: SearchResults
    var table = Resources["SearchFunctions"].SearchThings(params);

	var config_obj_arr = table.ToJSON().rows[0].commonResults.rows;
    //var result = table.toJSON();
    for(var k=0;k<config_obj_arr.length;k++){
    	configs_arr.push(config_obj_arr[k].name);
    }
    var result ={"Configs":configs_arr};
}
catch(e){
    var result = {};
    logger.warn("Exceptiton in GetTotalConfigs service:"+e);
}
