
/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import TransactionSummary from '../TransactionSummary/transaction_summary';
import FTPClientStore from '../../../stores/FTPClientStore';
import Navigator from '../GenericComponents/navigator';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class FTPConfigSummary  extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    const FTPStr = new FTPClientStore(this.props.match.params.name);
    this.ftpstore = FTPStr;
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.ftpstore.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    if (this.props.match.params.name.indexOf('-') !== -1) {
      var brd_name = this.props.match.params.name.split('-')[1];
    }else{
      brd_name = this.props.match.params.name;
    }
    var PageName = 'Summary:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.ftpstore.GetBasicConfigInfo();
  }

  render() {
    return (
      <div>
        <div>
        <Navigator history={this.props.history} action={'Transactions'} type={'/FTP'} tempStore={this.ftpstore} source={'Thing'} />
        </div>
        <div className="summury-alignment">
        <TransactionSummary temp_store={this.ftpstore} generic_master_store={this.props.generic_master_store} />
        </div>
      </div>
    );
  }
}

FTPConfigSummary.propTypes = {
  store: React.PropTypes.object
};

export default FTPConfigSummary;
