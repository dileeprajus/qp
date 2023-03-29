/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/*global BACKEND, SERVER_BASE_URL*/
import React from 'react';
import { Col, FormGroup, Radio, Row, FormControl, InputGroup, Button, Thumbnail, ControlLabel } from 'react-bootstrap';
import Scheduler from './schedulers';
import TriggerDataStore from './trigger_data_store';
import ThingWorx from '../../../configuration/Thingworx';
import CodeMirror from 'react-codemirror';
const thingworx = new ThingWorx();

class Triggers extends React.Component {
  constructor(props) {
    super(props);
    this.thing_store = this.props.thing_store;
    this.codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: false
    };
    this.s2dEndPoint = '';
    if (BACKEND === 'LoopBack') {
      this.s2dEndPoint = SERVER_BASE_URL + '/api/v1/source/getInputData';
    } else if (BACKEND === 'Thingworx') {
      this.s2dEndPoint = thingworx.midUrl(this.thing_store.name) + '/CreateTrigger';
    } else {}
    this.state = {
      d2s_end_point: thingworx.midUrl(this.thing_store.name) + '/PushDataToExternalSource',
      s2d_end_point: this.s2dEndPoint,
      sourceCheck: 'Data Push',
      destinationCheck: 'Data Send',
      DataIn: (this.props.generic_master_store.groupType === 'source') ? true : false,
      DataOut: (this.props.generic_master_store.groupType === 'target') ? true : false
    };
  }

  componentWillMount() {
    if (this.thing_store.store_name === 'FlexStore') {
      this.setState({
        s2d_end_point: thingworx.midUrl(this.thing_store.name) + '/CreateRecord',
        d2s_end_point: thingworx.midUrl(this.thing_store.name) + '/PushDataToExternalSource'
      });
    }
    this.thing_store.GetBasicConfigInfo();
    setTimeout(() => {
      let sourceCheck;
      let destinationCheck;
      if (Object.keys(this.thing_store.BasicConfigInfo).length > 0) {
        if ('Triggers' in this.thing_store.BasicConfigInfo.ConfigJson) {
          sourceCheck = this.thing_store.BasicConfigInfo.ConfigJson.Triggers.sourceTrigger;
          destinationCheck = this.thing_store.BasicConfigInfo.ConfigJson.Triggers.destinationTrigger;
        } else {
          let obj = this.thing_store.BasicConfigInfo.ConfigJson;
          obj['Triggers'] = this.thing_store.Triggers;
          this.updateConfigObject(obj);
          sourceCheck = this.thing_store.BasicConfigInfo.ConfigJson.Triggers.sourceTrigger;
          destinationCheck = this.thing_store.BasicConfigInfo.ConfigJson.Triggers.destinationTrigger;
        }
      } else {
        sourceCheck = this.thing_store.Triggers.sourceTrigger;
        destinationCheck = this.thing_store.Triggers.destinationTrigger;
      }
      this.setState({ sourceCheck: sourceCheck, destinationCheck: destinationCheck });
    }, 2000);
  }
  onChange(event) {
    this.thing_store.GetBasicConfigInfo;
    let tempTrigger = this.thing_store.Triggers;
    let tempConfigObj = this.thing_store.BasicConfigInfo.ConfigJson ? this.thing_store.BasicConfigInfo.ConfigJson : {};
    if (event.target.name === 'sourceTrigger') {
      if (event.target.value === 'Data Pull') {
        tempTrigger.sourceTrigger = 'Data Pull';
        tempTrigger.DataIn.DataPull = true;
        tempTrigger.DataIn.DataPush = false;
      } else {
        tempTrigger.sourceTrigger = 'Data Push';
        tempTrigger.DataIn.DataPush = true;
        tempTrigger.DataIn.DataPull = false;
      }
      tempTrigger.destinationTrigger = this.state.destinationCheck;
      this.setState({ sourceCheck: event.target.value });
    } else {
      if (event.target.value === 'Data Save') {
        tempTrigger.DataOut.DataSave = true;
        tempTrigger.DataOut.DataSend = false;
      } else {
        tempTrigger.DataOut.DataSend = true;
        tempTrigger.DataOut.DataSave = false;
      }
      tempTrigger.destinationTrigger = event.target.value;
      tempTrigger.sourceTrigger = this.state.sourceCheck;
      this.setState({ destinationCheck: event.target.value });
    }
    this.thing_store.setvalue('Triggers', tempTrigger);
    tempConfigObj['Triggers'] = tempTrigger;
    this.updateConfigObject(tempConfigObj);
  }
  updateConfigObject(tempConfigObj) {
    this.thing_store.BasicConfigInfo.ConfigJson = tempConfigObj;
    if (this.thing_store.store_name === 'FlexStore') {
      this.thing_store.UpdateConfigJson;
    } else this.thing_store.SetPropValues({ ConfigJson: tempConfigObj });
  }

  render() {
    var getInputDataPayload = {};
    if (BACKEND === 'LoopBack') {
      getInputDataPayload = {
        input: { key: '<<DATA>>' },
        configName: this.thing_store.name,
        groupName: this.thing_store.currentGroupName,
        tenantID: this.thing_store.currentTenantID
      };
    } else if (BACKEND === 'Thingworx') {
      getInputDataPayload = {
        input: { key: '<<DATA>>' },
        tenantID: this.thing_store.currentTenantID
      };
    } else {}
    return (
      <div key="triggerDiv">
        <h3 className="navtab">Triggers</h3>
        <Row key="triggerRow">
          <Col xs={12} sm={12} md={12} lg={12}>
            <div key="s2dDiv" id="" hidden={!this.state.DataIn}>
              <h4 className="trigger-margin">
                <i className="fa fa-database" aria-hidden="true"></i>
                <i className="fa fa-reply" aria-hidden="true"></i>&nbsp;
                Data In
              </h4>
              <FormGroup key="s2dFormGroup">
                <div key="s2dDataPull" className="col-md-6 col-sm-6">
                  <Radio
                    name="sourceTrigger" className="pull-left" value="Data Pull"
                    onChange={this.onChange.bind(this)} inline
                    checked={this.state.sourceCheck === 'Data Pull'}
                  >
                    Data Pull
                  </Radio>
                </div>
                <div key="s2dDataPush" className="col-md-6 col-sm-6">
                  <Radio
                    className="pull-right" name="sourceTrigger" value="Data Push"
                    onChange={this.onChange.bind(this)} inline
                    checked={this.state.sourceCheck === 'Data Push'}
                  >
                    Data Push
                  </Radio>
                </div>
              </FormGroup >&nbsp;
              <div
                key="schedulerDiv"
                hidden={this.state.sourceCheck !== 'Data Pull'}
              >
                <div hidden={this.thing_store.store_name==='FlexStore'}>
                  <Scheduler thing_store={this.thing_store} type="S2DTrigger" />
                </div>
                <div hidden={!(this.thing_store.store_name==='FlexStore')}>
                  <ControlLabel>Can't create scheduler for Flex DataSource</ControlLabel>
                </div>
              </div>
              <div
                key="EndPtDiv"
                hidden={this.state.sourceCheck === 'Data Pull'}
              >
                <FormGroup>
                  <InputGroup>
                    <InputGroup.Button>
                      <Button key="endpt_btn" bsStyle="info">End Point</Button>
                    </InputGroup.Button>
                    <FormControl
                      type="text" defaultValue={this.state.s2d_end_point}
                      disabled
                    />
                  </InputGroup>
                </FormGroup>
                <div key="getInputDataPayload">
                  <Thumbnail>
                    <h1> Payload </h1>
                    <CodeMirror
                      value={JSON.stringify(getInputDataPayload)} options={this.codeOptions}
                    />
                  </Thumbnail>
                </div>
              </div>
            </div>
            <div key="d2sDiv" id="" hidden={!this.state.DataOut}>
              <h4 className="trigger-margin">Data Out&nbsp;
                <i className="fa fa-database" aria-hidden="true"></i>
                <i className="fa fa-share" aria-hidden="true"></i></h4>
              <FormGroup key="d2sFormGroup">
                <div key="d2sDataSave" className="col-md-6 col-sm-6">
                  <Radio
                    className="pull-left" name="destinationTrigger" value="Data Save"
                    onChange={this.onChange.bind(this)} inline
                    checked={this.state.destinationCheck === 'Data Save'}
                  >
                    Save
                  </Radio>
                </div>
                <div key="d2sDataSend" className="col-md-6 col-sm-6">
                  <Radio
                    className="pull-right" name="destinationTrigger" value="Data Send"
                    onChange={this.onChange.bind(this)} inline
                    checked={this.state.destinationCheck === 'Data Send'}
                  >
                    Send
                  </Radio>
                </div>
              </FormGroup>&nbsp;
              <div
                key="d2sScheduleDiv" className="col-md-12 col-sm-12"
                hidden={this.state.destinationCheck !== 'Data Save'}
              >
                <TriggerDataStore thing_store={this.thing_store} type="D2STrigger" />

              </div>
              <div
                key="d2sEndpt"
                hidden={this.state.destinationCheck === 'Data Save'}
              >
                <FormGroup>
                  <InputGroup>
                    <InputGroup.Button>
                      <Button bsStyle="info">End Point</Button>
                    </InputGroup.Button>
                    <FormControl
                      type="text" defaultValue={this.state.d2s_end_point}
                      disabled
                    />
                  </InputGroup>
                </FormGroup>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

Triggers.propTypes = {
  store: React.PropTypes.object
};

export default Triggers;
