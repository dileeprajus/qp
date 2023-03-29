/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Col, FormGroup, Button, InputGroup, Grid, Row, ButtonToolbar, Panel, Radio, FormControl, Modal, ListGroupItem, Thumbnail, MenuItem, DropdownButton, Tooltip, OverlayTrigger } from 'react-bootstrap';
import ModalInstance from '../../static/layout/modalinstance';
import AlertInstance from '../../static/layout/alertinstance';
import Navigator from '../GenericComponents/navigator';
import GenericStatusMessage from '../GenericComponents/generic_status_component';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/xml/xml';
import SoapClientStore from '../../../stores/SoapClientStore';
import { NotificationManager } from 'react-notifications';

@inject('breadcrumb_store', 'modal_store', 'generic_master_store', 'cdee_bussiness_rules_store')
@observer
class SoapGroupEdit extends React.Component { //TODO : this should be moved to tempaltes folder
  constructor(props) {
    super(props);
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.generic_master_store = this.props.generic_master_store;
    this.brs = this.props.cdee_bussiness_rules_store;
    this.soap_client_store = new SoapClientStore('GenericIEMasterConfig')
    this.state = {
      hideNewWsdlForm: false,
      wsdlFromFile: (this.soap_client_store.wsdlFromFile === 'FileUpload'),
      service_name: '',
      custom_path: '',
      show_err_msg: false,
      url_err_msg: false,
      showWsdlData: false,
      modalTitle: '',
      modalBody: '',
      update_btn_dsbld: false,
      hideBasicAuthForm : (this.soap_client_store.SoapRestConfig.current_auth_type === 'NoAuth')? true : false,
      userCheck : (this.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
    this.soap_client_store.setvalue('currentGroupName', this.generic_master_store.currentGroupName?this.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.soap_client_store.setvalue('currentGroupType', this.generic_master_store.groupType);
    this.soap_client_store.setvalue('currentTenantID', this.generic_master_store.tenantID);
    var PageName = 'Edit:' + this.soap_client_store.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.soap_client_store.getUploadWsdls(this.createAlert.bind(this));
    this.soap_client_store.getSoapConfigs;
  }
  onChange(event) {
    if (event.target.name === 'wsdlinput') {
      if (event.target.value === 'FileUpload') {
        this.setState({ wsdlFromFile: true });
        this.soap_client_store.setvalue('wsdlType', 'FileUpload');
      } else if (event.target.value === 'FromURL') {
        this.setState({ wsdlFromFile: false });
        this.soap_client_store.setvalue('wsdlType', 'FromURL');
      } else {}
    } else {
      this.uniqueKeyValidation(event);
    }
    this.setState({ update_btn_dsbld: false });
  }
  onFileUploadContent(event) {
    var file = document.getElementById('fileUploadForSoap').files[0];
    if(event.target.name === 'fileData') {
      if (file) {
        var fNameArry = file.name.split('.');
        var fName = fNameArry[fNameArry.length -1];
        if((fName.toUpperCase() === 'WSDL') || (fName.toUpperCase() === 'XML')){
          var reader = new FileReader();
          const that = this;
          reader.readAsText(file, 'UTF-8');
          reader.addEventListener('load', () => {
            that.soap_client_store.setvalue('newWSDLFile', reader.result);
          })
        }else {
          NotificationManager.warning('Please Select Exact Dataformat to Upload WSDL', 'Success', 2000);
          document.getElementById('fileUploadForSoap').value = '';
        }}
    }
  }

  uniqueKeyValidation(event) {
    this.soap_client_store.setvalue(event.target.name, event.target.value);
    if (event.target.name === 'newWSDLKey' || event.target.name === 'newURLWSDLKey') {
      const list = Object.keys(this.soap_client_store.uploadedWsdls);
      if (event.target.value !== '') {
        if (event.target.value !== '' && list.indexOf(event.target.value) === -1) {
          if (event.target.name === 'newWSDLKey') {
            this.setState({ show_err_msg: false });
          } else this.setState({ url_err_msg: false });
        } else {
          if (event.target.name === 'newWSDLKey') {
            this.setState({ show_err_msg: true });
          } else this.setState({ url_err_msg: true });
        }
      }
    }
  }

  selectItem(name,value){
    var temp = this.soap_client_store.SoapRestConfig;
    temp[name] = value;
    this.soap_client_store.setvalue('SoapRestConfig', temp);
    if(name==='current_auth_type'){
      if(value==='BasicAuth'){
        this.setState({'hideBasicAuthForm':false})
      }else{
        this.setState({'hideBasicAuthForm':true})
      }
    }
  }

  handleSubmit(event) {
    if (event.target.name === 'AddUrlDataBtn') {
      this.modal_store.modal.modalBtnTxt = 'Submit';
    } else if (event.target.name === 'UpdateUrlDataBtn') {
      this.modal_store.modal.modalBtnTxt = 'Update';
      this.setState({ update_btn_dsbld: true });
    }
    if (this.soap_client_store.wsdlType === ('FileUpload' || 'FromURL') || event.target.name === 'AddUrlDataBtn') {
      this.setState({ service_name: 'UploadWsdl', custom_path: '' });
      this.modal_store.modal.modalBtnTxt = 'Update';
      this.modal_store.modal.modal_title = 'Update ' + this.soap_client_store.currentGroupName + ' Group';
      this.modal_store.showModal(<p>Are you sure you want to update: {this.soap_client_store.currentGroupName} Group</p>);
    } else if (event.target.name === 'GetSoapDataBtn') {
      this.soap_client_store.getSoapData();
    } else {
    }
  }
  cancel() {
    if (this.soap_client_store.disableUploadKey) {
      this.soap_client_store.newWSDLKey = '';
      this.soap_client_store.newWSDLFile = '';
      this.soap_client_store.disableUploadKey = false;
    } else {
      this.soap_client_store.newWSDLUrl = '';
      this.soap_client_store.newURLWSDLKey = '';
      this.soap_client_store.wsdlURLData = '';
      this.soap_client_store.hideUrlData = true;
      this.setState({ url_err_msg: false, hideBasicAuthForm: true });
      this.soap_client_store.disableUrlKey = false;
      this.soap_client_store.SoapRestConfig = {
        current_method_type: 'GET',
        current_data_format: '',
        data_url: '',
        basic_auth_details: {
          username: '',
          password: ''
        },
        current_auth_type: 'NoAuth',
        sourceType: '',
        headers: '',
        query_params: '',
        body: {}
      };
    }
    this.soap_client_store.setvalue('currentSelectedWSDLKey', '');
  }
  viewWSDLData(ws) {
    this.setState({ showWsdlData: true, modalTitle: ws, modalBody: this.soap_client_store.uploadedWsdls[ws]['data'] });
  }
  editWSDLData(ws, wsdlKey) {
    this.soap_client_store.setvalue('currentSelectedWSDLKey', wsdlKey);
    this.soap_client_store.setvalue('wsdlType', ws.wsdlType);
    if (ws.wsdlType === 'FileUpload') {
      this.soap_client_store.newWSDLKey = wsdlKey;
      this.soap_client_store.newWSDLFile = ws.data;
      this.soap_client_store.disableUploadKey = true;
    } else if (ws.wsdlType === 'FromURL') {
      this.soap_client_store.newURLWSDLKey = wsdlKey;
      this.soap_client_store.newWSDLUrl = ws.url;
      this.soap_client_store.SoapRestConfig = ws.SoapRestConfig ? ws.SoapRestConfig : this.soap_client_store.SoapRestConfig;
      if (ws.SoapRestConfig) {
        this.setState({ hideBasicAuthForm: (ws.SoapRestConfig.current_auth_type === 'NoAuth' ? true : false) });
      }
      this.soap_client_store.disableUrlKey = true;
    } else {
    }
  }
  deleteWSDLData(ws) {
    this.soap_client_store.setvalue('currentSelectedWSDLKey', ws);
    this.setState({ service_name: 'DeleteWSDL', custom_path: '' });
    this.modal_store.modal.service_name = 'DeleteWSDL';
    this.modal_store.modal.modal_title = 'Delete ' + this.soap_client_store.currentGroupName + ' Group WSDL Data';
    this.modal_store.showModal(<p>Are you sure you want to Delete: {this.soap_client_store.currentGroupName} WSDL Data</p>);
    this.modal_store.modal.modalBtnTxt = 'DeleteWSDL';
  }
  onClick(event) {
    if (event.target.name === 'EndPoints') {
      this.props.history.push('/SoapClient/'+this.props.match.params.groupName);
    } else if (event.target.name === 'back') {
      if (this.generic_master_store.groupType === 'source') {
        this.props.history.push('/SourceSystems');
      }
      if (this.generic_master_store.groupType === 'target') {
        this.props.history.push('/TargetSystems');
      }
    } else {
    }
  }
  createAlert() {
    if (this.modal_store.modal.notification === true) {
      this.modal_store.modal.notification = false;
      NotificationManager.success('Created' + ' '+this.soap_client_store.currentGroupName +' '+ 'Successfully', 'Success', 1000);
    }
  }
  basicAuth(event){
    var temp = this.soap_client_store.SoapRestConfig;
    temp['basic_auth_details'][event.target.name] = event.target.value;
    this.soap_client_store.setvalue('SoapRestConfig', temp);
  }
  disableDelBtn(wsdlName) {
    var hideBtn = false;
    for (var i = 0; i < this.soap_client_store.SoapConfigs.length; i++) {
      var obj = this.soap_client_store.SoapConfigs[i];
      if (obj['ConfigJson']) {
        if (obj['ConfigJson']['SelectedWsdl'] === wsdlName) {
          hideBtn = true;
          break;
        }
      }
    }
    return hideBtn;
  }
  render() {
    var codeOptions = {
      lineNumbers: false,
      mode: 'xml',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    var view_wsdl_tooltip = (<Tooltip id="tooltip-viewwsdl-data"><strong>View WSDL </strong> Data.</Tooltip>)
    var edit_wsdl_tooltip = (<Tooltip id="tooltip-editwsdl-data"><strong>Edit WSDL</strong>Data.</Tooltip>)
    let close = () => this.setState({ showWsdlData: false });
    var existingWSDL = Object.keys(this.soap_client_store.uploadedWsdls);
    var wsdlList = [];
    existingWSDL.map(ws => {
      var hideBtn = this.disableDelBtn(ws);
      wsdlList.push(
        <ListGroupItem key={ws} style={{ width: '100%', height: '35px', textAlign: 'center', marginTop: '-1px' }}>
          <span>
            <span style={{ cursor: 'pointer' }}>
               <span style={{ fontSize: 14, fontWeight: 'bold', color: '#455A64'}}>
                <span className="fa-pull-left">
                 &nbsp;&nbsp;&nbsp; <i className="fa fa-file-text-o" aria-hidden="true"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                   {ws}
              </span>
            </span>
            <span className="fa-pull-right">
            <OverlayTrigger placement="top" overlay={view_wsdl_tooltip}>
              <span style={{ cursor: 'pointer', color: '#38A7D0' }} onClick={this.viewWSDLData.bind(this, ws)}>
                <i className="fa fa-eye" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;<font color="#ff8c1a">|</font>&nbsp;&nbsp;&nbsp;
              </span>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={edit_wsdl_tooltip}>
              <span style={{ cursor: 'pointer', color: '#ff8c1a' }} onClick={this.editWSDLData.bind(this, this.soap_client_store.uploadedWsdls[ws], ws)}>
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;<font color="#ff8c1a">|</font>&nbsp;&nbsp;&nbsp;
              </span>
              </OverlayTrigger>
              <span key={'delBtnSpan' + ws} title={hideBtn ? 'WSDL : ' + ws + ' is Selected in one of the configs. Please remove the configuration then delete the wsdl' : 'Delete Button'}>
                <Button style={{ cursor: 'pointer', color: 'red', border: 'none' }} disabled={hideBtn || this.state.userCheck === false} onClick={this.deleteWSDLData.bind(this, ws)}>
                  <i className="fa fa-trash-o" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                </Button>
              </span>
          </span>
          </span>
        </ListGroupItem>
      );
    });
    var soap_rest_option_list = ['GET','POST'].map(m => {
      return(
        <MenuItem key={m} eventKey={m} active={(this.soap_client_store.SoapRestConfig.current_method_type === m)? true : false }>{m}</MenuItem>
      )
    });
    var soap_rest_auth_list = ['NoAuth','BasicAuth'].map(m => {
      return(
        <MenuItem key={m} eventKey={m} active={(this.soap_client_store.SoapRestConfig.current_auth_type === m)? true : false }>{m}</MenuItem>
      )
    });
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Navigator history={this.props.history} desc={'/Groups/Edit'} type={'/SoapClient'} action={'Config'} source={'Template'} generic_master_store={this.props.generic_master_store} />
            <Col xs={8} xsOffset={2}>
              <AlertInstance modal_store={this.modal_store} />
            </Col>
          </Col>
        </Row>
        <Grid>
          <Row>
            <Col xs={8} xsOffset={2}>
              <h3>Upload WSDL for SOAP System </h3>
              <Thumbnail>
                <div className="col-lg-6 col-md-6 col-sm-6 radio-btn-div" style={{ zIndex: '3' }}>
                    <Radio name="wsdlinput" value="FileUpload" onChange={this.onChange.bind(this)} inline checked={this.soap_client_store.wsdlType === 'FileUpload'}>FileUpload</Radio>
                    <Radio name="wsdlinput" value="FromURL" onChange={this.onChange.bind(this)} inline checked={this.soap_client_store.wsdlType === 'FromURL'}>FromURL</Radio>
                </div>

                  <form onSubmit={this.handleSubmit} hidden={this.soap_client_store.wsdlType !== 'FileUpload'}>
                    <FormGroup key={'wsdlKey'}
                      validationState={
                         this.state.show_err_msg ? 'warning' : null
                    }>
                      <FormControl
                        disabled={this.soap_client_store.disableUploadKey}
                        type="text" placeholder="Enter unique wsdl key" name={'newWSDLKey'} value={this.soap_client_store.newWSDLKey}
                        onChange={this.onChange.bind(this)}
                      />
                      <FormControl.Feedback />
                      <span hidden={!this.state.show_err_msg} style={{ color: 'orange' }}>WSDL key already exists</span>
                    </FormGroup>
                    <FormGroup className="pull-right">
                      <input type="file" id="fileUploadForSoap" name="fileData"
                             onChange={this.onFileUploadContent.bind(this)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControl rows="6" componentClass="textarea" placeholder="File content goes here..." name="newWSDLFile" value={this.soap_client_store.newWSDLFile} onChange={this.onChange.bind(this)} />
                    </FormGroup>
                    <FormGroup hidden={this.soap_client_store.disableUploadKey}>
                      <Button
                        name="Add"
                        bsStyle="primary" className="btn-submit fa-pull-right"
                        hidden={this.soap_client_store.disableUploadKey}
                        onClick={this.handleSubmit.bind(this)} block
                         disabled={this.soap_client_store.newWSDLKey === '' || this.soap_client_store.newWSDLFile === '' || existingWSDL.indexOf(this.soap_client_store.newWSDLKey) !== -1 || this.state.userCheck === false}
                      >Add</Button>
                    </FormGroup>
                    <div
                      className="col-lg-12 col-md-12 col-sm-12"
                      hidden={!this.soap_client_store.disableUploadKey}
                    >
                      <FormGroup className="col-lg-6 col-md-6 col-sm-6" >
                        <Button
                          bsStyle="default" name={'Cancel'}
                          className="btn-submit pull-left" onClick={this.cancel.bind(this)}
                          disabled={this.soap_client_store.newWSDLFile === '' }
                          style={{ width: '50%' }}
                        >{'Cancel'}</Button>
                      </FormGroup>
                      <FormGroup
                        className="col-lg-6 col-md-6 col-sm-6"
                      >
                        <Button
                          name="Update"
                          bsStyle="primary" className="btn-submit"
                          onClick={this.handleSubmit.bind(this)}
                          style={{ width: '50%',float: 'right' }}
                          hidden={!this.soap_client_store.disableUploadKey}
                          block disabled={this.soap_client_store.newWSDLFile === '' || this.state.update_btn_dsbld || this.state.userCheck === false }
                        >Update</Button>
                      </FormGroup>
                    </div>
                    &nbsp;
                  </form>
                  &nbsp;
                <div hidden={this.soap_client_store.wsdlType !== 'FromURL'}>
                  <form onSubmit={this.handleSubmit}>
                    <FormGroup key={'urlWsdlKey'}
                      validationState={
                         this.state.url_err_msg ? 'warning' : null
                    }>
                      <FormControl
                        disabled={this.soap_client_store.disableUrlKey}
                        type="text" placeholder="Enter unique wsdl key" name={'newURLWSDLKey'} value={this.soap_client_store.newURLWSDLKey}
                        onChange={this.onChange.bind(this)}
                      />
                      <FormControl.Feedback />
                      <span hidden={!this.state.url_err_msg} style={{ color: 'orange' }}>WSDL key already exists</span>
                    </FormGroup>
                  <FormGroup controlId="formInlineURL">
                      <InputGroup>
                        <DropdownButton
                          componentClass={InputGroup.Button}
                          bsStyle={'Default'.toLowerCase()} title={this.soap_client_store.SoapRestConfig.current_method_type} name="current_method_type" value={this.soap_client_store.SoapRestConfig.current_method_type} onSelect={this.selectItem.bind(this,'current_method_type')} id={'dropdown-basic-methodtype' + this.value}>
                          {soap_rest_option_list}
                        </DropdownButton>
                        <FormControl style={{ marginLeft: '5px' }}
                          type="url" placeholder="Enter URL here..." name="newWSDLUrl"
                          disabled={!this.soap_client_store.hideUrlData}
                          value={this.soap_client_store.newWSDLUrl}
                          onChange={this.onChange.bind(this)}
                        />
                    </InputGroup>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalAuthType">
                      <Row>
                        <Col componentClass={ControlLabel} sm={2}>
                          Auth Type :
                        </Col>
                        <Col sm={10}>
                          <ButtonToolbar>
                            <DropdownButton bsStyle={'Default'.toLowerCase()} title={this.soap_client_store.SoapRestConfig.current_auth_type} name="current_auth_type" value={this.soap_client_store.SoapRestConfig.current_auth_type} onSelect={this.selectItem.bind(this,'current_auth_type')} id='dropdown-basic'>
                              {soap_rest_auth_list}
                            </DropdownButton>
                          </ButtonToolbar>
                        </Col>
                      </Row>
                      <div className="basicAuth" hidden={this.state.hideBasicAuthForm}>
                        <FormGroup>
                          <ControlLabel>Username</ControlLabel>
                          <FormControl type="text" placeholder="Enter Username" name="username" value={this.soap_client_store.SoapRestConfig['basic_auth_details']['username']} onChange={this.basicAuth.bind(this)}/>
                        </FormGroup>
                        <FormGroup>
                          <ControlLabel>Password</ControlLabel>
                          <FormControl type="password" placeholder="Enter Password" name="password" value={this.soap_client_store.SoapRestConfig['basic_auth_details']['password']} onChange={this.basicAuth.bind(this)}/>
                        </FormGroup>
                      </div>
                    </FormGroup>
                    <FormGroup hidden={this.soap_client_store.hideUrlData}>
                      <FormControl
                        rows="6" componentClass="textarea" placeholder="File content from url goes here..."
                        name="wsdlURLData" value={this.soap_client_store.wsdlUrlData} readOnly
                      />
                    </FormGroup>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <FormGroup className="col-lg-6 col-md-6 col-sm-6">
                        <Button
                          bsStyle="default" name={this.soap_client_store.hideUrlData ? 'Clear' : 'Cancel'}
                          className="btn-submit pull-left" onClick={this.cancel.bind(this)}
                          disabled={this.soap_client_store.newWSDLUrl === '' || this.soap_client_store.newURLWSDLKey === ''}
                          style={{ width: '50%' }}
                        >{this.soap_client_store.hideUrlData ? 'Clear' : 'Cancel'}</Button>
                      </FormGroup>
                      <FormGroup
                        className="col-lg-6 col-md-6 col-sm-6"
                        hidden={this.soap_client_store.disableUrlKey}
                      >
                        <Button
                          bsStyle="primary" name={this.soap_client_store.hideUrlData ? 'GetSoapDataBtn' : 'AddUrlDataBtn'}
                          className="btn-submit pull-right" onClick={this.handleSubmit.bind(this)}
                          disabled={this.soap_client_store.newWSDLUrl === '' || this.soap_client_store.newURLWSDLKey === '' || existingWSDL.indexOf(this.soap_client_store.newURLWSDLKey) !== -1 || (!this.soap_client_store.hideUrlData && !this.state.userCheck)}
                          style={{ width: '50%' }}
                        >{this.soap_client_store.hideUrlData ? 'Fetch WSDL' : 'Add'}</Button>
                      </FormGroup>
                      <FormGroup
                        className="col-lg-6 col-md-6 col-sm-6"
                        hidden={!this.soap_client_store.disableUrlKey}
                      >
                        <Button
                          bsStyle="primary" name={this.soap_client_store.hideUrlData ? 'GetSoapDataBtn' : 'AddUrlDataBtn'}
                          className="btn-submit pull-right" onClick={this.handleSubmit.bind(this)}
                          disabled={this.soap_client_store.newWSDLUrl === '' || (!this.soap_client_store.hideUrlData && !this.state.userCheck)}
                          style={{ width: '50%' }}
                        >{this.soap_client_store.hideUrlData ? 'Fetch WSDL' : 'Update'}</Button>
                      </FormGroup>
                    </div>
                  </form>
                </div>
                  &nbsp;
                <br></br>
              </Thumbnail>
              <Panel hidden={existingWSDL.length === 0}>
                <center><h4>Uploaded WSDL List </h4></center>
                <ul className="wsdlListUI">
                  {wsdlList}
                </ul>
              </Panel>
            </Col>
          </Row>
        </Grid>
        <Button className="pull-left" bsStyle="warning" name="back" onClick={this.onClick.bind(this)}>
         Back
        </Button>
        <Button
          className="pull-right" name="EndPoints" bsStyle="info"
          onClick={this.onClick.bind(this)} disabled={wsdlList.length === 0 || this.soap_client_store.disableUrlKey || this.soap_client_store.disableUploadKey}
        >
          Endpoints
        </Button>
        <div className="modal-container">
          <Modal bsSize="large" show={this.state.showWsdlData} onHide={close} container={this} aria-labelledby="contained-modal-title">
            <Modal.Header closeButton>
              <h4>{this.state.modalTitle}</h4>
            </Modal.Header>
            <Modal.Body>
              <CodeMirror
                value={this.state.modalBody} options={codeOptions}
              />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
        </div>
        <ModalInstance
          custom_store={this.soap_client_store} custom_path={this.state.custom_path} editThis={this}
          custom_history={this.props.history} service_name={this.state.service_name} resetStoreVals={this.cancel.bind(this)}
        />
        <div hidden={existingWSDL.length !== 0}>
          <GenericStatusMessage statusMsg={'There are no uploaded wsdls'} />
        </div>
      </div>
    );
  }
}

SoapGroupEdit.propTypes = {
  store: React.PropTypes.object
};

export default SoapGroupEdit;
