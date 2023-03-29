/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Row, Tabs, Tab } from 'react-bootstrap';
import GenericStatusMessage from '../GenericComponents/generic_status_component';
import CodeMirror from 'react-codemirror';

@observer
class SchemaBrowser extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.dbStore = this.props.dbStore;
    this.state = {
    };
  }

  componentWillMount() {
    this.dbStore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.dbStore.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.dbStore.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
  }
  render() {
    const codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    var schema = {}; //changes for bug 272
    if (this.dbStore.BasicConfigInfo) {
      if (this.dbStore.currentGroupType === 'source') {
        if (this.dbStore.BasicConfigInfo.outputSchema) {
          schema = this.dbStore.BasicConfigInfo.outputSchema;
        }
      } else if (this.dbStore.currentGroupType === 'target') {
        if (this.dbStore.BasicConfigInfo.inputSchema) {
          schema = this.dbStore.BasicConfigInfo.inputSchema;
        }
      }
    }
    return (
      <Row>
        <Tabs defaultActiveKey={this.state.activetab} id="uncontrolled-flex-tab-example">
          <Tab eventKey={1} tabClassName="arrowshapetab" title="Schema">
            <div hidden={Object.keys(schema).length === 0}>
              <CodeMirror id="SchemaJson-pretty" value={JSON.stringify(schema, null, 2)} options={codeOptions} />
            </div>
            <div hidden={!(Object.keys(schema).length === 0)}>
              <GenericStatusMessage statusMsg={'Please Fetch Schema in Edit Screen'} />
            </div>
          </Tab>
          <Tab eventKey={2} tabClassName="arrowshapetab" title="ConfigJson">
            <div>
              <CodeMirror id="ConfigJson-pretty" value={JSON.stringify(this.dbStore.configJson ? this.dbStore.configJson : {}, null, 2)} options={codeOptions} />
            </div>
          </Tab>
        </Tabs>
      </Row>
    );
  }
}

SchemaBrowser.propTypes = {
  store: React.PropTypes.object
};

export default SchemaBrowser;
