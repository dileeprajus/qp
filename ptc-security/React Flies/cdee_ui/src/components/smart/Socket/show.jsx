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
import SocketStore from '../../../stores/SocketStore';
import SchemaBrowser from './schema_browser';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class SocketConfigShow extends React.Component {
  constructor(props) {
      super(props);
      const SockStr = new SocketStore(this.props.match.params.name);
      this.socketStore = SockStr;
      this.breadcrumb_store = this.props.breadcrumb_store;
  }


  componentWillMount() {
    this.socketStore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.socketStore.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.socketStore.setvalue('currentTenantID', this.props.generic_master_store.tenantID)
    if (this.props.match.params.name.indexOf('-') !== -1) {
      var brd_name = this.props.match.params.name.split('-')[1];
    }else{
      brd_name = this.props.match.params.name;
    }
    var PageName = 'Show:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.socketStore.GetBasicConfigInfo();
  }
  render() {
    return (
      <div>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Show'} type={'/Socket'} tempStore={this.socketStore} source={'Thing'} />
          </Row>
          <BasicConfigInfoTable table_info={this.socketStore.BasicConfigInfo} temp_store={this.socketStore} />
          <SchemaBrowser Name={this.props.match.params.name} socketStore={this.socketStore} />
        </Col>
      </div>
    );
  }
}

SocketConfigShow.propTypes = {
  store: React.PropTypes.object
};

export default SocketConfigShow;
