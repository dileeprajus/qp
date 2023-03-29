/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
// 6.24. const

// The value of this keyword MAY be of any type, including null.

// An instance validates successfully against this keyword if its value is equal to the value of the keyword.

// HERE GOES THE CODE
// 6.24. const
import React from 'react';
import {inject, observer} from 'mobx-react';
import {HelpBlock, FormGroup} from 'react-bootstrap';
import { RIEInput} from 'riek';


@inject('breadcrumb_store')
@observer
class Const extends React.Component {
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
    if(this.props.master.state.currentRowInfo.node.title.props.snode.type === 'string') {
        var letters = /^[0-9a-zA-Z]+$/;
        if(input !== ''){
            if (input.match(letters)) {
                this.setState({
                    validationState: 'success',
                    validationMessage: 'Input is valid.',
                    valid: true
                });
                newState[this.props.element_name] = input;
                returnVal = true;
            }
        }else {
            this.setState({
                validationState: null,
                validationMessage: 'Please enter valid value',
                valid: false
            });
            returnVal = false;
        }
       }else if(this.props.master.state.currentRowInfo.node.title.props.snode.type === 'number') {
        var num = /^[0-9]+$/;
        if(input !== ''){
            if(input.match(num)){
                this.setState({
                    validationState: 'success',
                    validationMessage: 'Input is valid.',
                    valid: true
                });
                newState[this.props.element_name] = Number(input);
                returnVal = true;
            }
        }else {
            this.setState({
                validationState: 'error',
                validationMessage: 'Please enter valid number.',
                valid: false
            });
            returnVal = false;
        }
       }else{
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
        }
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

Const.propTypes = {
  store: React.PropTypes.object
};

export default Const;
