/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from "react";
import { inject, observer } from "mobx-react";
import {
  Col,
  Thumbnail,
  FormGroup,
  FormControl,
  ControlLabel,
  Row,
  Checkbox,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";

@inject("generic_master_store")
@observer
class TRCQueueConfiguration extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.state = {
      scheduarEnabled: false,
      userCheck:
        this.props.generic_master_store.userGroupName === "Admin"
          ? true
          : false,
    };
  }

  componentWillMount() {
    this.generic_master_store.setTRCQueueConfiguration(
      "ThingSchedulerToInvokeSourceQueue",
      "GetData"
    );
    this.generic_master_store.getConcurrentValue();
    this.generic_master_store.getSleepTime();
  }
  saveConfiguration() {
    this.generic_master_store.setTRCQueueConfiguration(
      "ThingSchedulerToInvokeSourceQueue",
      "PostData"
    );
  }

  isEnableSchedular(event) {
    this.generic_master_store.setvalue(event.target.name, event.target.checked);
  }
  getStreamCount() {
    this.generic_master_store.getDashboardStats();
  }

  onChange(event) {
    if (event.target.name === "cronString") {
      if (
        event.target.value >= 0 &&
        event.target.value < 60 &&
        event.target.value.length < 3
      ) {
        this.generic_master_store.setvalue(
          event.target.name,
          event.target.value
        );
      }
    } else if (event.target.name === "RequestCount") {
      if (
        event.target.value >= 5 &&
        event.target.value < 1001 &&
        event.target.value.length < 5
      ) {
        this.generic_master_store.setvalue(
          event.target.name,
          event.target.value
        );
      }
    } else if (event.target.name === "SleepTime") {
      const number = /^[0-9\b]+$/;
      if (
        event.target.value === "" ||
        (number.test(event.target.value) &&
          event.target.value >= 1 &&
          event.target.value < 100 &&
          event.target.value.length < 4)
      ) {
        this.generic_master_store.setvalue(
          event.target.name,
          event.target.value
        );
      }
    }
  }

  render() {
    var streamCount = (
      <Tooltip id="tooltip-streamcount">
        <strong>Get Stream Count</strong>
      </Tooltip>
    );
    return (
      <div>
        <Row>
          <Col xsOffset={2} sm={5} md={5} lg={5} xs={5}>
            {/* <div className="queueconf-header">TRC Queue Configuration</div> */}
            <Thumbnail style={{ width: "700px" }}>
              <FormGroup>
                <Row>
                  <Col xs={9}>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      <ControlLabel
                        style={{
                          marginLeft: "20%",
                          marginTop: "15px",
                          fontSize: "larger",
                        }}
                      >
                        Processing Status
                      </ControlLabel>
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={5}>
                      <Checkbox
                        style={{
                          marginLeft: "33%",
                          marginTop: "15px",
                          fontSize: "larger",
                        }}
                        name="scheduarEnabled"
                        checked={this.generic_master_store.scheduarEnabled}
                        onChange={this.isEnableSchedular.bind(this)}
                        inline
                      ></Checkbox>
                    </Col>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col xs={9}>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      <ControlLabel
                        style={{
                          marginLeft: "20%",
                          marginTop: "15px",
                          fontSize: "larger",
                        }}
                      >
                        Frequency(Entered in sec)
                      </ControlLabel>
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={6}>
                      <FormControl
                        style={{ marginLeft: "20%", marginTop: "15px" }}
                        type="text"
                        placeholder="schedularTime"
                        name="cronString"
                        value={this.generic_master_store.cronString}
                        onChange={this.onChange.bind(this)}
                      />
                      <small
                        style={{
                          marginLeft: "20%",
                          marginTop: "15px",
                          color: "red",
                        }}
                      >
                        Valid values is between 5 to 59
                      </small>
                    </Col>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col xs={9}>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      <ControlLabel
                        style={{
                          marginLeft: "20%",
                          marginTop: "15px",
                          fontSize: "larger",
                        }}
                      >
                        Parallel Requests{" "}
                      </ControlLabel>
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={6}>
                      <FormControl
                        style={{ marginLeft: "20%", marginTop: "15px" }}
                        type="text"
                        placeholder="RequestCount"
                        name="RequestCount"
                        value={this.generic_master_store.RequestCount}
                        onChange={this.onChange.bind(this)}
                      />
                    </Col>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col xs={9}>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      <ControlLabel
                        style={{
                          marginLeft: "20%",
                          marginTop: "15px",
                          fontSize: "larger",
                        }}
                      >
                        Sleep Time(ms){" "}
                      </ControlLabel>
                    </Col>
                    <Col xs={3} sm={3} md={3} lg={6}>
                      <FormControl
                        style={{ marginLeft: "20%", marginTop: "15px" }}
                        type="text"
                        placeholder="SleepTime"
                        name="SleepTime"
                        value={this.generic_master_store.SleepTime}
                        onChange={this.onChange.bind(this)}
                      />
                      <small
                        style={{
                          marginLeft: "20%",
                          marginTop: "15px",
                          color: "red",
                        }}
                      >
                        Valid values is between 1 to 99
                      </small>
                    </Col>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <Col xs={12}>
                    <Button
                      bsStyle="primary"
                      className="btn btn-primary fa-pull-right"
                      disabled={
                        this.generic_master_store.SleepTime.length === 0 ||
                        this.generic_master_store.RequestCount.length === 0 ||
                        this.generic_master_store.cronString.length === 0 ||
                        this.state.userCheck === false
                      }
                      onClick={this.saveConfiguration.bind(this)}
                    >
                      Save
                    </Button>
                  </Col>
                </Row>
              </FormGroup>
            </Thumbnail>
          </Col>
          <Col xsOffset={2} xs={3} sm={3} md={3} lg={3}>
            <Thumbnail className="headerTail">
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Row>
                    <ControlLabel
                      style={{
                        marginLeft: "20%",
                        marginTop: "15px",
                        fontSize: "larger",
                      }}
                    >
                      Stream Count{" "}
                    </ControlLabel>
                    <OverlayTrigger placement="top" overlay={streamCount}>
                      <Button
                        bsSize="xsmall"
                        bsStyle="info"
                        style={{ marginLeft: "20%" }}
                        onClick={this.getStreamCount.bind(this)}
                      >
                        <i className="fa fa-refresh"></i>
                      </Button>
                    </OverlayTrigger>
                  </Row>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  className="headerTailFigure"
                >
                  <strong
                    style={{
                      marginLeft: "20%",
                      marginTop: "15px",
                      fontSize: "larger",
                    }}
                  >
                    {this.generic_master_store.dashboardStats.streamCount}
                  </strong>
                </Col>
              </Row>
            </Thumbnail>
          </Col>
        </Row>
      </div>
    );
  }
}

TRCQueueConfiguration.propTypes = {
  store: React.PropTypes.object,
};

export default TRCQueueConfiguration;
