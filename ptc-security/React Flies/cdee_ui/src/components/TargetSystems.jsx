/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable, BACKEND */
import React from 'react';
import { inject, observer } from 'mobx-react';
import AllTargetSystems from './smart/TargetSystems/all';
import { Col, Row, Thumbnail, Button, Modal } from 'react-bootstrap';
import GroupNew from './smart/Groups/new';
import Navigator from './smart/GenericComponents/navigator';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class TargetTemplates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    var PageName = 'TargetSystems';
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/TargetSystems' };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.props.generic_master_store.groupType = 'target';
    this.props.generic_master_store.getAllGroups('target');
  }
  addButtonClick() {
    this.props.generic_master_store.setvalue('newGroupName', '');
    this.props.generic_master_store.setvalue('newGroupDescription', '');
    this.props.generic_master_store.setvalue('dataSourceType', '');
    this.props.generic_master_store.setvalue('tenantID', 'PTC');
    this.props.generic_master_store.setvalue('category', 'General');

    this.setState({ show: true });
  }
  render() {
    let close = () => this.setState({ show: false });
    var addStyle = {
      color: 'orange',
      background: '#f7f7f7'
    };
    return (
      <div>
        <Row>
          <div className="header-fixed">
            <Col xs={12} className="text-align">
            <Navigator history={this.props.history} action={'TargetSystems'} type={'/TargetSystems'} tempStore={this.props.generic_master_store} source={'TargetSystems'}/>
            <h3 className="title-fixed">Target Systems</h3>
          </Col>
          </div>
          <div className="top-align">
            <Col key="NewTargetTemplateForm" xs={12} sm={6} md={6} lg={4}>
              <Thumbnail className="thumbnail-height thumbnail-select">
                <Button disabled = {this.state.userCheck === false} className='newthing-button' onClick={this.addButtonClick.bind(this)}>
                  <div style={addStyle} >
                    <div className="newthing-font-icon"><i className="fa fa-plus-circle " aria-hidden="true"></i></div>
                    <h1 className="newthing-font">Create Target System</h1>
                  </div>
                </Button>
              </Thumbnail>
            </Col>
            <div className="modal-container">
              <Modal show={this.state.show} onHide={close} container={this} aria-labelledby="contained-modal-title">
                <Modal.Header closeButton>
                  <h4>Create New Target System</h4>
                </Modal.Header>
                <Modal.Body>
                  <GroupNew
                    generic_master_store={this.props.generic_master_store} template={'Target'}
                    history={this.props.history}
                  />
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
              </Modal>
            </div>
            <AllTargetSystems
              history={this.props.history} match={this.props.match}
              generic_master_store={this.props.generic_master_store}
            />
          </div>
        </Row>
      </div>
    );
  }
}

TargetTemplates.propTypes = {
  store: React.PropTypes.object
};

export default TargetTemplates;
