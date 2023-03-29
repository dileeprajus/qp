/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Radio, Col, FormGroup, FormControl ,Row, MenuItem, ButtonToolbar, DropdownButton } from 'react-bootstrap'
import TabPanePayloadFormdata from './tab_pane_payload_form-data';
import TabPanePayloadformurlencoded from './tab_pane_payload_x-www-form-urlencoded';

@observer
class TabPanePayload extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.state ={
        'raw': true,
        'form-data':true,
        'x-www-form-urlencoded':true
    }
  }

  componentWillReceiveProps () {
    if(this.rest_client_store.configJson[this.props.payload_option]==='raw'){
      this.setState({'raw':false,'form-data':true,'x-www-form-urlencoded':true})
    }
    else if(this.rest_client_store.configJson[this.props.payload_option]==='form-data'){
      this.setState({'raw':true,'form-data':false,'x-www-form-urlencoded':true})
    }
    else if(this.rest_client_store.configJson[this.props.payload_option]==='x-www-form-urlencoded'){
      this.setState({'raw':true,'form-data':true,'x-www-form-urlencoded':false})
    }
    else{}
  }

  onChange (event) {
    this.rest_client_store.setvalue(event.target.name, event.target.value)
    if(this.rest_client_store[this.props.payload_option]==='raw' && event.target.name==='payload'){
      var temp_json = this.rest_client_store.extractTempRequestVariables(event.target.value,event.target.name);
      var temp_request_variables = this.rest_client_store.TempRequestVariables;
      temp_request_variables[event.target.name]=temp_json;
      this.rest_client_store.setvalue('TempRequestVariables', temp_request_variables);
      this.rest_client_store.normRequestVariables();
    }
  }
  onSelect (event) {
      this.rest_client_store.setvalue(event.target.name,event.target.value)
      if(event.target.value==='raw'){
        this.setState({'raw':false,'form-data':true,'x-www-form-urlencoded':true})
      }
      else if(event.target.value==='form-data'){
        this.setState({'raw':true,'form-data':false,'x-www-form-urlencoded':true})
      }
      else if(event.target.value==='x-www-form-urlencoded'){
        this.setState({'raw':true,'form-data':true,'x-www-form-urlencoded':false})
      }
      else{}
  }

  showPayloadInput(){
    if(this.rest_client_store[this.props.payload_option]==='raw'){
     return false;
   }else if(this.rest_client_store[this.props.payload_option]==='form-data'){
     return false;
   }else if(this.rest_client_store[this.props.payload_option]==='x-www-form-urlencoded'){
     return false;
    }else {
    return true;
    }
  }

  updatePayload(event){
    this.rest_client_store.setvalue(this.props.payload, JSON.parse(event));
    var temp_json = this.rest_client_store.extractTempRequestVariables(event,this.props.payload);
    var temp_request_variables = this.rest_client_store.TempRequestVariables;
    temp_request_variables[this.props.payload]=temp_json;
    this.rest_client_store.setvalue('TempRequestVariables', temp_request_variables);
  }

  selectItem(name,event){
    this.rest_client_store.setvalue(name,event);
  }

    render() {
       var option_list = this.rest_client_store.payload_option_list.map(m => {
        return( //TODO : Need to change disbled condition for other options of payload, for now only supporting raw
          <Radio key={m} name={this.props.payload_option} value={m} inline  checked={(this.rest_client_store[this.props.payload_option] === m)? true : false } onChange={this.onSelect.bind(this)}>{m}</Radio>
        )
      });
      var raw_payload_option_list = this.rest_client_store.raw_payload_option_list.map(m => {
        return(
          <MenuItem key={m} eventKey={m} active={(this.rest_client_store['current_raw_payload_option'] === m)? true : false }>{m}</MenuItem>
        )
      });
        return (
        <div>
          <Row>
          <FormGroup className="raio-btn-form-group">
            <div className="col-xs-10  radio-btn-div">
              <Col xs ={10} xsOffset = {4}>
              {option_list}
              </Col>
            </div>
          </FormGroup>
        </Row>
        <Row>
          <FormGroup>
          <div hidden={this.state.raw} id="SpecJsonPretty" style={{ backgroundColor: '#282A36' }}>
            <Col xs={12}>
            <ButtonToolbar className="pull-right">
              <DropdownButton bsStyle={'Default'.toLowerCase()} title={this.rest_client_store['current_raw_payload_option']} name="current_raw_payload_option" value={this.rest_client_store['current_raw_payload_option']} onSelect={this.selectItem.bind(this,'current_raw_payload_option')} id="dropdown-basic">
                {raw_payload_option_list}
              </DropdownButton>
            </ButtonToolbar>
             <FormControl name={this.props.payload} rows="10"  componentClass="textarea" value={this.rest_client_store[this.props.payload]} onChange={this.onChange.bind(this)}/>
            </Col>
          </div>
          <div hidden={this.state['form-data']}>
            <TabPanePayloadFormdata rest_client_store={this.rest_client_store} attr_keyword="payload_form_data" />
          </div>
          <div hidden={this.state['x-www-form-urlencoded']}>
            <TabPanePayloadformurlencoded rest_client_store={this.rest_client_store} attr_keyword="payload_form_url_encoded"/>
          </div>
          </FormGroup>
        </Row>
        </div>
        )
    }
}

TabPanePayload.propTypes = {
  store: React.PropTypes.object
};

export default TabPanePayload;
