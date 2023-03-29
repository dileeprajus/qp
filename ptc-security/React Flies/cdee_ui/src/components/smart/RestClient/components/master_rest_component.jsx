/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Thumbnail, FormControl, ButtonToolbar, Button, Tooltip, ControlLabel, OverlayTrigger} from 'react-bootstrap';
import SelectDataFormat from './select_data_format';
import MethodTypeSelection from './method_type_selection';
import ParamKeyValues from './param_key_value_handler';
import TabContainerMain from './tabs_container_main';
import TestApisScreen from './test_apis_screen';
import RequestVariablesConfig from '../../GenericComponents/requestVariablesConfig';
import ModalInstance from '../../../static/layout/modalinstance';
import CodeMirror from 'react-codemirror';
//import { RIEInput, RIESelect } from 'riek';

@inject('breadcrumb_store', 'modal_store')
@observer
class MasterRestComponent extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.modal_store = this.props.modal_store;
    this.state = {
      hideQueryParams: true,
      showFetchSchemaPanel: false,
      hideTestPanel: true,
      toggleTestScreen: true,
      custom_endpoints: false
    };
  }

  componentWillMount() {
    this.rest_client_store.getCustomEndPoints(this.updateData.bind(this));
  }

  updateData(){
    this.setState({'custom_endpoints':this.rest_client_store.CustomEndPoints})
  }
  showTestPanel(){
    this.setState({ hideTestPanel: false });
  }

  onTestClick() {
    this.rest_client_store.callTestApi(this.props.sourceType);
  }

  onUrlChange(event) {
    this.rest_client_store.setvalue(event.target.name, event.target.value);
    var temp_json = this.rest_client_store.extractTempRequestVariables(event.target.value,event.target.name);
    var temp_request_variables = this.rest_client_store.TempRequestVariables;
    temp_request_variables[event.target.name]=temp_json;
    this.rest_client_store.setvalue('TempRequestVariables', temp_request_variables);
    this.rest_client_store.normRequestVariables();
  }
  handleSubmit(event) {
    this.rest_client_store.setvalue('current_selected_source_type', this.props.sourceType);
    this.rest_client_store.setvalue('current_service_name', 'SetRestProperties');
    this.rest_client_store.setvalue('current_custom_path', '/RestClient/Edit/');
    this.modal_store.modal.modal_title = 'Update ' + this.rest_client_store.name + ' Thing';
    this.modal_store.showModal(
    <p>Are you sure you want to update: {this.rest_client_store.name} Thing</p>);
     event.preventDefault();
  }

  fetchSchema(){
    this.rest_client_store.fetchSchemaFromData(this.props.sourceType);
  }

  render() {
    var tempSchema = {};
    if (this.rest_client_store.currentGroupType === 'source') {
      tempSchema = this.rest_client_store.outputSchema;
    } else if (this.rest_client_store.currentGroupType === 'target') {
      tempSchema = this.rest_client_store.inputSchema;
    }
    const codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: true
    };

    var schema_tooltip = (<Tooltip id="tooltip-upload-config"><strong>Test this Schema</strong></Tooltip>)
    var test_data_tooltip = (<Tooltip id="tooltip-schema-test"><strong>Test </strong> Data</Tooltip>);
    var rv_edit = 'Loading....'
    if(this.state.custom_endpoints){
      rv_edit = <RequestVariablesConfig client_store={this.rest_client_store}/>
    }
    return (
      <Col xs={12} sm={12} md={12} lg={12}>
        <Thumbnail className="navtab">
          <Row>
            <Col xs={12}>
              <form onSubmit={this.handleSubmit}>
                <Row>
                  <SelectDataFormat
                    rest_client_store={this.rest_client_store} sourceType={this.props.sourceType}
                  />
                </Row>
                <Row>
                  <Col sm={1} smOffset={1}>
                    <MethodTypeSelection
                      rest_client_store={this.rest_client_store}
                      attr_name={this.props.sourceType + 'current_method_type'}
                    />
                  </Col>
                  <Col sm={8} smOffset={0}>
                    <FormControl
                      type="text" placeholder="Enter URL" name={this.props.sourceType + 'data_url'}
                      value={this.rest_client_store[this.props.sourceType + 'data_url']}
                      onChange={this.onUrlChange.bind(this)}
                    />
                  </Col>
                  <Col>
                    <ButtonToolbar>
                      <Button
                        bsStyle="success"
                        onClick={() => { this.setState({ hideQueryParams: !this.state.hideQueryParams }); }}
                      >Params</Button>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <span hidden={this.state.hideQueryParams}>
                  <ParamKeyValues
                    key={this.props.sourceType + 'query_params'}
                    rest_client_store={this.rest_client_store}
                    attr_keyword={this.props.sourceType + 'query_params'}
                  />
                </span>
                <Row>
                  <TabContainerMain rest_client_store={this.rest_client_store}
                  from={this.props.sourceType+'headers'}
                  store_key={this.props.sourceType+'headers'}
                  payload={this.props.sourceType+'payload'}
                  payload_option={this.props.sourceType+'current_payload_option'}
                  method_type={this.rest_client_store[this.props.sourceType+'current_method_type']}
                  sourceType={this.props.sourceType}/>
                </Row>
              </form>
            </Col>
          </Row>
        </Thumbnail>
        <div>
      <Col xs={12} id="SpecJsonPretty" style={{ backgroundColor: '#282A36' }}>
            <Col xs={4} sm={4} md={4} lg={4} >
              <ControlLabel><h6><font color="darkturquoise"><b>Variables:&nbsp;&nbsp;&nbsp;&nbsp;</b></font></h6></ControlLabel>
                <OverlayTrigger placement="top" overlay={test_data_tooltip}>
                <Button
                className=""
                bsSize="xsmall"
                bsStyle="info"
                onClick={this.onTestClick.bind(this)}
                >
                <i className="fa fa-flask"></i>
                </Button>
                </OverlayTrigger>
              <Col xs={12} className="ReqValueID">
                {rv_edit}
              </Col>
            </Col>
              <Col xs={4} sm={4} md={4} lg={4} >
                <ControlLabel><h6><font color="darkturquoise"><b>Data:&nbsp;&nbsp;&nbsp;&nbsp;</b></font></h6></ControlLabel>
                <OverlayTrigger placement="top" overlay={schema_tooltip}>
            <Button
              bsSize="xsmall"
              bsStyle="info"
              onClick={this.fetchSchema.bind(this)}
              >
              <i className="fa fa-refresh"></i>
            </Button>
          </OverlayTrigger>
              <TestApisScreen
                rest_client_store={this.rest_client_store}
                test_data={this.rest_client_store[this.props.sourceType + 'test_response']}
                data_format={this.rest_client_store[this.props.sourceType + 'current_data_format']}
              />
            </Col>
            <Col xs={4} sm={4} md={4} lg={4} >
              <ControlLabel><h6><font color="darkturquoise"><b>Schema:</b></font></h6></ControlLabel>
              <CodeMirror id="api_test_json-pretty" value={JSON.stringify(tempSchema, null, 2)} options={codeOptions} />
          </Col>
          </Col>
        </div>



        <ModalInstance
            custom_store={this.rest_client_store} custom_path={this.rest_client_store.current_custom_path}
          custom_history={this.props.history} service_name={this.rest_client_store.current_service_name}
        />
      </Col>
    );
  }
}

MasterRestComponent.propTypes = {
  store: React.PropTypes.object
};

export default MasterRestComponent;
