/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Col,Row,ControlLabel, FormGroup } from 'react-bootstrap'
import FormdataParamKeyValues from './formdata_param_handler';

@observer
class TabPanePayloadFormData extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
  }

  componentWillMount() {
  }

  showFormdataInput(){
    return this.rest_client_store.current_payload_option !== 'form-data';
  }

    render() {
        return (
        <div>
          <FormGroup>
          <div hidden={this.showFormdataInput()}>
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
              <FormdataParamKeyValues key="payload_form_data" rest_client_store={this.rest_client_store} attr_keyword="payload_form_data" />
            </div>
          </div>
          </FormGroup>
        </div>
        )
    }
}

TabPanePayloadFormData.propTypes = {
  store: React.PropTypes.object
};

export default TabPanePayloadFormData;
