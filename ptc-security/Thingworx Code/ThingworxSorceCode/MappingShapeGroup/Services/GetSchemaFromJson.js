
//const me = require('./GetDataType');
//const draft_type=3;
//const Purdy = require('purdy');
// Comment above lines while using in Thingworx as service
logger.warn("SchemaFromJSON called : "+input);

var DataTypePriority = ["null","undefined","boolean","string","integer", "float", "currency", "array"];

// Modules
var Type = function () {

  var isBuiltIn = (function () {
    var built_ins = [
      Object,
      Function,
      Array,
      String,
      Boolean,
      Number,
      Date,
      RegExp,
      Error      
    ];
    var built_ins_length = built_ins.length;

    return function (_constructor) {
      for (var i = 0; i < built_ins_length; i++) {
        if (built_ins[i] === _constructor) {
          return true;
        }
      }
      return false;
    };
  })();

  var stringType = (function () {
    var _toString = ({}).toString;

    return function (obj) {
      // [object Blah] -> Blah
      var stype = _toString.call(obj).slice(8, -1);

      if ((obj === null) || (obj === undefined)) {
        return stype.toLowerCase();
      }

      var ctype = of(obj);

      if (ctype && !isBuiltIn(ctype)) {
        return ctype.name;
      } else {
        return stype;
      }
    };
  })();

  function of (obj) {
    if ((obj === null) || (obj === undefined)) {
      return null;
    } else {
      return obj.constructor;
    }
  }

  function is (obj, test) {
    var typer = (of(test) === String) ? stringType : of;
    return (typer(obj) === test);
  }

  function instance (obj, test) {
    return (obj instanceof test);
  }

  function extension (_Extension, _Base) {
    return instance(_Extension.prototype, _Base);
  }

  function any (obj, tests) {
    if (!is(tests, Array)) {
      throw ("Second argument to .any() should be array")
    }
    for (var i = 0; i < tests.length; i++) {
      var test = tests[i];
      if (is(obj, test)) {
        return true;
      }
    }
    return false;
  }

  var exports = function (obj, type) {
    if (arguments.length == 1) {
      return of(obj);
    } else {
      if (is(type, Array)) {
        return any(obj, type);
      } else {
        return is(obj, type);
      }
    }
  }

  exports.instance  = instance;
  exports.string    = stringType;
  exports.of        = of;
  exports.is        = is;
  exports.any       = any;
  exports.extension = extension;
  return exports;

}();


// Constants
var DRAFT = 'http://json-schema.org/draft-0'+draft_type+'/schema#'    //add draft type either 3 or 4

function getPropertyFormat(value) {
    var type = Type.string(value).toLowerCase()

    if (type === 'date') return 'date-time'

    return null
}

function getPropertyType(value) {
    var type = Type.string(value).toLowerCase()
    if (type === 'date') return 'string'
    if (type === 'regexp') return 'string'
    if (type === 'function') return 'string'
    if (value === null) return 'null'

    return type
}

function getDataType(val){
    // result: STRING
    // Purdy(me.GetDataType(val));
    //var result = me.GetDataType(val)[1];
	//return result;
    var params = {
        input: val /* STRING */
    };

     if(val===""){
       var data_type = {"value":"","type":"string"}
    }
    else{
    // result: JSON
    var data_type = me.GetDataType(params);
    }
    return data_type.type;
}



function updateDataTypeOnPriority(old_obj, new_obj){

    var params = {
        input: new_obj /* JSON */
    };

    // result: STRING
    logger.warn("NewObj::"+me.ObjectStringify(params));
  for(var k in new_obj){
      var old_attr = old_obj[k];
      var curr_attr = new_obj[k];
      if(curr_attr.type !== "object"){
        if(old_attr){

            if(old_attr.type === 'null' || old_attr.type === 'undefined' || curr_attr.type === 'null' || curr_attr.type === 'undefined'){
              curr_attr.required = false;
            }

            var old_priority_index = DataTypePriority.indexOf(old_attr.type);
            var new_priority_index = DataTypePriority.indexOf(curr_attr.type);
            // If there is datatype in DataTypePriority array
            if(old_priority_index > -1){
              // and if this index is less than current index replace the current with the old one assuming the new one is not obj or arr
              if(old_priority_index > new_priority_index){
                new_obj[k].type = old_attr.type;
              }
            }
        }else{
          curr_attr.required = false;
        }
    }
    // Dig deeper
    if(new_obj[k].properties){
        if(old_obj[k]){
      		if(old_obj[k].properties){
       		 updateDataTypeOnPriority(old_obj[k].properties, new_obj[k].properties);
      }
     }
    }
  }


}

