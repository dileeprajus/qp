/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Thumbnail, Col, FormGroup, FormControl, Button, Grid, Row, Radio, InputGroup } from 'react-bootstrap';
import ModalInstance from '../../static/layout/modalinstance';
import AlertInstance from '../../static/layout/alertinstance';
import Navigator from '../GenericComponents/navigator';
import GooglePubSubClientStore from '../../../stores/GooglePubSubClientStore';
import { NotificationManager } from 'react-notifications';

@inject('breadcrumb_store', 'modal_store', 'generic_master_store')
@observer
class GooglePubSubGroupEdit extends React.Component {
    constructor(props) {
        super(props);
        this.generic_master_store = this.props.generic_master_store;
        this.breadcrumb_store = this.props.breadcrumb_store;
        this.modal_store = this.props.modal_store;
        this.googlepubsubstore =  new GooglePubSubClientStore('GenericIEMasterConfig');
        this.state = {
            service_name: '',
            custom_path: '',
            showicon: '',
            disabld_update_btn: false,
            userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
          };
        }
        componentWillMount() {
            this.googlepubsubstore.setvalue('currentGroupName', this.generic_master_store.currentGroupName ? this.generic_master_store.currentGroupName:this.props.match.params.groupName);
            this.googlepubsubstore.setvalue('currentGroupType', this.generic_master_store.groupType);
            this.googlepubsubstore.setvalue('currentTenantID', this.generic_master_store.tenantID);
            var PageName = 'Edit:' + this.googlepubsubstore.currentGroupName;
            this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
            this.breadcrumb_store.pushBreadCrumbsItem();
            this.googlepubsubstore.GetHostProperties(this.createAlert.bind(this));
          }
          createAlert() {
            if(this.modal_store.modal.notification === true) {
              this.modal_store.modal.notification = false;
              NotificationManager.success('Created '+this.googlepubsubstore.currentGroupName +' Successfully', 'Success', 2000);
            }
          }
          onChange(event) {
            var fObj = this.googlepubsubstore.privateKeyFileInfo;
            var file = document.getElementById('fileUploadForPrivateKey').files[0];
            if(event.target.name === 'fileContent') {
              if (file) {
                var fNameArry = file.name.split('.');
                  var fName = fNameArry[fNameArry.length -1];
                  console.log('File object name',fName);
                  if(fName.toUpperCase() === fObj.fileType) {
                      var reader = new FileReader();
                      reader.readAsText(file, 'UTF-8');
                      reader.onload = function (event) {
                        if(fObj.fileType === 'JSON') {
                          fObj.fileData = JSON.parse(event.target.result);
                        }else {
                          fObj.fileData = event.target.result;
                        }
                      }
                  }else {
                      NotificationManager.warning('Please Upload JSON File', 'Success', 3000);
                      document.getElementById('fileUploadForPrivateKey').value = '';
                  }}
          }else {
            if(event.target.name === 'fileType') {
               document.getElementById('fileUploadForPrivateKey').value = '';
               fObj.fileData = '';
            }else if(event.target.name === 'fileData') {
              fObj[event.target.name] = event;
            }else {}
            fObj[event.target.name] = event.target.value;
         }
            this.googlepubsubstore.setvalue('privateKeyFileInfo', fObj);
            this.googlepubsubstore.HostProperties.privateKey = this.googlepubsubstore.privateKeyFileInfo;
            var tempHostProp = this.googlepubsubstore.HostProperties;
            tempHostProp[event.target.name] = event.target.value;
            this.googlepubsubstore.setvalue('HostProperties', tempHostProp);
            this.modal_store.modal.disable_endpt_btn = true;
          }
          handleSubmit() {
            if (document.getElementById('fileUploadForPrivateKey').files[0] === null) {
                NotificationManager.warning('Please upload Private key file', 'Warning', 2000);
                this.setState({ disabld_update_btn: true });
                setTimeout(function () {
                    this.setState({ disabld_update_btn: false });
                }.bind(this), 2000);
            } else {
              if ((this.googlepubsubstore.HostProperties.privateKey === '')) {
                this.setState({ disabld_update_btn: true });
                NotificationManager.warning('Please EnterHostProperties', 'Warning', 2000);
                setTimeout(function () {
                  this.setState({ disabld_update_btn: false });
                }.bind(this), 2000);
              } else {
                this.setState({ service_name: 'SetHostProperties', custom_path: '/GooglePubSub/Edit/' });
                this.modal_store.modal.modalBtnTxt = 'Submit';
                this.modal_store.modal.modal_title = 'Set ' + this.googlepubsubstore.currentGroupName + ' Group';
                this.modal_store.showModal(<p>Are you sure you want to update: {this.googlepubsubstore.currentGroupName} Group</p>);
                this.modal_store.modal.show_alert_msg = 'Updated ' + this.googlepubsubstore.currentGroupName + ' HostProperties Successfully';
            }
            }
          }
          onClick(event) {
            this.generic_master_store.setvalue('tenantID', this.googlepubsubstore.currentTenantID);
            if (event.target.name === 'EndPoints') {
                this.props.history.push('/GooglePubSub/'+this.googlepubsubstore.currentGroupName);
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
          render() {
            var hostPropFieldNames = [];
            hostPropFieldNames.push(
                <FormGroup key="SetGooglePubSubHostProperties">
                    <FormGroup key="SelectMode">
          <ControlLabel>Select Mode</ControlLabel><br/>
          <Radio name="selectMode" value="Publisher" disabled={this.generic_master_store.groupType === 'source'} onChange={this.onChange.bind(this)} inline checked={this.googlepubsubstore.HostProperties.selectMode === 'Publisher' }> Publisher</Radio>
          <Radio name="selectMode" value="Subscriber" disabled={this.generic_master_store.groupType === 'target'} onChange={this.onChange.bind(this)} inline checked={this.googlepubsubstore.HostProperties.selectMode === 'Subscriber' }> Subscriber</Radio>
                    </FormGroup>
        <FormGroup key="privateKey">
        <ControlLabel>Private Key</ControlLabel><br/>
        </FormGroup>
        <input type='file' id="fileUploadForPrivateKey" name="fileContent" style={{color:'white'}}
        onChange={this.onChange.bind(this)} /><br/>
        <ControlLabel>{this.googlepubsubstore.HostProperties.fileContent}</ControlLabel>
        
        </FormGroup>
            );
            return(
                <div>
                <Col xs={6} sm={8} smOffset={2} xsOffset={3} lg={8} lgOffset={2}>
                  <AlertInstance modal_store={this.modal_store} />
                </Col>
                <Row>
                  <Col xs={12}>
                    <Navigator history={this.props.history} desc={'/Groups/Edit'} type={'/GooglePubSub'} action={'Config'} source={'Template'} generic_master_store={this.props.generic_master_store} />
                  </Col>
                </Row>
                <Grid>
                  <Row>
                    <Col xs={8} xsOffset={2}>
                      <h3>Set GooglePubSub HostProperties</h3>
                      <Thumbnail>
                        <form>
                          {hostPropFieldNames}
                          <FormGroup>
                            <p>
                              <Button bsStyle="warning" className="pull-right" onClick={this.handleSubmit.bind(this)}
                                      disabled={
                                        this.googlepubsubstore.HostProperties.selectMode === '' ||
                                        this.googlepubsubstore.HostProperties.privateKey === '' ||
                                        this.googlepubsubstore.HostProperties.fileContent===''||
                                        this.state.userCheck === false
                                      }
                              >Submit</Button></p>
                          </FormGroup>
                          &nbsp;
                        </form>
                        &nbsp;
                      </Thumbnail>
                    </Col>
                  </Row>
                </Grid>
                <Button className="" bsStyle="warning" name="back" onClick={this.onClick.bind(this)}>
                  Back
                </Button>
                <Button
                  className="pull-right" name="EndPoints" bsStyle="info" 
                  disabled={this.googlepubsubstore.HostProperties.fileContent===''
                 }
                  onClick={this.onClick.bind(this)}
                >
                  Endpoints
                </Button>
                <ModalInstance
                  custom_store={this.googlepubsubstore} custom_path={this.state.custom_path}
                  custom_history={this.props.history} service_name={this.state.service_name}
                />
                {this.props.children}
              </div>

            );
          }       
}

GooglePubSubGroupEdit.propTypes = {
    store: React.PropTypes.object
  };

  export default GooglePubSubGroupEdit;