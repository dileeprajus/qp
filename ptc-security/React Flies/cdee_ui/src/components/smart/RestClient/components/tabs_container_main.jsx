/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {observer} from 'mobx-react';
import {Tab, Row, Col, Nav, NavDropdown, MenuItem, NavItem} from 'react-bootstrap'
import TabPaneHeaders from './tab_pane_headers';
import TabPaneBasicAuth from './tab_pane_basic_auth';
import TabPaneOAuth from './tab_pane_o_auth';
import TabPaneCustomAuth from './tab_pane_custom_auth';
import TabPanePayload from './tab_pane_payload';

@observer
class TabsContainerMain extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.state = {
      'payload_eventkey': 'RequestPayloadTab',
        selectedAuthType:'',
        activateTab:'',
        loadCustomAuth : false
    }
  }

  componentWillMount() {
      this.rest_client_store.setvalue('async_call_back', this.setAuthType.bind(this));
  }

    setAuthType(arg1){
        this.rest_client_store.setvalue(this.props.sourceType+'current_auth_type', arg1.hasOwnProperty('current_auth_type')?arg1.current_auth_type:'NoAuth');
        this.setState({selectedAuthType:arg1.hasOwnProperty('current_auth_type')?arg1.current_auth_type:'NoAuth'});
        this.setState({activateTab:arg1.hasOwnProperty('current_auth_type')?arg1.current_auth_type:'NoAuth'});
        this.setState({loadCustomAuth:true})
        this.rest_client_store.setvalue('async_call_back', null);
    }

  selectauth(event,type){
    this.setState({activateTab:event});
    if(type!=='N'){
        this.setState({selectedAuthType:event})
    }
    if(this.rest_client_store.rest_auth_types.indexOf(event)===-1){
      this.rest_client_store.setvalue(this.props.sourceType+'current_auth_type', this.state.selectedAuthType)
      }else {
      this.rest_client_store.setvalue(this.props.sourceType+'current_auth_type', event)
    }
  }

  disablePayloadTab(){
    if(this.props.method_type=='GET'){
      return true;
    }else{
      return false;
    }
  }

  getPayloadEvenKey(){
    if (this.props.method_type=='GET') {
      return 'RequestPayloadTab2';
    } else {
      return 'RequestPayloadTab';
    }
  }

  onSelect(){
    
  }

  render() {
    var auth_options_list = [];
    for(var i=0; i<this.rest_client_store.rest_auth_types.length; i++){
      auth_options_list.push(
        <MenuItem key={'auth_option_list_' + i} eventKey={this.rest_client_store.rest_auth_types[i]}>{this.rest_client_store.rest_auth_types[i]}</MenuItem>
      )
    }
    var customAuthComponent = 'Loading....';
    if(this.state.loadCustomAuth){
      customAuthComponent = (<TabPaneCustomAuth rest_client_store={this.rest_client_store} sourceType={this.props.sourceType} />)
    }

    return(

      <Tab.Container id="tabs-with-dropdown" onSelect={this.onSelect.bind(this)} activeKey={this.state.activateTab?this.state.activateTab:this.rest_client_store[this.props.sourceType+'current_auth_type']?this.rest_client_store[this.props.sourceType+'current_auth_type']:'auth_options_dropdown'} defaultActiveKey="auth_options_dropdown">

      <Row className="clearfix">
        <Col xs={10} xsOffset={1} sm={10} md={10} lg={10}>


        <div className="navtab">
          <Nav bsStyle="tabs">

            <NavDropdown eventKey="auth_options_dropdown" title={this.state.selectedAuthType} name="auth_type" value ={this.state.selectedAuthType} onSelect={this.selectauth.bind(this)}>
              {auth_options_list}
              </NavDropdown>
              <NavItem eventKey="RequestHeadersTab" onClick={this.selectauth.bind(this,'RequestHeadersTab','N')}>
                Headers
              </NavItem>
              <NavItem eventKey="RequestPayloadTab" className="payloadTab" disabled={this.disablePayloadTab()} onClick={this.selectauth.bind(this,'RequestPayloadTab','N')}>
                Body
              </NavItem>

          </Nav>
        </div>
        </Col>


        <Col sm={12}>
          <Tab.Content animation>
            <Tab.Pane eventKey="RequestHeadersTab">
              <TabPaneHeaders rest_client_store={this.rest_client_store} store_key={this.props.store_key} sourceType={this.props.sourceType}/>
            </Tab.Pane>

            <Tab.Pane eventKey="NoAuth">
            </Tab.Pane>

            <Tab.Pane eventKey="BasicAuth">
              <TabPaneBasicAuth rest_client_store={this.rest_client_store} sourceType={this.props.sourceType}/>
            </Tab.Pane>

            <Tab.Pane eventKey="OAuth2.0">
              <TabPaneOAuth rest_client_store={this.rest_client_store} sourceType={this.props.sourceType}/>
            </Tab.Pane>

            <Tab.Pane eventKey="CustomAuth">
              {customAuthComponent}
            </Tab.Pane>


            <Tab.Pane eventKey={this.getPayloadEvenKey()}>
              <TabPanePayload rest_client_store={this.rest_client_store} payload={this.props.payload} payload_option={this.props.payload_option}/>
            </Tab.Pane>


          </Tab.Content>
        </Col>
      </Row>
      </Tab.Container>
    )
  }
}

TabsContainerMain.propTypes = {
  store: React.PropTypes.object
};

export default TabsContainerMain;
