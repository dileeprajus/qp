/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col } from 'react-bootstrap';
import RestClientStore from '../../../stores/RestClientStore';
import MasterRestComponent from './components/master_rest_component';
import ModalInstance from '../../static/layout/modalinstance';

@inject('breadcrumb_store', 'modal_store')
@observer
class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = new RestClientStore(this.props.thing_name);
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.modal_store = this.props.modal_store;
    this.state = {
      show: false,
      disable_modal_tabs: true,
      show_new_thing_form: true
    };
  }

  componentWillMount() {
  }

  enable_modal_tabs() {
    this.setState({ disable_modal_tabs: false, show_new_thing_form: false });
  }

  render() {
    return (
      <Col>
        <MasterRestComponent
          rest_client_store={this.rest_client_store} sourceType=""
          history={this.props.history} thing_name={this.props.thing_name}
        />
        <ModalInstance
          custom_store={this.rest_client_store}
          service_name={this.rest_client_store.current_service_name}
          custom_path={this.rest_client_store.current_custom_path}
          custom_history={this.props.history}
        />
      </Col>
    );
  }
}

EditModal.propTypes = {
  store: React.PropTypes.object
};

export default EditModal;
