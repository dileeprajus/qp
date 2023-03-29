/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { FormControl, InputGroup, FormGroup, Tooltip, Popover, OverlayTrigger, Row, Col, ListGroup, ListGroupItem, Button, Modal} from 'react-bootstrap'
import { observer } from 'mobx-react';
import { SortableHandle, SortableContainer, SortableElement } from 'react-sortable-hoc';
import NewScriptForm from './new_script_form'
import AlertContainer from 'react-alert';

var SortableList='';
const add_or_del_script_tooltip = (<Tooltip id="tooltip-script-addordel"><strong>Add </strong> or <strong>Delete</strong> this script</Tooltip>)
const edit_script_tooltip = (<Tooltip id="tooltip-script-edit"><strong>Edit </strong> this Script.</Tooltip>)

// Below function used for bug no. 289
function getFilteredScript() {
    return (SortableContainer(({ input_list, props, sortable, added_script }) => {
            return (
                <ListGroup style={{wordBreak: 'break-all'}}>
                    {
                        input_list.map((script_item, script_index) => {
                                return (<SortableItem sortable={sortable} key={script_item.name + script_index} index={script_index} value={script_item} props={props} disabled={!sortable} added_script={added_script}/>)
                            }
                        )
                    }
                </ListGroup>
            );
        }
    ));
}

function addOrDeleteScript(script_already_added, script_item, props) {
  setTimeout(function () {
      var cTab = document.querySelectorAll('.transform-rule-tab a');
      if(cTab && cTab.length) {
          for(var i=0; i< cTab.length; i++) {
              cTab[i].click();
          }
      }
  }, 500);
  // Get the current attribute configuration into tmp value
  if (props.snode[props.prop_key] === undefined) {
    props.snode[props.prop_key] = [];
  }
  var temp_rules = props.snode[props.prop_key]? props.snode[props.prop_key]: [];
  var pre_temp_rules = props.snode['PreTransformationRules'] ? props.snode['PreTransformationRules'] :[];
  var post_temp_rules = props.snode['TransformationRules'] ? props.snode['TransformationRules'] : [];

  // If script is not added just push to array and save else find the array of object and then pop using that index
  if(script_already_added) {
    // find index first and then pop element using index
    var item_at_index = -1; // -1 because it is out of boundry
    if (props.prop_key === 'PreTransformationRules') {
      for (var i = 0; i < pre_temp_rules.length; i++) {
        if (script_item.name === pre_temp_rules[i].name) {
          item_at_index = i;
        }
      }
      if (item_at_index > -1) {
        pre_temp_rules.splice(item_at_index, 1);
      }
    } else if(props.prop_key === 'TransformationRules') {
      for (var i = 0; i < post_temp_rules.length; i++) {
        if (script_item.name === post_temp_rules[i].name) {
          item_at_index = i;
        }
      }
      if (item_at_index > -1) {
        post_temp_rules.splice(item_at_index, 1);
      }
    } else {
      for (var i = 0; i < temp_rules.length; i++) {
        if (script_item.name === temp_rules[i].name) {
          item_at_index = i;
        }
      }
      if (item_at_index > -1) {
        temp_rules.splice(item_at_index, 1);
      }
    }
  } else {
    if (props.prop_key === 'PreTransformationRules') {
      pre_temp_rules.push(script_item);
    } else if (props.prop_key === 'TransformationRules') {
      post_temp_rules.push(script_item);
    } else temp_rules.push(script_item);
  }
  if (props.from === 'schema_edit') {
    // update the schema
    props.master.updateTreeData(props.master.state.treeData);
  }else if(props.from === 'TargetScripts'){
    if(script_already_added){
      if (props.prop_key === 'PreTransformationRules') {
        pre_temp_rules = [];
      } else if (props.prop_key === 'TransformationRules') {
        post_temp_rules = [];
      } else temp_rules = [];// as allowing only one script in target scritps
    }
    else{
      if (props.prop_key === 'PreTransformationRules') {
        pre_temp_rules = [script_item];
      } else if (props.prop_key === 'TransformationRules') {
        post_temp_rules = [script_item];
      } else temp_rules = [script_item];// as allowing only one script in target scritps
    }
    if (props.prop_key === 'PreTransformationRules') {
      props.master.updateTreeData(pre_temp_rules,'PreTransformationRules');
    } else if (props.prop_key === 'TransformationRules') {
      props.master.updateTreeData(post_temp_rules,'TransformationRules');
    } else props.master.updateTreeData(temp_rules,props.prop_key);
  }
  else {
    props.master.updateTreeData(temp_rules);
  }

  if(temp_rules.length===0){
    props.type_manager_store[props.prop_key]['selected_script_index'] = null;
  }
    props.type_manager_store.setvalue('testScipt_input_value', {'value':''});           //changes added for bug 103
    props.type_manager_store.setvalue('test_script_output', { 'data_type': '', 'value': ''});
      if (props.from === 'TargetScripts') { //assign the updated list to the props.snode otherwise both rules becoming empty array(if pre deleted post also deleting)
        props.snode['PreTransformationRules'] = pre_temp_rules;
        props.snode['TransformationRules']= post_temp_rules;
      } else {
        props.snode['TransformationRules']= temp_rules;
      }

       SortableList = getFilteredScript();
    props.type_manager_store.modalShow = false
}

