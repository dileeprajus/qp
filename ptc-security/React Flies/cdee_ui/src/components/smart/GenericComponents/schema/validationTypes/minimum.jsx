/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {inject, observer} from 'mobx-react';
import {HelpBlock, FormGroup} from 'react-bootstrap';
import InlineNumberInput from '../inlineEdit/numberInput';

// http://json-schema.org/latest/json-schema-validation.html#rfc.section.6.4
// 6.4. minimum

// The value of "minimum" MUST be a number, representing an inclusive upper limit for a numeric instance.

// If the instance is a number, then this keyword validates only if the instance is greater than or exactly equal to "minimum".

@inject('breadcrumb_store')
@observer
class Minimum extends React.Component {
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
            if(input.length === 0) {
                this.setState({
                    validationState: null,
                    validationMessage: 'Please enter Only Number > 0',
                    valid: true
                });
            }else {
                this.setState({
                    validationState: 'error',
                    validationMessage: 'Please enter a number greater than 0.',
                    valid: false
                });
            }
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

Minimum.propTypes = {
  store: React.PropTypes.object
};

export default Minimum;
