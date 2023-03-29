/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import AllRestClientThings from './smart/RestClient/all';
import { Col } from 'react-bootstrap';
import RestClientStore from '../stores/RestClientStore';
import Navigator from './smart/GenericComponents/navigator';
const rest_client_store = new RestClientStore('RestConfig');

@inject('breadcrumb_store', 'generic_master_store', 'modal_store')
@observer
class RestClientThings extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = rest_client_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.rest_client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.rest_client_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/RestClient/'+this.props.generic_master_store.currentGroupName, groupName: this.props.generic_master_store.currentGroupName, groupType: this.props.generic_master_store.groupType };
    this.breadcrumb_store.pushBreadCrumbsItem();
  }
  render() {
    return (
    <div>
     <div className="header-fixed">
            <Col xs={12} className="text-align">
              <Navigator history={this.props.history} action={'All'} type={'Mapping'} source={'Template'} generic_master_store={this.props.generic_master_store} />
              <h3 className="title-fixed">Rest Configuration <small>..</small></h3>
            </Col>
          </div>
       <AllRestClientThings match={this.props.match} rest_client_store={this.rest_client_store}
        history={this.props.history} modal_store={this.props.modal_store} />
      {this.props.children}
      </div>
    );
  }
}

RestClientThings.propTypes = {
  store: React.PropTypes.object
};

export default RestClientThings;
