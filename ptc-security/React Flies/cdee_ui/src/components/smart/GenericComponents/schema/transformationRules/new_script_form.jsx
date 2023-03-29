/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import CodeMirror from 'react-codemirror';
import {Tooltip, OverlayTrigger, FormGroup, FormControl, ControlLabel, Button, Col, Row, Modal} from 'react-bootstrap'
import 'codemirror/mode/javascript/javascript';

@inject('modal_store')
@observer
class NewScriptForm extends React.Component {
  constructor(props) {
    super(props);
    this.type_manager_store = this.props.type_manager_store;
    this.modal_store = this.props.modal_store;
    this.state = {
      scriptDesc: '',
      showScriptModal: false,
      stateCode: this.props.selected_script?this.props.selected_script.script.join('\n'):'',
      disableAddScriptButton : true
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({stateCode: newProps.selected_script?newProps.selected_script.script.join('\n'):''});
  }
  onChange(event){
    var modified_obj = this.props.snode[this.props.prop_key][this.props.selected_key];
    var modified_value = event.target.value;
    if(event.target.name === 'script'){
      modified_value = event.target.value.split('\n');
    }
    modified_obj[event.target.name] = modified_value;
    if(this.props.from==='schema_edit'){
    this.props.master.updateTreeData(this.props.master.state.treeData);
    }else{
        if (event.target.name === 'description') {
          this.setState({ scriptDesc: event.target.value }); //fix for description is not updating for newly added script for the new mapping attributes
        }
        this.props.master.updateTreeData(this.props.snode[this.props.prop_key],this.props.prop_key);
    }
  }

  updateCode(newCode){
    var modified_obj = this.props.snode[this.props.prop_key][this.props.selected_key];
    if (modified_obj) {
      modified_obj['script'] = this.state.stateCode.split('\n');
      this.props.snode[this.props.prop_key][this.props.selected_key] = modified_obj;
    }
      //// added and updated these two lines for bug no. 359 from ProductOffice
    try{
      if(this.props.type_manager_store[this.props.prop_key].testScipt_input_value.value  && this.props.selected_script.script.length>0){
          this.modal_store.modal.test_script_btn_dsbld=false;
          if(this.props.selected_script.script.length===1 && newCode===''){
              this.modal_store.modal.test_script_btn_dsbld=true;
          }
      }else{
          this.modal_store.modal.test_script_btn_dsbld=true;
      }
    }catch (e){
        this.modal_store.modal.test_script_btn_dsbld=true;
    }
  }

  updateStateCode(updatedCode){
    this.setState({stateCode:updatedCode})
    if(updatedCode!=='' && updatedCode!==null && updatedCode!==undefined){
      this.setState({disableAddScriptButton:false})
    }
  }

  openScriptModal() {
    this.setState({ showScriptModal: true });
  }
  updateTestInput(event){
    //// added and updated these two lines for bug no. 359 from ProductOffice
    try{
      var temp_ts = this.props.type_manager_store[this.props.prop_key]
      temp_ts['testScipt_input_value']=JSON.parse(event);
        this.props.type_manager_store.setvalue(this.props.prop_key, temp_ts);  //changes added for bug 103
        var isValuePresent=JSON.parse(event).value;
        if(isValuePresent && this.props.selected_script.script.length>0){
            this.modal_store.modal.test_script_btn_dsbld=false;
        }else{
            this.modal_store.modal.test_script_btn_dsbld=true;
        }
    }
    catch (e){
      this.modal_store.modal.test_script_btn_dsbld=true;
    }
  }

  testScript(){
    var input = this.props.type_manager_store.test_input_value;
    if(input){

    }else{
      input = this.props.type_manager_store[this.props.prop_key].testScipt_input_value;
      this.props.type_manager_store[this.props.prop_key].test_script_output['value'] = '';
    }
    this.props.type_manager_store.TestScript(this.props.selected_script.script,input,this.props.prop_key);
  }

  render() {
    let close = () => this.setState({ showScriptModal: false });
    var codeOptions = {
	 lineNumbers: true,
      mode: 'javascript'
    };

    const TestInputcodeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: false
    };

    var data_type_list = Object.keys(this.props.type_manager_store.data_types).map(m => {
         return(
           <option key={m} value={m}>{m}</option>
         )
    });
    var value = JSON.stringify(this.props.type_manager_store[this.props.prop_key].test_script_output['value']);
    var test_script_result = 'OUTPUT: '+value;
    var test_script_tooltip = (<Tooltip id="tooltip-script-test"><strong>Test </strong> this Script.</Tooltip>)
    var add_script_tooltip = (<Tooltip id="tooltip-script-add"><strong>Add </strong> this Script.</Tooltip>)
    var show_script_modal_tooltip = (<Tooltip id="tooltip-script-modal"><strong>Expand </strong> this Script.</Tooltip>)
    return(
      <FormGroup>
        <Row>
        <Col xs={12} md={12} sm={12}>
          <FormGroup>
            <ControlLabel>Name : </ControlLabel>
            {this.props.selected_script?this.props.selected_script.name:''}
          </FormGroup>
          <FormGroup hidden>
            <ControlLabel>Description</ControlLabel>
            <FormControl type="text" placeholder="Enter Description" name="description" value={this.props.selected_script ? this.props.selected_script.description: this.state.scriptDesc} onChange={this.onChange.bind(this)}/>
          </FormGroup>
          <Row>
          <Col xs={5} hidden>
            <FormGroup>
              <ControlLabel>Input</ControlLabel>
              <FormControl componentClass="select" placeholder="select" title="Input" name="input" value={this.props.selected_script?this.props.selected_script.input:''} onChange={this.onChange.bind(this)}>
                {data_type_list}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={5} xsOffset={2} hidden>
            <FormGroup>
              <ControlLabel>Output</ControlLabel>
              <FormControl componentClass="select" placeholder="select" title="Output" name="output" value={this.props.selected_script?this.props.selected_script.output:''} onChange={this.onChange.bind(this)}>
                {data_type_list}
              </FormControl>
            </FormGroup>
          </Col>
          <Col xs={12} md={12} lg={12}>
          <ControlLabel>Script</ControlLabel>
          <OverlayTrigger placement="top" overlay={test_script_tooltip}>
            <Button
              className="pull-right"
              bsSize="xsmall"
              bsStyle="info"
              style={{marginLeft: 2 + 'px'}}
              disabled={this.state.disableAddScriptButton}
              onClick={this.testScript.bind(this)}
              >
              <i className="fa fa-flask"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={add_script_tooltip}>
            <Button
              className="pull-right"
              bsSize="xsmall"
              bsStyle="info"
              disabled={this.state.disableAddScriptButton}
              onClick={this.updateCode.bind(this)}
              >
              <i className="fa fa-check-square"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={show_script_modal_tooltip}>
            <Button
              className="pull-right"
              bsSize="xsmall"
              bsStyle="info"
              disabled={this.state.disableAddScriptButton}
              onClick={this.openScriptModal.bind(this)}
              >
              <i className="fa fa-expand"></i>
            </Button>
          </OverlayTrigger>
          <CodeMirror value={this.state.stateCode} onChange={this.updateStateCode.bind(this)} options={codeOptions} />
          </Col>
            <Col xs={12}>
              <div>To update the code in editor, need to click on add script button.</div>
            </Col>
            <Col xs={12}>
              &nbsp;
              <div className="wordWrap" style={{fontWeight:'bold'}}>
                {'SCRIPT INPUT'}
              </div>
              <CodeMirror
                value={JSON.stringify(this.props.type_manager_store[this.props.prop_key].testScipt_input_value, null, 2)}
                options={TestInputcodeOptions}
                onChange={this.updateTestInput.bind(this)}
              />
            </Col>
            <Col xs={12} xsOffset={0}>
              <FormGroup>
                <div className="wordWrap" style={{fontWeight:'bold'}}>
                  {test_script_result}
                </div>
              </FormGroup>
            </Col>
          </Row>
          </Col>
          <Modal show={this.state.showScriptModal} onHide={close} container={this} bsSize="large" aria-labelledby="contained-modal-title-lg">
            <Modal.Header closeButton>
              <h4>Edit This Script</h4>
            </Modal.Header>
            <Modal.Body>
              <CodeMirror value={this.state.stateCode} onChange={this.updateStateCode.bind(this)} options={codeOptions} />
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
        </Row>
      </FormGroup>
    )
  }
}

NewScriptForm.propTypes = {
  store: React.PropTypes.object
};

export default NewScriptForm;
