/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Col, Row, ControlLabel } from 'react-bootstrap'
import ParamKeyValues from './param_key_value_handler';

@observer
class TabPaneHeaders extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
  }

  componentWillMount() {
  }

    onChange(){

    }
  render() {

    return(
      <div>
      <Row >
        <Col  xs={12}  xsOffset ={2}>
          <Col sm={4}>
            <ControlLabel>Key</ControlLabel>
          </Col>
          <Col sm={4}>
            <ControlLabel>Value</ControlLabel>
          </Col>
        </Col>
      </Row>
      <ParamKeyValues key={this.props.store_key} rest_client_store={this.rest_client_store} attr_keyword={this.props.store_key} sourceType={this.props.sourceType}/>
    </div>

    )
  }
}

TabPaneHeaders.propTypes = {
  store: React.PropTypes.object
};

export default TabPaneHeaders;
