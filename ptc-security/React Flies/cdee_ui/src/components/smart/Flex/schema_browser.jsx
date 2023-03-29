/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Row, Tabs, Tab, Pagination } from 'react-bootstrap';
import GenericStatusMessage from '../GenericComponents/generic_status_component';
import CodeMirror from 'react-codemirror';

@observer
class SchemaBrowser extends React.Component {
  constructor(props) {
    super(props);
    // This is not creating new datasource
    this.flexstore = this.props.flexstore;
    this.state = {
      selected_flex_object: '',
      selected_type_id: '',
      selected_oid: '',
      activePage: 1
    };
  }

  componentWillMount() {
    //this.flexstore.GetFlexObjects;
  }
  recordByOid(event) {
    this.setState({ selected_oid: event.target.value });
    this.flexstore.GetRecordsByOId({ flexObject: this.state.selected_flex_object, OId: event.target.value });
  }
  handleSelect(eventKey) {
    var fromIndex = eventKey === 1 ? eventKey : ((eventKey - 1) * 100 + 1);
    if (Object.keys(this.flexstore.BasicConfigInfo['ConfigJson']).length > 0) {
    var flexObj = this.flexstore.BasicConfigInfo.ConfigJson.SelectedTypeHierarchy;
    if (this.flexstore.BasicConfigInfo.ConfigJson.SelectedFlexObjects.length > 0) {
      this.flexstore.GetRecords({
        flexObject: flexObj[flexObj.length - 1].flexObject,
        typeId: flexObj[flexObj.length - 1].typeId,
        fromIndex: fromIndex.toString()
      });
      this.setState({ activePage: eventKey });
    }
    }
  }

  getRecordsFlexSelection(event) {
    if (event === 2) {
      if (this.flexstore.BasicConfigInfo.ConfigJson.SelectedFlexObjects) {
        if (this.flexstore.BasicConfigInfo.ConfigJson.SelectedFlexObjects.length > 0){
          var flexObj = this.flexstore.BasicConfigInfo.ConfigJson.SelectedTypeHierarchy;
          this.setState({ selected_flex_object: flexObj[flexObj.length - 1].flexObject });
          this.flexstore.GetRecords({ flexObject: flexObj[flexObj.length - 1].flexObject, typeId:flexObj[flexObj.length - 1].typeId, fromIndex: '100' });
        }
      }
    }
  }
  render() {
    const codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true
    };
    var maxPage = 1;
    var tempRecords = this.flexstore.RecordsData.TotalRecords;
    if (tempRecords <= 100) {
      maxPage = 1;
    } else if (tempRecords > 100) {
      if (tempRecords % 100 !== 0) {
        maxPage = Math.ceil((tempRecords / 100));
      } else maxPage = tempRecords / 100;
    }
    var schema = {}; //changes for bug 272
    if (this.flexstore.BasicConfigInfo) {
      if (this.flexstore.currentGroupType === 'source') {
        if (this.flexstore.BasicConfigInfo.outputSchema) {
          schema = this.flexstore.BasicConfigInfo.outputSchema;
        }
      } else if (this.flexstore.currentGroupType === 'target') {
        if (this.flexstore.BasicConfigInfo.inputSchema) {
          schema = this.flexstore.BasicConfigInfo.inputSchema;
        }
      }
    }
    return (
      <Row>
          <Tabs defaultActiveKey={this.state.activetab} id="uncontrolled-flex-tab-example" onSelect={this.getRecordsFlexSelection.bind(this)}>
            <Tab eventKey={1} tabClassName="arrowshapetab" title="Schema">
              <div hidden={Object.keys(schema).length === 0}>
                <CodeMirror id="SchemaJson-pretty" value={JSON.stringify(schema, null, 2)} options={codeOptions}/>
              </div>
              <div hidden={!(Object.keys(schema).length === 0)}>
                <GenericStatusMessage statusMsg={'Please Select FlexType & TypeHierarchy'} />
              </div>
            </Tab>
            {/* <Tab eventKey={2} tabClassName="arrowshapetab" title="Data">
              <div hidden={this.flexstore.RecordsData.TotalRecords === undefined}>
                <Pagination
                  prev
                  next
                  first
                  last
                  ellipsis
                  boundaryLinks
                  items={maxPage}
                  maxButtons={maxPage < 5 ? maxPage : 5}
                  activePage={this.state.activePage}
                  onSelect={this.handleSelect.bind(this)}
                />
                  <CodeMirror id="RecordsDataJson-pretty" value={JSON.stringify(this.flexstore.RecordsData, null, 2)} options={codeOptions} />
              </div>
              <div hidden={!(this.flexstore.RecordsData.TotalRecords === undefined)}>
                <GenericStatusMessage statusMsg={'No data for current selected object'} />
              </div>
            </Tab> */}
            <Tab eventKey={3} tabClassName="arrowshapetab" title="Config JSON">
              <div hidden={Object.keys(schema).length === 0}>
                <CodeMirror id="ConfigJson-pretty" value={JSON.stringify(this.flexstore.BasicConfigInfo.ConfigJson ? this.flexstore.BasicConfigInfo.ConfigJson : {}, null, 2)} options={codeOptions} />
              </div>
              <div hidden={!(Object.keys(schema).length === 0)}>
                <GenericStatusMessage statusMsg={'Please Select FlexType & TypeHierarchy for ConfigJson'} />
              </div>
            </Tab>
          </Tabs>
      </Row>
    );
  }
}

SchemaBrowser.propTypes = {
  store: React.PropTypes.object
};

export default SchemaBrowser;
