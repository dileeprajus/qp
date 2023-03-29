/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import {FormGroup,FormControl,ControlLabel,Row,Col,Tooltip,OverlayTrigger,Button} from 'react-bootstrap'
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import AlertContainer from 'react-alert';

@inject('routing', 'generic_master_store')
@observer
class TestRequestVariables extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.client_store = this.props.client_store;
    this.state = {
      TestOutput: {},
      request_variables_list: []
    }
  }

  componentWillReceiveProps() {
    if (this.client_store['configJson']['RequestVariables'] !== undefined) {
      var request_variables_json = this.client_store['configJson']['RequestVariables'];
      if(this.client_store.store_name === 'FTPClientStore') {
        for (var key in request_variables_json) {
          var tempObj = {};
          for(var k in request_variables_json[key]){
            tempObj[k] = '';
          }
          request_variables_json[key] = tempObj;
        }
        this.generic_master_store.setvalue('RequestVarsObj', request_variables_json);
      }else {
        var obj = {};
        for (var key in request_variables_json) {
          obj[key] = '';
        }

        this.generic_master_store.setvalue('RequestVarsObj', obj);
      }
      this.generic_master_store.setvalue('RequestVarsTestResult', {});
    }
  }

  onChange(event) {
    var obj = this.generic_master_store.RequestVarsObj;
    obj[event.target.name] = event.target.value;
    this.generic_master_store.setvalue('RequestVarsObj', obj);
  }

  reqVarOnChange(type, key, event) {
    var reqVarObj = this.generic_master_store.RequestVarsObj[type];
    for (var tp in reqVarObj) { // eslint-disable-line no-unused-vars
      if (reqVarObj[key] !== undefined) {
        reqVarObj[key] =  event.target.value;
      }
    }
   this.generic_master_store.RequestVarsObj[type] = reqVarObj;
  }

  showAlert = (msg) => {
      this.msg.show(msg, {
          type: 'error'
      })
  };
  alertOptions = {
    offset: 40,
    position: 'bottom left',
    theme: 'dark',
    time: 3000,
    transition: 'scale'
  };
  constructObjectFromArray(obj, keys, v) {
    if (keys.length === 1) {
      obj[keys[0]] = v;
    } else {
      var key = keys.shift();
      obj[key] = this.constructObjectFromArray(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);
    }
    return obj;
  }

  testSource(){
         if(this.client_store.store_name === 'SoapConfigStore' || this.client_store.store_name === 'RestClientStore' || this.client_store.store_name === 'FlexStore' || this.client_store.store_name === 'DataBaseStore' || this.client_store.store_name === 'FTPClientStore'){
          var rv_obj = this.generic_master_store.RequestVarsObj;
         }
         if(Object.keys(this.client_store.BasicConfigInfo)) {
            var basicConfigInfo = this.client_store.BasicConfigInfo;
         }
         var SoapRestConfig = (this.client_store.store_name === 'SoapConfigStore') ? this.client_store.SoapRestConfig : {};
         this.generic_master_store.TestRequestVars(rv_obj, this.client_store.name, this.client_store.currentGroupName, this.client_store.currentGroupType, basicConfigInfo, this.client_store.configJson, this.client_store.inputSchema, this.client_store.outputSchema, SoapRestConfig, this.client_store.schedularScript);
  }

  schedualrScript(value) {
    this.client_store.schedularScript = value.split('\n');
  }
  testResponse() {
    this.client_store.getFilesListData(this.generic_master_store.RequestVarsTestResult);
  }
  renderRequestVars() {
    var output = []
    var obj = this.generic_master_store.RequestVarsObj;
    if(this.client_store.store_name === 'FTPClientStore') {
      for(var type in obj) {
        for (var key in obj[type]) {
          output.push(
            <div>
            <ControlLabel><h6><b style={{wordWrap: 'break-word'}}>{type} : </b></h6></ControlLabel>
            <Row key={key} style={{textAlign: 'center'}}>
              <Col xs={5} key={'list1' + key}>
                <FormGroup>
                  <ControlLabel><h6><b style={{wordWrap: 'break-word'}}>{key} : </b></h6></ControlLabel>
                </FormGroup>
              </Col>
              <Col xs={5} key={'list2' + key}>
                <FormControl
                  type="text" placeholder="Enter value"
                  name={key} value={obj[type][key]}
                  onChange={this.reqVarOnChange.bind(this, type, key)} required
                />
              </Col>
            </Row>
            </div>
          )
        }
      }
    }else {
      for (var key in obj) {
        output.push(
          <Row key={key} style={{textAlign: 'center'}}>
            <Col xs={5} key={'list1' + key}>
              <FormGroup>
                <ControlLabel><h6><b style={{wordWrap: 'break-word'}}>{key} : </b></h6></ControlLabel>
              </FormGroup>
            </Col>
            <Col xs={5} key={'list2' + key}>
              <FormControl
                type="text" placeholder="Enter value"
                name={key} value={obj[key]}
                onChange={this.onChange.bind(this)} required
              />
            </Col>
          </Row>)
      }
    }
    return output;
  }

  render() {
    var test_tooltip = (<Tooltip id="tooltip-script-test"><strong>Test </strong></Tooltip>);
    var res_tooltip = (<Tooltip id="tooltip-script-res"><strong>getData </strong></Tooltip>);
    var codeOptions = {
      lineNumbers: true,
      mode: 'javascript'
    };
    var request_vars_codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: false
    };
    var request_variables_list = this.renderRequestVars();
    var test_component = (
      <Row id="SpecJsonPretty" style={{ backgroundColor: '#282A36' }}>
        <div className="grayBorderDiv">
          <OverlayTrigger placement="left" overlay={test_tooltip}>
            <Button
              className="pull-right"
              bsSize="xsmall"
              bsStyle="info"
              onClick={this.testSource.bind(this)}
            >
              <i className="fa fa-flask"></i>
            </Button>
          </OverlayTrigger>
        </div>
        <div>
          <CodeMirror
            id="requestVariables-json-pretty"
            value={JSON.stringify(this.generic_master_store.RequestVarsTestResult, null, 2)}
            options={request_vars_codeOptions}
          />
        </div>
      </Row>
    );
    return (
      <div className="selectedContainerStyle">
        <div hidden={request_variables_list.length !== 0}>
          <p style={{ color: 'gray', textAlign: 'center' }}>{'There are no request variables'}
          </p>
        </div>
        <div>
         {request_variables_list}
         <FormGroup hidden={this.client_store.currentGroupType === 'target' || this.client_store.store_name !== 'FTPClientStore'}>
          <Row>
            <Col xs={4}>
              <FormGroup style={{textAlign: 'center'}}>
                <ControlLabel><h6><b style={{ wordWrap: 'break-word' }}>SchedulerScript : </b></h6></ControlLabel>
              </FormGroup>
            </Col>
            <Col xs={8}>
              <Row id="SpecJsonPretty" className="grayBorderDiv">
                <div >
                  <OverlayTrigger placement="left" overlay={test_tooltip}>
                    <Button
                      className="pull-right"
                      bsSize="xsmall"
                      bsStyle="info"
                      onClick={this.testSource.bind(this)}
                    >
                      <i className="fa fa-refresh" aria-hidden="true"></i>
                    </Button>
                  </OverlayTrigger>
                </div>
                <div>
                  <CodeMirror value={this.client_store.schedularScript ? this.client_store.schedularScript.join('\n') : ''} onChange={this.schedualrScript.bind(this)} options={codeOptions} />
                </div>
              </Row>
            </Col>
          </Row>
         </FormGroup>
          <FormGroup hidden={this.client_store.store_name === 'FTPClientStore'}>
           {test_component}
          </FormGroup>
          <FormGroup/>
          <FormGroup hidden={this.client_store.currentGroupType === 'target' || this.client_store.store_name !== 'FTPClientStore'}>
            <Row>
              <Col xs={6} sm={6} md={6} lg={6}>
                <div id="ftpResponseView" style={{ backgroundColor: '#282A36' }}>
                  <div className="grayBorderDiv">
                    <OverlayTrigger placement="left" overlay={res_tooltip}>
                      <Button
                        className="pull-right"
                        bsSize="xsmall"
                        bsStyle="info"
                        onClick={this.testResponse.bind(this)}
                      >
                        <i className="fa fa-flask"></i>
                      </Button>
                    </OverlayTrigger>
                  </div>
                  <div>
                  <CodeMirror
                    id="requestVariables-json-pretty"
                    value={JSON.stringify(this.generic_master_store.RequestVarsTestResult, null, 2)}
                    options={request_vars_codeOptions}
                  />
                  </div>
                </div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6}>
                <CodeMirror
                  id="requestVariables-jsonResponse-pretty"
                  value={JSON.stringify(this.client_store.filesListData, null, 2)}
                  options={request_vars_codeOptions}
                />
              </Col>
            </Row>
          </FormGroup>
      </div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
    );
  }
}

TestRequestVariables.propTypes = {
  store: React.PropTypes.object
};

export default TestRequestVariables;
