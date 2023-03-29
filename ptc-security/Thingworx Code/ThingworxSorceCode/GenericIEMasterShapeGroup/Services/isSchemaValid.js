//INPUTS: input(JSON)
// OUTPUTS: result(BOOLEAN
try{
    var result = false;
    //logger.warn("input for isSchemaValid service: "+input);
    var schema_keys = 0;
    var prop_keys = 0;
    var prop_key = false;
    var schema = input;
    for(var key in schema){
        if(key){
            schema_keys = schema_keys+1;
            if(key==="properties"){
                prop_key=true;
                var prop_obj = schema['properties'];
                for(var ki in prop_obj){
                    if(ki){
                        prop_keys = prop_keys+1;
                        break;
                    }
                }
            }
        }
    }
    if((schema_keys>0) && (prop_key) && (prop_keys>0)){
//        Things[me.name]['Schema'] = input;
//        Things[me.name]['canBeUsable'] = true;
        result = true;
    }
    else{
//        Things[me.name]['canBeUsable'] = false;
        result = false;
    }
    //logger.warn("result for isSchemaValid service: "+result);

}
catch(e){
    var result = false;
    logger.warn("Exception in isSchemaValid service: "+e);
}
