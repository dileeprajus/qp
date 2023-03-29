/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, ControlLabel } from 'react-bootstrap';
import SortableTree from 'react-sortable-tree';

const nodeStyle = {
  width: '200px',
  height: '50px'
};

@inject('breadcrumb_store','generic_master_store')
@observer
class FlexTypes extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.typeHierarchy = this.props.typeHierarchy;
    this.state = {
        treeData: []
      };
  }


  componentWillReceiveProps() {
    this.callformTreeFromFlexTypes();
  }

  updateTreeData() {
    return false;
  }

  onNodeSelect(key_with_type_id,main_obj_name){
      var input_obj = {};
      var api_input = {};
      this.props.client_store.setvalue('selectedFlexRootObjName', main_obj_name);
      this.props.client_store.setvalue('selectedFlexRootObjTypeName', key_with_type_id.split('@#TYPEID#@')[2]);
      api_input['flexObject'] = main_obj_name;
      api_input['typeId'] = key_with_type_id.split('@#TYPEID#@')[1];
      input_obj[main_obj_name] = {typeId: key_with_type_id.split('@#TYPEID#@')[1],includes: {}}
      this.props.client_store.setvalue('FlexTotalAssInput', [input_obj]);
      this.props.client_store.GetSchemaByTypeID([api_input],{},false,'Root');
  }

  callformTreeFromFlexTypes(){
    var temp_tree = this.generic_master_store.formTreeFromFlexTypes(this.typeHierarchy,this.onNodeSelect.bind(this),nodeStyle,this.props.client_store);
    this.setState({treeData: temp_tree})
  }

  formSubTree(c_arr,c_obj){
    if(Object.keys(c_obj).length>0){
      for(var key in c_obj){
        c_arr.push({title: key,expanded: false,children:this.formSubTree(c_arr,c_obj[key])});
      }
    }
    return c_arr;
  }





  nodeSelect(treeData){
    this.setState({
      treeData: treeData
    });
  }

  render() {
    let rowHeight = 100;
    return (
      <div>
        <Row>
          <ControlLabel className="pull-right"><h6><font><b>SelectedTypeName: </b>{this.props.client_store.selectedFlexRootObjTypeName}</font></h6></ControlLabel>
        </Row>
        <Row>
      <div style={{ height: 800 }}>
        <SortableTree
          treeData={this.state.treeData}
          onChange={this.nodeSelect.bind(this)}
          canDrag={false}
          rowHeight = {rowHeight}
        />
        </div>
        </Row>
      </div>
    );
  }
}

FlexTypes.propTypes = {
  store: React.PropTypes.object
};

export default FlexTypes;
