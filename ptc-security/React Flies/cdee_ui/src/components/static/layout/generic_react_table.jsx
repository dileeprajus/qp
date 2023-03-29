/* Copyright(C) 2015-2018 - Quantela Inc
 * All Rights Reserved
* Unauthorized copying of this file via any medium is strictly prohibited
* See LICENSE file in the project root for full license information
*/
import React from 'react';
import ReactTable from 'react-table';
import { Thumbnail, FormGroup, ControlLabel, FormControl, Col, Row, Button,OverlayTrigger,Tooltip } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import CodeMirror from 'react-codemirror';
import ModalInstance from './modalinstance';
import moment from 'moment';
import matchSorter from 'match-sorter';

@inject('generic_master_store', 'modal_store')
@observer
class GenericReactTable extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.modal_store = this.props.modal_store;
    this.tempStore = this.props.tempStore;
    this.transactionColumns = [];
    this.state = {
      toggleSpec:true,
      expandData: {},
      expandNewLogInfoSource: {},
      expandNewLogInfoMapping: {},
      expandNewLogInfoTarget: {},
      transactionId:'',
      fromDate:'',
      toDate: '',
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
   if (this.props.tableType === 'Persistence') {
      this.transactionColumns = [
        {
          Header: 'Data Provider',
          columns: [
            {
              Header: 'Primary Key',
              id: 'primaryKey',
              accessor: d=>{
                var primaryKey = (d.primaryKey !== undefined)? d.primaryKey.replace('E12', '') :'';
                primaryKey = primaryKey.replace('.','');
                return (primaryKey);
              },
              show: (this.generic_master_store.groupType === 'source')
            }, {
              Header: 'Created At',
              id: 'createdAtDataProvider',
              show: (this.generic_master_store.groupType === 'source'),
              accessor: d => {
                var time = (d.createdAtDataProvider !== undefined)? moment(d.createdAtDataProvider).format('MMMM Do YYYY, h:mm:ss:SSS a') :'';
                return (time);
              }
            }, {
              Header: 'Updated At',
              id: 'updatedAtDataProvider',
              show: (this.generic_master_store.groupType === 'source'),
              accessor: d => {
                var time = (d.updatedAtDataProvider !== undefined)? moment(d.updatedAtDataProvider).format('MMMM Do YYYY, h:mm:ss:SSS a') :'';
                return (time);
              }
            }
          ]
        }, {
          Header: 'ID',
          columns: [
            {
              Header: 'ID',
              id: 'id',
              accessor: d=>d.id,
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['id']}),
              filterAll:true,
              show: (this.generic_master_store.groupType === 'target')
            }
          ]
        },
        {
          Header: 'Time',
          columns: [
            {
              Header: 'Created At',
              id: 'createdAt',
              accessor: d => {
                var time = (d.createdAt !== undefined)? moment(d.createdAt).format('MMMM Do YYYY, h:mm:ss:SSS a') :'';
                return (time);
              }
            },
            {
              Header: 'Updated At',
              id: 'updatedAt',
              accessor: d => {
                var time = (d.updatedAt !== undefined)? moment(d.updatedAt).format('MMMM Do YYYY, h:mm:ss:SSS a') :'';
                return (time);
              }
            }
          ]
        },
        {
          Header: 'Data',
          columns: [
            {
              expander: true,
              Header: () => <strong>Log Info</strong>,
              width: 65,
              Expander: ({ isExpanded }) =>
                <div>
                  {isExpanded
                    ? <span>&#x2299;</span>
                    : <span>&#x2295;</span>}
                </div>,
              style: {
                cursor: 'pointer',
                fontSize: 25,
                padding: '0',
                textAlign: 'center',
                userSelect: 'none'
              }
            }]
        }
      ];
    } else if (this.props.tableType === 'MCC') {
      this.transactionColumns = [
            {
              Header: 'Source End Point',
              id: 'source_config_name',
              accessor: d=>d.source_config_name,
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['source_config_name']}),
              filterAll:true
            },
            {
              Header: 'Mapping Config Name',
              id: 'mapping_config_name',
              accessor: d=>d.mapping_config_name,
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['mapping_config_name']}),
              filterAll:true
            },
            {
              Header: 'Target End Point',
              id: 'target_config_name',
              accessor: d=>d.target_config_name,
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['target_config_name']}),
              filterAll:true
            },
            {
              expander: true,
              Header: () => <strong>MCC Data</strong>,
              width: 100,
              Expander: ({ isExpanded }) =>
                <div>
                  {isExpanded
                    ? <span>&#x2299;</span>
                    : <span>&#x2295;</span>}
                </div>,
              style: {
                cursor: 'pointer',
                fontSize: 25,
                padding: '0',
                textAlign: 'center',
                userSelect: 'none'
              }
        }
      ];
    } else if(this.props.tableType === 'TransactionLogs'){
      {
        this.transactionColumns = [
          {
             Header: 'Transaction Section',
             columns: [
              {
                Header: 'Transaction Id',
                id:'transactionId',
                accessor:d => {
                  var tId = (d.transactionId !== undefined)? d.transactionId.replace('E12', '') :'';
                  tId = tId.replace('.','');
                  return (tId);
                },
                filterMethod:(filter,rows)=>
                matchSorter(rows, filter.value, { keys: ['transactionId']}),
                filterAll:true//'primaryKey',
              }
          ]
        },
       {
             Header: 'Configuration Section',
              columns: [
              {
                Header: (this.generic_master_store.groupType === 'source' ? 'Source' : 'Target'),
                id: (this.generic_master_store.groupType === 'source' ? 'sourceConfig' : 'targetConfig'),
                accessor: d=>
                {
                  var config = (this.generic_master_store.groupType === 'source' ? d.sourceConfig : d.targetConfig)
                  return(config);
                }
              }
              ]
            },
            {
              Header: 'TimeStamp Section',
              columns: [
              {
                Header:(this.generic_master_store.groupType === 'source' ? 'Source Time' : 'Target Time'),
                id: (this.generic_master_store.groupType === 'source' ? 'sourceTimeStamp' : 'targetTimeStamp'),
                accessor: d => {
                  var time = (d.timestamp !== undefined)? moment(d.timestamp).format('MMMM Do YYYY, h:mm:ss:SSS a') :'';
                  return (time);
                },
                filterMethod:(filter,rows)=>
                matchSorter(rows, filter.value, { keys: ['timestamp']}),
                filterAll: true
              }
            ]
          },
          {
             Header: 'Data Section',
             columns: [
  
              {
                Header: 'Data Source Type',
                id: 'flowDataSourceType',
                accessor: d=>d.flowDataSourceType,
                filterMethod:(filter,rows)=>
                matchSorter(rows, filter.value, { keys: ['flowDataSourceType']}),
                filterAll:true
              },
              {
                Header: 'Group Type',
                id: 'groupType',
                accessor: d=>d.groupType,
                filterMethod:(filter,rows)=>
                matchSorter(rows, filter.value, { keys: ['groupType']}),
                filterAll:true
              },
              {
                Header: 'Status',
                id: 'status',
                accessor: d=>{
                  var status = d.status.replace('Info:','');
                  return (status);
                },
                filterMethod:(filter,rows)=>
                matchSorter(rows, filter.value, { keys: ['status']}),
                filterAll:true
              },
              {
                expander: true,
                Header: () => <strong>Log Info</strong>,
                width: 65,
                Expander: ({ isExpanded }) =>
                  <div>
                    {isExpanded
                      ? <span>&#x2299;</span>
                      : <span>&#x2295;</span>}
                  </div>,
                style: {
                  cursor: 'pointer',
                  fontSize: 25,
                  padding: '0',
                  textAlign: 'center',
                  userSelect: 'none'
                }
              }
            ]
          }
        ]
      }
    }
    else if (this.props.tableType === 'NewLoggers') {
      this.transactionColumns = [
        {
           Header: 'Transaction Section',
           columns: [
            {
              Header: 'Transaction Id',
              id:'transactionId',
              accessor:d => {
                var tId = (d.transactionId !== undefined)? d.transactionId.replace('E12', '') :'';
                tId = tId.replace('.','');
                return (tId);
              },
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['transactionId']}),
              filterAll:true//'primaryKey',
            },
            {
              Header: 'Parent Id',
              id:'parentTSeq',
              accessor:d => {
                var parentTSeq = (d.parentTSeq !== undefined)? d.parentTSeq.replace('E12', '') :'';
                parentTSeq = parentTSeq.replace('.','');
                return (parentTSeq);
              },
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['parentTSeq']}),
              filterAll:true//'primaryKey',
            }
        ]
      },
     {
           Header: 'Configuration Section',
            columns: [
            {
              Header: 'Source',
              id:'sourceConfig',
              accessor: d=>d.sourceConfig,
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['sourceConfig']}),
              filterAll:true//'primaryKey',
            },
            {
              Header: 'Mapping',
              id:'mappingConfig',
              accessor: d=>d.mappingConfig,
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['mappingConfig']}),
              filterAll:true//'primaryKey',
            },
            {
              Header: 'Target',
              id:'targetConfig',
              accessor: d=>d.targetConfig,
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['targetConfig']}),
              filterAll:true//'primaryKey',
            }
            ]
          },
          {
            Header: 'TimeStamp Section',
            columns: [
            {
              Header: 'Source Time',
              id: 'sourceTimeStamp',
              accessor: d => {
                var time = (d.sourceTimeStamp !== undefined)? moment(d.sourceTimeStamp).format('MMMM Do YYYY, h:mm:ss:SSS a') :'';
                return (time);
              },
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['sourceTimeStamp']}),
              filterAll: true
            },
            {
              Header: 'Mapping Time',
              id: 'mappingTimeStamp',
              accessor: d => {
                var time = (d.mappingTimeStamp !== undefined)? moment(d.mappingTimeStamp).format('MMMM Do YYYY, h:mm:ss:SSS a'): '';
                return (time);
              },
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['mappingTimeStamp']}),
              filterAll: true
            },
            {
              Header: 'Target Time',
              id: 'targetTimeStamp',
              accessor: d => {
                var time = (d.targetTimeStamp !== undefined)? moment(d.targetTimeStamp).format('MMMM Do YYYY, h:mm:ss:SSS a') : '';
                return (time);
              },
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['targetTimeStamp']}),
              filterAll: true
            }
          ]
        },
        {
           Header: 'Data Section',
           columns: [

            {
              Header: 'Data Source Type',
              id: 'flowDataSourceType',
              accessor: d=>d.flowDataSourceType,
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['flowDataSourceType']}),
              filterAll:true
            },
            {
              Header: 'Status',
              id: 'status',
              accessor: d=>{
                var status = d.status.replace('Info:','');
                return (status);
              },
              filterMethod:(filter,rows)=>
              matchSorter(rows, filter.value, { keys: ['status']}),
              filterAll:true
            },
            {
              expander: true,
              Header: () => <strong>Log Info</strong>,
              width: 65,
              Expander: ({ isExpanded }) =>
                <div>
                  {isExpanded
                    ? <span>&#x2299;</span>
                    : <span>&#x2295;</span>}
                </div>,
              style: {
                cursor: 'pointer',
                fontSize: 25,
                padding: '0',
                textAlign: 'center',
                userSelect: 'none'
              }
            }
          ]
        }
      ]
    }
  }
  componentWillMount() {
    if (this.props.tableType === 'MCC') {
      this.generic_master_store.getAllMCCData(this.tempStore.name, this.props.type, this.generic_master_store.groupType);
    }
  }
  onChange(event) {
    this.generic_master_store.setvalue(event.target.name, event.target.value);
    if (event.target.value === '') {
      if (this.props.tableType === 'Logger') {
        this.generic_master_store.getTransactionLogsData(this.tempStore.name, this.props.type, this.generic_master_store.groupType);
      } else if (this.props.tableType === 'Persistence') {
        this.generic_master_store.getPeristenceObjectData(this.tempStore.name, this.props.type, this.generic_master_store.groupType);
      }else if (this.props.tableType === 'NewLoggers' || this.props.tableType === 'TransactionLogs') {
       
        this.generic_master_store.getTRCAuditData(this.tempStore.name, this.props.type, this.generic_master_store.groupType);
      }
    }

  }

  // handleChange = e => {
  //   this.setState({ transactionId: e.target.value });
  //   this.generic_master_store.transactionId=e.target.value;
  
  // };
  handleChange = e => {
   
    var obj={};
    obj[e.target.name]=e.target.value;
    this.setState(obj);
    this.generic_master_store[e.target.name]=e.target.value;
     };

  // handleFromDateChange = e => {
    
  //   this.setState({ fromDate: e.target.value });
  //   this.generic_master_store.fromDate=e.target.value;
   
  // };

  // handleToDateChange = e => {
   
  //   this.setState({ toDate: e.target.value });
  //   this.generic_master_store.toDate=e.target.value;
  
  // };
  fetchLogsByDate() {
    if (this.props.tableType === 'Logger') {
      this.generic_master_store.getTransactionLogsData(this.tempStore.name, this.props.type, this.generic_master_store.groupType, 'date');
    } else if (this.props.tableType === 'Persistence') {
      this.generic_master_store.getPeristenceObjectData(this.tempStore.name, this.props.type, this.generic_master_store.groupType, 'date');
    } else if (this.props.tableType === 'NewLoggers' || this.props.tableType === 'TransactionLogs' ) {
      this.generic_master_store.getTRCAuditData(this.tempStore.name, this.props.type, this.generic_master_store.groupType, 'date', 'fetchLogsInfo');
    }
  }
  SearchLogsById(){
    if (this.props.tableType === 'NewLoggers') {
      this.generic_master_store.getTRCAuditData(this.generic_master_store.name,
        'Dashboard', 'generic','', 'search','',this.generic_master_store.transactionId);  
    }
  }
  refreshLogs() {
    if(this.props.tableType === 'NewLoggers'){
      this.generic_master_store.getTRCAuditData(this.generic_master_store.name,
        'Dashboard', 'generic','', 'refreshLogs');
    }
    else if(this.props.tableType === 'TransactionLogs')
    {
    this.props.generic_master_store.getTRCAuditData(this.props.tempStore.name, this.props.generic_master_store.configName, this.props.generic_master_store.groupType);
    }else{
    this.generic_master_store.getTransactionLogsData(this.generic_master_store.name,
      'Dashboard', 'generic');
    }
    this.setState({transactionId:''});
    this.setState({fromDate:''});
    this.setState({toDate:''});
    this.generic_master_store.transactionId='';
    this.generic_master_store.fromDate='';
    this.generic_master_store.toDate='';
  }
  deleteEntries() {
    var tableName='';
    if (this.props.tableType === 'NewLoggers' || this.props.tableType === 'TransactionLogs') {
      tableName = 'TRCAuditTable';
    }
    else {
      tableName = this.tempStore.name;
    }
    this.modal_store.modal.modal_title = 'Delete Logs';
    this.modal_store.modal.tableName = tableName;
    this.modal_store.modal.groupType = this.props.generic_master_store.groupType;
    this.modal_store.modal.configName = this.props.tempStore.name;
    this.modal_store.modal.modalBtnTxt = 'Confirm';
    this.modal_store.modal.serviceName = 'DeleteEntries';
    this.modal_store.showModal(<p style={{wordWrap: 'break-word'}}>Logs will be deleted from TRC</p>);
  }

  updateExpandDataIntoState(genericThis,data,key){
    if(data.value){
      var temp = this.state.expandData
      temp[key] = data.value
      this.setState({expandData: temp})
    }
    genericThis.setvalue('async_callback', null);
  }

  updateNewExpandDataIntoState(genericThis,data,key){
    if(this.props.generic_master_store.groupType === 'source'){
      if(data.value){
        var temp = this.state.expandNewLogInfoSource
        temp[key] = data.value['SOURCEDATA']
        this.setState({expandNewLogInfoSource: temp})
    }
  }else if(this.props.generic_master_store.groupType === 'target'){
    if(data.value){
      var temp = this.state.expandNewLogInfoTarget
      temp[key] = data.value['TARGETDATA']
      this.setState({expandNewLogInfoTarget: temp})
    } 
  }else{
    if(data.value){
      var temp = this.state.expandNewLogInfoSource
      temp[key] = data.value['SOURCEDATA']
      this.setState({expandNewLogInfoSource: temp})
      var temp = this.state.expandNewLogInfoMapping
      temp[key] = data.value['MAPPINGDATA']
      this.setState({expandNewLogInfoMapping: temp})
      var temp = this.state.expandNewLogInfoTarget
      temp[key] = data.value['TARGETDATA']
      this.setState({expandNewLogInfoTarget: temp})
    }
  }
    genericThis.setvalue('async_callback', null);
  }
  setLoading(event){
    if(event.filtered.length===0){
    var pagesize = event.pageSize;
    var pagenumber = event.page;
    var pages = event.pages;
    var diff = pages-pagenumber;
    if(pagenumber!== 0){
    if(diff === 1){
      var maxitems = (pagesize*pages)+pagesize;
      if(this.props.generic_master_store.groupType==='generic'){
      this.generic_master_store.getTRCAuditData(this.generic_master_store.name,
        'Dashboard', 'generic','', 'refreshLogs',maxitems);
      }
      else if(this.props.generic_master_store.groupType==='source' || this.props.generic_master_store.groupType==='target'){
        this.props.generic_master_store.getTRCAuditData(this.props.tempStore.name, this.props.generic_master_store.configName, this.props.generic_master_store.groupType,'','',maxitems);

      }
    }
  }
  }
  }
  getContent(row) {
     let codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true,
      viewportMargin: Infinity
    };
    var content = '';
    if (this.props.tableType === 'Logger') {
      if(this.state.expandData[row.original.primaryKey]){
        content = (
          <CodeMirror
            value={JSON.stringify(this.state.expandData[row.original.primaryKey], null, 2)} options={codeOptions}
          />
        );
      }else{
        this.generic_master_store.setvalue('async_callback', this.updateExpandDataIntoState.bind(this));
        this.generic_master_store.getRow(this.generic_master_store.name,
          'Dashboard', 'generic',{'tableName':'IELogsDataTable','columnValue':row.original.primaryKey,'columnName':'errorORInfo', tableType: this.props.tableType});
      }
    } else if (this.props.tableType === 'Persistence') {
      content = (
        <div>
          <Thumbnail>
            <h1> Raw Data </h1>
            <CodeMirror
              value={JSON.stringify(row['original'].rawData)} options={codeOptions}
            />
            <h1> Converted Data</h1>
            <CodeMirror
              value={JSON.stringify(row['original']['convertedData'], null, 2)} options={codeOptions}
            />
          </Thumbnail>
        </div>
      );
    } else if (this.props.tableType === 'MCC') {
      content = (
        <CodeMirror
          value={JSON.stringify(row['original'], null, 2)} options={codeOptions}
        />
      );
    } else if (this.props.tableType === 'Transaction') {
      content = (
        <CodeMirror
          value={JSON.stringify(row['original']['mcc'], null, 2)} options={codeOptions}
        />
      );
    }else if (this.props.tableType === 'NewLoggers' || this.props.tableType === 'TransactionLogs') {
      if(this.state.expandNewLogInfoSource[row.original.tSeq] || this.state.expandNewLogInfoTarget[row.original.tSeq]){
        var tempData = '';
        if( this.state.expandNewLogInfoSource[row.original.tSeq] && this.state.expandNewLogInfoSource[row.original.tSeq].XML) {
          tempData = this.state.expandNewLogInfoSource[row.original.tSeq].XML
        }else if(this.state.expandNewLogInfoSource[row.original.tSeq] && this.state.expandNewLogInfoSource[row.original.tSeq].CSV) {
        tempData = this.state.expandNewLogInfoSource[row.original.tSeq].CSV
        }else if(this.state.expandNewLogInfoTarget[row.original.tSeq] && this.state.expandNewLogInfoTarget[row.original.tSeq].XML) {
         tempData = this.state.expandNewLogInfoTarget[row.original.tSeq].XML
       }else if(this.state.expandNewLogInfoTarget[row.original.tSeq] && this.state.expandNewLogInfoTarget[row.original.tSeq].CSV) {
       tempData = this.state.expandNewLogInfoTarget[row.original.tSeq].CSV
       }else {
         tempData = JSON.stringify(this.state.expandNewLogInfoSource[row.original.tSeq], null, 2)
        }
        content = (
          <div>
            <Row hidden={this.props.generic_master_store.groupType==='generic'}>
            <Col sm={12} md={12} lg={12} xs={12}>
                  <b>Raw Data</b>
                </Col>
            </Row>
            <Row hidden={this.props.generic_master_store.groupType==='generic'} style={{ backgroundColor: '#282A36' }}>
                <Col sm={12} md={12} lg={12} xs={12} style={{ textAlign: 'left' }}>
                <CodeMirror
            value={(this.props.generic_master_store.groupType === 'source') ? JSON.stringify(this.state.expandNewLogInfoSource[row.original.tSeq]) : JSON.stringify(this.state.expandNewLogInfoTarget[row.original.tSeq])} options={codeOptions}/>
                </Col>
                </Row>
                <div>
            <Row>
              <Col sm={4} md={4} lg={4} xs={4}>
                  <b hidden={this.props.generic_master_store.groupType==='target'}>Source Data</b>
                </Col>
                <Col sm={4} md={4} lg={4} xs={4}>
                  <b hidden = {this.props.generic_master_store.groupType==='source'||this.props.generic_master_store.groupType==='target'}>Mapping Data</b>
                </Col>
                <Col sm={4} md={4} lg={4} xs={3}>
                  <b hidden = {this.props.generic_master_store.groupType==='source'}>Target Data</b>
                </Col>
              </Row>
              <Row style={{ backgroundColor: '#282A36' }}>
                <Col sm={4} md={4} lg={4} xs={4} style={{ textAlign: 'left' }}>
                <CodeMirror
                   value={tempData} options={codeOptions}/>
                </Col>
                <Col sm={4} md={4} lg={4} xs={4}>
                <CodeMirror
                    value={JSON.stringify(this.state.expandNewLogInfoMapping[row.original.tSeq], null, 2)} options={codeOptions}/>
                </Col>
                <Col sm={4} md={4} lg={4} xs={4}>
                <CodeMirror
                   value={JSON.stringify(this.state.expandNewLogInfoTarget[row.original.tSeq], null, 2)} options={codeOptions}/>
                </Col>
              </Row>
          </div>
          </div>
        );
      }else{
        this.generic_master_store.setvalue('async_callback', this.updateNewExpandDataIntoState.bind(this));
        this.generic_master_store.getRow(this.generic_master_store.name,
          'Dashboard', 'generic',{'tableName':'TRCLoggerTable','columnValue':row.original.tSeq,'columnName':'errorORInfo', tableType: this.props.tableType});
      }


    }
    return content;
  }

  render() {
    var tempData = [];
    let joltSpecJSONContainer = <div style={{ display: this.state.toggleSpec ? 'inherit' : 'none' }} >
        <div style={{ color: 'black', cursor: 'pointer','margin-left':'23px'}}>
          <i className="fa fa-toggle-off"  onClick={() => { this.setState({ toggleSpec: !this.state.toggleSpec }),this.setState({transactionId:''}), this.generic_master_store.transactionId='' }} ></i>
        </div>
      </div>
    let testDataContainer = <div style={{ display: !this.state.toggleSpec ? 'inherit' : 'none' }} >
      <div style={{ color: 'black', cursor: 'pointer','margin-left':'23px'}}>
      <i className="fa fa-toggle-on" onClick={() => { this.setState({ toggleSpec: !this.state.toggleSpec })}} style={{paddingRight: '15px'}} ></i>
         <div>
           <Row> 
         <Col xs={12}>
            <Col key={'transactionId'} xs={3} sm={3} md={3} lg={3}>
              <FormGroup>
                <ControlLabel>Transactionid</ControlLabel>
                <FormControl type="text" name = "transactionId" value={this.state.transactionId} placeholder="Transaction Id" onChange={this.handleChange.bind(this)}/>
              </FormGroup>
            </Col>
            {/* <Col key={'parentId'} xs={3} sm={3} md={3} lg={3}>
              <FormGroup>
                <ControlLabel>Parentid</ControlLabel>
                <FormControl type="text" name = "parentId" placeholder="Parent Id" onChange={this.onChange.bind(this)}/>
                
              </FormGroup>
              </Col> */}
              <Col key={'fetchLogsByDate'} xs={2} sm={2} md={2}>
              <ControlLabel>{' '}</ControlLabel>
              <Button style={{'margin-top':'6px'}}
                bsStyle="primary" block onClick={this.SearchLogsById.bind(this)}
              >Search</Button>
            </Col>
            </Col>
            </Row>
         </div>
      </div>
      </div>
    if (this.props.tableType === 'Logger') {
      tempData = this.generic_master_store.transactionLogsData;
    } else if (this.props.tableType === 'Persistence') {
      tempData = this.generic_master_store.persistenceObjectData;
    } else if (this.props.tableType === 'MCC') {
      tempData = this.generic_master_store.MCCData;
    } else if (this.props.tableType === 'Transaction') {
      tempData = this.generic_master_store.transactions;
    } else if (this.props.tableType === 'TransactionAudit') {
      tempData = this.generic_master_store.transactionAuditData;
    }else if(this.props.tableType === 'NewLoggers' || this.props.tableType === 'TransactionLogs') {
      tempData = this.generic_master_store.TRCAuditData;
    }
    return (
      <div>
        <Row hidden={this.props.tableType !== 'Logger' && this.props.tableType !== 'Persistence' && this.props.tableType !== 'TransactionAudit' && this.props.tableType !== 'NewLoggers' && this.props.tableType !== 'TransactionLogs'} >
          <Col xs={12}>
            <Col xs={7} sm={7} md={7} lg={7}>
            <Col key={'fromDate'} xs={6} sm={6} md={6} lg={6}>
              <FormGroup>
                <ControlLabel>From</ControlLabel>
                <FormControl type="datetime-local" name="fromDate"  value={this.state.fromDate} placeholder="From Date" onChange={this.handleChange.bind(this)}/>
              </FormGroup>
            </Col>
            <Col key={'toDate'} xs={6} sm={6} md={6} lg={6}>
              <FormGroup>
                <ControlLabel>To</ControlLabel>
                <FormControl type="datetime-local" name="toDate" value={this.state.toDate} placeholder="To Date" onChange={this.handleChange.bind(this)}/>
              </FormGroup>
            </Col>
              </Col>
            <Col xs={5} sm={5} md={5} lg={5}>
            <Col key={'fetchLogsByDate'} xs={4} sm={4} md={4} lg={4}>
              <ControlLabel>{' '}</ControlLabel>
              <Button
                bsStyle="primary" block onClick={this.fetchLogsByDate.bind(this)}
                disabled={this.state.fromDate === '' || this.state.toDate === ''}
              >Fetch Logs</Button>
            </Col>
            <Col key={'deleteDTEntries'} xs={4} sm={4} md={4} lg={4}>
              <ControlLabel>{' '}</ControlLabel>
              <Button block bsStyle="danger" 
              name={'deleteLogs'}
              disabled={this.state.fromDate === '' || this.state.toDate === '' || tempData.length === 0 || this.generic_master_store.userGroupName !== 'Admin' }
              onClick={this.deleteEntries.bind(this)}>
                Delete Logs
               </Button>
            </Col>
            <Col key={'RefreshLogs'} xs={4} sm={4} md={4} lg={4}>
              <ControlLabel>{' '}</ControlLabel>
              <Button block bsStyle="primary" name={'refreshLogs'} onClick={this.refreshLogs.bind(this)}>
                Refresh Logs
              </Button>
            </Col>
              </Col>
         </Col>
         </Row>
         <Row hidden={this.props.tableType==='MCC' || this.props.generic_master_store.groupType==='source' || this.props.generic_master_store.groupType==='target'}>
        <Col xs={12}>
      <FormGroup>
              <ControlLabel style = {{'margin-left':'23px'}}>Advance Search</ControlLabel>
              {joltSpecJSONContainer}
                {testDataContainer}
                </FormGroup>
                </Col>
      </Row>
        <ReactTable
          style={{zIndex:0}}
          data={tempData}
          filterable
          columns={this.transactionColumns}
          minRows={1}
          pageSizeOptions= {[ 50, 100]}
          defaultPageSize={50}
          previousText = 'Previous'
          onFetchData = {this.setLoading.bind(this)}
          className="-striped -highlight"
          SubComponent={row => {
            return this.getContent(row);
            }
           }
       />
       <ModalInstance
           custom_store={this.props.generic_master_store} groupType={'dashboard'}
           custom_history={this.props.history} service_name={'DeleteEntries'}
       />
      </div>
    );
  }
}
GenericReactTable.propTypes = {
  store: React.PropTypes.object
};
export default GenericReactTable;