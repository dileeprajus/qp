
/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import TransactionSummary from '../TransactionSummary/transaction_summary';
import GooglePubSubClientStore from '../../../stores/GooglePubSubClientStore';
import Navigator from '../GenericComponents/navigator';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class GooglePubSubConfigSummary  extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    const GooglePubSubStr = new GooglePubSubClientStore(this.props.match.params.name);
    this.googlePubSubstore = GooglePubSubStr;
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.googlePubSubstore.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    if (this.props.match.params.name.indexOf('-') !== -1) {
      var brd_name = this.props.match.params.name.split('-')[1];
    }else{
      brd_name = this.props.match.params.name;
    }
    var PageName = 'Summary:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.googlePubSubstore.GetBasicConfigInfo();
  }

  render() {
    return (
      <div>
        <div>
        <Navigator history={this.props.history} action={'Transactions'} type={'/GooglePubSub'} tempStore={this.googlePubSubstore} source={'Thing'} />
        </div>
        <div className="summury-alignment">
        <TransactionSummary temp_store={this.googlePubSubstore} generic_master_store={this.props.generic_master_store} />
        </div>
      </div>
    );
  }
}

GooglePubSubConfigSummary.propTypes = {
  store: React.PropTypes.object
};

export default GooglePubSubConfigSummary;
