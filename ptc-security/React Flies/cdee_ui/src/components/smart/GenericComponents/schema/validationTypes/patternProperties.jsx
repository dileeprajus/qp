/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
// 6.19. patternProperties

// The value of "patternProperties" MUST be an object. Each property name of this object SHOULD be a valid regular expression, according to the ECMA 262 regular expression dialect. Each property value of this object MUST be a valid JSON Schema.

// This keyword determines how child instances validate for objects, and does not directly validate the immediate instance itself. Validation of the primitive instance type against this keyword always succeeds.

// Validation succeeds if, for each instance name that matches any regular expressions that appear as a property name in this keyword's value, the child instance for that name successfully validates against each schema that corresponds to a matching regular expression.

// Omitting this keyword has the same behavior as an empty object.

// HERE GOES THE CODE
// 6.19. patternProperties
import React from 'react';
import {inject, observer} from 'mobx-react';
import {HelpBlock, FormGroup} from 'react-bootstrap';
import { RIEInput} from 'riek';


@inject('breadcrumb_store')
@observer
class PatternProperties extends React.Component {
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
    }else{
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
    if ((!isNaN(Number(input)))) {
      if (Number(input) > 0  && input!=='') {
        this.setState({
          validationState: 'success',
          validationMessage: 'Input is valid.',
          valid: true
        });
        returnVal = true;
      } else if(input===''){
          this.setState({
              validationState: null,
              validationMessage: 'Please enter Only Number > 0',
              valid: true
          });
          returnVal = false;
      }  else {
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

PatternProperties.PropTypes = {
  store: React.PropTypes.object
};

export default PatternProperties;
