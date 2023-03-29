//logger.warn("GETDATA TYPE INPUT: "+input);
//var params = {
//	XmlString: input /* STRING */
//};
//
//// result: JSON
//var result = me.FindDataType(params);
//result=result.type;


//Code from github

// "date"
// "choice"
// "moaList"
// 	"moaEntry"
// "integer"
// 	"float"
// 	"sequence"
// 	"uom"
// "constant"
// "currency"
// "boolean"
// "composite"
// "derivedString"
// 	"text"
//     "textArea"
//     "url"
// "driven"
// "object_ref"
// 	"object_ref_list"
// "image"
// 	"discussion"
// 	"iteratedmultiobject"
// "multiobject"
// 	"colorSelect"
// 	"careWashImages"
// "userList"

//
//var logic_conf = {
//    datatype_detect_convrt_config: {
//      string: {
//        regex: "^[a-zA-Z0-9]+$",
//        example: "10a | ABC | A3fg",
//        convert_val: function (str) {
//          return str;
//        }
//      },
//      currency: {
//        regex: "^\\$(\\d{1,3}(\\,\\d{3})*|(\\d+))(\\.\\d{2})?$",
//        example: "$0.84 | $123458 | $1,234,567.89",
//        convert_val: function (str) {
//          return str;
//        },
//        subtypes: {
//
//        }
//      },
//      number: {
//        regex: "^\\d*\\.?\\d*$",
//        example: "123 | 3.14159 | .234",
//        convert_val: function (str) {
//          return parseInt(str);
//        },
//        subtypes: {
//          float: {
//            regex: "^(\\-)?\\d*(\\.\\d+)?$",
//            example: "0.55 | 21232.00 | -89.20",
//            convert_val: function (str) {
//              return parseFloat(str);
//            },
//          },
//          integer: {
//            regex: "^[-+]?\\d*$",
//            example: "123 | -123 | +123",
//            convert_val: function (str) {
//              return parseInt(str);
//            }
//          },
//        }
//      },
//      boolean: {
//        regex: "^(TRUE|FALSE|True|False|true|false)$",
//        example: "0 | False | true | FALSE",
//        convert_val: function (str) {
//          if(new RegExp("^(TRUE|True|true)$").test(str)){
//            return true;
//          }else{
//            return false;
//          }
//        }
//      },
//      null: {
//        regex: "^(NULL|Null|null|Nil|nil|undefined|UNDEFINED)$",
//        example: "NULL|null|nil|undefined|UNDEFINED",
//        convert_val: function (str) {
//          return "null";
//        }
//      },
//      date: {
//        regex: "^(((((((0?[13578])|(1[02]))[\\.\\-\/]?((0?[1-9])|([12]\\d)|(3[01])))|(((0?[469])|(11))[\\.\\-\/]?((0?[1-9])|([12]\\d)|(30)))|((0?2)[\\.\\-\/]?((0?[1-9])|(1\\d)|(2[0-8]))))[\\.\\-\/]?(((19)|(20))?([\\d][\\d]))))|((0?2)[\\.\\-\/]?(29)[\\.\\-\/]?(((19)|(20))?(([02468][048])|([13579][26])))))$",
//        example: "02-29-2004 | 1/31/1997 | 1-2-03",
//        convert_val: function (str) {
//          return str;
//        }
//      }
//    },
//
//  iterateRegex: function(changed_value, curr_datatype,input_string, obj){
//    for (var key in obj) {
//        // This is to skype extra js props
//       if (obj.hasOwnProperty(key)) {
//        //  skip unnecessary keys
//         if(key !== "regex" && key !== "example" && key !== "subtypes" && key !== "convert_val"){
//            // Check for regex match
//            var reg = new RegExp(obj[key].regex);
//            if (reg.test(input_string)) {
//                curr_datatype = key;
//                if(obj[key].convert_val){
//                  changed_value = obj[key].convert_val(input_string);
//                }
//                if(obj[key].subtypes){
//                  [changed_value, curr_datatype] = this.iterateRegex(changed_value, key, input_string, obj[key].subtypes);
//                }
//            }else{
//              //Do nothing iter will move on
//            }
//          }
//       }
//    }
//    return [changed_value, curr_datatype]
//  },
//
//  GetDataType: function(input_string){
//    var result = this.iterateRegex(input_string, "string", input_string, this.datatype_detect_convrt_config);
//    return(result);
//  }
//};
//
//
//
//
//
//// comment below line in Thingworx
////module.exports = logic_conf;
//
//
//// uncomment these lines in Thingworx
//var result_arr = logic_conf.GetDataType(input);
////logger.warn("GetDatatype output: "+result_arr);
//var result = {"value":result_arr[0],"type":result_arr[1]}


