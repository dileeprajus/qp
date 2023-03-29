/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col } from 'react-bootstrap';
import StaticSchema from './staticSchema';
import withDragDropContext from '../../../../../lib/withDragDropContext';
import MappingSpec from './mappingSpec';


@inject('breadcrumb_store', 'generic_master_store')
@observer
class MappingConfig extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.state = {
      searchQuery: null,
      mappingSpec: [],
      joltSpec: [],
      newMapContainer: null
    };
  }


  componentWillMount() {
  }
  saveMappingSpec(SpecJson) {
    this.props.mappingStore.SetPropValues({ SpecJson: { Spec: SpecJson } });
  }

  render() {
    let sourceTree = 'Loading...';
    let targetTree = 'Loading...';
    let mappingComponent = 'Loading...';
    const headingStyle = {
      marginTop: '5px',
      marginBottom: '5px',
      fontSize: '22px',
      fontWeight: 300
    };

    let source_empty = (Object.keys(JSON.parse(JSON.stringify(this.props.mappingStore.sourceSchema))).length === 0 && JSON.parse(JSON.stringify(this.props.mappingStore.sourceSchema)).constructor === Object)
    let target_empty = (Object.keys(JSON.parse(JSON.stringify(this.props.mappingStore.targetSchema))).length === 0 && JSON.parse(JSON.stringify(this.props.mappingStore.targetSchema)).constructor === Object)

    if (!source_empty) {
      sourceTree = [<StaticSchema key="SourceSchema" schema={this.props.mappingStore.sourceSchema } whichSide={'source'} master={this} />];
    }
    if (!target_empty) {
      targetTree = [<StaticSchema key="TargetSchema" schema={this.props.mappingStore.targetSchema } whichSide={'target'} master={this} />];
    }
    if (!source_empty && !target_empty) {
      mappingComponent = [<MappingSpec key="MappingSpec" saveMappingSpec={this.saveMappingSpec.bind(this)} master={this} sourceSchema={this.props.mappingStore.sourceSchema} targetSchema={this.props.mappingStore.targetSchema} />];
      var sourceObjName = '';// eslint-disable-line no-unused-vars
      if(this.props.mappingStore.configJson.SourceConfig.Type==='Flex'){
        sourceObjName = this.props.mappingStore.sourceSchema.schema.basicDetails.rootObjectName;
      }

    }
    return (
      <div>
        <Row>
        </Row>
        <Row>
          <Col key="Source" xs={3} sm={3} md={3} lg={3}>
            <h5 style={{ ...headingStyle }}>{this.props.mappingStore.configJson.SourceConfig.Name || 'Source'} - Schema</h5>
            {sourceTree}
          </Col>
          <Col key="Target" xs={6} sm={6} md={6} lg={6}>
            <h5 style={{ ...headingStyle, textAlign: 'center' }}>MappingSpec</h5>
            {mappingComponent}
          </Col>
          <Col key="Mapping" xs={3} sm={3} md={3} lg={3}>
            <h5 style={{ ...headingStyle }}>{this.props.mappingStore.configJson.TargetConfig.Name || 'Target'} - Schema</h5>
            {targetTree}
          </Col>
        </Row>
      </div>
    );
  }
}

MappingConfig.propTypes = {
  store: React.PropTypes.object
};

export default withDragDropContext(MappingConfig);
