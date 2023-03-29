/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import CodeMirror from 'react-codemirror';

@observer
class RenderStaticSchemaJson extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  render() {
    const CodeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true,
      lineWrapping: true
    };
    return (
      <div>
        <h4>Attribute Map Conf </h4>
        <CodeMirror
          key="SCHEMA_MAP_JSON" id="mappingConfPretty"
          value={JSON.stringify(this.props.mapping_schema_json, null, 2)}
          options={CodeOptions}
        />
        <h4>Attribute MapStore </h4>
        <CodeMirror
          key="MAPSTORE_CONF_JSON" id="configJsonPretty"
          value={JSON.stringify(this.props.mapping_store.configJson, null, 2)}
          options={CodeOptions}
        />
        <h4>Host Schema </h4>
        <CodeMirror
          key="HOST_SCHEMA" id="hostSchemaPretty"
          value={JSON.stringify(this.props.host_schema_json, null, 2)}
          options={CodeOptions}
        />
        <h4>Client Schema </h4>
        <CodeMirror
          key="CLIENT_SCHEMA" id="clientSchemaPretty"
          value={JSON.stringify(this.props.client_schema_json, null, 2)}
          options={CodeOptions}
        />
      </div>
    );
  }
}

RenderStaticSchemaJson.propTypes = {
  store: React.PropTypes.object
};

export default RenderStaticSchemaJson;
