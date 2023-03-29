/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Row, Tabs, Tab, ListGroupItem, ListGroup, ControlLabel } from 'react-bootstrap';
import ModalInstance from '../../static/layout/modalinstance';
import AlertInstance from '../../static/layout/alertinstance';
import SoapClientStore from '../../../stores/SoapClientStore';
import CDEEBussinessRulesStore from '../../../stores/CDEEBussinessRulesStore';
import ShowWsdls from './components/show_wsdls';
import SchemaEdit from '../GenericComponents/schema/edit';
import Navigator from '../GenericComponents/navigator';
import GenericStatusMessage from '../GenericComponents/generic_status_component';
import UniqKeys from '../GenericComponents/schema/objectTransformations/uniq_keys';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import TypeManagerStore from '../../../stores/TypeManagerStore';
import ScriptFilters from '../GenericComponents/schema/transformationRules/script_filters';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';

@inject('breadcrumb_store', 'modal_store', 'generic_master_store')

@observer
class SoapClientThingEdit extends React.Component {
  constructor(props) {
    super(props);
    this.client_store = new SoapClientStore(this.props.match.params.name)
    this.type_manager_store = new TypeManagerStore('TypeManagerConfig');
    this.brs = new CDEEBussinessRulesStore();
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.generic_master_store = this.props.generic_master_store;
    this.state = {
      service_name: '',
      custom_path: '',
      selected_wsdl: '',
      schema: {},
      style: '',
      schema: false
    };
  }

