/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { FormGroup, FormControl, Button, Grid, Row, Thumbnail, Col, ControlLabel, Tooltip, OverlayTrigger, Modal, ModalFooter,ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import ModalInstance from '../../static/layout/modalinstance';
import Navigator from '../GenericComponents/navigator';
import AlertInstance from '../../static/layout/alertinstance';
import {NotificationContainer, NotificationManager} from 'react-notifications';

@inject('generic_master_store', 'modal_store', 'breadcrumb_store', 'rest_client_store')
@observer
class GroupEdit extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.rest_client_store = this.props.rest_client_store;
    this.state = {
      show_err_msg: false,
      showDomainInput: false,
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }
  componentWillMount() {
    this.generic_master_store.currentGroupName = this.generic_master_store.currentGroupName ? this.generic_master_store.currentGroupName : this.props.match.params.groupName; // fix for #443, #546,#547 & #548
    var PageName = 'Edit:' + this.generic_master_store.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url, groupName: this.generic_master_store.currentGroupName, groupType: this.generic_master_store.groupType };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.generic_master_store.getGroupDescription;
    this.modal_store.modal.grpDescEnableBtn = false;
  }
  onChange(event) {
    if (event.target.name === 'currentGroupDesc') {
      if (event.target.value[0] === ' ') {
        event.preventDefault();
      } else {
        this.generic_master_store.setvalue(event.target.name, event.target.value);
        this.modal_store.modal.grpDescEnableBtn = true;
      }
    } else if (event.target.name === 'currentGroupTitle') {
      this.modal_store.modal.grpDescEnableBtn = true;
      this.generic_master_store.setvalue(event.target.name, event.target.value);
    }else if (event.target.name === 'oldDomain') {
      this.rest_client_store.setvalue(event.target.name, event.target.value);
    } else if (event.target.name === 'newDomain') {
      this.rest_client_store.setvalue(event.target.name, event.target.value);
    }
  }

  handleSubmit(event) {
    this.modal_store.modal.modalBtnTxt = 'Update';
    this.modal_store.modal.modal_title = 'Update ' + this.generic_master_store.currentGroupName + ' Group';
    this.modal_store.showModal(<p>Are you sure you want to update: {this.generic_master_store.currentGroupName} Template</p>);
    event.preventDefault();
  }
  onClick(event) {
    if (event.target.name === 'EndPoints') {
      if(this.generic_master_store.endPointsPath === 'Flex') {
        this.props.history.push('/Flex');
      } else {
        if(this.generic_master_store.endPointsPath === '/Mapping') {
            this.props.history.push(this.generic_master_store.endPointsPath+'/'+this.props.match.params.groupName);
        }else{
            this.props.history.push(this.generic_master_store.endPointsPath);
        }
      }
    } else if (event.target.name === 'back') {
      if (this.generic_master_store.groupType === 'source') {
        this.props.history.push('/SourceSystems');
      } else if (this.generic_master_store.groupType === 'target') {
        this.props.history.push('/TargetSystems');
      } else {
        this.props.history.push('/MappingSystems');
      }
    } else {
    }
  }
  updateDomain() {
      this.setState({showDomainInput: true});
      this.rest_client_store.oldDomain = '';
      this.rest_client_store.newDomain = '';
  }
  handleClose() {
    this.setState({showDomainInput: false});
  }
  responseCallback() {
    var res = this.rest_client_store.updateDomainStatus;
    var arr =res.res,newArr = [];
    if(arr.length) {
      for(var i=0; i<arr.length; i++) {
        for(var key in arr[i]) {
          if(arr[i][key] === 'failure') {
           newArr.push(key)
          }
        }
      }
      if(res.count){
      NotificationManager.info('Out of '+res.count+', '+ newArr.length+' Config(s) ('+newArr.join(',') +') failed to Update','Info', 5000);
      }
      else{
        NotificationManager.error('There is no Configuration','Error', 2000)
      }
    }else {
      NotificationManager.warning('No Configs found to Update','Warning', 2000);
    }
  }
  updateURLDomain() {
    this.setState({showDomainInput: false});
    this.rest_client_store.updateDomain(this.generic_master_store, this.responseCallback.bind(this));
  }
  render() {
    var updateDomain = (<Tooltip id="tooltip-updateDomain-config"><strong>Update Domain</strong></Tooltip>);
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Navigator history={this.props.history} type="" action={'Edit'} source={'Template'} generic_master_store={this.props.generic_master_store} />
            <Col xs={8} xsOffset={2}>
              <OverlayTrigger placement="left" overlay={updateDomain}>
                <div style={{ float:'right' }} hidden={this.generic_master_store.dataSourceType !== 'Rest'}>
                <Button disabled = {this.state.userCheck === false } bsSize="small" bsStyle="info"  onClick={this.updateDomain.bind(this)}><i className="fa fa-refresh"></i></Button>
                </div>
              </OverlayTrigger>
              <AlertInstance modal_store={this.modal_store} />
            </Col>
          </Col>
        </Row>
        <Row>
          <Grid>
            <Col xs={8} xsOffset={2}>
              <h3>Update {this.generic_master_store.currentGroupName} {this.generic_master_store.groupType.charAt(0).toUpperCase()+this.generic_master_store.groupType.slice(1)} System</h3>
              <Thumbnail>
                <form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <FormGroup hidden={BACKEND !== 'LoopBack'}>
                      <ControlLabel>Title</ControlLabel>
                      <FormControl
                          type="text" placeholder="Title" name="currentGroupTitle" value={this.generic_master_store.currentGroupTitle}
                          onChange={this.onChange.bind(this)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Description</ControlLabel>
                      <FormControl
                          componentClass="textarea" style={{ resize: 'none' }} placeholder="Description" name="currentGroupDesc"
                          value={this.generic_master_store.currentGroupDesc}
                          onChange={this.onChange.bind(this)}
                      />
                    </FormGroup>
                  </FormGroup>
                  <Button
                    bsStyle="primary" onClick={this.handleSubmit.bind(this)} block
                    disabled={this.generic_master_store.currentGroupDesc === '' || !this.modal_store.modal.grpDescEnableBtn || this.state.userCheck === false}
                  >Update</Button>
                </form>
              </Thumbnail>
            </Col>
            <Modal show={this.state.showDomainInput} onHide={this.handleClose.bind(this)}>
              <ModalHeader closeButton>
                <ModalTitle>Domain Updation</ModalTitle>
              </ModalHeader>
              <ModalBody>

                <FormGroup hidden={this.state.showDomainInput === false}>
                  <ControlLabel>Old Domain</ControlLabel>
                  <FormControl
                    type="text" placeholder="Old Domain Name" name="oldDomain" value={this.rest_client_store.oldDomain}
                    onChange={this.onChange.bind(this)}
                  />
                </FormGroup>
                <FormGroup hidden={this.state.showDomainInput === false}>
                  <ControlLabel>New Domain</ControlLabel>
                  <FormControl
                    type="text" placeholder="New Domain Name" name="newDomain" value={this.rest_client_store.newDomain}
                    onChange={this.onChange.bind(this)}
                  />
                </FormGroup>

              </ModalBody>
              <ModalFooter>
                <Button bsStyle="default" onClick={this.handleClose.bind(this)}>
                  Close
                </Button>
                <Button bsStyle="warning" disabled = {this.rest_client_store.newDomain.length < 3 || this.rest_client_store.oldDomain.length < 3} onClick={this.updateURLDomain.bind(this)}>
                  Update
                </Button>
              </ModalFooter>
            </Modal>
          </Grid>
          <Button className="pull-left" bsStyle="warning" name="back" onClick={this.onClick.bind(this)}>
           Back
          </Button>
          <Button
            className="pull-right" name="EndPoints" bsStyle="info"
            onClick={this.onClick.bind(this)}
          >
            End Points
          </Button>
        </Row>
        <ModalInstance
          custom_store={this.generic_master_store}
          custom_history={this.props.history} service_name={'SetGroupDescription'} currentGroupName={this.generic_master_store.currentGroupName}
        />
        <NotificationContainer />

        {this.props.children}
      </div>
    );
  }
}

GroupEdit.propTypes = {
  store: React.PropTypes.object
};

export default GroupEdit;
