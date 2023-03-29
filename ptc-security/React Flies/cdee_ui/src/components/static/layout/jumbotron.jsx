/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { Jumbotron, Button } from 'react-bootstrap';
import React, { Component } from 'react';

class JumbotronInstance extends Component {
  render() {
    return (
      <Jumbotron>
        <h1>Flex Mapper</h1>
        <p>Setup or create FlexPLM Mapper</p>
        <p>
          <Button
            bsStyle="primary"
          > + Create New</Button> <Button bsStyle="warning">Select Already configured</Button></p>
      </Jumbotron>
    );
  }
}

export default JumbotronInstance;
