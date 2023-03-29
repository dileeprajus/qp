/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';

@inject('routing', 'breadcrumb_store')
@observer
class GenericStatusMessage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        {this.props.children}
        <div className="genericStatusMsg">
          <p>{this.props.statusMsg}</p>
        </div>
      </div>
    );
  }
}

GenericStatusMessage.propTypes = {
  store: React.PropTypes.object
};

export default GenericStatusMessage;
