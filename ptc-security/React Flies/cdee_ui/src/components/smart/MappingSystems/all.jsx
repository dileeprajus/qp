/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Thumbnail, Col, Button, Tooltip, Badge, Row, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ModalInstance from '../../static/layout/modalinstance';
import GenericStatusMessage from '../GenericComponents/generic_status_component';

@inject('modal_store', 'mapping_store' , 'generic_master_store')
@observer
class AllMappingSystems extends React.Component {
  constructor(props) {
    super(props);
      this.modal_store = this.props.modal_store;
      this.mapping_store = this.props.mapping_store;
      this.state ={
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
      };
  }

  componentWillMount() {
    this.props.generic_master_store.getAllGroups('mapping');
  }
  viewGroupConfigs(mappingGroup, dataSourceType, group, tenantId) {
    this.props.generic_master_store.setvalue('currentGroupName', group);
    this.props.generic_master_store.setvalue('selectedSourceGroup', mappingGroup.selectedSourceGroup);
    this.props.generic_master_store.setvalue('selectedTargetGroup', mappingGroup.selectedTargetGroup);
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    this.props.history.push('/Mapping/'+group);
  }
  editGroup(mappingGroup, dataSourceType, group, tenantId) {
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    this.props.generic_master_store.setvalue('currentGroupName', group);
    this.props.generic_master_store.setvalue('endPointsPath', '/Mapping');
    this.props.history.push('Groups/Edit/'+group);
  }
  deleteGroup(groupName, tenantId) {
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    this.modal_store.modal.modal_title = 'Partial Deletion of ' + groupName + ' Group';
    this.modal_store.modal.groupName = groupName;
    this.modal_store.modal.modalBtnTxt = 'DeleteGroup';
    this.modal_store.modal.isHardDelete = false;
    this.modal_store.showModal(<p style={{wordWrap: 'break-word'}}>Are you sure you want to delete: {groupName} Group</p>);
  }

  render() {
    var mappingGroupTiles = [];
    const delstyle = {
      color:'red',
        backgroundColor: 'white',
        border: 'none',
        boxShadow: 'none'
    };
    var  addstyle = {
      color: 'red',
      background: 'white'
    };
    const CountToolTip = (<Tooltip id="MappingConfigsCount"># of Endpoints </Tooltip>);
    this.props.generic_master_store.MappingGroups.map(mappingGroup => {
      var viewPath = '/Mapping/' + mappingGroup.Name;
      var editPath = '/Groups/Edit/' + mappingGroup.Name;
      var tenant = (
        <div className="tenantMarginStyle"><strong>TenantId: </strong><span className="test">{mappingGroup.tenantId}</span></div>
      );
      mappingGroupTiles.push(
        <Col key={mappingGroup.Name+'-'+mappingGroup.tenantId} xs={12} sm={6} md={6} lg={4}>
          <Thumbnail className="thumbnail-height">
            <div className="thingHeader">
              <Badge className="badge_thing_name" style={{ backgroundColor: this.props.generic_master_store.short_name_tag_color['Mapping']['color'] }}>
                  {this.props.generic_master_store.short_name_tag_color['Mapping']['short_name']}</Badge>
              <OverlayTrigger placement="top" overlay={CountToolTip} trigger={['hover', 'focus']}>
                <Badge className="badge_canbeusable" bsStyle={mappingGroup.configsCount === 0 ? null : 'success'}>
                  {mappingGroup.configsCount}
                </Badge>
              </OverlayTrigger>
            </div>
            <Row className="thingMainbody">
              <h3 style={{wordWrap: 'break-word', paddingLeft: '15px'}}>{mappingGroup.Name}</h3>
              <p  style={{paddingLeft: '15px'}} className="test">{mappingGroup.Description}</p>
                {tenant}
            </Row>
            <div className="thingFooter">
              <div className="footer-links">
                <Link className="" to={viewPath} onClick={this.viewGroupConfigs.bind(this, mappingGroup, mappingGroup.dataSourceType, mappingGroup.Name, mappingGroup.tenantId)}><font color="#3BAFDA"> Endpoints </font></Link> &nbsp;&nbsp;<font color="#ff8c1a">|</font>&nbsp;&nbsp;
                <Link className="" to={editPath} onClick={this.editGroup.bind(this, mappingGroup, mappingGroup.dataSourceType, mappingGroup.Name, mappingGroup.tenantId)}><font color="#ff8c1a"> Edit </font></Link> &nbsp;&nbsp;<font color="#000000">|</font>&nbsp;&nbsp;&nbsp;
                <Button style={delstyle} disabled = {this.state.userCheck === false}
                  className="button-delete-map"
                  onClick={this.deleteGroup.bind(this, mappingGroup.Name, mappingGroup.tenantId)}
                >Delete
                </Button>
              </div>
            </div>
          </Thumbnail>
        </Col>
      );
    });
    return (
      <div>
        {mappingGroupTiles}
        <div hidden={mappingGroupTiles !== 0}>
          <GenericStatusMessage statusMsg={'There are no mapping systems created yet'} />
        </div>
        <ModalInstance
            custom_store={this.props.generic_master_store} groupType={'mapping'}
            custom_history={this.props.history} service_name={'DeleteGroup'}
        />
      </div>
    );
  }
}

AllMappingSystems.propTypes = {
  store: React.PropTypes.object
};

export default AllMappingSystems;
