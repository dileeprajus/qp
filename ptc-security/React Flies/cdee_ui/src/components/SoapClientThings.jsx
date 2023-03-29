/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import AllSoapClientThings from './smart/SoapClient/all';
import { Row, Col } from 'react-bootstrap';
import SoapClientStore from '../stores/SoapClientStore';
import Navigator from './smart/GenericComponents/navigator';
const soap_client_store = new SoapClientStore('SoapConfig');

@inject('breadcrumb_store', 'mapping_store', 'generic_master_store','modal_store')
@observer
class SoapClientThings extends React.Component {
  constructor(props) {
    super(props);
    this.soap_client_store = soap_client_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.soap_client_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    var PageName = 'ViewDetails:' + this.props.generic_master_store.currentGroupName;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: '/SoapClient/'+this.props.generic_master_store.currentGroupName, groupName: this.props.generic_master_store.currentGroupName, groupType: this.props.generic_master_store.groupType };
    this.breadcrumb_store.pushBreadCrumbsItem();
  }
  render() {
    return (
    <div>
    <Row>
          <div className="header-fixed">
            <Col xs={12} className="text-align">
              <Navigator history={this.props.history} action={'All'} type={'Mapping'} source={'Template'} generic_master_store={this.props.generic_master_store} />
              <h3 className="title-fixed">Soap Configuration <small>..</small></h3>
            </Col>
          </div>
      <div>
        <AllSoapClientThings match={this.props.match} soap_client_store={this.soap_client_store} history={this.props.history} />
      {this.props.children}
      </div>
      </Row>
      </div>
    );
  }
}

SoapClientThings.propTypes = {
  store: React.PropTypes.object
};

export default SoapClientThings;
