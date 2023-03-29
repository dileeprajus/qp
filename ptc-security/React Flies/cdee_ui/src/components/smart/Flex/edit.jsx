/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Col, FormGroup, FormControl, Row, Tabs, Tab, ListGroup, ListGroupItem } from 'react-bootstrap';
import ModalInstance from '../../static/layout/modalinstance';
import AlertInstance from '../../static/layout/alertinstance';
import AlertContainer from 'react-alert';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import FlexStore from '../../../stores/FlexStore';
import SchemaEdit from '../GenericComponents/schema/edit';
import Navigator from '../GenericComponents/navigator';
import UniqKeys from '../GenericComponents/schema/objectTransformations/uniq_keys';
import TypeManagerStore from '../../../stores/TypeManagerStore';
import ScriptFilters from '../GenericComponents/schema/transformationRules/script_filters';


@inject('breadcrumb_store', 'modal_store', 'validation_store', 'generic_master_store')
@observer
class FlexThingEdit extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.client_store = new FlexStore(this.props.match.params.name);
    this.type_manager_store = new TypeManagerStore('TypeManagerConfig');
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.flex_object_list = [];
    this.flex_link_objects = [];
    this.temp_hierarchy_name = '';
    this.state = {
      service_name: '',
      custom_path: '',
      temp_selected_flex_obj: [], // TODO: need to get it from store
      temp_selected_type_hierarchy: [],
      tab_eventkey: 1,
      tabs_length: 4,
      schema: false
    };
  }

  componentWillMount() {
    this.client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName?this.props.generic_master_store.currentGroupName:this.props.match.params.name.split('-')[0]);
    this.client_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    if (this.props.match.params.name.indexOf('-') !== -1) {
       var brd_name = this.props.match.params.name.split('-')[1];
    }else{
        brd_name = this.props.match.params.name;
    }
    var PageName = 'Edit:'+ brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url, groupName: this.props.generic_master_store.currentGroupName, groupType: this.props.generic_master_store.groupType};
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.client_store.GetHostProperties;
    this.client_store.GetFlexObjects();
    this.client_store.GetBasicConfigInfo(this.updateSchema.bind(this),this.createAlert.bind(this));
    this.type_manager_store.GetDataTypes;
  }

  showAlert = (msg) => {
    this.msg.show(msg, {
      type: 'error'
    })
  }
  alertOptions = {
    offset: 140,
    position: 'top left',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
  }
  createAlert() {
    if (this.modal_store.modal.notification === true) {
      NotificationManager.success('Created ' + this.client_store.name  + ' Config &  Updated HostProperties Succesfully', 'Success', 2000);
      this.modal_store.modal.notification = false;
    }
  }
  setStateSchema(){
    if (this.client_store.currentGroupType === 'source') {
      this.setState({ schema: this.client_store.outputSchema });
    } else if (this.client_store.currentGroupType === 'target') {
      this.setState({ schema: this.client_store.inputSchema });
    }
  }
  updateSchema() {
    this.setStateSchema();
    if (Object.keys(this.client_store.BasicConfigInfo['ConfigJson']).length > 0) {
      if (this.client_store.configJson['SelectedFlexObjects']) {
        this.setState({ temp_selected_flex_obj: this.client_store.BasicConfigInfo['ConfigJson']['SelectedFlexObjects'] });
      }
      if (this.client_store.configJson['SelectedTypeHierarchy']) {
        this.setState({ temp_selected_type_hierarchy: this.client_store.BasicConfigInfo['ConfigJson']['SelectedTypeHierarchy'] });
      }
      this.temp_hierarchy_name = this.client_store.BasicConfigInfo['ConfigJson']['temp_hierarchy_name']
    }
  }
  onChange(event) {
    var temp_host_prop = this.client_store.HostProperties;
       // modify temporarily to update HostProperties json on change
    temp_host_prop[event.target.name] = event.target.value;
    this.client_store.setvalue('HostProperties', temp_host_prop);
  }
  handleSubmit(event) {
    this.setState({ service_name: 'SetHostProperties', custom_path: '/Flex/Show/' });
    this.modal_store.modal.modal_title = 'Update ' + this.client_store.name + ' Config';
    this.modal_store.showModal(<p>Are you sure you want to update: {this.client_store.name} Config</p>);
    event.preventDefault();
  }
  deleteConfig() {
    this.setState({ service_name: 'Delete', custom_path: '/Flex' });
    this.modal_store.modal.modal_title = 'Delete ' + this.client_store.name + ' Config';
    this.modal_store.showModal(
      <p>Are you sure you want to delete : {this.client_store.name}  Thing</p>);
  }

  addSelectedFlexObjToTempList(event) {
    var filter_objects = this.flex_link_objects;
    var index = this.state.temp_selected_flex_obj.indexOf(event.target.name);
    var tmp_arr = this.state.temp_selected_flex_obj;
    if (index !== -1) { //Unselecting the flex object
      tmp_arr.splice(index, 1);
      var type_hierarchy = this.state.temp_selected_type_hierarchy;
      type_hierarchy = [];
      this.setState({ temp_selected_type_hierarchy : type_hierarchy });
      //removing the type hierarchy of this flexobject from temp varriable temp_selected_type_hierarchy
    } else {
      if(tmp_arr.length > 0) {
          tmp_arr.splice(index, 1);
          tmp_arr.push(event.target.name);
      }else {
          tmp_arr.push(event.target.name);
    }
    this.setState({ temp_selected_flex_obj: tmp_arr });
  }
  for(var i=0;i<filter_objects.length;i++){
    if(filter_objects[i] === event.target.name){
      this.client_store.setvalue('disable_trigger',true);
      this.client_store.setvalue('enableFlexUpdateTrigger',false);
      break;
    }
    else{
     this.client_store.setvalue('disable_trigger',false);
     //this.client_store.setvalue('enableFlexUpdateTrigger',true);
    }
  }
  var PK = this.client_store.configJson;
    PK['PrimaryKey'] = '';
    this.client_store.setvalue(this.client_store.configJson, PK);
  }
  fetchTypeHierarchy() {
    var arr = this.state.temp_selected_flex_obj;
    //To remove scopedObjects in input for fetchTypeHierarchy api as typeids are same for parent and scopedObjects
    arr = arr.slice();
    this.client_store.GetTypeHierarchy(arr);
  }

  addSelectedTypeIDToTempList(type_id, flex_obj) {
    var tmp_arr = this.state.temp_selected_type_hierarchy;
    var check_present = false;
    var presence_index = 0;
    if (tmp_arr.length > 0) {
      for (var i=0; i<tmp_arr.length; i++) {
        if (tmp_arr[i]['typeId'] === type_id) {
          check_present = true;
          presence_index = i;
        }
      }
    }

    if (check_present) {
      tmp_arr.splice(presence_index, 1);
      var PK = this.client_store.configJson;
      PK['PrimaryKey'] = '';
      this.client_store.setvalue(this.client_store.configJson, PK);

    } else {
      //To restrict only one TypeHierarchy selection for one flexObject in one mapping
      var selectedTH = tmp_arr.slice();
      selectedTH.push({ flexObject: flex_obj, typeId: type_id });
      var arr = [];
      var existed = false; // eslint-disable-line no-unused-vars
      for(var i = 0; i < selectedTH.length; i++) {
        var index = arr.indexOf(selectedTH[i]['flexObject']);
        if (index !== -1) {
          existed = true;
          break;
        } else {
          arr.push(selectedTH[i]['flexObject']);
        }
      }

        if(tmp_arr.length>0){
          tmp_arr.splice(presence_index, 1);
          tmp_arr.push({'flexObject': flex_obj, 'typeId': type_id});
        }
        else{
          tmp_arr.push({'flexObject': flex_obj, 'typeId': type_id});
        }
    }
    var PK = this.client_store.configJson;
    PK['PrimaryKey'] = '';
    this.client_store.setvalue(this.client_store.configJson, PK);
    this.setState({ temp_selected_type_hierarchy: tmp_arr });
      if ((this.state.temp_selected_flex_obj.length > 0) && (this.state.temp_selected_type_hierarchy.length > 0)) {
        this.fetchSchemaByTypeID();
      }
  }

  renderTypeHierarchy() {
    var output_list = [];
    for (var f_o in this.client_store.TypeHierarchy) {
      for (var t_h in this.client_store.TypeHierarchy[f_o]) {
        var t_i = this.client_store.TypeHierarchy[f_o][t_h];
        var active = false;
        for (var i = 0; i<this.state.temp_selected_type_hierarchy.length; i++) {
          if (this.state.temp_selected_type_hierarchy[i]['typeId'] === t_i) {
            active = true;
            this.temp_hierarchy_name = t_h;
          }
        }
        output_list.push(
          <Col key={t_i + 'hierarchy'} xs={12} sm={6} md={6} lg={4}>
            <ListGroup key={t_i}>
              <ListGroupItem className="SortableItem" key={t_i} href="" onClick={this.addSelectedTypeIDToTempList.bind(this, t_i, f_o)} active={active}> {t_h} </ListGroupItem>
            </ListGroup>
          </Col>
        );
      }
    }
    return output_list;
  }

  renderFlexObjectsList() {
    this.flex_link_objects = this.client_store.FlexLinks;
    var output_list = [];
    if (this.client_store.FlexObjects !== undefined) {
    this.client_store.FlexObjects.map(f_o => {
      var obj_already_selected = false;
      if (this.state.temp_selected_flex_obj.length !== undefined) {
        obj_already_selected = (this.state.temp_selected_flex_obj.indexOf(f_o) > -1);
      }
      output_list.push(
        <Col key={f_o + 'flexobjects'} xs={12} sm = {6} md ={6} lg = {4}>
          <ListGroup  key={f_o}>
            <ListGroupItem className="SortableItem" key={f_o} name={f_o} href="" onClick={this.addSelectedFlexObjToTempList.bind(this)} active={obj_already_selected}>
              {f_o}
            </ListGroupItem>
          </ListGroup>
        </Col>
      );
    });
    }
    return output_list;
  }

  fetchSchemaByTypeID() {
    var arr = this.state.temp_selected_type_hierarchy;
    this.client_store.GetSchemaByTypeID(arr);
  }

  updateFlexSelection(event) {
    if (event === 1) {
      this.flex_object_list = this.renderFlexObjectsList();
    } else if (event === 2) {
      this.fetchTypeHierarchy();
    }else if (event === 3) {
      this.setStateSchema();
    } else if (event === 4) {
      if(this.client_store.configJson['SelectedFlexObjects']){
        var filter_objects = this.flex_link_objects?this.flex_link_objects:[] ;
                        for(var i=0;i<filter_objects.length;i++){
                          if(filter_objects[i] === this.client_store.configJson['SelectedFlexObjects'][0]){
                            this.client_store.setvalue('disable_trigger',true);
                            this.client_store.setvalue('enableFlexUpdateTrigger',false);
                            break;
                          }
                          else{
                           this.client_store.setvalue('disable_trigger',false);
                           //this.client_store.setvalue('enableFlexUpdateTrigger',true);
                          }
                        }
    }
   } else {
        // Do nothing for now
    }
    if (event !== 5) {
      this.setState({ tab_eventkey: event });
    }
  }
  onClick(event) {
    if (event.target.name === 'next') {
      if (this.state.tab_eventkey < this.state.tabs_length) {
        if (this.state.temp_selected_flex_obj.length > 0) {
          this.fetchTypeHierarchy();
        }
        if (this.state.temp_selected_type_hierarchy.length > 0) {
          this.fetchSchemaByTypeID();
        }
        if ((this.state.temp_selected_flex_obj.length > 0) && (this.state.temp_selected_type_hierarchy.length > 0)) {
          this.setStateSchema();
        }
        this.setState({ tab_eventkey: this.state.tab_eventkey + 1 });
      }
    }
    if (event.target.name === 'back') {
      if (this.state.tab_eventkey <= this.state.tabs_length) {
        this.setState({ tab_eventkey: this.state.tab_eventkey - 1 });
      }
    }
    if (this.state.tab_eventkey === 2) {
      this.client_store.GetBasicConfigInfo();
    }
  }
  saveFlexSchema() {
    if (this.state.temp_selected_flex_obj.length === 0) {
      NotificationManager.warning('PleaseSelect FlexType', 'Warning', 2000);
    } else if ((this.state.temp_selected_flex_obj.length === 0)||(this.state.temp_selected_type_hierarchy.length === 0)) {
      NotificationManager.warning('PleaseSelect Typehierarchy', 'Warning', 2000);
    } else {
      var tempSchema = {} ;
      var pk = '';
      if (this.client_store.currentGroupType === 'source') {
        tempSchema = this.client_store.outputSchema;
      } else if (this.client_store.currentGroupType === 'target') {
        tempSchema = this.client_store.inputSchema;
      }
      pk = this.props.generic_master_store.returnPrimaryKey(tempSchema, this.client_store.configJson);
      var flexConfig = this.client_store.configJson;
      flexConfig['SelectedFlexObjects'] = this.state.temp_selected_flex_obj;
      flexConfig['SelectedTypeHierarchy'] = this.state.temp_selected_type_hierarchy;
      flexConfig['SelectedSchema'] = {} ;
      flexConfig['SelectedOutputSchema'] = this.client_store.outputSchema;
      flexConfig['SelectedInputSchema'] = this.client_store.inputSchema;
      flexConfig['PrimaryKey'] = pk;
      flexConfig['temp_hierarchy_name'] = this.temp_hierarchy_name;
      this.client_store.setvalue(this.client_store.configJson, flexConfig);
      var Triggerobj = {'create_trigger':this.client_store.enableFlexTrigger,'update_trigger':this.client_store.enableFlexUpdateTrigger,'delete_trigger':this.client_store.enableFlexDeleteTrigger};
      this.client_store.SetPropValues({ ConfigJson: flexConfig, outputSchema: this.client_store.outputSchema, inputSchema: this.client_store.inputSchema, enableFlexTrigger: this.client_store.enableFlexTrigger, enableFlexUpdateTrigger: this.client_store.enableFlexUpdateTrigger, enableFlexDeleteTrigger: this.client_store.enableFlexDeleteTrigger,Triggerobj:Triggerobj });
      NotificationManager.success('Schema Saved Successfully', 'Success', 1000);
    }
  }

  updateTreeData(scripts){
    var temp = this.client_store.configJson;
    temp['TransformationRules']=scripts;
    this.client_store.setvalue('configJson', temp);
  }

  render() {
    this.flex_object_list = this.renderFlexObjectsList();
    this.type_hirerarchy_list = this.renderTypeHierarchy();
    var host_prop_field_names = [];
    for (var attr in this.client_store.HostProperties) {
      host_prop_field_names.push(
        <FormGroup key={attr + 'hostprops'}>
          <ControlLabel>{attr}</ControlLabel>
          <FormControl
            type="text" placeholder="" name={attr} value={this.client_store.HostProperties[attr]}
            onChange={this.onChange.bind(this)}
          />
        </FormGroup>
      );
    }
    var schema_edit = 'Loading....';
    var schema_uniq_keys = 'Loading....';
    if (this.state.schema) {
      schema_edit = <SchemaEdit schema={this.state.schema} master={this} store={this.client_store}/>
      schema_uniq_keys = <UniqKeys schema={this.state.schema} master={this} store={this.client_store}/>
    }

    var target_scripts_tab = '';
    if(this.client_store.currentGroupType==='target'){
      target_scripts_tab = (
        <Tab className="tab-height" tabClassName="arrowshapetab" eventKey={'scripts'} title="Scripts">
          <Col xs={6} sm={6} md={6} lg={6}>
            <ControlLabel>Pre Script</ControlLabel>
          <ScriptFilters
            source_key="host"
            destination_key="client"
            snode={this.client_store.configJson}
            master={this}
            type_manager_store={this.type_manager_store}
            from="TargetScripts"
            prop_key="PreTransformationRules"
          />
        </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <ControlLabel>Post Script</ControlLabel>
          <ScriptFilters
            source_key="host"
            destination_key="client"
            snode={this.client_store.configJson}
            master={this}
            type_manager_store={this.type_manager_store}
            from="TargetScripts"
            prop_key="TransformationRules"
          />
        </Col>
        </Tab>
      )
    } else {
      target_scripts_tab = (
        <Tab className="tab-height" tabClassName="arrowshapetab" eventKey={'scripts'} title="Scripts">
          <Col xs={6} sm={6} md={6} lg={6}>
            <ControlLabel>Pre Script</ControlLabel>
          <ScriptFilters
            source_key="host"
            destination_key="client"
            snode={this.client_store.configJson}
            master={this}
            type_manager_store={this.type_manager_store}
            from="TargetScripts"
            prop_key="PreTransformationRules"
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
            <ControlLabel>Post Script</ControlLabel>
          <ScriptFilters
            source_key="host"
            destination_key="client"
            snode={this.client_store.configJson}
            master={this}
            type_manager_store={this.type_manager_store}
            from="TargetScripts"
            prop_key="TransformationRules"
          />
        </Col>
        </Tab>
      )
    }

    return (
      <div>
        <Col xs={8} xsOffset={2}>
          <AlertInstance modal_store={this.modal_store} />
        </Col>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Edit'} type={'/Flex'} tempStore={this.client_store} delete={this.deleteConfig.bind(this)} save={this.saveFlexSchema.bind(this)} source={'Thing'} />
            <Tabs defaultActiveKey={1} activeKey={this.state.tab_eventkey} id="uncontrolled-flex-edit-tab-example" onSelect={this.updateFlexSelection.bind(this)}>
              <Tab className="" tabClassName="arrowshapetab" eventKey={1} title="1.Flex Types">
                {(this.flex_object_list.length > 0) ? this.flex_object_list : 'Please check whether FlexPLM machine is running or Check if entered credentials are valid or not'}
              </Tab>
              <Tab className="" tabClassName="arrowshapetab" eventKey={2} title="2.Type Hierarchy" disabled={this.state.temp_selected_flex_obj.length === 0}>
                {(this.type_hirerarchy_list.length > 0) ? this.type_hirerarchy_list : 'Please select atleast one FlexObjects'}
              </Tab>
              <Tab className="" tabClassName="arrowshapetab" eventKey={3} title="3.Attribute Schema" disabled={this.state.temp_selected_flex_obj.length === 0 || this.state.temp_selected_type_hierarchy.length === 0}>
                <Col xs={12}>
                  <Row>
                    <div style={{fontSize:'30px', fontWeight:'bold',marginLeft:'15px'}}>
                    {this.temp_hierarchy_name}
                    </div>
                 </Row>
                  <Row>
                   {schema_edit}
                  </Row>
                </Col>
              </Tab>

              <Tab className="" tabClassName="arrowshapetab" eventKey={4} title="4.Object Transformations" disabled={this.state.temp_selected_flex_obj.length === 0 || this.state.temp_selected_type_hierarchy.length === 0}>
                {schema_uniq_keys}
              </Tab>
              {target_scripts_tab}

            </Tabs>
          </Row>
        </Col>
        <NotificationContainer />
        <ModalInstance
          custom_store={this.client_store} custom_path={this.state.custom_path}
          custom_history={this.props.history} service_name={this.state.service_name}
        />
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
          {this.props.children}
      </div>
    );
  }
}

FlexThingEdit.propTypes = {
  store: React.PropTypes.object
};

export default FlexThingEdit;
