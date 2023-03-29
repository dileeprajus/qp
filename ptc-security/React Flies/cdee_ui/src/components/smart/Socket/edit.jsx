/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Col, FormGroup, FormControl, Button, Row, Tabs, Tab, Tooltip, OverlayTrigger, Panel } from 'react-bootstrap';
import { NotificationManager } from 'react-notifications';
import CodeMirror from 'react-codemirror';
import SocketStore from '../../../stores/SocketStore';
import SchemaEdit from '../GenericComponents/schema/edit';
import Navigator from '../GenericComponents/navigator';
import UniqKeys from '../GenericComponents/schema/objectTransformations/uniq_keys';
import TypeManagerStore from '../../../stores/TypeManagerStore';
import ScriptFilters from '../GenericComponents/schema/transformationRules/script_filters';
import { RIEInput, RIESelect } from 'riek';
import _ from 'lodash';

@inject('breadcrumb_store', 'modal_store', 'validation_store', 'generic_master_store')
@observer
class SocketConfigEdit extends React.Component {
  constructor(props) {
    super(props);
    this.client_store = new SocketStore(this.props.match.params.name);
    this.type_manager_store = new TypeManagerStore('TypeManagerConfig');
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.flex_object_list = [];
    this.state = {
      service_name: '',
      custom_path: '',
      tab_eventkey: 1,
      tabs_length: 4,
      schema: false,
      panelHideShow:false
    };
  }

