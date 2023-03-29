//INPUTS input_data(JSON),coming_from(String) - source/destination
// OUTPUTS: result(JSON)
// When Using in UI
//export default getConvertedOutput;
// When Using in Thingworx As Service
try{
    function getParentObj(config_json, key_with_delimiter) {
        var return_obj = {};
        var delimiter = ' *-> ';
        var tmp_obj_holder = config_json;
        var key_arr = key_with_delimiter.split(delimiter);

        for (var i = 0; i < key_arr.length; i++) {
            if (tmp_obj_holder) {
                if (key_arr[i] === '') {
                } else {
                    tmp_obj_holder = tmp_obj_holder['properties'][key_arr[i]];
                    if (i === key_arr.length - 1) {
                        return_obj = tmp_obj_holder;
                    }
                }
            }
        }
        return return_obj;
    }

    function isObjEmpty(map) {
        for (var key in map) {
            return !map.hasOwnProperty(key);
        }
        return true;
    }

    // Modify input value when optionlist or scripts enabled else send the same value
    function getModifiedValue(input_value, curr_mapped_conf, meta_details) {
        var input_obj_conf = curr_mapped_conf.curr_obj[meta_details.input_type_key];
        var modified_input = null;
        var optional_keys = [];

        for (var key in input_obj_conf.optionList) {
            optional_keys.push(key);
        }

        // If one of Optionlist or scripts enabled then modify input else dont modify input
        if (input_obj_conf.script_filters.length > 0 || optional_keys.length > 0) {

            // check optional list in output if yes change value to optional list
            if (optional_keys.length > 0) {
                if (input_obj_conf.optionList[input_value] === undefined) {
                    modified_input = input_obj_conf.optionList["*"];
                }
                else {
                    modified_input = input_obj_conf.optionList[input_value];
                }
            }

            // Check if mapping has scripts enabled as callback
            if (input_obj_conf.script_filters.length > 0) {
                var script_modified_input = modified_input;
                // execute script one by one in a row
                for (var s_i = 0; s_i < input_obj_conf.script_filters.length; s_i++) {
                    var sample_output = new Function('input', input_obj_conf.script_filters[s_i].script.join(';\n'));
                    var script_modified_input = sample_output(script_modified_input);
                    // TODO: Exception handling must be done here
                }
                modified_input = script_modified_input;
            }
        }
        else {
            modified_input = input_value;
        }

        return modified_input;
    }

    function constructObjAssignValue(parent_obj, parent_key, output_obj, output_delim_arr, input_value, curr_mapped_conf, meta_details) {
        // Take new copy of array
        var input_delimiter_arr_cpy = output_delim_arr.slice();
        if (input_value === null || input_value === undefined) {
            input_value = '';
        }
        if (input_delimiter_arr_cpy.length > 1) {
            var cur_key = input_delimiter_arr_cpy.shift();

            // Remove brackets from key string in output
            if (cur_key[0] === '[' && cur_key[cur_key.length - 1] === ']') {
                cur_key = cur_key.slice(1, -1);
            }

            if (output_obj[cur_key] === undefined || output_obj[cur_key] === null) {
                if (!isNaN(cur_key)) {

                    var obj_keys = [];
                    for (var kk in output_obj) {
                        obj_keys.push(kk);
                    }

                    output_obj = obj_keys.map(function (key) {
                        if (!isNaN(key)) {
                            return output_obj[key];
                        }
                    }
                                             );
                    
                    output_obj[cur_key] = {};
                }
                else {
                    output_obj[cur_key] = {};
                }
            }
            output_obj[cur_key] = constructObjAssignValue(output_obj, cur_key, output_obj[cur_key], input_delimiter_arr_cpy, input_value, curr_mapped_conf, meta_details);
        }
        else {
            var cur_key = input_delimiter_arr_cpy[0];
            output_obj[cur_key] = getModifiedValue(input_value, curr_mapped_conf, meta_details);
        }
        return output_obj;
    }

    function attrKeyArrayIter(master_input_obj, input_delimi_arr, output_data, ouput_delim_arr, is_it_first_time, curr_mapped_conf, meta_details) {
        // console.log(curr_mapped_conf);
        var tmp_curr_val = master_input_obj;
        logger.warn("master_input_obj: "+master_input_obj);
        // var tmp_output_data = output_data;
        var input_delimi_arr_copy = input_delimi_arr.slice();
        if (master_input_obj) {
            // this will assign first element from array and removes the last element from array
            var current_input_key = input_delimi_arr_copy.shift();
            // If current attribute is an array
            if (current_input_key[0] === '[' && current_input_key[current_input_key.length - 1] === ']') {
                // console.log(current_input_key.slice(1, -1));
                logger.warn("current_input_key: "+current_input_key);
                current_input_key = current_input_key.slice(1, -1);
                //current_input_key =  current_input_key.replace(/ +/g, "");
                var tmp_arr_obj = master_input_obj[current_input_key];
                //var tmp_arr_obj = master_input_obj[current_input_key.slice(1, -1)];
               // logger.warn("tmp_arr_obj: "+tmp_arr_obj);
                for (var tmp_i = 0; tmp_i < tmp_arr_obj.length; tmp_i++) {
                    tmp_curr_val = tmp_arr_obj[tmp_i];
                    // make a different instance of array
                    var ouput_delim_arr_copy = ouput_delim_arr.slice();
                    // Find the nearest array parent of output hierarchy
                    for (var tmp_o_i = ouput_delim_arr_copy.length - 1; tmp_o_i > -1; tmp_o_i--) {
                        var curr_o_key = ouput_delim_arr_copy[tmp_o_i];
                        if (curr_o_key[0] === '[' && curr_o_key[curr_o_key.length - 1] === ']') {
                            // if nearparent key is array insert index as delimiter
                            ouput_delim_arr_copy.splice(tmp_o_i + 1, 0, tmp_i);
                        }
                        output_data = attrKeyArrayIter(tmp_curr_val, input_delimi_arr_copy, output_data, ouput_delim_arr_copy, false, curr_mapped_conf, meta_details);
                    }
                    // output_data = constructObjAssignValue(output_data, null, output_data, ouput_delim_arr, tmp_curr_val, curr_mapped_conf, meta_details);
                }
            }
            else {
                tmp_curr_val = master_input_obj[current_input_key];
                if (input_delimi_arr_copy.length > 0) {
                    output_data = attrKeyArrayIter(tmp_curr_val, input_delimi_arr_copy, output_data, ouput_delim_arr, false, curr_mapped_conf, meta_details);
                }
                else {
                    output_data = constructObjAssignValue(output_data, null, output_data, ouput_delim_arr, tmp_curr_val, curr_mapped_conf, meta_details);
                }
            }
        }

        return output_data;
    }

    function sortedMappingIter(master_input_obj, sorted_mapped_iter, output_data, meta_details) {
        // this will assign last element from array and removes the last element from array
       // logger.warn("sorted_mapped_iter: "+sorted_mapped_iter);
        var current_mapped_obj = sorted_mapped_iter.pop();
		//logger.warn("current_mapped_obj: "+current_mapped_obj);
        output_data = attrKeyArrayIter(master_input_obj, current_mapped_obj["i_key_arr"], output_data, current_mapped_obj["o_key_arr"], true, current_mapped_obj, meta_details);

        // add typeId to object If it is SourceThing
        if (current_mapped_obj.curr_obj[meta_details.output_type_key]['master_obj']['data_store_type_name'] === 'FlexStore') {
            output_data[o_rootObjName]['properties']['typeId'] = current_mapped_obj.curr_obj[meta_details.output_type_key]['master_obj']['typeId'];
        }

        if (sorted_mapped_iter.length > 0) {
            sortedMappingIter(master_input_obj, sorted_mapped_iter, output_data, meta_details);
        }

        return output_data;
    }

    function getConvertedOutput(mappingConfigJson, coming_from, input_data) {
        var output_data = {};
        var mapping_schema = mappingConfigJson.MappingSchema;

        var host_schema = mappingConfigJson.SourceThing.SelectedSchema;
        var client_schema = mappingConfigJson.DestinationThing.SelectedSchema;
       // logger.warn("mapping Schema: "+mapping_schema);
        //logger.warn("host_schema: "+host_schema);
        //logger.warn("client_schema: "+client_schema);
        var output_schema = '';
        var input_schema = '';
        var input_type_key = '';
        var output_type_key = '';
        if (coming_from === 'destination') {
            input_type_key = 'client';
            output_type_key = 'host';
            output_schema = host_schema;
            input_schema = client_schema;
        }
        else {
            input_type_key = 'host';
            output_type_key = 'client';
            input_schema = host_schema;
            output_schema = client_schema;
        }

        var delimiter = ' *-> ';

        // This is the order which we will use to inject data
        var i_sorted_attr_map = [];

        // Iterate Modify and sort mappings
        for (var i = 0; i < mapping_schema.length; i++) {
            var o_rootObjName = mapping_schema[i][output_type_key]['master_obj']['rootObjectName'];
            var o_typeName = mapping_schema[i][output_type_key]['master_obj']['typeName'];
            var o_typeId = mapping_schema[i][output_type_key]['master_obj']['typeId'];

            var i_rootObjName = mapping_schema[i][input_type_key]['master_obj']['rootObjectName'];
            var i_typeName = mapping_schema[i][input_type_key]['master_obj']['typeName'];
            var i_typeId = mapping_schema[i][input_type_key]['master_obj']['typeId'];

            var output_subset_schema = output_schema[o_typeName];
            var input_subset_schema = input_schema[o_typeName];

            var o_key_with_delimiter = {};
            if (mapping_schema[i][output_type_key]['data_store_type_name'] === 'FlexStore') {
                o_key_with_delimiter = o_rootObjName + delimiter + mapping_schema[i][output_type_key + '_key'];
            }
            else {
                o_key_with_delimiter = o_typeName + delimiter + mapping_schema[i][output_type_key + '_key'];
            }

            var i_key_with_delimiter = {};
            if (mapping_schema[i][input_type_key]['data_store_type_name'] === 'FlexStore') {
                i_key_with_delimiter = i_rootObjName + delimiter + mapping_schema[i][input_type_key + '_key'];
            }
            else {
                i_key_with_delimiter = i_typeName + delimiter + mapping_schema[i][input_type_key + '_key'];
            }

            // parObj is used to check validations
            // var i_parObj = getParentObj(output_subset_schema, o_key_with_delimiter);

            // Split the delim keyword remove empty strings if any
            var o_key_arr = o_key_with_delimiter.split(delimiter);
            var o_index_of_empty_string = o_key_arr.indexOf('');
            if (o_index_of_empty_string > -1) {
                o_key_arr.splice(o_index_of_empty_string, 1);
            }

            var i_key_arr = i_key_with_delimiter.split(delimiter);
            var i_index_of_empty_string = i_key_arr.indexOf('');
            if (i_index_of_empty_string > -1) {
                i_key_arr.splice(i_index_of_empty_string, 1);
            }

            // Sort order of depth with delimiter deep
            if (i_sorted_attr_map.length === 0) {
                i_sorted_attr_map.push({
                    i_key_arr: i_key_arr, o_key_arr: o_key_arr, curr_obj: mapping_schema[i] }
                                      );
            }
            else {
                var tmp_index = 0;
                for (var j = 0; j < i_sorted_attr_map.length; j++) {
                    if (i_key_arr.length < i_sorted_attr_map[j]['i_key_arr'].length) {
                        tmp_index = j - 1 < 0 ? 0 : j - 1;
                        break;
                    }
                    else {
                        // Insert in current position and shift all the attributes to right
                        tmp_index = j + 1;
                        break;
                    }
                }
                i_sorted_attr_map.splice(tmp_index, 0, {
                    i_key_arr: i_key_arr, o_key_arr: o_key_arr, curr_obj: mapping_schema[i] }
                                        );
            }
        }

        var meta_details = {
            mapping_schema: mapping_schema,
            output_schema: output_schema,
            input_schema: input_schema,
            input_type_key: input_type_key,
            output_type_key: output_type_key
        };

        var final_tmp_out = sortedMappingIter(input_data, i_sorted_attr_map.slice(), output_data, meta_details);

        return final_tmp_out;
    }
    //TODO : Convert given input data
    var mappingConfigJson = me.ConfigJson;
    var coming_from = coming_from;
    // "destination" or "source"
    var input_data = input_data;
    // input json to convert

    var result = getConvertedOutput(mappingConfigJson, coming_from, input_data);
   // var result = {"comingfrom":coming_from, "input": input_data};
    //var result = input;
	logger.warn("Input for convertData stream service: "+input_data);
    logger.warn("Result in convertData stream service: "+result);
}
catch(e){
    var result = {};
    logger.warn("**************Exception in convertDataStream service:******** "+e);
}
