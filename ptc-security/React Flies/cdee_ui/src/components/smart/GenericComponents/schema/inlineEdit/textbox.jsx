/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {inject, observer} from 'mobx-react';
import { RIEInput} from 'riek';
import _ from 'lodash';

@inject('breadcrumb_store')
@observer
class InlineTextBox extends React.Component {
  constructor(props) {
    super(props);
      
  }


  updateNodeName(newstate){
    for (var k in newstate){
      this.props.snode[k] = newstate[k];
    }
    this.props.master.updateTreeData(this.props.master.state.treeData);
  }


  render() {

    return (
      <span>
        <RIEInput
          value={this.props.snode[this.props.element_name] || 'Please enter text here'}
          change={this.updateNodeName.bind(this)}
          propName={this.props.element_name}
          validate={_.isString}
        />
      </span>
    );
  }
}

InlineTextBox.propTypes = {
  store: React.PropTypes.object
};

export default InlineTextBox;
