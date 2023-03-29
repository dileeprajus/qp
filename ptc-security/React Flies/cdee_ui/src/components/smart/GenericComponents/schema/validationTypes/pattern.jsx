/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
// 6.8. pattern

// The value of this keyword MUST be a string. This string SHOULD be a valid regular expression, according to the ECMA 262 regular expression dialect.

// A string instance is considered valid if the regular expression matches the instance successfully. Recall: regular expressions are not implicitly anchored.

// HERE GOES THE CODE
// 6.8. pattern
import React from 'react';
import {inject, observer} from 'mobx-react';
import {HelpBlock, FormGroup} from 'react-bootstrap';
import { RIEInput} from 'riek';


@inject('breadcrumb_store')
@observer
class Pattern extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        validationState: null,
        validationMessage: 'Please enter value',
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

  // Write Validation Rules here
  validateAttr(newState) {
    let returnVal = false;
    let input = newState[this.props.element_name];
      var letters = /^[a-zA-Z]+$/;
      var num = /^[0-9]+$/;
     if(input !== ''){
     if (input.match(letters)) {
      this.setState({
        validationState: 'success',
        validationMessage: 'Input is valid.',
        valid: true
      });
      newState[this.props.element_name] = input;
      returnVal = true;
    } else if(input.match(num)){
      this.setState({
        validationState: 'success',
        validationMessage: 'Input is valid.',
        valid: true
      });
      newState[this.props.element_name] = Number(input);
      returnVal = true;
    }else {
         this.setState({
             validationState: 'error',
             validationMessage: 'Please enter valid value',
             valid: false
         });
         returnVal = false;

     }
    }else {
        this.setState({
            validationState: null,
            validationMessage: 'Please enter valid value',
            valid: true
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

Pattern.propTypes = {
  store: React.PropTypes.object
};

export default Pattern;
