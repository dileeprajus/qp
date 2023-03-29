/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tabs, Tab, Row, Col } from 'react-bootstrap';
import BasicThingInfoTable from '../../static/layout/basicinfotable';
import Navigator from '../GenericComponents/navigator';
import CodeMirror from 'react-codemirror';
import GenericStatusMessage from '../GenericComponents/generic_status_component';


import SoapClientStore from '../../../stores/SoapClientStore';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class SoapClientThingShow extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    const SpClStr = new SoapClientStore(this.props.match.params.name);
    this.soap_client_store = SpClStr;
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.soap_client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.soap_client_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.soap_client_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID ? this.props.generic_master_store.tenantID: '');
    if (this.props.match.params.name.indexOf('-') !== -1) {
        var brd_name = this.props.match.params.name.split('-')[1];
    }else{
        brd_name = this.props.match.params.name;
    }
    var PageName = 'Show:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.soap_client_store.GetBasicConfigInfo();
  }

  render() {
    var codeJsonOptions = {
        lineNumbers: false,
        mode: 'javascript',
        theme: 'dracula',
        smartIndent: true,
        readOnly: true
    }
    var schema = {};
    if (this.soap_client_store.BasicConfigInfo) {
      if (this.soap_client_store.currentGroupType === 'source') {
        if (this.soap_client_store.BasicConfigInfo.outputSchema) {
          schema = this.soap_client_store.BasicConfigInfo.outputSchema;
        }
      } else if (this.soap_client_store.currentGroupType === 'target') {
        if (this.soap_client_store.BasicConfigInfo.inputSchema) {
          schema = this.soap_client_store.BasicConfigInfo.inputSchema;
        }
      }
    }
    return (
      <div>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Show'} type={'/SoapClient'} tempStore={this.soap_client_store} source={'Thing'}/>
          </Row>
          <BasicThingInfoTable table_info={this.soap_client_store.BasicConfigInfo} temp_store={this.soap_client_store} />
          <Tabs defaultActiveKey={1} id="uncontrolled-flex-edit-tab-example">
            <Tab eventKey={1} tabClassName="arrowshapetab" title="Schema">
              <div hidden={Object.keys(schema).length === 0}>
                <CodeMirror
                  value={JSON.stringify(schema, null, 2)}
                  options={codeJsonOptions}
                />
              </div>
              <div hidden={!(Object.keys(schema).length === 0)}>
                <GenericStatusMessage statusMsg={'No data for current selected service'} />
              </div>

            </Tab>
          </Tabs>
        </Col>
      </div>
    );
  }
}

SoapClientThingShow.propTypes = {
  store: React.PropTypes.object
};

export default SoapClientThingShow;