function getEdit(script_item, props) {
  var temp = (props.snode[props.prop_key] === undefined) ? [] : props.snode[props.prop_key]
  var item_at_index = -1; // -1 because it is out of boundry
  for (var i = 0; i < temp.length; i++) {
    if (script_item.name === temp[i].name) {
      item_at_index = i;
    }
  }
  if (item_at_index > -1) {
    props.type_manager_store[props.prop_key]['selected_script_index'] = item_at_index;
  } else {
    props.type_manager_store[props.prop_key]['selected_script_index'] = null;
  }

  var temp_input = props.type_manager_store[props.prop_key]
  temp_input['testScipt_input_value']={'value':''}
  temp_input['test_script_output']={ 'data_type': '', 'value': ''}
  props.type_manager_store.setvalue(props.prop_key, temp_input);
}

const DragHandle = SortableHandle(() => <span><i className="fa fa-sort"></i> | </span>);

const SortableItem = SortableElement(({ props, value, sortable, added_script }) => {
  const popoverHoverFocus = (
    <Popover className="popover-content" id="{value.name}" title={value.name}>
      <div hidden={value.script.length === 0 && !(value.description === undefined)}>
        <div>
          <code>
            {value.script.join('\r\n')}
          </code>
        </div>
        <div>
        </div>

      </div>{value.description}

      <span hidden={!(value.script.length === 0)}>
      No default Custom Script available
      </span>
    </Popover>
    );

  var script_already_added = false;
  var already_added_script_list = (props.snode[props.prop_key] === undefined) ? [] : props.snode[props.prop_key]
  var pre_added_script_list = (props.snode['PreTransformationRules'] === undefined) ? [] : props.snode['PreTransformationRules']
  var post_added_script_list = (props.snode['TransformationRules'] === undefined) ? [] : props.snode['TransformationRules']
  if (props.prop_key === 'PreTransformationRules') {
    for (var i = 0; i < pre_added_script_list.length; i++) {
      if (value.name === pre_added_script_list[i].name) {
        script_already_added = true;
      }
    }
  } else if (props.prop_key === 'TransformationRules') {
    for (var i = 0; i < post_added_script_list.length; i++) {
      if (value.name === post_added_script_list[i].name) {
        script_already_added = true;
      }
    }
  } else {
    for (var i = 0; i < already_added_script_list.length; i++) {
      if (value.name === already_added_script_list[i].name) {
        script_already_added = true;
      }
    }
  }

  function handleShow(script_already_added, script_item, props) {
   if(script_already_added) {
     props.type_manager_store.modalStatus = true;
   }else {
     props.type_manager_store.modalStatus = false;
   }
   props.type_manager_store.modalShow = true;
   props.type_manager_store.scriptStatus = script_already_added;
   props.type_manager_store.scriptObj = script_item;
   props.type_manager_store.typeStoreProps = props;
  }
  const addOrDelButton = (
    <OverlayTrigger placement="top" overlay={add_or_del_script_tooltip}>
      <Button
        className="pull-right"
        bsSize="xsmall"
        bsStyle={script_already_added? 'danger' : 'success'}
        key={'addOrDelBtn' + props.prop_key}
        onClick={handleShow.bind(this, script_already_added, value, props)}
      >
        <i className={ script_already_added? 'fa fa-minus-square' : 'fa fa-plus-square' }></i>
      </Button>
    </OverlayTrigger>
  );

  const editButton = (
    <span hidden={!added_script}>
      <OverlayTrigger placement="top" overlay={edit_script_tooltip}>
        <Button
          className="pull-right"
          bsSize="xsmall"
          disabled={!added_script}
          bsStyle={added_script ? 'success': null}
          onClick={getEdit.bind(this, value, props)}
        >
          <i className="fa fa-pencil-square-o"></i>
        </Button>
      </OverlayTrigger>
    </span>

  );

  const can_print_draggable = sortable ? <DragHandle /> : '';

  return (
    <ListGroupItem className="added-Filters">
      {can_print_draggable}

      {' ' + value.name + ' '}
      <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverHoverFocus}>
        <i className="fa fa-info-circle"></i>
      </OverlayTrigger>
       {addOrDelButton}
      {editButton}
    </ListGroupItem>
  );

  });


