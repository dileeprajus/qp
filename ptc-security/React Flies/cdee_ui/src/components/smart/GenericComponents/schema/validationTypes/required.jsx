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
import { inject, observer } from 'mobx-react';
import { HelpBlock, FormGroup} from 'react-bootstrap';
import { RIESelect } from 'riek';

@inject('breadcrumb_store')
@observer
class Required extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        validationState: null,
        validationMessage: 'Please Select true or False',
        valid: true,
        requiredOptions: [
            { id: 'select', text: 'Select' },
          { id: 'true', text: 'true' },
          { id: 'false', text: 'false' }

        ]
      }
  }


  updateNodeName(newState) {
    let validate = this.validateAttr(newState);
    if(validate){
      this.props.snode['required'] = JSON.parse(newState[this.props.element_name].id);
      this.props.master.updateTreeData(this.props.master.state.treeData);
    }else if(newState.required.id==='select' && !validate){
       delete this.props.snode['required'] ;
        this.props.master.updateTreeData(this.props.master.state.treeData);
    }
  }


  // Write Validation Rules here
  validateAttr(newState) {
    let returnVal = false;
    let input = newState[this.props.element_name].id;
    if (input === 'true' || input === 'false') {
        this.setState({
          validationState: 'success',
          validationMessage: (JSON.parse(input) ? 'Now this attribute is mandatory' : 'Now this attribute is Optional.'),
          valid: true
        });
        returnVal = true;
    }else if(input==='select'){
        this.setState({
            validationState: null,
            validationMessage: 'Please Select true or False.',
            valid: false
        });
        returnVal = false;
    } else {
      this.setState({
        validationState: 'error',
        validationMessage: 'Please select Either True or False.',
        valid: false
      });
      returnVal = false;
    }
    return returnVal;
  }

  render() {
    const optionsList = this.state.requiredOptions || [];

    let validationRules = <FormGroup controlId="formValidationSuccess1" validationState={this.state.validationState}>
          <HelpBlock>{this.state.validationMessage}</HelpBlock>
        </FormGroup>
    return (
      <span>
        <RIESelect
          value={{
            id: JSON.stringify(this.props.snode[this.props.element_name]) || '',
            text: JSON.stringify(this.props.snode[this.props.element_name]) || 'Select your option'
          }}
          className={'editable'}
          options={optionsList}
          change={this.updateNodeName.bind(this)}
          classLoading="loading"
          propName={this.props.element_name}
          isDisabled={false}
        />
        {validationRules}
      </span>
    );
  }
}

Required.propTypes = {
  store: React.PropTypes.object
};

export default Required;
