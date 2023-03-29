/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Panel } from 'react-bootstrap';
import CustomAuthForm from './custom_auth_form';

@observer
class TabPaneCustomAuth extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.state = {
      hideCustomAuthForm: true,
      hideExistingTokens: false
    };
  }

  componentWillMount() {
  }
  componentWillReceiveProps() {

  }
  toggleCustomAuthForm() {
    this.setState({ hideCustomAuthForm: !this.state.hideCustomAuthForm, hideExistingTokens: !this.state.hideExistingTokens });
  }


  render() {
    return (
      <span>
        <Panel collapsible expanded={this.state.hideCustomAuthForm} className="navtab">
          <CustomAuthForm key="customAuthForm" sourceType={this.props.sourceType} rest_client_store={this.rest_client_store} toggleCustomAuthForm={this.toggleCustomAuthForm.bind(this)} />
        </Panel>
      </span>
    )
  }
}

TabPaneCustomAuth.propTypes = {
  store: React.PropTypes.object
};

export default TabPaneCustomAuth;
