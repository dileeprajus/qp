/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {Form, Thumbnail, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap'
import {observer } from 'mobx-react';

@observer
class OptionListMatch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onChange(event) {
      var host_optional_temp_obj = this.props.mapping_schema[this.props.index].host.optionList;
      host_optional_temp_obj[event.target.name]=event.target.value;
      this.props.mapping_schema[this.props.index].client.optionList = {}
      for(var tmp_key in host_optional_temp_obj){
        if(host_optional_temp_obj[tmp_key] === ''){
          this.props.mapping_schema[this.props.index].client.optionList[tmp_key] = tmp_key;
        }else{
          this.props.mapping_schema[this.props.index].client.optionList[host_optional_temp_obj[tmp_key]] = tmp_key;
        }

      }
      this.setState({option_list_conf_attr: host_optional_temp_obj});
      this.props.mapping_store.updateMappingSchema();
    }

    addOptionListToConfig(){

      var tmp_map_schema = this.props.mapping_schema[this.props.index];
      tmp_map_schema.host.optionList = this.props.mapping_schema[this.props.index].host.optionList;
      this.props.mapping_schema[this.props.index] = tmp_map_schema;



    }

    render() {
      var temp_option_list=[];

      var thing_to_print = '';
        for (var key in this.props.mapping_schema[this.props.index].host.optionList){
          if(this.props.hostParObj.optionList){
            temp_option_list.push(
              <FormGroup key={'form_'+key} className = "navtab">
                <Col sm={4} md={4} lg={4} xs={4}>
                  <ControlLabel>{this.props.hostParObj.optionList[key]}</ControlLabel>
                </Col>
                <Col sm={8} md={8} lg={8} xs={8}>
                  <FormControl type="text" key={key} placeholder="Client value" name={key} value={this.props.mapping_schema[this.props.index].host.optionList[key]} onChange={this.onChange.bind(this)}/>
                </Col>
              </FormGroup>
            )
          }
        }

        if(temp_option_list.length > 0){
          thing_to_print = (
             <Thumbnail>
                <Form horizontal>
                  {temp_option_list}
                </Form>
              </Thumbnail>
          )
      }else{
        thing_to_print = (<h5>This attribute doesn't have OptionList.</h5>)
      }


      return (
        <div>
         {thing_to_print}
       </div>
      );
    }
}

OptionListMatch.propTypes = {
    store: React.PropTypes.object
};

export default OptionListMatch;
