/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tabs, Tab, Row, Col } from 'react-bootstrap';
import BasicThingInfoTable from '../../static/layout/basicinfotable';
import GooglePubSubClientStore from '../../../stores/GooglePubSubClientStore';
import Navigator from '../GenericComponents/navigator';
import CodeMirror from 'react-codemirror';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class GooglePubSubShow extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.GooglePubSubClientStore = new GooglePubSubClientStore(this.props.match.params.name);
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.GooglePubSubClientStore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.GooglePubSubClientStore.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.GooglePubSubClientStore.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    if (this.props.match.params.name.indexOf('-') !== -1) {
        var brd_name = this.props.match.params.name.split('-')[1];
    }else{
        brd_name = this.props.match.params.name;
    }
    var PageName = 'Show:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.GooglePubSubClientStore.GetBasicConfigInfo();
  }

  render() {
    const codeOptions = {
      lineNumbers: false,
      mode:(this.GooglePubSubClientStore.googlePubSubEditFileInfo.fileType === 'XML') ? 'xml':'javascript',
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
    if (this.GooglePubSubClientStore.googlePubSubEditFileInfo.fileType === 'XML' || this.GooglePubSubClientStore.googlePubSubEditFileInfo.fileType === 'CSV') {
      tempData = (<CodeMirror
        id="actual-data-codemirror-pretty" value={this.GooglePubSubClientStore.googlePubSubEditFileInfo.fileData ? this.GooglePubSubClientStore.googlePubSubEditFileInfo.fileData : ''}
        options={codeOptions}
      />);
    } else {
      tempData = (
        <CodeMirror
          id="actual-data-codemirror-pretty" value={((this.GooglePubSubClientStore.googlePubSubEditFileInfo.fileData) ? JSON.stringify(this.GooglePubSubClientStore.BasicConfigInfo.googlePubSubEditFileInfo.fileData) : {}) + ''}
          options={objCodeOptions}
        />
      );
    }
    return (
      <div>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Show'} type={'/GooglePubSub'} tempStore={this.GooglePubSubClientStore} source={'Thing'} />
          </Row>
          <BasicThingInfoTable
            table_info={this.GooglePubSubClientStore.BasicConfigInfo}
            temp_store={this.GooglePubSubClientStore}
          />
          <Tabs defaultActiveKey={1} id="uncontrolled-flex-edit-tab-example">
            <Tab eventKey={1} title="Data">
              <Row key="GooglePubSubDataHeaders" className="textCenter" hidden={this.GooglePubSubClientStore.googlePubSubEditFileInfo.fileData === ''}>
                <Col sm={6} md={6} lg={1} xs={6}>
                  <b>Actual Data</b>
                </Col>
              </Row>
              <Row key="GooglePubSubDataValues" hidden={this.GooglePubSubClientStore.googlePubSubEditFileInfo.fileData === ''}>
                <Col sm={5} md={8} lg={12} xs={8} style={{ textAlign: 'left' }}>
                  {tempData}
                </Col>
              </Row>
              <div hidden={this.GooglePubSubClientStore.googlePubSubEditFileInfo.fileData !== ''} style={{ textAlign: 'center' }}>
                <div style={{ color: 'lightgray' }}>
                  <h4>  There is no Data for current GooglePubSub config.</h4>
                </div>
              </div>
            </Tab>
            <Tab eventKey={2} title="ConfigJson">
              <Row key={'configjsonRow'}>
              <CodeMirror
                id="static-configjson-pretty" value={JSON.stringify(this.GooglePubSubClientStore.configJson ? this.GooglePubSubClientStore.configJson : {}, null, 2)}
                options={objCodeOptions}
              />
            </Row>
            </Tab>
          </Tabs></Col>
      </div>
    );
  }
}

GooglePubSubShow.propTypes = {
  store: React.PropTypes.object
};

export default GooglePubSubShow;
