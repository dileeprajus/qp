/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

@observer
class SoapClientSchemaBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.soap_client_store = this.props.soap_client_store;
    this.state = {
      selected_soap_client__object: '',
      selected_type_id: ''
    };
  }

  componentWillMount() {
  }

  renderTypeHierarchy(event) {
    this.soap_client_store.GetTypeHierarchy(event.target.name);
    this.setState({ selected_soap_client__object: event.target.name, selected_type_id: '' });
    event.preventDefault();
  }

  renderGetSchemaByTypeID(event) {
    this.setState({ selected_type_id: event.target.id });
    this.soap_client_store.GetSchemaByTypeID(this.state.selected_soap_client__object, event.target.id);
    event.preventDefault();
  }

  render() {
    var soap_client_object_list = [];

    this.soap_client_store.FlexObjects.map(f_o => {
      soap_client_object_list.push(
        <ListGroupItem
          key={f_o} name={f_o} href="#" onClick={this.renderTypeHierarchy.bind(this)}
        >{f_o} </ListGroupItem>
      );
    })

    var type_hirerarchy_list = [];
    for (var t_h in this.soap_client_store.TypeHierarchy) {
      var t_i = this.soap_client_store.TypeHierarchy[t_h];
      type_hirerarchy_list.push(
        <ListGroupItem
          key={t_i} id={t_i} href="#" onClick={this.renderGetSchemaByTypeID.bind(this)}
        > {t_h} </ListGroupItem>
      );
    }

    return (
      <div>
        <div id="" className="col-md-3 col-sm-4">
          <h4>FlexObjects</h4>
          <ListGroup>{soap_client_object_list}</ListGroup>
        </div>
        <div id="" className="col-md-3 col-sm-4">
          <h4>TypeHirerchy</h4>
          <ListGroup>{type_hirerarchy_list}</ListGroup>
        </div>
        <div id="" className="col-md-6 col-sm-4">
          <h4>Schema</h4>
        </div>
      </div>
    );
  }
}

SoapClientSchemaBrowser.propTypes = {
  store: React.PropTypes.object
};

export default SoapClientSchemaBrowser;
