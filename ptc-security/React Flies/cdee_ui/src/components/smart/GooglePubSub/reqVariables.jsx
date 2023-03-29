/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

 * Unauthorized copying of this file via any medium is strictly prohibited

 * See LICENSE file in the project root for full license information

 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { RIEInput, RIESelect } from 'riek';

@inject('routing', 'generic_master_store')
@observer
class RequestVariableConfig extends React.Component {
  constructor(props) {
    super(props);
    this.client_store = this.props.client_store;
    this.state = {}
  }

  componentWillMount() {
  }

  updateRequestVariablesValues(tp, key, event){
      var temp = this.client_store.requestVariables[tp];
     for (var type in temp) { // eslint-disable-line no-unused-vars
        if (temp[key] !== undefined) {
          temp[key] = event[key]
        }
        this.client_store.requestVariables[tp] = temp;
      }
      this.client_store.setvalue('requestVariables', this.client_store.requestVariables);

      var temp_rv_config = this.client_store.requestVariablesConfig[tp];
      if (temp_rv_config[key] !== undefined) {

      } else {
        temp_rv_config[key] = {};
      }
      temp_rv_config[key]['defaultValue'] = event[key];
      this.client_store.requestVariablesConfig[tp] = temp_rv_config;
      this.client_store.setvalue('requestVariablesConfig', this.client_store.requestVariablesConfig);
      var tem_confg = this.client_store.configJson;
      tem_confg['RequestVariablesConfig']=this.client_store.requestVariablesConfig;
      tem_confg['RequestVariables']=this.client_store.requestVariables;
      this.client_store.setvalue('configJson', tem_confg);
    }

  updateRequestVariablesConfig(tp, key, event) {
    var temp = this.client_store.requestVariablesConfig[tp];
    if(temp[key]===undefined){
      temp[key]={}
    }
    for(var rule in event){
      if(rule=='fileNameFormat'){
        if(temp[key]==='' || typeof temp[key]==='string'){
          temp[key]={}
        }
        temp[key][rule]=event[rule].id
      }else{
        if(temp[key]==='' || typeof temp[key]==='string'){
          temp[key]={}
        }
        temp[key][rule]=''
      }
    }
    this.client_store.requestVariablesConfig[tp] = temp;
    this.client_store.setvalue('requestVariablesConfig', this.client_store.requestVariablesConfig);
    var temp_confg = this.client_store.configJson;
    temp_confg['RequestVariablesConfig']=this.client_store.requestVariablesConfig;
    this.client_store.setvalue('configJson', temp_confg);
  }

  render() {
    var fileNameFormat=[{ id: '', text: 'Select fileNameFormat' },
      { id: 'Date', text: 'Date' },
      { id: 'Oid', text: 'Oid' }];
    var rvs = this.client_store.requestVariablesConfig;
    var request_vars_form = [];
    for (var k in rvs) {
      for (var key in rvs[k]) {
        var request_vars_sub_form = [];
        var value = rvs[k][key].defaultValue;
        if (typeof value === 'object') {
          value = JSON.stringify(value)
        }
        request_vars_sub_form.push(<div className="ReqValueID"><ControlLabel style={{color: 'deeppink'}}>
          <h5>{key}: </h5></ControlLabel>,
          <RIEInput
            value={value || 'please enter value here'}
            change={this.updateRequestVariablesValues.bind(this,k, key)}
            propName={key}
          /></div>
        );
        request_vars_sub_form.push(
          <FormGroup key={'fileNameFormat'+ rvs[k][key]} hidden={this.client_store.currentGroupType === 'source'}>
            <ControlLabel style={{color:'white'}}>fileNameFormat : </ControlLabel>
            <RIESelect
              value={{
                id: rvs[k][key]===undefined?'':rvs[k][key]['fileNameFormat'] || '',
                text: rvs[k][key]===undefined?'':rvs[k][key]['fileNameFormat'] || 'Select fileNameFormat'
              }}
              className={'editable'}
              options={fileNameFormat}
              change={this.updateRequestVariablesConfig.bind(this, k, key)}
              classLoading="loading"
              propName="fileNameFormat"
              isDisabled={false}
            />
          </FormGroup>
        );
        request_vars_form.push(request_vars_sub_form)
      }
    }

    return (
      <div className="ReqValueID">
        {request_vars_form}
      </div>
    );
  }
}

RequestVariableConfig.propTypes = {
  store: React.PropTypes.object
};

export default RequestVariableConfig;
