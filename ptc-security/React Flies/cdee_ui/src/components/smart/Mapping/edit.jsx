/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Tabs, Tab } from 'react-bootstrap';
import MappingStore from '../../../stores/MappingStore';
import ModalInstance from '../../static/layout/modalinstance';
import MappingConfig from '../GenericComponents/schema/map/mappingConfig';
import Navigator from '../GenericComponents/navigator';
import CustomEndPoints from '../../smart/Settings/CustomEndPoints/custom_endpoints';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import MailTemplate from '../GenericComponents/mailTemplate';

@inject('modal_store', 'breadcrumb_store', 'generic_master_store','mapping_store')
@observer
class MappingThingEdit extends React.Component {
  constructor(props) {
    super(props);
    this.mapping_store = new MappingStore(this.props.match.params.name);
    this.modal_store = this.props.modal_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.generic_master_store = this.props.generic_master_store;
    this.state = {
      service_name: '',
      custom_path: '',
      sourceObj: {},
      targetObj: {},
      mapping_config: {},
      isEndPt: false
    };
  }

  assignSourceAndTarget(mappingThis){
    if(mappingThis){
        var mapping_config = mappingThis.configJson;
        var sourceObj = this.props.generic_master_store.returnSelectedObject('source', mapping_config['SourceConfig']['Name'],mapping_config['SourceConfig']['GroupName']);
        var targetObj = this.props.generic_master_store.returnSelectedObject('target', mapping_config['TargetConfig']['Name'],mapping_config['TargetConfig']['GroupName']);
        this.setState({ sourceObj, targetObj, mapping_config });
        var mapConfig = mappingThis.configJson;
        mapConfig['SourceConfig']['GroupName'] = sourceObj?sourceObj.Group:mapping_config.SourceConfig.GroupName;
        mapConfig['SourceConfig']['Type'] = sourceObj?sourceObj.DataSourceType:mapping_config.SourceConfig.GroupType;
        mapConfig['SourceConfig']['PrimaryKey'] = sourceObj?sourceObj.ConfigJson.PrimaryKey:mapping_config.SourceConfig.PrimaryKey;
        mapConfig['TargetConfig']['GroupName'] = targetObj?targetObj.Group:mapping_config.TargetConfig.GroupName;
        mapConfig['TargetConfig']['Type'] = targetObj?targetObj.DataSourceType:mapping_config.TargetConfig.GroupType;
        mappingThis.setvalue(mappingThis.configJson, mapConfig);
        mappingThis.setvalue('async_callback', null);
        mappingThis.getSourceAndTargetSchemas();
        this.createAlert();
        if(BACKEND === 'LoopBack') {
            this.props.generic_master_store.setvalue('configMe', {
                groupType:this.mapping_store.configJson.TargetConfig.GroupType,
                tenantId: this.props.generic_master_store.tenantID,
                groupName: this.mapping_store.configJson.TargetConfig.GroupName,
                configName: this.mapping_store.configJson.TargetConfig.Name
            });
            this.setState({isEndPt: true});
            this.props.generic_master_store.setvalue('cepRender', {
                type: 'MAPPING',
                groupType: this.mapping_store.configJson.TargetConfig.GroupType,
                tenantId: this.props.generic_master_store.tenantID,
                name: this.mapping_store.configJson.TargetConfig.GroupName,
                configName: this.mapping_store.configJson.TargetConfig.Name,
                displayName: this.mapping_store.name +' -- '+this.mapping_store.currentGroupName
            });
        }
    }
  }

  componentWillMount() {
    this.mapping_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName?this.props.generic_master_store.currentGroupName:this.props.match.params.name.split('-')[0]);
    this.mapping_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.mapping_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    var PageName = 'Edit:' + this.props.mapping_store.newConfigTitle;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.mapping_store.setvalue('async_callback', this.assignSourceAndTarget.bind(this));
    this.mapping_store.GetConfigJson;
  }

  createAlert() {
    if (this.modal_store.modal.notification === true) {
        if(BACKEND !== 'LoopBack') {
            NotificationManager.success('Created ' + this.mapping_store.name + ' Config Successfully', 'Success', 1000);
        }
      this.modal_store.modal.notification = false;
    }
  }
  deleteConfig() {
    this.setState({ service_name: 'Delete', custom_path: '/' });
    this.modal_store.modal.modal_title = 'Delete ' + this.mapping_store.name + ' Config';
    this.modal_store.showModal(<p>Are you sure you want to delete :  {this.mapping_store.name}  Config</p>);
  }
  saveMappingSchema() {
    var SpecJson = this.mapping_store.convertMappingSpecToJoltSpec(this.mapping_store.configJson,this.generic_master_store);
    this.mapping_store.SetPropValues({ ConfigJson: this.mapping_store.configJson, SpecJson: { Spec: SpecJson } });
      NotificationManager.success('Schema Saved Successfully', 'Success', 1000);
  }

  downloadConfig(){
    var fileDownload = require('js-file-download');
    var downloadable_config = {}
    downloadable_config['mappingSpec'] = this.mapping_store.configJson.mappingSpec;
    downloadable_config['RemoteSourceConfig'] = this.mapping_store.configJson.RemoteSourceConfig;
    fileDownload(JSON.stringify(downloadable_config), 'MappingConf_'+this.mapping_store.name+'.json');
  }
  render() {
    var edit_page_content = [];
      edit_page_content = [<MappingConfig key="MappingConfig" mappingStore={this.mapping_store} />];
      var custonEndPt = '';
      var events = '';
      if(this.state.isEndPt && BACKEND === 'LoopBack') {
          custonEndPt = (
            <Tab tabClassName="arrowshapetab" eventKey={2} title="Custom EndPoints">
                <CustomEndPoints />
            </Tab> )
          events = (
            <Tab className = "tab-height" tabClassName="arrowshapetab" eventKey={'events'} title="Events">
              <MailTemplate  client_store={this.mapping_store}/>
            </Tab>
          )
      }
    return (
        <div>
         <Row>
           <Navigator history={this.props.history} action={'Edit'} type={'/Mapping'} tempStore={this.mapping_store} delete={this.deleteConfig.bind(this)} save={this.saveMappingSchema.bind(this)} source={'Thing'} downloadConfig={this.downloadConfig.bind(this)}/>
       <Tabs className="" defaultActiveKey={1} id="uncontrolledMappingEditTabContainer">
         <Tab tabClassName="arrowshapetab" eventKey={1} title="Config">
           {edit_page_content}
         </Tab>
           {custonEndPt}
           {events}
       </Tabs>
        <ModalInstance custom_store={this.mapping_store} custom_path={this.state.custom_path} custom_history={this.props.history} service_name={this.state.service_name} />
      </Row>
          <NotificationContainer/>
        </div>
    );
  }
}

MappingThingEdit.propTypes = {
  store: React.PropTypes.object
};

export default MappingThingEdit;
