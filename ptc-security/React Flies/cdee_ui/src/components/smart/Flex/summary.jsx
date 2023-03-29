/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import TransactionSummary from '../TransactionSummary/transaction_summary';
import Navigator from '../GenericComponents/navigator';

import FlexStore from '../../../stores/FlexStore';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class FlexThingSummary extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    const FlxStr = new FlexStore(this.props.match.params.name);
    this.flexstore = FlxStr;
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
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.flexstore.GetBasicConfigInfo;
  }

  render() {
    return (
      <div>
        <div>
          <Navigator history={this.props.history} action={'Transactions'} type={'/Flex'} tempStore={this.flexstore} source={'Thing'}/>
        </div>
        <div className="summury-alignment">
          <TransactionSummary temp_store={this.flexstore} generic_master_store={this.props.generic_master_store}/>
       </div>
      </div>
    );
  }
}

FlexThingSummary.propTypes = {
  store: React.PropTypes.object
};

export default FlexThingSummary;
