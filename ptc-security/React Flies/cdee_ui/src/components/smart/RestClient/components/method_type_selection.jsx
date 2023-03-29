/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'

@observer
class MethodTypeSelection extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
  }

  componentWillMount() {
  }

  selectItem(event){
    this.rest_client_store.setvalue(this.props.attr_name, event);
  }


  render() {
      var option_list = this.rest_client_store.rest_method_list.map(m => {
        return(
          <MenuItem key={m} eventKey={m} active={(this.rest_client_store[this.props.attr_name] === m)? true : false }>{m}</MenuItem>
        )
      });
    return(
        <span>
        <ButtonToolbar>
          <DropdownButton bsStyle={'Default'.toLowerCase()} title={this.rest_client_store[this.props.attr_name]} name={this.props.attr_name} value={this.rest_client_store[this.props.attr_name]} onSelect={this.selectItem.bind(this)} id='method_type_dropdown-basic'>
            {option_list}
          </DropdownButton>
        </ButtonToolbar>
        </span>
    )
  }
}

MethodTypeSelection.propTypes = {
  store: React.PropTypes.object
};

export default MethodTypeSelection;