  componentWillMount() {
    this.client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName?this.props.generic_master_store.currentGroupName:this.props.match.params.name.split('-')[0]);
    this.client_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.client_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID ? this.props.generic_master_store.tenantID : '');
    this.brs.setvalue('groupName', this.client_store.currentGroupName);
    this.brs.setvalue('groupType', this.client_store.currentGroupType);
    this.brs.setvalue('configName', this.props.match.params.name);
    this.client_store.GetHostProperties;
    this.client_store.GetWSDLS;
    this.client_store.GetBasicConfigInfo(this.updateInputWsdl.bind(this), this.createAlert.bind(this));
      if (this.props.match.params.name.indexOf('-') !== -1) {
        var brd_name = this.props.match.params.name.split('-')[1];
    }else{
        brd_name = this.props.match.params.name;
    }
    var PageName = 'Edit:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.type_manager_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID ? this.props.generic_master_store.tenantID : '');
    this.type_manager_store.GetDataTypes;
  }

  createAlert() {
    if(this.modal_store.modal.notification === true) {
        var str = this.props.match.params.name;
        str = /-(.+)/.exec(str)[1]
        NotificationManager.success( 'Created ' + str  + ' Config Successfully', 'Success', 1000);
        this.modal_store.modal.notification = false;
    }
  }
  onChange(event) {
    this.setState({ selected_wsdl: event.target.name });
  }

  onSelect(event) {
    this.brs.setvalue('currentTenantID', this.props.generic_master_store.tenantID ? this.props.generic_master_store.tenantID : '');
    if (event === 'selectservice') {
      if (this.client_store.GroupWsdls['uploadedWSDLS'] !== undefined && this.client_store.GroupWsdls['uploadedWSDLS'][this.client_store.SelectedWsdl]!==undefined){
        this.brs.InputWSDL = this.client_store.GroupWsdls['uploadedWSDLS'][this.client_store.SelectedWsdl]['data']
        this.brs.getWSDLMetaInfo();
      }
    }
  }
  updateServiceName(wsObj) {
    this.brs.InputWSDLServiceName = wsObj.OperationName;
    this.brs.InputWSDLElementName = wsObj.InputElementName;
    this.brs.OutputWSDLElementName = wsObj.OutputElementName;
    this.brs.InputWSDLEndPointUrl = wsObj.EndPointUrl;
    if (wsObj.SoapAction === '') {
      this.brs.InputWSDLServiceSoapAction = '';
    } else this.brs.InputWSDLServiceSoapAction = wsObj.SoapAction;
    this.brs.InputWSDLServicePortBinding = wsObj.BindingName;
    if (this.props.generic_master_store.groupType === 'source') {
      this.brs.GetXSDForSoapEndPoint('response', this.updateStoreSchema.bind(this));
    } else if (this.props.generic_master_store.groupType === 'target') {
      this.brs.GetXSDForSoapEndPoint('request', this.updateStoreSchema.bind(this));
    } else {}
  }

  updateStoreSchema() {
    this.client_store.setvalue('outputSchema', this.brs.responseXSD2Json);
    //calling request type also to get playload request variables
    this.brs.GetXSDForSoapEndPoint('request', this.updateRequestVars.bind(this));
    this.client_store.setvalue('inputSchema', this.brs.requestXSD2Json);
  }

  updateRequestVars(){
    var RequestJson = this.brs.requestXSD2Json;
    var norm_schema = {};
    if (RequestJson !== undefined) {
      norm_schema = this.generic_master_store.getObj(RequestJson,'SoapSchema');
    }
    var temp_rv = this.client_store.RequestVariables?this.client_store.RequestVariables:{};
    var temp_norm_schema = {};
    for(var key in norm_schema){
      temp_norm_schema[key.replace('.schema.','')] = temp_rv[key.replace('.schema.','')]?temp_rv[key.replace('.schema.','')]:'';
    }
    temp_rv = temp_norm_schema;
    this.client_store.setvalue('RequestVariables', temp_rv);

    var temp_config = this.client_store.configJson;
    temp_config['RequestVariables'] = temp_rv;
    this.client_store.setvalue('configJson', temp_config);
  }

  updateInputWsdl() {
    if (this.client_store.GroupWsdls['uploadedWSDLS'] !== undefined && this.client_store.GroupWsdls['uploadedWSDLS'][this.client_store.SelectedWsdl] !== undefined) {
      this.brs.InputWSDL = this.client_store.GroupWsdls['uploadedWSDLS'][this.client_store.SelectedWsdl]['data'] //existing_wsdl_data;
    }
    if (this.props.generic_master_store.groupType === 'source') {
      this.brs.responseXSD2Json = this.client_store.outputSchema;
      this.brs.responseXSD2Json = this.client_store.configJson['SelectedResponseSchema'];
      this.brs.requestXSD2Json = this.client_store.configJson['SelectedRequestSchema'];
      this.setState({ schema: this.client_store.outputSchema });
    } else if (this.props.generic_master_store.groupType === 'target') {
      this.brs.responseXSD2Json = this.client_store.configJson['SelectedResponseSchema'];
      this.brs.requestXSD2Json = this.client_store.inputSchema;
      this.setState({ schema: this.client_store.inputSchema });
    } else {}
    this.brs.requestXSDFromSoapEndPoint = this.client_store.configJson['SelectedRequestServiceXSD'];
    this.brs.responseXSDFromSoapEndPoint = this.client_store.configJson['SelectedResponseServiceXSD'];
    this.brs.InputWSDLServiceName = this.client_store.configJson['SelectedService'];
    this.brs.InputWSDLElementName = this.client_store.configJson['SelectedInputElement'];
    this.brs.OutputWSDLElementName = this.client_store.configJson['SelectedOutputElement'];
    this.brs.InputWSDLEndPointUrl = this.client_store.configJson['SelectedEndPointUrl'];
    this.brs.InputWSDLServicePortBinding = this.client_store.configJson['SelectedPortBinding'];
    this.brs.InputWSDLServiceSoapAction = this.client_store.configJson['SelectedSoapAction'];
    this.client_store.SelectedWsdl = this.client_store.configJson['SelectedWsdl'];
    this.updateRequestVars();
  }
  handleSubmit(event) {
    this.brs.getWSDLMetaInfo();
    this.setState({ service_name: 'UpdateConfigJson', custom_path: this.props.match.url });
    this.modal_store.modal.modal_title = 'Update ' + this.client_store.name + ' Config';
    this.modal_store.showModal(
      <p>Are you sure you want to update: {this.client_store.name}  Config</p>);
    event.preventDefault();
  }

  deleteConfig() {
    this.setState({ service_name: 'Delete', custom_path: '/SoapClient' });
    this.modal_store.modal.modal_title = 'Delete ' + this.client_store.name + ' Config';
    this.modal_store.showModal(
      <p>Are you sure you want to delete : {this.client_store.name}  Config</p>);
  }

  updateTreeData(scripts){
    var temp = this.client_store.configJson;
    temp['TransformationRules']=scripts;
    this.client_store.setvalue('configJson', temp);
  }

  saveSelections() {
    if (this.client_store.SelectedWsdl === undefined) {
        NotificationManager.warning('Please Select Wsdl and ServiceElement', 'Warning', 2000);
    } else if (this.brs.InputWSDLServiceName === undefined) {
        NotificationManager.warning('Only one service allowing to select', 'Warning', 1000);
    } else {
      var tempSchema; // eslint-disable-line no-unused-vars
      if (this.client_store.SelectedWsdl !== this.client_store.previousSelectedWsdl  && this.client_store.previousSelectedWsdl !== '') {
        //current selected wsdl and preious selected wsdls are not same so empty all the properties related to previous wsdl
        if (this.brs.InputWSDLServiceName === '' || this.brs.InputWSDLServiceName === undefined) {
          this.client_store.configJson['SelectedWsdl'] = this.client_store.SelectedWsdl;
          this.client_store.configJson['SelectedService'] = '';
          this.client_store.configJson['SelectedInputElement'] = '';
          this.client_store.configJson['SelectedOutputElement'] = '';
          this.client_store.configJson['SelectedEndPointUrl'] = '';
          this.client_store.configJson['SelectedRequestServiceXSD'] = '';
          this.client_store.configJson['SelectedResponseServiceXSD'] = '';
          this.client_store.configJson['SelectedResponseSchema'] = {};
          this.client_store.configJson['SelectedRequestSchema'] = {};
          this.client_store.configJson['SelectedSoapAction'] = '';
          this.client_store.configJson['SelectedPortBinding'] = '';
          this.client_store.configJson['PrimaryKey'] = '';
          this.brs.requestXSDFromSoapEndPoint = this.client_store.configJson['SelectedRequestServiceXSD'];
          this.brs.responseXSDFromSoapEndPoint = this.client_store.configJson['SelectedResponseServiceXSD'];
          this.brs.InputWSDLServiceName = this.client_store.configJson['SelectedService'];
          this.brs.InputWSDLElementName = this.client_store.configJson['SelectedInputElement'];
          this.brs.OutputWSDLElementName = this.client_store.configJson['SelectedOutputElement'];
          this.brs.InputWSDLEndPointUrl = this.client_store.configJson['SelectedEndPointUrl'];
          this.brs.InputWSDLServicePortBinding = this.client_store.configJson['SelectedPortBinding'];
          this.brs.InputWSDLServiceSoapAction = this.client_store.configJson['SelectedSoapAction'];
          this.brs.responseXSD2Json = this.client_store.configJson['SelectedResponseSchema'];
          this.brs.requestXSD2Json = this.client_store.configJson['SelectedRequestSchema'];
          this.client_store.inputSchema = this.client_store.configJson['SelectedRequestSchema'];
          this.client_store.outputSchema = this.client_store.configJson['SelectedResponseSchema'];
          tempSchema = {};
          this.client_store.setvalue('Schema', {});
          this.client_store.setvalue('inputSchema', {});
          this.client_store.setvalue('outputSchema', {});
        } else { // save the new selected wsdl data if the selected service name is not empty
          tempSchema = this.returnSoapSchema();
          this.updateStoreConfigJson();
        }
        this.client_store.setvalue('previousSelectedWsdl', '');

      } else {
        tempSchema = this.returnSoapSchema();
        if (this.brs.InputWSDLServiceName === '' || this.brs.InputWSDLServiceName === undefined) {
          tempSchema = {};
          this.brs.setvalue('responseXSD2Json', {});
          this.brs.setvalue('requestXSD2Json', {});
          this.client_store.setvalue('Schema', {});
          this.client_store.setvalue('inputSchema', {});
          this.client_store.setvalue('outputSchema', {});
        }
        this.updateStoreConfigJson();
      }
      this.client_store.SetPropValues({ inputSchema: this.client_store.inputSchema, outputSchema: this.client_store.outputSchema, ConfigJson: this.client_store.configJson });
      NotificationManager.success('Schema Saved Successfully', 'Success', 1000);
    }
  }
  updateStoreConfigJson() {
    var pk = '';
    var configObj = this.client_store.configJson;
    var tempSchema = this.returnSoapSchema();
    pk = this.props.generic_master_store.returnPrimaryKey(tempSchema, configObj);
    configObj['PrimaryKey'] = pk;
    configObj['SelectedService'] = this.brs.InputWSDLServiceName;
    configObj['SelectedInputElement'] = this.brs.InputWSDLElementName;
    configObj['SelectedOutputElement'] = this.brs.OutputWSDLElementName;
    configObj['SelectedEndPointUrl'] = this.brs.InputWSDLEndPointUrl;
    configObj['SelectedRequestServiceXSD'] = this.brs.requestXSDFromSoapEndPoint;
    configObj['SelectedResponseServiceXSD'] = this.brs.responseXSDFromSoapEndPoint;
    configObj['SelectedResponseSchema'] = this.brs.responseXSD2Json;
    configObj['SelectedRequestSchema'] = this.brs.requestXSD2Json;
    configObj['SelectedWsdl'] = this.client_store.SelectedWsdl;
    configObj['SelectedSoapAction'] = this.brs.InputWSDLServiceSoapAction;
    configObj['SelectedPortBinding'] = this.brs.InputWSDLServicePortBinding;
    configObj['RequestVariables'] = this.client_store.RequestVariables;
    this.client_store.setvalue('configJson', configObj);
  }
  returnSoapSchema() { // return the schema based on groupType(source or target) value
    var tempSchema = {} ;
    if (this.props.generic_master_store.groupType === 'source') {
      tempSchema = this.brs.responseXSD2Json;
    } else if (this.props.generic_master_store.groupType === 'target') {
      tempSchema = this.brs.requestXSD2Json;
    } else {
    }
    return tempSchema;
  }
  render() {
    var codeOptions = {
      lineNumbers: false,
      mode: 'xml',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    var codeJsonOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    }
    var serviceNames = [];
    if (this.brs.wsdlMetaInfo.length !== 0) {
      this.brs.wsdlMetaInfo.map(ws => {
        serviceNames.push(
          <Col key={ws.OperationName + '-' + ws.BindingName} xs={12} sm={6} md={6} lg={4}>
            <ListGroup key={ws.OperationName}>
              <ListGroupItem
                key={ws.OperationName + '-' + ws.BindingName}
                name={ws.OperationName + '-' + ws.BindingName}
                href="" className="SortableItem"
                onClick={this.updateServiceName.bind(this, ws)}
                active={(this.brs.InputWSDLServiceName === ws.OperationName && ws.BindingName === this.brs.InputWSDLServicePortBinding)}>
              {ws.OperationName + '-' + ws.BindingProtocol}
              </ListGroupItem>
            </ListGroup>
          </Col>
          );
      });
    }
    var show_wsdl = 'Loading....';                            //added changes for bug 269
    if(this.client_store.GroupWsdls['uploadedWSDLS']){
      show_wsdl  =  (<ShowWsdls soap_client_store={this.client_store} breadcrumb_store={this.breadcrumb_store} brs={this.brs} />);
    }
    var schema_edit = 'Loading....';
    var schema_uniq_keys = 'Loading....';
    var tempSchema = this.returnSoapSchema();
    if (tempSchema) {
      schema_edit = <SchemaEdit schema={tempSchema} master={this} brs={this.brs} />
      schema_uniq_keys = <UniqKeys schema={tempSchema} master={this} store={this.client_store} />
    }
    var tempXSD;
    if (this.props.generic_master_store.groupType === 'source') {
      tempXSD = this.brs.responseXSDFromSoapEndPoint;
    } else if (this.props.generic_master_store.groupType === 'target') {
      tempXSD = this.brs.requestXSDFromSoapEndPoint;
    } else {}

    var target_scripts_tab = '';
    if(this.client_store.currentGroupType==='target'){
      target_scripts_tab = (
        <Tab className="tab-height" tabClassName="arrowshapetab" eventKey={'scripts'} title="Scripts">
          <Col xs={6} sm={6} md={6} lg={6}>
            <ControlLabel>Pre Script</ControlLabel>
          <ScriptFilters
            source_key="host"
            destination_key="client"
            snode={this.client_store.configJson}
            master={this}
            type_manager_store={this.type_manager_store}
            from="TargetScripts"
            prop_key="PreTransformationRules"
          />
        </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <ControlLabel>Post Script</ControlLabel>
          <ScriptFilters
            source_key="host"
            destination_key="client"
            snode={this.client_store.configJson}
            master={this}
            type_manager_store={this.type_manager_store}
            from="TargetScripts"
            prop_key="TransformationRules"
          />
        </Col>
        </Tab>
      )
    }else{
      target_scripts_tab = (
        <Tab className="tab-height" tabClassName="arrowshapetab" eventKey={'scripts'} title="Scripts">
          <Col xs={6} sm={6} md={6} lg={6}>
            <ControlLabel>Pre Script</ControlLabel>
          <ScriptFilters
            source_key="host"
            destination_key="client"
            snode={this.client_store.configJson}
            master={this}
            type_manager_store={this.type_manager_store}
            from="TargetScripts"
            prop_key="PreTransformationRules"
          />
        </Col>
        </Tab>
      )
    }
    return (
      <div>
        <Col xs={8} xsOffset={2}>
          <AlertInstance modal_store={this.modal_store} />
        </Col>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Edit'} type={'/SoapClient'} tempStore={this.client_store} delete={this.deleteConfig.bind(this)} save={this.saveSelections.bind(this)} source={'Thing'} />
            <Tabs defaultActiveKey={'selectwsdl'} id="uncontrolled-flex-edit-tab-example" onSelect={this.onSelect.bind(this)}>
              <Tab className="things-style" tabClassName="arrowshapetab" eventKey={'selectwsdl'} title="Select WSDL">
                  {show_wsdl}
              </Tab>
              <Tab className="things-style" tabClassName="arrowshapetab" eventKey={'selectservice'} disabled={this.client_store.SelectedWsdl === undefined} title="Select Service">
                {serviceNames}
                <div hidden={serviceNames.length !== 0}>
                  <GenericStatusMessage statusMsg={'There are no services for selected wsdl'} />
                </div>
              </Tab>
              <Tab className="things-style" tabClassName="arrowshapetab" eventKey={'wsdlschema'} title="Schema" disabled={this.brs.InputWSDLServiceName === undefined || this.brs.InputWSDLServiceName === ''}>
                <CodeMirror
                  value={tempXSD} options={codeOptions}
                />
                <CodeMirror
                  value={JSON.stringify(tempSchema ? tempSchema : {}, null, 2)}
                  options={codeJsonOptions}
                />
              </Tab>

              <Tab className="things-style" tabClassName="arrowshapetab" eventKey={'editSchema'} title="Attribute Schema" disabled={(this.brs.InputWSDLServicePortBinding === undefined) || this.brs.InputWSDLServiceName === '' }>
                {schema_edit}
              </Tab>

              <Tab className="" tabClassName="arrowshapetab" eventKey={'objectTransformations'} title="Object Transformations" disabled={(this.brs.InputWSDLServicePortBinding === undefined) || this.brs.InputWSDLServiceName === '' }>
                {schema_uniq_keys}
              </Tab>

              {target_scripts_tab}
            </Tabs>
          </Row>
        </Col>
        <NotificationContainer/>
        <ModalInstance
          custom_store={this.client_store} custom_path={this.state.custom_path}
          custom_history={this.props.history} service_name={this.state.service_name}
        />
      </div>
    );
  }
}

SoapClientThingEdit.propTypes = {
  store: React.PropTypes.object
};

export default SoapClientThingEdit;
