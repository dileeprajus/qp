/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Button, ListGroup, ListGroupItem, Panel, OverlayTrigger, Tooltip} from 'react-bootstrap';
import TargetBox from '../dnd/TargetBox';
import EditMapSpec from './spec/editMapSpec';
import TestJoltSpec from './spec/testJoltSpec';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import {NotificationContainer, NotificationManager} from 'react-notifications';

// FOR MORE INFORMATION AND HELP
// REFER to https://github.com/fritz-c/react-sortable-tree/blob/master/src/node-renderer-default.js

const selectedContainerStyle = {
  backgroundColor: '#BBDEFB',
  border: '2px solid #81D4FA',
  color: '#1976D2',
  padding: '1.5rem',
  textAlign: 'center',
  fontWeight: 'bold'
};

@inject('breadcrumb_store')
@observer
class MappingSpec extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      toggleTestSpec: true,
      toggleConfigUpload: true,
      activePanelID: null,
      disabld_upload_btn: false
    };
  }

  componentWillMount() {
    //   CODE HERE
  }

  clearNewAttribute(whichSide) {
    let currMapContainer = this.props.master.state.newMapContainer || {};
    currMapContainer[whichSide] = null;
    this.props.master.setState({ newMapContainer: currMapContainer });
  }

  selectedDropTile(whichSide) {
    return (<div style={selectedContainerStyle}>
      <span style={{ fontSize: 25, wordWrap: 'break-word'}}>{this.props.master.state.newMapContainer[whichSide].title}</span>
      <span style={{ color: '#42A5F5' }}>
        <br />
        <span style={{ fontSize: 12, fontWeight: 'normal' }}>
          <span
            style={{
              textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer'
            }}
            onClick={this.clearNewAttribute.bind(this, whichSide)}
          >
        Click here&nbsp;
          </span>
        to clear Selection </span>
        <br />
      </span>
    </div>);
  }

  addMappingTospec() {
    let currMapContainer = Object.assign({}, this.props.master.state.newMapContainer);
      currMapContainer['mappingConf']=currMapContainer['mappingConf']? currMapContainer['mappingConf']:{}; //to initialize mappingConf
      let mappedContainer = this.props.master.props.mappingStore.configJson.mappingSpec;
      mappedContainer.push(currMapContainer);
      this.props.master.setState({ newMapContainer: null, mappedContainer: mappedContainer });
      var tempConfig = this.props.master.props.mappingStore.configJson;
      tempConfig.mappingSpec = mappedContainer;
      this.props.master.props.mappingStore.setvalue('configJson', tempConfig);
  }

  toggleMapSpecPanel(indx) {
    if (indx === this.state.activePanelID) {
      // trunoffactive
      this.setState({ activePanelID: null });
    } else {
      this.setState({ activePanelID: indx });
    }
  }

  removeMapFromSpec(indx) {
    let currSpecArray = this.props.master.props.mappingStore.configJson.mappingSpec;
    currSpecArray.splice(indx, 1);
    this.props.master.setState({ mappingSpec: currSpecArray });
    var tempConfig = this.props.master.props.mappingStore.configJson;
    tempConfig.mappingSpec = currSpecArray;
    this.props.master.props.mappingStore.setvalue('configJson', tempConfig);
    this.setState({ activePanelID: null });
  }

  updateConfigJson(event) {
    var temp_config = this.props.master.props.mappingStore.configJson;
    if (event === '') {
      temp_config['mappingSpec'] = [];
      temp_config['RemoteSourceConfig'] = {};
    } else {
      var data = JSON.parse(event);
      temp_config['mappingSpec'] = data.mappingSpec;
      temp_config['RemoteSourceConfig'] = data.RemoteSourceConfig;
    }
    this.props.master.props.mappingStore.setvalue('configJson', temp_config);
  }

  saveConfigJson() { //TODO : Need to valide json before uploading
    var input_data = { 'ConfigJson': this.props.master.props.mappingStore.configJson}
    this.props.master.props.mappingStore.SetPropValues(input_data, this.configUploadCallback.bind(this));
    this.setState({ disabld_upload_btn: true });
  }

  configUploadCallback(type) {
    if (type === 'Success') {
      NotificationManager.success('Config Uploaded Successfully', 'Success', 1000);
      setTimeout(function () {
        this.setState({ disabld_upload_btn: false });
      }.bind(this), 1000);
    } else {
      NotificationManager.error('Config Uploaded Failed', 'Failed', 5000);
      setTimeout(function () {
        this.setState({ disabld_upload_btn: false });
      }.bind(this), 5000);
    }
  }


  render() {
    var codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: false,
      extraKeys: {
        'Ctrl-S': function (instance) { this.updateConfigJson(instance.getValue()); }.bind(this),
        'Ctrl-/': 'undo'
      }
    };

    let currMapContainer = this.props.master.state.newMapContainer || {};
    let sourceTitle = <TargetBox whichSide={'source'} masterComponent={this.props.master} />;
    let targetTitle = <TargetBox whichSide={'target'} masterComponent={this.props.master} />;
    let nowMap = true;
    let mappingSpec = [];
    if (currMapContainer['source'] && currMapContainer['target']) {
      nowMap = false;
    }
    if (currMapContainer['source']) {
      sourceTitle = this.selectedDropTile('source');
    }

    if (currMapContainer['target']) {
      targetTitle = this.selectedDropTile('target');
    }

    for (var i = 0; i < this.props.master.props.mappingStore.configJson.mappingSpec.length; i++) {
      let currMapSpec = this.props.master.props.mappingStore.configJson.mappingSpec[i];
      let expandCollapseIcon = (i === this.state.activePanelID) ? 'fa fa-expand' : 'fa fa-compress';
      let current_source = '';
      let current_target = '';
      var source_attr = '';
      var target_attr = '';
      if ((currMapSpec.source.title === '<PLACEHOLDER>')) {
        if (currMapSpec.source.placeholderValue !== ('' || undefined)) {
          current_source = '< ' + currMapSpec.source.placeholderValue + ' >';
        }
        if ((currMapSpec.source.placeholderValue === '') || (currMapSpec.source.placeholderValue === undefined)){
          current_source = currMapSpec.source.title;
        }
      } else {
        current_source = currMapSpec.source.title;
      }
      if ((currMapSpec.target.title === '<PLACEHOLDER>')) {
        if (currMapSpec.target.placeholderKey !== ('' ||  undefined)){
          current_target = '< ' + currMapSpec.target.placeholderKey + ' >';
        }
        if ((currMapSpec.target.placeholderKey === '') || (currMapSpec.target.placeholderKey === undefined)){
          current_target = currMapSpec.target.title;
        }
      } else {
        current_target = currMapSpec.target.title;
      }
      if ((currMapSpec.target.title === '<PLACEHOLDER>')||(currMapSpec.source.title === '<PLACEHOLDER>')) {
        if (currMapSpec.source.title === '<PLACEHOLDER>') {
          source_attr = currMapSpec.source.placeholderValue;
          if (currMapSpec.target.title !== '<PLACEHOLDER>') {
            target_attr = (currMapSpec.target.attrPrefix).replace('.schema.', '');
          }
        }
        if (currMapSpec.target.title === '<PLACEHOLDER>') {
          target_attr = currMapSpec.target.placeholderKey;
          if (currMapSpec.source.title !== '<PLACEHOLDER>') {
            source_attr = (currMapSpec.source.attrPrefix).replace('.schema.', '');
          }
        }
        if ((currMapSpec.target.title === '<PLACEHOLDER>') && (currMapSpec.source.title === '<PLACEHOLDER>')) {
          source_attr = currMapSpec.source.placeholderValue;
          target_attr = currMapSpec.target.placeholderKey;
        }
      } else {
         source_attr = (currMapSpec.source.attrPrefix).replace('.schema.', '');
         target_attr = (currMapSpec.target.attrPrefix).replace('.schema.', '');
      }
      mappingSpec.push(
        <ListGroupItem key={i + '_lgt'} title={source_attr + ' --> ' + target_attr}>
          <span>
            <span style={{ cursor: 'pointer' }} onClick={this.toggleMapSpecPanel.bind(this, i)}>
              <span style={{ fontSize: 14, fontWeight: 'bold', color: '#455A64'}}>
                <span className="pull-left">
                  <i className={expandCollapseIcon}></i>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                  {current_source}
                  <i style={{ color: '#607D8B' }} className="fa fa-long-arrow-right"></i>
                  {current_target}
              </span>
            </span>

            <span style={{ cursor: 'pointer' }} onClick={this.removeMapFromSpec.bind(this, i)}>
              <i className="fa fa-remove pull-right"></i>
            </span>

          </span>

        </ListGroupItem>,
        <Panel key={i + '_lgtp'} collapsible expanded={i === this.state.activePanelID}>
          <EditMapSpec currMapSpec={currMapSpec} currMapSpecIndex={i} masterComponent={this.props.master} saveMappingSpec={this.props.saveMappingSpec} />
        </Panel>
      );
    }
    if (this.props.master.props.mappingStore.configJson.mappingSpec.length === 0) {
      mappingSpec = 'Please map attributes..';
    }
    var mapping_test_tooltip = (<Tooltip id="tooltip-mapping-test"><strong>Mapping Test</strong></Tooltip>)
    var upload_config_tooltip = (<Tooltip id="tooltip-upload-config"><strong>Upload </strong> Config.</Tooltip>)
    var uploadable_json = {}
    uploadable_json['mappingSpec'] = this.props.master.props.mappingStore.configJson.mappingSpec;
    uploadable_json['RemoteSourceConfig'] = this.props.master.props.mappingStore.configJson.RemoteSourceConfig;
    return (
      <div className="affix-example">
        <div style={{ display: this.state.toggleConfigUpload ? 'inherit' : 'none' }}>
          <i className="fa fa-chevron-down" onClick={() => { this.setState({ toggleConfigUpload: !this.state.toggleConfigUpload }) }} style={{ paddingRight: '15px',cursor: 'pointer' }} ></i>
        </div>
        <div style={{ display: !this.state.toggleConfigUpload ? 'inherit' : 'none' }}>
          <i className="fa fa-chevron-up" onClick={() => { this.setState({ toggleConfigUpload: !this.state.toggleConfigUpload }) }} style={{ paddingRight: '15px',cursor: 'pointer' }} ></i>
        </div>

          <div className="MappingSpecContainer" style={{ display: this.state.toggleConfigUpload ? 'inherit' : 'none' }}>
            <Col xs={1} xsOffset={11} style={{ marginTop: -15, marginBottom: 10 }}>
            <OverlayTrigger rootClose={true} placement="top" overlay={mapping_test_tooltip}>
              <i className="fa fa-cog" onClick={() => { this.setState({ toggleTestSpec: !this.state.toggleTestSpec }) }} style={{ paddingRight: '15px',cursor: 'pointer' }} ></i>
              </OverlayTrigger></Col>

            <Row className="newMapSpec" style={{ display: this.state.toggleTestSpec ? 'inherit' : 'none' }}>
              <Col xs={5} sm={5} md={5} lg={5}>
                <Row>
                  {sourceTitle}
                </Row>
              </Col>
              <Col xs={2} sm={2} md={2} lg={2} style={{ textAlign: 'center', fontSize: '25px', color: '#4CAF50' }}>
                <Row style={{ marginBottom: '-12px' }}>
                  <i className="fa fa-chevron-down success"></i>
                </Row>
                <Row>
                  <i className="fa fa-arrow-down success"></i>
                </Row>
                <Row>
                  <Button bsStyle="success" bsSize="medium" disabled={nowMap} onClick={this.addMappingTospec.bind(this)}>Map Now</Button>
                </Row>
              </Col>
              <Col xs={5} sm={5} md={5} lg={5}>
                <Row>
                  {targetTitle}
                </Row>
              </Col>
            </Row>
            <Row className="newMapSpec" style={{ display: !this.state.toggleTestSpec ? 'inherit' : 'none' }}>
              <TestJoltSpec key="testSpec" saveMappingSpec={this.props.saveMappingSpec} masterComponent={this.props.master} sourceSchema={this.props.sourceSchema} targetSchema={this.props.targetSchema} />
            </Row>
            <Row className="mappedSpec">
              <ListGroup>
                {mappingSpec}
              </ListGroup>
            </Row>
          </div>

          <div className="MappingSpecContainer" style={{ display: !this.state.toggleConfigUpload ? 'inherit' : 'none' }}>

            <OverlayTrigger rootClose={true} placement="top" overlay={upload_config_tooltip}>
              <Button
                className="pull-right"
                bsSize="xsmall"
                bsStyle="info"
                onClick={this.saveConfigJson.bind(this)}
                disabled={this.state.disabld_upload_btn}
              >
                <i className="fa fa-upload"></i>
              </Button>
            </OverlayTrigger>
            <CodeMirror
              value={JSON.stringify(uploadable_json, null, 2)}
              options={codeOptions}
              onChange={this.updateConfigJson.bind(this)}
            />
          </div>

        <NotificationContainer />
      </div>

    );
  }
}

MappingSpec.propTypes = {
  store: React.PropTypes.object
};

export default MappingSpec;
