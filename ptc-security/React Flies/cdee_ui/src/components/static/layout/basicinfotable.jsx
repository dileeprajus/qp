/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { Table, Row, Col } from 'react-bootstrap';
import { inject } from 'mobx-react';

@inject('generic_master_store')
class BasicThingInfoTable extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.state = {
      s2d: false,
      d2s: false
    };
  }

  componentWillMount() {
  }
  render() {
    var tableBody = [];
    var FlexJSON = [
      {name:'Name',value:String(this.props.table_info.Name)},
      {name:'Description',value:String(this.props.table_info.Description)},
      {name:'Group',value:String(this.props.table_info.Group)},
      {name:'TenantID',value:String(this.props.table_info.TenantID)},
      {name:'Data Source Type',value:String(this.props.table_info.dataSourceType)},
      {name:'Type',value:String(this.props.table_info.GroupType)},
      {name:'Enable FlexPLM Trigger',value:String(this.props.table_info.enableFlexTrigger)},
      {name:'Usable',value:String(this.props.table_info.CanBeUsable)}
    ];
    var StaticJSON = [
      {name:'Group',value:String(this.props.table_info.Group)},
      {name:'Description',value:String(this.props.table_info.Description)},
      {name:'Delimiter',value:String(this.props.table_info.Delimeter)},
      {name:'CanBeUsable',value:String(this.props.table_info.CanBeUsable)},
      {name:'Name',value:String(this.props.table_info.Name)},
      {name:'TenantID',value:String(this.props.table_info.TenantID)},
      {name:'GroupType',value:String(this.props.table_info.GroupType)},
      {name:'DataSourceType',value:String(this.props.table_info.DataSourceType)},
      {name:'Data Format',value:String(this.props.table_info.DataFormat)}

    ];
    if(this.props.table_info.dataSourceType === 'Flex'){
      if (this.props.table_info['ConfigJson']) {
        for(var i = 0 ; i < FlexJSON.length ; i++){
          var curObj = FlexJSON[i];
          tableBody.push(
            <tr>
              <td>{curObj.name}</td>
              <td key={curObj.value}>{curObj.value}</td>
            </tr>
          );
        }
      } 
    }
    if(this.props.table_info.DataSourceType === 'Static'){
      if (this.props.table_info['ConfigJson']) {
        for(var i = 0 ; i < StaticJSON.length ; i++){
          var curObj = StaticJSON[i];
          tableBody.push(
            <tr>
              <td>{curObj.name}</td>
              <td key={curObj.value}>{curObj.value}</td>
            </tr>
          );
        }
      }
    }
    if(this.props.table_info.dataSourceType === 'FTP' || this.props.table_info.dataSourceType === 'Rest' || this.props.table_info.dataSourceType === 'Soap' || this.props.table_info.dataSourceType === 'Google Pub/Sub' || this.generic_master_store.groupType === 'mapping' ){
    for (var info in this.props.table_info) {
      var prop_val = String(this.props.table_info[info]);
      if (typeof this.props.table_info[info] !== 'object' && info !== 'Data') {
        if (this.generic_master_store.groupType === 'mapping' && info === 'dataSourceType') {
        } else {
          tableBody.push(
            <tr key={info}>
              <td> {info} </td>
              <td key={this.props.table_info[info]}>{prop_val}</td>
            </tr>
          );
        }
      }
    }
  }
    if (this.generic_master_store.groupType === 'mapping') {
      if (this.props.table_info['ConfigJson']) {
        var configObj = this.props.table_info.ConfigJson;
        var sourceType = configObj.SourceConfig.Type;
        var targetType = configObj.TargetConfig.Type;
        tableBody.push(
          <tr key={'source dataSourceType'}>
            <td> {'Source Type'} </td>
            <td key={sourceType}>{sourceType}</td>
          </tr>
        );
        tableBody.push(
          <tr key={'target dataSourceType'}>
            <td> {'Target Type'} </td>
            <td key={targetType}>{targetType}</td>
          </tr>
        );
      }
    }
    return (
      <div key="basicinfotable">
        <Col xs={10}>
          <Row>
            <h3 className="custom-text-style">{this.props.table_info.Name}</h3>
          </Row>
        </Col>
        <Row>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Property Name</th>
                <th>Property Value</th>
              </tr>
            </thead>
            <tbody>
              {tableBody}
            </tbody>
          </Table>
        </Row>
      </div>
    );
  }
}
Table.propTypes = {
  store: React.PropTypes.object
};

export default BasicThingInfoTable;
