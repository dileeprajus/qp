/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col } from 'react-bootstrap';
import BasicThingInfoTable from '../../static/layout/basicinfotable';
import MappingStore from '../../../stores/MappingStore';
import Navigator from '../GenericComponents/navigator';


@inject('breadcrumb_store', 'generic_master_store', 'mapping_store')
@observer
class MappingThingShow extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.name) {
      this.mapping_store_name = this.props.name;
      this.mapping_store = new MappingStore(this.props.name);
    } else {
      this.mapping_store_name = this.props.match.params.name;
      this.mapping_store = new MappingStore(this.props.match.params.name);
    }
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.state = {
      show_table: ((this.props.show_table === false) ? false : true)
    }
  }

  componentWillMount() {
    this.mapping_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.mapping_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.mapping_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    if (this.props.mapping_store) {
      var PageName = 'Show:' + this.props.mapping_store.newConfigTitle;
      this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    }
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.mapping_store.GetConfigJson;
    this.mapping_store.GetBasicConfigInfo;
  }

  render() {
    var basicInfoTable = '';
    if (this.state.show_table === true) {
      basicInfoTable = (<BasicThingInfoTable table_info={this.mapping_store.BasicConfigInfo} temp_store={this.mapping_store}/>);
    }
    var renderSchemaBrowser = 'Page under construction.....';
    return (
      <div>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Show'} type={'/Mapping'} tempStore={this.mapping_store} source={'Thing'} />
          </Row>
          <div>
          {basicInfoTable}
          </div>
          {renderSchemaBrowser}
        </Col>
      </div>
    );
  }
}

MappingThingShow.propTypes = {
  store: React.PropTypes.object
};

export default MappingThingShow;
