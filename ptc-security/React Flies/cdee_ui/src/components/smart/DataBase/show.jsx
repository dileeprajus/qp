/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';
import BasicConfigInfoTable from '../../static/layout/basicinfotable';
import Navigator from '../GenericComponents/navigator';

// import 'react-json-pretty';

import DataBaseStore from '../../../stores/DataBaseStore';
import SchemaBrowser from './schema_browser';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class DataBaseConfigShow extends React.Component {
  constructor(props) {
      super(props);
      // This is not creating new datasource
      const DBStr = new DataBaseStore(this.props.match.params.name);
      this.dbStore = DBStr;
      this.breadcrumb_store = this.props.breadcrumb_store;
  }


  componentWillMount() {
    this.dbStore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.dbStore.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.dbStore.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    if (this.props.match.params.name.indexOf('-') !== -1) {
      var brd_name = this.props.match.params.name.split('-')[1];
    }else{
      brd_name = this.props.match.params.name;
    }
    var PageName = 'Show:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.dbStore.GetBasicConfigInfo();
  }
  render() {
    return (
      <div>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Show'} type={'/DataBase'} tempStore={this.dbStore} source={'Thing'} />
          </Row>
          <BasicConfigInfoTable table_info={this.dbStore.BasicConfigInfo} temp_store={this.dbStore} />
          <SchemaBrowser Name={this.props.match.params.name} dbStore={this.dbStore} generic_master_store={this.props.generic_master_store} />
        </Col>
      </div>
    );
  }
}

DataBaseConfigShow.propTypes = {
  store: React.PropTypes.object
};

export default DataBaseConfigShow;
