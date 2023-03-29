//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)
try{
  function constructObjectFromArray(obj, keys, v) {
      if (keys.length === 1) {
        obj[keys[0]] = v;
      } else {
        var key = keys.shift();
        obj[key] = constructObjectFromArray(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);
      }
      return obj;
    }

  var rv_obj = {};
  var norm_rv = input;
  for(var key in norm_rv) {
  	var newKey = key.replace('.schema.', '');
  	var arr = newKey.split('.');
  	rv_obj = constructObjectFromArray(rv_obj, arr, norm_rv[key]);
  }
  var result = rv_obj
  logger.warn("Constructed OBJ : "+JSON.stringify(result));
}catch(e){
var result={};
    logger.warn("Exception in service ConstuctObject: "+e);
}
