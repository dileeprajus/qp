/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import mobx from 'mobx';
import { inject, observer } from 'mobx-react';
import CodeMirror from 'react-codemirror';
import { FormGroup, FormControl, ControlLabel, Col, Row } from 'react-bootstrap';
import 'codemirror/mode/javascript/javascript';

@inject('modal_store')

@observer
class ScriptEditForm extends React.Component {
  constructor(props) {
    super(props);
      this.modal_store = this.props.modal_store;
    this.state = {
    };
  }

  componentWillMount() {
    this.props.type_manager_store.GetDataTypes;
  }

  onChange(event) {
    var modified_obj = mobx.toJS(this.props.type_manager_store.filter_scripts[this.props.selected_key]);
    var modified_value = event.target.value;
    if (event.target.name === 'script') {
      modified_value = event.target.value.split('\n');
    }
    modified_obj[event.target.name] = modified_value;
    this.props.type_manager_store.filter_scripts[this.props.selected_key] = modified_obj;
    this.modal_store.modal.save_btn_dsbld = false;
  }

  updateCode(newCode) {
    var modified_obj = mobx.toJS(this.props.type_manager_store.filter_scripts[this.props.selected_key]);
    modified_obj['script'] = newCode.split('\n');
    this.props.type_manager_store.filter_scripts[this.props.selected_key] = modified_obj;
    if(newCode === '') {
      this.modal_store.modal.save_btn_dsbld = true;
    }else{
      this.modal_store.modal.save_btn_dsbld = false;
    }
  }

  updateTestInput(event) {
    this.props.type_manager_store.setvalue('test_input_value', event.target.value)
    this.testScript(event.target.value);
    this.modal_store.modal.save_btn_dsbld = false;
    if(this.props.type_manager_store.test_input_value === '') {
      this.props.type_manager_store.setvalue('test_output_value', '');
    }
  }

  testScript(input) {
    if (input) {
    } else {
      input = this.props.type_manager_store.test_input_value;
    }
    var script_string = this.props.selected_script.script.join(';\n');
    script_string +='return output;';
    var sample_output = new Function('input', script_string);
    var output = sample_output(input);
      this.props.type_manager_store.setvalue('test_output_value', ' TYPE: ' + typeof(output) + ' VAL: ' + JSON.stringify(output))
  }

  render() {
    var codeOptions = {
      lineNumbers: true,
      mode: 'javascript'
    };

    var data_type_list = Object.keys(this.props.type_manager_store.data_types).map(m => {
      return (
        <option key={m} value={m}>{m}</option>
      );
    });

    return (
      <FormGroup>
        <Row>
          <FormGroup>
            <ControlLabel>Description</ControlLabel>
            <FormControl
              type="text" placeholder="Enter Description" name="description"
              value={this.props.selected_script.description} onChange={this.onChange.bind(this)}
            />
          </FormGroup>
          <Row>
          <Col xs={5}>
            <FormGroup>
              <ControlLabel>Input</ControlLabel>
              <FormControl
                componentClass="select" placeholder="select" title="Input" name="input"
                value={this.props.selected_script.input} onChange={this.onChange.bind(this)}
              >
                {data_type_list}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={5} xsOffset={2}>
            <FormGroup>
              <ControlLabel>Output</ControlLabel>
              <FormControl
                componentClass="select" placeholder="select" title="Output"
                name="output" value={this.props.selected_script.output}
                onChange={this.onChange.bind(this)}
              >
                {data_type_list}
              </FormControl>
            </FormGroup>
          </Col>

          <Col xs={5}>
            <FormGroup>
              <FormControl
                type="text" placeholder="Enter Input Here" name="description"
                value={this.props.type_manager_store.test_input_value} onChange={this.updateTestInput.bind(this)}
              />
            </FormGroup>
          </Col>
          <Col xs={5} xsOffset={2}>
            <FormGroup style={{wordBreak: 'break-all'}}>
              {this.props.type_manager_store.test_output_value}
            </FormGroup>
          </Col>

          <Col xs={12} md={12} lg={12}>
            <ControlLabel>Script</ControlLabel>
            <CodeMirror
              value={this.props.selected_script.script.join('\n')}
              onChange={this.updateCode.bind(this)} options={codeOptions}
            />
          </Col>
          </Row>
        </Row>
      </FormGroup>
    );
  }
}

ScriptEditForm.propTypes = {
  store: React.PropTypes.object
};

export default ScriptEditForm;
