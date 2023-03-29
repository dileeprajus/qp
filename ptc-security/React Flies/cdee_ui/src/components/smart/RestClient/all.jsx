/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Thumbnail, Col, Button, Row } from 'react-bootstrap'
import GridSorter from '../GenericComponents/grid_sorter';
import Navigator from '../GenericComponents/navigator';
import GenericStatusMessage from '../GenericComponents/generic_status_component';
import RestClientNew from './new';

@inject('generic_master_store')
@observer
class AllRestClientThings extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.state = {
      show: false,
      disable_modal_tabs: true,
      show_new_thing_form: true,
      items: Array.apply(null, Array(100)).map((val, index) => 'Item ' + index),
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
    this.rest_client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName?this.props.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.rest_client_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID)
    this.rest_client_store.getRestConfigs;
  }

  addButtonClick(){
    this.rest_client_store.new_config_name = '';
    this.rest_client_store.new_config_description = '';
    this.setState({ show: true,disable_modal_tabs:true,show_new_thing_form: true});
  }

  enable_modal_tabs(tenantId) {
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    this.setState({ disable_modal_tabs: false, show_new_thing_form: false });
    this.props.history.push('/'+this.props.match.url.split('/')[1] + '/Edit/' + this.rest_client_store.name);
  }

  render() {
    var addStyle = {
      color: 'orange',
      background: '#f7f7f7'
    };

    var thingsSorter = '';
    if (this.rest_client_store.RestConfigs.length > 0) {
      thingsSorter = (
        <GridSorter
          things={this.rest_client_store.RestConfigs} url={this.props.match.url}
          history={this.props.history} match={this.props.match}
          generic_master_store={this.props.generic_master_store}
          tempStore={this.rest_client_store}
        />);
    } else {
      thingsSorter = (<GenericStatusMessage statusMsg={'There is no configuration created yet'} />);
    }
    let close = () => this.setState({ show: false });
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Navigator history={this.props.history} action={'All'} type={'RestClient'} tempStore={this.rest_client_store} source={'Template'} generic_master_store={this.props.generic_master_store} />
            <h3 className="title-fixed">Rest Configuration</h3>
          </Col>
        </Row>
        <Row className="things-style">
          <Col key={'RestNew'} xs={12} sm={6} md={6} lg={4}>
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
        </Row>
        <div className="modal-container">
          <Modal
            show={this.state.show}
            onHide={close}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header closeButton>
              <h4>Create New Rest Config</h4>
            </Modal.Header>
            <Modal.Body>
              <RestClientNew
                rest_client_store={this.rest_client_store} generic_master_store={this.props.generic_master_store} enable_modal_tabs={this.enable_modal_tabs.bind(this)} url={this.props.match.url}
                history={this.props.history} match={this.props.match}
              />
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        </div>
      </div>
    );
  }
}


AllRestClientThings.propTypes = {
  store: React.PropTypes.object
};

export default AllRestClientThings;
