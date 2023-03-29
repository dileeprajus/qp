/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {FormControl, InputGroup, FormGroup, Tooltip, Badge, Popover, OverlayTrigger, Row, Col, ListGroup, ListGroupItem, Button} from 'react-bootstrap'
import {observer } from 'mobx-react';
import mobx from 'mobx';
import {SortableHandle, SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import NewScriptForm from './new_script_form'
import AlertContainer from 'react-alert';


var SortableList='';
const test_script_tooltip = (<Tooltip id="tooltip-script-test"><strong>Test </strong> this Script.</Tooltip>)
const add_or_del_script_tooltip = (<Tooltip id="tooltip-script-addordel"><strong>Add </strong> or <strong>Delete</strong> this script</Tooltip>)
const edit_script_tooltip = (<Tooltip id="tooltip-script-edit"><strong>Edit </strong> this Script.</Tooltip>)

function getFilteredScript() {
    return (SortableContainer(({input_list, props, sortable,added_script}) => {
            return (
                <ListGroup>
                    {
                        input_list.map((script_item, script_index) => {
                                return(<SortableItem sortable={sortable} key={script_item.name + script_index} index={script_index} value={script_item} props={props} disabled={!sortable} added_script={added_script}/>)
                            }
                        )
                    }
                </ListGroup>
            )
        }
    ));
}

function addOrDeleteScript(script_already_added, script_item, props){
  
  if(props.snode['TransformationRules']===undefined){
    props.snode['TransformationRules'] = [];
  }
  var temp_rules= props.snode['TransformationRules'];
  // If script is not added just push to array and save else find the array of object and then pop using that index
  if(script_already_added){
    // find index first and then pop element using index
    var item_at_index = -1; // -1 because it is out of boundry
    for(var i=0; i<temp_rules.length; i++){
      if(script_item.name === temp_rules[i].name){
        item_at_index = i;
      }
    }
    if (item_at_index > -1) {
        temp_rules.splice(item_at_index, 1);
    }
  }else{
    temp_rules.push(script_item);
  }
  props.master.updateTreeData(props.master.state.treeData);
    SortableList = getFilteredScript();
    
}

function getEdit(script_item, props) {
  var temp = (props.snode['TransformationRules'] === undefined)? [] : props.snode['TransformationRules']
  var item_at_index = -1; // -1 because it is out of boundry
  for(var i=0; i<temp.length; i++){
    if(script_item.name === temp[i].name){
      item_at_index = i;
    }
  }
  if (item_at_index > -1) {
      props.type_manager_store.selected_script_index = item_at_index;
  }
  else{
    props.type_manager_store.selected_script_index = null;
  }
    SortableList = getFilteredScript();
}

const DragHandle = SortableHandle(() => <span><i className="fa fa-sort"></i> | </span>);

const SortableItem = SortableElement(({props, value, sortable,added_script}) =>  {

  const popoverHoverFocus = (
      <Popover id="{value.name}" title={value.name}>
        <div>
          <code>
            {value.script.join('\r\n')}
          </code>
        </div>
        {value.description}
      </Popover>
    );

    var script_already_added = false;
    var already_added_script_list = (props.snode['TransformationRules'] === undefined)? [] : props.snode['TransformationRules']
    for(var i=0; i < already_added_script_list.length; i++){
      if(value.name === already_added_script_list[i].name){
        script_already_added = true;
      }
    }
    const addOrDelButton = (
      <OverlayTrigger placement="left" overlay={add_or_del_script_tooltip}>
        <Button
          className="pull-right"
          bsSize="xsmall"
          bsStyle={script_already_added? 'danger' : 'success'}
          onClick={addOrDeleteScript.bind(this, script_already_added, value, props)}
          >
          <i className={ script_already_added? 'fa fa-minus-square' : 'fa fa-plus-square' }></i>
        </Button>
      </OverlayTrigger>
    )

    const testButton = (
      <OverlayTrigger placement="top" overlay={test_script_tooltip}>
        <Button
          className="pull-right"
          bsSize="xsmall"
          bsStyle="info"
          onClick={()=>{alert("clicked")}}
          >
          <i className="fa fa-flask"></i>
        </Button>
      </OverlayTrigger>
    )
    const editButton = (
      <OverlayTrigger placement="top" overlay={edit_script_tooltip}>
        <Button
          className="pull-right"
          bsSize="xsmall"
          disabled={!added_script}
          hidden={!added_script}
          bsStyle={added_script?'success':'link'}
          onClick={getEdit.bind(this, value, props)}
          >
          <i className="fa fa-pencil-square-o"></i>
        </Button>
      </OverlayTrigger>
    )

    const can_print_draggable = sortable? <DragHandle /> : '';

    return(
    <ListGroupItem>
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
          hidescriptEditForm : true,
          selected_script_index: null,
          new_script_name: null
        }
    }

    componentWillMount() {
      // get all filter scripts

    }

    showAlert = (msg) => {
      this.msg.show(msg, {
        type: 'error'
      })
    }
    
    alertOptions = {
      offset: 140,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        var temp_list = (this.props.snode['TransformationRules'] === undefined)? [] : this.props.snode['TransformationRules']

        var moved_script = temp_list[oldIndex];
        // Remove moved object from array
        temp_list.splice(oldIndex, 1);
        // Add moved object at new index in array
        temp_list.splice(newIndex, 0, moved_script);
        // Assign the new sorted list back to schema
        this.props.master.updateTreeData(this.props.master.state.treeData);
    };


    createScript(event){
      // TODO: check if name is already taken
      if(this.props.snode['TransformationRules']===undefined){
        this.props.snode['TransformationRules'] = [];
      }
      var s_name = this.state.new_script_name
      var script_already_added = false;
      var already_added_script_list = this.props.snode['TransformationRules']
      for(var i=0; i < already_added_script_list.length; i++){
        if(s_name === already_added_script_list[i].name){
          script_already_added = true;
        }
      }
      if(s_name!=='' && s_name!==null && !script_already_added){
        this.props.snode['TransformationRules'].push({
          name: s_name,
          input: '',
          output: '',
          description: '',
          script: []
        })
        this.props.type_manager_store.selected_script_index = this.props.snode['TransformationRules'].length-1;
        this.props.master.updateTreeData(this.props.master.state.treeData);
      }
      else{
        //TODO: Need to display error message.
        this.showAlert('Please select uniq name for script');
      }
    }

    render() {
        var edit_page = '';

        SortableList = getFilteredScript();
        if(this.props.type_manager_store.selected_script_index || this.props.type_manager_store.selected_script_index===0){
          edit_page = <NewScriptForm type_manager_store={this.props.type_manager_store}
                       selected_key={this.props.type_manager_store.selected_script_index}
                      selected_script={this.props.snode['TransformationRules'][this.props.type_manager_store.selected_script_index]}
                      snode={this.props.snode}
                      master={this.props.master}
                       />;
        }else{
          <h4>Please Select script. </h4>
        }
        return (
          <Row key={'_row'} className="show-grid">
            <Col xs={3} md={3} sm={3}>
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
            <Col xs={3} md={3} sm={3}>
              <b>Added Filters</b>
                <SortableList
                  key={'_sortable_added_container'}
                  props={this.props}
                   input_list={(this.props.snode['TransformationRules'] === undefined)? [] : this.props.snode['TransformationRules']}
                   onSortEnd={this.onSortEnd}
                   useDragHandle={true}
                   sortable={true}
                   added_script={true}
                    />
            </Col>
            <Col xs={6} md={6} sm={6}>
                  <FormGroup>
                    <InputGroup>
                    <FormControl type="text" placeholder="Add new Script.." input={this.state.new_script_name} onChange={(event) => this.setState({new_script_name: event.target.value}) }/>
                    <InputGroup.Button>
                      <Button bsStyle="success" onClick={this.createScript.bind(this)}
                      >+</Button>
                    </InputGroup.Button>
                    </InputGroup>
                  </FormGroup>

                  {edit_page}
             </Col>
             <AlertContainer ref={a => this.msg = a} {...this.alertOptions}/>
          </Row>
        );
    }
}

ScriptFilters.propTypes = {
    store: React.PropTypes.object
};

export default ScriptFilters;
