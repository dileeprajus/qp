/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import AllFlexThings from './smart/Flex/all';
import FlexStore from '../stores/FlexStore';
import { Col } from 'react-bootstrap';
import Navigator from './smart/GenericComponents/navigator';
const flexstore = new FlexStore('FlexConfig');

@inject('breadcrumb_store', 'mapping_store', 'generic_master_store', 'modal_store')
@observer
class FlexThings extends React.Component {
  constructor(props) {
    super(props);
    this.flexstore = flexstore;
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.flexstore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.flexstore.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/Flex/' + this.props.generic_master_store.currentGroupName, groupName: this.props.generic_master_store.currentGroupName, groupType: this.props.generic_master_store.groupType };
    this.breadcrumb_store.pushBreadCrumbsItem();
  }
  render() {
    return (
      <div>
       <div className="header-fixed">
            <Col xs={12} className="text-align">
              <Navigator history={this.props.history} action={'All'} type={'Mapping'} source={'Template'} generic_master_store={this.props.generic_master_store} />
              <h3 className="title-fixed">FlexPLM Endpoint <small>..</small></h3>
            </Col>
          </div>
        <AllFlexThings
          history={this.props.history} match={this.props.match}
          flexstore={this.flexstore} mapping_store={this.props.mapping_store} modal_store={this.props.modal_store}
        />
      </div>
    );
  }
}

FlexThings.propTypes = {
  store: React.PropTypes.object
};

export default FlexThings;
