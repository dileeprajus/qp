/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormGroup, Button, Panel, Radio, FormControl,ListGroupItem } from 'react-bootstrap';

@inject('breadcrumb_store', 'modal_store')
@observer
class UploadWsdl extends React.Component { //TODO : this should be moved to tempaltes folder
  constructor(props) {
    super(props);
    this.soap_client_store = this.props.soap_client_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.brs = this.props.brs;
    this.state = {
      'hideNewWsdlForm': false,
      'wsdlFromFile': true
    }
  }

  componentWillMount() {
    if(this.soap_client_store.configJson['wsdls']!==undefined && this.soap_client_store.configJson['wsdls']['wsdl1']!==undefined){
      this.brs.InputWSDL = this.soap_client_store.configJson['wsdls']['wsdl1'];
    }
  }

  onChange(event) {
    if(event.target.name==='wsdlinput'){
      if(event.target.value==='FileUpload') {
        this.setState({'wsdlFromFile': true});
      }
      else if(event.target.value==='FromURL') {
        this.setState({'wsdlFromFile': false});
      }
    }
  }

  updateInput(event){
    this.brs.InputWSDL = event.target.value;
    if(this.soap_client_store.configJson['wsdls']===undefined){
      this.soap_client_store.configJson['wsdls']={};
      var wsdls = {};
    }
    else{
      var wsdls = this.soap_client_store.configJson['wsdls'];
    }
    this.soap_client_store.configJson['wsdls']={'wsdl1': event.target.value};
  }

  toggleForm(){
    this.setState({'hideNewWsdlForm': !this.state.hideNewWsdlForm})
  }

  handleSubmit(event) {

  }
  render() {
    var existing_wsdl = ['wsdl1', 'wsdl2', 'wsdl3', 'wsdl4', 'wsdl5', 'wsdl6', 'wsdl7', 'wsdl8', 'wsdl9', 'wsdl10']
    var wsdl_list = [];
    existing_wsdl.map(ws => {
          wsdl_list.push(
              <ListGroupItem key={ws} name={ws} href="#" className="SortableItem">
                  {ws}
              </ListGroupItem>
          )
      });
    return (
      <div>
        <Panel className="navtab">
          <div className="col-lg-6 col-md-6 col-sm-6 radio-btn-div">
            <Radio name="wsdlinput" value="FileUpload" onChange={this.onChange.bind(this)} inline checked={this.state.wsdlFromFile}>File Upload</Radio>
            <Radio name="wsdlinput" value="FromURL" onChange={this.onChange.bind(this)} inline checked={!this.state.wsdlFromFile}>From URL</Radio>
          </div>
          <div hidden={!this.state.wsdlFromFile}>
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <FormControl rows="6" componentClass="textarea" placeholder="File content goes here..." name="from_file" value={this.brs.InputWSDL} onChange={this.updateInput.bind(this)} />
            </FormGroup>
              <Button bsStyle="primary" className="btn-submit" onClick={this.props.handleSubmit.bind(this)} block >Update</Button>
          </form>
        </div>
        <div hidden={this.state.wsdlFromFile}>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <FormControl rows="2" componentClass="textarea" placeholder="Enter URL here..." name="from_url" value="" onChange={this.onChange.bind(this)} />
          </FormGroup>
            <Button bsStyle="primary" className="btn-submit" onClick={this.handleSubmit.bind(this)} block >Update</Button>
        </form>
      </div>
            &nbsp;
            <br></br>
       </Panel>
      </div>
    );
  }
}

UploadWsdl.propTypes = {
  store: React.PropTypes.object
};

export default UploadWsdl;
