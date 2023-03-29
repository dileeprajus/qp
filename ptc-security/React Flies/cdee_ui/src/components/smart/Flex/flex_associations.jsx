/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Button, Row, ControlLabel } from 'react-bootstrap';
import SortableTree from 'react-sortable-tree';

const nodeStyle = {
  width: '200px',
  height: '40px'
};

@inject('breadcrumb_store','generic_master_store')
@observer
class FlexAssociations extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.temp_th = {'Placeholder':{
'Product\\[Templates]':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4320821',
'isCreatable':true
},
'Product':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:18966',
'isCreatable':false
},
'Product\\Selection':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4313580',
'isCreatable':true
},
'Product\\Consumer\\Accessories':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4325645',
'isCreatable':true
},
'Product\\Footwear\\Womens':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4320488',
'isCreatable':true
},
'Product\\Footwear\\Mens':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4320143',
'isCreatable':true
},
'Product\\Homewares':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4317037',
'isCreatable':true
},
'Product\\Personal Care\\Fragrances':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4323799',
'isCreatable':true
},
'Product\\Apparel\\Womens':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4316680',
'isCreatable':true
},
'Product\\Selection\\Accessories':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4314430',
'isCreatable':true
},
'Product\\Accessories':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4313142',
'isCreatable':false
},
'Product\\[Templates]\\Apparel':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4321153',
'isCreatable':true
},
'Product\\Apparel':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4315061',
'isCreatable':false
},
'Product\\Selection\\Footwear':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4314747',
'isCreatable':true
},
'Product\\Personal Care\\Makeup':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4323075',
'isCreatable':true
},
'Product\\Apparel\\Childrens':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4315951',
'isCreatable':true
},
'Product\\Consumer':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4324142',
'isCreatable':true
},
'Product\\Consumer\\Parts':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4325285',
'isCreatable':true
},
'Product\\[Mobility] Product':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4325988',
'isCreatable':true
},
'Product\\[Templates]\\Footwear':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4321450',
'isCreatable':true
},
'Product\\Homewares\\Soft Goods':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4318029',
'isCreatable':true
},
'Product\\Apparel\\Mens':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4316315',
'isCreatable':true
},
'Product\\Personal Care\\Skin Care':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4323437',
'isCreatable':true
},
'Product\\Footwear':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4318767',
'isCreatable':true
},
'Product\\Homewares\\Hard Goods':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4318368',
'isCreatable':true
},
'Product\\Selection\\Apparel':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4314113',
'isCreatable':true
},
'Product\\Personal Care':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4321747',
'isCreatable':true
},
'Product\\Footwear\\Childrens':{
'typeId':'VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4319798',
'isCreatable':true
}
}}
    this.state = {
        treeData: [],
        selectedAssociationFlexObj: '',
        AssociatedObjTypeTree: [],
        currentParent: '',
        isAssSelected: false,
        AssCompleteNestedObj: {}
      };
  }


  componentWillReceiveProps() {
    this.formTreeFromFlexAssociations();
  }

  formTreeFromFlexAssociations(){
    var schema = this.props.client_store.SchemaByTypeID;
    var temp_tree = [];
    var associations = [];
    for(var key in schema['associations']){
      let k = (
        <div>
          <div style={{ display: !this.state.isAssSelected ? 'inherit' : 'none' }} >
            <Button bsSize="xsmall" style={nodeStyle} className="pull-right" onClick={this.onNodeSelect.bind(this,key,this.props.client_store.selectedFlexRootObjName)}>{key}
              <i className="fa fa-plus-circle pull-right" style={{ marginTop: '0.3em' }}></i>
            </Button>
          </div>
          <div style={{ display: this.state.isAssSelected ? 'inherit' : 'none' }} >
            <Button bsSize="xsmall" style={nodeStyle} className="pull-right" onClick={this.onNodeSelect.bind(this,key,this.props.client_store.selectedFlexRootObjName)}>{key}
              <i className="fa fa-minus-circle pull-right" style={{ marginTop: '0.3em' }}></i>
            </Button>
          </div>
        </div>
      );
      associations.push({title: k,key: key,parent:this.props.client_store.selectedFlexRootObjName})
    }
    temp_tree.push({title: this.props.client_store.selectedFlexRootObjName,children: associations,key:this.props.client_store.selectedFlexRootObjName, expanded: true});
    var all_associations = {}
    for(var as in schema['associations']){
      if(this.state.AssCompleteNestedObj[as]){
        all_associations[as]=this.state.AssCompleteNestedObj[as]
      }
      else{
        all_associations[as]={typeId: '',selected: false}
      }
    }
    var full_obj = {}
    full_obj[this.props.client_store.selectedFlexRootObjName]={'includes': all_associations}
    this.setState({AssCompleteNestedObj: full_obj});
    var assT = this.formTreeFromAssCompleteNestedObj(full_obj,this.props.client_store.selectedFlexRootObjName);
    this.setState({
      treeData: [assT]//temp_tree
    })
  }

  nodeSelect(treeData){
    this.setState({
      treeData: treeData
    });
  }

  onNodeSelect(AssObj,parent,e){
    this.setState({selectedAssociationFlexObj: AssObj, currentParent: parent, isAssSelected: !this.state.isAssSelected});
    this.props.client_store.GetTypeHierarchy([AssObj],this.formTreeFromTypeHierarchy.bind(this));
    var temp = this.state.AssCompleteNestedObj;
    var par_arr = parent.split('@Parent@');
    this.updateAssCompleteNestedObjSelectedState(temp[par_arr[0]]['includes'],par_arr,1,par_arr.length,AssObj);
    this.setState({AssCompleteNestedObj: temp});
  }

  updateAssCompleteNestedObjSelectedState(data,par_arr,index,length,current_obj_name){
    if(index===length){
      data[current_obj_name]['selected'] = !data[current_obj_name]['selected']
    }
    else {
      this.updateAssCompleteNestedObjSelectedState(data[par_arr[index]]['includes'],par_arr,index+1,length,current_obj_name)
    }
  }

  updateAssCompleteNestedObjTypeID(data,par_arr,index,length,current_obj_name,typeId){
    if(index===length){
      data[current_obj_name]['typeId'] = typeId
    }
    else {
      this.updateAssCompleteNestedObjTypeID(data[par_arr[index]]['includes'],par_arr,index+1,length,current_obj_name,typeId)
    }
  }

  formTreeFromTypeHierarchy(){
    var temp_tree = this.generic_master_store.formTreeFromFlexTypes(this.props.client_store.AssTypeHierarchy,this.updateSelectedTypeHierarchy.bind(this),nodeStyle,this.props.client_store);
    this.setState({AssociatedObjTypeTree: temp_tree})
  }

  selectTypeNode(treeData){
    this.setState({
      AssociatedObjTypeTree: treeData
    });
  }

  updateSelectedTypeHierarchy(key_with_type_id,main_obj_name){
    var input_obj = {};
    input_obj['flexObject'] = main_obj_name;
    input_obj['typeId'] = key_with_type_id.split('@#TYPEID#@')[1];
    this.props.client_store.GetSchemaByTypeID([input_obj],{},this.getAssociationsOfSelectedTH.bind(this),'Association');

    var temp = this.state.AssCompleteNestedObj;
    var par_arr = this.state.currentParent.split('@Parent@');
    this.updateAssCompleteNestedObjTypeID(temp[par_arr[0]]['includes'],par_arr,1,par_arr.length,main_obj_name,input_obj['typeId']);
    this.setState({AssCompleteNestedObj: temp});

  }

  getNestedObjDelim(temp_tree,parent_arr,index,length,output){
    if(index===length){
      return output;
    }
    else{
    for(var kk=0;kk<temp_tree.length;kk++){
      if(temp_tree[kk].key===parent_arr[index]){
        output.push(kk)
        output.push('children')
        index=index+1;
        this.getNestedObjDelim(temp_tree[kk]['children'],parent_arr,index,length,output)
      }
    }
  }
    return output;
  }

  formFlexTotalIncludesObj(obj_name,type_id,ParentDelim){
    var temp_obj = this.props.client_store.FlexTotalAssInput[0];
    var main_obj = Object.keys(temp_obj)[0] //as only one main FlexOBJ can be selected in first tab
    if(temp_obj[main_obj]['includes']===undefined){
      temp_obj[main_obj]['includes'] = {}
    }
    if(main_obj===ParentDelim){
      temp_obj[main_obj]['includes'][obj_name]={'typeId': type_id}
    }
    else{
      var par_arr = ParentDelim.split('@Parent@');
      this.updateNestedIncludes(temp_obj[main_obj]['includes'],par_arr,1,par_arr.length,obj_name,type_id);
  }
  }

  updateNestedIncludes(temp_obj,par_arr,index,length,obj_name,type_id){
    if(index===length){
      temp_obj[obj_name]={'typeId': type_id}
    }
    else{
      if(temp_obj[par_arr[index]]['includes']===undefined){
        temp_obj[par_arr[index]]['includes']={}
      }
      this.updateNestedIncludes(temp_obj[par_arr[index]]['includes'],par_arr,index+1,length,obj_name,type_id);
    }
  }


  updateNestedObjAss(dataArray,delimArray,index,length,output){
	if(index==length-2){
		dataArray[delimArray[index]]['children']=output;
	}
	else{
		this.updateNestedObjAss(dataArray[delimArray[index]]['children'],delimArray,index+2,length,output);
	}
}

