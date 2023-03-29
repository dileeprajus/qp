/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import TransactionSummary from '../TransactionSummary/transaction_summary';
import RestClientStore from '../../../stores/RestClientStore';
import Navigator from '../GenericComponents/navigator';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class RestClientThingSummary extends React.Component {
  constructor(props) {
    super(props);
    const RtClStr = new RestClientStore(this.props.match.params.name);
    this.rest_client_store = RtClStr;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.generic_master_store = this.props.generic_master_store;
  }

  componentWillMount() {
    if (this.props.match.params.name.indexOf('-') !== -1) {
        var brd_name = this.props.match.params.name.split('-')[1];
    }else{
        brd_name = this.props.match.params.name;
    }
    var PageName = 'Summary:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.rest_client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.rest_client_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.rest_client_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    this.rest_client_store.GetBasicConfigInfo();
  }

  render() {
    return (
      <div>
        <div>
          <Navigator history={this.props.history} action={'Transactions'} type={'/RestClient'} tempStore={this.rest_client_store} source={'Thing'} />
        </div>
        <div className="summury-alignment">
          <TransactionSummary temp_store={this.rest_client_store} generic_master_store={this.generic_master_store}/>
        </div>
      </div>
    );
  }
}

RestClientThingSummary.propTypes = {
  store: React.PropTypes.object
};

export default RestClientThingSummary;
