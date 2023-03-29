/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Thumbnail, Col, FormGroup, FormControl, Button,DropdownButton,MenuItem,ButtonToolbar,Tab,Row,Nav,NavItem,NavDropdown,Radio } from 'react-bootstrap'
import RestClientStore from '../../../stores/RestClientStore';

@inject('breadcrumb_store')
@observer
class RestClientThingEdit extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = new RestClientStore(this.props.match.params.name)
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.state = {params_arr: []};
    this.addParam = this.addParam.bind(this);
  }

  componentWillMount() {
    var PageName = 'Edit:'+this.props.match.params.name;
    this.breadcrumb_store.Bread_crumb_obj = {'name':PageName,'path':this.props.match.url};
    this.breadcrumb_store.pushBreadCrumbsItem();
  }

  onChange (event) {
    var temp_rest_options = this.rest_client_store.selected_rest_options;
    temp_rest_options[event.target.name] = event.target.value;
    this.rest_client_store.setvalue('selected_rest_options', temp_rest_options);
  }

  basicAuth (event) {
    var temp_rest_options = this.rest_client_store.selected_rest_options;
    temp_rest_options.basic_auth_details[event.target.name] = event.target.value;
    this.rest_client_store.setvalue('selected_rest_options', temp_rest_options);
  }

  handleSubmit(event) {
    alert('Are you sure you want to update: ' + this.rest_client_store.name + ' Thing');
    // Redirect to Show page
    this.props.history.push('/RestClient/Show/'+this.rest_client_store.name);
    event.preventDefault();
  }

  selectItem(event){
    var temp_rest_options = this.rest_client_store.selected_rest_options;
    temp_rest_options['method_type'] = event;
    this.rest_client_store.setvalue('selected_rest_options', temp_rest_options);
  }

  selectauth(event){
    var temp_rest_options = this.rest_client_store.selected_rest_options;
    temp_rest_options['auth_type'] = event;
    this.rest_client_store.setvalue('selected_rest_options', temp_rest_options);
  }

  addHeaderValues(value_type,type,event){ //as params will come in reverse order
    var temp_rest_options = this.rest_client_store.selected_rest_options;
    if(type=='headers'){
      if(value_type=='key'){
        temp_rest_options.headers[event.target.name]['key'] = event.target.value;
      }
      else{
        temp_rest_options.headers[event.target.name]['value'] = event.target.value;
      }
    }
    else{
      if(value_type=='key'){
      temp_rest_options.attributes[event.target.name]['key'] = event.target.value;
      }
      else{
      temp_rest_options.attributes[event.target.name]['value'] = event.target.value;
      }
    }

    this.rest_client_store.setvalue('selected_rest_options', temp_rest_options);
  }

  addParam(type,event){
    var temp_rest_options = JSON.parse(JSON.stringify(this.rest_client_store.selected_rest_options));
    var last_key='';
    if(type=='headers'){
      for(var key in temp_rest_options.headers){last_key=key;}
      if ((last_key!='')&&(temp_rest_options.headers[last_key]['key']=='')) {}
      else
      {
        temp_rest_options.headers['header'+(new Date().getTime())]={'key':'','value':''};
      }
    }
    else{
      for(var key in temp_rest_options.attributes){last_key=key;}
      if ((last_key!='')&&(temp_rest_options.attributes[last_key]['key']=='')) {}
      else
      {
        temp_rest_options.attributes['attribute'+(new Date().getTime())]={'key':'','value':''};
      }
    }
    this.rest_client_store.setvalue('selected_rest_options', temp_rest_options);
  }

  deleteParam(key,type){
   var temp_rest_options = JSON.parse(JSON.stringify(this.rest_client_store.selected_rest_options));
   if(type=='headers'){
    delete temp_rest_options.headers[key];
   }
   else{
    delete temp_rest_options.attributes[key];
   }
   this.rest_client_store.setvalue('selected_rest_options', temp_rest_options);
  }

  disablePayloadTab(){
    if(this.rest_client_store.selected_rest_options.method_type=='GET'){
      return true;
    }else{
      return false;
    }
  }

  render() {
    // This is used to navigate to any page
    var headers_arr=[];
    for(var header in this.rest_client_store.selected_rest_options.headers){
       headers_arr.push(
          <FormGroup>
          <Col sm={5}>
          <FormControl type="text" placeholder="" name={header} value={this.rest_client_store.selected_rest_options.headers[header].key} onInput={this.addHeaderValues.bind(this,'key','headers')} />
          </Col>
          <Col sm={6}>
          <FormControl type="text" placeholder="" name={header} value={this.rest_client_store.selected_rest_options.headers[header].value} onInput={this.addHeaderValues.bind(this,'value','headers')} />
          </Col>
          <Col sm={1}>
          <ButtonToolbar><Button bsStyle="danger" className="" onClick={this.deleteParam.bind(this,header,'headers')}>X</Button></ButtonToolbar>
          </Col>
          &nbsp;
        </FormGroup>
      )
      }

      var attributes=[];
      for(var attribute in this.rest_client_store.selected_rest_options.attributes){
       attributes.push(
          <FormGroup>
          <Col sm={5}>
          <FormControl type="text" placeholder="" name={attribute} value={this.rest_client_store.selected_rest_options.attributes[attribute].key} onInput={this.addHeaderValues.bind(this,'key','attributes')} />
          </Col>
          <Col sm={6}>
          <FormControl type="text" placeholder="" name={attribute} value={this.rest_client_store.selected_rest_options.attributes[attribute].value} onInput={this.addHeaderValues.bind(this,'value','attributes')} />
          </Col>
          <Col sm={1}>
          <ButtonToolbar><Button bsStyle="danger" className="" onClick={this.deleteParam.bind(this,attribute,'attributes')}>X</Button></ButtonToolbar>
          </Col>
          &nbsp;
        </FormGroup>
      )
      }


    var host_prop_field_names = [];
    var options = ['GET', 'POST','PUT','DELETE'];
    var headers_collection = [];

      headers_collection.push(<Col sm={6}>
            <FormGroup>
              <ControlLabel>Key</ControlLabel>
              <FormControl type="text"/>
            </FormGroup>
          </Col>);
      headers_collection.push(<Col sm={6}>
            <FormGroup>
              <ControlLabel>Value</ControlLabel>
              <FormControl type="text"/>
            </FormGroup>
          </Col>);

    const tabsInstance = (
  <Tab.Container id="tabs-with-dropdown" defaultActiveKey="3">
    <Row className="clearfix">
      <Col sm={12}>
        <Nav bsStyle="tabs">
          <NavDropdown eventKey="3" title={this.rest_client_store.selected_rest_options.auth_type} name="auth_type" value ={this.rest_client_store.selected_rest_options.auth_type} onSelect={this.selectauth.bind(this)}>
            <MenuItem eventKey="No Auth">No Auth</MenuItem>
            <MenuItem eventKey="Basic Auth">Basic Auth</MenuItem>
            <MenuItem eventKey="OAuth2.0">OAuth2.0</MenuItem>
          </NavDropdown>
          <NavItem eventKey="headers">
            Headers
          </NavItem>
          <NavItem eventKey="second" className="payloadTab" disabled={this.disablePayloadTab()}>
            Body
          </NavItem>
        </Nav>
      </Col>
      <Col sm={12}>
        <Tab.Content animation>
          <Tab.Pane eventKey="headers">
          <Col sm={11}></Col>
          <Col sm={1}>
            <ButtonToolbar><Button bsStyle="success" className="" onClick={this.addParam.bind(this,'headers')}>+</Button></ButtonToolbar>
          </Col>
          <Col sm={6}>
            <FormGroup>
              <ControlLabel>Key</ControlLabel>
            </FormGroup>
          </Col>
          <Col sm={6}>
            <FormGroup>
              <ControlLabel>Value</ControlLabel>
            </FormGroup>
          </Col>
           {headers_arr}
          </Tab.Pane>

          <Tab.Pane eventKey="No Auth">
            No Auth
          </Tab.Pane>
          <Tab.Pane eventKey="Basic Auth">
            <FormGroup>
              <ControlLabel>Username</ControlLabel>
              <FormControl type="text" placeholder="Enter Username" name="username" value={this.rest_client_store.selected_rest_options.basic_auth_details.username} onChange={this.basicAuth.bind(this)}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Password</ControlLabel>
              <FormControl type="text" placeholder="Enter Password" name="password" value={this.rest_client_store.selected_rest_options.basic_auth_details.password} onChange={this.basicAuth.bind(this)}/>
            </FormGroup>
          </Tab.Pane>

          <Tab.Pane eventKey="OAuth2.0">
            OAuth2.0
          </Tab.Pane>


          <div hidden={this.disablePayloadTab()}>
          <Tab.Pane eventKey="second">
            <FormGroup>
              <FormControl rows="6" componentClass="textarea" placeholder="" name="payload"/>
            </FormGroup>
          </Tab.Pane>
          </div>

        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>
);

    return (
      <Col xs={12} md={12}>
        <Thumbnail>
          <h3>Update Host Properties</h3>
          <form onSubmit={this.handleSubmit}>

          <FormGroup className="raio-btn-form-group">
          <Col xs={3}></Col><Col xs={6}>
              <div className="radio-btn-div ">
                <ControlLabel>Data Format:&nbsp;&nbsp; </ControlLabel>
                <Radio name="new_data_format" value="JSON" onChange={this.onChange.bind(this)} inline defaultChecked={true}>JSON</Radio>
                <Radio name="new_data_format" value="XML" onChange={this.onChange.bind(this)} inline>XML</Radio>
                <Radio name="new_data_format" value="CSV" onChange={this.onChange.bind(this)} inline>CSV</Radio>
              </div>
          </Col>
          <Col xs={3}></Col>
          </FormGroup>
          &nbsp;
          <Col xs={12}></Col>

            <FormGroup>
            <Col xs={1}>
              <ButtonToolbar>
                <DropdownButton bsStyle={'Default'.toLowerCase()} title={this.rest_client_store.selected_rest_options.method_type} name="method_type" value={this.rest_client_store.selected_rest_options.method_type} onSelect={this.selectItem.bind(this)} id='dropdown-basic'>
                  <MenuItem eventKey="GET" active>GET</MenuItem>
                  <MenuItem eventKey="POST">POST</MenuItem>
                  <MenuItem eventKey="PUT">PUT</MenuItem>
                  <MenuItem eventKey="DELETE">DELETE</MenuItem>
                </DropdownButton>
              </ButtonToolbar>
            </Col>
            </FormGroup>

            <FormGroup>
            <Col xs={10}>
                <FormControl type="text" placeholder="Enter URL" name="data_url" value={this.rest_client_store.selected_rest_options.data_url} onChange={this.onChange.bind(this)}/>
            </Col>
            </FormGroup>

            <FormGroup>
            <Col xs={1}>
                <ButtonToolbar><Button bsStyle="success" className="pull-right btnParam" onClick={this.addParam.bind(this,'query_params')}>Params</Button></ButtonToolbar>
            </Col>
            </FormGroup>
            <br></br><br></br>
            {attributes}

          <FormGroup>
          {tabsInstance}
          </FormGroup>
            <FormGroup>
              <p><Button bsStyle="warning" className="pull-right" onClick={this.handleSubmit.bind(this)}>Submit</Button></p>
            </FormGroup>
          </form>
        </Thumbnail>
      </Col>

    );
  }
}

RestClientThingEdit.propTypes = {
  store: React.PropTypes.object
};

export default RestClientThingEdit;
