/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Thumbnail, Col, FormGroup, FormControl, Button, Grid, Row } from 'react-bootstrap';
import ModalInstance from '../../static/layout/modalinstance';
import AlertInstance from '../../static/layout/alertinstance';
import Navigator from '../GenericComponents/navigator';
import SocketStore from '../../../stores/SocketStore';
import { NotificationManager } from 'react-notifications';

@inject('breadcrumb_store', 'modal_store', 'generic_master_store')
@observer
class SocketGroupEdit extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.socketStore = new SocketStore('GenericIEMasterConfig');
    this.state = {
      service_name: '',
      custom_path: '',
      showicon: '',
      disabld_update_btn: false
    };
  }

  componentWillMount() {
    this.socketStore.setvalue('currentGroupName', this.generic_master_store.currentGroupName ? this.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.socketStore.setvalue('currentGroupType', this.generic_master_store.groupType);
    this.socketStore.setvalue('currentTenantID', this.generic_master_store.tenantID);
    var PageName = 'Edit:' + this.socketStore.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.socketStore.getGroupHostProperties(this.createAlert.bind(this));
  }
  createAlert() {
    if(this.modal_store.modal.notification === true) {
      this.modal_store.modal.notification = false;
      NotificationManager.success('Created '+this.socketStore.currentGroupName +' Successfully', 'Success', 2000);
    }
  }
  onChange(event) {
    var tempHostProp = this.socketStore.groupHostProperties;
      if(event.target.value === 'Select Source Type') {
          tempHostProp[event.target.name] = '';
      }else {
          tempHostProp[event.target.name] = event.target.value;
      }
    this.socketStore.setvalue('groupHostProperties', tempHostProp);
    this.modal_store.modal.disable_endpt_btn = true;
  }
  handleSubmit() {
    if (Object.keys(this.socketStore.groupHostProperties).length < 3) {
        NotificationManager.warning('Please EnterHostProperties', 'Warning', 2000);
        this.setState({ disabld_update_btn: true });
        setTimeout(function () {
            this.setState({ disabld_update_btn: false });
        }.bind(this), 2000);
    } else {
      if ((this.socketStore.groupHostProperties.url === '') ||
        (this.socketStore.groupHostProperties.inputData === '')) {
        this.setState({ disabld_update_btn: true });
        NotificationManager.warning('Please EnterHostProperties', 'Warning', 2000);
        setTimeout(function () {
          this.setState({ disabld_update_btn: false });
        }.bind(this), 2000);
      } else {
        this.setState({ service_name: 'SetGroupHostProperties', custom_path: '/Flex/Show/' });
        this.modal_store.modal.modalBtnTxt = 'Submit';
        this.modal_store.modal.modal_title = 'Set ' + this.socketStore.currentGroupName + ' Group';
        this.modal_store.showModal(<p>Are you sure you want to update: {this.socketStore.currentGroupName} Group</p>);
        this.modal_store.modal.show_alert_msg = 'Updated ' + this.socketStore.currentGroupName + ' groupHostProperties Successfully';
      }
    }
  }
  onClick(event) {
    this.generic_master_store.setvalue('tenantID', this.socketStore.currentTenantID);
    if (event.target.name === 'EndPoints') {
        this.props.history.push('/Socket/'+this.socketStore.currentGroupName);
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
  ShowHide(event) {
    if (event.target.name === 'Hide') {
      this.setState({ showicon: true });
    } else if (event.target.name === 'Show') {
      this.setState({ showicon: false });
    } else {}
  }
  disableSubmitBtn() {
    for (var k in this.socketStore.groupHostProperties) {
      if (this.socketStore.groupHostProperties[k] === '') {
        return true;
      }
    }
    return false;
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

  render() {
    var optionsArr = ['Tcp', 'WebSocket', 'HttpSocket', 'Mqtt'];
    var list = this.returnList(optionsArr);
    var hostPropFieldNames = [];
    hostPropFieldNames.push(
      <FormGroup key="SetSocketHostProperties">
        <FormGroup key="URL">
          <ControlLabel>URL</ControlLabel>
          <FormControl
            type="text" placeholder="URL"
            name="url" value={this.socketStore.groupHostProperties.url}
            onChange={this.onChange.bind(this)}
            style={{ marginBottom: '-1px' }}
          />
        </FormGroup >
        <FormGroup key="Port">
          <ControlLabel>Port</ControlLabel>
          <FormControl
            type="text" placeholder="Port" name="port"
            value={this.socketStore.groupHostProperties.port}
            onChange={this.onChange.bind(this)}
            style={{ marginBottom: '-1px' }}
          />
        </FormGroup>
        <FormGroup key="options">
          <ControlLabel>Connecting Options</ControlLabel>
          <FormControl
              type="text" placeholder="options"
              name="options" value={this.socketStore.groupHostProperties.options}
              onChange={this.onChange.bind(this)}
              className="socketHostFiledStyle"
          />
        </FormGroup>
        <FormGroup key="inputData">
          <ControlLabel>Input Data</ControlLabel>
          <FormControl
            componentClass="textarea" rows="6" style={{ resize: 'none' }} placeholder="Input Data" name="inputData" value={this.socketStore.groupHostProperties.inputData}
            onChange={this.onChange.bind(this)}
          />
        </FormGroup>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Source Type</ControlLabel>
          <FormControl componentClass="select" placeholder="Select Source Type" name="sourceType"
                       onChange={this.onChange.bind(this)} value={this.socketStore.groupHostProperties.sourceType}>
            <option value="Select Source Type">Source Type</option>
              {list}
          </FormControl>
        </FormGroup>
      </FormGroup>
    );
    return (
      <div>
        <Col xs={6} sm={8} smOffset={2} xsOffset={3} lg={8} lgOffset={2}>
          <AlertInstance modal_store={this.modal_store} />
        </Col>
        <Row>
         <Col xs={12}>
          <Navigator history={this.props.history} desc={'/Groups/Edit'} type={'/Flex'} action={'Config'} source={'Template'} generic_master_store={this.props.generic_master_store} />
         </Col>
        </Row>
        <Grid>
          <Row>
            <Col xs={8} xsOffset={2}>
              <h3>Set System Host Properties</h3>
              <Thumbnail>
                <form onSubmit={this.handleSubmit}>
                    {hostPropFieldNames}
                  <FormGroup>
                    <p>
                      <Button
                        bsStyle="warning" className="pull-right"
                        onClick={this.handleSubmit.bind(this)}
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
          onClick={this.onClick.bind(this)}
        >
          Endpoints
        </Button>
        <ModalInstance
          custom_store={this.socketStore} custom_path={this.state.custom_path}
          custom_history={this.props.history} service_name={this.state.service_name}
        />
          {this.props.children}
      </div>
    );
  }
}

SocketGroupEdit.propTypes = {
  store: React.PropTypes.object
};

export default SocketGroupEdit;
