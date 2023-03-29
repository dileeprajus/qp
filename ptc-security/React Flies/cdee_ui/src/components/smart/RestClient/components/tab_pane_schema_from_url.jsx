/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import MasterRestComponent from './master_rest_component';

@observer
class TabPaneSchemaFromURL extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.state = {
      'hideQueryParams': true,
      'hideTestPanel': true
    }
  }

  componentWillMount() {
  }

  onChange (event) {
    this.rest_client_store.setvalue(event.target.name, event.target.value);
  }
  onTestClick(event) {
    this.rest_client_store.callTestApi('schema');
    this.setState({'hideTestPanel': false});
  }
  handleSubmit() {
    alert('Are you sure you want to update: ' + this.rest_client_store.name + ' Thing');
    this.rest_client_store.callSetPropValues('schema');
  }
  render() {
    return (
      <MasterRestComponent
        rest_client_store={this.rest_client_store} history={this.props.history} sourceType="schema_"
      />
    );
  }
}

TabPaneSchemaFromURL.propTypes = {
  store: React.PropTypes.object
};

export default TabPaneSchemaFromURL;
