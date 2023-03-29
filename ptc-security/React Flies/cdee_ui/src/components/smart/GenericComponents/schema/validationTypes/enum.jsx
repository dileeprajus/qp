/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
// 6.23. enum

// The value of this keyword MUST be an array. This array SHOULD have at least one element. Elements in the array SHOULD be unique.

// An instance validates successfully against this keyword if its value is equal to one of the elements in this keyword's array value.

// Elements in the array might be of any value, including null.

// HERE GOES THE CODE
// 6.23. enum
import React from 'react';
import {inject, observer} from 'mobx-react';
import {HelpBlock, FormGroup} from 'react-bootstrap';
import { RIEInput} from 'riek';

@inject('breadcrumb_store')
@observer
class Enum extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        validationState: null,
        validationMessage: 'Please enter valid values',
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
    try{
    let input = newState[this.props.element_name];
        var values_array = JSON.parse('[' + input + ']');
      if (values_array.length > 0) {
        var duplicates = false;
        var sorted_arr = values_array.slice().sort();
        for (var i = 0; i < values_array.length - 1; i++) {
          if (sorted_arr[i + 1] == sorted_arr[i]) {
            duplicates = true;
          }
        }
        if(duplicates===true){
          this.setState({
            validationState: 'error',
            validationMessage: 'Please enter uniq values in array',
            valid: false
          });
          returnVal = false;
        }
        else{
          this.setState({
            validationState: 'success',
            validationMessage: 'Input is valid.',
            valid: true
          });
        newState[this.props.element_name] = values_array;
        returnVal = true;
      }
      } else {
        this.setState({
          validationState: null,
          validationMessage: 'Please enter valid values',
          valid: false
        });
        returnVal = false;
      }
  }
    catch(error){
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
    let validationRules = <FormGroup controlId="formValidationSuccess1" validationState={this.state.validationState}>
          <HelpBlock>{this.state.validationMessage}</HelpBlock>
        </FormGroup>
    var value = JSON.stringify(this.props.snode[this.props.element_name]);
    if(value!==undefined){
      value = value.substring(1, value.length-1)
    }
    return (
      <span>
        <RIEInput
          value={ value || 'Click here to type.'}
          change={this.updateNodeName.bind(this)}
          propName={this.props.element_name}
          classInvalid="invalid"
        />
        {validationRules}
      </span>
    );
  }
}

Enum.propTypes = {
  store: React.PropTypes.object
};

export default Enum;
