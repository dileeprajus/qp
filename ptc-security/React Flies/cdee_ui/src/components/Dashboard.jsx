/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable, BACKEND */
import React from 'react';
import { Col, Row, Thumbnail, Tabs, Tab, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import HeadingFigures from './smart/Dashboard/heading_figures';
import MainChart from './smart/Dashboard/main_chart';
import SummaryTiles from './smart/Dashboard/summaryTiles';
import Navigator from './smart/GenericComponents/navigator';
import GenericReactTable from './static/layout/generic_react_table';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.generic_master_store = this.props.generic_master_store;
    this.generic_master_store.setvalue('name', 'GenericIEMasterConfig');
    this.state = {
      mappingsVal: this.props.generic_master_store.transactionInfo.Mappings
    };
  }
  componentWillMount() {
    this.generic_master_store.setvalue('groupType','generic');
    this.generic_master_store.getDashboardMetrics();
    this.breadcrumb_store.Bread_crumb_obj = { name: 'Dashboard', path: '' };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.generic_master_store.getTRCAuditData(this.generic_master_store.name,
      'Dashboard', 'generic');
    history.pushState(null, document.title, location.href);
    window.addEventListener('popstate', function (event)
    {
    history.pushState(null, document.title, location.href);
    });

  }

  setMapAndClientValues(internalThis) {
     internalThis.setState({
       mappingsVal: internalThis.props.generic_master_store.transactionInfo.Mappings });
  }

  render() {
    var transactionsAuditTab = '';
    var MCCData = '';
      transactionsAuditTab = (<Tab eventKey={3} title="Transactions Audit Table">
        <h1>Transactions Audit table</h1>
        <GenericReactTable
          tableType="TransactionAudit" tempStore={this.generic_master_store} type={'Dashboard'}
        />
      </Tab>);
    MCCData = (<Tab eventKey={4} title="Existing Mappings">
      <h1>Existing Mappings</h1>
      <GenericReactTable
        tableType="MCC" tempStore={this.generic_master_store} type={'Dashboard'}
      />
    </Tab>);
    return (
      <div>
        <div className="header-fixed">
          <Col xs={12} className="text-align">
            <Navigator history={this.props.history} action={'Dashboard'} type={'/SourceSystems'} source={'SourceSystems'} />
            <h3 className="title-fixed">Dashboard</h3>
          </Col>
        </div>
        <Col xs={12} className="top-align">
          <Row>
            <Row>
              <Col xs={12}>
                <HeadingFigures />
              </Col>
            </Row>
            <br />
            <Thumbnail>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                  <Tabs defaultActiveKey={1} id="transactionLogsSummary">
                    {/* <Tab eventKey={1} title="Transaction Logs">
                      <GenericReactTable
                        tableType="Logger" tempStore={this.generic_master_store} type={'Dashboard'}
                      />
                    </Tab> */}
                     <Tab eventKey={1} title="Transaction Logs">
                      <GenericReactTable
                        tableType="NewLoggers" history={this.props.history} tempStore={this.generic_master_store} type={'Dashboard'}
                      />
                    </Tab>
                    <Tab eventKey={2} title="Snapshot">
                      <SummaryTiles
                          tableType="summary" history={this.props.history} tempStore={this.generic_master_store} type={'Dashboard'}
                      />
                    </Tab>
                      {MCCData}
                  </Tabs>
                </Col>
                <Col hidden>
                  <MainChart />
                </Col>
              </Row>
            </Thumbnail>
          </Row>
        </Col>
      </div>
    );
  }
}

Dashboard.propTypes = {
    store: React.PropTypes.object
};

export default Dashboard;
