/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import TransactionSummary from '../TransactionSummary/transaction_summary';
import SoapClientStore from '../../../stores/SoapClientStore';
import Navigator from '../GenericComponents/navigator';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class SoapClientThingSummary extends React.Component {
  constructor(props) {
    super(props);
    const SpClStr = new SoapClientStore(this.props.match.params.name);
    this.soap_client_store = SpClStr;
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    if (this.props.match.params.name.indexOf('-') !== -1) {
        var brd_name = this.props.match.params.name.split('-')[1];
    }else{
        brd_name = this.props.match.params.name;
    }
    var PageName = 'Summary:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.soap_client_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID ? this.props.generic_master_store.tenantID: '');
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.soap_client_store.GetBasicConfigInfo();
  }

  render() {
    return (
      <div>
        <div>
          <Navigator history={this.props.history} action={'Transactions'} type={'/SoapClient'} tempStore={this.soap_client_store} source={'Thing'}/>
        </div>
        <div className="summury-alignment">
          <TransactionSummary temp_store={this.soap_client_store} generic_master_store={this.props.generic_master_store} />
        </div>
      </div>
    );
  }
}

SoapClientThingSummary.propTypes = {
  store: React.PropTypes.object
};

export default SoapClientThingSummary;
