/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { ButtonToolbar, Button,Panel,Col} from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import OAuthForm from './o_auth_form'

@observer
class TabPaneOAuth extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.state = {
      'hideOAuthForm': false,
      'hideExistingTokens':false
    }
  }

  componentWillMount() {
  }

  toggleAuthForm(){
    this.setState({'hideOAuthForm': !this.state.hideOAuthForm,'hideExistingTokens': !this.state.hideExistingTokens})
  }

  render() {
    const codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    return(
      <span>
        <Col xs={7} xsOffset={2} sm={8} md={8} lg={8}>
          <Panel header="Existing Tokens" bsStyle={this.rest_client_store[this.props.sourceType+'oauth_data_panel_status']} >
           <CodeMirror id="token_data_json-pretty" value={JSON.stringify(this.rest_client_store[this.props.sourceType+'oauth_token_data'], null, 2)} options={codeOptions} />
          </Panel>
        </Col>
        <Col>
          <ButtonToolbar>
          <Button bsStyle="success" className="pull-right btn-token" onClick={this.toggleAuthForm.bind(this)}>Get New Access Token</Button>
        </ButtonToolbar>
        </Col>
         <Panel collapsible expanded={this.state.hideOAuthForm} className="navtab">
          <OAuthForm key="oauth_form" sourceType={this.props.sourceType} rest_client_store={this.rest_client_store} toggleAuthForm = {this.toggleAuthForm.bind(this)}/>
        </Panel>
      </span>
    )
  }
}

TabPaneOAuth.propTypes = {
  store: React.PropTypes.object
};

export default TabPaneOAuth;
