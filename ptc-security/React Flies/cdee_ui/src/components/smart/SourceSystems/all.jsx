/* Copyright(C) 2015-2018 - Quantela Inc
 * All Rights Reserved
* Unauthorized copying of this file via any medium is strictly prohibited
* See LICENSE file in the project root for full license information
*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Thumbnail, Col, Tooltip, Badge, Button, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ModalInstance from '../../static/layout/modalinstance';
import FlexStore from '../../../stores/FlexStore';
import GenericStatusMessage from '../GenericComponents/generic_status_component';
import {NotificationManager,NotificationContainer} from 'react-notifications';

@inject('modal_store' , 'generic_master_store')
@observer
class AllSourceSystems extends React.Component {
  constructor(props) {
    super(props);
    this.modal_store = this.props.modal_store;
    this.flex_store = new FlexStore(this.props.match.params.name);
    this.state = {
    userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }
  componentWillMount() {
    this.props.generic_master_store.getAllGroups('source');
  }
  viewGroupConfigs(dataSourceType, group, tenantId) {
    this.props.generic_master_store.setvalue('currentGroupName', group);
    this.props.history.push((dataSourceType==='Static'?dataSourceType+'File':dataSourceType)+(dataSourceType==='Flex' || dataSourceType==='Socket'?'':'Client')+'/'+group);
    this.props.generic_master_store.setvalue('tenantID', tenantId);
  }
  editGroup(endPointsPath, dataSourceType, group, tenantId) {
    this.props.generic_master_store.setvalue('currentGroupName', group);
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    this.props.generic_master_store.setvalue('endPointsPath', endPointsPath);
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
        NotificationManager.warning('Configs failed are '+response.value, 'Failed', 4000);
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
    this.modal_store.modal.modal_title = 'Delete : ' + groupName + ' Group';
    this.modal_store.modal.groupName = groupName;
    this.modal_store.modal.isHardDelete = false;
    this.modal_store.modal.modalBtnTxt = 'Confirm';
    this.modal_store.showModal(<p  style={{ textOverflow: 'ellipsis' }}>Selected Group will be deleted from TRC</p>);
  }
  render() {
    var updateSchema = (<Tooltip id="update-schema"><strong>Fetch & update Schema from FlexPLM Server</strong></Tooltip>);
    var sourceGroupTiles = [];
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
    const CountToolTip = (<Tooltip id="SourceConfigsCount"># of Endpoints </Tooltip>);
    this.props.generic_master_store.SourceGroups.map(sourceGroup => {
      var path=sourceGroup.Name;
      var viewPath = '/Flex/'+ path;
      var editPath = '/Groups/Edit/'+path;
      if (sourceGroup.dataSourceType === 'Rest') {
        viewPath = '/RestClient/'+ path;
      } else if (sourceGroup.dataSourceType === 'Soap') {
        viewPath = '/SoapClient/'+ path;
        editPath = '/Groups/SoapEdit/'+path;
      } else if (sourceGroup.dataSourceType === 'Socket') {
        viewPath = '/Socket/'+ path;
        editPath = '/Groups/SocketEdit/'+path;
      } else if (sourceGroup.dataSourceType === 'DataBase') {
        viewPath = '/DataBase/'+ path;
        editPath = '/Groups/DataBaseEdit/'+path;
      }else if (sourceGroup.dataSourceType === 'Static') {
        viewPath = '/StaticFileClient/'+ path;
      } else if (sourceGroup.dataSourceType === 'FTP') {
        viewPath = '/FTP/'+ path;
        editPath = '/Groups/FTPEdit/'+path;
      }else if (sourceGroup.dataSourceType === 'Google Pub/Sub'){
        viewPath = '/GooglePubSub/'+ path;
        editPath = '/Groups/GooglePubSubEdit/'+path;
      }else{
        editPath = '/Groups/FlexEdit/'+path;
      }
      var tenant = (
          <div><strong>TenantId: </strong><span className="test">{sourceGroup.tenantId}</span></div>
      );
      sourceGroupTiles.push(
        <Col key={sourceGroup.Name+'-'+sourceGroup.tenantId} xs={12} sm={6} md={6} lg={4}>
          <Thumbnail className="thumbnail-height">
            <div className="thingHeader">
              <Badge className="badge_thing_name" style={{ backgroundColor: this.props.generic_master_store.short_name_tag_color[sourceGroup.dataSourceType] && this.props.generic_master_store.short_name_tag_color[sourceGroup.dataSourceType]['color'] }}>
                  {sourceGroup.dataSourceType}</Badge>
              <OverlayTrigger placement="top" overlay={CountToolTip} trigger={['hover', 'focus']}>
                <Badge className="badge_canbeusable" bsStyle={sourceGroup.configsCount === 0 ? null : 'success'}>
                  {sourceGroup.configsCount}
                </Badge>
              </OverlayTrigger>
            </div>
            <div className="thingMainbody">
              <h3 style={{wordWrap: 'break-word', whiteSpace: 'initial'}}>{sourceGroup.Name}</h3>
              <p className="test">{sourceGroup.Description}</p>
                {tenant}
            </div>
            <div className="thingFooter">
            <div className="footer-links">
              <Link className="" to={viewPath} onClick={this.viewGroupConfigs.bind(this, sourceGroup.dataSourceType, sourceGroup.Name, sourceGroup.tenantId)}><font color="#3BAFDA"> Endpoints </font></Link> &nbsp;&nbsp;<font color="#ff8c1a">|</font>&nbsp;&nbsp;
              <Link className="" to={editPath} onClick={this.editGroup.bind(this, viewPath, sourceGroup.dataSourceType, sourceGroup.Name, sourceGroup.tenantId)}><font color="#ff8c1a"> Edit </font></Link> &nbsp;&nbsp;<font color="#000000">|</font>&nbsp;&nbsp;&nbsp; 
              <Button disabled = {this.state.userCheck === false} style={delstyle} className="button-delete" onClick = {this.deleteGroup.bind(this,sourceGroup.Name, sourceGroup.tenantId)} >
                 Delete
                </Button><font hidden ={sourceGroup.dataSourceType !=='Flex'} className="del-sep" color="#ff8c1a">|</font>
                <font hidden ={sourceGroup.dataSourceType !=='Flex'}>
                <OverlayTrigger placement="top" overlay={updateSchema}>
              <Button style={btntransstyle} className="button-update" onClick = {this.updateGroup.bind(this,sourceGroup.Name, sourceGroup.tenantId)} >
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
        {sourceGroupTiles}
        <div hidden={sourceGroupTiles !== 0}>
          <GenericStatusMessage statusMsg={'There are no source systems created yet'} />
        </div>
        <ModalInstance
          custom_store={this.props.generic_master_store} groupType={'source'}
          custom_history={this.props.history} service_name={'DeleteGroup'}
        />
        <NotificationContainer/>
      </div>
    );
  }
}

AllSourceSystems.propTypes = {
  store: React.PropTypes.object
};

export default AllSourceSystems;