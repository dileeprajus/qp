/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {inject, observer} from 'mobx-react';
import { RIESelect } from 'riek';

@inject('breadcrumb_store')
@observer
class InlineOptionSelect extends React.Component {
  constructor(props) {
    super(props);
  }


  updateNodeName(newstate){
    for (var k in newstate){
      this.props.snode[k] = newstate[k].id;
    }
    this.props.master.updateTreeData(this.props.master.state.treeData);
  }


  render() {
    const optionsList = this.props.optionsList || [];
    var child_callback = '';
    if(this.props.updateNodeName!==undefined){
      child_callback = this.props.updateNodeName.bind(this);
    }
    else{
      child_callback = this.updateNodeName.bind(this);
    }
    return (
      <span>
        <RIESelect
          value={{ id: this.props.snode[this.props.element_name] || '',
            text: this.props.snode[this.props.element_name] || 'Select your option'
          }}
          className={'editable'}
          options={optionsList}
          change={child_callback}
          classLoading="loading"
          propName={this.props.element_name}
          isDisabled={false}
        />
      </span>
    );
  }
}

InlineOptionSelect.propTypes = {
  store: React.PropTypes.object
};

export default InlineOptionSelect;
