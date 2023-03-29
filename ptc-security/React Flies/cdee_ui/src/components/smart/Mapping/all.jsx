/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Col, Thumbnail } from 'react-bootstrap';
import MappingThingNew from './new';
import GridSorter from '../GenericComponents/grid_sorter';
import GenericStatusMessage from '../GenericComponents/generic_status_component';
import {NotificationContainer, NotificationManager} from 'react-notifications';

@inject('generic_master_store', 'modal_store')
@observer
class AllMappingThings extends React.Component {
  constructor(props) {
    super(props);
    this.modal_store = this.props.modal_store;
    this.state = {
      show: false,
      disable_modal_tabs: true,
      show_new_thing_form: true,
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
    this.props.mapping_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName?this.props.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.props.mapping_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    this.props.mapping_store.setvalue('name', 'MappingConfig');
    this.props.mapping_store.getMappingConfigs;
    this.props.mapping_store.setvalue('async_callback', this.asyncCallBack.bind(this));
  }

  asyncCallBack(mappingThis) {
   mappingThis.setvalue('async_callback', null);
   this.createAlert();
  }

  createAlert() {
    if (this.modal_store.modal.notification === true) {
      NotificationManager.success('Created ' + this.props.mapping_store.currentGroupName+' Group Successfully', 'Success', 1000);
      this.modal_store.modal.notification = false;
    }
  }
  handleSubmit() {

  }
  addButtonClick() {
    this.setState({ show: true, show_new_thing_form: true });
  }

  render() {
    var addStyle = {
      color: 'orange',
      background: '#f7f7f7'
    };
    let close = () => this.setState({ show: false });
    var thingsSorter = '';
    if (this.props.mapping_store.MappingConfigs.length > 0) {
      thingsSorter = (
        <GridSorter
          things={this.props.mapping_store.MappingConfigs} url={this.props.match.url}
          history={this.props.history} match={this.props.match}
          generic_master_store={this.props.generic_master_store}
          tempStore={this.props.mapping_store}
        />);
    } else {
      thingsSorter = (<GenericStatusMessage statusMsg={'There is no configuration created yet'} />);
    }
    return (
      <div>
        <Col key={'MapNew'} xs={12} sm={6} md={6} lg={4}>
          <Thumbnail className="thumbnail-height thumbnail-select">
            <Button disabled = {this.state.userCheck === false} className="newthing-button" onClick={this.addButtonClick.bind(this)}>
              <div style={addStyle} >
                <div className="newthing-font-icon"><i className="fa fa-plus-circle " aria-hidden="true"></i></div>
                <h1 className="newthing-font">Create New Config</h1>
              </div>
            </Button>
          </Thumbnail>
        </Col>
        {thingsSorter}
        <NotificationContainer/>
        <div className="modal-container">
          <Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title">
            <Modal.Header closeButton>
              <h4>Create New Mapping Config</h4>
            </Modal.Header>
            <Modal.Body>
              <MappingThingNew
                mapping_store={this.props.mapping_store}
                generic_master_store={this.props.generic_master_store}
                url={this.props.match.url} history={this.props.history}
                match={this.props.match}
                modalClose={close}
              />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}

AllMappingThings.propTypes = {
  store: React.PropTypes.object
};

export default AllMappingThings;
