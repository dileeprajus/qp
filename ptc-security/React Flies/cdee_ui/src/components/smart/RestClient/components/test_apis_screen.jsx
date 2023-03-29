/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import CodeMirror from 'react-codemirror';

@observer
class TestApisScreen extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
  }

  componentWillMount() {
  }

  updateData(event){
    this.rest_client_store.setvalue('TargetData', JSON.parse(event));
  }

  render() {
    const codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: true
    };
    const editableCodeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: false
    };
    var xmlCodeOptions = {
      lineNumbers: false,
      mode: 'xml',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    let api_test_json = 'Loading...';
    if (this.props.test_data) {
      if (this.props.data_format === 'JSON') {
        if (this.rest_client_store.currentGroupType === 'target') {
          api_test_json = (<CodeMirror
            value={JSON.stringify(this.rest_client_store.TargetData, null, 2)}
            options={editableCodeOptions}
            onChange={this.updateData.bind(this)}
          />)
        } else {
          api_test_json = (<CodeMirror id="api_test_json-pretty" value={JSON.stringify(this.props.test_data, null, 2)} options={codeOptions} />);
        }
      } else {
        if (JSON.stringify(this.props.test_data, null, 2) === '{}') {
          if (this.props.data_format === 'XML') {
            api_test_json = (<CodeMirror id="api_test_xml-pretty" value={String('<?xml version="1.0" encoding="UTF-8"?>')} options={xmlCodeOptions} />);
          } else if (this.props.data_format === 'CSV') {
            api_test_json = (<CodeMirror id="api_test_xml-pretty" value={String('[]')} options={xmlCodeOptions} />);
          }
        } else {
          api_test_json = (<CodeMirror id="api_test_xml-pretty" value={String(this.props.test_data)} options={xmlCodeOptions} />);
        }
      }
    }
    else{
      api_test_json = (<CodeMirror id="api_test_xml-pretty" value={String('Data Failed')} options={xmlCodeOptions} />);
    }

    return(
      <div>
        {api_test_json}
      </div>
    )
  }
}

TestApisScreen.propTypes = {
  store: React.PropTypes.object
};

export default TestApisScreen;
