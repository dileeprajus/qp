/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import AllDataBaseConfigs from './smart/DataBase/all';
import DataBaseStore from '../stores/DataBaseStore';
const dbStore = new DataBaseStore('DataBaseConfig');

@inject('breadcrumb_store', 'mapping_store', 'generic_master_store', 'modal_store')
@observer
class DataBaseConfigs extends React.Component {
  constructor(props) {
    super(props);
    this.dbStore = dbStore;
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.dbStore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.dbStore.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/DataBase/'+this.props.generic_master_store.currentGroupName, groupName: this.props.generic_master_store.currentGroupName, groupType: this.props.generic_master_store.groupType };
    this.breadcrumb_store.pushBreadCrumbsItem();
  }
  render() {
    return (
      <div>
        <AllDataBaseConfigs
          history={this.props.history} match={this.props.match}
          dbStore={this.dbStore} mapping_store={this.props.mapping_store} modal_store={this.props.modal_store}
        />
      </div>
    );
  }
}

DataBaseConfigs.propTypes = {
  store: React.PropTypes.object
};

export default DataBaseConfigs;
