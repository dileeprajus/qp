/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { footer } from 'react-bootstrap';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

@inject('routing')
@observer
class FooterInstance extends Component {
  render() {
    return (
      <footer className="navbar-fixed-bottom breadcrumb">
					<div className="container">
						<div className="row">
							<p>Don't miss my site: <a href="www.devbutze.com">DevButze</a> </p>
						</div>
					</div>
        </footer>
    );
  }
}

export default FooterInstance;
