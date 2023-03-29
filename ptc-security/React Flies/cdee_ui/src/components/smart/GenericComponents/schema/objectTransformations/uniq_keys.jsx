/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {inject, observer} from 'mobx-react';
import {FormGroup, FormControl, ControlLabel, Row, Col, Radio, Checkbox } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import TestRequestVariables from '../../testRequestVariables';
import RequestVariablesDefaultValues from '../../requestVariablesDefaultValues';
import SourceCreateTrigger from '../../../../static/layout/sourceCreateTrigger';

@inject('generic_master_store')
@observer
class UniqKeys extends React.Component {

    constructor(props) {
        super(props);
        this.generic_master_store = this.props.generic_master_store;
        this.state = {
            hideDropDown: (this.props.store.configJson['TimestampFrom'] === 'Schema Timestamp') ? false : true,
            RequestVariables: this.props.store.configJson['RequestVariables'],
            associationsObj: {},
            validationFormula: '',
            showWarnMsg: true
        }
    }

  componentWillMount() {
    if (this.props.store.store_name === 'FlexStore' && this.props.store.currentGroupType === 'source') {
      var config = this.props.store.configJson;
      this.setState({ associationsObj: config.AssociationsObj ? config.AssociationsObj : {},
                      showWarnMsg: config.AssociationsObj ? false : true });
    }
  }
  componentWillReceiveProps() {
    if (this.props.store.store_name === 'FlexStore' && this.props.store.currentGroupType === 'source') {
      var tempConf = this.props.store.configJson;
      if (tempConf['FlexPrimaryAPI'] === undefined) {
        tempConf['FlexPrimaryAPI'] = 'GetRecords';
        var rv = {
            objectType: '',
            fromIndex: ''
           //TODO: UI should be there to decide vars
        };
        tempConf['RequestVariables'] = rv;
        this.setState({ RequestVariables: rv });
        this.props.store.setvalue('configJson', tempConf);
      }
    }
  }
  onChange(event) {
    if (event.target.value === 'Schema Timestamp') {
      this.setState({ hideDropDown: false });
    } else {
      this.setState({ hideDropDown: true });
    }
    var temp_conf = this.props.store.configJson;
    temp_conf['TimestampFrom'] = event.target.value;
    this.props.store.setvalue('configJson', temp_conf);
  }

  updatePrimaryKeys(event) {
      var temp_conf = this.props.store.configJson;
      temp_conf[event.target.name] = event.target.value;
      if(event.target.name === 'FlexPrimaryAPI' && this.props.store.store_name === 'FlexStore' && this.props.store.currentGroupType === 'source') {
        if (event.target.value === 'GetRecords') {
          var rv = {
              objectType: '',
              fromIndex: ''
             //TODO: UI should be there to decide vars
          };
          temp_conf['RequestVariables'] = rv;
          this.setState({ RequestVariables: rv });
        } else if (event.target.value === 'GetAssociatedRecords') {
           var rv = {
               objectType: '',
               oid: '',
               association: ''
           }
           temp_conf['RequestVariables'] = rv;
           this.setState({ RequestVariables: rv });
         }else if (event.target.value === 'GetRecordsbyAttrs') {
           var rv = {}
           temp_conf['RequestVariables'] = rv;
           this.setState({ RequestVariables: rv });
         }
          else {}
      }
      this.props.store.setvalue('configJson', temp_conf);
  }

