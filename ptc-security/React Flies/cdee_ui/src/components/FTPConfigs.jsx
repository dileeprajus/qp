/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import AllFTPConfigs from './smart/FTP/all';
import FTPClientStore from '../stores/FTPClientStore';

@inject('breadcrumb_store', 'mapping_store', 'generic_master_store', 'modal_store')
@observer
class FTPConfigs extends React.Component {
  constructor(props) {
    super(props);
    this.FTPStore = new FTPClientStore('FTPConfig');
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.FTPStore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.FTPStore.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/FTP/'+this.props.generic_master_store.currentGroupName, groupName: this.props.generic_master_store.currentGroupName, groupType: this.props.generic_master_store.groupType };
    this.breadcrumb_store.pushBreadCrumbsItem();
  }
  render() {
    return (
      <div>
        <AllFTPConfigs
          mapping_store={this.props.mapping_store} history={this.props.history}
          match={this.props.match} FTPStore={this.FTPStore} modal_store={this.props.modal_store}
        />
        {this.props.children}
      </div>
    );
  }
}

FTPConfigs.propTypes = {
  store: React.PropTypes.object
};

export default FTPConfigs;
