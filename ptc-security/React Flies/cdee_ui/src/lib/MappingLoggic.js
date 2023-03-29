/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import mobx from 'mobx';

import TypeManagerStore from '../stores/TypeManagerStore';
let store = new TypeManagerStore();
store.GetDataTypes;
//let datatype_check = mobx.toJS(store.data_types);
const contains = function (needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
  const findNaN = (needle !== needle);
  let indexOf;

  if (!findNaN && typeof Array.prototype.indexOf === 'function') {
    indexOf = Array.prototype.indexOf;
  } else {
    indexOf = function (needle) {
      let i = -1;
      let index = -1;

      for (i = 0; i < this.length; i++) {
        var item = this[i];

        if ((findNaN && item !== item) || item === needle) {
          index = i;
          break;
        }
      }
      return index;
    };
  }

  return indexOf.call(this, needle) > -1;
};

export function canConvertTo(dragged_datatype, dropped_datatype) {
  return contains.call(mobx.toJS(store.data_types)[dragged_datatype]['can_map_to'], dropped_datatype);
}


export function getDataTypeStyle(data_type) {
  var color = '#6C7A89';
  if (mobx.toJS(store.data_types)[data_type] !== undefined) {
    color = mobx.toJS(store.data_types)[data_type]['color'];
  }
  return color;
}


export function addNewMappingToMappingSchema(draggedObj, containerObj, mappingStoreConfig) {
  
  var client = {};
  var host = {};
  var mapping_schema = mappingStoreConfig.MappingSchema;
  var host_conf = mappingStoreConfig.SourceThing;
  var client_conf = mappingStoreConfig.DestinationThing;
  var new_map_to_push = {};
  var host_validations = {
    optionList: false,
    script_filters: false
  };
  var client_validations = {
    optionList: false,
    script_filters: false
  };
  // Assuming the otherobject must be client
  if (draggedObj.which_side === 'Host') {
    host = draggedObj;
    client = containerObj;
  } else {
    client = draggedObj;
    host = containerObj;
  }

  new_map_to_push.host_key = host.attrConcatKey;
  new_map_to_push.client_key = client.attrConcatKey;

  new_map_to_push.host = {
    attr_name: host.name,
    attr_type: host.type,
    master_obj: host.master_obj,
    data_store_type_name: host.data_store_type_name,
    data_source_name: host.data_source_name,
    script_filters: [],
    optionList: {},
    validations: host_validations
  };

  new_map_to_push.client = {
    attr_name: client.name,
    attr_type: client.type,
    master_obj: client.master_obj,
    data_store_type_name: client.data_store_type_name,
    data_source_name: client.data_source_name,
    script_filters: [],
    optionList: {},
    validations: client_validations
  };


  // Check if selected attributes are already mapped in mapping schema
  mapping_schema.map(curr_sch => {
    if ((curr_sch.host_key === host.attrConcatKey) && (curr_sch.client_key === client.attrConcatKey)) {
      new_map_to_push = {};
    }
  });

  if (Object.keys(new_map_to_push).length === 0 && new_map_to_push.constructor === Object) {
    // If new object is empty for now do nothing
  } else {
    // push to mapping schema in mapping store
    mapping_schema.push(new_map_to_push);
  }
  updateAssociationDependency(mappingStoreConfig);
  checkFlexObjectsValidation(mappingStoreConfig);
  checkFlexTypeHierarchyValidation(mappingStoreConfig);
  checkFlexSchemaValidations(mappingStoreConfig);
  getMappedFlexObjects(mappingStoreConfig)
}

import FlexStore from '../stores/FlexStore';
import RestClientStore from '../stores/RestClientStore';
import SoapClientStore from '../stores/SoapClientStore';
import StaticFileClientStore from '../stores/StaticFileClientStore';


export function getStore(store_name, thing_name) {
  var store = null;
  if (store_name === 'FlexStore') {
    store = new FlexStore(thing_name);
  } else if (store_name === 'RestClientStore') {
    store = new RestClientStore(thing_name);
  } else if (store_name === 'SoapClientStore') {
    store = new SoapClientStore(thing_name);
  } else if (store_name === 'StaticFileClientStore') {
    store = new StaticFileClientStore(thing_name);
  } else {
    // Do Nothing
  }
  return store;
}


export function getParentObj(config_json, key_with_delimiter) {
  var return_obj = {};
  var delimiter = ' *-> ';
  var tmp_obj_holder = config_json;
  var key_arr = key_with_delimiter.split(delimiter);

  for (var i = 0; i < key_arr.length; i++) {
    if (tmp_obj_holder) {
      if (key_arr[i] === '') {
      } else {
        tmp_obj_holder = tmp_obj_holder['properties'][key_arr[i]];
        if (i === (key_arr.length - 1)) {
          return_obj = tmp_obj_holder;
        }
      }
    }
  }
  return return_obj;
}

export function getAssociationDependency(selected_key, schema) {
  
  var parent_obj = getParentObj(schema, selected_key);
  var output = {};
  if (parent_obj !== undefined) {
    var scope = parent_obj['scope'];
    if (scope) {
      var assoc = schema['associations'];
      if (assoc) {
        output = assoc;
      }
    }
  }
  return output;
}

