/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Row, Col, ControlLabel, FormGroup, FormControl,InputGroup} from 'react-bootstrap';

@observer
class TabPaneBasicAuth extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.state = {showicon: ''};
  }

  componentWillMount() {
  }
  ShowHide(event) {
        if (event.target.className ==='fa fa-eye') {
          this.setState({ showicon: true });
        } else if (event.target.className ==='fa fa-eye-slash') {
          this.setState({ showicon: false });
        } else {}
  }

  basicAuth(event){
    var temp = this.rest_client_store[this.props.sourceType+'basic_auth_details'];
    temp[event.target.name] = event.target.value;
    this.rest_client_store.setvalue(this.props.sourceType+'basic_auth_details', temp);
  }


  render() {
    return(
     <div>
          <Row>
            <Col xs={6} xsOffset={3}>
        <FormGroup>
          <ControlLabel>Username</ControlLabel>
          <FormControl type="text" placeholder="Enter Username" name="username" value={this.rest_client_store[this.props.sourceType+'basic_auth_details']['username']} onChange={this.basicAuth.bind(this)}/>
          <ControlLabel>Password
        <InputGroup>
          <FormControl type={this.state.showicon ? 'text' : 'password'} placeholder="Enter Password" name="password" value={this.rest_client_store[this.props.sourceType+'basic_auth_details']['password']} onChange={this.basicAuth.bind(this)}
           style={{ marginBottom: '-1px' }}/>
           <InputGroup.Addon style={{ background: 'white', color: 'black' }}>
            <i className={this.state.showicon === true ? 'fa fa-eye-slash':'fa fa-eye'} aria-hidden="true" onClick={this.ShowHide.bind(this)}></i>
           </InputGroup.Addon>
        </InputGroup>
          </ControlLabel>
        </FormGroup>
        </Col>
        </Row>
      </div>
    )
  }
}

TabPaneBasicAuth.propTypes = {
  store: React.PropTypes.object
};

export default TabPaneBasicAuth;
