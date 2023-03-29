/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import CodeMirror from 'react-codemirror';
import {Tooltip,OverlayTrigger,FormGroup,FormControl,ControlLabel,Button,Col,Row} from 'react-bootstrap'
import 'codemirror/mode/javascript/javascript';


@observer
class NewScriptForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      test_input_value: '',
      test_output_value: ''
    }
  }

  componentWillMount() {

  }

  onChange(event){
    var modified_obj = this.props.snode['TransformationRules'][this.props.selected_key];
    var modified_value = event.target.value;
    if(event.target.name === 'script'){
      modified_value = event.target.value.split('\n');
    }
    modified_obj[event.target.name] = modified_value;
    this.props.master.updateTreeData(this.props.master.state.treeData);
  }

  updateCode(newCode){
    var modified_obj = this.props.snode['TransformationRules'][this.props.selected_key];
    modified_obj['script'] = newCode.split('\n');
    this.props.snode['TransformationRules'][this.props.selected_key] = modified_obj;
  }


  updateTestInput(event){
    this.setState({test_input_value: event.target.value});
  }

  testScript(){
    var input = this.state.test_input_value;
    var me=this;
    if(input){

    }else{
      input = this.state.test_input_value;
    }
    this.props.type_manager_store.TestScript(this.props.selected_script.script,input);
  }

  render() {

    var codeOptions = {
			lineNumbers: true,
      mode: 'javascript'
		};

    var data_type_list = Object.keys(this.props.type_manager_store.data_types).map(m => {
         return(
           <option key={m} value={m}>{m}</option>
         )
    });
    var value = JSON.stringify(this.props.type_manager_store.test_script_output['value']);
    var test_script_result = ' TYPE: ' + this.props.type_manager_store.test_script_output['data_type'] + ' VALUE: '+value;
    var test_script_tooltip = (<Tooltip id="tooltip-script-test"><strong>Test </strong> this Script.</Tooltip>)
    return(
      <FormGroup>
        <Row>
          <FormGroup>
            <ControlLabel>Description</ControlLabel>
            <FormControl type="text" placeholder="Enter input here" name="description" value={this.props.selected_script?this.props.selected_script.description:''} onChange={this.onChange.bind(this)}/>
          </FormGroup>
          <Col xs={4}>
            <FormGroup>
              <ControlLabel>Input</ControlLabel>
              <FormControl componentClass="select" placeholder="select" title="Input" name="input" value={this.props.selected_script?this.props.selected_script.input:''} onChange={this.onChange.bind(this)}>
                {data_type_list}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={4} xsOffset={4}>
            <FormGroup>
              <ControlLabel>Output</ControlLabel>
              <FormControl componentClass="select" placeholder="select" title="Output" name="output" value={this.props.selected_script?this.props.selected_script.output:''} onChange={this.onChange.bind(this)}>
                {data_type_list}
              </FormControl>
            </FormGroup>
          </Col>

          <Col xs={4}>
            <FormGroup>
              <FormControl type="text" placeholder="Enter Input" name="description" value={this.state.test_input_value} onChange={this.updateTestInput.bind(this)}/>
            </FormGroup>
          </Col>
          <Col xs={6} xsOffset={2}>
            <FormGroup>
              <div className="wordWrap">
                {test_script_result}
              </div>
            </FormGroup>
          </Col>

          <Col xs={12} md={12} lg={12}>
          <ControlLabel>Script</ControlLabel>
          <OverlayTrigger placement="left" overlay={test_script_tooltip}>
            <Button
              className="pull-right"
              bsSize="xsmall"
              bsStyle="info"
              onClick={this.testScript.bind(this)}
              >
              <i className="fa fa-flask"></i>
            </Button>
          </OverlayTrigger>
          <CodeMirror value={this.props.selected_script?this.props.selected_script.script.join('\n'):''} onChange={this.updateCode.bind(this)} options={codeOptions} />
          </Col>
        </Row>
      </FormGroup>
    )
  }
}

NewScriptForm.propTypes = {
  store: React.PropTypes.object
};

export default NewScriptForm;