export function updateAssociationDependency(mappingStoreConfig) {
  var mapping_schema = mappingStoreConfig.MappingSchema;
  var conf = {
    host: mappingStoreConfig.SourceThing,
    client: mappingStoreConfig.DestinationThing
  };
  var hc = ['client', 'host'];

  // Clear all associations before looping
  mappingStoreConfig.SourceThing.Associations = {};
  mappingStoreConfig.DestinationThing.Associations = {};

  mapping_schema.map(curr_sch => {
    for (var i=0; i < hc.length; i++) {
      var hc_key = hc[i]; //host or client
      var delim_key = curr_sch[hc_key + '_key'];
      var type_name = curr_sch[hc_key]['master_obj']['typeName'];
      if (conf[hc_key]['SelectedSchema']) {
        var schema = conf[hc_key]['SelectedSchema'][type_name];
        var tmp_scco_obj = getAssociationDependency(delim_key, schema);
        for (var key in tmp_scco_obj) {
          conf[hc_key]['Associations'][key] = conf[hc_key]['Associations'][key] ? true : tmp_scco_obj[key];
          if(conf[hc_key]['SelectedFlexObjects'].indexOf(key)===-1)
            {
              conf[hc_key]['SelectedFlexObjects'].push(key);
            }
        }
      }
    }
  });
}


export function checkFlexObjectsValidation(mappingStoreConfig) {
  var conf = {
    host: mappingStoreConfig.SourceThing,
    client: mappingStoreConfig.DestinationThing
  };
  var hc = ['client', 'host'];
  for (var i = 0; i < hc.length; i++) {
    var selected_fos = conf[hc[i]]['SelectedFlexObjects'];
    var associated_fos = conf[hc[i]]['Associations'];
    var count = 0;
    for (var key in associated_fos) {
      if (associated_fos[key] === true) {
        if (selected_fos.indexOf(key) === -1) {
          count++;
        }
      }
    }
    conf[hc[i]]['Validations']['FlexObjectsCount'] = count;
  }
}

export function checkFlexTypeHierarchyValidation(mappingStoreConfig) {
  var conf = {
    host: mappingStoreConfig.SourceThing,
    client: mappingStoreConfig.DestinationThing
  };
  var hc = ['client', 'host'];
  for (var k = 0; k < hc.length; k++) {
    var selected_fos = conf[hc[k]]['SelectedFlexObjects'];
    var th = conf[hc[k]]['SelectedTypeHierarchy'];
    var th_fos = [];
    var count = 0;
    for (var i = 0; i < th.length; i++) {
      th_fos.push(th[i]['flexObject']);
    }
    for (var j = 0; j < selected_fos.length; j++) {
      if (th_fos.indexOf(selected_fos[j]) === -1) {
        count++;
      }
    }
    conf[hc[k]]['Validations']['TypeHierarchyCount'] = count;
  }
}

function getRequiredPropertiesCount(schema,key,count,mapped_keys,delim_key){
  var properties = {}
  if(schema[key]['type']==='object'){
    properties = schema[key].properties;
  }
  else if(schema[key]['type']==='array'){
    if(schema[key]['items']!==undefined && schema[key]['items']['properties']!==undefined){
      properties = schema[key]['items']['properties']
    }
  }
  else{

  }

  for (var property in properties) {
    if(properties[property]['type']==='object'){
      count = getRequiredPropertiesCount(properties,property,count,mapped_keys,delim_key+property+' *-> ');
    }
    else if( properties[property]['type'] === 'array'){
      count = getRequiredPropertiesCount(properties,property,count,mapped_keys,delim_key+'['+property+']'+' *-> ');
    }
    else {
      if(properties[property]['required'] === true && mapped_keys.indexOf(delim_key+property) === -1) {
        count++;
      }
    }
  }
  return count;
}

export function checkFlexSchemaValidations(mappingStoreConfig) {
  var conf = {
    host: mappingStoreConfig.SourceThing,
    client: mappingStoreConfig.DestinationThing
  };
  var hc = ['client', 'host'];
  for (var k = 0; k < hc.length; k++) {
    var schema = conf[hc[k]]['SelectedSchema'];
    var mapped_keys = [];
    for (var i = 0; i < mappingStoreConfig.MappingSchema.length; i++) {
      mapped_keys.push(mappingStoreConfig.MappingSchema[i][hc[k]+'_key'])
    }
    var count = 0
    for (var key in schema) {
      count = getRequiredPropertiesCount(schema,key,count,mapped_keys,' *-> ');
    }
    conf[hc[k]]['Validations']['SchemaCount'] = count;
  }
}

export function validateFlexMapping(mappingStoreConfig,type,value,source) { //source value will be host or client
  var mapping = getMappedFlexObjects(mappingStoreConfig);
  var result = true;
  mapping = mapping[source];
  if (type === 'flexObject') {
    if (mapping[value] === undefined) {
      result = true;
    } else { result = false; }
  } else if (type === 'typeHierarchy') {
    for (var key in mapping) {
      if (mapping[key].indexOf(value) === -1) {
        result = true;
      } else {
        result = false;
        break;
      }
    }
  }
  return result;
}


//OUTPUT : {'host':{'Materilal':[typeName1,typeName2],'Color':[typeName1,typeName2]},
//'client':{'TechPack':['TechPack']}}
export function getMappedFlexObjects(mappingStoreConfig) {
  var mapping_schema = mappingStoreConfig.MappingSchema
  var output = {
    host: {},
    client: {}
  };
  var hc = ['client', 'host'];
  for (var i = 0; i < mapping_schema.length; i++) {
    for (var k=0; k < hc.length; k++) {
      var obj = mapping_schema[i];
      var f_o = obj[hc[k]]['master_obj']['rootObjectName'];
      if (obj[hc[k]]['master_obj']['typeId'] === undefined) {
        var type = obj[hc[k]]['master_obj']['typeName'];
      } else {
        var type = obj[hc[k]]['master_obj']['typeId'];
      }
      if (f_o !== undefined) {
        output[hc[k]][f_o] === undefined ? output[hc[k]][f_o] = [] : '';
        if (output[hc[k]][f_o].indexOf(type) === -1) {
          output[hc[k]][f_o].push(type);
        }
      } else {
        output[hc[k]][type] = type;
      }
    }
  }
  return output;
}
