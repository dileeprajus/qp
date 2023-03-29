/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Row, Thumbnail, Col } from 'react-bootstrap';
import CustomLoader from './CustomLoader';
import { observer } from 'mobx-react';

@observer
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCustomLoader: false
    };
  }

  componenWillMount() {
    this.setState({ showCustomLoader: false });
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6} >
            <Thumbnail>
              Client Dashboard
            </Thumbnail>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} >
            <Thumbnail>
              Admin Page
            </Thumbnail>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={12} md={6} lg={6} >
            <Thumbnail>
              Admin Settings
            </Thumbnail>
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} >
            <Thumbnail>
              ...
            </Thumbnail>
          </Col>
        </Row>
          {this.state.showCustomLoader && <CustomLoader />}
          {this.props.children}
      </div>
    );
  }

}

Home.propTypes = {
  store: React.PropTypes.object
};

export default Home;
