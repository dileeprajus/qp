/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { Thumbnail, Col, Button } from 'react-bootstrap';
import React, { Component } from 'react';

class GridInstance extends Component {
  render() {
    return (
      <Col xs={6} md={6}>
        <Thumbnail src="/assets/thumbnaildiv.png" alt="242x200">
          <h3>Thumbnail label</h3>
          <p>Description</p>
          <p>
            <Button bsStyle="primary"> View Existing </Button>&nbsp;
            <Button bsStyle="success">+ Create</Button>
          </p>
        </Thumbnail>
      </Col>
    );
  }
}

export default GridInstance;
