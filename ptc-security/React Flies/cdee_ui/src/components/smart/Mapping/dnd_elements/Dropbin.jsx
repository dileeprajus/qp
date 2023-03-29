/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React, { PropTypes, Component } from 'react';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';
import {canConvertTo} from '../../../../lib/MappingLoggic'

const style = {
  width: '4rem',
  color: 'white',
  padding: '0.8rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal'
};


const boxTarget = {
  drop(props) {
    return {
      name: props.name,
      type: props.type,
      key_required : props.key_required,
      attrConcatKey: props.attrConcatKey,
      which_side: props.which_side,
      mapping_store: props.mapping_store,
      master_obj: props.master_obj,
      data_store_type_name: props.data_store_type_name,
      data_source_name: props.data_source_name
      };
  },
  canDrop(props, monitor) {
    const item = monitor.getItem();
    return (canConvertTo(item.type, props.type) && !(props.which_side === item.which_side) );
  }
};

@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  isDragging: !!monitor.getItem()
}))
export default class Dropbin extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  };

  render() {
    const { isDragging, canDrop, isOver, connectDropTarget, attrConcatKey, master_obj, data_store_type_name, data_source_name } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor = '#222';
    let opacity = 1;


    let default_ui = (<i className="fa fa-exchange"></i>);
    let while_transfer_allowed_ui = (<i className="fa fa-plug"></i>);
    let while_transfer_not_allowed_ui = (<i className="fa fa-ban"></i>);
    let while_transfred = default_ui;



    if(isDragging){
      if (isActive) {
        backgroundColor = 'darkgreen';
        while_transfred = default_ui;
      } else if (canDrop) {
        backgroundColor = '#26A65B';
        while_transfred = while_transfer_allowed_ui;
      } else{
        backgroundColor = 'ash'
        while_transfred = while_transfer_not_allowed_ui;
        opacity = 0.4;
      }
    }else{
    }

    return connectDropTarget(
      <div style={{ ...style, backgroundColor, opacity }} >
        { while_transfred }
      </div>,
    );
  }
}
