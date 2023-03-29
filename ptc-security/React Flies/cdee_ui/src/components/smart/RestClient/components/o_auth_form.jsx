/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { ButtonToolbar, Thumbnail,Row,Col,ControlLabel,FormGroup,FormControl,Button,DropdownButton,MenuItem,Radio } from 'react-bootstrap'
import AuthorizationCodeGrantForm from './authorization_code_grant_form';

@observer
class OAuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.state = {
      'hideUserCredentialsDiv': (this.rest_client_store[this.props.sourceType+'oauth_details']['grant_type'] === 'password')? false : true,
      'hideAuthCodeDiv':(this.rest_client_store[this.props.sourceType+'oauth_details']['grant_type'] === 'authorization_code')? false : true
    }
  }

  componentWillReceiveProps() {
    this.setState({'hideAuthCodeDiv': (this.rest_client_store[this.props.sourceType+'oauth_details']['grant_type'] === 'authorization_code')? false : true})
  }

  addParam(){

  }

  selectItem(event){
    var temp = this.rest_client_store[this.props.sourceType+'oauth_details'];
    temp['grant_type'] = event;
    this.rest_client_store.setvalue(this.props.sourceType+'oauth_details', temp);
    this.setState({'hideUserCredentialsDiv': (this.rest_client_store[this.props.sourceType+'oauth_details']['grant_type'] === 'password')? false : true})
    this.setState({'hideAuthCodeDiv': (this.rest_client_store[this.props.sourceType+'oauth_details']['grant_type'] === 'authorization_code')? false : true})
  }

  onChange(event){
    //This method is added for the enabled for Request Token  key button
    //this.setState({ value: event.target.value });
    var temp = this.rest_client_store[this.props.sourceType+'oauth_details'];
    temp[event.target.name] = event.target.value;
    this.rest_client_store.setvalue(this.props.sourceType+'oauth_details', temp);
  }

  testOauthToken() {
   this.rest_client_store.TestOAuthToken(this.props.sourceType);
  }


