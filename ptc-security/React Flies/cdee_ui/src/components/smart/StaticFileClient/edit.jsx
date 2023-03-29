/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Thumbnail, Col, FormGroup, FormControl, Button, Row, Radio, Tabs, Tab } from 'react-bootstrap'
import ModalInstance from '../../static/layout/modalinstance';
import StaticFileClientStore from '../../../stores/StaticFileClientStore';
import SchemaEdit from '../GenericComponents/schema/edit';
import Navigator from '../GenericComponents/navigator';
import AlertInstance from '../../static/layout/alertinstance';
import UniqKeys from '../GenericComponents/schema/objectTransformations/uniq_keys';
import ScriptFilters from '../GenericComponents/schema/transformationRules/script_filters';
import TypeManagerStore from '../../../stores/TypeManagerStore';
import MailTemplate from '../GenericComponents/mailTemplate';
import { NotificationManager } from 'react-notifications';

@inject('breadcrumb_store', 'modal_store', 'generic_master_store')
@observer
class StaticFileClientThingEdit extends React.Component {
  constructor(props) {
    super(props);
    this.client_store = new StaticFileClientStore(this.props.match.params.name);
    this.type_manager_store = new TypeManagerStore('TypeManagerConfig');
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.state = {
      service_name: '',
      custom_path: '',
      isDataFormatValid:false
    };
  }

  componentWillMount() {
    this.client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
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
    this.client_store.GetBasicConfigInfo();
  }

  onChange(event) {
      var bCObj = this.client_store.BasicConfigInfo;
      var file = document.getElementById('fileUploadForStatic').files[0];
      if(event.target.name === 'fileData') {
          if (file) {
            var fNameArry = file.name.split('.');
              var fName = fNameArry[fNameArry.length -1];
              if(fName.toUpperCase() === this.client_store.BasicConfigInfo.DataFormat) {
                  var reader = new FileReader();
                  reader.readAsText(file, 'UTF-8');
                  reader.onload = function (event) {
                    bCObj.Data = event.target.result;
                  }
              }else {
                  NotificationManager.warning('Please Select Exact Dataformat to Upload File', 'Success', 2000);
                  document.getElementById('fileUploadForStatic').value = '';
              }}
      }else {
        if(event.target.name === 'DataFormat') {
          if (event.target.value === this.client_store.dataType) {
            bCObj.Data = this.client_store.tempData;
          }else {
            document.getElementById('fileUploadForStatic').value = '';
            bCObj.Data = '';
          }
        }else if(event.target.name ==='Data'){

          
        }
        bCObj[event.target.name] = event.target.value;
      }
      this.client_store.setvalue('BasicConfigInfo', bCObj)
  }

