/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { FormGroup, FormControl, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

@inject('modal_store', 'validation_store', 'generic_master_store')
@observer
class StaticFileClientNew extends React.Component {
  constructor(props) {
    super(props);
    this.modal_store = this.props.modal_store;
    this.v_store = this.props.validation_store;
    this.state = {
      show_err_msg: false,
      show_alert_msg: false,
      show_specialchar_err_msg: false
    };
  }

  componentWillMount() {
    this.props.static_file_client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    var thingExists = this.props.static_file_client_store.config_names.indexOf((this.props.static_file_client_store.new_config_name).toUpperCase()) === -1;
    if (!thingExists) {
      this.setState({ show_err_msg: true });
    }
    this.v_store.InitialState();
    this.props.static_file_client_store.getStaticFileConfigs;
  }
  onChange(event) {
    var tempEventText = event.target.value.replace(/^\s+|\s{3}$/gm,''); //added text filter for spaces for bug no. 343 from ProductOffice
    if (event.target.name === 'new_config_name') {
      var iChars = "!@#$%^&*()+=-[]\\\';,./ {}|\":_<>?";
    } else {
      var iChars = '';
    }
    for (var i = 0; i < event.target.value.length; i++) {
      if (iChars.indexOf(event.target.value.charAt(i)) != -1) {
        this.setState({ show_specialchar_err_msg: true });
        return false;
      }
    }
    this.props.static_file_client_store.setvalue(event.target.name, tempEventText);
    this.setState({ show_specialchar_err_msg: false });
    this.v_store.state.custom_store = this.props.static_file_client_store;
    this.v_store.StaticNewThingValidation('onchange');
    if (event.target.name === 'new_config_name') {
      var config_names = this.props.static_file_client_store.currentGroupName + '-' + tempEventText;
      if (this.props.static_file_client_store.config_names.indexOf(config_names.toUpperCase()) !== -1) {
        this.setState({ show_err_msg: true });
      } else this.setState({ show_err_msg: false });
      if (tempEventText.length <= 2) {
        this.v_store.state.custom_name = null;
      }
    }
    if (event.target.name === 'new_config_description') {
      if (tempEventText.length <= 2) {
        this.v_store.state.custom_description = null;
      }
    }
  }


  handleSubmit() {
    this.v_store.state.custom_store = this.props.static_file_client_store;
    const name = this.props.static_file_client_store.new_config_name.length;
    const description = this.props.static_file_client_store.new_config_description.length;
    if ((name > 1) && (description > 2)) {
        this.props.static_file_client_store.CreateConfig(this.props.generic_master_store, this.props.enable_modal_tabs.bind(this));
      } else {
        this.v_store.ValidateThingCreate('submit');
      }
  }
  showDelimeterInput() {
    if (this.props.static_file_client_store.new_data_format === 'CSV') {
      return false;
    } else {
      return true;
    }
  }


  render() {
    const tooltip = (
      <Tooltip id="tooltip"><strong>Create New StaticFileClientConfig...!</strong><br />Click this...</Tooltip>
    );
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={this.state.show_specialchar_err_msg || this.state.show_err_msg ? 'warning' : this.v_store.state.custom_name}>
            <FormControl type="text" placeholder="Name" name="new_config_name" value={this.props.static_file_client_store.new_config_name} onChange={this.onChange.bind(this)} />
            <FormControl.Feedback />
            <span hidden={!this.state.show_specialchar_err_msg} style={{ color: '#F4BA41' }}>Special Characters and Spaces are not allowed</span>
            <span hidden={!this.state.show_err_msg} style={{ color: '#F4BA41' }}>Config name already exists</span>
            <span hidden={!this.v_store.state.show_err_name_msg} style={{ color: '#DA4453' }}>Name required</span>
          </FormGroup>
          <FormGroup validationState={this.v_store.state.custom_description}>
            <FormControl componentClass="textarea" style={{ resize: 'none' }} placeholder="Description" name="new_config_description" value={this.props.static_file_client_store.new_config_description} onChange={this.onChange.bind(this)} />
            <FormControl.Feedback />
              <span hidden={!this.v_store.state.show_err_desc_msg} style={{ color: '#DA4453' }}>Description required</span>
          </FormGroup> 
          <OverlayTrigger placement="top" overlay={tooltip}>
            <Button bsStyle="primary" onClick={this.handleSubmit.bind(this)} block
                    disabled={this.state.show_err_msg || this.props.static_file_client_store.new_config_name.indexOf(' ') > -1 || this.props.static_file_client_store.new_config_name.length < 3 || this.props.static_file_client_store.new_config_description.length < 3}
            >Submit</Button>
          </OverlayTrigger>
        </form>
          &nbsp;
      </div>
    );
  }
}
StaticFileClientNew.propTypes = {
  store: React.PropTypes.object
};

export default StaticFileClientNew;
