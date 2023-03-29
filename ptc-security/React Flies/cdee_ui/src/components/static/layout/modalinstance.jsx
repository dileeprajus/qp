/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, FormControl, FormGroup } from 'react-bootstrap';
import { NotificationContainer, NotificationManager } from 'react-notifications';

@inject('modal_store', 'validation_store', 'mapping_store', 'routing', 'generic_master_store', 'type_manager_store')
@observer
class ModalInstance extends Component {
  constructor(props) {
    super(props);
    this.modal_store = this.props.modal_store;
    this.generic_master_store = this.props.generic_master_store;
    this.type_manager_store = this.props.type_manager_store;
    this.validation_store = this.props.validation_store;
    this.state = {
      show_err_msg: false,
      show_btn_dsbld: false
    };
  }
  onSubmitBtn() {
    this.customCallBackFunction();
    this.modal_store.closeModal();
    this.validation_store.InitialState();
  }
  onCancelBtn() {
    this.modal_store.closeModal();
    this.validation_store.state.custom_name = 'success';
    this.validation_store.state.custom_description = 'success';

    if (this.modal_store.modal.hide_create_div === false) {
      this.props.mapping_store.new_thing_name = '';
      this.props.mapping_store.new_thing_description = '';
    }
    this.modal_store.modal.hide_create_div = this.modal_store.modal.hide_create_div ? true : true;
    this.modal_store.modal.isHardDelete = false;
    if (this.props.service_name === 'setConfigMetaInfo') {
      this.props.custom_store.getConfigMetaInfo;
    }
    this.modal_store.modal.modalBtnTxt = '';
  }
  onChange(event) {
    if (event.target.name === 'new_thing_name') {
      if (this.props.mapping_store.config_names.indexOf(event.target.value) !== -1) {
        this.setState({ show_err_msg: true });
      } else this.setState({ show_err_msg: false });
    }
    this.props.mapping_store.setvalue(event.target.name, event.target.value);
  }

