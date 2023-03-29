/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import ModalInstance from '../../static/layout/modalinstance';
import { NotificationManager } from 'react-notifications';

@inject('modal_store', 'validation_store', 'generic_master_store', 'scheduler_store')
@observer
class SchedulerConfigNew extends React.Component {
  constructor(props) {
    super(props);
    this.modal_store = this.props.modal_store;
    this.v_store = this.props.validation_store;
    this.scheduler_store = this.props.scheduler_store;
    this.thing_store = this.props.thing_store;
    this.state = {
      show_err_msg: false,
      show_specialchar_err_msg: false
    };
  }

  componentWillMount() {
    this.scheduler_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.scheduler_store.setvalue('new_config_name', '');
    this.scheduler_store.setvalue('new_config_description', '');
    var thingExists = this.scheduler_store.config_names.indexOf((this.scheduler_store.new_config_name).toUpperCase()) === -1;
    if (!thingExists) {
      this.setState({ show_err_msg: true });
    }
    this.v_store.InitialState();
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
    this.scheduler_store.setvalue(event.target.name, tempEventText);
    this.setState({ show_specialchar_err_msg: false });
    this.v_store.state.custom_store = this.scheduler_store;
    this.v_store.ValidateThingCreate('onchange');
    if (event.target.name === 'new_config_name') {
      const config_names = tempEventText;
      if (this.scheduler_store.config_names.indexOf(config_names.toUpperCase()) !== -1) {
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
    this.v_store.state.custom_store = this.scheduler_store;
    const name = this.scheduler_store.new_config_name.length;
    const description = this.scheduler_store.new_config_description.length;
    if ((name > 1) && (description > 2)) {
      this.scheduler_store.CreateConfig(this.props.generic_master_store, this.props.enable_modal_tabs.bind(this), this.thing_store.name);
      NotificationManager.success('Created ' + this.scheduler_store.new_config_name+' Config Successfully', 'Success', 2000);
    } else {
      this.v_store.ValidateThingCreate('submit');
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup
            validationState={this.state.show_specialchar_err_msg || this.state.show_err_msg ? 'warning' : this.v_store.state.custom_name}>
            <FormControl
              type="text" placeholder="Name" name="new_config_name"
              value={this.scheduler_store.new_config_name}
              onChange={this.onChange.bind(this)}
            />
            <FormControl.Feedback />
            <span hidden={!this.state.show_specialchar_err_msg} style={{ color: '#F4BA41' }}>Special Characters and Spaces are not allowed</span>
            <span hidden={!this.state.show_err_msg}
                  style={{ color: '#F4BA41' }}>Config name already exists</span>
            <span hidden={!this.v_store.state.show_err_name_msg}
                  style={{ color: '#DA4453' }}>Name required</span>
          </FormGroup>
          <FormGroup validationState={this.v_store.state.custom_description}>
            <FormControl
              componentClass="textarea" style={{ resize: 'none' }} placeholder="Description" name="new_config_description"
              value={this.scheduler_store.new_config_description}
              onChange={this.onChange.bind(this)}
            />
            <FormControl.Feedback />
            <span hidden={!this.v_store.state.show_err_desc_msg} style={{color: '#DA4453'}}>Description required</span>
          </FormGroup>
        </form>
          <Button
            bsStyle="primary" onClick={this.handleSubmit.bind(this)} block
            disabled={this.state.show_err_msg || this.scheduler_store.new_config_name.indexOf(' ') > -1 || this.scheduler_store.new_config_name.length < 3 || this.scheduler_store.new_config_description.length < 3}>Submit</Button>
        <ModalInstance custom_store={this.scheduler_store} service_name="CreateConfig" />
      </div>
    );
  }
}
SchedulerConfigNew.propTypes = {
    store: React.PropTypes.object
};

export default SchedulerConfigNew;
