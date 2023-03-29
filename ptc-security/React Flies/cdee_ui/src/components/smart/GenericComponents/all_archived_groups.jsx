/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Thumbnail, Row, Col, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ModalInstance from '../../static/layout/modalinstance';
import GenericStatusMessage from './generic_status_component';
import Navigator from './navigator'
import { NotificationContainer, NotificationManager } from 'react-notifications';

@inject('modal_store', 'generic_master_store', 'breadcrumb_store')
@observer
class AllArchivedGroups extends React.Component {
  constructor(props) {
    super(props);
    this.modal_store = this.props.modal_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.state = {
    userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
    var PageName = 'ArchivedGroups';
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/ArchivedGroups' };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.props.generic_master_store.getArchivedGroups();
  }
  restoreGroup(groupName, groupType, tenantId) {
    this.props.generic_master_store.setvalue('currentGroupName', groupName);
    this.props.generic_master_store.setvalue('groupType', groupType);
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    this.props.generic_master_store.restoreGroup();
    NotificationManager.info('Restored Successfully', 'Restore', 1000);
  }
  deleteGroup(groupName, groupType, configsCount, tenantId) {
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    this.props.generic_master_store.setvalue('currentGroupName', groupName);
    this.props.generic_master_store.setvalue('groupType', groupType);
    this.modal_store.modal.modal_title = 'Hard Deletion of ' + groupName + ' Group';
    this.modal_store.modal.groupName = groupName;
    this.modal_store.modal.isHardDelete = true;
    this.modal_store.modal.modalBtnTxt = 'DeleteGroup';
    var template = (<p>Are you sure you want to delete: {groupName} Group Completely. The dependent systems and configuration will also delete</p>);
    if (configsCount > 0) {
      template = (
        <p>Are you sure you want to delete: {groupName} Group Completely.
          The group <b style={{ color: 'orange' }}> implementing {configsCount} Configs <i className="fa fa-exclamation-triangle"></i>
        </b> So please delete dependent configs and then delete current group</p>
      );
    }
    this.modal_store.showModal(template);
  }
  render() {
    var archivedGroupTiles = [];
    const delstyle = {
      color:'red',
        backgroundColor: 'white',
        border: 'none',
        boxShadow: 'none'
    };
    const btntransstyle = {
      backgroundColor: 'white',
      border: 'none',
      boxShadow: 'none'
    };
    const CountToolTip = (<Tooltip id="SourceConfigsCount"> No. of Configs </Tooltip>);
    this.props.generic_master_store.AllArchivedGroups.map(archivedGroup => {
      var tempHeader = '';
      if (archivedGroup.dataSourceType !== '') {
        tempHeader = (
          <div className="thingHeader">
            <Badge className="badge_thing_name" style={{ backgroundColor: this.props.generic_master_store.short_name_tag_color[archivedGroup.dataSourceType]['color'] }}>
                {archivedGroup.dataSourceType}</Badge>
            <OverlayTrigger placement="top" overlay={CountToolTip} trigger={['hover', 'focus']}>
              <Badge className="badge_canbeusable" bsStyle={archivedGroup.configsCount === 0 ? null : 'success'}>
                {archivedGroup.configsCount}
              </Badge>
            </OverlayTrigger>
          </div>
        );
      } else {
        tempHeader = (
          <div className="thingHeader">
            <Badge className="badge_thing_name" style={{ backgroundColor: this.props.generic_master_store.short_name_tag_color['Mapping']['color'] }}>
                {this.props.generic_master_store.short_name_tag_color['Mapping']['short_name']}</Badge>
            <OverlayTrigger placement="top" overlay={CountToolTip} trigger={['hover', 'focus']}>
              <Badge className="badge_canbeusable" style={{ backgroundColor: '#e2e5ef' }}>
                {archivedGroup.configsCount}
              </Badge>
            </OverlayTrigger>
          </div>
        );
      }
      archivedGroupTiles.push(
        <Col key={archivedGroup.Name} xs={12} sm={6} md={6} lg={4}>
          <Thumbnail className="thumbnail-height">
            {tempHeader}
            <div className="thingMainbody">
              <h3>{archivedGroup.Name}</h3>
              <p className="test">{archivedGroup.Description}</p>
              <p className="test">{archivedGroup.tenantId ? archivedGroup.tenantId : ''}</p>
            </div>
            <div className="thingFooter">
              <div className="footer-links">
                <Button disabled = {this.state.userCheck === false} className="button-restore"style={btntransstyle} onClick={this.restoreGroup.bind(this, archivedGroup.Name, archivedGroup.groupType, archivedGroup.tenantId)} >
                  Restore
                </Button><font className="font-sep-archieve" color="#000000">|</font>
                <Button disabled = {this.state.userCheck === false} className="button-delete-archieve" style={delstyle} onClick={this.deleteGroup.bind(this, archivedGroup.Name, archivedGroup.groupType, archivedGroup.configsCount, archivedGroup.tenantId)} >
                  Delete
                </Button>
              </div>
            </div>
          </Thumbnail>
        </Col>
      );
    });
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Navigator history={this.props.history} action={'archivedGroups'} />
          </Col>
        </Row>
        <Row className="things-style">
         {archivedGroupTiles}
        </Row>
        <div hidden={archivedGroupTiles.length !== 0}>
          <GenericStatusMessage statusMsg={'There are No ArchivedGroups'} />
        </div>
        <ModalInstance
          custom_store={this.props.generic_master_store}
          custom_history={this.props.history} service_name={'DeleteGroup'}
        />
        <NotificationContainer />
      </div>
    );
  }
}

AllArchivedGroups.propTypes = {
  store: React.PropTypes.object
};

export default AllArchivedGroups;
