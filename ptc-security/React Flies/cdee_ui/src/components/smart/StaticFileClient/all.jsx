/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Thumbnail, Col, Row, Modal, Button } from 'react-bootstrap';
import StaticNew from './new';
import GridSorter from '../GenericComponents/grid_sorter';
import Navigator from '../GenericComponents/navigator';
import GenericStatusMessage from '../GenericComponents/generic_status_component';

@inject('generic_master_store')
@observer
class AllStaticFileClientThings extends React.Component {
  constructor(props) {
    super(props);
    this.static_file_client_store = this.props.static_file_client_store;
    this.state = {
      show: false,
      disable_modal_tabs: true,
      show_new_thing_form: true,
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }
  componentWillMount() {
    this.static_file_client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName?this.props.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.static_file_client_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    this.static_file_client_store.getStaticFileConfigs;
  }
  addButtonClick() {
    this.static_file_client_store.new_config_name = '';
    this.static_file_client_store.new_config_description = '';
    this.setState({ show: true, disable_modal_tabs: true, show_new_thing_form: true });
  }
  enable_modal_tabs() {
    this.setState({ disable_modal_tabs: false, show_new_thing_form: false });
    this.props.history.push('/'+this.props.match.url.split('/')[1] + '/Edit/' + this.static_file_client_store.name);
  }
  render() {
    var addStyle = {
      color: 'orange',
      background: '#f7f7f7'
    };
    let close = () => this.setState({ show: false });
    var thingsSorter = '';
    if (this.static_file_client_store.StaticFileConfigs.length > 0) {
      thingsSorter = (
        <GridSorter
          things={this.static_file_client_store.StaticFileConfigs}
          addButtonClick={this.addButtonClick.bind(this)} url={this.props.match.url}
          history={this.props.history} match={this.props.match}
          generic_master_store={this.props.generic_master_store}
          tempStore={this.static_file_client_store}
        />
      );
    } else {
      thingsSorter = (<GenericStatusMessage statusMsg={'There is no configuration created yet'} />);
    }
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Navigator history={this.props.history} action={'All'} type={'StaticFileClient'} source={'Template'} generic_master_store={this.props.generic_master_store} />
            <h3 className="title-fixed">Static Configuration</h3>
          </Col>
        </Row>
        <Row className="things-style">
          <Col key={'StaticNew'} xs={12} sm={6} md={6} lg={4}>
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
          <Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title">
            <Modal.Header closeButton>
              <h4>Create New StaticFile Config</h4>
            </Modal.Header>
            <Modal.Body>
              <StaticNew
                static_file_client_store={this.static_file_client_store}
                generic_master_store={this.props.generic_master_store}
                url={this.props.match.url} history={this.props.history}
                enable_modal_tabs={this.enable_modal_tabs.bind(this)}
                match={this.props.match}
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

AllStaticFileClientThings.propTypes = {
  store: React.PropTypes.object
};

export default AllStaticFileClientThings;