render() {
  var grant_types_list = this.rest_client_store.grant_types_list.map(m => {
        return(
          <MenuItem key={m} eventKey={m} active={(this.rest_client_store[this.props.sourceType+'oauth_details']['grant_type'] === m)? true : false }>{m}</MenuItem>
        )
  });

  var auth_code_type = ['Static','Dynamic'].map(m => {
    return(
      <Radio key={m} name='auth_code_type' value={m} inline checked={(this.rest_client_store[this.props.sourceType+'oauth_details']['auth_code_type'] === m)? true : false } onChange={this.onChange.bind(this)}>{m}</Radio>
    )
  });

  var mandatory_field_style = {color: 'red', fontWeight: 'bold', fontSize: 'medium'}

    return (
        <div>
          <Row>
            <Col xs={8} xsOffset={2}>
              <div className="accesstoken-header">GET NEW ACCESS TOKEN</div>
              <Thumbnail>
                <FormGroup className = "navtab">
                  <Col sm={12}>
                    <ControlLabel className="col-sm-5">Token Name</ControlLabel>
                  </Col>
                  <Col xsOffset={4} xs={8}>

                    <FormControl type="text" className="tabtext" placeholder="Token Name" name="token_name" value={this.rest_client_store[this.props.sourceType+'oauth_details']['token_name']} onChange={this.onChange.bind(this)}/>
                  </Col>
                </FormGroup>
                &nbsp;
                <FormGroup>
                  <Col sm={12}>
                    <ControlLabel className="col-sm-5">Auth URL <span style={mandatory_field_style}>*</span></ControlLabel>
                  </Col>
                  <Col xsOffset={4} sm={8}>
                    <FormControl type="text" className="tabtext" placeholder="Auth URL" name="auth_url" value={this.rest_client_store[this.props.sourceType+'oauth_details']['auth_url']} onChange={this.onChange.bind(this)}/>
                  </Col>
                </FormGroup>
                &nbsp;
                <FormGroup >
                  <Col sm={12}>
                    <ControlLabel className="col-sm-5">Access Token URL <span style={mandatory_field_style}>*</span></ControlLabel>
                  </Col>
                  <Col xsOffset={4} sm={8}>
                    <FormControl type="text" className="tabtext" placeholder="Access Token URL" name="access_token_url" value={this.rest_client_store[this.props.sourceType+'oauth_details']['access_token_url']} onChange={this.onChange.bind(this)}/>
                  </Col>
                </FormGroup>
                &nbsp;
                <FormGroup >
                  <Col sm={12}>
                    <ControlLabel className="col-sm-5">Client ID <span style={mandatory_field_style}>*</span></ControlLabel>
                  </Col>
                  <Col xsOffset={4} sm={8}>
                    <FormGroup>
                      <FormControl type="text" className="tabtext" placeholder="Client ID" name="client_id" value={this.rest_client_store[this.props.sourceType+'oauth_details']['client_id']} onChange={this.onChange.bind(this)}/>
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup >
                  <Col sm={12}>
                    <ControlLabel className="col-sm-5">Client Secret</ControlLabel>
                  </Col>
                  <Col xsOffset={4} sm={8}>
                    <FormGroup>
                      <FormControl type="text" className="tabtext" placeholder="Client Secret" name="client_secret" value={this.rest_client_store[this.props.sourceType+'oauth_details']['client_secret']} onChange={this.onChange.bind(this)}/>
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup >
                  <Col sm={12}>
                    <ControlLabel className="col-sm-5">Scope</ControlLabel>
                  </Col>
                  <Col xsOffset={4} sm={8}>
                    <FormGroup>

                      <FormControl type="text" className="tabtext" placeholder="Scope" name="scope" value={this.rest_client_store[this.props.sourceType+'oauth_details']['scope']} onChange={this.onChange.bind(this)}/>
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup >
                  <Col sm={4}>
                    <ControlLabel className="col-sm-9">Grant Type <span style={mandatory_field_style}>*</span></ControlLabel>
                  </Col>
                  <Col xs={1}>
                    <ButtonToolbar>
                      <DropdownButton  id='dropdown-granttype' bsStyle={'Default'.toLowerCase()} title={this.rest_client_store[this.props.sourceType+'oauth_details']['grant_type']} name="grant_type" value={this.rest_client_store[this.props.sourceType+'oauth_details']['grant_type']} onSelect={this.selectItem.bind(this)}>
                          {grant_types_list}
                      </DropdownButton>
                    </ButtonToolbar>
                  </Col>
                </FormGroup>
                &nbsp;
                <div hidden={!this.state.hideAuthCodeDiv}>
                  <FormGroup >
                    <Col sm={12}>
                      <ControlLabel className="col-sm-5 formtab">UserName <span style={mandatory_field_style}>*</span></ControlLabel>
                    </Col>
                    <Col xsOffset={4} sm={8}>
                      <FormControl type="text" className="tabtext" placeholder="User Name" name="username" value={this.rest_client_store[this.props.sourceType+'oauth_details']['username']} onChange={this.onChange.bind(this)}/>
                    </Col>
                  </FormGroup>
                  <FormGroup >
                    <Col sm={12}>
                      <ControlLabel className="col-sm-5 formtab">Password <span style={mandatory_field_style}>*</span></ControlLabel>
                    </Col>
                    <Col xsOffset={4} sm={8}>
                      <FormControl type="text" className="tabtext" placeholder="Password" name="password"  value={this.rest_client_store[this.props.sourceType+'oauth_details']['password']} onChange={this.onChange.bind(this)}/>
                    </Col>
                  </FormGroup>
                </div>

                <div hidden={this.state.hideAuthCodeDiv}>
                  <FormGroup >
                  <Col sm={10}>
                      <ControlLabel className="col-sm-5 formtab">Authorization Code Type</ControlLabel>
                      <Col style={{marginTop:'13px',marginLeft:'10px'}}>
                      {auth_code_type}
                      </Col>
                    </Col>
                    <Col sm={12} hidden={(this.rest_client_store[this.props.sourceType+'oauth_details']['auth_code_type'] === 'Static')? true : false}>
                      <AuthorizationCodeGrantForm key="AuthCodeForm" sourceType={this.props.sourceType} rest_client_store={this.rest_client_store}/>
                    </Col>
                      <Col sm={12}>
                        <ControlLabel className="col-sm-5 formtab">Authorization Code <span style={mandatory_field_style}>*</span></ControlLabel>
                      </Col>
                      <Col xsOffset={4} sm={8}>
                        <FormControl type="text" className="tabtext" placeholder="Authorization Code" name="code" value={this.rest_client_store[this.props.sourceType+'oauth_details']['code']} onChange={this.onChange.bind(this)}/>
                      </Col>
                  </FormGroup>
                </div>

                &nbsp;
                <FormGroup>
                  <p className="pull-right">
                    <Button  className="" onClick={this.props.toggleAuthForm}>Cancel</Button>
                    <Button bsStyle="warning" disabled={this.rest_client_store[this.props.sourceType+'oauth_details']['auth_url'] === '' || this.rest_client_store[this.props.sourceType+'oauth_details']['access_token_url'] === '' || this.rest_client_store[this.props.sourceType+'oauth_details']['client_id'] === '' || (this.rest_client_store[this.props.sourceType+'oauth_details']['grant_type']==='password' && (this.rest_client_store[this.props.sourceType+'oauth_details']['username'] === '' || this.rest_client_store[this.props.sourceType+'oauth_details']['password'] === '')) || (this.rest_client_store[this.props.sourceType+'oauth_details']['grant_type']==='authorization_code' && this.rest_client_store[this.props.sourceType+'oauth_details']['auth_code_type'] === 'Static' && this.rest_client_store[this.props.sourceType+'oauth_details']['code'] === '')}  className ="req-btn-position" onClick={this.testOauthToken.bind(this)}>Request Token</Button>
                  </p>
                </FormGroup>
                &nbsp;
                &nbsp;
              </Thumbnail>
            </Col>
          </Row>
        </div>
    );
}
}

OAuthForm.propTypes = {
    store: React.PropTypes.object
};

export default OAuthForm;
