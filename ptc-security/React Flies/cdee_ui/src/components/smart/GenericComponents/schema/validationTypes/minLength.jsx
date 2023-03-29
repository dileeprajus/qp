/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
// 6.7. minLength

// The value of this keyword MUST be a non-negative integer.

// A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword.

// The length of a string instance is defined as the number of its characters as defined by RFC 7159 [RFC7159].

// Omitting this keyword has the same behavior as a value of 0.

// HERE GOES THE CODE
// 6.7. minLength
import React from 'react';
import {inject, observer} from 'mobx-react';
import {HelpBlock, FormGroup} from 'react-bootstrap';
import InlineNumberInput from '../inlineEdit/numberInput';


@inject('breadcrumb_store')
@observer
class MinLength extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        validationState: null,
        validationMessage: 'Please enter a valid Number.',
        valid: true
      }
  }


  updateNodeName(newState) {
    let validate = this.validateAttr(newState);
    if(validate){
      for (var k in newState){
        this.props.snode[k] = newState[k];
      }
    }else {
        for (var k in newState){
            this.props.snode[k] = '';
            for(var i in this.props.snode) {
                if(i===k) {
                    delete this.props.snode[i];
                }
            }
        }
    }
    this.props.master.updateTreeData(this.props.master.state.treeData);
  }

  isInt(n){
    return Number(n) % 1 === 0;
  }

  // Write Validation Rules here
  validateAttr(newState) {
    let returnVal = false;
    let input = newState[this.props.element_name];
    if ((!isNaN(Number(input)))) {
      if (Number(input) >=0) {
        if(input !== '') {
            if (this.isInt(input)) {
                this.setState({
                    validationState: 'success',
                    validationMessage: 'Input is valid.',
                    valid: true
                });
                newState[this.props.element_name] = Number(input);
                returnVal = true;
            }
            else {
                this.setState({
                    validationState: 'error',
                    validationMessage: 'Please enter a integer only',
                    valid: false
                });
                returnVal = false;
            }
        }else {
            this.setState({
                validationState: null,
                validationMessage: 'Please enter a valid Number.',
                valid: true
            });
            returnVal = false;
        }
      }else{
            this.setState({
                validationState: 'error',
                validationMessage: 'Please enter non negative integer.',
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
        <InlineNumberInput snode={this.props.snode} element_name={this.props.element_name} updateNodeName={this.updateNodeName.bind(this)}/>
        {validationRules}
      </span>
    );
  }
}

MinLength.propTypes = {
  store: React.PropTypes.object
};

export default MinLength;
