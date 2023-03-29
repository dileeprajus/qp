/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
// 6.21. dependencies

// This keyword specifies rules that are evaluated if the instance is an object and contains a certain property.

// This keyword's value MUST be an object. Each property specifies a dependency. Each dependency value MUST be an array or a valid JSON Schema.

// If the dependency value is a subschema, and the dependency key is a property in the instance, the entire instance must validate against the dependency value.

// If the dependency value is an array, each element in the array, if any, MUST be a string, and MUST be unique. If the dependency key is a property in the instance, each of the items in the dependency value must be a property that exists in the instance.

// Omitting this keyword has the same behavior as an empty object.

// HERE GOES THE CODE
// 6.21. dependencies
import React from 'react';
import {inject, observer} from 'mobx-react';
import {HelpBlock, FormGroup} from 'react-bootstrap';
import { RIEInput } from 'riek';


@inject('breadcrumb_store')
@observer
class Dependencies extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        validationState: null,
        validationMessage: 'Please enter Only Number > 0',
        valid: true
      }
  }


  updateNodeName(newState) {
    let validate = this.validateAttr(newState);
    if(validate){
      for (var k in newState){
        this.props.snode[k] = newState[k];
      }
      this.props.master.updateTreeData(this.props.master.state.treeData);
    }
  }

  // Write Validation Rules here
  validateAttr(newState) {
    let returnVal = false;
    let input = newState[this.props.element_name];
    if ((!isNaN(Number(input)))) {
      if (Number(input) > 0) {
        this.setState({
          validationState: 'success',
          validationMessage: 'Input is valid.',
          valid: true
        });
        returnVal = true;
      } else {
        this.setState({
          validationState: 'error',
          validationMessage: 'Please enter a number greater than 0.',
          valid: false
        });
        returnVal = false;
      }
    } else {
      this.setState({
        validationState: 'error',
        validationMessage: 'Please enter a valid Number.',
        valid: false
      });
      returnVal = false;
    }
    return returnVal;
  }

  render() {
    let validationRules = <FormGroup controlId="formValidationSuccess1" validationState={this.state.validationState}>
          <HelpBlock>{this.state.validationMessage}</HelpBlock>
        </FormGroup>
    return (
      <span>
        <RIEInput
          value={this.props.snode[this.props.element_name] || 'Click here to type.'}
          change={this.updateNodeName.bind(this)}
          propName={this.props.element_name}
          classInvalid="invalid"
        />
        {validationRules}
      </span>
    );
  }
}

Dependencies.PropTypes = {
  store: React.PropTypes.object
};

export default Dependencies;
