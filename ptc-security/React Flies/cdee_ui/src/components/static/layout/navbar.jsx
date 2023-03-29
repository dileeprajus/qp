/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { Navbar } from 'react-bootstrap';
import React, { Component } from 'react';
import BreadcrumbInstance from './breadcrumb';
import { inject, observer } from 'mobx-react';

@inject('routing', 'breadcrumb_store')
@observer
class NavbarInstance extends Component {
  render() {
    return (
      <Navbar hidden={ieGlobalVariable.serverAppKey === ''} fluid={true} fixedTop={true}>
        <Navbar.Header>
          <Navbar.Brand>
            <BreadcrumbInstance history={this.props.history}
              routing={this.props.routing} breadcrumb_store={this.props.breadcrumb_store}
            />
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    );
  }
}

export default NavbarInstance;
