/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {observer} from 'mobx-react';
import {FormGroup} from 'react-bootstrap';
import ParamKeyValues from './param_key_value_handler';

@observer
class TabPanePayloadformurlencoded extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
  }

  componentWillMount() {
  }

  ShowformurlencodedInput() {
    return this.rest_client_store.current_payload_option !== 'x-www-form-urlencoded';
  }

    render() {

        return (
        <div>
          <FormGroup>
          <div hidden={this.ShowformurlencodedInput()}>
            <ParamKeyValues key="payload_form_url_encoded" rest_client_store={this.rest_client_store} attr_keyword="payload_form_url_encoded" />
           </div>
          </FormGroup>
        </div>
        )
    }
}

TabPanePayloadformurlencoded.propTypes = {
  store: React.PropTypes.object
};

export default TabPanePayloadformurlencoded;
