/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Tabs, Tab } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import { getStore } from '../../../../lib/MappingLoggic';
import getConvertedOutput  from '../../../../lib/getConvertedOutput';
import ShowSelectedFlexTypeHierarchy  from './show_selected_flex_obj';
import mobx from 'mobx';

@observer
class SchemaBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.mapping_store = this.props.mapping_store;
    this.mappingConfigJson = this.mapping_store.configJson;
    this.sourcestore = getStore(this.mappingConfigJson.SourceConfig.StoreName, this.mappingConfigJson.SourceConfig.Name);
    this.destinationstore = getStore(this.mappingConfigJson.DestinationConfig.StoreName, this.mappingConfigJson.DestinationConfig.Name);

  }

  componentWillMount() {
    if(this.mappingConfigJson.DestinationConfig.StoreName !== 'FlexStore'){
      this.destinationstore.getInputData();
    }
    if(this.mappingConfigJson.SourceConfig.StoreName !== 'FlexStore'){
      this.sourcestore.getInputData();
    }
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
      var current_showing_list = 'Loading ...';
      var conv_output = '';
      var d2sComponent = '';
      if (this.mappingConfigJson.DestinationConfig.StoreName === 'FlexStore') {
        d2sComponent = (<ShowSelectedFlexTypeHierarchy key={'destination_source_input'} flexstore={this.destinationstore} mapping_store={this.mapping_store} thing_side="DestinationConfig" />);
      } else {
        conv_output = (
          <CodeMirror
            id="destinationConvDataPretty" value={JSON.stringify(getConvertedOutput(mobx.toJS(this.props.mapping_store.configJson), 'destination', mobx.toJS(this.destinationstore.inputData)), null, 2)}
            options={CodeOptions}
          />
        );
        d2sComponent = (
          <div id="" className="col-md-12 col-sm-12">
            <div id="" className="col-md-6 col-sm-6">
              <h4>Input</h4>
              <CodeMirror
                id="destinationDataPretty" value={JSON.stringify(this.destinationstore.inputData, null, 2)}
                options={CodeOptions}
              />
            </div>
            <div id="" className="col-md-6 col-sm-6">
              <h4>Output</h4>
              {conv_output}
            </div>
          </div>
        );
      }

    var s2dComponent = '';
    if (this.mappingConfigJson.SourceConfig.StoreName === 'FlexStore') {
      s2dComponent=( <ShowSelectedFlexTypeHierarchy flexstore={this.sourcestore} mapping_store={this.mapping_store} thing_side="SourceConfig"/>);
    } else{
      conv_output = (
        <CodeMirror
          id="Destination_source_Output_Pretty" value={JSON.stringify(getConvertedOutput(mobx.toJS(this.props.mapping_store.configJson), 'source', mobx.toJS(this.sourcestore.inputData)), null, 2)}
          options={CodeOptions}
        />
      );
      s2dComponent = (
        <div id="" className="col-md-12 col-sm-12">
          <div id="" className="col-md-6 col-sm-6">
            <h4>Input</h4>
            <CodeMirror
              id="inputDataPretty" value={JSON.stringify(this.sourcestore.inputData, null, 2)}
              options={CodeOptions}
            />
          </div>
          <div id="" className="col-md-6 col-sm-6">
            <h4>Output</h4>
            {conv_output}
          </div>
        </div>
      );
    }

    current_showing_list = (
      <Tabs defaultActiveKey={1} id="uncontrolled-map-data-conversion-tab-example">
        <Tab eventKey={1} title="Source To Destination">
          {s2dComponent}
        </Tab>

        <Tab eventKey={2} title="Destination To Source">
            {d2sComponent}
        </Tab>

        <Tab eventKey={3} title="Schema Map">
          <CodeMirror
            id="schemaMapDataPretty" value={JSON.stringify(this.mappingConfigJson, null, 2)}
            options={CodeOptions}
          />
        </Tab>

        <Tab eventKey={4} title="Host Schema">
          <CodeMirror
            id="schemaMapSourceDataPretty" value={JSON.stringify(this.mappingConfigJson['SourceConfig'], null, 2)}
            options={CodeOptions}
          />
        </Tab>

        <Tab eventKey={5} title="Client Schema">
          <CodeMirror
            id="schemaMapDestinationDataPretty" value={JSON.stringify(this.mappingConfigJson['DestinationConfig'], null, 2)}
            options={CodeOptions}
          />
        </Tab>
      </Tabs>
    );
    return (
      <div>
      {current_showing_list}
      </div>
    );
  }
}

SchemaBrowser.propTypes = {
  store: React.PropTypes.object
};

export default SchemaBrowser;
