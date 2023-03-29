/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import React from 'react';
import { inject, observer } from 'mobx-react';
import CustomLoader from './CustomLoader';

@inject('routing', 'breadcrumb_store')
@observer
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    if (ieGlobalVariable.serverAppKey === '') {
      this.props.history.push('/');
    }
  }
  render() {
    return (
      <div className={(ieGlobalVariable.serverAppKey === '') ? 'loginPage': ''}>
        {this.props.children}
        <div hidden={(ieGlobalVariable.loaderStore.showLoader.length>0)?false:true} className="custom-loader-position">
          <CustomLoader />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  store: React.PropTypes.object
};

export default App;