updateAssCompleteNestedObj(par_arr,index,length,associations,AssObj){
  if(index===length){
    for(var as in associations){
      if(AssObj[as]){
        //AssObj[as]=AssObj[as]
      }
      else{
        AssObj[as]={typeId: '',selected: false}
      }
    }
  }
  else{
    if(AssObj[par_arr[index]]['includes']===undefined){
      AssObj[par_arr[index]]['includes'] = {}
    }
    this.updateAssCompleteNestedObj(par_arr,index+1,length,associations,AssObj[par_arr[index]]['includes'])
  }
}

  getAssociationsOfSelectedTH(){
    var schema = this.props.client_store.AssSchemaByTypeID;
    var obj_name = schema.basicDetails.rootObjectName;
    var type_id = schema.basicDetails.typeId;
    var ParentDelim = this.state.currentParent;//+'@Parent@'+obj_name;
    var temp_tree = this.state.treeData;
    var par_arr = ParentDelim.split('@Parent@');

        var output = [];
          output = this.getNestedObjDelim(temp_tree,par_arr,0,par_arr.length,output)

        var temp_children = temp_tree;
        for(var j=0;j<output.length;j++){
          temp_children = temp_children[output[j]]
        }

    var associations = [];
    for(var i=0;i<temp_children.length;i++){
      if(temp_children[i].key===obj_name){
        var temp_obj = temp_children[i];
        for(var key in schema['associations']){
          let k = //(<Button bsSize="xsmall" style={nodeStyle} className="pull-right" onClick={this.onNodeSelect.bind(this,key,temp_obj['parent']+'@Parent@'+obj_name)}>{key}</Button>);
          (
            <div>
              <div style={{ display: !this.state.isAssSelected ? 'inherit' : 'none' }} >
                <Button bsSize="xsmall" style={nodeStyle} className="pull-right" onClick={this.onNodeSelect.bind(this,key,temp_obj['parent']+'@Parent@'+obj_name)}>{key}
                  <i className="fa fa-plus-circle pull-right" style={{ marginTop: '0.3em' }}></i>
                </Button>
              </div>
              <div style={{ display: this.state.isAssSelected ? 'inherit' : 'none' }} >
                <Button bsSize="xsmall" style={nodeStyle} className="pull-right" onClick={this.onNodeSelect.bind(this,key,temp_obj['parent']+'@Parent@'+obj_name)}>{key}
                  <i className="fa fa-minus-circle pull-right" style={{ marginTop: '0.3em' }}></i>
                </Button>
              </div>
            </div>
          );
          associations.push({title: k,key: key,parent:temp_obj['parent']+'@Parent@'+obj_name})
        }
        temp_obj['children'] = associations;
        temp_obj['TypeID'] = type_id;
        temp_children[i]=temp_obj;
      }
    }
    this.updateNestedObjAss(temp_tree,output,0,output.length,temp_children);
    this.formFlexTotalIncludesObj(obj_name,type_id,ParentDelim);
    var tt=this.state.AssCompleteNestedObj;
    par_arr.push(obj_name);
    this.updateAssCompleteNestedObj(par_arr,1,par_arr.length,schema['associations'],tt[this.props.client_store.selectedFlexRootObjName]['includes'])
    this.setState({
      AssCompleteNestedObj: tt
    });
    var assT = this.formTreeFromAssCompleteNestedObj(this.state.AssCompleteNestedObj,this.props.client_store.selectedFlexRootObjName)
    this.setState({
      treeData: [assT] //temp_tree,
    });
  }

  formTreeFromAssCompleteNestedObj(inpdata,key){
    var responseObject={};
    var valueObject=inpdata[key];
    if(valueObject['includes']){
     var childArray=[];
     var locObj=valueObject['includes'];
     for(var c_key in locObj){
       childArray.push(this.formTreeFromAssCompleteNestedObj(locObj,c_key));
     }
     responseObject['children']=childArray;
    }
    responseObject['title']=key;
    return responseObject;
  }

  FetchSchemaFromFlexIncludesObj(){
  }

  render() {
    let rowHeight = 80;
    return (
      <Row>
        <Row>
          <Col xs={6} sm={6} md={6} lg={6}>
            <ControlLabel><h6><font><b>Associations  </b></font></h6></ControlLabel>
          </Col>
          <Col xs={4} sm={4} md={4} lg={4}>
            <ControlLabel><h6><font><b>TypeHierarchy  </b></font></h6></ControlLabel>
          </Col>
          <Col xs={2} sm={2} md={2} lg={2}>
            <Button
              bsStyle="primary" className="pull-right" style={{ 'margin-left': '10px' }}
              onClick={this.FetchSchemaFromFlexIncludesObj.bind(this)}
              >Finish</Button>
          </Col>
      </Row>
      <Row>
        <Col xs={6} sm={6} md={6} lg={6}>
          <div style={{ height: 800 }}>
            <SortableTree
              treeData={this.state.treeData}
              onChange={this.nodeSelect.bind(this)}
              canDrag={false}
              rowHeight = {rowHeight}
            />
          </div>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <div style={{ height: 800 }}>
            <SortableTree
              treeData={this.state.AssociatedObjTypeTree}
              onChange={this.selectTypeNode.bind(this)}
              canDrag={false}
              rowHeight = {rowHeight}
            />
          </div>
        </Col>
      </Row>
      </Row>
    );
  }
}

FlexAssociations.propTypes = {
  store: React.PropTypes.object
};

export default FlexAssociations;
