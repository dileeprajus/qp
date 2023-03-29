/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Thumbnail, FormGroup, FormControl, ControlLabel, Row } from 'react-bootstrap';
import GenericStatusMessage from '../../GenericComponents/generic_status_component';

@inject('generic_master_store')
@observer
class VersionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
  }

  componentWillMount() {
    this.generic_master_store.getDBVerison();
  }
  render() {
    return (
      <div>
        <Row>
          <Col xs={12}>
            <Col key="fronEndDetailsDiv" sm={6} md={6} lg={6} xs={6}>
              <div className="accesstoken-header">Front End Details</div>
              <Thumbnail>
                <FormGroup className="navtab">
                  <ControlLabel>Front End</ControlLabel>
                  <FormControl type="text" readOnly placeholder="FrontEnd" name="frontEndName" value={'ReactJS'} />
                </FormGroup>
                <FormGroup className="navtab">
                  <ControlLabel>Version</ControlLabel>
                  <FormControl type="text" readOnly placeholder="FrontEndVersion" name="frontEndVersion" value={CLIENT_VERSION} />
                </FormGroup>
                <FormGroup className="navtab">
                  <ControlLabel>Internal Build Version</ControlLabel>
                  <FormControl type="text" readOnly placeholder="UIBuildVersion" name="uiBuildVersion" value={this.generic_master_store.versionDetails['UIBuildVersion'] ? this.generic_master_store.versionDetails['UIBuildVersion'] : ''} />
                </FormGroup>
                <FormGroup className="navtab">
                  <ControlLabel>Production Build Version</ControlLabel>
                  <FormControl type="text" readOnly placeholder="ProductionBuildVersion" name="productionBuildVersion" value={this.generic_master_store.versionDetails['ProductionBuildVersion'] ? this.generic_master_store.versionDetails['ProductionBuildVersion'] : ''} />
                </FormGroup>
              </Thumbnail>
            </Col>
            <Col key="backendDetailsColDiv" sm={6} md={6} lg={6} xs={6}>
              <div className="accesstoken-header">Back End Details</div>
              <Thumbnail>
                <FormGroup className="navtab">
                  <ControlLabel>Back End</ControlLabel>
                  <FormControl type="text" readOnly placeholder="BackEnd" name="backEndName" value={BACKEND} />
                </FormGroup>
                <FormGroup className="navtab">
                  <ControlLabel>Version</ControlLabel>
                  <FormControl type="text" readOnly placeholder="ServerVersion" name="ServerVersion" value={this.generic_master_store.versionDetails['ServerVersion'] ? this.generic_master_store.versionDetails['ServerVersion'] : '' } />
                </FormGroup>
                <FormGroup className="navtab">
                  <ControlLabel>Backend DB Version</ControlLabel>
                  <FormControl type="text" readOnly placeholder="ServerDBVersion" name="ServerDBVersion" value={this.generic_master_store.versionDetails['DBVersion'] ? this.generic_master_store.versionDetails['DBVersion'] : '' } />
                </FormGroup>
                <FormGroup className="navtab">
                  <ControlLabel>Backend Server URL</ControlLabel>
                  <FormControl type="text" readOnly placeholder="ServerURL" name="ServerURL" value={this.generic_master_store.versionDetails['ServerUrl'] ? this.generic_master_store.versionDetails['ServerUrl'] : SERVER_BASE_URL } />
                </FormGroup>
              </Thumbnail>
            </Col>
          </Col>
          <div hidden={Object.keys(this.generic_master_store.versionDetails).length !== 0}>
            <GenericStatusMessage statusMsg={'Version details not found'} />
          </div>
        </Row>
      </div>
    );
  }
}

VersionDetails.propTypes = {
  store: React.PropTypes.object
};

export default VersionDetails;
