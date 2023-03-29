/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Button, Tabs, Tab,Label} from 'react-bootstrap'
import { inject, observer } from 'mobx-react';
import mobx from 'mobx';
import {getDataTypeStyle} from '../../../../lib/MappingLoggic';
import RenderStaticSchemaJson from './render_static_schema_json';
import StaticBasicDetails from './static_basic_details';
import ScriptFilters from './script_filters';
import AttributeValidations from './attribute_validations';
import OptionListMatch from './option_list_match';
import TypeManagerStore from '../../../../stores/TypeManagerStore';
import {getParentObj} from '../../../../lib/MappingLoggic'

const type_manager_store = new TypeManagerStore();

@inject('breadcrumb_store')
@observer
class AttributeMapConfig extends React.Component {
    constructor(props) {
        super(props);

        this.type_manager_store = type_manager_store;


        this.color_style = getDataTypeStyle(this.props.type);
        this.state = {
          toggle_json_config: false,
          client_store: this.props.client_store,
          host_store: this.props.host_store
        };
    }

    componentWillMount() {
      this.type_manager_store.GetFilterScripts;
      this.type_manager_store.GetDataTypes;
    }

    render() {
        if(this.state.host_store.store_name === 'FlexStore'){
        var temp_host_schema = this.state.host_store['SchemaByTypeID'];
        var hostParObj =  getParentObj(temp_host_schema[this.props.mapping_schema[this.props.index].host.master_obj.typeName], this.props.mapping_schema[this.props.index].host_key);

        if('optionList' in hostParObj){
          for (var key in hostParObj['optionList']){
            if(this.props.mapping_schema[this.props.index]['host']['optionList'][key] === undefined){
              this.props.mapping_schema[this.props.index]['host']['optionList'][key] = ''
            }else if(this.props.mapping_schema[this.props.index]['host']['optionList'][key] === null){
              this.props.mapping_schema[this.props.index]['host']['optionList'][key] = ''
            }else{

            }
          }
        }
      }

        var screen_element = '';

        var validations_count = 0
        var total = 0;
          for(var key in this.props.mapping_schema[this.props.index].host['validations']){
            if((JSON.stringify(this.props.mapping_schema[this.props.index]['host'][key]) === '[]' || JSON.stringify(this.props.mapping_schema[this.props.index]['host'][key]) === '{}')  && (JSON.stringify(this.props.mapping_schema[this.props.index]['client'][key]) === '[]' || JSON.stringify(this.props.mapping_schema[this.props.index]['client'][key]) === '{}')){
            }
            else{
              total++;
              if(this.props.mapping_schema[this.props.index].host['validations'][key]===true && this.props.mapping_schema[this.props.index].client['validations'][key]===true ){ //as keys in validations are same in both host and client
                validations_count++;
              }
            }
          }

        var validations_status = <span>Validations <Label bsStyle={(validations_count===total)? 'success' : 'danger'  }> {validations_count} / {total} </Label></span>

        if(this.props.mapping_store.configJson.DestinationConfig.StoreName === 'FlexStore'){
          var c_schema = this.state.client_store['SchemaByTypeID'];
        }
        else{
          var c_schema = this.state.client_store['Schema'];
        }

        if(this.props.mapping_store.configJson.SourceConfig.StoreName === 'FlexStore'){
          var h_schema = this.state.host_store['SchemaByTypeID'];
        }
        else{
          var h_schema = this.state.host_store['Schema'];
        }

        var json_screen = (
          <RenderStaticSchemaJson
            mapping_store={this.props.mapping_store}
            mapping_schema_json={this.props.mapping_schema[this.props.index]}
            host_schema_json={mobx.toJS(h_schema)}
            client_schema_json={mobx.toJS(c_schema)}
            />
        );

        var conf_ui = <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
          <Tab eventKey={1} title="Basic Details">
            <StaticBasicDetails
              mapping_schema_json={this.props.mapping_schema[this.props.index]}
              host_schema_json={h_schema}
              client_schema_json={c_schema}
              />
          </Tab>
          <Tab eventKey={2} title="OptionList">
            <OptionListMatch
              index={this.props.index}
              mapping_schema={this.props.mapping_schema}
              mapping_store = {this.props.mapping_store}
              host_schema={this.state.host_store['SchemaByTypeID']}
              client_schema={this.state.client_store['Schema']}
              hostParObj={hostParObj}
              />
          </Tab>
          <Tab eventKey={3} title="Filters(Host to Client)">
            <ScriptFilters
              source_key="host"
              destination_key="client"
              mapping_store={this.props.mapping_store}
              type_manager_store={this.type_manager_store}
              index={this.props.index}
              mapping_schema={this.props.mapping_schema}
              prop_key="TransformationRules"
              />
          </Tab>
          <Tab eventKey={4} title="Filters(Client to Host)">
            <ScriptFilters
              source_key="client"
              destination_key="host"
              direction="c2h"
              mapping_store={this.props.mapping_store}
              type_manager_store={this.type_manager_store}
              index={this.props.index}
              mapping_schema={this.props.mapping_schema}
              prop_key="TransformationRules"
              />
          </Tab>
          <Tab eventKey={5} title={validations_status}>
          <AttributeValidations
            index={this.props.index}
            mapping_store={this.props.mapping_store}
            type_manager_store={this.type_manager_store}
            mapping_schema={this.props.mapping_schema}
          />
          </Tab>
        </Tabs>

        if(this.state.toggle_json_config){
          screen_element = json_screen;
        }else{
          screen_element = conf_ui;
        }

        return (
          <div>
            <Button bsStyle="" onClick={() => this.setState({toggle_json_config: !this.state.toggle_json_config}) }>Toggle Config JSON</Button>
            {screen_element}
          </div>
        );
    }
}

AttributeMapConfig.propTypes = {
    store: React.PropTypes.object
};

export default AttributeMapConfig;
