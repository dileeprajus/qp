/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, ListGroup, ListGroupItem, Panel, FormControl } from 'react-bootstrap';
import RequestVariablesHandler from './spec/request_variables_handler';


@inject('breadcrumb_store', 'generic_master_store')
@observer
class RemoteAPIConfig extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;

    this.state = {
      activePanelID: null,
      selectedSourceName: '',
      normRemoteSchema: {},
      selectedRemoteSchemaKey: '',
      AddApiConfig: (this.props.currMapSpec.mappingConf.RemoteAPIConfig === undefined) ? {} : this.props.currMapSpec.mappingConf.RemoteAPIConfig
    };
  }

  componentWillMount() {
      //   CODE HERE
  }
  componentWillReceiveProps() {
    var tempConfigJson = this.props.currMapSpec.mappingConf;
    this.setState({ selectedSourceName: 'Select Source' });
    if (tempConfigJson['RemoteAPIConfig']) {
      for (var k in tempConfigJson['RemoteAPIConfig']) {
        if (Object.keys(tempConfigJson['RemoteAPIConfig']).length > 0) {
          this.props.mappingStore.setvalue('selectedRemoteName', k);
          this.setState({ selectedSourceName: k });
        }
        if (Object.keys(tempConfigJson['RemoteAPIConfig']).length === 0) {
          this.props.mappingStore.setvalue('selectedRemoteName', 'Select Source');
          this.setState({ selectedSourceName: 'Select Source' });
        }
      }
      this.setState({ AddApiConfig: (this.props.currMapSpec.mappingConf.RemoteAPIConfig === undefined) ? {} : this.props.currMapSpec.mappingConf.RemoteAPIConfig });
    } else {
      this.props.mappingStore.setvalue('selectedRemoteName', 'Select Source');
      this.setState({ selectedSourceName: 'Select Source' });
    }
  }
  toggleRemoteApiPanel(indx) {
    if (indx === this.state.activePanelID) {
      this.setState({ activePanelID: null });
    } else {
      this.setState({ activePanelID: indx });
    }
  }
  removeRemoteApiPanel(key) {
    let remoteApiObj = this.state.AddApiConfig;
    var temp_config_json = this.props.currMapSpec.mappingConf;
    delete remoteApiObj[key];
    temp_config_json['RemoteAPIConfig'] = remoteApiObj;
    this.setState({ AddApiConfig: remoteApiObj });
    this.props.mappingStore.setvalue('selectedRemoteName', 'Select Source');
    this.setState({ selectedSourceName: 'Select Source' });
  }
  addButtonClick(e) {
    if (e.target.value === 'Select Source') {
      //remove the selected remote if the current selected value is Select Source
      this.removeRemoteApiPanel(this.props.mappingStore.selectedRemoteName);
    }
      this.setState({ selectedSourceName: e.target.value });
      this.props.mappingStore.setvalue('selectedRemoteName', e.target.value);
    if (this.props.mappingStore.selectedRemoteName !== '' && this.props.mappingStore.selectedRemoteName !== 'Select Source') {
      var remoteApiObj = this.state.AddApiConfig;
      if (remoteApiObj[e.target.value] === undefined) {
        remoteApiObj[e.target.value] = {}; //TODO: need to updat existing one , need to update store and get it from there
      }
      var temp_config_json = this.props.currMapSpec.mappingConf;
      if (temp_config_json['RemoteAPIConfig'] === undefined) {
        temp_config_json['RemoteAPIConfig'] = {};
      }
      var temp = {};
      temp[this.props.mappingStore.selectedRemoteName] = remoteApiObj[e.target.value];
      temp_config_json['RemoteAPIConfig'] = temp;
      this.setState({ AddApiConfig: temp });
    }
  }
  setSourceState(e) {
    if (e.target.value !== 'Select Source') {
      this.setState({ selectedSourceName: e.target.value });
    }
  }
  render() {
    let remoteAPIList = [];
    var remoteSchemaAttrList = [];
    if (this.props.mappingStore.remoteAPIDataSchemas[this.props.mappingStore.selectedRemoteName]) {
      var selectedRemoteNameObj = this.props.mappingStore.remoteAPIDataSchemas[this.props.mappingStore.selectedRemoteName];
      if (selectedRemoteNameObj) {
        for(var sourceKey in selectedRemoteNameObj['normRemoteSchema']) {
          remoteSchemaAttrList.push(
            <option key={sourceKey} name={sourceKey}>{sourceKey}</option>
          );
        }
      }
    }
    var SourceSelectMenu = [];
    this.props.generic_master_store.SourceConfigs.map(sourceConfig => {
      SourceSelectMenu.push(
        <option
          disabled={!sourceConfig.CanBeUsable}
          hidden={this.props.mappingStore.configJson.SourceConfig.Name === sourceConfig.Name}
          key={(sourceConfig.tenantId ? sourceConfig.tenantId : '') +'-'+(sourceConfig.Group ? sourceConfig.Group : '')+'-'+sourceConfig.Name} className="optionDisable" value={sourceConfig.Name}>{sourceConfig.DataSourceType} - {sourceConfig.Name}</option>
      );
    });

    if (this.state.selectedSourceName !== 'Select Source') { //fix for #360
      for (var key in this.state.AddApiConfig) {
        let expandCollapseIcon = (key === this.state.activePanelID) ? 'fa fa-expand' : 'fa fa-compress';
        remoteAPIList.push(
          <div key={key}>
            <ListGroupItem>
              <span>
                <span style={{ cursor: 'pointer' }} onClick={this.toggleRemoteApiPanel.bind(this, key)}>
                  <span>
                    <span className="pull-left">
                      <i className={expandCollapseIcon}></i>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                      <span style={{ fontSize: 14, fontWeight: 'bold', color: '#455A64' }}>{key}</span>
                  </span>
                </span>

                <span style={{ cursor: 'pointer' }} onClick={this.removeRemoteApiPanel.bind(this, key)}>
                  <i className="fa fa-remove pull-right"></i>
                </span>
              </span>
            </ListGroupItem>
            <div>
              <Panel className="navtab" key={key + '_lgtp'} collapsible expanded={key === this.state.activePanelID}>
                <RequestVariablesHandler from="RemoteAPIConfig" currMapSpecIndex={this.props.currMapSpecIndex} sourceObjName={this.props.sourceObjName} normalised_source_schema={this.props.normalised_source_schema} key={key + 'Config'}  currRemoteSource={key} mappingStore={this.props.mappingStore} config={this.props.currMapSpec.mappingConf}/>
              </Panel>
            </div>
          </div>
      );
      }
    }
    return (
      <div className="selectedContainerStyle textCenter">
        <Row>
          <Col xs={12}>
            <FormControl componentClass="select" placeholder="select" onChange={this.addButtonClick.bind(this)} defaultValue={this.state.selectedSourceName} value={this.state.selectedSourceName}>
              <option key="select" value="Select Source">Select Source</option>
               {SourceSelectMenu}
            </FormControl>
          </Col>
        </Row>
        <Row className="mappedSpec">
          <ListGroup key="AddApiConfig">
           {remoteAPIList}
          </ListGroup>
        </Row>
      </div>
    );
  }
}

RemoteAPIConfig.propTypes = {
  store: React.PropTypes.object
};

export default RemoteAPIConfig;