  handleSubmit(event) {
    this.setState({ service_name: 'UpdateData', custom_path: '/StaticFileClient/Edit/' });
    this.modal_store.modal.modalBtnTxt = 'Update';
    this.modal_store.modal.modal_title = 'Update ' + this.client_store.BasicConfigInfo.Name + ' Config';
    this.modal_store.showModal(<p>Are you sure you want to update: {this.client_store.BasicConfigInfo.Name}  Config</p>);
    event.preventDefault();
  }
  deleteConfig() {
    this.setState({ service_name: 'Delete', custom_path: '/StaticFileClient' });
    this.modal_store.modal.modal_title = 'Delete ' + this.client_store.BasicConfigInfo.Name + ' Config';
    this.modal_store.showModal(<p>Are you sure you want to delete : {this.client_store.BasicConfigInfo.Name}  Config</p>);
  }
  showDelimeterInput() {
    if (this.client_store.BasicConfigInfo.DataFormat === 'CSV') {
      return false;
    } else {
      return true;
    }
  }
  returnCurrentSchema() {
    var tempSchema = {};
    if (this.client_store.currentGroupType === 'source') {
      tempSchema = this.client_store.outputSchema;
    } else if (this.client_store.currentGroupType === 'target') {
      tempSchema = this.client_store.inputSchema;
    }
    return tempSchema;
  }
  saveStaticConfig() {
    var tempConfig = this.client_store.configJson;
    var pk = '';
    let tempSchema = this.returnCurrentSchema();
    if (this.client_store.BasicConfigInfo.Data === '') {
      tempSchema = {};
      this.client_store.setvalue('outputSchema', {});
      this.client_store.setvalue('inputSchema', {});
    }
    pk = this.props.generic_master_store.returnPrimaryKey(tempSchema, this.client_store.configJson);
    tempConfig['PrimaryKey'] = pk;
    tempConfig['outputSchema'] = this.client_store.outputSchema ? this.client_store.outputSchema : {};
    this.client_store.setvalue('configJson', tempConfig);
    this.client_store.SetPropValues({
      DataContent: this.client_store.BasicConfigInfo.Data,
      CSVDelimeter: this.client_store.BasicConfigInfo.Delimeter,
      DataFormat: this.client_store.BasicConfigInfo.DataFormat,
      inputSchema: this.client_store.inputSchema,
      outputSchema: this.client_store.outputSchema,
      ConfigJson: this.client_store.configJson
    });
    this.client_store.dataType = this.client_store.BasicConfigInfo.DataFormat;
    this.client_store.tempData = this.client_store.BasicConfigInfo.Data;
    NotificationManager.success('Data and Schema Saved Successfully', 'Success', 1000);
  }
  updateTreeData(scripts) {
    var temp = this.client_store.configJson;
    temp['TransformationRules'] = scripts;
    this.client_store.setvalue('configJson', temp);
  }
  render() {
    var schemaEdit = 'Loading....';
    var schemaUniqKeys = 'Loading....';
    var tempSchema = this.returnCurrentSchema();
    if (tempSchema) {
      schemaEdit = <SchemaEdit schema={tempSchema} master={this} store={this.client_store} />
      schemaUniqKeys = <UniqKeys schema={tempSchema} master={this} store={this.client_store} />
    }

    var targetScriptsTab = '';
    if(this.client_store.currentGroupType==='target'){
      targetScriptsTab = (
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
      targetScriptsTab = (
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
    var events = '';
    if(BACKEND === 'LoopBack') {
        events = (
            <Tab className = "tab-height" tabClassName="arrowshapetab" eventKey={'events'} title="Events">
              <MailTemplate  client_store={this.client_store}/>
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
            <Navigator history={this.props.history} action={'Edit'} type={'/StaticFileClient'} tempStore={this.client_store} delete={this.deleteConfig.bind(this)} save={this.saveStaticConfig.bind(this)} source={'Thing'} />
            <Tabs className="" defaultActiveKey={1} id="uncontrolled-flex-edit-tab-example">
              <Tab className="" tabClassName="arrowshapetab" eventKey={1} title="1.Data">
                <Col xs={8} xsOffset={2}>
                  <h3>Update Schema Data</h3>
                  <Thumbnail>
                    <form onSubmit={this.handleSubmit}>
                      <FormGroup>
                        <FormControl type="text" placeholder="Name" name={this.client_store.BasicConfigInfo.Name} value={this.client_store.BasicConfigInfo.Name} disabled />
                      </FormGroup>
                      <FormGroup>
                        <FormControl componentClass="textarea" style={{ resize: 'none' }} placeholder="Description" name="Description" value={this.client_store.BasicConfigInfo.Description} onChange={this.onChange.bind(this)} disabled/>
                      </FormGroup>
                      <FormGroup className="raio-btn-form-group">
                        <div className="col-lg-6 col-md-6 col-sm-6 radio-btn-div">
                          <Radio name="DataFormat" value="JSON" onChange={this.onChange.bind(this)} inline checked={this.client_store.BasicConfigInfo.DataFormat==='JSON'}>JSON</Radio>
                          <Radio name="DataFormat" value="XML" onChange={this.onChange.bind(this)} inline checked={this.client_store.BasicConfigInfo.DataFormat==='XML'}>XML</Radio>
                          <Radio name="DataFormat" value="CSV" onChange={this.onChange.bind(this)} inline checked={this.client_store.BasicConfigInfo.DataFormat==='CSV'}>CSV</Radio>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 delimeter-div">
                          <p className="delimeter-para" hidden={this.showDelimeterInput()}>
                            <FormControl type="text" placeholder="Delimeter" name="Delimeter" value={this.client_store.BasicConfigInfo.Delimeter} onChange={this.onChange.bind(this)}/>
                          </p>
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <input type="file" id="fileUploadForStatic" name="fileData"
                            onChange={this.onChange.bind(this)}
                        />
                      </FormGroup>
                     
                      <FormGroup>
                        <ControlLabel hidden={this.showDelimeterInput()}>Note: Assuming the file contains Headers.</ControlLabel>
                        <FormControl rows="6" componentClass="textarea" style={{ resize: 'none' }} placeholder="File content goes here..." name="Data" value={this.client_store.BasicConfigInfo.Data} onChange={this.onChange.bind(this)} />
                      </FormGroup>
                      
                      <ControlLabel>Note:To use the data either upload a file or paste the file content in the text box </ControlLabel>
                      <Button
                        disabled={(this.client_store.BasicConfigInfo.Data === '') || (this.client_store.BasicConfigInfo.DataFormat === 'CSV' && this.client_store.BasicConfigInfo.Delimeter === '')}
                        bsStyle="primary"
                        onClick={this.handleSubmit.bind(this)} block
                      >Test Data</Button>
                      &nbsp;
                    </form>
                    &nbsp;
                  </Thumbnail>
                </Col>
              </Tab>
              <Tab className="" tabClassName="arrowshapetab" eventKey={3} title="2.Attribute Schema" >
                  {schemaEdit}
              </Tab>
              <Tab className="" tabClassName="arrowshapetab" eventKey={4} title="3.Object Transformations">
                {schemaUniqKeys}
              </Tab>
              {targetScriptsTab}
              {events}
            </Tabs>
          </Row>
        </Col>
        <ModalInstance custom_store={this.client_store}
           custom_path={this.state.custom_path} custom_history={this.props.history}
           service_name={this.state.service_name} basic_config_info={this.client_store.BasicConfigInfo} />
      </div>
    );
  }
}

StaticFileClientThingEdit.propTypes = {
  store: React.PropTypes.object
};

export default StaticFileClientThingEdit;
