/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import { RIEInput, RIESelect } from 'riek';
import _ from 'lodash';

@inject('routing', 'generic_master_store')
@observer
class RequestVariablesConfig extends React.Component {
  constructor(props) {
    super(props);
    this.client_store = this.props.client_store;
    this.state = {
    }
  }

  componentWillReceiveProps() {
  }

  updateEnumValue(key,event){
    var temp = this.client_store.RequestVariablesConfig
    if(temp[key]===undefined){
      temp[key]={}
    }
    try {
      temp[key]['enum']=JSON.parse(event);
    } catch (e) {
    }
    this.client_store.setvalue('RequestVariablesConfig', temp);
    var temp_confg = this.client_store.configJson
    temp_confg['RequestVariablesConfig']=temp
    this.client_store.setvalue('configJson', temp_confg);
  }

  updateRequestVariablesValues(key,event){
    if(this.client_store.store_name==='RestClientStore'){
      var temp = this.client_store.TempRequestVariables;
      for(var type in temp){
        if(temp[type][key]!==undefined){
          temp[type][key]=event[key]
        }
      }
      this.client_store.setvalue('TempRequestVariables', temp);
      this.client_store.normRequestVariables();
      var temp_rv_config = this.client_store.RequestVariablesConfig;
      if(temp_rv_config[key] !== undefined) {
      }else{
        temp_rv_config[key] = {};
      }
      temp_rv_config[key]['defaultValue']=event[key];
      this.client_store.setvalue('RequestVariablesConfig', temp_rv_config);
    }else{
      var temp = this.client_store.RequestVariables
      temp[key]=event[key];
      var temp_rv = {}
      temp_rv = temp
      this.client_store.setvalue('RequestVariables', temp_rv);
      var temp_confg = this.client_store.configJson
      temp_confg['RequestVariables']=temp_rv
      this.client_store.setvalue('configJson', temp_confg);
    }
  }

