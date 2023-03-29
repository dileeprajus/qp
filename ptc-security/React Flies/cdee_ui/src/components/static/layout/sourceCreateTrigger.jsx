/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Tooltip, OverlayTrigger, Button } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';

@inject('generic_master_store')
@observer
class SourceCreateTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.clientStore = this.props.client_store;
    this.state = {
    };
  }

  componentWillMount() {
  }
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.clientStore.setvalue('triggerData', this.clientStore.BasicConfigInfo.Data);
    }
  }
  testCreateTrigger() {
    if (this.clientStore.triggerData === undefined || Object.keys(this.clientStore.triggerData).length === 0) {
      this.clientStore.setvalue('triggerData', this.clientStore.BasicConfigInfo.Data);
    }
    this.clientStore.createTrigger();
  }
  updateTriggerData(event) {
    if (this.props.dataFormat === 'XML' || this.props.dataFormat === 'CSV') {
      this.clientStore.setvalue('triggerData', event);
    } else this.clientStore.setvalue('triggerData', JSON.parse(event));
  }
  render() {
    var testTooltip = (<Tooltip id="tooltip-script-test"><strong>Test Source Trigger</strong></Tooltip>);
    var tempMode = 'javascript';
    var tempData;
    if (this.props.dataFormat === 'XML' || this.props.dataFormat === 'CSV') {
      tempMode = 'xml';
    }
    tempData = this.clientStore.triggerData;
    const editableCodeOptions = {
      lineNumbers: false,
      mode: tempMode,
      lineWrapping: true,
      theme: 'dracula',
      smartIndent: true,
      readOnly: false
    };
    const CodeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true,
      lineWrapping: true
    };
    return (
      <div className="selectedContainerStyle">
        <Row id="sourceCreateTriggerDiv">
          <Col key="sourceCreateTriggerColDiv" sm={6} md={6} lg={6} xs={6}>
            <h6>Sample Static Data: </h6>
            <div>
              <OverlayTrigger placement="left" overlay={testTooltip}>
                <Button
                  className="pull-right" bsSize="xsmall" bsStyle="info"
                  disabled={tempData === ''}
                  onClick={this.testCreateTrigger.bind(this)}
                >
                  <i className="fa fa-flask"></i>
                </Button>
              </OverlayTrigger>
            </div>
            <Col id="sourceTriggerPretty" style={{ backgroundColor: '#282A36' }}>
              <CodeMirror
                id="createTriggerPretty" value={tempData}
                options={editableCodeOptions} onChange={this.updateTriggerData.bind(this)}
              />
            </Col>
          </Col>
          <Col key="sourceCreateTriggerResponseDiv" sm={6} md={6} lg={6} xs={6}>
            <h6>Data Response: </h6>
              <CodeMirror
                id="createTriggerResponsePretty" value={JSON.stringify(this.clientStore.triggerDataResponse, null, 2)}
                options={CodeOptions}
              />
            </Col>
        </Row>
      </div>
    );
  }
}
SourceCreateTrigger.propTypes = {
  store: React.PropTypes.object
};

export default SourceCreateTrigger;
