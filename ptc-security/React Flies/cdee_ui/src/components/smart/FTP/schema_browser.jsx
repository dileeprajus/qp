/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import CodeMirror from 'react-codemirror';
import { Col } from 'react-bootstrap';

@observer
class FTPClientSchemaBrowser extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.FTPClientStore = this.props.FTPClientStore;
    this.state = {
    };
  }

  componentWillMount() {
    this.FTPClientStore.GetSchema;
  }

  render() {
    const schemaCodeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      lineWrapping: true,
      //cursorBlinkRate: -1,
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    var tempSchema = '';
    tempSchema = JSON.stringify((this.static_file_client_store.currentGroupType === 'source') ? this.static_file_client_store.outputSchema : this.static_file_client_store.inputSchema, null, 2);
    return (
      <div>
        <Col id="SchemaCodemirrorPretty" className="col-md-6 col-sm-4">
          <CodeMirror id="SchemaJson-pretty" value={JSON.stringify((this.static_file_client_store.currentGroupType === 'source') ? this.static_file_client_store.outputSchema : this.static_file_client_store.inputSchema, null, 2)} options={schemaCodeOptions} />
        </Col>
      </div>
    );
  }
}

FTPClientSchemaBrowser.propTypes = {
  store: React.PropTypes.object
};

export default FTPClientSchemaBrowser;
