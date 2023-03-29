/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
// 6.26. allOf

// This keyword's value MUST be a non-empty array. Each item of the array MUST be a valid JSON Schema.

// An instance validates successfully against this keyword if it validates successfully against all schemas defined by this keyword's value.

// HERE GOES THE CODE
// 6.26. allOf
import React from 'react';
import {inject, observer} from 'mobx-react';
import {HelpBlock, FormGroup} from 'react-bootstrap';
import { RIEInput } from 'riek';


@inject('breadcrumb_store')
@observer
class AllOf extends React.Component {
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

AllOf.propTypes = {
  store: React.PropTypes.object
};

export default AllOf;
