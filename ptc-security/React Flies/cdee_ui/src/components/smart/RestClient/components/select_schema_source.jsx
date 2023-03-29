/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import {Row, Col,Nav,NavItem,Tab} from 'react-bootstrap'
import TabPaneSchemaFromFile from './tab_pane_schema_from_file'
import TabPaneSchemaFromURL from './tab_pane_schema_from_url'

@observer
class SelectSchemaSource extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
  }

  componentWillMount() {
  }

  onSelect(event){
    this.rest_client_store.setvalue('schema_source', event);
  }


  render() {
    return(
     <Tab.Container id="schema_source" activeKey={this.rest_client_store.schema_source} onSelect={this.onSelect.bind(this)}>
    <Row className="clearfix">
      <Col xs={3}>
        <Nav bsStyle="pills" stacked>
          <NavItem eventKey="SchemaFromData">
            SchemaFromData
          </NavItem>
          <NavItem eventKey="SchemaFromURL">
            SchemaFromURL
          </NavItem>
          <NavItem eventKey="SchemaFromFile">
            SchemaFromFile
          </NavItem>
        </Nav>
      </Col>
      <Col xs={9}>
        <Tab.Content animation>
          <Tab.Pane eventKey="SchemaFromData">
            Schema will be fetched from above DATA URL
          </Tab.Pane>
          <Tab.Pane eventKey="SchemaFromURL">
            <TabPaneSchemaFromURL rest_client_store={this.rest_client_store} history={this.props.history} />
          </Tab.Pane>
          <Tab.Pane eventKey="SchemaFromFile">
            <TabPaneSchemaFromFile rest_client_store={this.rest_client_store} />
          </Tab.Pane>
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>
    )
  }
}

SelectSchemaSource.propTypes = {
  store: React.PropTypes.object
};

export default SelectSchemaSource;