  customCallBackFunction() {
    if (this.props.service_name === 'CreateConfig') {
      this.props.custom_store.CreateConfig(this.props.generic_master_store);
      if (this.modal_store.modal.hide_create_div === false) {
        this.modal_store.modal.show_msg = true;
        var modal_this = this;
        setTimeout(() => {
          modal_this.modal_store.modal.show_msg = false;
        }, 1500);
      }
      this.modal_store.modal.hide_create_div = this.modal_store.modal.hide_create_div ? true : true;
    } else if (this.props.service_name === 'Delete') {
      this.props.custom_store.DeleteConfig(this.modal_store.modal.configName, this.props.generic_master_store);
    }else if (this.props.service_name === 'UpdateData') {
      if (this.props.custom_path === '/FTP/Edit/') {
        var obj = {
          filePath: this.props.custom_store.ftpFileInfo.filePath,
          fileType: this.props.custom_store.ftpFileInfo.fileType,
          fileData: this.props.custom_store.ftpFileInfo.fileData,
          csvDelimeter: this.props.custom_store.ftpFileInfo.csvDelimeter
        };
        this.props.custom_store.testFTPData(obj);
        NotificationManager.success('Updated Data Succesfully', 'Success', 1500);
      }else {
        var obj = {
          csvDelimeter: this.props.custom_store.BasicConfigInfo.Delimeter,
          dataFormat: this.props.custom_store.BasicConfigInfo.DataFormat,
          dataContent: this.props.custom_store.BasicConfigInfo.Data
        };
        this.props.custom_store.testStaticData(obj).then(function (data)  {
          if(data.hasOwnProperty('JSONData')) {
            NotificationManager.success('Updated Data Succesfully', 'Success', 1500);
          }else{
            NotificationManager.warning('Re-check the data', 'Warning', 1500);
          }
        });
      }
    } else if (this.props.service_name === 'SetHostProperties' || this.props.service_name === 'Update' || this.props.service_name === 'SetRestProperties') {
      if (this.props.service_name === 'SetHostProperties') {
        if (this.props.custom_path === '/Flex/Edit/') {

        } else if(this.props.custom_path === '/FTP/Edit/'){
          var that = this;
          this.props.custom_store.SetHostProperties.then(function ()  {
            if(that.props.custom_store.ftpConnectionStatus === 'success') {
              NotificationManager.success('Connected Successfully', 'Success', 1500);
            }else {
              NotificationManager.warning('Failed To Connect', 'Warning', 1500);
            }
          });
        } else if(this.props.custom_path === '/GooglePubSub/Edit/'){
          var that = this;
          this.props.custom_store.SetHostProperties.then(function ()  {
            if(that.props.custom_store.googlePubSubConnectionStatus === 'Success') {
              NotificationManager.success('Connected Successfully', 'Success', 1500);
            }else {
              NotificationManager.warning('Failed To Connect', 'Warning', 1500);
            }
          });
        }else {
          this.props.custom_store.SetHostProperties;
          NotificationManager.success('Updated HostProperties Succesfully', 'Success', 1500);
        }
      }
      if (this.props.service_name === 'SetRestProperties') { // if the service is to set rest properties
        this.props.custom_store.callSetPropValues(this.props.custom_store.current_selected_source_type);
        this.props.custom_history.push(this.props.custom_path + this.props.custom_store.name);
      }
    } else if (this.props.service_name === 'SetGroupHostProperties') {
      this.props.custom_store.setGroupHostProperties();
      NotificationManager.success('Successfully connected to FlexPLM', 'Success', 3000);
      this.modal_store.modal.disable_endpt_btn = false;
    } else if (this.props.service_name === 'DeleteGroup') {
      this.props.custom_store.deleteGroup(this.modal_store.modal.groupName, this.props.groupType, this.modal_store.modal.isHardDelete, this.deleteGroupCallback.bind(this));
    } else if (this.modal_store.modal.serviceName === 'DeleteScript') {
      var filterScripts = this.type_manager_store.filter_scripts;
      filterScripts.splice(this.modal_store.modal.selectedScriptIndex, 1);
      this.type_manager_store.setvalue('filter_scripts', filterScripts);
      this.type_manager_store.UploadFilterScripts(this.type_manager_store.filter_scripts[this.modal_store.modal.selectedScriptIndex]);//changes related to 298
    } else if (this.props.service_name === 'SetGroupDescription') {
      this.props.custom_store.setGroupDescription;
      this.modal_store.modal.grpDescEnableBtn = false;
      NotificationManager.success('Updated ' + this.props.currentGroupName + ' Group Description Successfully', 'Success', 1000);
    } else if (this.props.service_name === 'UpdateConfigJson') {
      this.props.custom_store.UpdateConfigJson;
    } else if (this.props.service_name === 'UploadWsdl') {
      var temp = this.props.custom_store.uploadedWsdls;
      if (this.props.custom_store.disableUploadKey) {
        if (this.props.custom_store.currentSelectedWSDLKey) {
          delete temp[this.props.custom_store.currentSelectedWSDLKey];
        }
        this.props.custom_store.disableUploadKey = false;
      }
      if (this.props.custom_store.disableUrlKey) {
        if (this.props.custom_store.currentSelectedWSDLKey) {
          delete temp[this.props.custom_store.currentSelectedWSDLKey];
        }
        this.props.custom_store.disableUrlKey = false;
      }
      if (this.props.custom_store.wsdlType === 'FileUpload') {
        temp[this.props.custom_store.newWSDLKey] = {
          data: this.props.custom_store.newWSDLFile, wsdlType: this.props.custom_store.wsdlType
        };
      } else if (this.props.custom_store.wsdlType === 'FromURL') {
        temp[this.props.custom_store.newURLWSDLKey] = {
          data: this.props.custom_store.wsdlUrlData, wsdlType: this.props.custom_store.wsdlType,
          url: this.props.custom_store.newWSDLUrl, SoapRestConfig: this.props.custom_store.SoapRestConfig
        };
        this.props.editThis.setState({ hideBasicAuthForm: true });
      } else { }
      this.props.custom_store.setvalue('uploadedWsdls', temp);
      this.props.custom_store.updateWSDL();
      NotificationManager.success('Updated ' + this.props.custom_store.newWSDLKey + ' Wsdl Successfully', 'Success', 3000);
      document.getElementById('fileUploadForSoap').value = '';
    } else if (this.props.service_name === 'EditWSDL' || this.props.service_name === 'DeleteWSDL') {
      var temp = this.props.custom_store.uploadedWsdls;
      if (this.props.service_name === 'DeleteWSDL') {
        delete temp[this.props.custom_store.currentSelectedWSDLKey];
        this.props.resetStoreVals();
      } else if (this.props.service_name === 'EditWSDL') {
      } else {
      }
      this.props.custom_store.setvalue('uploadedWsdls', temp);
      this.props.custom_store.updateWSDL();
    } else if (this.modal_store.modal.serviceName === 'uploadAllScript') {
      this.type_manager_store.UploadFilterScripts(this.type_manager_store.filter_scripts[this.type_manager_store.filter_scripts.length-1]);
    }else if (this.modal_store.modal.serviceName === 'SetApplicationIDs') {
      var arr = this.generic_master_store.applicationIDs;
      this.props.custom_store.setApplicationIDs(arr[arr.length - 1], 'application');
      this.modal_store.modal.saveBtnMsg = true;
    }else if (this.modal_store.modal.serviceName === 'DeleteApplicationID') {
      var applicationID = this.generic_master_store.applicationIDs;
      this.generic_master_store.deleteApplicationID(applicationID[this.modal_store.modal.selectedScriptIndex], 'application');
      this.modal_store.modal.saveBtnMsg = true;
    } else if (this.props.service_name === 'setConfigMetaInfo') {
      this.props.custom_store.setConfigMetaInfo(this.configUpdation.bind(this));

    } else if (this.modal_store.modal.serviceName === 'UpdateTenantIDs') {
        this.props.custom_store.SetPropValues({ tenantIDs: { arr: this.props.custom_store.tenantIDs } }, 'tenant', { name: this.modal_store.modal.tenantID });
        NotificationManager.success('Updated TenantIDs Successfully', 'Success', 1000);
    } else if (this.modal_store.modal.serviceName === 'DeleteTenantID') {
      this.generic_master_store.deletedTenantIDs.push(this.modal_store.modal.tenantID);
      this.generic_master_store.tenantIDs.splice(this.modal_store.modal.tenantIDIndex, 1);
      if (this.generic_master_store.tenantIDsArr[this.modal_store.modal.tenantIDIndex] === this.modal_store.modal.tenantID) {
        this.generic_master_store.tenantIDsArr.splice(this.modal_store.modal.tenantIDIndex, 1);
      }
      NotificationManager.success('Deleted: ' + this.modal_store.modal.tenantID + ' TenantID Successfully', 'Success', 1000);
      this.modal_store.modal.tenantID = '';
      this.modal_store.modal.tenantIDIndex = '';
    } else if (this.modal_store.modal.serviceName === 'UpdateServerURL') {
      this.props.custom_store.resetTriggerBaseUrl();
      NotificationManager.success('Successfully Updated the TriggerBaseURL in Flex PLM', 'Success', 1000);
    } else if (this.modal_store.modal.serviceName === 'DeleteEntries') {
      this.props.custom_store.deleteDTEntries(this.modal_store.modal.tableName,this.modal_store.modal.configName,this.modal_store.modal.groupType);
      NotificationManager.success('Successfully Deleted '+this.modal_store.modal.tableName+' Entries', 'Success', 1000);
    } else if (this.modal_store.modal.serviceName === 'DeleteSummaryEntries') {
      this.props.custom_store.deleteSummaryEntries();
      NotificationManager.success('Successfully Deleted Summary Entries', 'Success', 1000);
    }
    this.modal_store.modal.serviceName = '';
    this.modal_store.setTimeOut();
    this.modal_store.modal.modalBtnTxt = '';
  }
  configUpdation(type) {
    if (type === 'Success') {
      NotificationManager.success(this.props.configName + ' Configuration Got Successfully', 'Success', 2000);
    }
  }

