/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import AllStaticFileClientThings from './smart/StaticFileClient/all';
import StaticFileClientStore from '../stores/StaticFileClientStore';
const static_file_client_store = new StaticFileClientStore('StaticFileConfig');

@inject('breadcrumb_store', 'mapping_store', 'generic_master_store', 'modal_store')
@observer
class StaticFileClientThings extends React.Component {
  constructor(props) {
    super(props);
    this.static_file_client_store = static_file_client_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.static_file_client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.static_file_client_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/StaticFileClient/'+this.props.generic_master_store.currentGroupName, groupName: this.props.generic_master_store.currentGroupName, groupType: this.props.generic_master_store.groupType };
    this.breadcrumb_store.pushBreadCrumbsItem();
  }
  render() {
    return (
      <div>
        <AllStaticFileClientThings
          mapping_store={this.props.mapping_store} history={this.props.history}
          match={this.props.match} static_file_client_store={this.static_file_client_store} modal_store={this.props.modal_store}
        />
        {this.props.children}
      </div>
    );
  }
}

StaticFileClientThings.propTypes = {
  store: React.PropTypes.object
};

export default StaticFileClientThings;