  saveAssociationsObj(event) {
    var configObj = this.props.store.configJson;
    if(event === ''){
      this.setState({ associationsObj: {} });
      configObj['AssociationsObj'] = {};
    }else{
      this.setState({ associationsObj: JSON.parse(event) });
      try {
        if(JSON.parse(event)){
          configObj['AssociationsObj'] = JSON.parse(event);
        }
      } catch (e) { 
        this.setState({ associationsObj: {} });
      }
    }
    this.props.store.setvalue('configJson', configObj);
  }
  saveValidationObj(event) {
    var configObj = this.props.store.configJson;
    var conv_string = String.raw`${event.target.value}`;
    configObj['Validation'] = conv_string;
   this.props.store.setvalue('configJson',configObj);
  }
  updateRequestVariables() {

  }
  returnSchema() {  //Fix for 370
    var tempSchema = {};
    if (this.props.store.currentGroupType === 'source') {
      tempSchema = this.props.store.outputSchema;
    } else if (this.props.store.currentGroupType === 'target') {
      tempSchema = this.props.store.inputSchema;
    }
    return tempSchema;
  }
  getSchemaKeysList(obj_key) {
    //debugger;
    //Fix for 370
    var keyObj = this.generic_master_store.getObj(this.returnSchema(), 'PrimaryKey');
    var output = [<option key="Select" name="Select">Select</option>];
    for (var key in keyObj) {
      output.push(
        <option key={key} name={key} selected={(this.props.store.configJson[obj_key] === key)? true : false}>{key}</option>
      )
    }
    return output;
  }
  getFlexDataPullApis() {
    var output = [];
    var list = ['GetRecords', 'GetAssociatedRecords', 'GetRecordsbyAttrs'];
    for(var i = 0; i < list.length; i++) {
      output.push(
        <option key={list[i]} name={list[i]} selected={(this.props.store.configJson['FlexPrimaryAPI'] === list[i])? true : false}>{list[i]}</option>
      )
    }
    return output;
  }
  getFlexMediaTypes() {
    var output = [];
    var list = ['none', 'base64'];
    for(var i = 0; i < list.length; i++) {
      output.push(
        <option key={list[i]} name={list[i]} selected={(this.props.store.configJson['FlexMediaType'] === list[i])? true : false}>{list[i]}</option>
      )
    }
    return output;
  }
  enableFlexTrigger(event){
    if(event.target.name==='enableFlexCreateTrigger'){
    this.props.store.setvalue('enableFlexTrigger', event.target.checked);
    }else if(event.target.name==='enableFlexUpdateTrigger'){
    this.props.store.setvalue('enableFlexUpdateTrigger',event.target.checked);
    }else{
    this.props.store.setvalue('enableFlexDeleteTrigger',event.target.checked);
    }
  }
  render() {
    var request_vars_codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: false
    };
    var normalised_schema_list = this.getSchemaKeysList('PrimaryKey');
    var normalised_schema_list_for_created_at = this.getSchemaKeysList('CreatedAtDataProvider');
    var normalised_schema_list_for_updated_at = this.getSchemaKeysList('UpdatedAtDataProvider');
    var flexApiSelection = '';
    var flexMediaTypeSelection = '';
    var enableTrigger = '';
    var reqVarsORTriggerComponent = '';
    var reqVarsValuesComponent = '';
    var reqVarsORTriggerText = '';
    var reqVarsValuesText = '';
    var xsVal = 6; var offSetVal = 2;
    if (this.props.store.store_name === 'StaticFileClientStore' && this.props.store.currentGroupType === 'source') {
      xsVal = 12;
      offSetVal = 0;
      reqVarsORTriggerText = 'Source Create Trigger';
      reqVarsORTriggerComponent = (<SourceCreateTrigger client_store={this.props.store} dataFormat={this.props.store.BasicConfigInfo.DataFormat} />);
    } else if (this.props.store.currentGroupType === 'source') {
      reqVarsORTriggerText = 'Request Variables';
      reqVarsORTriggerComponent = (<TestRequestVariables client_store={this.props.store} />);
      if(this.props.store.store_name === 'SoapConfigStore'){
        reqVarsValuesText = 'RequestVariables Default Values'
        reqVarsValuesComponent = (<RequestVariablesDefaultValues client_store={this.props.store} />);
      }
    }
    if(this.props.store.store_name === 'FlexStore' && this.props.store.currentGroupType === 'source') {
       var flex_apis_list = this.getFlexDataPullApis();
      flexApiSelection = (<div style={{marginLeft:'15px'}}><FormGroup>
        <ControlLabel><h5>Select Primary API</h5></ControlLabel>
        <FormControl componentClass="select" placeholder="select" title="FlexPrimaryAPI" name="FlexPrimaryAPI" onChange={this.updatePrimaryKeys.bind(this)}>
          {flex_apis_list}
        </FormControl>
      </FormGroup>
        <h5>Associations Object</h5>
        <CodeMirror
          value={JSON.stringify(this.state.associationsObj, null, 2)}
          options={request_vars_codeOptions}
          onChange={this.saveAssociationsObj.bind(this)}
        />
        <h5>Validation Object</h5>
        <FormControl componentClass="textarea" placeholder="Validation formula" value={this.props.store.configJson.Validation} onChange={this.saveValidationObj.bind(this)}/>
      </div>
    );

    var flex_mediatype_list = this.getFlexMediaTypes();
      enableTrigger = (
      <div key={'enableFlexTriggerDiv'}>
        <ControlLabel><h5>Enable FlexTrigger</h5></ControlLabel>
        <Checkbox style={{ paddingLeft: '25px' }} name={'enableFlexCreateTrigger'} key={'enableFlexCreateTriggerCheckbox'} checked={this.props.store.enableFlexTrigger} onChange={this.enableFlexTrigger.bind(this)}> Enable Flex Create Trigger</Checkbox>
        <Checkbox style={{ paddingLeft: '25px' }} name={'enableFlexUpdateTrigger'} key={'enableFlexUpdateTriggerCheckbox'} checked={this.props.store.enableFlexUpdateTrigger} disabled={this.props.store.disable_trigger===true} onChange={this.enableFlexTrigger.bind(this)}> Enable Flex Update Trigger</Checkbox>
        <Checkbox style={{ paddingLeft: '25px' }} name={'enableFlexDeleteTrigger'} key={'enableFlexDeleteTriggerCheckbox'} checked={this.props.store.enableFlexDeleteTrigger} onChange={this.enableFlexTrigger.bind(this)}> Enable Flex Delete Trigger</Checkbox>
      </div>
      );
    flexMediaTypeSelection = (
      <div>
        <FormGroup>
          <ControlLabel><h5>Select MediaType</h5></ControlLabel>
          <FormControl componentClass="select" placeholder="select" title="FlexMediaType" name="FlexMediaType" onChange={this.updatePrimaryKeys.bind(this)}>
            {flex_mediatype_list}
          </FormControl>
        </FormGroup>
      </div>
  );
    }
    var request_vars_comp = '';
    request_vars_comp = (
      <Col xs={12}>
        <FormGroup>
          <ControlLabel><h5>{reqVarsORTriggerText}</h5></ControlLabel><br />
          {reqVarsORTriggerComponent}
        </FormGroup>
      </Col>
    );
    var request_vars_values_comp = '';
    request_vars_values_comp = (
      <Col xs={12}>
        <FormGroup>
          <ControlLabel><h5>{reqVarsValuesText}</h5></ControlLabel><br />
          {reqVarsValuesComponent}
        </FormGroup>
      </Col>
    );
    return (
      <FormGroup>
        <Row>
          <Col xs={12}>
          <Col xs={4}>
            {enableTrigger}
            <FormGroup>
              <ControlLabel><h5>Select Primary Key</h5></ControlLabel>
              <FormControl componentClass="select" placeholder="select" title="PrimaryKey" name="PrimaryKey" onChange={this.updatePrimaryKeys.bind(this)}>
                {normalised_schema_list}
              </FormControl>
            </FormGroup>
            <FormGroup>
              <ControlLabel><h5>Created/Updated Timestamps</h5></ControlLabel><br/>
              <Radio name="radioGroup" value="Current Timestamp" inline onClick={this.onChange.bind(this)} defaultChecked={this.props.store.configJson['TimestampFrom']?(this.props.store.configJson['TimestampFrom'] === 'Current Timestamp')? true : false:true}>Current Timestamp</Radio>
              <Radio name="radioGroup" value="Schema Timestamp" inline onClick={this.onChange.bind(this)} checked={(this.props.store.configJson['TimestampFrom'] === 'Schema Timestamp')? true : false}>Select Timestamp Key</Radio>
              <div hidden={this.state.hideDropDown}>
                <Col xs={6}>
                  <ControlLabel><h5>Created At</h5></ControlLabel><br/>
                <FormControl componentClass="select" placeholder="select" title="Timestamp" name="CreatedAtDataProvider" onChange={this.updatePrimaryKeys.bind(this)}>
                  {normalised_schema_list_for_created_at}
                </FormControl>
              </Col>
                <Col xs={6}>
                  <ControlLabel><h5>Updated At</h5></ControlLabel><br/>
                <FormControl componentClass="select" placeholder="select" title="Timestamp" name="UpdatedAtDataProvider" onChange={this.updatePrimaryKeys.bind(this)}>
                  {normalised_schema_list_for_updated_at}
                </FormControl>
              </Col>
              </div>
            </FormGroup>
            {flexMediaTypeSelection}
          </Col>
            <Col xs={4} xsOffset={2}>
              {flexApiSelection}
            </Col>
          <Col xs={6} xsOffset={2} style={{marginTop: '-12px'}}>
            {request_vars_values_comp}
            {request_vars_comp}
          </Col>
            </Col>
        </Row>
        <Row>

        </Row>
      </FormGroup>
    )
  }
}

UniqKeys.propTypes = {
  store: React.PropTypes.object
};

export default UniqKeys;
