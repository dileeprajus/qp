/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

 * Unauthorized copying of this file via any medium is strictly prohibited

 * See LICENSE file in the project root for full license information

 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, FormGroup, FormControl, Row, Button, ControlLabel, Thumbnail, Modal, Checkbox } from 'react-bootstrap';
import AlertContainer from 'react-alert';

@inject('generic_master_store', 'modal_store')
@observer
class EmailConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.modal_store = this.props.modal_store;
    this.state = {
      disableToflag : (this.generic_master_store.EmailConfiguration.To === '')? true : false,
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    }
  }

  componentWillMount() {
    this.generic_master_store.setvalue('async_callback', this.updateStateVar.bind(this));
    this.generic_master_store.GetPropValues({propertyArr: ['EmailConfiguration']})
  }
  showAlert = (msg) => {
    this.msg.show(msg, {
      type: 'error'
    })
  };

  updateStateVar(event){
    this.generic_master_store.setvalue('async_callback', null);
    if(event.EmailConfiguration) {
      this.setState({disableToflag: (event.EmailConfiguration.To === '') ? true : false})
    }
  }

  onChange(event){
    var temp = this.generic_master_store.EmailConfiguration;
    temp[event.target.name] = event.target.value;
    this.generic_master_store.setvalue(EmailConfiguration, temp);
    if(event.target.name === 'To'){
      if(event.target.value === ''){
        this.setState({disableToflag: true })
      }else{
        this.setState({disableToflag: false })
      }
    }
  }
  isEnableLogs(type, event) {
    console.log('type ::and event:', type, event);
    if(type === 'Logs') {
      this.generic_master_store.setvalue('isEnableLogs', event.target.checked);
    } 
  }
  saveScriptLogStatus() {
    this.generic_master_store.enableScriptLogs();
  }
  cancel() {
    this.generic_master_store.showModal = false;
  }
  saveMail() {
    this.generic_master_store.showModal = true;
    this.generic_master_store.modalBtnTxt = 'Save';
    this.generic_master_store.modalTitle = 'Save Email Configuration';
    this.generic_master_store.modalBody = 'Are you sure you want to save Email configuration';
  }

  saveProp(){
    this.generic_master_store.SetPropValues({'EmailConfiguration': this.generic_master_store.EmailConfiguration})
    this.generic_master_store.showModal = false;
  }

  render() {

    return (
      <div>
        <Row>
          <Col xs={12}>
            <Col sm={6} md={6} lg={6} xs={6}>
            <div className="accesstoken-header">Email Configuration</div>
            <Thumbnail>
              <FormGroup>
                <ControlLabel>TO</ControlLabel>
                <FormControl key="To" type="text"  name="To" value={this.generic_master_store.EmailConfiguration.To} placeholder="Enter Email" onChange={this.onChange.bind(this)}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>CC</ControlLabel>
                <FormControl key="CC" type="text"  name="CC" value={this.generic_master_store.EmailConfiguration.CC} placeholder="Enter emails with ;(semi colon) separator" onChange={this.onChange.bind(this)}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>BCC</ControlLabel>
                <FormControl key="BCC" type="text"  name="BCC" value={this.generic_master_store.EmailConfiguration.BCC} placeholder="Enter emails with ;(semi colon) separator" onChange={this.onChange.bind(this)}/>
              </FormGroup>
            </Thumbnail>
              <Button bsStyle="success" key="emailSave" className="pull-right" disabled={!this.generic_master_store.EmailConfiguration.To || this.state.userCheck === false} onClick={this.saveMail.bind(this)}>Save Emails</Button>
            </Col>
            <Col  xsOffset={1} sm={5} md={5} lg={5} xs={5}>
              <div className="accesstoken-header">Configure Debug Logs</div>
              <Thumbnail>
                <FormGroup>
                  <FormGroup style={{marginLeft: '20%', fontSize: 'larger'}}>
                    <Checkbox name="isEnableLogs" checked={this.generic_master_store.isEnableLogs} onChange={this.isEnableLogs.bind(this, 'Logs')} inline><b>Debug Logs Status</b></Checkbox>
                  </FormGroup>
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col xs={12}>
                     <Button disabled = {this.state.userCheck === false} bsStyle="primary" className="btn btn-primary fa-pull-right" onClick={this.saveScriptLogStatus.bind(this)}>Save</Button>
                    </Col>
                    </Row>
                  </FormGroup>

                </Thumbnail>
              </Col>
          </Col>
        </Row>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions}/>
        <div className="modal-container">
          <Modal show={this.generic_master_store.showModal} onHide={this.cancel.bind(this)} aria-labelledby="contained-modal-title">
            <Modal.Header closeButton>
              <h4>{this.generic_master_store.modalTitle}</h4>
            </Modal.Header>
            <Modal.Body className="modal-body">
              {this.generic_master_store.modalBody}
            </Modal.Body>
            <Modal.Footer className="modal-footer">
              <Button bsStyle="default" onClick={this.cancel.bind(this)} className="btn btn-default">Cancel</Button>
              <Button bsStyle="primary" className="btn btn-primary" onClick={this.saveProp.bind(this)}>Save</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

EmailConfiguration.propTypes = {
  store: React.PropTypes.object
};

export default EmailConfiguration;