  componentWillMount() {
    this.client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName?this.props.generic_master_store.currentGroupName:this.props.match.params.name.split('-')[0]);
    this.client_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.client_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    if (this.props.match.params.name.indexOf('-') !== -1) {
      var brd_name = this.props.match.params.name.split('-')[1];
    } else {
      brd_name = this.props.match.params.name;
    }
    var PageName = 'Edit:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.client_store.getGroupHostProperties();
    this.client_store.GetBasicConfigInfo(this.createAlert.bind(this), this.setStateSchema.bind(this));
    this.type_manager_store.GetDataTypes;
  }

  showAlert = (msg) => {
    this.msg.show(msg, {
      type: 'error'
    })
  }
  alertOptions = {
    offset: 140,
    position: 'top left',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
  }
  createAlert() {
    if (this.modal_store.modal.notification === true) {
      NotificationManager.success('Created ' + this.client_store.name + ' Config &  Updated HostProperties Succesfully', 'Success', 2000);
      this.modal_store.modal.notification = false;
    }
  }
  setStateSchema() {
    if (this.client_store.currentGroupType === 'source') {
      this.setState({ schema: this.client_store.outputSchema });
    } else if (this.client_store.currentGroupType === 'target') {
      this.setState({ schema: this.client_store.inputSchema });
    }
  }
  onChange(event) {
      var temp_sourceConfig = this.client_store.configJson;
      if(event.target.name === 'eventName') {
          temp_sourceConfig.eventName = event.target.value;
      }else if(event.target.name === 'eventPayload') {
          temp_sourceConfig.eventPayload = event.target.value;
          var temp_json = this.client_store.extractRequestVariablesConfig(event.target.value);
          var temp_request_variables = this.client_store.RequestVariablesConfig;
          temp_request_variables=temp_json;
          this.client_store.setvalue('RequestVariablesConfig', temp_request_variables);
          temp_sourceConfig['RequestVariablesConfig']=temp_request_variables
      }else {
          temp_sourceConfig.current_data_format = event.target.value;
      }
      this.client_store.currentGroupName = this.props.generic_master_store.currentGroupName;
      this.client_store.setvalue('configJson', temp_sourceConfig);
  }
  updateEnum(key,event){
    var temp = this.client_store.RequestVariablesConfig
    if(temp[key]===undefined || temp[key]===''){
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

  updateRequestVariables(key,event){
    var temp = this.client_store.RequestVariables
    temp[key]=event[key];
    var temp_rv = {}
    temp_rv = temp
    this.client_store.setvalue('RequestVariables', temp_rv);
    var temp_confg = this.client_store.configJson;
    temp_confg['RequestVariables']=temp_rv;
    this.client_store.setvalue('configJson', temp_confg);
  }
  handleSubmit(event) {
    this.setState({ service_name: 'SetHostProperties', custom_path: '/Socket/Show/' });
    this.modal_store.modal.modal_title = 'Update ' + this.client_store.name + ' Config';
    this.modal_store.showModal(<p>Are you sure you want to update: {this.client_store.name} Config</p>);
    event.preventDefault();
  }
  deleteConfig() {
    this.setState({ service_name: 'Delete', custom_path: '/Socket' });
    this.modal_store.modal.modal_title = 'Delete ' + this.client_store.name + ' Config';
    this.modal_store.showModal(
      <p>Are you sure you want to delete : {this.client_store.name}  Thing</p>);
  }
  saveSocketSchema() {
    var tempSchema = {};
    var pk = '';
    if (this.client_store.currentGroupType === 'source') {
      tempSchema = this.client_store.outputSchema;
    } else if (this.client_store.currentGroupType === 'target') {
      tempSchema = this.client_store.inputSchema;
    }
    pk = this.props.generic_master_store.returnPrimaryKey(tempSchema, this.client_store.configJson);
    var socketConfig = this.client_store.configJson;
    socketConfig['PrimaryKey'] = pk;
    this.client_store.setvalue('configJson', socketConfig);
    this.client_store.SetPropValues({ outputSchema: this.client_store.outputSchema, inputSchema: this.client_store.inputSchema, ConfigJson: socketConfig });
    NotificationManager.success('Schema Saved Successfully', 'Success', 1000);
  }

  updateTreeData(scripts){
    var temp = this.client_store.configJson;
    temp['TransformationRules'] = scripts;
    this.client_store.setvalue('configJson', temp);
  }

  onTestClick() {
      this.client_store.testApi();
  }

  updateData(datatype) {
      if (this.client_store.currentGroupType === 'source') {
          this.client_store.setvalue('SourceData', JSON.parse(datatype));
      } else if (this.client_store.currentGroupType === 'target') {
          this.client_store.setvalue('TargetData', JSON.parse(datatype));
      }
  }

  fetchSchema() {
      this.client_store.fetchSchemaFromData();
  }

  returnList(optionsArr) {
      var list = [];
      for (var i = 0; i < optionsArr.length; i++) {
          list.push(
              <option key={optionsArr[i]} value={optionsArr[i]}>{optionsArr[i]}</option>
          );
      }
      return list;
  }
  panelExpand() {
      this.setState({'panelHideShow': !this.state.panelHideShow});
  }

  render() {
    var schema_tooltip = (<Tooltip id="tooltip-upload-config"><strong>Fetch schema from data</strong></Tooltip>);
    var host_prop_field_names = [];
    for (var attr in this.client_store.HostProperties) {
      host_prop_field_names.push(
        <FormGroup key={attr + 'hostprops'}>
          <ControlLabel>{attr}</ControlLabel>
          <FormControl
            type="text" placeholder="" name={attr} value={this.client_store.HostProperties[attr]}
            onChange={this.onChange.bind(this)}
          />
        </FormGroup>
      );
    }
      var schemaEdit = '';
      var schemaUniqKeys = '';
      schemaEdit = (<SchemaEdit schema={this.state.schema} master={this} store={this.client_store}/>)
      schemaUniqKeys = (<UniqKeys schema={this.state.schema} master={this} store={this.client_store}/>)

    var targetScriptsTab = '';
    if (this.client_store.currentGroupType === 'target') {
      targetScriptsTab = (
        <Tab className="tab-height" tabClassName="arrowshapetab" eventKey={4} title="Scripts">
          <ScriptFilters
            source_key="host"
            destination_key="client"
            snode={this.client_store.configJson}
            master={this}
            type_manager_store={this.type_manager_store}
            from="TargetScripts"
            prop_key="TransformationRules"
          />
        </Tab>
      )
    }
    var request_vars_codeOptions = {
        lineNumbers: false,
        mode: 'javascript',
        theme: 'dracula',
        smartIndent:true,
        readOnly: false
    };
    const codeOptions = {
        lineNumbers: false,
        mode: 'javascript',
        theme: 'dracula',
        smartIndent:true,
        readOnly: false
    };
    var optionsArr = ['JSON', 'STRING', 'STREAM', 'XML'];
    var list = this.returnList(optionsArr);

    var tempSchema = {};
    if (this.client_store.currentGroupType === 'source') {
        tempSchema = this.client_store.outputSchema;
    } else if (this.client_store.currentGroupType === 'target') {
        tempSchema = this.client_store.inputSchema;
    }
    var data = {};
    if (this.client_store.currentGroupType === 'source') {
        data = this.client_store.SourceData;
    } else if (this.client_store.currentGroupType === 'target') {
        data = this.client_store.TargetData
    }

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
    for(var key in rvs){
        var request_vars_sub_form = []
        request_vars_sub_form.push(<div className="ReqValueID"><ControlLabel style={{color:'deeppink'}}><h5>{key}: </h5></ControlLabel>,
        <RIEInput
          value={rv_values[key] || 'please enter value here'}
          change={this.updateRequestVariables.bind(this,key)}
          propName={key}
          validate={_.isString}
        /></div>
        );
        var enum_val = {}
        if(rvs[key]!==undefined){
          enum_val = rvs[key]['enum']
        }
        request_vars_sub_form.push(
          <FormGroup key={'enum'+key}>
            <ControlLabel style={{color:'white'}}>enum : </ControlLabel>
            <div className="JSONEditor">
            <CodeMirror
              value={JSON.stringify(enum_val, null, 2)}
              options={request_vars_codeOptions}
              onChange={this.updateEnum.bind(this,key)}
            />
          </div>
          </FormGroup>);
          request_vars_sub_form.push(
            <FormGroup key={'dataType'+key}>
              <ControlLabel style={{color:'white'}}>dataType : </ControlLabel>
              <RIESelect
                value={{
                  id: rvs[key]===undefined?'':rvs[key]['dataType'] || '',
                  text: rvs[key]===undefined?'':rvs[key]['dataType'] || 'Select datatype'
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
                <ControlLabel style={{color:'white'}}>dataFormat : </ControlLabel>
                <RIEInput
                  value={rvs[key]===undefined?'':rvs[key]['dataFormat'] || 'please enter value here'}
                  change={this.updateRequestVariablesConfig.bind(this,key)}
                  propName="dataFormat"
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
                  <RIEInput
                    value={rvs[key]===undefined?'':rvs[key]['modeOfInput'] || 'please enter value here'}
                    change={this.updateRequestVariablesConfig.bind(this,key)}
                    propName="modeOfInput"
                    validate={_.isString}
                  />
                </FormGroup>);
              request_vars_form.push(request_vars_sub_form)
    }


    return (
      <div>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Edit'} type={'/Socket'} tempStore={this.client_store} delete={this.deleteConfig.bind(this)} save={this.saveSocketSchema.bind(this)} source={'Thing'} />
            <Tabs className="" defaultActiveKey={1} id="uncontrolled-rest-edit-tab-example">
              <Tab tabClassName="arrowshapetab" eventKey={1} title="Config">
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Panel className="navtab">
                    <Col xs={12}>
                      <h4>Socket Information</h4>
                        <form>
                          <Row>
                          <Col xs={6}>
                            <ControlLabel>Event Name: </ControlLabel>
                            <FormGroup>
                              <FormControl type="text" placeholder="Event Name" name="eventName" value={this.client_store.configJson.eventName} onChange={this.onChange.bind(this)} required/>
                            </FormGroup>
                            <ControlLabel>Event Payload: </ControlLabel>
                            <FormGroup>
                              <FormControl componentClass="textarea" style={{ resize: 'none' }} placeholder="Event Payload" name="eventPayload" value={this.client_store.configJson.eventPayload}
                                           onChange={this.onChange.bind(this)} rows="6"/>
                            </FormGroup>
                            <ControlLabel>Current Data Format:</ControlLabel>
                            <FormGroup controlId="formControlsSelect">
                              <FormControl componentClass="select" placeholder="Current Data Format" name="current_data_format"
                                           onChange={this.onChange.bind(this)} value={this.client_store.configJson.current_data_format}>
                                <option value="Current Data Format">Current Data Format</option>
                                  {list}
                              </FormControl>
                            </FormGroup>
                          </Col>
                          <Col xs={6}>
                            <Panel>
                              <h4>Socket Configuration</h4>
                              <h6>Url : </h6><b>{String(this.client_store.groupHostProperties.url)}</b>
                              <h6>Port: </h6><b>{String(this.client_store.groupHostProperties.port)}</b>
                              <h6>Source Type : </h6><b>{String(this.client_store.groupHostProperties.sourceType)}</b>
                              <h6>Options : </h6><b>{String(this.client_store.groupHostProperties.options)}</b>
                              <h6>Input Data : </h6>
                              <Panel header="Input Data" collapsible expanded={this.state.panelHideShow}  onClick={this.panelExpand.bind(this)}>
                                <CodeMirror id="socket_host_info_json-pretty" value={this.client_store.groupHostProperties.inputData} options={codeOptions} />
                              </Panel>
                            </Panel>
                          </Col>
                          </Row>
                        </form>
                      </Col>
                      <Col xs={12} id="socket_test_schema_json-pretty" style={{ backgroundColor: '#282A36' }}>
                        <Col xs={4} sm={4} md={4} lg={4} >
                          <ControlLabel><h6><font color="darkturquoise"><b>Variables</b></font></h6></ControlLabel>
                          <i className="fa fa-flask" onClick={this.onTestClick.bind(this)} style={{paddingLeft: '15px',color: 'white', cursor: 'pointer'}}></i>
                          <Col xs={12} className="ReqValueID">
                            {request_vars_form}
                          </Col>
                        </Col>

                        <Col xs={4} sm={4} md={4} lg={4} >
                          <ControlLabel><h6><font color="darkturquoise"><b>Data</b></font></h6></ControlLabel>
                          <CodeMirror id="socket_test_schemaview_json-pretty" value={JSON.stringify(data, null, 2)} options={codeOptions}
                                      onChange={this.updateData.bind(this)}
                          />
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4} >
                          <ControlLabel><h6><font color="darkturquoise"><b>Schema:  </b></font></h6></ControlLabel>
                          <OverlayTrigger placement="left" overlay={schema_tooltip}>
                            <Button bsSize="xsmall" bsStyle="info"  onClick={this.fetchSchema.bind(this)}><i className="fa fa-refresh"></i></Button>
                          </OverlayTrigger>
                          <CodeMirror id="socket_fetchschema_json-pretty" value={JSON.stringify(tempSchema, null, 2)} options={codeOptions} />
                        </Col>
                      </Col>
                    </Panel>
                </Col>
              </Tab>
              <Tab className="tab-height" tabClassName="arrowshapetab" eventKey={2} title="Attribute Schema">
                  {schemaEdit}
              </Tab>
              <Tab className="tab-height" tabClassName="arrowshapetab" eventKey={3} title="Object Transformations">
                  {schemaUniqKeys}
              </Tab>
                {targetScriptsTab}
            </Tabs>
          </Row>
        </Col>
      </div>
    );
  }
}

SocketConfigEdit.propTypes = {
  store: React.PropTypes.object
};

export default SocketConfigEdit;