  updateRequestVariablesConfig(key,event){
    var temp = this.client_store.RequestVariablesConfig
    if(temp[key]===undefined){
      temp[key]={}
    }
    for(var rule in event){
      if(rule=='enum' || rule=='format'){
        if(temp[key]==='' || typeof temp[key]==='string'){
          temp[key]={}
        }
        temp[key][rule]=event[rule]
      }else{
        if(temp[key]==='' || typeof temp[key]==='string'){
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


  render() {
    var request_vars_codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: false
    };
    var optionsList=[
        { id: '', text: 'Select' },
      { id: 'true', text: 'true' },
      { id: 'false', text: 'false' }
    ]

    var dataTypesOptionsList=[{ id: '', text: 'Select' },
  { id: 'string', text: 'string' },
  { id: 'number', text: 'number' },
  { id: 'boolean', text: 'boolean' },
  { id: 'object', text: 'object' },
  { id: 'array', text: 'array' },
  { id: 'null', text: 'null' },
  { id: 'date', text: 'date' },
  { id: 'datetime', text: 'datetime' },
  { id: 'time', text: 'time' }]

    var customEndPoints=this.client_store.CustomEndPoints;

    var modeOfInputOptions=[{ id: '', text: 'Select' },
      { id: 'IE', text: 'IE' },
      { id: 'other', text: 'other' }];

    var varTypeInputOptions=[{ id: '', text: 'Select' },
      { id: 'input', text: 'input' },
      { id: 'configuration', text: 'configuration' }];

    var request_vars_form =[]
    if(this.client_store.store_name==='DataBaseStore'){
      var rvs = this.client_store.RequestVariables;
      var rv_values = this.client_store.RequestVariablesConfig;
    }
    else{
      var rvs = this.client_store.RequestVariablesConfig;
      var rv_values = this.client_store.RequestVariables;
    }
    for(var key in rv_values){
        var request_vars_sub_form = []
        var value = rv_values[key]
        if(typeof value==='object'){
          value = JSON.stringify(value)
        }
        request_vars_sub_form.push(<div className="ReqValueID"><ControlLabel style={{color:'deeppink'}}><h5>{key}: </h5></ControlLabel>,
        <RIEInput
          value={value || 'please enter value here'}
          change={this.updateRequestVariablesValues.bind(this,key)}
          propName={key}
        /></div>
        );
        var enum_val = {}
        if(rvs[key]!==undefined && rvs[key]['enum']!==undefined){
          enum_val = rvs[key]['enum']
        }
        request_vars_sub_form.push(
          <FormGroup key={'enum'+key}>
            <ControlLabel style={{color:'white'}}>enum : </ControlLabel> Enter value below
            <div className="JSONEditor">
            <CodeMirror
              value={JSON.stringify(enum_val, null, 2)}
              options={request_vars_codeOptions}
              onChange={this.updateEnumValue.bind(this,key)}
            /></div>
          </FormGroup>);
          request_vars_sub_form.push(
            <FormGroup key={'reqEndPoint'+key}>
              <ControlLabel style={{color:'white'}}>reqEndPoint : </ControlLabel>
              <RIESelect
                value={{
                  id: rvs[key]===undefined?'':rvs[key]['reqEndPoint'] || '',
                  text: rvs[key]===undefined?'':rvs[key]['reqEndPoint'] || 'Select customsource'
                }}
                className={'editable'}
                options={customEndPoints}
                change={this.updateRequestVariablesConfig.bind(this,key)}
                classLoading="loading"
                propName="reqEndPoint"
                isDisabled={false}
              />
            </FormGroup>);
          request_vars_sub_form.push(
            <FormGroup key={'type'+key}>
              <ControlLabel style={{color:'white'}}>type : </ControlLabel>
              <RIESelect
                value={{
                  id: rvs[key]===undefined?'':rvs[key]['type'] || '',
                  text: rvs[key]===undefined?'':rvs[key]['type'] || 'Select datatype'
                }}
                className={'editable'}
                options={dataTypesOptionsList}
                change={this.updateRequestVariablesConfig.bind(this,key)}
                classLoading="loading"
                propName="type"
                isDisabled={false}
              />
            </FormGroup>);
            request_vars_sub_form.push(
              <FormGroup key={'format'+key}>
                <ControlLabel style={{color:'white'}}>format : </ControlLabel>
                <RIEInput
                  value={rvs[key]===undefined?'':rvs[key]['format'] || 'please enter value here'}
                  change={this.updateRequestVariablesConfig.bind(this,key)}
                  propName="format"
                  validate={_.isString}
                />
              </FormGroup>);
            request_vars_sub_form.push(
              <FormGroup key={'multiSelect'+key}>
                <ControlLabel style={{color:'white'}}>multiSelect : </ControlLabel>
                <RIESelect
                  value={{
                    id: rvs[key]===undefined?'':rvs[key]['multiSelect'] || '',
                    text: rvs[key]===undefined?'':rvs[key]['multiSelect'] || 'Select your option'
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
                  <ControlLabel style={{color:'white'}}>modeOfInput : </ControlLabel>
                  <RIESelect
                    value={{
                      id: rvs[key]===undefined?'':rvs[key]['modeOfInput'] || '',
                      text: rvs[key]===undefined?'':rvs[key]['modeOfInput'] || 'Select your option'
                    }}
                    className={'editable'}
                    options={modeOfInputOptions}
                    change={this.updateRequestVariablesConfig.bind(this,key)}
                    classLoading="loading"
                    propName="modeOfInput"
                    isDisabled={false}
                  />
                </FormGroup>);
                request_vars_sub_form.push(
                  <FormGroup key={'varType'+key}>
                    <ControlLabel style={{color:'white'}}>varType : </ControlLabel>
                    <RIESelect
                      value={{
                        id: rvs[key]===undefined?'':rvs[key]['varType'] || '',
                        text: rvs[key]===undefined?'':rvs[key]['varType'] || 'Select your option'
                      }}
                      className={'editable'}
                      options={varTypeInputOptions}
                      change={this.updateRequestVariablesConfig.bind(this,key)}
                      classLoading="loading"
                      propName="varType"
                      isDisabled={false}
                    />
                  </FormGroup>
                );
              request_vars_form.push(request_vars_sub_form)
    }
    return (
      <div className="ReqValueID">
        {request_vars_form}
      </div>
    );
  }
}

RequestVariablesConfig.propTypes = {
  store: React.PropTypes.object
};

export default RequestVariablesConfig;
