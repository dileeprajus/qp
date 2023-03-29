/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Thumbnail, Row, Col, ControlLabel, FormGroup, FormControl, Button, ButtonToolbar, DropdownButton, MenuItem, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import ScriptFilters from '../../GenericComponents/schema/transformationRules/script_filters';

@inject('type_manager_store')
@observer
class AuthorizationCodeGrantForm extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.type_manager_store = this.props.type_manager_store;
    this.state = {
      enableTestButton: false,
      disableAuthCodeUpdateFlag : true
    }
  }

  componentWillReceiveProps() {
    if(this.props.rest_client_store.configJson['oauth_details'] && this.props.rest_client_store.configJson['oauth_details']['AuthorizationCodeGrant'] && this.props.rest_client_store.configJson['oauth_details']['AuthorizationCodeGrant']['auth_code_url'] !== '' && this.props.rest_client_store.configJson['oauth_details']['AuthorizationCodeGrant']['client_id'] !== ''){
      this.setState({ enableTestButton: true })
    }
    else{
      this.setState({ enableTestButton: false })
    }
  }

  testAuthCode() {
    this.rest_client_store.testAuthCodeAPI();
  }

  updateAuthCodeDetails(type, event) {
    var temp = this.rest_client_store['oauth_details'];
    if(temp['AuthorizationCodeGrant']===undefined){
        temp['AuthorizationCodeGrant'] = {}
    }
    if (type === 'headers' || type === 'auth_details') {
      temp['AuthorizationCodeGrant'][type] = JSON.parse(event);
    } else temp['AuthorizationCodeGrant'][type] = event.target.value;
    this.rest_client_store.setvalue('oauth_details', temp);
    this.setState({ enableTestButton: true })
  }

  updateAuthCodeIntoStore(event){
    var temp = this.rest_client_store['oauth_details'];
    temp['code'] = this.type_manager_store.test_script_output.value
    temp.AuthorizationCodeGrant.TransformationRules = this.rest_client_store.AuthorizationCodeGrant.TransformationRules;
    this.rest_client_store.setvalue('oauth_details', temp);
  }

  selectItem(name,event){
    var temp = this.rest_client_store['oauth_details'];
    if(temp['AuthorizationCodeGrant']===undefined){
        temp['AuthorizationCodeGrant'] = {}
    }
    temp['AuthorizationCodeGrant'][name] = event;
    this.rest_client_store.setvalue('oauth_details', temp);
    this.setState({ enableTestButton: true })
  }

  updateTreeData(scripts){
    var temp = this.rest_client_store.oauth_details;
    temp['AuthorizationCodeGrant']['TransformationRules']=scripts;
    this.rest_client_store.setvalue('oauth_details', temp);
    var temp2 = this.rest_client_store.AuthorizationCodeGrant;
    temp2['TransformationRules']=scripts;
    this.rest_client_store.setvalue('AuthorizationCodeGrant', temp2);
  }

  render() {
    var mandatory_field_style = {color: 'red', fontWeight: 'bold', fontSize: 'medium'}
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
    if (this.rest_client_store.AuthorizationCodeGrant !== undefined) {
      scriptForm = (<ScriptFilters
        source_key="host"
        destination_key="client"
        snode={this.rest_client_store.AuthorizationCodeGrant}
        master={this}
        type_manager_store={this.type_manager_store}
        from="TargetScripts"
        fromCustomAuth={true}
        prop_key="TransformationRules"
      />);
    }
    var update_code_modal_tooltip = (<Tooltip id="tooltip-script-modal"><strong>Update AuthorizationCode</strong></Tooltip>)
    var option_list = this.rest_client_store.rest_method_list.map(m => {
      return(
        <MenuItem key={m} eventKey={m} active={((this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['method_type']?this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['method_type']:'') === m)? true : false }>{m}</MenuItem>
      )
    });
    return (
      <div>
        <Row>
          <Col xs={8} xsOffset={2}>
            <div className="accesstoken-header">AUTH CODE API DETAILS</div>
            <Thumbnail>
              <FormGroup>
                <Col sm={4}>
                  <ControlLabel className="col-sm-5">Method Type</ControlLabel>
                </Col>
                <Col xsOffset={0} sm={8}>
                  <ButtonToolbar>
                    <DropdownButton bsStyle={'Default'.toLowerCase()} title={this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['method_type']} name="method_type" value={this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['method_type']} onSelect={this.selectItem.bind(this,'method_type')} id="authcode-dropdown-basic">
                      {option_list}
                    </DropdownButton>
                  </ButtonToolbar>
                </Col>
              </FormGroup>
              &nbsp;
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel className="col-sm-5">AuthCode API URL <span style={mandatory_field_style}>*</span></ControlLabel>
                </Col>
                <Col xsOffset={4} sm={8}>
                  <FormControl type="text" className="tabtext" placeholder="Auth Code URL" name="auth_code_url" value={this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['auth_code_url']} onChange={this.updateAuthCodeDetails.bind(this, 'auth_code_url')} />
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
                    value={JSON.stringify(this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['headers'], null, 2)}
                    options={headersCodeOptions}
                    onChange={this.updateAuthCodeDetails.bind(this, 'headers')}
                  />
                </Col>
              </FormGroup>
              &nbsp;
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel className="col-sm-5">Response Type <span style={mandatory_field_style}>*</span></ControlLabel>
                </Col>
                <Col xsOffset={4} sm={8}>
                  <FormControl type="text" className="tabtext" placeholder="response_type" name="response_type" value={this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['response_type']} disabled />
                </Col>
              </FormGroup>
                &nbsp;
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel className="col-sm-5">Client ID <span style={mandatory_field_style}>*</span></ControlLabel>
                </Col>
                <Col xsOffset={4} sm={8}>
                  <FormControl type="text" className="tabtext" placeholder="client id" name="client_id" value={this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['client_id']} onChange={this.updateAuthCodeDetails.bind(this, 'client_id')} />
                </Col>
              </FormGroup>
              &nbsp;
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel className="col-sm-5">Redirect URI</ControlLabel>
                </Col>
                <Col xsOffset={4} sm={8}>
                  <FormControl type="text" className="tabtext" placeholder="Redirect URI" name="redirect_uri" value={this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['redirect_uri']} onChange={this.updateAuthCodeDetails.bind(this, 'redirect_uri')} />
                </Col>
              </FormGroup>
              &nbsp;
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel className="col-sm-5">State</ControlLabel>
                </Col>
                <Col xsOffset={4} sm={8}>
                  <FormControl type="text" className="tabtext" placeholder="State" name="state" value={this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['state']} onChange={this.updateAuthCodeDetails.bind(this, 'state')} />
                </Col>
              </FormGroup>
              &nbsp;
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel className="col-sm-5">Scope</ControlLabel>
                </Col>
                <Col xsOffset={4} sm={8}>
                  <FormControl type="text" className="tabtext" placeholder="Scope" name="scope" value={this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['scope']} onChange={this.updateAuthCodeDetails.bind(this, 'scope')} />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={12}>
                  <ControlLabel className="col-sm-5">Authentication</ControlLabel>
                </Col>
                <Col xsOffset={4} sm={8}>
                  <CodeMirror
                    name="authentication"
                    id="api_test_xml-pretty"
                    value={JSON.stringify(this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['auth_details'], null, 2)}
                    options={headersCodeOptions}
                    onChange={this.updateAuthCodeDetails.bind(this,'auth_details')}
                  />
                </Col>
              </FormGroup>
                  &nbsp;
              <FormGroup>
                <p className="pull-right">
                  <Button bsStyle="warning" disabled={!this.state.enableTestButton || !this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['auth_code_url'] || !this.rest_client_store['oauth_details']['AuthorizationCodeGrant']['client_id']} className="req-btn-position" onClick={this.testAuthCode.bind(this)}>Test</Button>
                </p>
              </FormGroup>
              &nbsp;
              <CodeMirror id="api_test_xml-pretty" value={JSON.stringify(this.rest_client_store.auth_code_test_response, null, 2)} options={testCodeOptions} />
              <FormGroup>
              <div key="customAuthScriptForm">
                {scriptForm}
              </div>
            </FormGroup>
            <OverlayTrigger placement="top" overlay={update_code_modal_tooltip}>
            <Button
              className="pull-right"
              bsSize="xsmall"
              bsStyle="info"
              style={{marginTop: -5 + '%'}}
              disabled={this.state.authCodeTestResponseFlag}
              onClick={this.updateAuthCodeIntoStore.bind(this)}
              >
              <i className="fa fa-refresh"></i>
            </Button>
          </OverlayTrigger>
            </Thumbnail>
          </Col>
        </Row>
      </div>
    );
  }
}

AuthorizationCodeGrantForm.propTypes = {
  store: React.PropTypes.object
};

export default AuthorizationCodeGrantForm;
