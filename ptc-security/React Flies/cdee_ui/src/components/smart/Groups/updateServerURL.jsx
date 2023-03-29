/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { FormGroup, FormControl, Button, Grid, Row, Thumbnail, Col, ControlLabel } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import ModalInstance from '../../static/layout/modalinstance';
import Navigator from '../GenericComponents/navigator';
import AlertInstance from '../../static/layout/alertinstance';
import { NotificationContainer } from 'react-notifications';
import FlexStore from '../../../stores/FlexStore';

@inject('generic_master_store', 'modal_store', 'breadcrumb_store')
@observer
class UpdateServerURL extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.flexstore = new FlexStore('FlexConfig');
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.state = {
      show_err_msg: false
    };
  }
  componentWillMount() {
    this.flexstore.setvalue('currentGroupName', this.generic_master_store.currentGroupName ? this.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.flexstore.setvalue('currentGroupType', this.generic_master_store.groupType);
    var PageName = 'Edit:' + this.flexstore.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
  }
  onChange(event) {
    this.flexstore.setvalue(event.target.name, event.target.value);
  }

  handleSubmit(event) {
    this.modal_store.modal.modalBtnTxt = 'Update';
    this.modal_store.modal.serviceName = 'UpdateServerURL';
    this.modal_store.modal.modal_title = 'Update TRC Server URL in FlexPLM';
    this.modal_store.showModal(<p>Are you sure you want to update TRC server url in FlexPLM for all configs. </p>);
    event.preventDefault();
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
  render() {
//TODO : need to navigate the parenttemplate from edit desc of template
    return (
      <div>
        <Col xs={6} sm={8} smOffset={2} xsOffset={3} lg={8} lgOffset={2}>
          <AlertInstance modal_store={this.modal_store} />
        </Col>
        <Row>
         <Col xs={12}>
          <Navigator history={this.props.history} desc={'/Groups/UpdateServerURL'} type={'/Flex'} action={'Config'} source={'Template'} generic_master_store={this.props.generic_master_store} />
         </Col>
        </Row>
        <Row>
          <Grid>
            <Col xs={8} xsOffset={2}>
              <h3>Update TRC Server URL in FlexPLM</h3>
              <Thumbnail>
                <form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <FormGroup>
                      <ControlLabel>Old URL</ControlLabel>
                      <FormControl
                          type="text" placeholder="Old URL" name="oldURL" value={this.flexstore.oldURL}
                          onChange={this.onChange.bind(this)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>New URL</ControlLabel>
                      <FormControl
                        type="text" placeholder="New URL" name="newURL"
                        value={this.flexstore.newURL}
                        onChange={this.onChange.bind(this)}
                      />
                    </FormGroup>
                  </FormGroup>
                  <Button
                    bsStyle="primary" onClick={this.handleSubmit.bind(this)} block
                    disabled={this.flexstore.oldURL === '' || this.flexstore.newURL === '' || this.flexstore.oldURL === this.flexstore.newURL}
                  >Update</Button>
                </form>
              </Thumbnail>
            </Col>
          </Grid>
          <Button className="pull-left" bsStyle="warning" name="back" onClick={this.onClick.bind(this)}>
           Back
          </Button>
          <Button
            className="pull-right" name="EndPoints" bsStyle="info"
            onClick={this.onClick.bind(this)}
          >
            Endpoints
          </Button>
        </Row>
        <ModalInstance
          custom_store={this.flexstore}
          custom_history={this.props.history} service_name={'updateServerURL'} currentGroupName={this.generic_master_store.currentGroupName}
        />
        <NotificationContainer />
        {this.props.children}
      </div>
    );
  }
}

UpdateServerURL.propTypes = {
  store: React.PropTypes.object
};

export default UpdateServerURL;
