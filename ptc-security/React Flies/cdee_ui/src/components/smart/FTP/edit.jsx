/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Thumbnail, Col, FormGroup, FormControl, Button, Row, Tabs, Tab, Grid, Tooltip, OverlayTrigger } from 'react-bootstrap'
import ModalInstance from '../../static/layout/modalinstance';
import FTPClientStore from '../../../stores/FTPClientStore';
import SchemaEdit from '../GenericComponents/schema/edit';
import Navigator from '../GenericComponents/navigator';
import AlertInstance from '../../static/layout/alertinstance';
import UniqKeys from '../GenericComponents/schema/objectTransformations/uniq_keys';
import ScriptFilters from '../GenericComponents/schema/transformationRules/script_filters';
import TypeManagerStore from '../../../stores/TypeManagerStore';
import RequestVariableConfig from './reqVariables'
import { NotificationManager } from 'react-notifications';
import CodeMirror from 'react-codemirror';

@inject('breadcrumb_store', 'modal_store', 'generic_master_store')
@observer
class FTPEdit extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.client_store = new FTPClientStore(this.props.match.params.name);
    this.type_manager_store = new TypeManagerStore('TypeManagerConfig');
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.state = {
      service_name: '',
      custom_path: ''
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
    var bCObj = this.client_store.ftpFileInfo;
      var file = document.getElementById('fileUploadForFTP').files[0];
      if(event.target.name === 'fileContent') {
          if (file) {
            var fNameArry = file.name.split('.');
              var fName = fNameArry[fNameArry.length -1];
              if(fName.toUpperCase() === bCObj.fileType) {
                  var reader = new FileReader();
                  reader.readAsText(file, 'UTF-8');
                  reader.onload = function (event) {
                    if(bCObj.fileType === 'JSON') {
                      bCObj.fileData = JSON.parse(event.target.result);
                    }else {
                      bCObj.fileData = event.target.result;
                    }
                  }
              }else {
                  NotificationManager.warning('Please Select Corresponding FileType to Upload File', 'Success', 3000);
                  document.getElementById('fileUploadForFTP').value = '';
              }}
      }else {
        if(event.target.name === 'fileType') {
           document.getElementById('fileUploadForFTP').value = '';
           bCObj.fileData = '';
        }else if(event.target.name === 'fileData') {
          bCObj[event.target.name] = event;
        }else if(event.target.name === 'filePath') {
          bCObj[event.target.name] = event.target.value;
          var r = this.client_store.extractRequestVariables(event.target.value, event.target.name); // eslint-disable-line no-unused-vars
        } else if (event.target.name === 'fileName') {
          bCObj[event.target.name] = event.target.value;
          this.client_store.extractRequestVariables(event.target.value, event.target.name);
        }else {}
        bCObj[event.target.name] = event.target.value;
     }
      this.client_store.setvalue('ftpFileInfo', bCObj);
  }

  updateSourceData() {

  }

  updateTargetData(event) {
    var bCObj = this.client_store.ftpFileInfo;
    if(bCObj.fileType === 'JSON') {
      bCObj['fileData'] = JSON.parse(event);
    }else {
      bCObj['fileData'] = event;
    }
  }

  updateSchema(event) {
    if (this.client_store.currentGroupType === 'source') {
      this.client_store.setvalue('outputSchema', JSON.parse(event));
    } else if (this.client_store.currentGroupType === 'target') {
      this.client_store.setvalue('inputSchema', JSON.parse(event));
    }
  }

  handleSubmit(event) {
    var obj = {};
    obj.filePath = this.client_store.ftpFileInfo.filePath;
    obj.fileType = this.client_store.ftpFileInfo.fileType;
    obj.fileData = this.client_store.ftpFileInfo.fileData;
    if ((this.client_store.ftpFileInfo.fileType === 'XML') || (this.client_store.ftpFileInfo.fileType === 'CSV')) {
     if(this.client_store.ftpFileInfo.fileData === '/"error/":/"failed/"') {
       obj.fileData = '';
     }
    }else {
      if(this.client_store.ftpFileInfo.fileData) { 
        if(this.client_store.ftpFileInfo.fileData === '/"error/":/"failed/"') {
          obj.fileData = '';
        }
      }
    }
    obj.csvDelimeter = this.client_store.ftpFileInfo.csvDelimeter;
    this.client_store.testFTPData(obj);
    event.preventDefault();
  }

  deleteConfig() {
    this.setState({ service_name: 'Delete', custom_path: '/FTP' });
    this.modal_store.modal.modal_title = 'Delete ' + this.client_store.BasicConfigInfo.Name + ' Config';
    this.modal_store.showModal(<p>Are you sure you want to delete : {this.client_store.BasicConfigInfo.Name}  Config</p>);
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

  saveFTPConfig() {
    var tempConfig = this.client_store.configJson;
    var pk = '';
    let tempSchema = this.returnCurrentSchema();
    if(Object.keys(tempSchema).length) {
      pk = this.props.generic_master_store.returnPrimaryKey(tempSchema, this.client_store.configJson);
    }
    for(var key in this.client_store.requestVariablesConfig) {
      if(Object.keys(this.client_store.requestVariablesConfig[key])) {
        var t = this.client_store.normaliseRequestVariables(); // eslint-disable-line no-unused-vars
        tempConfig['RequestVariables'] = this.client_store.requestVariables;
      }
    }
    tempConfig['PrimaryKey'] = pk;
    tempConfig['ftpFileInfo'] = this.client_store.ftpFileInfo;
    tempConfig['schedularScript'] = this.client_store.schedularScript;
    this.client_store.setvalue('configJson', tempConfig);
    this.client_store.SetPropValues({
      ftpFileInfo: this.client_store.ftpFileInfo,
      inputSchema: this.client_store.inputSchema,
      outputSchema: this.client_store.outputSchema,
      ConfigJson: this.client_store.configJson
    });
    NotificationManager.success('Data and Schema Saved Successfully', 'Success', 1000);
  }

  updateTreeData(scripts) {
    var temp = this.client_store.configJson;
    temp['TransformationRules'] = scripts;
    this.client_store.setvalue('configJson', temp);
  }

  testApi() {
    var t = this.client_store.normaliseRequestVariables(); // eslint-disable-line no-unused-vars
    this.client_store.testApi();
  }

  render() {
    var reqVariables_form = (<RequestVariableConfig client_store={this.client_store} />);

    var schemaEdit = 'Loading....';
    var schemaUniqKeys = 'Loading....';
    var tempSchema = this.returnCurrentSchema();
    if (tempSchema) {
      schemaEdit = (<SchemaEdit schema={tempSchema} master={this} store={this.client_store} />);
      schemaUniqKeys = (<UniqKeys schema={tempSchema} master={this} store={this.client_store} />);
    }
    var fileType = ['XLS', 'JSON', 'XML', 'CSV', 'STRING'];
    var fileTypeList = [];
    if(this.props.generic_master_store.groupType === 'source')
    {
    fileType.map(type => {
      fileTypeList.push(
        <option key={type} selected={this.client_store.ftpFileInfo.fileType === type} value={type} disabled={(type=== 'XLS' || type ==='STRING')?true:false}>{type}</option>
      );
    });
    }
    else if(this.props.generic_master_store.groupType === 'target')
    {
    fileType.map(type => {
      fileTypeList.push(
        <option key={type} selected={this.client_store.ftpFileInfo.fileType === type} value={type} disabled={(type=== 'XLS' || type ==='STRING' || type ==='CSV')?true:false}>{type}</option>
      );
    });
    }
    var fileEncodeType = ['Base64'];
    var fileEncodingTypeList = [];
    fileEncodeType.map(type => {
      fileEncodingTypeList.push(
        <option key={type} selected={this.client_store.ftpFileInfo.fileEncodeType === type} value={type}>{type}</option>
      );
    });

    var target_scripts_tab = '';
    if (this.client_store.currentGroupType === 'target') {
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
    } else {
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
    const codeOptions = {
      lineNumbers: false,
      mode:'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: false
    };
    var schema = '';
    if(this.client_store.currentGroupType === 'source') {
      schema = this.client_store.outputSchema;
    }else {
      schema = this.client_store.inputSchema;
    }
    var data = '';
      if (this.client_store.ftpFileInfo.fileType === 'JSON') {
        data = (<CodeMirror id="FileData" name="data" onChange={this.updateTargetData.bind(this)}
                            value={JSON.stringify((this.client_store.ftpFileInfo.fileData === '') ? {}:this.client_store.ftpFileInfo.fileData, null, 2)}
                            options={codeOptions}/>)
      } else {
        data = (<CodeMirror id="FileData" name="data" onChange={this.updateTargetData.bind(this)}
                            value={(this.client_store.ftpFileInfo.fileData === '') ? '\"\"':this.client_store.ftpFileInfo.fileData} options={codeOptions}/>)
      }
    var test_schema_tooltip = (<Tooltip id="tooltip-schema-test"><strong>Test </strong> this Schema.</Tooltip>);
    var test_data_tooltip = (<Tooltip id="tooltip-schema-test"><strong>Test </strong> Data</Tooltip>);
    return (
      <div>
        <Col xs={8} xsOffset={2}>
          <AlertInstance modal_store={this.modal_store} />
        </Col>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Edit'} type={'/FTP' + ''} tempStore={this.client_store} delete={this.deleteConfig.bind(this)} save={this.saveFTPConfig.bind(this)} source={'Thing'} />
            <Tabs className="" defaultActiveKey={1} id="uncontrolled-flex-edit-tab-example">
              <Tab className="" tabClassName="arrowshapetab" eventKey={1} title="1.Data">
                <Grid>
                  <Row>
                    <Col xs={10} xsOffset={1}>
                      <h3>FTP Configuration</h3>
                      <Thumbnail>
                        <form onSubmit={this.handleSubmit}>
                          <FormGroup>
                            <ControlLabel>File Path</ControlLabel>
                            <FormControl type="text" placeholder="File Path" name='filePath' value={this.client_store.ftpFileInfo.filePath} onChange={this.onChange.bind(this)}/>
                          </FormGroup>
                          <FormGroup hidden={this.client_store.currentGroupType === 'target'}>
                            <ControlLabel>File Name</ControlLabel>
                            <FormControl type="text" placeholder="File Name" name='fileName' value={this.client_store.ftpFileInfo.fileName} onChange={this.onChange.bind(this)}/>
                          </FormGroup>
                          <FormGroup>
                            <ControlLabel>File Type</ControlLabel>
                            <FormControl componentClass="select" name="fileType" placeholder="File Type" onChange={this.onChange.bind(this)}>
                              <option key='Default'  value="">Select File Type</option>
                              {fileTypeList}
                            </FormControl>
                          </FormGroup>
                          <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                              <FormGroup hidden={this.client_store.ftpFileInfo.fileType !== 'CSV'}>
                                <FormControl type="text" placeholder="delimeter" name='csvDelimeter' value={this.client_store.ftpFileInfo.csvDelimeter} onChange={this.onChange.bind(this)}/>
                              </FormGroup>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                              <FormGroup hidden={this.client_store.ftpFileInfo.fileType === '' || this.client_store.currentGroupType === 'source'}>
                                <input type="file" id="fileUploadForFTP" name="fileContent"
                                       onChange={this.onChange.bind(this)}
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                          <Col xs={12} id="ftpJsonPretty" style={{ backgroundColor: '#282A36' }}>
                            <Col xs={4} sm={4} md={4} lg={4}>
                              <ControlLabel><h6><font color="darkturquoise"><b>Variables:&nbsp;&nbsp;&nbsp;&nbsp;</b></font></h6></ControlLabel>
                              <OverlayTrigger placement="top" overlay={test_data_tooltip} hidden={this.client_store.currentGroupType === 'target'}>
                                <Button
                                  className=""
                                  bsSize="xsmall"
                                  bsStyle="info"
                                  onClick={this.testApi.bind(this)}
                                  disabled={this.client_store.ftpFileInfo.fileType === ''}
                                >
                                  <i className="fa fa-flask"></i>
                                </Button>
                              </OverlayTrigger>
                            {reqVariables_form}
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                              <ControlLabel><h6><font color="darkturquoise"><b>File Data:&nbsp;&nbsp;&nbsp;&nbsp;</b></font></h6></ControlLabel>
                              <OverlayTrigger placement="top" overlay={test_schema_tooltip}>
                                <Button
                                  className=""
                                  bsSize="xsmall"
                                  bsStyle="info"
                                  onClick={this.handleSubmit.bind(this)}
                                  disabled={this.client_store.ftpFileInfo.fileType === ''}
                                >
                                  <i className="fa fa-refresh"></i>
                                </Button>
                              </OverlayTrigger>
                              <FormGroup hidden={this.client_store.ftpFileInfo.fileType === ''}>
                                {data}
                              </FormGroup>
                            </Col>
                            <Col xs={4} sm={4} md={4} lg={4}>
                              <FormGroup>
                                <ControlLabel><h6><font color="darkturquoise"><b>Schema:</b></font></h6></ControlLabel>
                                <CodeMirror id="schemaResponse" name="Schema" onChange={this.updateSchema.bind(this)} value={JSON.stringify(schema, null, 2)} options={codeOptions} />
                              </FormGroup>
                            </Col>
                          </Col>
                          </Row>
                        </form>
                      </Thumbnail>
                    </Col>
                  </Row>
                </Grid>
              </Tab>
              <Tab className="" tabClassName="arrowshapetab" eventKey={3} title="2.Attribute Schema" >
                {schemaEdit}
              </Tab>
              <Tab className="" tabClassName="arrowshapetab" eventKey={4} title="3.Object Transformations">
                {schemaUniqKeys}
              </Tab>
              {target_scripts_tab}
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

FTPEdit.propTypes = {
  store: React.PropTypes.object
};

export default FTPEdit;
