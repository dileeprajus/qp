/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tabs, Tab} from 'react-bootstrap';
import TransformationRules from './transformationRules';
import OptionalList from './optional_list';
import PlaceholderDetails from './placeholderDetails';
import RemoteAPIConfig from '../RemoteAPIConfig';
import CodeMirror from 'react-codemirror';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class EditMapSpec extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
  }

  componentWillMount() {
    //   CODE HERE
  }

  render() {
    let remoteAPIComponent = 'Loading...';
    var sourceObjName = ''
    if(this.props.masterComponent.props.mappingStore.configJson.SourceConfig.Type==='Flex'){
      sourceObjName = this.props.masterComponent.props.mappingStore.sourceSchema.schema.basicDetails.rootObjectName;
    }
    var n_schema = this.generic_master_store.getObj(this.props.masterComponent.props.mappingStore.sourceSchema.schema,'RequestVariables');
    remoteAPIComponent = (<RemoteAPIConfig key="RemoteAPIConfig" sourceObjName={sourceObjName} currMapSpec={this.props.currMapSpec} currMapSpecIndex={this.props.currMapSpecIndex} masterComponent={this.props.masterComponent} saveMappingSpec={this.props.saveMappingSpec} mappingStore={this.props.masterComponent.props.mappingStore} generic_store={this.generic_master_store} normalised_source_schema={n_schema}/>)
    const codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    return (
      <div>
        <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
          <Tab tabClassName="arrowshapetab" eventKey={1} title="Spec JSON">
            <CodeMirror id="json-pretty" value={JSON.stringify(this.props.currMapSpec, null, 2)} options={codeOptions} />
          </Tab>
          <Tab disabled={this.props.currMapSpec.source.title !== '<PLACEHOLDER>' && this.props.currMapSpec.target.title !== '<PLACEHOLDER>'} tabClassName="arrowshapetab" eventKey={2} title="Placeholder Details">
            <div hidden={this.props.currMapSpec.source.title !== '<PLACEHOLDER>'}>
              <PlaceholderDetails
                currMapSpec={this.props.currMapSpec}
                currMapSpecIndex={this.props.currMapSpecIndex}
                masterComponent={this.props.masterComponent}
                saveMappingSpec={this.props.saveMappingSpec}
                whichSide="source"
              />
            </div>
            <div hidden={this.props.currMapSpec.target.title !== '<PLACEHOLDER>'}>
              <PlaceholderDetails
                currMapSpec={this.props.currMapSpec}
                currMapSpecIndex={this.props.currMapSpecIndex}
                masterComponent={this.props.masterComponent}
                saveMappingSpec={this.props.saveMappingSpec}
                whichSide="target"
              />
            </div>
          </Tab>
          <Tab tabClassName="arrowshapetab" eventKey={3} title="Optional List">
            <OptionalList currMapSpec={this.props.currMapSpec} currMapSpecIndex={this.props.currMapSpecIndex} masterComponent={this.props.masterComponent} saveMappingSpec={this.props.saveMappingSpec} />
          </Tab>
          <Tab tabClassName="arrowshapetab" eventKey={4} title="Remote API">
            {remoteAPIComponent}
          </Tab>
          <Tab tabClassName="arrowshapetab transform-rule-tab" eventKey={5} title="Transformation Rules">
            <TransformationRules currMapSpec={this.props.currMapSpec} currMapSpecIndex={this.props.currMapSpecIndex} masterComponent={this.props.masterComponent} saveMappingSpec={this.props.saveMappingSpec} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

EditMapSpec.propTypes = {
  store: React.PropTypes.object
};

export default EditMapSpec;
