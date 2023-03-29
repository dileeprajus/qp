/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import {Button, FormGroup, FormControl, InputGroup} from 'react-bootstrap'
import SingleAttrItem from './static/single_attr_item'


@observer
class SchemaSelectable extends React.Component {
    constructor(props) {
        super(props);
        this.which_side = this.props.which_side;
        this.delimiter_key = ' *-> ';

        this.state = {
          'mappableToggle': false,
          'collasalTog': true,
          filter_text: ''
        }
    }

    componentWillMount() {

    }
    onChange (event) {
      this.setState({ filter_text: event.target.value });
    }
    iter_method(par_concat_key, obj, mapping_this, indent){

      if(par_concat_key === 'properties'){
        par_concat_key = '';
      }
      indent = indent + 1;
      for(var i_key in obj){
        var show_key_box = ((i_key.toLowerCase()).indexOf(this.state.filter_text) === -1) ? false : true; //This condition is used for text filter
          var type = obj[i_key].type;
          if(obj[i_key].required){
            var key_required = obj[i_key].required;
          }else{
            var key_required = false;
          }

          if(type !== undefined){
            if(type === 'object'){
              par_concat_key = (par_concat_key === '')? (this.delimiter_key + i_key): (par_concat_key + this.delimiter_key + i_key)
              var mappable = true;
              if(!mappable || !this.state.mappableToggle){
              mapping_this.client_schema_list.push(
                <SingleAttrItem
                  Schema={this.props.Schema}
                  mapping_store={this.props.mapping_store}
                  data_store_type_name={this.props.data_store_type_name}
                  data_source_name={this.props.data_source_name}
                  master_obj={this.props.master_obj}
                  which_side={this.props.which_side}
                  key={indent + par_concat_key + this.delimiter_key + i_key + '_Obj'}
                  attrKey={i_key}
                  attrConcatKey={par_concat_key + this.delimiter_key + i_key}
                  indent={indent}
                  type={type}
                  key_required = {key_required}
                  mappable={mappable}
                  show_key_box={show_key_box}
                  />
              )
              }
              mapping_this.iter_method(par_concat_key, obj[i_key].properties, mapping_this, indent)
            }
            else if( type === 'array'){
              var mappable = true;
              if(!mappable || !this.state.mappableToggle){
              mapping_this.client_schema_list.push(
                <SingleAttrItem
                  Schema={this.props.Schema}
                  mapping_store={this.props.mapping_store}
                  data_store_type_name={this.props.data_store_type_name}
                  data_source_name={this.props.data_source_name}
                  master_obj={this.props.master_obj}
                  which_side={this.props.which_side}
                  key={indent + par_concat_key + this.delimiter_key + i_key + '_Arr'}
                  attrKey={i_key}
                  attrConcatKey={par_concat_key + this.delimiter_key + i_key}
                  indent={indent}
                  type={type}
                  key_required = {key_required}
                  mappable={mappable}
                  show_key_box={show_key_box}
                  />
              )
              }
              var new_unnamed_obj = {};
              new_unnamed_obj['['+i_key+']'] = obj[i_key]['items']
              mapping_this.iter_method(par_concat_key, new_unnamed_obj, mapping_this, indent)
            }
            else{
              var mappable = false;
              if(!mappable || !this.state.mappableToggle){
              mapping_this.client_schema_list.push(
                <SingleAttrItem
                  Schema={this.props.Schema}
                  mapping_store={this.props.mapping_store}
                  data_store_type_name={this.props.data_store_type_name}
                  data_source_name={this.props.data_source_name}
                  master_obj={this.props.master_obj}
                  which_side={this.props.which_side}
                  key={indent + par_concat_key + this.delimiter_key + i_key}
                  attrKey={i_key}
                  attrConcatKey={par_concat_key + this.delimiter_key + i_key}
                  indent={indent}
                  type={type}
                  key_required = {key_required}
                  mappable={mappable}
                  show_key_box={show_key_box}
                  />
              )
              }

            }
          }
      }

    }

    render() {
        this.client_schema_list = [];
        var temp_filter_icon = (this.state.filter_text === '') ? 'fa-search' : 'fa-times';
        if(this.state.collasalTog){
          this.iter_method(this.props.parent_key, this.props.Schema[this.props.parent_key], this, 0);
        }

        return (
          <div>
            <FormGroup key={this.props.data_store_type_name+'form_group'}>
              <InputGroup key={this.props.data_store_type_name+'input_group'}>
               <FormControl
                type="text" placeholder="Search" name="Search" value={this.state.filter_text}
                key={this.props.data_store_type_name+'form_control'}
                onChange={this.onChange.bind(this)}
                />

                  <InputGroup.Button key={this.props.data_store_type_name+'input_group_btn'}>
                    <Button bsStyle="default" onClick={() => {this.setState({ filter_text: '' })}} key={this.props.data_store_type_name+'_btn'}>
                      <i className={'fa '+temp_filter_icon} key={this.props.data_store_type_name+'_search_icon'}></i>
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            <Button bsStyle="default" onClick={() => {this.setState({'mappableToggle': !this.state.mappableToggle})} }>
              {this.state.mappableToggle? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}</Button>

            <Button bsStyle="default" onClick={() => {this.setState({'collasalTog': !this.state.collasalTog})} }>
                {this.state.collasalTog? <i className="fa fa-arrows-h"></i> : <i className="fa fa-arrows-v"></i>}</Button>

            {this.client_schema_list}
          </div>
        );
    }
}

SchemaSelectable.propTypes = {
    store: React.PropTypes.object
};

export default SchemaSelectable;
