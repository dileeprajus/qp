/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Table} from 'react-bootstrap'
import {observer } from 'mobx-react';
import {getParentObj} from '../../../../lib/MappingLoggic'

@observer
class StaticBasicDetails extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
      var hostParObj =  getParentObj(this.props.host_schema_json[this.props.mapping_schema_json.host.master_obj.typeName], this.props.mapping_schema_json.host_key);
      var clientParObj =  (getParentObj(this.props.client_schema_json[this.props.mapping_schema_json.client.master_obj.typeName], this.props.mapping_schema_json.client_key));

        return (
          <div>
            <h4>Attribute Map Conf </h4>
              <Table striped bordered condensed hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>Host</th>
                    <th>Client</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Hierarchy</th>
                    <td>{this.props.mapping_schema_json.host_key}</td>
                    <td>{this.props.mapping_schema_json.client_key}</td>
                  </tr>
                  <tr>
                    <th>Attribtue Name</th>
                    <td>{this.props.mapping_schema_json.host.attr_name}</td>
                    <td>{this.props.mapping_schema_json.client.attr_name}</td>
                  </tr>
                  <tr>
                    <th>Attribtue Type</th>
                    <td>{this.props.mapping_schema_json.host.attr_type}</td>
                    <td>{this.props.mapping_schema_json.client.attr_type}</td>
                  </tr>
                  <tr>
                    <th>DataSource Name</th>
                    <td>{this.props.mapping_schema_json.host.data_source_name}</td>
                    <td>{this.props.mapping_schema_json.client.data_source_name}</td>
                  </tr>
                  <tr>
                    <th>Display Name</th>
                    <td>{hostParObj['displayName']}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Required?</th>
                    <td>{hostParObj['required'] ? 'True' : ((hostParObj['required'] === false) ? 'False' : '--')}</td>
                    <td>{clientParObj['required'] ? 'True'  : ((clientParObj['required'] === false) ? 'False' : '--')}</td>
                  </tr>
                </tbody>
              </Table>
          </div>
        );
    }
}

StaticBasicDetails.propTypes = {
    store: React.PropTypes.object
};

export default StaticBasicDetails;
