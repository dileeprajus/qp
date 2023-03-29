/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Button, ListGroup, ListGroupItem, Panel, FormControl, ButtonToolbar } from 'react-bootstrap';
import RequestVariablesHandler from './spec/request_variables_handler';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class RemoteSourceConfig extends React.Component {
    constructor(props) {
        super(props);
        this.generic_master_store = this.props.generic_master_store;

        this.state = {
            activePanelID: null,
            selectedSourceName: '',
            AddApiConfig: (this.props.mappingStore.configJson.RemoteSourceConfig === undefined)? {} : this.props.mappingStore.configJson.RemoteSourceConfig
        };
    }

    componentWillMount() {
        //   CODE HERE
    }

    onChange(){

    }
    toggleRemoteApiPanel(indx){
      if (indx === this.state.activePanelID) {
        this.setState({ activePanelID: null });
      } else {
        this.setState({ activePanelID: indx });
      }
    }
    removeRemoteApiPanel(key) {
        let remoteApiObj = this.state.AddApiConfig;
        var temp_config_json = this.props.mappingStore.configJson;
        delete remoteApiObj[key];
        temp_config_json['RemoteSourceConfig']=remoteApiObj;
        this.setState({ AddApiConfig: remoteApiObj, selectedSourceName: 'Select Source' });
    }
    addButtonClick(){
      if(this.state.selectedSourceName!=='' && this.state.selectedSourceName !== 'Select Source'){
        var remoteApiObj=this.state.AddApiConfig;
        if(remoteApiObj[this.state.selectedSourceName]===undefined){
          remoteApiObj[this.state.selectedSourceName]={}; //TODO: need to updat existing one , need to update store and get it from there
        }
        var temp_config_json = this.props.mappingStore.configJson;
        if(temp_config_json['RemoteSourceConfig']===undefined){
          temp_config_json['RemoteSourceConfig']={}
        }
        temp_config_json['RemoteSourceConfig']=remoteApiObj;
        this.setState({AddApiConfig: remoteApiObj})
      }
    }
    setSourceState(e){
        this.setState({selectedSourceName: e.target.value});
    }

    render() {
        let remoteAPIList = [];
        var SourceSelectMenu = [];
        this.props.generic_master_store.SourceConfigs.map(sourceConfig => {
            var showSourceList = false;
          if(BACKEND === 'LoopBack') {
            if((this.props.mappingStore.configJson.SourceConfig.Name === sourceConfig.Name) || (sourceConfig.tenantId !== this.props.generic_master_store.tenantID)){
               showSourceList = true;
            }else {
               showSourceList = false;
            }
          }else {
            if(this.props.mappingStore.configJson.SourceConfig.Name === sourceConfig.Name) {
                showSourceList = true;
            }else {
                showSourceList =  false;
            }
          }
          SourceSelectMenu.push(
            <option
              disabled={!sourceConfig.CanBeUsable}
              hidden={showSourceList}
              key={(sourceConfig.Group ? sourceConfig.Group : '') + '-' + sourceConfig.Name+ '-' + (sourceConfig.TenantId ? sourceConfig.TenantId: '')} className="optionDisable" value={sourceConfig.Name}>{sourceConfig.DataSourceType} - {sourceConfig.Name}</option>
          );
        });
        for(var key in this.state.AddApiConfig){
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
                          <span style={{ fontSize: 14, fontWeight: 'bold', color: '#455A64'}}>{key}</span>
                      </span>
                    </span>

                    <span style={{ cursor: 'pointer' }} onClick={this.removeRemoteApiPanel.bind(this, key)}>
                      <i className="fa fa-remove pull-right"></i>
                    </span>
                  </span>
                </ListGroupItem>
                <div>
                  <Panel  className="navtab" key={key + '_lgtp'} collapsible expanded={key === this.state.activePanelID}>
                    <RequestVariablesHandler from="RemoteSourceConfig" sourceObjName={this.props.sourceObjName} normalised_source_schema={this.props.normalised_source_schema} key={key + 'Config'}  currRemoteSource={key} mappingStore={this.props.mappingStore} config={this.props.mappingStore.configJson}/>
                  </Panel>
                </div>
            </div>
            )
        }
        return (
         <div className="selectedContainerStyle textCenter">
                 <Row>
                   <Col xs={10}>
                     <FormControl componentClass="select" placeholder="select" onChange={this.setSourceState.bind(this)} value={this.state.selectedSourceName}>
                       <option key="select" value="Select Source">Select Source</option>
                         {SourceSelectMenu}
                     </FormControl>
                   </Col>
                   <Col xs={2}>
                     <ButtonToolbar>
                       <Button bsStyle="success" onClick={this.addButtonClick.bind(this)}
                          disabled={this.state.selectedSourceName === 'Select Source' || this.state.selectedSourceName === ''}
                       >+</Button>
                     </ButtonToolbar>
                   </Col>
                 </Row>
             <Row className="mappedSpec">
             <ListGroup key='AddApiConfig'>
                 {remoteAPIList}
             </ListGroup>
             </Row>
         </div>
        );
    }
}

RemoteSourceConfig.propTypes = {
    store: React.PropTypes.object
};

export default RemoteSourceConfig;
