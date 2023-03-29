/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Row, FormGroup, FormControl, InputGroup, Button } from 'react-bootstrap';

@inject('scheduler_store')
@observer
class TriggerDataStore extends React.Component {
  constructor(props) {
    super(props);
    this.thing_store = this.props.thing_store;
    this.trigger_type = this.props.type;
    this.scheduler_store = this.props.scheduler_store;
    this.state = {
      SelecteDataStore: 'Select DataStore'
    };
  }
  componentWillMount() {
  }
  onChange(event) {
    this.setState({ SelecteDataStore: event.target.value });
  }
  render() {
    let dataStoreOptions = [];
    for (let i = 0; i < this.scheduler_store.DataStoreOptions.length; i++) {
      let config = this.scheduler_store.DataStoreOptions[i];
      dataStoreOptions.push(
        <option
          key={this.trigger_type + ' ' + config} name={this.trigger_type + ' ' + config} value={config}
        >{config}</option>
      );
    }
    return (
      <div key="triggerDataStoreDiv">
        <Row>
          <Col xs={12} sm={12} md={12} lg={12}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Button>
                  <Button key={this.trigger_type + 'btn'} bsStyle="info">
                    Select DataStore ( <i className="fa fa-database" /> )</Button>
                </InputGroup.Button>
                <FormControl
                  key={this.trigger_type + 'select'}
                  componentClass="select" placeholder="select" title="Select DataStore"
                  name="dataStore" value={this.state.SelecteDataStore}
                   onChange={this.onChange.bind(this)}
                >
                  {dataStoreOptions}
                </FormControl>
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

TriggerDataStore.propTypes = {
  store: React.PropTypes.object
};

export default TriggerDataStore;
