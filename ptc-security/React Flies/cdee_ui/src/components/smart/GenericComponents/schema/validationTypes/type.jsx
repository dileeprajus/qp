/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
// 6.17. required

// The value of this keyword MUST be an array. Elements of this array, if any, MUST be strings, and MUST be unique.

// An object instance is valid against this keyword if every item in the array is the name of a property in the instance.

// Omitting this keyword has the same behavior as an empty array.

// HERE GOES THE CODE
// 6.17. required
import React from 'react';
import {inject, observer} from 'mobx-react';
import {HelpBlock, FormGroup} from 'react-bootstrap';
import InlineOptionSelect from '../inlineEdit/optionSelect';

@inject('breadcrumb_store')
@observer
class Type extends React.Component {
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
    try{
      let input = newState[this.props.element_name]; // eslint-disable-line no-unused-vars
    }catch(error){
      this.setState({
        validationState: 'error',
        validationMessage: error.message,
        valid: false
      });
      returnVal = false;
    }
    return returnVal;
  }

  render() {
    var  optionsList = [
      { id: 'null', text: 'null' },
      { id: 'boolean', text: 'boolean' },
      { id: 'object', text: 'object' },
      { id: 'array', text: 'array' },
      { id: 'number', text: 'number' },
      { id: 'string', text: 'string' }
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

Type.propTypes = {
  store: React.PropTypes.object
};

export default Type;
