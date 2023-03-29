/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Thumbnail, Row, Col, ControlLabel, FormGroup, FormControl, Button, ButtonToolbar, DropdownButton, MenuItem, Checkbox } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import ScriptFilters from '../../GenericComponents/schema/transformationRules/script_filters';

@inject('type_manager_store')
@observer
class CustomAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.type_manager_store = this.props.type_manager_store;
    this.state = {
      enableTestButton: false,
      cacheEnable: false,
      expirityTime: '0',
      retryCount:'1'
    }
  }

  componentDidMount() {
    this.type_manager_store.GetDataTypes;
    if(this.props.rest_client_store.configJson['customAuthDetails'] && this.props.rest_client_store.configJson['customAuthDetails']['customAuthUrl'] !== '' && this.rest_client_store.configJson['customAuthDetails']['customAuthUrl'] !== null && this.rest_client_store.configJson['customAuthDetails']['customAuthUrl'] !== undefined){
      this.setState({ enableTestButton: true })
    }
    else{
      this.setState({ enableTestButton: false })
    }
    if((this.rest_client_store.configJson['customAuthDetails'] !== undefined) && (this.rest_client_store.configJson['customAuthDetails']['enableCache'])) {
      this.setState({ cacheEnable: this.rest_client_store.configJson['customAuthDetails']['enableCache'] })
      this.setState({ expirityTime:  this.rest_client_store.configJson['customAuthDetails']['expirityTime']})
      this.setState({retryCount:this.rest_client_store.configJson['customAuthDetails']['retryCount']===undefined?1:this.rest_client_store.configJson['customAuthDetails']['retryCount']})
    }
  }

  testCustomAuth() {
    this.rest_client_store.testCustomAuth();
  }
  updateCustomDetails(type, event) {
    var temp = this.rest_client_store['customAuthDetails'];
    if (type === 'customAuthUrl') {
      temp[type] = event.target.value;
    } else temp[type] = JSON.parse(event);
    this.rest_client_store.setvalue('customAuthDetails', temp);
    this.setState({ enableTestButton: true })
  }

  selectItem(name,event){
    var temp = this.rest_client_store['customAuthDetails'];
    temp[name] = event;
    this.rest_client_store.setvalue('customAuthDetails', temp);
    this.rest_client_store.setvalue(name,event);
    this.setState({ enableTestButton: true })
  }

  updateTreeData(scripts){
    var temp = this.rest_client_store.customAuthDetails;
    temp['TransformationRules']=scripts;
    this.rest_client_store.setvalue('customAuthDetails', temp);
  }
  onCacheChange(event){
    var tempCustomDetails = this.rest_client_store.customAuthDetails;
    tempCustomDetails['enableCache']=event.target.checked;
    this.rest_client_store.setvalue('customAuthDetails', tempCustomDetails);
    this.setState({'cacheEnable':event.target.checked})
  }
  onExpiryChangeChange(event){
    var tempCustomExpiryDetails = this.rest_client_store.customAuthDetails;
    tempCustomExpiryDetails['expirityTime']= event.target.value 
    this.rest_client_store.setvalue('customAuthDetails', tempCustomExpiryDetails);
    this.setState({'expirityTime':event.target.value})
  }
  onRetryCountChange(event){
    var tempCustomRetryCount = this.rest_client_store.customAuthDetails;
    tempCustomRetryCount['retryCount']= event.target.value 
    this.rest_client_store.setvalue('customAuthDetails', tempCustomRetryCount);
    this.setState({'retryCount':event.target.value})
  }

  render() {
    var headersCodeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: false
    };
    var testCodeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    var scriptForm = '';
    if (this.rest_client_store.customAuthDetails !== undefined) {
      scriptForm = (<ScriptFilters
        source_key="host"
        destination_key="client"
        snode={this.rest_client_store.customAuthDetails}
        master={this}
        type_manager_store={this.type_manager_store}
        from="TargetScripts"
        fromCustomAuth={true}
        prop_key="TransformationRules"
      />);
    }
    var option_list = this.rest_client_store.rest_method_list.map(m => {
      return(
        <MenuItem key={m} eventKey={m} active={((this.rest_client_store['custom_auth_method_type']?this.rest_client_store['custom_auth_method_type']:'') === m)? true : false }>{m}</MenuItem>
      )
    });
    var payload_option_list = this.rest_client_store.payload_option_list.map(m => {
      return(
        <MenuItem key={m} eventKey={m} active={(this.rest_client_store['custom_auth_current_payload_option'] === m)? true : false }>{m}</MenuItem>
      )
    });
    return (
      <div>
        <Row>
          <Col xs={8} xsOffset={2}>
            <div className="accesstoken-header">CUSTOM AUTH DETAILS</div>
            <Thumbnail>
              <FormGroup>
                <Col sm={4}>
                  <ControlLabel className="col-sm-5">Method Type</ControlLabel>
                </Col>
                <Col xsOffset={0} sm={8}>
                  <ButtonToolbar>
                    <DropdownButton bsStyle={'Default'.toLowerCase()} title={this.rest_client_store['custom_auth_method_type']} name="custom_auth_method_type" value={this.rest_client_store['custom_auth_method_type']} onSelect={this.selectItem.bind(this, 'custom_auth_method_type')} id="customAuth-dropdown-basic">
                      {option_list}
                    </DropdownButton>
                  </ButtonToolbar>
                </Col>
              </FormGroup>
              &nbsp;
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel className="col-sm-5">Auth URL</ControlLabel>
                </Col>
                <Col xsOffset={4} sm={8}>
                  <FormControl type="text" className="tabtext" placeholder="Custom Auth URL" name="customAuthUrl" value={this.rest_client_store['customAuthDetails']['customAuthUrl']} onChange={this.updateCustomDetails.bind(this, 'customAuthUrl')} />
                </Col>
              </FormGroup>
              &nbsp;
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel className="col-sm-5">Headers</ControlLabel>
                </Col>
                <span hidden={!this.state.showErr}
                      style={{ color: '#F4BA41' }}>Enter valid JSON</span>
                <Col xsOffset={4} sm={8}>
                  <CodeMirror
                    name="headers"
                    value={JSON.stringify(this.rest_client_store['customAuthDetails']['headers'], null, 2)}
                    options={headersCodeOptions}
                    onChange={this.updateCustomDetails.bind(this, 'headers')}
                  />
                </Col>
              </FormGroup>
                &nbsp;
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel className="col-sm-5">PayLoad</ControlLabel>
                </Col>
                <Col xsOffset={4} sm={8}>
                  <ButtonToolbar>
                    <DropdownButton bsStyle={'Default'.toLowerCase()} title={this.rest_client_store['custom_auth_current_payload_option']} name="custom_auth_current_payload_option" value={this.rest_client_store['custom_auth_current_payload_option']} onSelect={this.selectItem.bind(this,'custom_auth_current_payload_option')} id="dropdown-basic">
                      {payload_option_list}
                    </DropdownButton>
                  </ButtonToolbar>
                </Col>
                &nbsp;
                <Col xsOffset={4} sm={8}>
                  <CodeMirror
                    name="payload"
                    id="api_test_xml-pretty"
                    value={JSON.stringify(this.rest_client_store['customAuthDetails']['payload'], null, 2)}
                    options={headersCodeOptions}
                    onChange={this.updateCustomDetails.bind(this, 'payload')}
                  />
                </Col>
              </FormGroup>
              &nbsp;
              <FormGroup>
                <Row>
                <Col xs={12}>
                <Col xs={4}>
                  <ControlLabel>Enable Token Caching</ControlLabel>
                </Col>
                <Col xs={8}>
                  <Checkbox name="isCaching"  checked={this.rest_client_store['customAuthDetails']['enableCache']} onChange={this.onCacheChange.bind(this)} inline/>
                </Col>
                </Col>
                </Row>
                <Row hidden={this.rest_client_store['customAuthDetails']['enableCache']?this.rest_client_store['customAuthDetails']['cacheEnable']:this.state.cacheEnable === false}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Col xs={12}>
                <Col xs={4} hidden={this.rest_client_store['customAuthDetails']['enableCache']?this.rest_client_store['customAuthDetails']['cacheEnable']:this.state.cacheEnable === false}>
                  <ControlLabel>Token Expiry (Sec)</ControlLabel>
                </Col>
                <Col xs={3} hidden={this.rest_client_store['customAuthDetails']['enableCache']?this.rest_client_store['customAuthDetails']['cacheEnable']:this.state.cacheEnable === false}>
                    <FormControl type="text" placeholder="expiryTime" name="expiryTime" value={this.rest_client_store['customAuthDetails']['expirityTime']} onChange={this.onExpiryChangeChange.bind(this)}/>
                </Col>
                </Col>
                </Row>
                <Row hidden={this.rest_client_store['customAuthDetails']['enableCache']?this.rest_client_store['customAuthDetails']['cacheEnable']:this.state.cacheEnable === false}>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Col xs={12}>
                <Col xs={4} hidden={this.rest_client_store['customAuthDetails']['enableCache']?this.rest_client_store['customAuthDetails']['cacheEnable']:this.state.cacheEnable === false}>
                  <ControlLabel>Retry Count</ControlLabel>
                </Col>
                <Col xs={3} hidden={this.rest_client_store['customAuthDetails']['enableCache']?this.rest_client_store['customAuthDetails']['cacheEnable']:this.state.cacheEnable === false}>
                    <FormControl type="text" placeholder="retryCount" name="retryCount" value={this.rest_client_store['customAuthDetails']['retryCount']===undefined?this.state.retryCount:this.rest_client_store['customAuthDetails']['retryCount']} onChange={this.onRetryCountChange.bind(this)}/>
                </Col>
                </Col>
                </Row>
              </FormGroup>
                  &nbsp;
              <FormGroup>
                <p className="pull-right">
                  <Button bsStyle="warning" disabled={!this.state.enableTestButton || !this.rest_client_store['customAuthDetails']['customAuthUrl']} className="req-btn-position" onClick={this.testCustomAuth.bind(this)}>Test</Button>
                </p>
              </FormGroup>
              &nbsp;
              <CodeMirror id="api_test_xml-pretty" value={JSON.stringify(this.rest_client_store.custom_auth_test_response, null, 2)} options={testCodeOptions} />
              <FormGroup>
              <div key="customAuthScriptForm">
                {scriptForm}
              </div>
            </FormGroup>
            </Thumbnail>
          </Col>
        </Row>
      </div>
    );
  }
}

CustomAuthForm.propTypes = {
  store: React.PropTypes.object
};

export default CustomAuthForm;
