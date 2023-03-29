/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Thumbnail, FormGroup, FormControl, InputGroup, Button, Grid, Row } from 'react-bootstrap';

@inject('routing', 'breadcrumb_store', 'generic_master_store')
@observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.state = {
      showicon: '',
      showWarningMsg: false,
    };
  }
  onChange(event) {
    this.generic_master_store[event.target.name] = event.target.value;
  }
  handleSubmit() {
    this.generic_master_store.setvalue('async_callback', this.navigateToDashboard.bind(this));
    this.generic_master_store.getTRCAppKey(this.generic_master_store.username, this.generic_master_store.password);
  }
  handleKeyPress(target) {
    if(target.key === 'Enter'){
      this.handleSubmit();
    }
  }
  
  showHide(event) {
    if (event.target.name === 'Hide') {
      this.setState({ showicon: true });
    } else if (event.target.name === 'Show') {
      this.setState({ showicon: false });
    } else {}
  }
  disableSubmitBtn() {
    if (this.generic_master_store.username === '' || this.generic_master_store.password === '') {
      return true;
    }
    return false;
  }
  navigateToDashboard(responseThis, response) {
    this.generic_master_store.setvalue('async_callback', null);
    if (responseThis.status === 200 && response !== '401 UNAUTHORIZED') {
      if (response.rows[0].KeyID) {
        this.generic_master_store.getUserGroup(this.generic_master_store.username);
        this.setState({ showWarningMsg: false });
        this.props.history.push('/Dashboard');
      }
    } else {
      this.setState({ showWarningMsg: true });
    }
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
              <Thumbnail className="loginContainer">
                <img className="loginIcon" src="https://s3.amazonaws.com/cdee/Images/PTC_Logo.png" alt="TRC"/>
                <h3 className="atlantis-header">TRC</h3>
                <span className="ieStudio">INTEGRATION STUDIO</span>
                <form onSubmit={this.handleSubmit}>
                  <FormGroup className="inputLogInForm" key="UserName">
                    <ControlLabel>UserName</ControlLabel>
                    <FormControl style={{fontSize:'17px'}}
                                 type="text" placeholder="UserName" name="username" value={this.generic_master_store.username}
                                 onChange={this.onChange.bind(this)}
                                 onKeyPress={this.handleKeyPress.bind(this)}
                    />
                  </FormGroup>
                  <FormGroup className="inputLogInForm">
                    <ControlLabel>Password</ControlLabel>
                    <InputGroup>
                      <FormControl
                        type={this.state.showicon ? 'text' : 'password'} placeholder="Password"
                        name="password" value={this.generic_master_store.password}
                        onChange={this.onChange.bind(this)}
                        style={{marginBottom: '-1px', fontSize:'17px'}}
                        onKeyPress={this.handleKeyPress.bind(this)}
                      />
                      <InputGroup.Addon style={{ background: 'white', paddingTop: '2px' }} >
                        <Button className="button-size" style={{ padding: '0', marginBottom: '-1px' }} name={this.state.showicon === true ? 'Show' : 'Hide'} bsStyle="link" onClick={this.showHide.bind(this)}>
                          {this.state.showicon === true ? 'Hide' : 'Show'}
                        </Button>
                      </InputGroup.Addon>
                    </InputGroup>
                  </FormGroup>
                  &nbsp;
                  <FormGroup>
                    <Button
                      bsStyle="info" block
                      disabled={this.disableSubmitBtn() || this.state.disabld_update_btn}
                      onClick={this.handleSubmit.bind(this)}
                    >Login</Button>
                  </FormGroup>
                  <span hidden={!this.state.showWarningMsg} style={{ color: '#F4BA41' }}>Given credentials are invalid. Please enter valid ones.</span>
                </form>
                &nbsp;
                <div className="powered-by-footer">
                  <div className="powered-by">POWERED BY</div>
                  <div className="powered-by-platform">
                    <div className="left">
                      <div className="float-left"><img src="https://s3.amazonaws.com/cdee/Images/ThingWorx_PTC_logo.png" alt="TRC"/></div>
                    </div>
                    <div className="right">
                      <div className="float-left"><img src="https://s3.amazonaws.com/cdee/Images/Quantela_Web_Logo.jpg" alt="TRC"/></div>
                    </div>
                  </div>
                </div>
              </Thumbnail>
          </Row>
        </Grid>
      </div>
    );
  }
}

Login.propTypes = {
  store: React.PropTypes.object
};

export default Login;
