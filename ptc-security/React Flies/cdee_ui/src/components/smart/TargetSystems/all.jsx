/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Thumbnail, Col, Button, Tooltip, Badge, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FlexStore from '../../../stores/FlexStore';
import ModalInstance from '../../static/layout/modalinstance';
import GenericStatusMessage from '../GenericComponents/generic_status_component';
import {NotificationManager,NotificationContainer} from 'react-notifications';

@inject('modal_store')
@observer
class AllTargetSystems extends React.Component {
  constructor(props) {
    super(props);
      this.modal_store = this.props.modal_store;
    this.flex_store = new FlexStore(this.props.match.params.name);
    this.state = {
    userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
    this.props.generic_master_store.getAllGroups('target');
  }
  viewGroupConfigs(dataSourceType, group, tenantId) {
    this.props.generic_master_store.setvalue('currentGroupName', group);
      this.props.history.push((dataSourceType==='Static'?dataSourceType+'File':dataSourceType)+(dataSourceType==='Flex' || dataSourceType==='Socket'?'':'Client')+'/'+group);
      this.props.generic_master_store.setvalue('tenantID', tenantId);
  }
  editGroup(endPointsPath, dataSourceType, group, tenantId) {
    this.props.generic_master_store.setvalue('currentGroupName', group);
    this.props.generic_master_store.setvalue('endPointsPath', endPointsPath);
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    this.props.generic_master_store.getGroupDescription;
    this.props.history.push('Groups/Edit/'+group);
    this.props.generic_master_store.dataSourceType = dataSourceType;
  }
  responseCallback(){
    var response = this.flex_store.ServerStatus;
    if(response && Object.keys(response).length) {
      if(response.status === 'Success') {
        NotificationManager.success('Configs success are '+response.value, 'Success', 3000);
      }else if(response.status ===  'Failure'){
        NotificationManager.warning('Configs failed are '+response.value, 'Failed', 8000);
      }
      else{
        NotificationManager.error(''+response.status,'Failed',4000);
      }
    }
  }
  updateGroup(groupName, tenantID){
    this.flex_store.UpdateConfigurations(groupName,this.responseCallback.bind(this));
  }
  deleteGroup(groupName, tenantId) {
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    this.modal_store.modal.modal_title = 'Partial Deletion of ' + groupName + ' Group';
    this.modal_store.modal.groupName = groupName;
    this.modal_store.modal.isHardDelete = false;
    this.modal_store.modal.modalBtnTxt = 'DeleteGroup';
    this.modal_store.showModal(<p style={{wordWrap: 'break-word'}}>Are you sure you want to delete: {groupName} Group</p>);
  }
  render() {
    var updateSchema = (<Tooltip id="update-schema"><strong>Fetch & update Schema from FlexPLM Server</strong></Tooltip>);
    var targetGroupTiles = [];
    const delstyle = {
      color:'red',
        backgroundColor: 'white',
        border: 'none',
        boxShadow: 'none'
    };
    var updatestyle = {
      color: 'black',
      background: 'white'
    };
    const btntransstyle = {
      backgroundColor: 'white',
      border: 'none',
      boxShadow: 'none'
    };
    const CountToolTip = (<Tooltip id="TargetConfigsCount"># of Endpoints</Tooltip>);
    this.props.generic_master_store.TargetGroups.map(targetGroup => {
      var path=targetGroup.Name;
      var viewPath = '/Flex/'+ path;
      var editPath = '/Groups/Edit/'+path;
      if (targetGroup.dataSourceType === 'Rest') {
        viewPath = '/RestClient/'+ path;
      } else if (targetGroup.dataSourceType === 'Soap') {
        viewPath = '/SoapClient/'+ path;
        editPath = '/Groups/SoapEdit/'+path;
      } else if (targetGroup.dataSourceType === 'Socket') {
        viewPath = '/Socket/'+ path;
        editPath = '/Groups/SocketEdit/'+path;
      } else if (targetGroup.dataSourceType === 'Static') {
        viewPath = '/StaticFileClient/'+ path;
      } else if (targetGroup.dataSourceType === 'DataBase') {
        viewPath = '/DataBase/'+ path;
      }else if (targetGroup.dataSourceType === 'FTP') {
        viewPath = '/FTP/'+ path;
        editPath = '/Groups/FTPEdit/'+path;
    }else if (targetGroup.dataSourceType === 'Google Pub/Sub') {
      viewPath = '/GooglePubSub/'+ path;
      editPath = '/Groups/GooglePubSubEdit/'+path; 
    }else {
        editPath = '/Groups/FlexEdit/'+path;
      }
      var tenant = (
          <div><strong>TenantId: </strong><span className="test">{targetGroup.tenantId}</span></div>
      );
      targetGroupTiles.push(
        <Col key={targetGroup.Name+'-'+targetGroup.tenantId} xs={12} sm={6} md={6} lg={4}>
          <Thumbnail className="thumbnail-height">
            <div className="thingHeader">
              <Badge
                className="badge_target_thing_name"
                style={{ backgroundColor: this.props.generic_master_store.short_name_tag_color[targetGroup.dataSourceType]['color'] }}>
                {targetGroup.dataSourceType}</Badge>
              <OverlayTrigger placement="top" overlay={CountToolTip} trigger={['hover', 'focus']}>
                <Badge className="badge_target_icon" bsStyle={targetGroup.configsCount === 0 ? null : 'success'}>
                  {targetGroup.configsCount}
                </Badge>
              </OverlayTrigger>
            </div>
            <div className="thingMainbody">
              <h3 style={{wordWrap: 'break-word'}}>{targetGroup.Name}</h3>
              <p className="test">{targetGroup.Description}</p>
                {tenant}
            </div>
            <div className="thingFooter">
              <div className="footer-links">
                <Link className="" to={viewPath} onClick={this.viewGroupConfigs.bind(this, targetGroup.dataSourceType, targetGroup.Name, targetGroup.tenantId)}><font color="#3BAFDA"> Endpoints </font></Link> &nbsp;&nbsp;<font color="#ff8c1a">|</font>&nbsp;&nbsp;
                <Link className="" to={editPath} onClick={this.editGroup.bind(this, viewPath, targetGroup.dataSourceType, targetGroup.Name, targetGroup.tenantId)}><font color="#ff8c1a"> Edit </font></Link> &nbsp;&nbsp;<font color="#000000">|</font>&nbsp;&nbsp;&nbsp;
                <Button style={delstyle} disabled = {this.state.userCheck === false} className="button-delete" onClick={this.deleteGroup.bind(this, targetGroup.Name, targetGroup.tenantId)}>
                Delete
                </Button><font hidden ={targetGroup.dataSourceType !=='Flex'} className="del-sep" color="#ff8c1a">|</font>&nbsp;&nbsp;&nbsp;
                <font hidden = {targetGroup.dataSourceType !== 'Flex'}>
                <OverlayTrigger placement="top" overlay={updateSchema}>
                <Button style={btntransstyle}  className="button-update" onClick = {this.updateGroup.bind(this,targetGroup.Name, targetGroup.tenantId)}>
                  Update Schema
                </Button>
                </OverlayTrigger>
                </font>
              </div>
            </div>
          </Thumbnail>
        </Col>
      );
    });
    return (
      <div>
        {targetGroupTiles}
        <div hidden={targetGroupTiles !== 0}>
          <GenericStatusMessage statusMsg={'There are no target systems created yet'} />
        </div>
        <ModalInstance
          custom_store={this.props.generic_master_store} groupType={'target'}
          custom_history={this.props.history} service_name={'DeleteGroup'}
        />
        <NotificationContainer/>
      </div>
    );
  }
}

AllTargetSystems.propTypes = {
  store: React.PropTypes.object
};

export default AllTargetSystems;
