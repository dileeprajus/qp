/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Row, Col, Thumbnail,Button  } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';

@inject('generic_master_store')
@observer
class HeadingFigures extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.state = {
      mappings: this.generic_master_store.dashboardStats.mappings,
      targets: this.generic_master_store.dashboardStats.clients
    };
  }
  setHeaderTilesVals() {
    this.updateSummaryJson();
  }
  componentWillMount() {
    this.generic_master_store.getDashboardStats(this.setHeaderTilesVals.bind(this));
  }

  updateSummaryJson() {
    if (this.generic_master_store.dashboardStats.transactions > 1000) {
      this.generic_master_store.dashboardStats.transactions = parseFloat(this.generic_master_store.dashboardStats.transactions/1000).toFixed(2)+ 'K';
    }
    this.generic_master_store.setvalue('summary_json', [
      { icon: 'users', heading: 'Total End Points', figure: this.generic_master_store.dashboardStats.clients },
      { icon: 'object-group', heading: 'Total Mappings', figure: this.generic_master_store.dashboardStats.mappings },
      { icon: 'check-circle', heading: 'Pending Transactions', figure: this.generic_master_store.dashboardStats.streamCount },
      { icon: 'exclamation-triangle', heading: 'Processor Status', figure: this.generic_master_store.dashboardStats.schedulerStatus },
      { icon: 'clock-o', heading: 'Processor Interval (sec)', figure: this.generic_master_store.dashboardStats.Frequency },
      { icon: 'exchange', heading: '# of Parallel Transactions', figure: this.generic_master_store.dashboardStats.recordCount } 
    ]);
  }
  getStreamCount(){
    this.generic_master_store.getDashboardStats();
    this.setHeaderTilesVals();
}

  render() {
    var itemsToRender = [];
    for (var i = 0; i < this.generic_master_store.summary_json.length; i++) {
      var current_item = this.generic_master_store.summary_json[i];
      var check='';
      if(current_item.heading==='Pending Transactions'){
        check=(<Button  bsSize="xsmall" bsStyle="info" style={{marginLeft:'2%'}} onClick={this.getStreamCount.bind(this)}><i className='fa fa-refresh'></i></Button>);
      }
      itemsToRender.push(
        <Col
          key={current_item.heading} xs={2 * 2} sm={2 * 2} md={2} lg={2}
          style={{ textAlign: 'center' }}
        >
          <Thumbnail className="headerTail">
            <Row>
              <Col xs={12} sm={12} md={12} lg={12}>
                <Row>  <i  className={'fa fa-' + current_item.icon}></i>
                {' '+ current_item.heading}{check}</Row>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} className="headerTailFigure" >
                <strong >{current_item.figure}</strong>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} >
                {current_item.footer}
              </Col>
            </Row>
          </Thumbnail>
        </Col>
      )
    }
    return (
      <Row>
          {itemsToRender}
      </Row>
    );
  }
}

HeadingFigures.propTypes = {
  store: React.PropTypes.object
};

export default HeadingFigures;
