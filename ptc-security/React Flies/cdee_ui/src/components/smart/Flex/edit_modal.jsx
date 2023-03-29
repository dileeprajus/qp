/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Thumbnail, Button, FormGroup,FormControl,ControlLabel } from 'react-bootstrap';
import FlexStore from '../../../stores/FlexStore';
import ModalInstance from '../../static/layout/modalinstance';

@inject('breadcrumb_store', 'modal_store')
@observer
class EditModal extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.flexstore = new FlexStore(this.props.thing_name);
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.state = {
      show: false,
      disable_modal_tabs: true,
      show_new_thing_form: true,
      service_name: '',
      custom_path: ''
    };
  }

  componentWillMount() {
    this.flexstore.GetHostProperties;
  }

  onChange(event) {
    var temp_host_prop = this.flexstore.HostProperties;
       // modify temporarily to update HostProperties json on change
    temp_host_prop[event.target.name] = event.target.value;
    this.flexstore.setvalue('HostProperties', temp_host_prop);
  }
  enable_modal_tabs() {
    this.setState({ disable_modal_tabs: false, show_new_thing_form: false });
  }

  handleSubmit(event) {
    this.setState({ service_name: 'SetHostProperties', custom_path: '/Flex/Edit/' });
    this.modal_store.modal.modal_title = 'Update ' + this.flexstore.name + ' Config';
    this.flexstore.SetHostProperties(this.flexstore.name);
    this.modal_store.modal.notification = true;
    this.props.history.push('/Flex/Edit/'+this.flexstore.name);
    event.preventDefault();
  }

  render() {
    var hostPropFieldNames = [];
    var hostProps = {};
    if (this.flexstore.HostProperties) {
      hostProps = {
        hostname: this.flexstore.HostProperties.hostname,
        midpoint: this.flexstore.HostProperties.midpoint,
        username: this.flexstore.HostProperties.username,
        password: this.flexstore.HostProperties.password
      };
    }
    for (var attr in hostProps) {
      hostPropFieldNames.push(
        <FormGroup key={attr}>
          <ControlLabel>{attr}</ControlLabel>
          <FormControl
            type="text" placeholder="" name={attr} value={hostProps[attr]}
            onChange={this.onChange.bind(this)}
          />
        </FormGroup>
      );
    }
    return (
      <Col>
        <Thumbnail >
          <form onSubmit={this.handleSubmit}>
              {hostPropFieldNames}
            <FormGroup>
              <p><Button
                bsStyle="warning" className="pull-right"
                onClick={this.handleSubmit.bind(this)}
              >Submit</Button></p>
            </FormGroup>
            &nbsp;
          </form>
          &nbsp;
        </Thumbnail>
        <ModalInstance
          custom_store={this.flexstore} custom_path={this.state.custom_path}
          custom_history={this.props.history} service_name={this.state.service_name}
        />
      </Col>
    );
  }
}

EditModal.propTypes = {
  store: React.PropTypes.object
};

export default EditModal;
