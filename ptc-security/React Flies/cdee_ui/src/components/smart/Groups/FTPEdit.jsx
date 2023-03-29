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
import FTPClientStore from '../../../stores/FTPClientStore';
import { NotificationManager } from 'react-notifications';

@inject('breadcrumb_store', 'modal_store', 'generic_master_store')
@observer
class FTPGroupEdit extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.FTPStore = new FTPClientStore('GenericIEMasterConfig');
    this.state = {
      service_name: '',
      custom_path: '',
      showicon: '',
      disabld_update_btn: false,
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
    this.FTPStore.setvalue('currentGroupName', this.generic_master_store.currentGroupName ? this.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.FTPStore.setvalue('currentGroupType', this.generic_master_store.groupType);
    this.FTPStore.setvalue('currentTenantID', this.generic_master_store.tenantID);
    var PageName = 'Edit:' + this.FTPStore.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.FTPStore.GetHostProperties(this.createAlert.bind(this));
  }
  createAlert() {
    if(this.modal_store.modal.notification === true) {
      this.modal_store.modal.notification = false;
      NotificationManager.success('Created '+this.FTPStore.currentGroupName +' Successfully', 'Success', 2000);
    }
  }
  onChange(event) {
    var tempHostProp = this.FTPStore.HostProperties;
    tempHostProp[event.target.name] = event.target.value;
    this.FTPStore.setvalue('HostProperties', tempHostProp);
    this.modal_store.modal.disable_endpt_btn = true;
  }
  handleSubmit() {
    if (Object.keys(this.FTPStore.HostProperties).length < 3) {
        NotificationManager.warning('Please EnterHostProperties', 'Warning', 2000);
        this.setState({ disabld_update_btn: true });
        setTimeout(function () {
            this.setState({ disabld_update_btn: false });
        }.bind(this), 2000);
    } else {
      if ((this.FTPStore.HostProperties.hostName === '') ||
        (this.FTPStore.HostProperties.port === '')) {
        this.setState({ disabld_update_btn: true });
        NotificationManager.warning('Please EnterHostProperties', 'Warning', 2000);
        setTimeout(function () {
          this.setState({ disabld_update_btn: false });
        }.bind(this), 2000);
      } else {
        this.setState({ service_name: 'SetHostProperties', custom_path: '/FTP/Edit/' });
        this.modal_store.modal.modalBtnTxt = 'Submit';
        this.modal_store.modal.modal_title = 'Set ' + this.FTPStore.currentGroupName + ' Group';
        this.modal_store.showModal(<p>Are you sure you want to update: {this.FTPStore.currentGroupName} Group</p>);
        this.modal_store.modal.show_alert_msg = 'Updated ' + this.FTPStore.currentGroupName + ' HostProperties Successfully';
      }
    }
  }
  onClick(event) {
    this.generic_master_store.setvalue('tenantID', this.FTPStore.currentTenantID);
    if (event.target.name === 'EndPoints') {
        this.props.history.push('/FTP/'+this.FTPStore.currentGroupName);
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

  render() {
    var hostPropFieldNames = [];
    hostPropFieldNames.push(
      <FormGroup key="SetFTPHostProperties">
        <FormGroup key="HostName">
          <ControlLabel>Host Name</ControlLabel>
          <FormControl
            type="text" placeholder="HostName"
            name="hostName" value={this.FTPStore.HostProperties.hostName}
            onChange={this.onChange.bind(this)}
            style={{ marginBottom: '-1px' }}
          />
        </FormGroup>
        <FormGroup key="Port">
          <ControlLabel>Port</ControlLabel>
          <FormControl
            type="text" placeholder="Port" name="port"
            value={this.FTPStore.HostProperties.port}
            onChange={this.onChange.bind(this)}
            style={{ marginBottom: '-1px' }}
          />
        </FormGroup>
        <FormGroup key="SelectMode">
          <ControlLabel>Select Mode</ControlLabel><br/>
          <Radio name="selectMode" value="FTP" onChange={this.onChange.bind(this)} inline checked={this.FTPStore.HostProperties.selectMode === 'FTP' }> FTP</Radio>
          <Radio name="selectMode" value="SFTP" onChange={this.onChange.bind(this)} inline checked={this.FTPStore.HostProperties.selectMode === 'SFTP' }> SFTP</Radio>
        </FormGroup>
        <FormGroup key="UserName">
          <ControlLabel>Username</ControlLabel>
          <FormControl
            type="text" placeholder="UserName"
            name="userName" value={this.FTPStore.HostProperties.userName}
            onChange={this.onChange.bind(this)}
            className="socketHostFiledStyle"
          />
        </FormGroup>
        <FormGroup key="password">
          <ControlLabel>Password</ControlLabel>
          <InputGroup>
            <FormControl className="socketHostFiledStyle"
              type={this.state.showicon ? 'text' : 'password'} placeholder="Password"
              name="password" value={this.FTPStore.HostProperties.password}
              onChange={this.onChange.bind(this)}
              style={{ marginBottom: '-1px' }}
            />
            <InputGroup.Addon style={{ background: 'white', paddingTop: '2px' }} >
              <Button style={{ padding: '0', marginBottom: '-1px' }} name={this.state.showicon === true ? 'Show' : 'Hide'} bsStyle="link" onClick={this.ShowHide.bind(this)}>
                {this.state.showicon === true ? 'Hide' : 'Show'}
              </Button>
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <FormGroup key="rootDirectory">
          <ControlLabel>Root Directory</ControlLabel>
          <FormControl
            type="text" placeholder="rootDirectory"
            name="rootDirectory" value={this.FTPStore.HostProperties.rootDirectory}
            onChange={this.onChange.bind(this)}
            className="socketHostFiledStyle"
          />
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
          <Navigator history={this.props.history} desc={'/Groups/Edit'} type={'/FTP'} action={'Config'} source={'Template'} generic_master_store={this.props.generic_master_store} />
        </Col>
      </Row>
      <Grid>
        <Row>
          <Col xs={8} xsOffset={2}>
            <h3>Set FTP HostProperties</h3>
            <Thumbnail>
              <form onSubmit={this.handleSubmit}>
                {hostPropFieldNames}
                <FormGroup>
                  <p>
                    <Button bsStyle="warning" className="pull-right" onClick={this.handleSubmit.bind(this)}
                            disabled={
                              this.FTPStore.HostProperties.hostName === '' ||
                              this.FTPStore.HostProperties.port === '' ||
                              this.FTPStore.HostProperties.userName === '' ||
                              this.FTPStore.HostProperties.password === '' ||
                              this.FTPStore.HostProperties.rootDirectory === '' ||
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
        className="pull-right" name="EndPoints" bsStyle="info" onClick={this.onClick.bind(this)}
      >
        Endpoints
      </Button>
      <ModalInstance
        custom_store={this.FTPStore} custom_path={this.state.custom_path}
        custom_history={this.props.history} service_name={this.state.service_name}
      />
      {this.props.children}
    </div>
    );
  }
}

FTPGroupEdit.propTypes = {
  store: React.PropTypes.object
};

export default FTPGroupEdit;
