/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

@inject('breadcrumb_store', 'generic_master_store', 'mapping_store')
@observer
class RequestVariablesHandler extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.mapping_store = this.props.mapping_store;
    this.state = {
      selectedSourceName: '',
      ListGroupArray: [],
      RequestVariablesList: [],
      RequestVarsObj: {},
      toggleInputForm: true,
      inputValue: '',
      ToggleRequestVarsInput: {}
    };
  }


  componentDidMount() {
    this.props.mapping_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID ? this.props.generic_master_store.tenantID : this.props.mapping_store.currentTenantID);
     var sourceObj = this.generic_master_store.returnSelectedObject('source', this.props.currRemoteSource);
    this.generic_master_store.GetBasicConfigInfo(this.props.currRemoteSource, this.updateRequestVars.bind(this), sourceObj.Group);
  }

  onSourceSelect(e) {
    this.setState({ selectedSourceName: e.target.value });
  }

  setToggleInputState(key){
    var temp = this.state.ToggleRequestVarsInput;
    temp[key] = !temp[key];
    this.setState({ ToggleRequestVarsInput: temp});
    if(this.state.ToggleRequestVarsInput[key] === true) {}else {
      if(this.state.RequestVarsObj && (Object.keys(this.state.RequestVarsObj).length > 0) && this.state.RequestVarsObj[key].includes('$@$') === false) {
        this.state.RequestVarsObj[key] = '';
    }
    this.setState({RequestVarsObj: this.state.RequestVarsObj})
  }
}

  updateRequestVars() {
    var basicInfo = this.generic_master_store.configBasicInfo;
    var obj = {};
    if (basicInfo['ConfigJson']['RequestVariables']!==undefined){
      var request_variables_json = basicInfo['ConfigJson']['RequestVariables'];
      for(var key in request_variables_json){
          if (basicInfo.dataSourceType === 'Flex' && key === 'association') {
            obj[key] = basicInfo.ConfigJson.SelectedFlexObjects[0]; //as always only one flexObject will be configured in each config
          } else if (key === 'objectType') {
            obj[key] = basicInfo.ConfigJson.SelectedFlexObjects[0];
          } else {
            obj[key] = request_variables_json[key];
          }
      }

      if (this.props.from === 'RemoteAPIConfig') {
        //Get normalized schema for current remote config
        if (basicInfo.outputSchema) {
          var normRemoteSchema = this.props.generic_master_store.getObj(basicInfo.outputSchema, 'TargetDelimeter');
          var remoteAPIDataSchemas = this.props.mappingStore.remoteAPIDataSchemas;
          remoteAPIDataSchemas[this.props.currRemoteSource] = remoteAPIDataSchemas[this.props.currRemoteSource] ? remoteAPIDataSchemas[this.props.currRemoteSource] : {};
          remoteAPIDataSchemas[this.props.currRemoteSource]['normRemoteSchema'] = normRemoteSchema;
          this.props.mappingStore.setvalue('remoteAPIDataSchemas', remoteAPIDataSchemas);
        }

        //Updating existing values
        for(var key in obj){
          var temp=this.props.config[this.props.from];
          if (temp && temp[this.props.currRemoteSource] && temp[this.props.currRemoteSource]['RequestVariables'] && temp[this.props.currRemoteSource]['RequestVariables'][key]){
            obj[key]=temp[this.props.currRemoteSource]['RequestVariables'][key];
          }
        }
      }
      else{
        //Updating existing values
        for(var key in obj){
          var temp=this.props.config[this.props.from];
          if (temp && temp[this.props.currRemoteSource] && temp[this.props.currRemoteSource][key]){
            obj[key]=temp[this.props.currRemoteSource][key];
          }
        }
      }


      var toggle_obj = {}
      for(var key in obj){
        if(obj[key].substring(0, 3) === '$@$') { // as string begins with $@$ is from text input
          toggle_obj[key] = false
        }
        else{
          toggle_obj[key] = true
        }
      }

      this.setState({ RequestVarsObj: obj, ToggleRequestVarsInput: toggle_obj});
    }
  }
  saveDelimeterKey(key, event) {
    this.setState({ selectedRemoteSchemaKey: event.target.value });
    var temp_config_json = this.props.config;
    if (temp_config_json['RemoteAPIConfig'] === undefined) {
      temp_config_json['RemoteAPIConfig'] = {};
    }
    var temp = temp_config_json['RemoteAPIConfig'];
    temp[key] = temp[key] ? temp[key] : {};
    temp[key]['TargetDelimeter'] = event.target.value;
    temp_config_json['RemoteAPIConfig'] = temp;
  }
  onChange(rv, type,e) {
    var value = e.target.value;
    if(type==='TextInput'){
      value = '$@$'+value; //adding delimeter $@$ to indentify text values while generating spec
    }
    if (this.props.from === 'RemoteAPIConfig') {
      var temp_config_json = this.props.config;
      if (temp_config_json['RemoteAPIConfig'] === undefined) {
        temp_config_json['RemoteAPIConfig'] = {};
      }
      var temp = {};
      temp[this.props.currRemoteSource] = temp_config_json['RemoteAPIConfig'][this.props.currRemoteSource] ? temp_config_json['RemoteAPIConfig'][this.props.currRemoteSource] : {};
      temp[this.props.currRemoteSource]['RequestVariables'] = temp[this.props.currRemoteSource]['RequestVariables'] ? temp[this.props.currRemoteSource]['RequestVariables'] : {};
      temp[this.props.currRemoteSource]['RequestVariables'][rv] = value;
      temp_config_json['RemoteAPIConfig'] = temp;
    }
    else{
      var temp_sources_json = this.props.config[this.props.from];
      temp_sources_json[this.props.currRemoteSource][rv] = value;
    }
    // //TODO : need to remove this state updation for value display
    var temp_rv = this.state.RequestVarsObj;
    temp_rv[rv]=value;
    this.setState({ RequestVarsObj: temp_rv});
  }
  removeitem(index) {
    let currRemoteArray = this.state.ListGroupArray;
    currRemoteArray.splice(index, 1);
    this.setState({ ListGroupArray: currRemoteArray });
  }
  addListItem() {
    var listGroupArray=this.state.ListGroupArray;
    listGroupArray.push(
        {
            a: 'value'
        }
    );
    this.setState({ListGroupArray: listGroupArray})
  }

  render() {
    var selectedDelimeter = 'RootObject';
    if (this.props.config['RemoteAPIConfig']) {
      if (this.props.config['RemoteAPIConfig'][this.props.currRemoteSource]) {
        if (this.props.config['RemoteAPIConfig'][this.props.currRemoteSource]['TargetDelimeter']) {
          selectedDelimeter = this.props.config['RemoteAPIConfig'][this.props.currRemoteSource]['TargetDelimeter'];
        }
      }
    }
    var configuration = [];
    var SourceSelectMenu = [];
    this.props.generic_master_store.SourceConfigs.map(sourceConfig => {
      SourceSelectMenu.push(
        <option key={sourceConfig.Name} className="optionDisable" value={sourceConfig.Name}>{sourceConfig.DataSourceType} - {sourceConfig.Name}</option>
      );
    });


    var remoteSchemaAttrList = [];
    if (this.props.mappingStore.remoteAPIDataSchemas[this.props.currRemoteSource]) {
      var selectedRemoteNameObj = this.props.mappingStore.remoteAPIDataSchemas[this.props.currRemoteSource];
      if (selectedRemoteNameObj) {
        for(var sourceKey in selectedRemoteNameObj['normRemoteSchema']) {
          remoteSchemaAttrList.push(
            <option key={sourceKey} name={sourceKey}>{sourceKey}</option>
          );
        }
      }
    }
    for(var key in this.state.RequestVarsObj) {
      var selectedReqVarsVal = '';
      if (this.props.config['RemoteAPIConfig']) {
        if (this.props.config['RemoteAPIConfig'][this.props.currRemoteSource]) {
          if (this.props.config['RemoteAPIConfig'][this.props.currRemoteSource]['RequestVariables']) {
            selectedReqVarsVal = this.props.config['RemoteAPIConfig'][this.props.currRemoteSource]['RequestVariables'][key];
          }
        }
      }
      var source_attributes_list = [];
      if (this.generic_master_store.configBasicInfo.dataSourceType==='Flex' && (key==='objectType' || key==='association')){
        source_attributes_list.push(
          <option key={key} name={key} readOnly>{this.state.RequestVarsObj[key]}</option>
        )
      } else {
        for(var sourceKey in this.props.normalised_source_schema){
          source_attributes_list.push(
            <option key={sourceKey} name={sourceKey}>{sourceKey}</option>
          );
        }
      }
      configuration.push(
        <div key={key}>
          <Row key={key}>
            <Col xs={5} key={'list1' + key}>
              <FormGroup>
                <ControlLabel><h6><b style={{wordWrap:'break-word'}}>{key} : </b></h6></ControlLabel>
              </FormGroup>
            </Col>
            <Col xs={5} key={'list2' + key}>
                <div style={{ display: this.state.ToggleRequestVarsInput[key] ? 'inherit' : 'none' }} >
                  <i className="fa fa-toggle-off" style={{ float: 'right' }} onClick={this.setToggleInputState.bind(this,key)}></i>
                  <FormGroup>
                    <FormControl
                      componentClass="select" placeholder="select" title="list1"
                      name={key} onChange={this.onChange.bind(this, key,'DropDown')}
                      value={selectedReqVarsVal}
                      >
                        <option key={'Select'} name='Select' readOnly>Select</option>
                        {source_attributes_list}
                      </FormControl>
                    </FormGroup>
                  </div>
                  <div style={{ display: !this.state.ToggleRequestVarsInput[key] ? 'inherit' : 'none' }} >
                    <i className="fa fa-toggle-on" style={{ float: 'right' }} onClick={this.setToggleInputState.bind(this,key)}></i>
                    <FormControl
                      type="text" placeholder="Enter value"
                      name={key}
                      value={this.state.RequestVarsObj[key].replace('$@$','')}
                      onChange={this.onChange.bind(this,key,'TextInput')}
                    />
                    </div>
            </Col>
          </Row>
        </div>
      );
    }
    return (
      <div>
        <Row>
          <Col key="Configuration" xs={12} sm={12} md={12} lg={12}>
            <FormGroup controlId="formControlsSelect">
              <Row>
                <Col>
                </Col>
              </Row>
            </FormGroup>
          </Col>
        </Row>
        {configuration}
        <div hidden={this.props.from !== 'RemoteAPIConfig'}>
          <Row key={key + 'row'} className="remoteDataSchemaRow">
            <Col xs={5} key={'remoteschemalabel' + key}>
              <ControlLabel><h6><b>{'RemoteDataDelimeter'} : </b></h6></ControlLabel>
            </Col>
            <Col xs={5} key={'remoteschemalist' + key}>
              <FormGroup>
                <FormControl
                  componentClass="select" placeholder="select" title="remoteDataSchemaList"
                  name={key + 'remoteSchemaList'} value={selectedDelimeter}
                  onChange={this.saveDelimeterKey.bind(this, this.props.currRemoteSource)}
                >
                  <option key={'DefaultObjKey'} name={'DefaultObjKey'} >RootObject</option>
                  {remoteSchemaAttrList}
                </FormControl>
              </FormGroup>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

RequestVariablesHandler.propTypes = {
  store: React.PropTypes.object
};

export default RequestVariablesHandler;
