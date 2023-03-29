/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Tabs, Tab, ControlLabel } from 'react-bootstrap';
import RestClientStore from '../../../stores/RestClientStore';
import TypeManagerStore from '../../../stores/TypeManagerStore';
import MasterRestComponent from './components/master_rest_component';
import AlertInstance from '../../static/layout/alertinstance';
import SchemaEdit from '../GenericComponents/schema/edit';
import Navigator from '../GenericComponents/navigator';
import UniqKeys from '../GenericComponents/schema/objectTransformations/uniq_keys';
import ScriptFilters from '../GenericComponents/schema/transformationRules/script_filters';
import {NotificationContainer, NotificationManager} from 'react-notifications';

@inject('breadcrumb_store', 'modal_store', 'generic_master_store')
@observer
class RestClientThingEdit extends React.Component {
  constructor(props) {
    super(props);
    this.name =  this.props.match.params.name;
    this.client_store = new RestClientStore(this.name);
    this.type_manager_store = new TypeManagerStore('TypeManagerConfig');
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.generic_master_store = this.props.generic_master_store;
    this.modal_store = this.props.modal_store;
    this.state = {
      hideQueryParams: true,
      showFetchSchemaPanel: false,
      showTestPanel: false,
      schema: false
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
    this.client_store.GetConfigJson;
    this.client_store.GetBasicConfigInfo(this.updateSchema.bind(this), this.createAlert.bind(this), this.props.generic_master_store.tenantID);
    this.type_manager_store.GetDataTypes;
  }
  createAlert() {
    if (this.modal_store.modal.notification === true) {
      var str = this.name;
      str = /-(.+)/.exec(str)[1];
      NotificationManager.success('Created '+ str  + ' Config Successfully', 'Success', 1000);
      this.modal_store.modal.notification = false;
    }
  }
  updateSchema() {
    this.setStateSchema();
  }

  getStringifiedParsedSchema(schema) {
    var temp=JSON.parse(JSON.stringify(schema ? schema : {}));
    if (!Object.keys(temp).length) {
      temp = schema;
    }
    return temp;
  }
  setStateSchema() {
    if (this.client_store.currentGroupType === 'source') {
      this.setState({ schema: this.getStringifiedParsedSchema(this.client_store.outputSchema) });
    } else if (this.client_store.currentGroupType === 'target') {
      this.setState({ schema: this.getStringifiedParsedSchema(this.client_store.inputSchema) });
    }
  }

  saveRestConfig() {
    var tempConfig = this.client_store.configJson;
    var pk = '';
    let tempSchema = {};
    if (this.client_store.currentGroupType === 'source') {
      tempSchema = this.client_store.outputSchema;
    } else if (this.client_store.currentGroupType === 'target') {
      tempSchema = this.client_store.inputSchema;
    }
    NotificationManager.success('Schema Saved Successfully', 'Success', 1000);
    pk = this.props.generic_master_store.returnPrimaryKey(tempSchema, this.client_store.configJson);
    tempConfig['PrimaryKey'] = pk;
    this.client_store.setvalue('configJson', tempConfig);
    this.client_store.callSetPropValues(this.client_store.current_selected_source_type);
  }

  deleteConfig() {
    this.client_store.setvalue('current_service_name', 'Delete');
    this.client_store.setvalue('current_custom_path', '/RestClient');
    this.modal_store.modal.modal_title = 'Delete ' + this.client_store.name + ' Config';
    this.modal_store.showModal(
      <p>Are you sure you want to delete : {this.client_store.name} Config</p>);
  }

  updateTreeData(scripts,prop_key='TransformationRules'){
    var temp = this.client_store.configJson;
    temp[prop_key]=scripts;
    this.client_store.setvalue('configJson', temp);
  }

  render() {
    var schema_edit = 'Loading....'
    var schema_uniq_keys = 'Loading....';

    if(this.state.schema){
      schema_edit = <SchemaEdit schema={this.state.schema} master={this}/>
      schema_uniq_keys = <UniqKeys schema={this.state.schema} master={this} store={this.client_store}/>
    }

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
           <Navigator history={this.props.history} action={'Edit'} type={'/RestClient'} tempStore={this.client_store} delete={this.deleteConfig.bind(this)} save={this.saveRestConfig.bind(this)} source={'Thing'} />
        <Tabs className="" defaultActiveKey={1} id="uncontrolled-rest-edit-tab-example">
          <Tab tabClassName="arrowshapetab" eventKey={1} title="Config">
            <Col xs={12}>
              <h3 className="restedit-update">Update {this.name}</h3>
            </Col>

            <MasterRestComponent
              rest_client_store={this.client_store} sourceType="" history={this.props.history} thing_name={this.name}
            />
          </Tab>

          <Tab className = "tab-height" tabClassName="arrowshapetab" eventKey={'editSchema'} title="Attribute Schema">
              {schema_edit}
          </Tab>

          <Tab className = "tab-height" tabClassName="arrowshapetab" eventKey={'objectTransformations'} title="Object Transformations">
            {schema_uniq_keys}
          </Tab>

          {target_scripts_tab}
        <NotificationContainer/>
        </Tabs>
      </Row>
    </Col>
  </div>
    );
  }
}

RestClientThingEdit.propTypes = {
  store: React.PropTypes.object
};

export default RestClientThingEdit;
