/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Row, Col, Table, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import ModalInstance from '../../static/layout/modalinstance';

@inject('generic_master_store', 'modal_store','breadcrumb_store','mapping_store')
@observer
class SummaryTiles extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.modal_store = this.props.modal_store;
    this.tempStore = this.props.tempStore;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.state = {
      sourceSuccess: 0,
      sourceFailure: 0,
      targetSuccess: 0,
      targetFailure: 0,
      mappingSuccess: 0,
      mappingFailure: 0,
      selectedSourceConfig: '',
      selectedTargetConfig: '',
      selectedMappingConfig: ''
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.generic_master_store = this.props.generic_master_store;
      this.generic_master_store.setvalue('selectedSourceConfig', 'ALL');
      this.generic_master_store.setvalue('selectedTargetConfig', 'ALL');
      this.generic_master_store.setvalue('selectedMappingConfig', 'ALL');
      var sourceObj = this.returnALLSummary('source');
      var targetObj = this.returnALLSummary('target');
      var mappingObj = this.returnALLSummary('mapping');
      this.setStateValues('source', sourceObj);
      this.setStateValues('target', targetObj);
      this.setStateValues('mapping', mappingObj);
    }
  }
  deleteSummaryTable() {
    this.modal_store.modal.modal_title = 'Deletion of Transaction Metric Table Entries';
    this.modal_store.modal.modalBtnTxt = 'Delete Snapshot';
    this.modal_store.modal.serviceName = 'DeleteSummaryEntries';
    this.modal_store.showModal(<p style={{wordWrap: 'break-word'}}>Are you sure you want to delete TransactionMetricTable entries</p>);

  }
  onChange(type, event) {
    var arr = event.target.value.split('->');
    var obj = this.returnSelectedConfigObj(type, arr[0], arr[1]);
    if (obj && Object.keys(obj).length !== 0) {
        this.setStateValues(type, obj);
    }
    if (event.target.value === '') {
        if (type === 'source') {
            this.setState({ sourceSuccess: 0, sourceFailure: 0 });
        } else if (type === 'target') {
            this.setState({ targetSuccess: 0, targetFailure: 0 });
        } else if (type === 'mapping') {
            this.setState({ mappingSuccess: 0, mappingFailure: 0 });
        }
    }
    this.generic_master_store['selected' + this.captilize(type) + 'Config'] = event.target.value;
  }
  setStateValues(type, obj) {
    if (type === 'source') {
      this.setState({ sourceSuccess: obj.metric.success ? obj.metric.success:0, sourceFailure: obj.metric.failure });
    } else if (type === 'target') {
      this.setState({ targetSuccess: obj.metric.success ? obj.metric.success:0, targetFailure: obj.metric.failure });
    } else if (type === 'mapping') {
      this.setState({ mappingSuccess: obj.metric.success ? obj.metric.success:0, mappingFailure: obj.metric.failure });
    }
  }
  returnALLSummary(type) {
    var o = { metric: { success: 0, failure: 0 } };
    var arr = this.generic_master_store.dashboardMetrics;
    for (var i = 0; i < arr.length; i++) {
      if (type === arr[i].groupType.toLowerCase()) {
        o = {
          metric: {
            success: o['metric']['success'] ? o['metric']['success']:0 + arr[i]['metric']['success'] ? arr[i]['metric']['success']:0,
            failure: o['metric']['failure'] + arr[i]['metric']['failure']
          }
        }
      }
    }
    return o;
  }
  returnSelectedConfigObj(type, groupName, configName) {
    var arr = this.generic_master_store.dashboardMetrics;
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
    if (arr[i].configName === configName && arr[i].groupName === groupName && arr[i].groupType.toLowerCase() === type) {
      obj = arr[i];
      break;
    }
      if (groupName === 'ALL') {
        obj = this.returnALLSummary(type);
      }
    }
    return obj;
  }
  componenWillMount() {
    this.generic_master_store.getDashboardMetrics();
  }
  captilize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  ViewConfigs(config){
    if(config.groupType.toLowerCase() === 'source'){
      if(config.dataSourceType === 'Rest'){
    var grpName = (config.groupName).split('-')[0];
    this.props.generic_master_store.setvalue('currentGroupName', grpName);
    this.props.generic_master_store.setvalue('groupType', 'source');
    this.props.generic_master_store.setvalue('tenantID', config.tenantId);
    var PageName = 'SourceSystems';
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/SourceSystems' };
    this.breadcrumb_store.pushBreadCrumbsItem();
    var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/' + 'RestClient' + '/' +this.props.generic_master_store.currentGroupName, groupName:this.props.generic_master_store.currentGroupName, groupType:config.groupType };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.props.history.push('/'+  'RestClient' + '/' + 'Edit' + '/' + config.configName);
    }
    else if(config.dataSourceType === 'Static'){
      var grpName = (config.groupName).split('-')[0];
      this.props.generic_master_store.setvalue('currentGroupName', grpName);
      this.props.generic_master_store.setvalue('groupType', 'source');
      this.props.generic_master_store.setvalue('tenantID', config.tenantId);
      var PageName = 'SourceSystems';
      this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/SourceSystems' };
      this.breadcrumb_store.pushBreadCrumbsItem();
      var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
      this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/' + 'StaticFileClient' + '/' +this.props.generic_master_store.currentGroupName, groupName:this.props.generic_master_store.currentGroupName, groupType:config.groupType };
      this.breadcrumb_store.pushBreadCrumbsItem();
      this.props.history.push('/'+ 'StaticFileClient' + '/' + 'Edit' + '/' + config.configName);
    }
    else if(config.dataSourceType === 'Soap'){
      var grpName = (config.groupName).split('-')[0];
      this.props.generic_master_store.setvalue('currentGroupName', grpName);
      this.props.generic_master_store.setvalue('groupType', 'source');
      this.props.generic_master_store.setvalue('tenantID', config.tenantId);
      var PageName = 'SourceSystems';
      this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/SourceSystems' };
      this.breadcrumb_store.pushBreadCrumbsItem();
      var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
      this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/' + 'SoapClient' + '/' +this.props.generic_master_store.currentGroupName, groupName:this.props.generic_master_store.currentGroupName, groupType:config.groupType };
      this.breadcrumb_store.pushBreadCrumbsItem();
      this.props.history.push('/'+  'SoapClient' + '/' + 'Edit' + '/' + config.configName);
    }
    else{
      var grpName = (config.groupName).split('-')[0];
      this.props.generic_master_store.setvalue('currentGroupName', grpName);
      this.props.generic_master_store.setvalue('groupType', 'source');
      this.props.generic_master_store.setvalue('tenantID', config.tenantId);
      var PageName = 'SourceSystems';
      this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/SourceSystems' };
      this.breadcrumb_store.pushBreadCrumbsItem();
      var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
      this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/' + config.dataSourceType + '/' +this.props.generic_master_store.currentGroupName, groupName:this.props.generic_master_store.currentGroupName, groupType:config.groupType };
      this.breadcrumb_store.pushBreadCrumbsItem();
      this.props.history.push('/'+  config.dataSourceType + '/' + 'Edit' + '/' + config.configName);
    }
  }
    else if(config.groupType.toLowerCase() === 'target'){
      if(config.dataSourceType === 'Rest'){
      var grpName = (config.groupName).split('-')[0];
      this.props.generic_master_store.setvalue('currentGroupName', grpName);
      this.props.generic_master_store.setvalue('groupType', 'target');
      this.props.generic_master_store.setvalue('tenantID', config.tenantId);
      var PageName = 'TargetSystems';
      this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/TargetSystems' };
      this.breadcrumb_store.pushBreadCrumbsItem();
      var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
      this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/' +  'RestClient' + '/' +this.props.generic_master_store.currentGroupName, groupName:this.props.generic_master_store.currentGroupName, groupType:config.groupType };
      this.breadcrumb_store.pushBreadCrumbsItem();
      this.props.history.push('/'+ 'RestClient' + '/' + 'Edit' + '/' + config.configName);
      }
     else if(config.dataSourceType === 'Static'){
        var grpName = (config.groupName).split('-')[0];
        this.props.generic_master_store.setvalue('currentGroupName', grpName);
        this.props.generic_master_store.setvalue('groupType', 'target');
        this.props.generic_master_store.setvalue('tenantID', config.tenantId);
        var PageName = 'TargetSystems';
        this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/TargetSystems' };
        this.breadcrumb_store.pushBreadCrumbsItem();
        var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
        this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/' +  'StaticFileClient' + '/' +this.props.generic_master_store.currentGroupName, groupName:this.props.generic_master_store.currentGroupName, groupType:config.groupType };
        this.breadcrumb_store.pushBreadCrumbsItem();
        this.props.history.push('/'+ 'StaticFileClient' + '/' + 'Edit' + '/' + config.configName);
        }
        else if(config.dataSourceType === 'Soap'){
          var grpName = (config.groupName).split('-')[0];
          this.props.generic_master_store.setvalue('currentGroupName', grpName);
          this.props.generic_master_store.setvalue('groupType', 'target');
          this.props.generic_master_store.setvalue('tenantID', config.tenantId);
          var PageName = 'TargetSystems';
          this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/TargetSystems' };
          this.breadcrumb_store.pushBreadCrumbsItem();
          var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
          this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/' +  'SoapClient' + '/' +this.props.generic_master_store.currentGroupName, groupName:this.props.generic_master_store.currentGroupName, groupType:config.groupType };
          this.breadcrumb_store.pushBreadCrumbsItem();
          this.props.history.push('/'+ 'SoapClient' + '/' + 'Edit' + '/' + config.configName);
          }
          else if(config.dataSourceType === 'Google Pub/Sub'){
            var grpName = (config.groupName).split('-')[0];
            this.props.generic_master_store.setvalue('currentGroupName', grpName);
            this.props.generic_master_store.setvalue('groupType', 'target');
            this.props.generic_master_store.setvalue('tenantID', config.tenantId);
            var PageName = 'TargetSystems';
            this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/TargetSystems' };
            this.breadcrumb_store.pushBreadCrumbsItem();
            var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
            this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/' +  'GooglePubSub' + '/' +this.props.generic_master_store.currentGroupName, groupName:this.props.generic_master_store.currentGroupName, groupType:config.groupType };
            this.breadcrumb_store.pushBreadCrumbsItem();
            this.props.history.push('/'+ 'GooglePubSub' + '/' + 'Edit' + '/' + config.configName);
          }
          else{
          var grpName = (config.groupName).split('-')[0];
          this.props.generic_master_store.setvalue('currentGroupName', grpName);
          this.props.generic_master_store.setvalue('groupType', 'target');
          this.props.generic_master_store.setvalue('tenantID', config.tenantId);
          var PageName = 'TargetSystems';
          this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/TargetSystems' };
          this.breadcrumb_store.pushBreadCrumbsItem();
          var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
          this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/' + config.dataSourceType + '/' +this.props.generic_master_store.currentGroupName, groupName:this.props.generic_master_store.currentGroupName, groupType:config.groupType };
          this.breadcrumb_store.pushBreadCrumbsItem();
          this.props.history.push('/'+  config.dataSourceType + '/' + 'Edit' + '/' + config.configName);
          }
    }
      else {
        var grpName = (config.groupName).split('-')[0];
        this.props.generic_master_store.setvalue('currentGroupName', grpName);
        this.props.generic_master_store.setvalue('groupType', 'mapping');
        this.props.generic_master_store.setvalue('tenantID', config.tenantId);
        var that = this;
        var mapStoreObj = that.props.mapping_store;
        var breadCrumbStoreObj = that.props.breadcrumb_store;
        var genericStoreObj = that.props.generic_master_store;
        this.props.generic_master_store.getTitleNameMap(grpName,this.props.generic_master_store.groupType,config.configName).then(function(data){
          mapStoreObj.newConfigTitle = data.title;
          var PageName = 'MappingSystems';
          breadCrumbStoreObj.Bread_crumb_obj = { name: PageName, path: '/MappingSystems' };
          breadCrumbStoreObj.pushBreadCrumbsItem();
          var PageName = 'ViewDetails:' + genericStoreObj.currentGroupName;
          breadCrumbStoreObj.Bread_crumb_obj = { name: PageName, path: '/' + 'Mapping' + '/' +genericStoreObj.currentGroupName, groupName:genericStoreObj.currentGroupName, groupType:config.groupType };
          breadCrumbStoreObj.pushBreadCrumbsItem();
           var PageName = 'Edit:' + mapStoreObj.newConfigTitle;
           breadCrumbStoreObj.Bread_crumb_obj = { name: PageName, path: '/' + 'Mapping' + '/' + 'Edit' + '/' + config.configName};
           breadCrumbStoreObj.pushBreadCrumbsItem();
        });
        }
  }
  returnSummaryTile(type, arr) {
    var tile = '';
    var path ='';
    var tableRow = [];
    for (var i = 0; i < arr.length; i++) {
      if (type === arr[i].groupType.toLowerCase()) {
      var displayName = (BACKEND === 'LoopBack' ? (arr[i].groupName + '-' + arr[i].configName) : arr[i].configName);     
      if(arr[i].groupType.toLowerCase() === 'mapping')
      {
      path = '/' + 'Mapping' + '/' + 'Edit' + '/' + displayName
      }
      else if(arr[i].dataSourceType === 'Rest')
      {
      path = '/'+'RestClient'+'/'+'Edit'+'/'+arr[i].configName
      }
      else if(arr[i].dataSourceType === 'Static')
      {
      path = '/'+'StaticFileClient'+'/'+'Edit'+'/'+arr[i].configName
      }
      else if(arr[i].dataSourceType === 'Soap')
      {
      path = '/'+'SoapClient'+'/'+'Edit'+'/'+arr[i].configName
      }
      else if(arr[i].dataSourceType === 'Google Pub/Sub')
      {
      path = '/'+'GooglePubSub'+'/'+'Edit'+'/'+arr[i].configName
      }
      else{
      path = '/'+arr[i].dataSourceType+'/'+'Edit'+'/'+arr[i].configName
      }
      tableRow.push(
          <tr key={arr[i].configName+i}>
            <td className="tableHeaderBody"><Link to={path} onClick={this.ViewConfigs.bind(this, arr[i])} >{displayName}</Link> </td>
            <td className="tableSummuryBody clr-green">{arr[i].metric.success ? arr[i].metric.success : 0}</td>
            <td className="tableSummuryBody clr-orange">{arr[i].metric.failure}</td>
          </tr>
        );
      }
    }
    tile = (
      <div className="marginTable">
        <Row>
          <Table striped bordered condensed hover responsive>
            <thead>
            <tr>
              <th className="tableSummuryHeader">Name</th>
              <th className="tableSummuryHeader">S#</th>
              <th className="tableSummuryHeader">F#</th>
            </tr>
            </thead>
            <tbody>
            {tableRow}
            </tbody>
          </Table>
        </Row>
      </div>
    );
    return tile;
  }
  render() {
    var sourceTile = this.returnSummaryTile('source', this.generic_master_store.dashboardMetrics);
    var targetTile = this.returnSummaryTile('target', this.generic_master_store.dashboardMetrics);
    var mappingTile = this.returnSummaryTile('mapping', this.generic_master_store.dashboardMetrics);
    return (
      <div>
        <Row>
            <div style={{ float:'right' }}  hidden={this.generic_master_store.dashboardMetrics.length === 0}>
              <Col xs={12}>
              <Button block bsStyle="danger" name={'deleteSummaryTable'} onClick={this.deleteSummaryTable.bind(this)}>Delete Snapshot</Button>
            </Col>
            </div>
          <Col xs={12}>
            <Col xs={12} sm={12} md={12} lg={4}>
              <h4>Source</h4>
                {sourceTile}
            </Col>
            <Col xs={12} sm={12} md={12} lg={4}>
              <h4> Mapping</h4>
                {mappingTile}
            </Col>
            <Col xs={12} sm={12} md={12} lg={4}>
              <h4>Target</h4>
                {targetTile}
            </Col>
          </Col>
        </Row>
        <ModalInstance
            custom_store={this.props.generic_master_store} groupType={'dashboard'}
            custom_history={this.props.history} service_name={'DeleteSummaryEntries'}
        />
      </div>
    );
  }
}

SummaryTiles.propTypes = {
    store: React.PropTypes.object
};

export default SummaryTiles;
