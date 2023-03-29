/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Thumbnail, Col, Row, Modal, Panel, Button, ListGroupItem } from 'react-bootstrap';
import FlexNew from './new';
import GridSorter from '../GenericComponents/grid_sorter';
import Navigator from '../GenericComponents/navigator';
import GenericStatusMessage from '../GenericComponents/generic_status_component';

@inject('generic_master_store')
@observer
class AllFlexThings extends React.Component {
  constructor(props) {
    super(props);
    this.flexstore = this.props.flexstore;
    this.state = {
      show: false,
      disable_modal_tabs: true,
      show_new_thing_form: true,
      flexObjList: [],
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
    this.flexstore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName?this.props.generic_master_store.currentGroupName:this.props.match.params.groupName);
    this.flexstore.getFlexConfigs;
  }

  addButtonClick() {
    this.flexstore.new_config_name = '';
    this.flexstore.new_config_description = '';
    this.setState({ show: true, disable_modal_tabs: true, show_new_thing_form: true });
  }

  enableModalTabs() {
    this.setState({ disable_modal_tabs: false, show_new_thing_form: false });
  }

  updateFlexObjectList() {
    var f_os = [];
    if (this.flexstore.FlexObjects !== undefined) {
      this.flexstore.FlexObjects.map(f_o => {
        f_os.push(
          <ListGroupItem key={f_o} name={f_o} href="#" >
              {f_o}
          </ListGroupItem>
        );
      });
      this.setState({ flexObjList: f_os });
    }
  }

  updateFlexSelection(event) {
    this.flexObjList = [];
    if (event === 2) {
      this.flexstore.GetHostProperties;
    }
  }
  render() {
    var addStyle = {
      color: 'orange',
      background: '#f7f7f7'
    };
    let close = () => this.setState({ show: false });
    var thingsSorter = '';
    if (this.flexstore.FlexConfigs.length > 0) {
      thingsSorter = (
        <GridSorter
          things={this.flexstore.FlexConfigs} url={this.props.match.url}
          history={this.props.history} match={this.props.match}
          generic_master_store={this.props.generic_master_store}
          tempStore={this.flexstore}
        />);
    } else {
      thingsSorter = (<GenericStatusMessage statusMsg={'There is no configuration created yet'} />);
    }
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Navigator history={this.props.history} action={'All'} type={'Flex'} source={'Template'} generic_master_store={this.props.generic_master_store} />
            <h3 className="title-fixed">Flex Configuration</h3>
          </Col>
        </Row>
        <Row className="things-style">
          <Col key={'FlexNew'} xs={12} sm={6} md={6} lg={4}>
            <Thumbnail className="thumbnail-height thumbnail-select">
            <Button disabled = {this.state.userCheck === false} className="newthing-button" onClick={this.addButtonClick.bind(this)}>
            <div style = {addStyle}>
          <div className="newthing-font-icon"><i className="fa fa-plus-circle " aria-hidden="true"></i></div>
          <h1 className="newthing-font">Create Endpoint</h1>
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
              <h4>Create FlexPLM Endpoint</h4>
            </Modal.Header>
            <Modal.Body>
                  <Panel collapsible expanded={this.state.show_new_thing_form} className="navtab">
                    <FlexNew flexstore={this.flexstore} generic_master_store={this.props.generic_master_store} enableModalTabs={this.enableModalTabs.bind(this)}/>
                  </Panel>
                  <Panel collapsible expanded={!this.state.show_new_thing_form} className="navtab">
                    <h4>Config Name : </h4>{this.flexstore.new_config_name}
                    <h4>Config Description: </h4>{this.flexstore.new_config_description}
                    <Button className="pull-right" onClick={close}>close</Button>
                  </Panel>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    );
  }
}

AllFlexThings.propTypes = {
  store: React.PropTypes.object
};

export default AllFlexThings;
