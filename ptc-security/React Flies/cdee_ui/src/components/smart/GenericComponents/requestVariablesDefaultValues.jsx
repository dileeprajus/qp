/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormGroup, FormControl, ControlLabel, Row, Col } from 'react-bootstrap'
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import AlertContainer from 'react-alert';
import { RIEInput, RIESelect } from 'riek';
import _ from 'lodash';

@inject('routing', 'generic_master_store')
@observer
class RequestVariablesDefaultValues extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.client_store = this.props.client_store;
    this.state = {
      request_variables_list: [],
      rv_values_obj:{}
    }
  }

  componentWillReceiveProps() {
    if (this.client_store['configJson']['RequestVariables'] !== undefined) {
      var request_variables_json = this.client_store['configJson']['RequestVariables'];
      var obj = {};
      for (var key in request_variables_json) {
          obj[key] = request_variables_json[key];
      }
      this.setState({rv_values_obj: obj});
    }
  }

  onChange(event) {
    var temp_state_rv = this.state.rv_values_obj;
    temp_state_rv[event.target.name]=event.target.value;
    this.setState({rv_values_obj: temp_state_rv});
    var temp = this.client_store.RequestVariables
    temp[event.target.name]=event.target.value;
    var temp_rv = {}
    temp_rv = temp
    this.client_store.setvalue('RequestVariables', temp_rv);
    var temp_confg = this.client_store.configJson
    temp_confg['RequestVariables']=temp_rv
    this.client_store.setvalue('configJson', temp_confg);
  }
  showAlert = (msg) => {
      this.msg.show(msg, {
          type: 'error'
      })
  };
  alertOptions = {
    offset: 40,
    position: 'bottom left',
    theme: 'dark',
    time: 3000,
    transition: 'scale'
  };
  constructObjectFromArray(obj, keys, v) {
    if (keys.length === 1) {
      obj[keys[0]] = v;
    } else {
      var key = keys.shift();
      obj[key] = this.constructObjectFromArray(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);
    }
    return obj;
  }

  updateRequestVariablesValues(key,event){
    var temp_state_rv = this.state.rv_values_obj;
    temp_state_rv[key]=event[key];
    this.setState({rv_values_obj: temp_state_rv})
    var temp = this.client_store.RequestVariables
    temp[key]=event[key];
    var temp_rv = {}
    temp_rv = temp
    this.client_store.setvalue('RequestVariables', temp_rv);
    var temp_confg = this.client_store.configJson
    temp_confg['RequestVariables']=temp_rv
    this.client_store.setvalue('configJson', temp_confg);
  }

  updateEnum(key,event){
    var temp = this.client_store.RequestVariablesConfig
    if(temp[key]===undefined){
      temp[key]={}
    }
    temp[key]['enum']=JSON.parse(event)
    this.client_store.setvalue('RequestVariablesConfig', temp);
    var temp_confg = this.client_store.configJson
    temp_confg['RequestVariablesConfig']=temp
    this.client_store.setvalue('configJson', temp_confg);
  }

  updateRequestVariablesConfig(key,event){
    var temp = this.client_store.RequestVariablesConfig
    if(temp[key]===undefined){
      temp[key]={}
    }
    for(var rule in event){
      if(rule=='enum' || rule=='dataFormat' || rule=='modeOfInput'){
        if(temp[key]===''){
          temp[key]={}
        }
        temp[key][rule]=event[rule]
      }else{
        if(temp[key]===''){
          temp[key]={}
        }
        temp[key][rule]=event[rule].id
      }
    }
    var temp_rv = {}
    temp_rv= temp
    this.client_store.setvalue('RequestVariablesConfig', temp_rv);
    var temp_confg = this.client_store.configJson
    temp_confg['RequestVariablesConfig']=temp_rv
    this.client_store.setvalue('configJson', temp_confg);
  }

  renderRequestVars() {
    var output = []
    var obj = this.state.rv_values_obj;
    for(var key in obj){
      output.push(
        <Row key={key} style={{ textAlign: 'center' }}>
          <Col xs={5} key={'list1' + key}>
            <FormGroup>
              <ControlLabel><h6><b style={{ wordWrap: 'break-word' }}>{key} : </b></h6></ControlLabel>
            </FormGroup>
          </Col>
          <Col xs={5} key={'list2' + key}>
            <FormControl
              type="text" placeholder="Enter value"
              name={key} value={obj[key]}
              onChange={this.onChange.bind(this)} required
            />
          </Col>
        </Row>)
    }
    return output;
  }

  render() {
    var request_vars_codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: false
    };
    var optionsList=[
        { id: 'select', text: 'Select' },
      { id: 'true', text: 'true' },
      { id: 'false', text: 'false' }
    ]

    var dataTypesOptionsList=[{ id: 'select', text: 'Select' },
  { id: 'string', text: 'string' },
  { id: 'number', text: 'number' },
  { id: 'boolean', text: 'boolean' },
  { id: 'object', text: 'object' },
  { id: 'array', text: 'array' },
  { id: 'null', text: 'null' },
  { id: 'date', text: 'date' },
  { id: 'datetime', text: 'datetime' },
  { id: 'time', text: 'time' }]

    var request_vars_form =[]
    var rvs = this.client_store.RequestVariablesConfig;
    var rv_values = this.client_store.RequestVariables;
    for(var key in rv_values){
        var request_vars_sub_form = []
        request_vars_sub_form.push(<div id="ReqValText">
          <FormGroup key={'reqvar'+key}>
            <ControlLabel style={{wordWrap:'break-word'}}>{key} : </ControlLabel>
            <RIEInput
              value={typeof rv_values[key] === 'object' ? JSON.stringify(rv_values[key]) : (rv_values[key] !== '' ? rv_values[key] : 'Please enter value here')}
              change={this.updateRequestVariablesValues.bind(this,key)}
              propName={key}
              validate={_.isString}
            />
          </FormGroup>
        </div>
        );
        var enum_val = {}
        if(rvs[key]!==undefined){
          enum_val = rvs[key]['enum']
        }
        request_vars_sub_form.push(
          <FormGroup key={'enum'+key}>
            <ControlLabel style={{color:'black'}}>enum : </ControlLabel>
            <CodeMirror
              value={JSON.stringify(enum_val, null, 2)}
              options={request_vars_codeOptions}
              onChange={this.updateEnum.bind(this,key)}
            />
          </FormGroup>);
          var type_val = 'Select datatype'
          if(rvs[key]!==undefined && rvs[key]['type']!==undefined){
            type_val=rvs[key]['type']
          }
          if(rvs[key]!==undefined && rvs[key]['dataType']!==undefined){
            type_val=rvs[key]['dataType']
          }
          request_vars_sub_form.push(
            <FormGroup key={'dataType'+key}>
              <ControlLabel style={{color:'black'}}>dataType : </ControlLabel>
              <RIESelect
                value={{
                  id: type_val ,
                  text: type_val
                }}
                className={'editable'}
                options={dataTypesOptionsList}
                change={this.updateRequestVariablesConfig.bind(this,key)}
                classLoading="loading"
                propName="dataType"
                isDisabled={false}
              />
            </FormGroup>);
            request_vars_sub_form.push(
              <FormGroup key={'dataFormat'+key}>
                <ControlLabel style={{color:'black'}}>dataFormat : </ControlLabel>
                <RIEInput
                  value={(rvs[key]===undefined ||(rvs[key]!==undefined && rvs[key]['dataFormat']===undefined)) ?'please enter value here':rvs[key]['dataFormat']}
                  change={this.updateRequestVariablesConfig.bind(this,key)}
                  propName="dataFormat"
                  validate={_.isString}
                />
              </FormGroup>);
            request_vars_sub_form.push(
              <FormGroup key={'multiSelect'+key}>
                <ControlLabel style={{color:'black'}}>multiSelect : </ControlLabel>
                <RIESelect
                  value={{
                    id: (rvs[key]===undefined ||(rvs[key]!==undefined && rvs[key]['multiSelect']===undefined)) ?'Select your option':rvs[key]['multiSelect'],
                    text: (rvs[key]===undefined ||(rvs[key]!==undefined && rvs[key]['multiSelect']===undefined)) ?'Select your option':rvs[key]['multiSelect']
                  }}
                  className={'editable'}
                  options={optionsList}
                  change={this.updateRequestVariablesConfig.bind(this,key)}
                  classLoading="loading"
                  propName="multiSelect"
                  isDisabled={false}
                />
              </FormGroup>);
              request_vars_sub_form.push(
                <FormGroup key={'modeOfInput'+key}>
                  <ControlLabel style={{color:'black'}}>modeOfInput : </ControlLabel>
                  <RIEInput
                    value={(rvs[key]===undefined ||(rvs[key]!==undefined && rvs[key]['modeOfInput']===undefined)) ?'please enter value here':rvs[key]['modeOfInput']}
                    change={this.updateRequestVariablesConfig.bind(this,key)}
                    propName="modeOfInput"
                    validate={_.isString}
                  />
                </FormGroup>);
              request_vars_form.push(request_vars_sub_form)
    }
    return (
      <div className="selectedContainerStyle">
        <div hidden={request_vars_form.length !== 0}>
          <p style={{ color: 'gray', textAlign: 'center' }}>{'There are no request variables'}
          </p>
        </div>
        <div>
         <div id="ReqValuePlaceholder">
           {request_vars_form}
         </div>
        </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

RequestVariablesDefaultValues.propTypes = {
  store: React.PropTypes.object
};

export default RequestVariablesDefaultValues;