  deleteGroupCallback(response) {

    console.log('Respone data'+JSON.stringify(response.data));
    
    console.log('Respone data'+JSON.stringify(response.data.Success));
    
    if (response.data.Success) {
    
    if (this.modal_store.modal.isHardDelete === true) {
    
     NotificationManager.success(this.modal_store.modal.groupName + ' Group Deleted Successfully', 'Delete', 1000);
    
    }}
    
    else if(!(Object.keys(response.data).length))
    
    {
    
    if(this.modal_store.modal.isHardDelete === false){
    
    NotificationManager.success('Partially' + ' ' + this.modal_store.modal.groupName + ' ' + 'Group Deleted', 'Delete', 1000);
    
    }
    
    }
    
    else if(response.data.Exception)
    
    {
    
    if(this.modal_store.modal.isHardDelete === true){
    
    NotificationManager.error('Check Flex Connectivity.' + ' ' + this.modal_store.modal.groupName + ' ' + 'Group Cannot be Deleted', 'Delete', 1000);
    
    }}
    
    else {
    
    NotificationManager.error(this.modal_store.modal.groupName  + '  Group delete does not exists Please provide valueble host properties.','Failed',1000 );
    
     }
    
     }
 

  render() {
    var buttonsuccess = '';
    if(this.props.service_name === 'SetGroupHostProperties')
    {
    buttonsuccess = (<Button
      bsStyle="info" className="btn btn-primary" onClick={this.onSubmitBtn.bind(this)}
      disabled={!this.modal_store.modal.hide_create_div && this.props.mapping_store.new_thing_name === '' || this.state.show_err_msg}
    >
      {this.modal_store.modal.modalBtnTxt ? this.modal_store.modal.modalBtnTxt : 'Confirm'}
    </Button>)
    }
    else{
      buttonsuccess = (<Button
        bsStyle="danger" className="btn btn-primary" onClick={this.onSubmitBtn.bind(this)}
        disabled={!this.modal_store.modal.hide_create_div && this.props.mapping_store.new_thing_name === '' || this.state.show_err_msg}
      >
        {this.modal_store.modal.modalBtnTxt ? this.modal_store.modal.modalBtnTxt : 'Submit'}
      </Button>)


    }

    return (
      <div className="modal-container">
        <Modal
          show={this.modal_store.modal.show} onHide={this.modal_store.closeModal.bind(this.modal_store)} aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              <p style={{ wordWrap: 'break-word' }}> {this.modal_store.modal.modal_title}</p>
            </Modal.Title>
          </Modal.Header >
          <Modal.Body className="modal-body">
            {this.modal_store.modal.body}
            <div hidden={this.modal_store.modal.hide_create_div}>
              <FormGroup validationState={this.state.show_err_msg ? 'warning' : null}>
                <FormControl
                  type="text" placeholder="Name" name="new_thing_name"
                  value={this.props.mapping_store.new_thing_name}
                  onChange={this.onChange.bind(this)}
                />
                <FormControl.Feedback />
                <span
                  hidden={!this.state.show_err_msg} style={{ color: 'red' }}
                >Thing name already exists</span>
              </FormGroup>
              <FormGroup>
                <FormControl
                  componentClass="textarea" style={{ resize: 'none' }} placeholder="Description" name="new_thing_description"
                  value={this.props.mapping_store.new_thing_description}
                  onChange={this.onChange.bind(this)}
                />
                <FormControl.Feedback />
              </FormGroup>
            </div>
          </Modal.Body>
          <Modal.Footer className="modal-footer" data-reactid="1758" >
            <Button
              bsStyle="default" onClick={this.onCancelBtn.bind(this)} className="btn btn-default"
            >Cancel</Button>
            {buttonsuccess}
          </Modal.Footer>
        </Modal>
        <NotificationContainer />
      </div>
    );
  }
}

export default ModalInstance;
