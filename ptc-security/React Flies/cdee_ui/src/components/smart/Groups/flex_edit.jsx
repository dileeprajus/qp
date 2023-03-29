/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Thumbnail, Col, FormGroup, FormControl,InputGroup, Button, Grid, Row } from 'react-bootstrap';
import ModalInstance from '../../static/layout/modalinstance';
import AlertInstance from '../../static/layout/alertinstance';
import Navigator from '../GenericComponents/navigator';
import FlexStore from '../../../stores/FlexStore';
import {NotificationManager} from 'react-notifications';

@inject('breadcrumb_store', 'modal_store', 'generic_master_store')
@observer
class FlexGroupEdit extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    //this.flexstore = new FlexStore(this.props.match.params.name);
    this.generic_master_store = this.props.generic_master_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.flexstore = new FlexStore('GenericIEMasterConfig');
    this.state = {
      service_name: '',
      custom_path: '',
      showicon: '',
      disabld_update_btn: false,
      hideSubmitBtn: true,
      hideWarningMsg: true,
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
    this.flexstore.setvalue('currentGroupName', this.generic_master_store.currentGroupName?this.generic_master_store.currentGroupName:this.props.match.params.groupName);
    var PageName = 'Edit:' + this.flexstore.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.flexstore.getGroupHostProperties(this.createAlert.bind(this), this.testHostProps.bind(this));
  }
  createAlert() {
    if (this.modal_store.modal.notification === true) {
      this.modal_store.modal.notification = false;
      NotificationManager.success('Created '+this.flexstore.currentGroupName +' Successfully', 'Success', 2000);
    }
  }
  onChange(event) {
    var tempHostProp = this.flexstore.groupHostProperties;
       // modify temporarily to update HostProperties json on change
    tempHostProp[event.target.name] = event.target.value;
    this.flexstore.setvalue('groupHostProperties', tempHostProp);
    this.modal_store.modal.disable_endpt_btn = true;//changes added for 152 bug
    this.setState({ hideSubmitBtn: true, hideWarningMsg: true });
  }
  handleSubmit() {
    if(Object.keys(this.flexstore.groupHostProperties).length < 4) {
        NotificationManager.warning('Please EnterHostProperties', 'Warning', 2000);
        this.setState({ disabld_update_btn: true });
        setTimeout(function () {
            this.setState({ disabld_update_btn: false });
        }.bind(this), 2000);
    }else{
     if((this.flexstore.groupHostProperties.hostname === '') || (this.flexstore.groupHostProperties.midpoint === '') ||
        (this.flexstore.groupHostProperties.username === '') || (this.flexstore.groupHostProperties.password === '')){
        this.setState({ disabld_update_btn: true });
        NotificationManager.warning('Please EnterHostProperties', 'Warning', 2000);
        setTimeout(function () {
            this.setState({ disabld_update_btn: false });
        }.bind(this), 2000);
     }else{
      this.setState({ service_name: 'SetGroupHostProperties', custom_path: '/Flex/Show/' });
      this.modal_store.modal.modal_title = 'Set ' + this.flexstore.currentGroupName + ' Group';
      this.modal_store.showModal(<p>Are you sure you want to update: {this.flexstore.currentGroupName} Group</p>);
      this.modal_store.modal.show_alert_msg = 'Updated ' + this.flexstore.currentGroupName + ' groupHostProperties Successfully';
    }}
  }
  onClick(event) {
    if (event.target.name === 'EndPoints') {
      this.props.history.push('/Flex/'+this.props.match.params.groupName);
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
    if (event.target.className ==='fa fa-eye') {
      this.setState({ showicon: true });
    } else if (event.target.className ==='fa fa-eye-slash') {
      this.setState({ showicon: false });
    } else {}
}
  disableSubmitBtn() {
    for (var k in this.flexstore.groupHostProperties) {
      if (this.flexstore.groupHostProperties[k] === '') {
        return true;
      }
    }
    return false;
  }
  testHostProps() {
    ieGlobalVariable.loaderStore.turnon();
    this.flexstore.setvalue('name', 'FlexConfig');
    this.flexstore.setvalue('HostProperties', this.flexstore.groupHostProperties);
    this.flexstore.SetHostProperties('FlexConfig', 'groupEdit', this.showSubmitBtn.bind(this));
  }
  showSubmitBtn() {
    if (this.flexstore.FlexObjects.length > 0) {
      this.setState({ hideSubmitBtn: false, hideWarningMsg: true });
      this.flexstore.setvalue('name', 'GenericIEMasterConfig');
    } else this.setState({ hideSubmitBtn: true, hideWarningMsg: false });
    ieGlobalVariable.loaderStore.turnoff();
  }
  render() {
    var hostPropFieldNames = [];
    hostPropFieldNames.push(
      <FormGroup key="SetHostProperties">
        <FormGroup key="HostName">
          <ControlLabel>HostName</ControlLabel>
          <InputGroup>
            <FormControl
              type="text" placeholder="HostName"
              name="hostname" value={this.flexstore.groupHostProperties.hostname}
              onChange={this.onChange.bind(this)}
              style={{ marginBottom: '-1px' }}
            />
            <InputGroup.Addon style={{ background: 'white', color: '#bfb7b7' }}>Ex:http://182.74.142.14</InputGroup.Addon>
          </InputGroup>
        </FormGroup >
        <FormGroup key="Mid-Point">
          <ControlLabel>Mid-Point</ControlLabel>
          <InputGroup>
            <FormControl
              type="text" placeholder="Mid-Point" name="midpoint"
              value={this.flexstore.groupHostProperties.midpoint}
              onChange={this.onChange.bind(this)}
              style={{ marginBottom: '-1px' }}
            />
            <InputGroup.Addon style={{ background: 'white', color: '#bfb7b7' }}>Ex:Windchill/servlet/rest/cdee</InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <FormGroup key="UserName">
          <ControlLabel>UserName</ControlLabel>
          <FormControl
            type="text" placeholder="UserName" name="username" value={this.flexstore.groupHostProperties.username}
            onChange={this.onChange.bind(this)}
          />
        </FormGroup>
        <ControlLabel>Password</ControlLabel>
        <InputGroup>
        <FormControl type={this.state.showicon ? 'text' : 'password'} placeholder="Enter Password" name="password" value={this.flexstore.groupHostProperties.password} onChange={this.onChange.bind(this)}
           style={{ marginBottom: '-1px' }}/>
           <InputGroup.Addon style={{ background: 'white', color: 'black' }}>
            <i className={this.state.showicon === true ? 'fa fa-eye-slash':'fa fa-eye'} aria-hidden="true" onClick={this.ShowHide.bind(this)}></i>
           </InputGroup.Addon>
        </InputGroup>
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
                    <p hidden={this.state.hideSubmitBtn}>
                      <Button
                        bsStyle="warning" className="pull-right"
                        disabled={this.disableSubmitBtn() || this.state.disabld_update_btn || this.state.userCheck === false}
                        onClick={this.handleSubmit.bind(this)}
                      >Submit</Button>
                    </p>
                    <p hidden={!this.state.hideSubmitBtn}>
                      <Button
                        bsStyle="info" className="pull-right"
                        disabled={this.disableSubmitBtn() || this.state.disabld_update_btn}
                        onClick={this.testHostProps.bind(this)}
                      >Test</Button>
                    </p>
                  </FormGroup>
                  <span hidden={this.state.hideWarningMsg || this.disableSubmitBtn() || this.state.disabld_update_btn} style={{ color: 'red', fontWeight:'bold' }}>Unable to Connect to FlexPLM, Please Check your credentials.</span>
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
          disabled={this.flexstore.groupHostProperties.hostname === '' ||
          this.flexstore.groupHostProperties.midpoint === '' ||
          this.flexstore.groupHostProperties.username === '' ||
          this.flexstore.groupHostProperties.password === '' ||
          Object.keys(this.flexstore.groupHostProperties).length === 0 ||
          this.modal_store.modal.disable_endpt_btn}//changes added for 152 bug
          onClick={this.onClick.bind(this)}>
          EndPoints
        </Button>
        <ModalInstance
          custom_store={this.flexstore} custom_path={this.state.custom_path}
          custom_history={this.props.history} service_name={this.state.service_name}
        />
          {this.props.children}
      </div>
    );
  }
}
FlexGroupEdit.propTypes = {
  store: React.PropTypes.object
};

export default FlexGroupEdit;
