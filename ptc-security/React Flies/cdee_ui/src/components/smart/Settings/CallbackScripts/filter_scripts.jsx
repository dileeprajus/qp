/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormGroup, OverlayTrigger, Tooltip, InputGroup, Button, FormControl, ListGroup, ListGroupItem, Row, Col, ControlLabel } from 'react-bootstrap';
import ScriptEditForm from './script_edit_form';
import ModalInstance from '../../../static/layout/modalinstance';
import AlertContainer from 'react-alert';
import {NotificationContainer, NotificationManager} from 'react-notifications';

@inject('modal_store', 'generic_master_store')
@observer
class FIlterScripts extends React.Component {
  constructor(props) {
    super(props);
    this.modal_store = this.props.modal_store;
    this.generic_master_store = this.props.generic_master_store;
    this.state = {
            // TODO: change the below name from static to dynamic
      selected_script_index: null,
      new_script_name: '',
      custom_path: '',
      service_name: '',
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
    this.props.type_manager_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    this.props.generic_master_store.setvalue('selectedTenantId', '');
    this.props.type_manager_store.GetFilterScripts;
    this.modal_store.modal.save_btn_dsbld = true;
  }

  getEdit(event) {
    this.props.type_manager_store.setvalue('test_input_value', '');
    this.props.type_manager_store.setvalue('test_output_value', '');
    this.setState({
      selected_script_index: event.target.name
    });
    this.modal_store.inputValues = '';
  }
  uploadAllScripts() {
    this.modal_store.modal.modal_title = 'Save Script ?';
    this.setState({ service_name: 'uploadAllScript' });
    this.modal_store.modal.serviceName = 'uploadAllScript';
    this.modal_store.modal.modalBtnTxt = 'Save';
    this.modal_store.showModal(
        <p>Are you sure you want to save ?</p>);
  }
  saveAllScripts() {
    this.props.type_manager_store.UploadFilterScripts(this.props.type_manager_store.filter_scripts[this.state.selected_script_index], this.saveScriptCallback.bind(this));
  }

  saveScriptCallback(type){
    if(type==='Success'){
      NotificationManager.success('Script Saved Successfully', 'Success', 1000);
      this.modal_store.modal.save_btn_dsbld = true;
    }
    else{
        NotificationManager.error('Script Saved Failed', 'Failed', 5000);
    }
  }
  showAlert = (msg) => {
      this.msg.show(msg, {
          type: 'error'
      })
  }
  createScript() {
      var s_name = this.state.new_script_name
      if (s_name !== '' && s_name !== null) {
        this.props.type_manager_store.filter_scripts.push({
           name: this.state.new_script_name,
           input: 'string',
           output: 'string',
           description: '',
           script: []
        });
        this.setState({
          new_script_name: ''
        });
        this.modal_store.modal.save_btn_dsbld = false;
        this.props.type_manager_store.filterScriptsArr.push(this.state.new_script_name);
      }else {
        this.showAlert('Please enter uniq name for script');
        this.modal_store.modal.save_btn_dsbld = true;
      }
  }

  deleteScript(obj, index) {
    this.setState({ service_name: 'DeleteScript', custom_path: '/Settings' });
    this.modal_store.modal.selectedScriptIndex = index;
    this.modal_store.modal.serviceName = 'DeleteScript';
    this.modal_store.modal.modal_title = 'Delete ' + ' Script ?';
    this.modal_store.modal.modalBtnTxt = 'Confirm';
    this.modal_store.showModal(
      <p>Selected Script will be deleted from TRC</p>);
  }

  onSelectTenantId(event) {
    if(event.target.value === 'Select TenantId') {
      this.props.type_manager_store.setvalue('currentTenantID', '');
      this.props.generic_master_store.setvalue('selectedTenantId', '');
    }else {
      this.props.type_manager_store.setvalue('currentTenantID', event.target.value);
      this.props.generic_master_store.setvalue('selectedTenantId', event.target.value);
    }
    this.props.type_manager_store.GetFilterScripts;
  }

  render() {
    const del_script_tooltip = (<Tooltip id="tooltip-script-addordel"><strong>Delete</strong> this script</Tooltip>);
    var tenantIdList = [];
    this.props.generic_master_store.tenantIDs.forEach(function(obj){
        if(obj) {
         tenantIdList.push(
             <option key={obj.tenantName} value={obj.tenantName}>{obj.tenantName}</option>
         )
      }
    });
    if(this.props.type_manager_store.filter_scripts !== undefined) {
        var filter_script_list = this.props.type_manager_store.filter_scripts.map((obj, index) => {
            if (obj) {
                return (
                    <ListGroupItem
                        key={obj.name + index + '_script'} name={index}
                        active={(index == this.state.selected_script_index)}
                        onClick={this.getEdit.bind(this)}
                        style={{wordBreak: 'break-all'}}
                    >
                      <OverlayTrigger placement="left" overlay={del_script_tooltip}>
                        <Button disabled = {this.state.userCheck === false}
                            className="pull-right btn btn-xs btn-danger"
                            bsSize="xsmall" bsStyle="danger"
                            onClick={this.deleteScript.bind(this, obj, index)}
                        >
                          <i className="fa fa-times"></i>
                        </Button>
                      </OverlayTrigger>
                        {obj.name}</ListGroupItem>
                );
            }
        });
    }

    var edit_page = '';
    if (this.state.selected_script_index) {
      edit_page = (<ScriptEditForm
        type_manager_store={this.props.type_manager_store}
        selected_key={this.state.selected_script_index}
        selected_script={this.props.type_manager_store.filter_scripts[this.state.selected_script_index]}
      />);
    } else {
      edit_page = <h4>Select Script</h4>
    }

    return (
      <div>
      <Row>
        <Col sm={3} md={3} lg={3}>
          <FormGroup controlId="formControlsSelectTenantId" hidden={BACKEND !== 'LoopBack'}>
            <ControlLabel>TenantId Selection</ControlLabel>
            <FormControl
                componentClass="select" placeholder="Select TenantId" name="tenantIdSelect"
                onChange={this.onSelectTenantId.bind(this)} value={this.props.generic_master_store.selectedTenantId}
            >
              <option value="Select TenantId">Select TenantId</option>
                {tenantIdList}
            </FormControl>
          </FormGroup>
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text" placeholder="Add New Script" value={this.state.new_script_name}
                onChange={(event) => this.setState({ new_script_name: event.target.value.replace(/^\s+|$/gm, '') })}
              />
              <InputGroup.Button>
                <Button
                  bsStyle="success" style={{ fontSize: '15px' }}
                  disabled={this.state.new_script_name === '' || this.props.type_manager_store.filterScriptsArr.indexOf(this.state.new_script_name) !== -1}
                  onClick={this.createScript.bind(this)}
                >+</Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          <span hidden={this.props.type_manager_store.filterScriptsArr.indexOf(this.state.new_script_name) === -1} style={{ color: '#F4BA41' }}>Script already exists. please enter unique name</span>
          <ListGroup>
            {filter_script_list}
          </ListGroup>

        </Col>

        <Col sm={9} md={9} lg={9}>
            {edit_page}
          </Col>

        <ModalInstance
          custom_store={this.props.type_manager_store} custom_path={this.state.custom_path}
          custom_history={this.props.history} service_name={this.state.service_name} selectedScriptIndex={this.state.selected_script_index}
          saveAllScripts={this.saveAllScripts.bind(this)}
        />
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions}/>
          <NotificationContainer/>

      </Row>
      <Row>
        <Button bsStyle="success" className="pull-right" onClick={this.uploadAllScripts.bind(this)} disabled={this.modal_store.modal.save_btn_dsbld || this.state.userCheck === false}>Save</Button>
      </Row>
      </div>
    );
  }
}

FIlterScripts.propTypes = {
  store: React.PropTypes.object
};

export default FIlterScripts;
