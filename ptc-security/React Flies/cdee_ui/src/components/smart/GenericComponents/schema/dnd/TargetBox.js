/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const style = {
  backgroundColor: '#F6FBFF',
  border: '1px dashed #39ACFF',
  color: '#89D1FF',
  padding: '1.5rem',
  textAlign: 'center',
  cursor: 'pointer'
};

const activeStyle = {
  backgroundColor: '#C8E6C9',
  border: '1px dashed #66BB6A',
  color: '#2E7D32',
  padding: '1.5rem',
  textAlign: 'center'
};

const whileDragAllowedStyle = {
  backgroundColor: '#A5D6A7',
  border: '2px solid #4CAF50',
  color: '#2E7D32',
  padding: '1.5rem',
  textAlign: 'center',
  fontWeight: 'bold'
};

const whileDragNotAllowedStyle = {
  backgroundColor: '#ECEFF1',
  border: '1px dashed #CFD8DC',
  color: '#B0BEC5',
  padding: '1.5rem',
  textAlign: 'center'
};

const boxTarget = {
  drop(props) {
    return {
      whichSide: props.whichSide
    };
  },
  canDrop(props, monitor) {
    const draggingItem = monitor.getItem();
    let candrop = true;
    if (draggingItem.whichSide === props.whichSide){
      candrop = true;
    }else{
      candrop = false;
    }
    // Item must match validations and must not belong to same side
    return candrop;
  }
};

@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
  isDragging: !!monitor.getItem()
}))
export default class TargetBox extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired
  };

  addPlaceHolder(){
    let newMappCont = this.props.masterComponent.state.newMapContainer ? this.props.masterComponent.state.newMapContainer : {};

    newMappCont[this.props.whichSide] = null;
    newMappCont[this.props.whichSide] = {
      title: '<PLACEHOLDER>',
      attrPrefix: ''
    };
    this.props.masterComponent.setState({ newMapContainer: newMappCont });
  }

  render() {
    const { isDragging, canDrop, isOver, connectDropTarget, whichSide} = this.props;
    const isActive = canDrop && isOver;
    let finalStyle = style;
    let finalMessage = 'Drop items here!!';

    if(whichSide === 'source') {
      finalMessage = <span><i className="fa fa-arrow-right" ></i> Drag Item from left & drop here <br /> or <br /> Click here to add a placeholder</span>;
    }else{
      finalMessage = <span>Drag Item from right & drop here <i className="fa fa-arrow-left" ></i> <br /> or <br /> Click here to add a placeholder</span>;
    }

    if (isDragging) {
      if (isActive) {
        finalStyle = activeStyle;
        finalMessage = <span> <br /> Drop Item Here <br /> <br /></span>;
      } else if (canDrop) {
        finalStyle = whileDragAllowedStyle;
        finalMessage = <span> <br /> Drop Item Here <br /> <br /></span>;
      } else {
        finalStyle = whileDragNotAllowedStyle;
        finalMessage = <span> <br /> Can not drop here <br /> <br /></span>;
      }
    } else {
    }

    return connectDropTarget(
      <div style={finalStyle} onClick={this.addPlaceHolder.bind(this)}>
        {finalMessage}
      </div>,
    );
  }
}
