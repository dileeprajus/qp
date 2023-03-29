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
import SocketNew from './new';

@inject('generic_master_store')

@observer

class AllSocketConfigs extends React.Component {
  constructor(props) {
    super(props);
    this.socketStore = this.props.socketStore;
    this.state = {
      show: false,
      disable_modal_tabs: true,
      show_new_thing_form: true,
      items: Array.apply(null, Array(100)).map((val, index) => 'Item ' + index)
    };
  }

  componentWillMount() {
    this.socketStore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName?this.props.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.socketStore.setvalue('currentTenantID', this.socketStore.currentTenantID ? this.socketStore.currentTenantID : this.props.generic_master_store.tenantID);
    this.socketStore.getSocketConfigs;
  }

  addButtonClick() {
    this.socketStore.new_config_name = '';
    this.socketStore.new_config_description = '';
    this.setState({ show: true, disable_modal_tabs: true, show_new_thing_form: true });
  }

  enableModalTabs() {
    this.setState({ disable_modal_tabs: false, show_new_thing_form: false });
    this.props.history.push('/'+this.props.match.url.split('/')[1] + '/Edit/' + this.socketStore.new_config_name);
  }

  render() {
    var addStyle = {
      color: 'orange',
      background: '#f7f7f7'
    };

    var configsSorter = '';
    if (this.socketStore.SocketConfigs.length > 0) {
      configsSorter = (
        <GridSorter
          things={this.socketStore.SocketConfigs} url={this.props.match.url}
          history={this.props.history} match={this.props.match}
          generic_master_store={this.props.generic_master_store}
          tempStore={this.socketStore}
        />);
    } else {
      configsSorter = (<GenericStatusMessage statusMsg={'There is no configuration created yet'} />);
    }
    let close = () => this.setState({ show: false });
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Navigator history={this.props.history} action={'All'} type={'Socket'} tempStore={this.socketStore} source={'Template'} generic_master_store={this.props.generic_master_store} />
            <h3 className="title-fixed">Socket Configuration</h3>
          </Col>
        </Row>
        <Row className="things-style">
          <Col key={'SocketNew'} xs={12} sm={6} md={6} lg={4}>
            <Thumbnail className="thumbnail-height thumbnail-select">
              <Button className="newthing-button" onClick={this.addButtonClick.bind(this)}>
                <div style={addStyle} >
                  <div className="newthing-font-icon"><i className="fa fa-plus-circle " aria-hidden="true"></i></div>
                  <h1 className="newthing-font">Create New Config</h1>
                </div>
              </Button>
            </Thumbnail>
          </Col>
          {configsSorter}
        </Row>
        <div className="modal-container">
          <Modal
            show={this.state.show}
            onHide={close}
            container={this}
            aria-labelledby="contained-modal-title"
          >
            <Modal.Header closeButton>
              <h4>Create New SocketConfig</h4>
            </Modal.Header>
            <Modal.Body>
              <SocketNew
                socketStore={this.socketStore} generic_master_store={this.props.generic_master_store} enableModalTabs={this.enableModalTabs.bind(this)} url={this.props.match.url}
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


AllSocketConfigs.propTypes = {
  store: React.PropTypes.object
};

export default AllSocketConfigs;
