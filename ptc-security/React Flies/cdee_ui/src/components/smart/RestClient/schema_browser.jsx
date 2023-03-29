/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { ListGroup, ListGroupItem } from 'react-bootstrap'

@observer
class RestClientSchemaBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
    this.state = {
      selected_rest_client__object: '',
      selected_type_id: ''
    }

  }

  componentWillMount() {
  }

  renderTypeHierarchy(event) {
    this.rest_client_store.GetTypeHierarchy(event.target.name);
    this.setState({ selected_rest_client__object: event.target.name, selected_type_id: '' });
    event.preventDefault();
  }

  renderGetSchemaByTypeID(event) {
    this.setState({ selected_type_id: event.target.id });
    this.rest_client_store.GetSchemaByTypeID(this.state.selected_rest_client__object, event.target.id);
    event.preventDefault();
  }

  render() {
    var rest_client_object_list = [];

    this.rest_client_store.FlexObjects.map(f_o => {
      rest_client_object_list.push(
        <ListGroupItem key={f_o} name={f_o} href="#" onClick={this.renderTypeHierarchy.bind(this)}>
            {f_o}
        </ListGroupItem>
      );
    });

    var type_hirerarchy_list = [];
    for(var t_h in this.rest_client_store.TypeHierarchy){
      var t_i = this.rest_client_store.TypeHierarchy[t_h];
      type_hirerarchy_list.push(
        <ListGroupItem key={t_i} id={t_i} href="#" onClick={this.renderGetSchemaByTypeID.bind(this)}> {t_h} </ListGroupItem>
      );
    }


    return (
      <div>
        <div id="" className="col-md-3 col-sm-4">
          <h4>FlexObjects</h4>
          <ListGroup>
              {rest_client_object_list}
          </ListGroup>
        </div>
        <div id="" className="col-md-3 col-sm-4">
          <h4>TypeHirerchy</h4>
          <ListGroup>
              {type_hirerarchy_list}
          </ListGroup>
        </div>
        <div id="" className="col-md-6 col-sm-4">
          <h4>Schema</h4>
        </div>
      </div>
    );
  }
}

RestClientSchemaBrowser.propTypes = {
    store: React.PropTypes.object
};

export default RestClientSchemaBrowser;
