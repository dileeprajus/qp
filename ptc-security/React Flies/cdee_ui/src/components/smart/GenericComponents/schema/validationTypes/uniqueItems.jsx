/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
// 6.13. uniqueItems

// The value of this keyword MUST be a boolean.

// If this keyword has boolean value false, the instance validates successfully. If it has boolean value true, the instance validates successfully if all of its elements are unique.

// Omitting this keyword has the same behavior as a value of false.

// HERE GOES THE CODE
// 6.13. uniqueItems
import React from 'react';
import {inject, observer} from 'mobx-react';
import {HelpBlock, FormGroup} from 'react-bootstrap';
import InlineOptionSelect from '../inlineEdit/optionSelect';

@inject('breadcrumb_store')
@observer
class UniqueItems extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        validationState: null,
        validationMessage: 'Please select your option.',
        valid: true
      }
  }


  updateNodeName(newState) {
    let validate = true;
    if(validate){
      for (var k in newState){
        this.props.snode[k] = newState[k].id;
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
    var  optionsList = [
      { id: 'False', text: 'False' },
      { id: 'True', text: 'True' }
    ]
    let validationRules = <FormGroup controlId="formValidationSuccess1" validationState={this.state.validationState}>
          <HelpBlock>{this.state.validationMessage}</HelpBlock>
        </FormGroup>
    return (
      <span>
        <InlineOptionSelect snode={this.props.snode} optionsList={optionsList} element_name={this.props.element_name} updateNodeName={this.updateNodeName.bind(this)}/>
        {validationRules}
      </span>
    );
  }
}

UniqueItems.PropTypes = {
  store: React.PropTypes.object
};

export default UniqueItems;