function getUniqueKeys(a, b, c, itemIndex) {
    var bObj = b;
    a = Object.keys(a)
    b = Object.keys(b)
    c = c || []

    var value
    var cIndex
    var aIndex
    var bIndex
    //logger.warn("item index "+itemIndex);
    if(c.length===0&&itemIndex===1){
        //logger.warn("c arr length zero: and index is : "+itemIndex);
    	for (var keyIndex = 0, keyLength = b.length; keyIndex < keyLength; keyIndex++) {
            value = b[keyIndex]
            aIndex = a.indexOf(value)
            cIndex = c.indexOf(value)

            if (aIndex === -1) {
                if (cIndex !== -1) {
                    // Value is optional, it doesn't exist in A but exists in B(n)
                    c.splice(cIndex, 1)
                }
            } else if (cIndex === -1) {
                // Value is required, it exists in both B and A, and is not yet present in C
                c.push(value)
            }
        }
       // //logger.warn("c arr: "+c);
        return c
    }else{
        //logger.warn("item index in else: "+itemIndex);
    	for (var keyIndex = 0, keyLength = c.length; keyIndex < keyLength; keyIndex++) {
            value = c[keyIndex] //get the Cvalue at keyindex in c array
            bIndex = b.indexOf(value)           // get the bindex of by checking the value in b object(if c value is in b array or not)
            //logger.warn("B obj: "+b+"bIndex is: "+bIndex+" and value is :"+bObj[value]);
            if (bIndex === -1||bObj[value] == null) {
              // Value is optional, it doesn't exist in B  so splice it from c array
              c.splice(keyIndex, 1)
           }
        }
        return c
    }
}

function processArray(array, output, nested) {
    var format
    var oneOf
    var type

    if (nested && output) {
        output = { items: output ,required:true }
    } else {
        output = output || {}
        output.type = getPropertyType(array)
        output.items = output.items || {}
        if(draft_type==3){  //add draft type either 3 or 4
        	 output.required = true
        }
        type = output.items.type || null
    }

    // Determine whether each item is different
    for (var arrIndex = 0, arrLength = array.length; arrIndex < arrLength; arrIndex++) {
        var elementType = getPropertyType(array[arrIndex])
        if(typeof array[arrIndex] !== 'object'){
            elementType = getDataType(array[arrIndex]);  //customFunciton : Get the property type from java
        }
        var elementFormat = getPropertyFormat(array[arrIndex])

        if (type && elementType !== type) {
            output.items.oneOf = []
            oneOf = true
            break
        } else {
            type = elementType
            format = elementFormat
        }
    }

    // Setup type otherwise
    if (!oneOf && type) {
        output.items.type = type
        if (format) {
            output.items.format = format
        }
    } else if (oneOf && type !== 'object') {
        output.items = {
            oneOf: [{ type: type }],
            required: output.items.required
        }
    }

    // Process each item depending
    if (typeof output.items.oneOf !== 'undefined' || type === 'object') {
        for (var itemIndex = 0, itemLength = array.length; itemIndex < itemLength; itemIndex++) {
            var value = array[itemIndex]
            var itemType = getPropertyType(value)
            var itemFormat = getPropertyFormat(value)
            var arrayItem
            if (itemType === 'object') {
                if(draft_type === 4){
                    if (output.items.properties) {
                        // //logger.warn("index: "+ itemIndex+" a,b,c: "+JSON.stringify(output.items.properties)+" b: "+JSON.stringify(value)+" c: "+output.items.required);
                        output.items.required = getUniqueKeys(output.items.properties, value, output.items.required,itemIndex)

                    }
                }
                // TODO: to clone obj we had used stringify and parse but it is not reliable we have to change it otherwise
                var previous_arrItem = arrayItem? JSON.parse(JSON.stringify(arrayItem)) : null;
                arrayItem = processObject(value, oneOf ? {} : output.items.properties, true);
                // It updates arrayItem if there is any datatype changes on priority
                if(previous_arrItem){
                  updateDataTypeOnPriority(previous_arrItem, arrayItem);
                }				
               


            } else if (itemType === 'array') {
                //logger.warn("else if array: "+value);
                arrayItem = processArray(value, oneOf ? {} : output.items.properties, true)
            } else {
                arrayItem = {}
                itemType = getDataType(value);  //custom function : Get the property type from java;
                arrayItem.type = itemType
                if (itemFormat) {
                    arrayItem.format = itemFormat
                }
            }
            if (oneOf) {
                var childType = Type.string(value).toLowerCase()
                var tempObj = {}
                if (!arrayItem.type && childType === 'object') {
                    tempObj.properties = arrayItem
                    tempObj.type = 'object'
                    arrayItem = tempObj
                }
                output.items.oneOf.push(arrayItem)

            } else {
                if (output.items.type !== 'object') {
                    continue;
                }
                output.items.properties = arrayItem
            }
        }
    }
    return nested ? output.items : output
}