SortableList = getFilteredScript();

@observer
class ScriptFilters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidescriptEditForm: true,
      TransformationRules: {selected_script_index:null},
      PreTransformationRules: {selected_script_index:null},
      new_script_name: ''
    };
  }


  componentWillMount() {
    // get all filter scripts
    this.props.type_manager_store[this.props.prop_key]['selected_script_index'] = null; //fix for #366
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    var temp_list = (this.props.snode[this.props.prop_key] === undefined) ? [] : this.props.snode[this.props.prop_key]

    var moved_script = temp_list[oldIndex];
    // Remove moved object from array
    temp_list.splice(oldIndex, 1);
    // Add moved object at new index in array
    temp_list.splice(newIndex, 0, moved_script);
    if (this.props.from === 'schema_edit') {
      // Assign the new sorted list back to schema
      this.props.master.updateTreeData(this.props.master.state.treeData);
    }
    else {
      this.props.master.updateTreeData(temp_list);
    }
  };

  alertOptions = {
    theme: 'dark',
    time: 5000,
    transition: 'scale'
  }

  showAlert = (msg) => {
    this.msg.show(msg, {
      type: 'error'
    });
  }
  createScript() {
    // TODO: check if name is already taken
    if (this.props.snode[this.props.prop_key] === undefined) {
      this.props.snode[this.props.prop_key] = [];
    }
    if(this.props.from === 'TargetScripts'){
      // as allowing only one script in target scritps
      this.props.snode[this.props.prop_key] = [];
    }
    var s_name = this.state.new_script_name;
    var script_already_added = false
    var pre_script_already_added= false
    var post_script_already_added=false;
    var already_added_script_list = this.props.snode[this.props.prop_key]
    if (this.props.prop_key === 'PreTransformationRules') {
      var pre_added_script_list = this.props.snode['PreTransformationRules'] ? this.props.snode['PreTransformationRules'] :[];
      for(var i = 0; i < pre_added_script_list.length; i++) {
        if (s_name === pre_added_script_list[i].name) {
          pre_script_already_added = true;
        }
      }
      if (s_name !== '' && s_name !== null && !pre_script_already_added) {
       this.props.snode['PreTransformationRules'].push({
         name: s_name,
         input: '',
         output: '',
         description: '',
         script: []
       })
       this.setState({ new_script_name: '' });
     }
    } else if(this.props.prop_key === 'TransformationRules') {
      var post_added_script_list = this.props.snode['TransformationRules'] ? this.props.snode['TransformationRules'] :[]
      for(var i = 0; i < post_added_script_list.length; i++) {
        if (s_name === post_added_script_list[i].name) {
          post_script_already_added = true;
        }
      }
      if (s_name !== '' && s_name !== null && !post_script_already_added) {
       this.props.snode['TransformationRules'].push({
         name: s_name,
         input: '',
         output: '',
         description: '',
         script: []
       })
       this.setState({ new_script_name: '' });
     }
    } else if(this.props.prop_key !== 'PreTransformationRules' && this.props.prop_key !== 'TransformationRules') {
      for(var i = 0; i < already_added_script_list.length; i++) {
        if (s_name === already_added_script_list[i].name) {
          script_already_added = true;
        }
      }

       if (s_name !== '' && s_name !== null && !script_already_added) {
        this.props.snode[this.props.prop_key].push({
          name: s_name,
          input: '',
          output: '',
          description: '',
          script: []
        })
        this.setState({ new_script_name: '' });
        this.props.type_manager_store[this.props.prop_key]['selected_script_index'] = null;
        if (this.props.from === 'schema_edit') {
          // Assign the new sorted list back to schema
          this.props.master.updateTreeData(this.props.master.state.treeData);
        } else {
          this.props.master.updateTreeData(this.props.snode[this.props.prop_key],this.props.prop_key);
        }
      }
    } else {
      //TODO: Need to display error message.
      this.showAlert('Please select uniq name for script');
    }
      this.props.type_manager_store.setvalue('testScipt_input_value', {'value':''});           //changes added for bug 103
      this.props.type_manager_store.setvalue('test_script_output', { 'data_type': '', 'value': ''});
      this.props.master.modal_store?this.props.master.modal_store.modal.test_script_btn_dsbld=true:false;
  }
  showNewFormInTarget() { //fix for #356
    var temp = true;
    if (this.props.from === 'TargetScripts') {
      if (this.props.master.client_store) {
        if (this.props.master.client_store.configJson[this.props.prop_key]) {
          if (this.props.master.client_store.configJson[this.props.prop_key].length === 1) {
            temp = false;
          }
        }
      }
    }
    return temp;
  }
  handleClose() {
    this.props.type_manager_store.modalShow = false;
  }

  render() {
    var showForm = this.showNewFormInTarget();
    var edit_page = '';
      if (this.props.type_manager_store[this.props.prop_key]['selected_script_index'] || this.props.type_manager_store[this.props.prop_key]['selected_script_index'] === 0) {
        if (this.props.snode[this.props.prop_key]!==undefined && this.props.snode[this.props.prop_key].length>0) {
            edit_page = (
              <NewScriptForm
                type_manager_store={this.props.type_manager_store}
                selected_key={this.props.type_manager_store[this.props.prop_key]['selected_script_index']}
                selected_script={this.props.snode[this.props.prop_key][this.props.type_manager_store[this.props.prop_key]['selected_script_index']]}
                snode={this.props.snode} master={this.props.master} from={this.props.from} prop_key={this.props.prop_key}
              />);
        }
      } else {
        edit_page = (<h4>{(this.props.snode[this.props.prop_key] && this.props.snode[this.props.prop_key].length>0 && this.props.from !== 'TargetScripts' ? 'Please select script to edit.':'')}</h4>); //fix for #606
      }

      var filter_templates = '';
      if(this.props.from!=='TargetScripts'){
        filter_templates=(
          <Col xs={4} md={4} sm={4}>
            <b>Filter Templates</b>
            <SortableList
              key={'_sortable_template_container'}
              props={this.props} input_list={this.props.type_manager_store.filter_scripts}
              onSortEnd={this.onSortEnd}
              useDragHandle={false}
              sortable={false}
              added_script={false}
            />
          </Col>
        )
      }
    return (
      <Row key={'_row'} className="show-grid">
      {filter_templates}
        <Col xs={8} md={8} sm={8}>
          <Col xs={12} md={12} sm={12}>
            <SortableList
              key={'_sortable_added_container'+this.props.prop_key}
              props={this.props}
              input_list={(this.props.snode[this.props.prop_key] === undefined) ? [] : this.props.snode[this.props.prop_key]}
              onSortEnd={this.onSortEnd} useDragHandle={true}
              sortable={true} added_script={true}
            />
            <FormGroup hidden={!showForm || (this.props.fromCustomAuth && (!this.props.snode[this.props.prop_key]?[]:this.props.snode[this.props.prop_key].length))}>
              <InputGroup>
                <FormControl type="text" placeholder="Add New Script" value={this.state.new_script_name} onChange={(event) => this.setState({new_script_name: event.target.value.replace(/^\s+|$/gm,'')}) }/>
                <InputGroup.Button>
                  <Button bsStyle="success" style={{fontSize: '15px'}} key={'addBtn' + this.props.prop_key} onClick={this.createScript.bind(this)}
                  >+</Button>
                </InputGroup.Button>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={12}>
          {edit_page}
          </Col></Col>
        <Col xs={5} md={5} sm={5}>
          <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        </Col>
        <Modal show={this.props.type_manager_store.modalShow} onHide={this.handleClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{(this.props.type_manager_store.modalStatus === false) ? 'Add Script' : 'Delete Script' }</Modal.Title>
          </Modal.Header>
          <Modal.Body>{(this.props.type_manager_store.modalStatus === false) ? 'Do you want to add the Script ?' : 'Do you want to delete the Script ?' }</Modal.Body>
          <Modal.Footer>
            <Button bsStyle="secondary" onClick={this.handleClose.bind(this)}>
              Close
            </Button>
            <Button bsStyle={(this.props.type_manager_store.modalStatus === false) ? 'primary': 'danger'} onClick={addOrDeleteScript.bind(this, this.props.type_manager_store.scriptStatus, this.props.type_manager_store.scriptObj, this.props.type_manager_store.typeStoreProps)}>
              {(this.props.type_manager_store.modalStatus === false) ? 'AddScript' : 'Delete' }
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
    );
  }
}

ScriptFilters.propTypes = {
  store: React.PropTypes.object
};

export default ScriptFilters;
