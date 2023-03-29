/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { ProgressBar, PageHeader, Panel, Col } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';


@observer
class MainChart extends React.Component {
  constructor(props) {
    super(props);
    this.data = [
          { name: 'Week 1', total: 4000, success: 2400, failure: 2400, inprogress: 1500 },
          { name: 'Week 2', total: 3000, success: 1398, failure: 2210, inprogress: 2500 },
          { name: 'Week 3', total: 2000, success: 9800, failure: 2290, inprogress: 1800 },
          { name: 'Week 4', total: 2780, success: 3908, failure: 2000, inprogress: 1783 },
          { name: 'Week 5', total: 1890, success: 4800, failure: 2181, inprogress: 2140 },
          { name: 'Week 6', total: 2390, success: 3800, failure: 2500, inprogress: 1405 },
          { name: 'Week 7', total: 3490, success: 4300, failure: 2100, inprogress: 1800 }
    ];
  }

  mainGraphRender() {
    return (
      <AreaChart
        width={770} height={400} data={this.data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area type='monotone' dataKey='total' stackId="1" stroke='#3bafda' fill='#3bafda' />
        <Area type='monotone' dataKey='success' stackId="1" stroke='#8cc152' fill='#8cc152' />
        <Area type='monotone' dataKey='inprogress' stackId="1" stroke='#f6bb42' fill='#f6bb42' />
        <Area type='monotone' dataKey='failure' stackId="1" stroke='#da4453' fill='#da4453' />
      </AreaChart>
    );
  }

  mainBarRender() {
    return (
      <div>
        Total: <ProgressBar bsStyle="info" now={100} />
        Success: <ProgressBar bsStyle="success" now={70} />
        Inprogress: <ProgressBar bsStyle="warning" now={10} />
        Failure: <ProgressBar bsStyle="danger" now={20} />
      </div>
    );
  }

  componenWillMount() {
  }

  render() {
    return (
      <div>
        <Col xs={12} sm={12} md={12} lg={12}>
          <Panel style={{ marginTop: '2%' }}>
            <PageHeader>Summary of Transaction</PageHeader>
            <Col xs={12} sm={12} md={10.5} lg={8}>
              {this.mainGraphRender()}
            </Col>
            <Col xs={12} sm={12} md={1.5} lg={4}>
               {this.mainBarRender()}
            </Col>
            {/* <Col xs={12} sm={12} md={12} lg={12}>
              <ScheduleBox cron_string="0 * * * *"/>
            </Col> */}
          </Panel>
        </Col>
      </div>
    );
  }
}

MainChart.propTypes = {
  store: React.PropTypes.object
};

export default MainChart;