function processObject(object, output, nested) {
    if (nested && output) {
         if(draft_type===3){ //add draft type either 3 or 4
         	 output = { properties: output, required:true }
         }else{
             output = { properties: output }
         }
    } else {
        output = output || {}
        output.type = getPropertyType(object)
        if(draft_type===3){ //add draft type either 3 or 4
         	output.required = true
        }
        output.properties = output.properties || {}
    }

    for (var key in object) {
        var value = object[key]
        var type = getPropertyType(value)
        var format = getPropertyFormat(value)
        type = type === 'undefined' ? 'null' : type


        if (type==='object'&&typeof value === 'object') {
            output.properties[key] = processObject(value, output.properties[key])
            continue
        }

        if (type === 'array') {
            output.properties[key] = processArray(value, output.properties[key])
            continue
        }
        if(typeof value !== 'object'&&type !== 'array'){
            var new_type =getDataType(value);  //Customfunciton: Get the property type from java
            if(new_type!==null){
                type=new_type
            }else type = "null";

        }
        output.properties[key] = {}
        output.properties[key].type = type
        if(draft_type==3){  //add draft type either 3 or 4
        	output.properties[key].required = true;
        }

        if (format) {
            output.properties[key].format = format
        }
    }

    return nested ? output.properties : output
}

var JsonToSchema = function(title, object) {
    var processOutput
    var output = {
        $schema: DRAFT
    }

    // Determine title exists
    if (typeof title !== 'string') {
        object = title
        title = undefined
    } else {
        output.title = title
    }

    // Set initial object type
    output.type = Type.string(object).toLowerCase()

    // Process object
    if (output.type === 'object') {
        processOutput = processObject(object)
        output.type = processOutput.type
        output.properties = processOutput.properties
    }

    if (output.type === 'array') {
        processOutput = processArray(object)
        output.type = processOutput.type
        output.items = processOutput.items

        if (output.title) {
            output.items.title = output.title
            output.title += ' Set'
        }
    }

    // Output
    return output
}

//var input_string = '{"a": [{"b": "1.1", "e": {"f": 12}}, {"b":"2", "c":"aahald", "e": {"f": "$0.84"}}], "d": 4, "g": ["12", "S", "12.2", true]}'

//var params = {
//	input: input /* JSON */
//};
//
//// result: STRING
//var temp_input = me.ObjectStringify(params);
//

var result = JsonToSchema(JSON.parse(input)); //add 'input' json here

//Purdy(input);
//Purdy(result,{depth:null});
//