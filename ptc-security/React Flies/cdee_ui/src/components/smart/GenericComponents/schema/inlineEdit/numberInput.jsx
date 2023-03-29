/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {inject, observer} from 'mobx-react';
import { RIENumber} from 'riek';
import _ from 'lodash';

@inject('breadcrumb_store')
@observer
class InlineNumberInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <span>
        <RIENumber
          value={(String(this.props.snode[this.props.element_name]) === undefined || String(this.props.snode[this.props.element_name]) == 'undefined') ?  'Click here to type.' : String(this.props.snode[this.props.element_name])}
          change={this.props.updateNodeName.bind(this)}
          propName={this.props.element_name}
          validate={_.isString}
          classInvalid="invalid"
        />
      </span>
    );
  }
}

InlineNumberInput.propTypes = {
  store: React.PropTypes.object
};

export default InlineNumberInput;
