/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tabs, Tab, Row, Col } from 'react-bootstrap';
import BasicThingInfoTable from '../../static/layout/basicinfotable';
import FTPClientStore from '../../../stores/FTPClientStore';
import Navigator from '../GenericComponents/navigator';
import CodeMirror from 'react-codemirror';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class FTPShow extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.FTPClientStore = new FTPClientStore(this.props.match.params.name);
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.FTPClientStore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.FTPClientStore.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.FTPClientStore.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    if (this.props.match.params.name.indexOf('-') !== -1) {
        var brd_name = this.props.match.params.name.split('-')[1];
    }else{
        brd_name = this.props.match.params.name;
    }
    var PageName = 'Show:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.FTPClientStore.GetBasicConfigInfo();
  }

  render() {
    const codeOptions = {
      lineNumbers: false,
      mode:(this.FTPClientStore.ftpFileInfo.fileType === 'XML') ? 'xml':'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: false
    };
    const objCodeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      lineWrapping: true,
      cursorBlinkRate: -1,
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    var tempData = '';
    if (this.FTPClientStore.ftpFileInfo.fileType === 'XML' || this.FTPClientStore.ftpFileInfo.fileType === 'CSV') {
      tempData = (<CodeMirror
        id="actual-data-codemirror-pretty" value={this.FTPClientStore.ftpFileInfo.fileData ? this.FTPClientStore.ftpFileInfo.fileData : ''}
        options={codeOptions}
      />);
    } else {
      tempData = (
        <CodeMirror
          id="actual-data-codemirror-pretty" value={((this.FTPClientStore.ftpFileInfo.fileData) ? JSON.stringify(this.FTPClientStore.BasicConfigInfo.ftpFileInfo.fileData) : {}) + ''}
          options={objCodeOptions}
        />
      );
    }
    return (
      <div>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Show'} type={'/FTP'} tempStore={this.FTPClientStore} source={'Thing'} />
          </Row>
          <BasicThingInfoTable
            table_info={this.FTPClientStore.BasicConfigInfo}
            temp_store={this.FTPClientStore}
          />
          <Tabs defaultActiveKey={1} id="uncontrolled-flex-edit-tab-example">
            <Tab eventKey={1} title="Data">
              <Row key="FTPDataHeaders" className="textCenter" hidden={this.FTPClientStore.ftpFileInfo.fileData === ''}>
                <Col sm={6} md={6} lg={1} xs={6}>
                  <b>Actual Data</b>
                </Col>
              </Row>
              <Row key="FTPDataValues" hidden={this.FTPClientStore.ftpFileInfo.fileData === ''}>
                <Col sm={5} md={8} lg={12} xs={8} style={{ textAlign: 'left' }}>
                  {tempData}
                </Col>
              </Row>
              <div hidden={this.FTPClientStore.ftpFileInfo.fileData !== ''} style={{ textAlign: 'center' }}>
                <div style={{ color: 'lightgray' }}>
                  <h4>  There is no Data for current FTP config.</h4>
                </div>
              </div>
            </Tab>
            <Tab eventKey={2} title="ConfigJson">
              <Row key={'configjsonRow'}>
              <CodeMirror
                id="static-configjson-pretty" value={JSON.stringify(this.FTPClientStore.configJson ? this.FTPClientStore.configJson : {}, null, 2)}
                options={objCodeOptions}
              />
            </Row>
            </Tab>
          </Tabs></Col>
      </div>
    );
  }
}

FTPShow.propTypes = {
  store: React.PropTypes.object
};

export default FTPShow;
