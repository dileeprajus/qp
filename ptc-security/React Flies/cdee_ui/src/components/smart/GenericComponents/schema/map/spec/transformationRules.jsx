/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row } from 'react-bootstrap';
import { arrayMove } from 'react-sortable-hoc';
import TypeManagerStore from '../../../../../../stores/TypeManagerStore';
import ScriptFilters from '../../transformationRules/script_filters';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class transformationRules extends React.Component {
    constructor(props) {
        super(props);
        this.type_manager_store = new TypeManagerStore('TypeManagerConfig');
        this.generic_master_store = this.props.generic_master_store;
        if (this.props.currMapSpec.mappingConf === undefined) {
        }
        this.state = {
            items: ['Elem from API', 'Concat String', 'Camel Case' ],
            treeData: []
        }
    }

    componentWillMount() {
        //   CODE HERE
        this.type_manager_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
        this.type_manager_store.GetFilterScripts;
        this.type_manager_store.GetDataTypes;
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            items: arrayMove(this.state.items, oldIndex, newIndex)
        });
    };

    updateTreeData(data) {
      this.props.currMapSpec.mappingConf['TransformationRules'] = data
      var temp_config = this.props.masterComponent.props.mappingStore.configJson
      let overallMapSpec = this.props.masterComponent.props.mappingStore.configJson.mappingSpec
      overallMapSpec[this.props.currMapSpecIndex] = this.props.currMapSpec;
      temp_config['mappingSpec']=overallMapSpec
      this.props.masterComponent.props.mappingStore.setvalue('configJson', temp_config);
    }

    render() {
        return (
            <Row className="transformationRules">
                <ScriptFilters
                snode={this.props.currMapSpec.mappingConf}
                master={this}
                type_manager_store={this.type_manager_store}
                from="mapping"
                prop_key="TransformationRules"
                />
            </Row>
        );
    }
}

transformationRules.propTypes = {
    store: React.PropTypes.object
};

export default transformationRules;
