/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Tabs, Tab, Row, Col } from 'react-bootstrap';
import BasicThingInfoTable from '../../static/layout/basicinfotable';
import StaticFileClientStore from '../../../stores/StaticFileClientStore';
import Navigator from '../GenericComponents/navigator';
import CodeMirror from 'react-codemirror';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class StaticFileClientThingShow extends React.Component {
  constructor(props) {
    super(props);
    const StFlClStr = new StaticFileClientStore(this.props.match.params.name);
    this.static_file_client_store = StFlClStr;
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    this.static_file_client_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.static_file_client_store.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    this.static_file_client_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    if (this.props.match.params.name.indexOf('-') !== -1) {
        var brd_name = this.props.match.params.name.split('-')[1];
    }else{
        brd_name = this.props.match.params.name;
    }
    var PageName = 'Show:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.static_file_client_store.GetBasicConfigInfo();
  }

  render() {
    const codeOptions = {
      lineNumbers: true,
      mode: 'xml',
      lineWrapping: true,
      cursorBlinkRate: -1,
      theme: 'dracula',
      smartIndent: true,
      readOnly: true,
      indentUnit: 4
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
    if (this.static_file_client_store.BasicConfigInfo.DataFormat === 'XML' || this.static_file_client_store.BasicConfigInfo.DataFormat === 'CSV') {
      tempData = (<CodeMirror
        id="actual-data-codemirror-pretty" value={this.static_file_client_store.BasicConfigInfo.Data ? this.static_file_client_store.BasicConfigInfo.Data : ''}
        options={codeOptions}
      />);
    } else {
      tempData = (
        <CodeMirror
          id="actual-data-codemirror-pretty" value={(this.static_file_client_store.BasicConfigInfo.Data ? this.static_file_client_store.BasicConfigInfo.Data : {}) + ''}
          options={objCodeOptions}
        />
      );
    }
    return (
      <div>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Show'} type={'/StaticFileClient'} tempStore={this.static_file_client_store} source={'Thing'} />
          </Row>
          <BasicThingInfoTable
            table_info={this.static_file_client_store.BasicConfigInfo}
            temp_store={this.static_file_client_store}
          />
          <Tabs defaultActiveKey={1} id="uncontrolled-flex-edit-tab-example">
          <Tab eventKey={1} title="Schema">
              <Row key={'schemajsonRow'}>
                <Col id="SchemaCodemirrorPretty" className="col-md-6 col-sm-4">
                  <CodeMirror id="SchemaJson-pretty" value={JSON.stringify((this.static_file_client_store.currentGroupType === 'source') ? this.static_file_client_store.outputSchema : this.static_file_client_store.inputSchema, null, 2)} options={objCodeOptions} />
                </Col>
              </Row>
            </Tab>
            <Tab eventKey={2} title="Data">
              <Row key="StaticDataHeaders" className="textCenter" hidden={this.static_file_client_store.BasicConfigInfo.Data === ''}>
                <Col sm={6} md={6} lg={6} xs={6}>
                  <b>Actual Data</b>
                </Col>
                <Col sm={6} md={6} lg={6} xs={6}>
                  <b>Converted Json Data</b>
                </Col>
              </Row>
              <Row key="StaticDataValues" hidden={this.static_file_client_store.BasicConfigInfo.Data === ''}>
                <Col sm={6} md={6} lg={6} xs={6} style={{ textAlign: 'left' }}>
                  {tempData}
                </Col>
                <Col sm={6} md={6} lg={6} xs={6}>
                  <CodeMirror
                    id="static-data-converted-json-pretty" value={JSON.stringify(this.static_file_client_store.BasicConfigInfo.JSONData ? this.static_file_client_store.BasicConfigInfo.JSONData : {}, null, 2)}
                    options={objCodeOptions}
                  />
                </Col>
              </Row>
              <div hidden={this.static_file_client_store.BasicConfigInfo.Data !== ''} style={{ textAlign: 'center' }}>
                <div style={{ color: 'lightgray' }}>
                  <h4>  There is no Data for current static config. please upload data.</h4>
                </div>
              </div>
            </Tab>
            <Tab eventKey={3} title="ConfigJson">
              <Row key={'configjsonRow'}>
              <CodeMirror
                id="static-configjson-pretty" value={JSON.stringify(this.static_file_client_store.configJson ? this.static_file_client_store.configJson : {}, null, 2)}
                options={objCodeOptions}
              />
            </Row>
            </Tab>
          </Tabs></Col>
      </div>
    );
  }
}

StaticFileClientThingShow.propTypes = {
  store: React.PropTypes.object
};

export default StaticFileClientThingShow;
