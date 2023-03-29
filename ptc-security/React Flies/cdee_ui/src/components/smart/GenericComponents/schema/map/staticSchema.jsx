/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree';
import { walk } from 'react-sortable-tree';
import SourceBox from '../dnd/SourceBox';

@inject('breadcrumb_store')
@observer
class StaticSchema extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: null,
      searchMatchedNodeIndex: 0,
      treeData: [],
      searchIcon:(<i className="fa fa-search"></i>)
    };
  }

  componentWillMount() {
    let updatedJson = this.getTreeFromSchema(this.props.schema, this.state.treeData, '');
    this.setState({ treeData: updatedJson });
  }

  getTreeFromSchema(schema, output, attrPrefix) {
    for (const k in schema) {
      const cloneWithoutChildren = Object.assign({}, schema[k]);
      cloneWithoutChildren.key = k;
      delete cloneWithoutChildren.properties;
      var tempReadOnly = false;
      if (schema[k].readOnly) {
        tempReadOnly = true;
      }
      if (schema[k].type === 'object') {
        let objAttrPrefix = attrPrefix + '.' + k;
        objAttrPrefix = objAttrPrefix.replace('.items', '.*');
        output.push({
          attrPrefix: objAttrPrefix,
          schemaSubset: schema[k],
          whichSide: this.props.whichSide,
          title: k,
          subtitle: schema[k].type,
          children: this.getTreeFromSchema(schema[k].properties, [], objAttrPrefix),
          expanded: true,
          required: schema[k].required,
          readOnly: tempReadOnly
        });
      } else if (schema[k].type === 'array') {
        let arryAttrPrefix = attrPrefix + '.' + k;
        arryAttrPrefix = arryAttrPrefix.replace('.items', '.*');
        output.push({
          attrPrefix: arryAttrPrefix,
          schemaSubset: schema[k],
          whichSide: this.props.whichSide,
          title: k,
          subtitle: schema[k].type,
          children: this.getTreeFromSchema(schema[k], [], arryAttrPrefix),
          expanded: true,
          required: schema[k].required,
          readOnly: tempReadOnly
        });
      } else {
        if (schema[k] !== null && typeof schema[k] === 'object' && schema[k].type !== undefined) {
          let endAttribute = attrPrefix + '.' + k;
          let endAttributeArray = endAttribute.split('.');
          if (endAttributeArray.lastIndexOf('items') > 0 ) { //IF there is an array element
          }
          output.push({
            attrPrefix: endAttribute,
            schemaSubset: schema[k],
            whichSide: this.props.whichSide,
            title: k,
            subtitle: schema[k].type,
            required: schema[k].required,
            readOnly: tempReadOnly
          });
        }
      }
    }
    return output;
  }

  handleChange(event){
    let searchIcon = (<i className="fa fa-search"></i>);
    if (event.target.value.length > 0){
      searchIcon = (<i className="fa fa-close" style={{cursor: 'pointer'}} onClick={() => this.setState({ searchQuery: null, searchIcon: <i className="fa fa-search"></i> }) }></i>);
    }
    this.setState({ searchQuery: event.target.value, searchIcon: searchIcon });
  }

  getTreeHeight(treeData) {
    let height = 1;
    walk({
      treeData,
      getNodeKey: ({ node: TreeNode, treeIndex: number }) => { // eslint-disable-line no-unused-vars
        return number;
      },
      callback: () => {
        height = height + 1;
      }
    });
    return height;
  }

  scrollToFirstmatchedNode(matchedInfo){
    let matchedTreeIndex = 0;
    if (matchedInfo.length > 0){
      matchedTreeIndex = matchedInfo[0].treeIndex;
    }
    this.setState({ searchMatchedNodeIndex: matchedTreeIndex });
  }

  render() {
    let rowHeight = 100;
    let treeHeight = rowHeight * 8;
    let scaffoldingWidth = 15;
    if ((this.getTreeHeight(this.state.treeData) * rowHeight) < treeHeight){
      treeHeight = (this.getTreeHeight(this.state.treeData) * rowHeight);
    }
     //code for custom filter for lower and  upper case letters.
    const customSearchMethod = ({ node, searchQuery }) =>
    searchQuery &&
    node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

    return (
      <div className="SchemaContainer">
        <Row style={{ margin: '0px 5px' }}>
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                value={this.state.searchQuery || ''}
                placeholder="Search attribute"
                onChange={this.handleChange.bind(this)}
              />
              <InputGroup.Addon>
                {this.state.searchIcon}
              </InputGroup.Addon>
            </InputGroup>
          </FormGroup>

        </Row>

          <Row style={{ height: treeHeight }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            canDrag={false}
            nodeContentRenderer={SourceBox}
            searchQuery={this.state.searchQuery}
            searchMethod ={customSearchMethod}
            searchFocusOffset={this.state.searchMatchedNodeIndex}
            searchFinishCallback={matchInfo =>
              this.scrollToFirstmatchedNode(matchInfo)
            }
            scaffoldBlockPxWidth={scaffoldingWidth}
            rowHeight = {rowHeight}
            generateNodeProps={() => ({
              masterComponent: this.props.master
            })}
          />

          </Row>
      </div>
    );
  }
}

StaticSchema.propTypes = {
  store: React.PropTypes.object
};

export default StaticSchema;
