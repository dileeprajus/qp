/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import {FormGroup,FormControl,ControlLabel} from 'react-bootstrap'

@observer
class TabPaneSchemaFromFile extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
  }

  componentWillMount() {
  }

  onChange (event) {
    this.rest_client_store.setvalue(event.target.name, JSON.parse(event.target.value))
  }


    render() {

        return (
        <div>
          <FormGroup>
            &nbsp;
            <ControlLabel>Note: Assuming Schema will always be in JSON format.</ControlLabel>
            <FormControl rows="10" componentClass="textarea" name="schema_from_file_data"  value={JSON.stringify(this.rest_client_store.schema_from_file_data)} placeholder="File content goes here..." onChange={this.onChange.bind(this)} />
          </FormGroup>
        </div>
        )
    }
}

TabPaneSchemaFromFile.propTypes = {
  store: React.PropTypes.object
};

export default TabPaneSchemaFromFile;