//NEW CODE===========================

// "date"
// "choice"
// "moaList"
// 	"moaEntry"
// "integer"
// 	"float"
// 	"sequence"
// 	"uom"
// "constant"
// "currency"
// "boolean"
// "composite"
// "derivedString"
// 	"text"
//     "textArea"
//     "url"
// "driven"
// "object_ref"
// 	"object_ref_list"
// "image"
// 	"discussion"
// 	"iteratedmultiobject"
// "multiobject"
// 	"colorSelect"
// 	"careWashImages"
// "userList"


var logic_conf = {
  datatype_detect_convrt_config: {
    string: {
      regex: "^[a-zA-Z0-9]+$",
      example: "10a | ABC | A3fg",
      convert_val: function (str) {
        return str;
      }
    },
    // currency: {
    //   regex: "^\\$(\\d{1,3}(\\,\\d{3})*|(\\d+))(\\.\\d{2})?$",
    //   example: "$0.84 | $123458 | $1,234,567.89",
    //   convert_val: function (str) {
    //     return str;
    //   },
    //   subtypes: {

    //   }
    // },
    number: {
      regex: "^\\d*\\.?\\d*$",
      example: "123 | 3.14159 | .234 | -123 | +123",
      convert_val: function (str) {
        return parseInt(str);
      },
      subtypes: {
        number: {
          regex: "^(\\-)?\\d*(\\.\\d+)?$",
          example: "0.55 | 21232.00 | -89.20",
          convert_val: function (str) {
            return parseFloat(str);
          },
        },
      }
    },
    boolean: {
      regex: "^(TRUE|FALSE|True|False|true|false)$",
      example: "0 | False | true | FALSE",
      convert_val: function (str) {
        if(new RegExp("^(TRUE|True|true)$").test(str)){
          return true;
        }else{
          return false;
        }
      }
    },
    null: {
      regex: "^(NULL|Null|null|Nil|nil|undefined|UNDEFINED)$",
      example: "NULL|null|nil|undefined|UNDEFINED",
      convert_val: function (str) {
        return "null";
      }
    },
    // date: {
    //   regex: "^(((((((0?[13578])|(1[02]))[\\.\\-\/]?((0?[1-9])|([12]\\d)|(3[01])))|(((0?[469])|(11))[\\.\\-\/]?((0?[1-9])|([12]\\d)|(30)))|((0?2)[\\.\\-\/]?((0?[1-9])|(1\\d)|(2[0-8]))))[\\.\\-\/]?(((19)|(20))?([\\d][\\d]))))|((0?2)[\\.\\-\/]?(29)[\\.\\-\/]?(((19)|(20))?(([02468][048])|([13579][26])))))$",
    //   example: "02-29-2004 | 1/31/1997 | 1-2-03",
    //   convert_val: function (str) {
    //     return str;
    //   }
    // }
  },

iterateRegex: function(changed_value, curr_datatype,input_string, obj){
  for (var key in obj) {
      // This is to skype extra js props
     if (obj.hasOwnProperty(key)) {
      //  skip unnecessary keys
       if(key !== "regex" && key !== "example" && key !== "subtypes" && key !== "convert_val"){
          // Check for regex match
          var reg = new RegExp(obj[key].regex);
          if (reg.test(input_string)) {
              curr_datatype = key;
              if(obj[key].convert_val){
                changed_value = obj[key].convert_val(input_string);
              }
              if(obj[key].subtypes){
                [changed_value, curr_datatype] = this.iterateRegex(changed_value, key, input_string, obj[key].subtypes);
              }
          }else{
            //Do nothing iter will move on
          }
        }
     }
  }
  return [changed_value, curr_datatype]
},

GetDataType: function(input_string){
  var result = this.iterateRegex(input_string, "string", input_string, this.datatype_detect_convrt_config);
  return(result);
}
};




// comment below line in Thingworx
//module.exports = logic_conf;
//var input_string = "Null";

// uncomment these lines in Thingworx
var result_arr = logic_conf.GetDataType(input);
result = {"value": result_arr[0], "type": result_arr[1]};
//logger.warn(result);
