/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Thumbnail, Col, Button, Row, Panel, OverlayTrigger, Tabs, Tab } from 'react-bootstrap';
import BasicThingInfoTable from '../../static/layout/basicinfotable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ComposedChart, Line, Area } from 'recharts';
import Triggers from './triggers';
import AlertsSummaryTable from './alerts_summary_table';
import GenericReactTable from '../../static/layout/generic_react_table';

const data = [
  { name: new Date(new Date().getTime()+(0*24*60*60*1000)).toISOString().split('T')[0], Success: 4000, Fail: 2400, amt: 0 },
  { name: new Date(new Date().getTime()+(1*24*60*60*1000)).toISOString().split('T')[0], Success: 3000, Fail: 1398, amt: 2210 },
  { name: new Date(new Date().getTime()+(2*24*60*60*1000)).toISOString().split('T')[0], Success: 2000, Fail: 8, amt: 2290 },
  { name: new Date(new Date().getTime()+(3*24*60*60*1000)).toISOString().split('T')[0], Success: 2780, Fail: 3908, amt: 2000 },
  { name: new Date(new Date().getTime()+(4*24*60*60*1000)).toISOString().split('T')[0], Success: 18, Fail: 4800, amt: 2181 },
  { name: new Date(new Date().getTime()+(5*24*60*60*1000)).toISOString().split('T')[0], Success: 2390, Fail: 3800, amt: 2500 },
  { name: new Date(new Date().getTime()+(6*24*60*60*1000)).toISOString().split('T')[0], Success: 3490, Fail: 4300, amt: 2100 }
];


const pieData = [{ name: 'Group A', value: 3000 }, { name: 'Group B', value: 2000 }];
const COLORS = ['#00C49F', '#FFBB28'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const composedData = [
  { name: new Date(new Date().getTime()+(0*24*60*60*1000)).toISOString().split('T')[0], uv: 59, pv: 80, amt: 14 },
  { name: new Date(new Date().getTime()+(1*24*60*60*1000)).toISOString().split('T')[0], uv: 86, pv: 96, amt: 45 },
  { name: new Date(new Date().getTime()+(2*24*60*60*1000)).toISOString().split('T')[0], uv: 23, pv: 10, amt: 98 },
  { name: new Date(new Date().getTime()+(3*24*60*60*1000)).toISOString().split('T')[0], uv: 94, pv: 12, amt: 12 },
  { name: new Date(new Date().getTime()+(4*24*60*60*1000)).toISOString().split('T')[0], uv: 65, pv: 110, amt: 11 },
  { name: new Date(new Date().getTime()+(5*24*60*60*1000)).toISOString().split('T')[0], uv: 74, pv: 68, amt: 17 }];

@observer
class TransactionSummary extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.temp_store = this.props.temp_store;
    this.state = {
      filterValue: '',
      filterSource: '',
      hideTriggersPanel: true,
      StoreLogsToggle : this.temp_store.configJson.LogData
    };
  }

  componentWillMount() {
    this.temp_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.temp_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.temp_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    this.temp_store.GetBasicThingInfo;
    this.props.generic_master_store.getTRCAuditData(this.temp_store.name, this.props.generic_master_store.configName, this.props.generic_master_store.groupType);
  }

  onClick() {
  }
  handleUserInput(categoryMart, source) {
    this.setState({ filterSource: source, filterValue: categoryMart });
  }

  render() {
    var jsonTooltip = (<Tooltip id="jsonTooltip"><strong>Store whole json in logs</strong></Tooltip>);
    const btnTooltip = (<Tooltip id="btnTooltip">
      {!this.state.hideTriggersPanel ? 'View ConfigInfo' : 'View Triggers'}
    </Tooltip>);
    return (
      <div key="transSummaryDiv">
        <Panel key="trigger_panel" collapsible expanded={this.state.hideTriggersPanel}>
          <OverlayTrigger placement="bottom" overlay={btnTooltip}>
            <Button bsStyle="info" className="pull-right" name="trigger_icon" key="icon-button"
                    onClick={() => this.setState({ hideTriggersPanel: !this.state.hideTriggersPanel })}>
              <i className={this.state.hideTriggersPanel ? 'fa fa-info-circle' : 'fa fa-gears'} aria-hidden="true"/>
            </Button>
          </OverlayTrigger>
          <Triggers thing_store={this.temp_store} generic_master_store={this.props.generic_master_store}/>
        </Panel>

        <Panel key="tableinfo_panel" collapsible expanded={!this.state.hideTriggersPanel}>
          <OverlayTrigger placement="bottom" overlay={btnTooltip}>
            <Button bsStyle="info" className="pull-right" name="trigger_icon" key="icon-btn"
                onClick={() => this.setState({ hideTriggersPanel: !this.state.hideTriggersPanel })}
            >
              <i className={this.state.hideTriggersPanel ? 'fa fa-info-circle' : 'fa fa-gears'} aria-hidden="true" />
            </Button>
          </OverlayTrigger>
          <Col xs={12}>
           <BasicThingInfoTable table_info={this.temp_store.BasicConfigInfo} temp_store={this.temp_store} />
          </Col>
        </Panel>

        <Thumbnail  key="summury-thumbnail">
          <Tabs defaultActiveKey={2} id="transactionSummary-logs-tab-example">
            <Tab eventKey={2} title="Transaction Log">
              <GenericReactTable
                tableType="TransactionLogs" tempStore={this.temp_store} type={this.props.generic_master_store.groupType} configName={this.props.generic_master_store.configName}
              />
            </Tab>
            {/* <Tab eventKey={3} title="Endpoint Data">
              <h1>Persistence Object Data</h1>
              <GenericReactTable
                tableType="Persistence" tempStore={this.temp_store} type={'Config'}
              />
            </Tab> */}
          </Tabs>
        </Thumbnail>
      </div>
    );
  }
}

TransactionSummary.propTypes = {
  store: React.PropTypes.object
};

export default TransactionSummary;
