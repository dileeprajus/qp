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
import DataBaseStore from '../../../stores/DataBaseStore';
import { NotificationManager } from 'react-notifications';

@inject('breadcrumb_store', 'modal_store', 'generic_master_store')
@observer
class DataBaseGroupEdit extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.dbStore = new DataBaseStore('GenericIEMasterConfig');
    this.state = {
      service_name: '',
      custom_path: '',
      showicon: '',
      disabld_update_btn: false
    };
  }

  componentWillMount() {
    this.dbStore.setvalue('currentGroupName', this.generic_master_store.currentGroupName ? this.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.dbStore.setvalue('currentGroupType', this.generic_master_store.groupType);
    this.dbStore.setvalue('currentTenantID', this.generic_master_store.tenantID);
    var PageName = 'Edit:' + this.dbStore.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.dbStore.getGroupHostProperties(this.createAlert.bind(this));
  }
  createAlert() {
    if(this.modal_store.modal.notification === true) {
      this.modal_store.modal.notification = false;
      NotificationManager.success('Created '+this.dbStore.currentGroupName +' Successfully', 'Success', 2000);
    }
  }
  onChange(event) {
    var tempHostProp = this.dbStore.groupHostProperties;
      if(event.target.value === 'Select DataBase Type') {
          tempHostProp[event.target.name] = '';
      }else {
          tempHostProp[event.target.name] = event.target.value;
      }
    this.dbStore.setvalue('groupHostProperties', tempHostProp);
    this.modal_store.modal.disable_endpt_btn = true;
  }
  handleSubmit() {
    if (Object.keys(this.dbStore.groupHostProperties).length < 5) {
        NotificationManager.warning('Please EnterHostProperties', 'Warning', 2000);
        this.setState({ disabld_update_btn: true });
        setTimeout(function () {
            this.setState({ disabld_update_btn: false });
        }.bind(this), 2000);
    } else {
      if ((this.dbStore.groupHostProperties.url === '') || (this.dbStore.groupHostProperties.userName === '') || (this.dbStore.groupHostProperties.password === '') || (this.dbStore.groupHostProperties.databaseName === '') || (this.dbStore.groupHostProperties.databaseType === '') ) {
        this.setState({ disabld_update_btn: true });
        NotificationManager.warning('Please EnterHostProperties', 'Warning', 2000);
        setTimeout(function () {
          this.setState({ disabld_update_btn: false });
        }.bind(this), 2000);
      } else {
        this.setState({ service_name: 'SetGroupHostProperties', custom_path: '/DataBase/Show/' });
        this.modal_store.modal.modalBtnTxt = 'Submit';
        this.modal_store.modal.modal_title = 'Set ' + this.dbStore.currentGroupName + ' Group';
        this.modal_store.showModal(<p>Are you sure you want to update: {this.dbStore.currentGroupName} Group</p>);
        this.modal_store.modal.show_alert_msg = 'Updated ' + this.dbStore.currentGroupName + ' groupHostProperties Successfully';
      }
    }
  }
  onClick(event) {
    if (event.target.name === 'EndPoints') {
        this.props.history.push('/DataBase/'+this.dbStore.currentGroupName);
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
    for (var k in this.dbStore.groupHostProperties) {
      if (this.dbStore.groupHostProperties[k] === '') {
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
    var optionsArr = ['MongoDB', 'mysql','sqlite','postgres','mssql'];
    var list = this.returnList(optionsArr);
    var hostPropFieldNames = [];
    hostPropFieldNames.push(
      <FormGroup key="SetDataBaseHostProperties">
        <FormGroup key="URL">
          <ControlLabel>Host/URL</ControlLabel>
          <FormControl
            type="text" placeholder="URL"
            name="url" value={this.dbStore.groupHostProperties.url}
            onChange={this.onChange.bind(this)}
            style={{ marginBottom: '-1px' }}
          />
        </FormGroup >
        <FormGroup key="Port">
          <ControlLabel>Port</ControlLabel>
          <FormControl
            type="text" placeholder="Port" name="port"
            value={this.dbStore.groupHostProperties.port}
            onChange={this.onChange.bind(this)}
            style={{ marginBottom: '-1px' }}
          />
        </FormGroup>
        <FormGroup key="UserName">
          <ControlLabel>UserName</ControlLabel>
          <FormControl
            type="text" placeholder="UserName" name="userName"
            value={this.dbStore.groupHostProperties.userName}
            onChange={this.onChange.bind(this)}
            style={{ marginBottom: '-1px' }}
          />
        </FormGroup>
        <FormGroup key="Password">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            type="text" placeholder="Password" name="password"
            value={this.dbStore.groupHostProperties.password}
            onChange={this.onChange.bind(this)}
            style={{ marginBottom: '-1px' }}
          />
        </FormGroup>
        <FormGroup key="DataBaseName">
          <ControlLabel>DataBaseName</ControlLabel>
          <FormControl
            type="text" placeholder="DataBaseName" name="databaseName"
            value={this.dbStore.groupHostProperties.databaseName}
            onChange={this.onChange.bind(this)}
            style={{ marginBottom: '-1px' }}
          />
        </FormGroup>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>DataBase Type</ControlLabel>
          <FormControl componentClass="select" placeholder="Select DataBase Type" name="databaseType"
                       onChange={this.onChange.bind(this)} value={this.dbStore.groupHostProperties.databaseType}>
            <option value="Select DataBase Type">DataBase Type</option>
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
          <Navigator history={this.props.history} desc={'/Groups/Edit'} type={'/DataBase'} action={'Config'} source={'Template'} generic_master_store={this.props.generic_master_store} />
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
          End Points
        </Button>
        <ModalInstance
          custom_store={this.dbStore} custom_path={this.state.custom_path}
          custom_history={this.props.history} service_name={this.state.service_name}
        />
          {this.props.children}
      </div>
    );
  }
}

DataBaseGroupEdit.propTypes = {
  store: React.PropTypes.object
};

export default DataBaseGroupEdit;
