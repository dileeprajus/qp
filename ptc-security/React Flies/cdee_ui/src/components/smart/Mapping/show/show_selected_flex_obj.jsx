/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { ListGroup, ListGroupItem, Col, Pagination } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import getConvertedOutput from '../../../../lib/getConvertedOutput';
import mobx from 'mobx';

@observer
class ShowSelectedFlexTypeHierarchy extends React.Component {
  constructor(props) {
    super(props);
    this.mapping_store = this.props.mapping_store;
    this.mappingConfigJson = this.mapping_store.configJson;
    this.flexstore = this.props.flexstore;
    this.which_thing = this.props.thing_side;

    this.state = {
      selected_flex_object: '',
      selected_type_id: '',
      selected_record_data: '',
      activePage: 1
    };
  }

  componentWillMount() {
  }

  handleSelect(eventKey) {
    var fromIndex = eventKey === 1 ? eventKey : ((eventKey - 1) * 100 + 1);
    this.flexstore.GetRecords({ flexObject: this.state.selected_flex_object, typeId: this.state.selected_type_id, fromIndex:fromIndex});
    this.setState({ activePage: eventKey });
  }
  renderGetSchemaByTypeID(type_id, flexObject, event) {
    this.setState({ selected_type_id: type_id, selected_flex_object: flexObject });
    this.flexstore.GetSchemaByTypeID([{ flexObject: flexObject, typeId: type_id }]);
    this.renderGetRecords(type_id, flexObject, event);
    event.preventDefault();
  }

  renderGetRecords(type_id, flexObject, event) {
    this.flexstore.GetRecords({ flexObject: flexObject, typeId: type_id, fromIndex: 1 });
  }
  renderGetRecordsByOId(oid, event) {
    this.setState({ selected_record_data: oid });
    this.flexstore.GetRecordsByOId({ flexObject: this.state.selected_flex_object, oID: oid });
    event.preventDefault();
  }
  render() {
    const CodeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent: true,
      readOnly: true,
      lineWrapping: true
    };
    var maxPage = 1;
    var currentShowingList = 'Loading ...';
    var tempRecords = this.flexstore.RecordsData.TotalRecords;
    if (tempRecords <= 100) {
      maxPage = 1;
    } else if (tempRecords > 100) {
      if (tempRecords % 100 !== 0) {
        maxPage = Math.ceil((tempRecords / 100));
      } else maxPage = tempRecords / 100;
    }
    var tempRecordsData = [];
    var temp_sel_flex_obj = this.state.selected_flex_object;
    if (Object.keys(this.flexstore.RecordsData).length > 0) {
      if (this.flexstore.RecordsData[temp_sel_flex_obj]) {
        for (var k = 0; k < this.flexstore.RecordsData[temp_sel_flex_obj].length; k++) {
          var temp_oid = this.flexstore.RecordsData[temp_sel_flex_obj][k].oid;
          tempRecordsData.push(
            <ListGroupItem key={k} name={k} href="#" active={this.state.selected_record_data === temp_oid} onClick={this.renderGetRecordsByOId.bind(this,temp_oid)} >
              {temp_oid}
            </ListGroupItem>
            );
        }
      }
    }
    var type_hirerarchy_list = [];
    var selected_type_hierarchy = [];
    if(this.mapping_store.BasicConfigInfo.ConfigJson){
      selected_type_hierarchy = Object.keys(this.mapping_store.BasicConfigInfo.ConfigJson[this.which_thing].SelectedSchema);
      if(selected_type_hierarchy){
        for(var i = 0; i< selected_type_hierarchy.length; i++) {
          var temp_flex_obj = this.mapping_store.BasicConfigInfo.ConfigJson[this.which_thing].SelectedTypeHierarchy[i].flexObject;
          var temp_type_id = this.mapping_store.BasicConfigInfo.ConfigJson[this.which_thing].SelectedTypeHierarchy[i].typeId;
          type_hirerarchy_list.push(
            <ListGroupItem key={'th' + i} id={'th' + i} href="#" active={this.state.selected_type_id === temp_type_id} onClick={this.renderGetSchemaByTypeID.bind(this,temp_type_id,temp_flex_obj)}>{selected_type_hierarchy[i]}</ListGroupItem>
          );
        }
      }
    }

    var conv_output = 'Select sample input..';
    var coming_from = (this.which_thing === 'SourceThing') ? 'source' : 'destination';
    if (Object.keys(mobx.toJS(this.flexstore.RecordsDataByOId)).length > 0) {
      conv_output = (<CodeMirror
        key={'client_Output'} id="json-pretty" value={JSON.stringify(getConvertedOutput(mobx.toJS(this.props.mapping_store.configJson), coming_from, mobx.toJS(this.flexstore.RecordsDataByOId)))}
        options={CodeOptions}
      />);
    }


    currentShowingList = (
      <Col xs={12} sm={12} md={12} lg={12}>
        <div id="" className="col-md-2 col-sm-6">
          <h4>TypeHirerchy</h4>
          <ListGroup>
            {type_hirerarchy_list}
          </ListGroup>
        </div>
        <div id="" className="col-md-2 col-sm-6">
          <h4>Records</h4>
          <div  hidden={this.flexstore.RecordsData.TotalRecords === 0}>
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
              {tempRecordsData}
            <div hidden>
              <CodeMirror
                key={'data'} id="data-pretty" value={JSON.stringify(this.flexstore.RecordsData, null, 2)}
                options={CodeOptions}
              />
            </div>
          </div>
          <div hidden={!(this.flexstore.RecordsData.TotalRecords === 0)}>
            <h4>No data for current selected object</h4>
          </div>
        </div>
        <div id="" className="col-md-8 col-sm-12">
          <div id="" className="col-md-6 col-sm-6">
            <h4>Input</h4>
            <CodeMirror
              key={'inputdata'} id="input-data-pretty" value={JSON.stringify(this.flexstore.RecordsDataByOId, null, 2)}
              options={CodeOptions}
            />
          </div>
          <div id="" className="col-md-6 col-sm-6">
            <h4>Output</h4>
            {conv_output}
          </div>
        </div>
      </Col>

    );
    return (
      <div>
        {currentShowingList}
      </div>
    );
  }
}

ShowSelectedFlexTypeHierarchy.propTypes = {
  store: React.PropTypes.object
};

export default ShowSelectedFlexTypeHierarchy;
