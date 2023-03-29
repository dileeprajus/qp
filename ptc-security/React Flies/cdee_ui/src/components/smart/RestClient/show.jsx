/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Row, Tabs, Tab } from 'react-bootstrap'
import BasicThingInfoTable from '../../static/layout/basicinfotable';
import CodeMirror from 'react-codemirror';
import RestClientStore from '../../../stores/RestClientStore';
import Navigator from '../GenericComponents/navigator';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class RestClientThingShow extends React.Component {
  constructor(props) {
    super(props);
    const RtClStr = new RestClientStore(this.props.match.params.name);
    this.rest_client_store = RtClStr;
    this.breadcrumb_store = this.props.breadcrumb_store;

  }

  componentWillMount() {
    this.rest_client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.rest_client_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.rest_client_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    if (this.props.match.params.name.indexOf('-') !== -1) {
        var brd_name = this.props.match.params.name.split('-')[1];
    }else{
        brd_name = this.props.match.params.name;
    }
    var PageName = 'Show:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.rest_client_store.GetBasicConfigInfo();
    this.rest_client_store.GetConfigJson;
  }
  tabsSelection() {

  }
  render() {
    var codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    return (
      <div>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Show'} type={'/RestClient'} tempStore={this.rest_client_store} source={'Thing'} />
          </Row>
            <BasicThingInfoTable table_info={this.rest_client_store.BasicConfigInfo} temp_store={this.rest_client_store} />
          <Row>
            <Tabs defaultActiveKey={1} id="uncontrolled-flex-edit-tab-example">
            <Tab eventKey={1} tabClassName="arrowshapetab" title="ConfigJson">
              <CodeMirror id="json-pretty" value={JSON.stringify(this.rest_client_store.configJson, null, 2)} options={codeOptions} />
            </Tab>
          </Tabs>
          </Row>
        </Col>
      </div>
    );
  }
}

RestClientThingShow.propTypes = {
  store: React.PropTypes.object
};

export default RestClientThingShow;
