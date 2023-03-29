/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';

class CustomLoader extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div className="loaders loaders-div-overlay">
          <div className="loader">
            <div className="loader-inner ball-spin-fade-loader loader-div">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>
    );
  }
}

CustomLoader.propTypes = {
  store: React.PropTypes.object
};

export default CustomLoader;
