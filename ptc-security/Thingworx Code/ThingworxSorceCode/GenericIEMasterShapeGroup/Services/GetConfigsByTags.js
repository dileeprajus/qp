//INPUTS tags(Tags)
// OUTPUTS: Json
try{ 
    //logger.warn("input tags: "+ tags);
    var params = {
        maxItems: 500 /* NUMBER */,
        modelTags: tags /* TAGS */,
    };

    // result: INFOTABLE dataShape: SearchResults
    var configs = Resources["SearchFunctions"].SearchThings(params);
    configs = configs.ToJSON().rows[0].thingResults.rows;
	var arr=[];
    for(var i=0;i<configs.length;i++){
    	arr.push(configs[i].name);
    }
    var result={"Configs":arr};
}catch(e){
    var result = {"Configs":[]};
}