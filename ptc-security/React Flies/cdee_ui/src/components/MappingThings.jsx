/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col } from 'react-bootstrap';
import AllMappingThings from './smart/Mapping/all';
import AlertInstance from './static/layout/alertinstance';
import Navigator from './smart/GenericComponents/navigator';

@inject('mapping_store', 'breadcrumb_store', 'generic_master_store', 'modal_store')
@observer
class MappingThings extends React.Component {
  constructor(props) {
    super(props);
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.generic_master_store = this.props.generic_master_store;
  }

  componentWillMount() {
    this.props.mapping_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.props.mapping_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.props.mapping_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID ? this.props.generic_master_store.tenantID : this.props.mapping_store.currentTenantID);
    var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/Mapping/'+this.props.generic_master_store.currentGroupName, groupName: this.props.generic_master_store.currentGroupName, groupType: this.props.generic_master_store.groupType };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.props.generic_master_store.GetAllSourceConfigs;
    this.props.generic_master_store.GetAllTargetConfigs;
  }
  render() {
    return (
      <div>
        <Col xs={6} xsOffset={3}>
          <AlertInstance modal_store={this.props.modal_store} />
        </Col>
        <Row>
          <div className="header-fixed">
            <Col xs={12} className="text-align">
              <Navigator history={this.props.history} action={'All'} type={'Mapping'} source={'Template'} generic_master_store={this.props.generic_master_store} />
              <h3 className="title-fixed">Mapping Configuration <small>..</small></h3>
            </Col>
          </div>
          <div className="top-align">
            <AllMappingThings
              history={this.props.history} match={this.props.match}
              mapping_store={this.props.mapping_store}
              generic_master_store={this.props.generic_master_store}
            />
          </div>
        </Row>
      </div>
    );
  }
}

MappingThings.propTypes = {
  store: React.PropTypes.object
};

export default MappingThings;
