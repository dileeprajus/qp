/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { Tooltip, OverlayTrigger, Button, Breadcrumb } from 'react-bootstrap';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class BreadcrumbInstance extends Component {

  constructor(props) {
    super(props);
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.generic_master_store = this.props.generic_master_store;
  }
  componentWillMount() {
    this.breadcrumb_store.Bread_crumb_obj = { name: 'Dashboard', path: '' };
  }
  gotoSelectedCrumb(crumb, e) {
    this.generic_master_store.setvalue('currentGroupName', crumb.groupName ? crumb.groupName : this.generic_master_store.currentGroupName);
    this.generic_master_store.setvalue('groupType', crumb.groupType ? crumb.groupType : this.generic_master_store.groupType);
    this.breadcrumb_store.current_crumb_name = e.target.name;
    this.breadcrumb_store.popBreadCrumbsItem();
  }
  customGoBack() {
    var temp_arr=this.breadcrumb_store.Bread_crumbs_arr;
   if(temp_arr.length===2){
      this.breadcrumb_store.Bread_crumbs_arr.length = temp_arr.length - 1;
    } else {
      this.breadcrumb_store.Bread_crumbs_arr.length = temp_arr.length - 1 ;
      this.props.routing.goBack();
    }
    if(this.breadcrumb_store.Bread_crumb_obj.name === 'ArchivedGroups' && this.props.routing.location.pathname==='/') {
        this.props.routing.goBack();
    }
    this.props.routing.goBack();
  }
  logoutTRC() {
    this.generic_master_store.setvalue('username', '');
    this.generic_master_store.setvalue('password', '');
    ieGlobalVariable.serverAppKey = '';
    this.props.history.push('/');
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function (event)
    {
    history.pushState(null, document.title, location.href);
    });
  }
  render() {
    const { goForward } = this.props.routing;
    var crumb_arr = [];
    this.breadcrumb_store.Bread_crumbs_arr.map(crumb => {
      crumb_arr.push(
        <Link
          key={crumb.name} to={crumb.path} name={crumb.name}
          onClick={this.gotoSelectedCrumb.bind(this, crumb)}
        >
          {' / ' + crumb.name}
        </Link>
      )
    });

    const DashboardToolTip = (<Tooltip id="Dashboard"> Dashboard </Tooltip>);
    const SettingsToolTip = (<Tooltip id="Settings"> Settings </Tooltip>);
    const MappingToolTip = (<Tooltip id="Mapping"> Mapping </Tooltip>);
    const LogoutToolTip = (<Tooltip id="Logout"> Logout </Tooltip>);
    const TargetThingsToolTip = (<
      Tooltip id="DestinationThings"
    > Target Systems </Tooltip>);
    const SourceThingsToolTip = (<
      Tooltip id="SourceThings"
    > Source Systems </Tooltip>);
    const LogsToolTip = (<Tooltip id="LogsMashup"> Monitoring Logs </Tooltip>);
    return (
      <div hidden={ieGlobalVariable.serverAppKey === ''}>
        <Breadcrumb style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Link to="/Dashboard" name="Home" onClick={this.gotoSelectedCrumb.bind(this, 'home')}>
            <i className="fa fa-home fa-lg"></i>
          </Link>
          <font className="brdcmb-font-size">{crumb_arr}</font>
          <OverlayTrigger placement="bottom" overlay={LogoutToolTip} trigger={['hover', 'focus']} container ={this}>
            <Link
              style={{ marginRight: '15px' }} className="pull-right" name="logout-nav-button"
              to="/" onClick={this.logoutTRC.bind(this)}
            ><i className="fa fa-sign-out fa-lg" aria-hidden="true"></i></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={LogsToolTip} trigger={['hover', 'focus']} container ={this}>
            <Link
              style={{ marginRight: '15px' }} className="pull-right" name="logs-nav-button"
              to="/LogsMonitoring"
            ><i className="fa fa-database fa-lg" aria-hidden="true"></i></Link>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={SettingsToolTip} trigger={['hover', 'focus']} container ={this}>
            <Link
              style={{ marginRight: '15px' }} className="pull-right" name="settings-nav-button"
              to="/Settings"
            ><i className="fa fa-cogs fa-lg" aria-hidden="true"></i>
            </Link>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={MappingToolTip} trigger={['hover', 'focus']} container ={this}>
            <Link
              style={{ marginRight: '15px' }} className="pull-right" name="settings-nav-button"
              to="/MappingSystems"
            ><i className="fa fa-random fa-lg" aria-hidden="true"></i></Link>
          </OverlayTrigger>

          <OverlayTrigger placement="bottom" overlay={TargetThingsToolTip} trigger={['hover', 'focus']} container ={this}>
            <Link
              style={{ marginRight: '15px' }} className="pull-right" name="settings-nav-button"
              to="/TargetSystems"
            ><i className="fa fa-download rotate-clock fa-lg" aria-hidden="true"></i></Link>
          </OverlayTrigger>


          <OverlayTrigger placement="bottom" overlay={SourceThingsToolTip} trigger={['hover', 'focus']} container={this}>
            <Link disabled
              style={{ marginRight: '15px' }} className="pull-right" name="settings-nav-button"
              to="/SourceSystems"
            ><i className="fa fa-upload rotate-anti-clock fa-lg" aria-hidden="true"></i></Link>
          </OverlayTrigger>


          <OverlayTrigger placement="bottom" overlay={DashboardToolTip} trigger={['hover', 'focus']} container ={this}>

            <Link
              style={{ marginRight: '15px' }} className="pull-right" name="stats-nav-button"
              to="/Dashboard"
            ><i className="fa fa-th-large fa-lg" aria-hidden="true"></i></Link>
          </OverlayTrigger>
        </Breadcrumb>
      </div>
    );
  }
}

export default BreadcrumbInstance;
