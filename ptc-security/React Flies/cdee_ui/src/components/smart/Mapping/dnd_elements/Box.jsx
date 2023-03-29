/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';
import {Label} from 'react-bootstrap'
import {addNewMappingToMappingSchema} from '../../../../lib/MappingLoggic'

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.2rem 1rem',
  cursor: 'move'
};

const label_style = {
  display: 'inline',
  padding: '.2em .6em .3em',
  fontSize: '75%',
  fontWeight: '700',
  lineHeight: '1',
  color: '#fff',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  verticalAlign: 'baseline',
  borderRadius: '.25em'
};

const boxSource = {
  beginDrag(props, monitor) {
    return {
      name: props.name,
      type: props.type,
      key_required : props.key_required,
      attrConcatKey: props.attrConcatKey,
      which_side: props.which_side,
      color_style: props.color_style,
      mapping_store: props.mapping_store,
      master_obj: props.master_obj,
      data_store_type_name: props.data_store_type_name,
      data_source_name: props.data_source_name,
      indent: props.indent
    };
  },

  canDrag(props, monitor){
    return !props.mappable;
  },

  endDrag(props, monitor) {

    monitor.getItem().dragging = false;
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      // TODO: this is to display purpose only
      var draggedObj={
        'name': item.name,
        'type': item.type,
        'key_required': item.key_required,
        'attrConcatKey': item.attrConcatKey,
        'which_side': item.which_side,
        'mappable': item.mappable,
        'mapping_store': item.mapping_store,
        'master_obj': item.master_obj,
        'data_store_type_name': item.data_store_type_name,
        'data_source_name': item.data_source_name
      }
      var containerObj={
        'name': dropResult.name,
        'type': dropResult.type,
        'key_required': dropResult.key_required,
        'attrConcatKey': dropResult.attrConcatKey,
        'which_side': dropResult.which_side,
        'mappable': dropResult.mappable,
        'mapping_store': dropResult.mapping_store,
        'master_obj': dropResult.master_obj,
        'data_store_type_name': dropResult.data_store_type_name,
        'data_source_name': dropResult.data_source_name
      }
      var mappingStoreConfig = props.mapping_store.configJson;
      addNewMappingToMappingSchema(draggedObj, containerObj, mappingStoreConfig);
    }
  }
};

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  canDrag: monitor.canDrag()
}))
export default class Box extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired
  };

  render() {
    const { canDrag, isDragging, connectDragSource } = this.props;
    const { name, type, key_required, which_side, mappable, color_style, attrConcatKey, master_obj, data_store_type_name, data_source_name, indent } = this.props;
    const opacity = (isDragging || !canDrag) ? 0.6 : 1;
    const float = (this.props.which_side === 'Client') ? 'left' : 'right';
    const backgroundColor = '#6C7A89'
    const marginLeft = (indent*2 + 'px');
    return (
      connectDragSource(
        <div style={{ ...style, opacity }}>
          <div style={{ marginLeft }}>
          <span hidden={!key_required} style={{'color':'red'}}><i className="fa fa-asterisk"></i></span>{name + '  '}
          <Label style={{...label_style, opacity,  backgroundColor}}>
            {type}
          </Label>
          </div>
      </div>,
      )
    );
  }
}
