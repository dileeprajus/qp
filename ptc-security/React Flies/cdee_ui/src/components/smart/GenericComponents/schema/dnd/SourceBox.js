/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';
import { Button } from 'react-bootstrap';

const style = {
  padding: '1rem 1rem',
  marginRight: '1rem',
  marginBottom: '1rem',
  marginTop: '1rem',
  cursor: 'move',
  width: '22rem',
  height: '8rem',
  overflow: 'auto'
};

const subtitleStyle = {
  fontWeight: 'bold',
  color: '#44A4FF',
  marginLeft: '0.5rem',
  fontSize: '75%'
};

const updateSelectedAttributeInsertion = ((masterComponent, node) => {
  let newmap = masterComponent.state.newMapContainer || {};
  newmap[node.whichSide] = node;
  masterComponent.setState({ newMapContainer: newmap });
});

const boxSource = {
  beginDrag(props) {
    return {
      node: props.node,
      whichSide: props.node.whichSide,
      masterComponent: props.masterComponent
    };
  },

  endDrag(props, monitor) {
    monitor.getItem().dragging = false;
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      updateSelectedAttributeInsertion(item.masterComponent, item.node);
    }
  },
  canDrag(props) {
    let alowDraggable = false;
    if (props.node.whichSide === 'source') {
      alowDraggable = true;
    } else {
      // If it is Target only allow draggable if attribute is not readonly
      alowDraggable = !props.node.readOnly;
    }
    return alowDraggable;
  }
};

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  canDrag: monitor.canDrag()
}))
export default class SourceBox extends Component {
  static propTypes = {
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isSearchMatch: PropTypes.bool
  };

  nodeAlreadyUsedInMapping() {
    let used = false;
    for (let i = 0; i < this.props.masterComponent.state.mappingSpec.length; i++) {
      let attriConcatStr = this.props.masterComponent.state.mappingSpec[i][this.props.node.whichSide].attrPrefix;
      if (attriConcatStr === this.props.node.attrPrefix) {
        used = true;
      }
    }
    return used;
  }

  insertOnClick(){
    updateSelectedAttributeInsertion(this.props.masterComponent, this.props.node);
  }


  render() {
    const { isDragging, connectDragSource, isSearchMatch, node } = this.props;
    const opacity = (isDragging || (node.readOnly && node.whichSide !== 'source')) ? 0.4 : 1;
    const border = isSearchMatch || (node.readOnly && node.whichSide !== 'source') ? '1px solid #2E99FF' : '1px dashed gray';
    const fontWeight = isSearchMatch ? 'bold' : 'normal';
    let readOnlyIconContd = (<Button bsSize="xsmall" className="pull-right" onClick={this.insertOnClick.bind(this)}><i className="fa fa-play" style={{ marginTop: '0.2em' }}></i></Button>);

    if (node.readOnly === true && this.props.node.whichSide !== 'source'){
      readOnlyIconContd = (<i
        className="fa fa-ban fa-fw pull-right" style={{ marginTop: '0.2em' }}
      />)
    }


    const handle = readOnlyIconContd;
    const nodeUsed = this.nodeAlreadyUsedInMapping();

    let backgroundColor = nodeUsed ? '#F1F8E9' : 'white';

    if(isSearchMatch){
      backgroundColor = '#C9E0B2';
    }

    let title = node.title;

    if (node.schemaSubset.title){
      title = <span><div>{node.title}</div> <div><code>{node.schemaSubset.title}</code></div></span>;
    }

    return connectDragSource(
      <div style={{ ...style, opacity, border, backgroundColor, fontWeight }}>
        {handle}
        {title}
        <div style={{ ...subtitleStyle }}>
          {node.subtitle}
          <span style={{ color: 'red', fontWeight: 'bold' }} hidden={!node.required}>*</span>
        </div>
      </div>,
    );
  }
}
