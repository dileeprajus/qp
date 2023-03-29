/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Button, Label, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import SortableTree from 'react-sortable-tree';
import { getNodeAtPath, removeNodeAtPath, addNodeUnderParent, walk, changeNodeAtPath, defaultGetNodeKey } from 'react-sortable-tree';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import InlineTextBox from './inlineEdit/textbox';
import InlineOptionSelect from './inlineEdit/optionSelect';
import ValidationSettings from './validation_settings';

@inject('breadcrumb_store', 'modal_store')
@observer
class SchemaEdit extends React.Component {
  constructor(props) {
    super(props);
    this.modal_store = this.props.modal_store;
    this.updateTreeData = this.updateTreeData.bind(this);
    this.addNode = this.addNode.bind(this);
    this.removeNode = this.removeNode.bind(this);
    this.tempSchema = {};
    this.tempSchema = JSON.parse(JSON.stringify(this.returnSchema()));
    this.state = {
      schema: { schema: this.tempSchema },
      treeData: [],
      schemaWithoutProps: {},
      currentRowInfo: {},
      showModal: true,
      re_render_toggle: true,
      typeOptions: [
        { id: 'object', text: 'object' },
        { id: 'null', text: 'null' },
        { id: 'boolean', text: 'boolean' },
        { id: 'array', text: 'array' },
        { id: 'number', text: 'number' },
        { id: 'string', text: 'string' }
      ],
      requiredOptions: [
        { id: 'True', text: 'True' },
        { id: 'False', text: 'False' }
      ]
    };
  }

  returnSchema() {
    var temp = {};
    if (this.props.master.client_store.currentGroupType === 'source') {
      temp = this.props.master.client_store.outputSchema;
      temp = {'schema':temp}
    } else if (this.props.master.client_store.currentGroupType === 'target') {
      temp = this.props.master.client_store.inputSchema;
      temp = {'schema':temp}
    }
    return temp;
  }
  componentWillReceiveProps() {
    //passing store schema instead of props schema(this.props.schema) because schema is not reflecting immediately.
    let updatedSchema;
    let tempSchema = {};
    tempSchema = this.returnSchema();
    if (tempSchema.hasOwnProperty('schema')) {
      updatedSchema = JSON.parse(JSON.stringify(tempSchema));
    } else {
      updatedSchema = { schema: JSON.parse(JSON.stringify(tempSchema))};
    }
    this.updateJSON(updatedSchema);
  }

  updateJSON(updatedSchema){
    let updatedJson = this.getTreeFromSchema(updatedSchema, []);
    this.setState({ treeData: updatedJson, schema: updatedSchema });
  }

  getTreeFromSchema(schema, output) {
    for (const k in schema) {

      const cloneWithoutChildren = Object.assign({}, schema[k]);
      cloneWithoutChildren.key = k;
      delete cloneWithoutChildren.properties;
      if (schema[k]) {
        if (schema[k].type === 'object') {
          output.push({
            title: <InlineTextBox snode={cloneWithoutChildren} element_name="key" master={this} />,
            subtitle: <InlineOptionSelect snode={cloneWithoutChildren} element_name="type" master={this} optionsList={this.state.typeOptions}/>,
            children: this.getTreeFromSchema(schema[k].properties, []),
            expanded: true
          });
        } else if (schema[k].type === 'array') {
          output.push({
            title: <InlineTextBox snode={cloneWithoutChildren} element_name="key" master={this} />,
            subtitle: <InlineOptionSelect snode={cloneWithoutChildren} element_name="type" master={this} optionsList={this.state.typeOptions}/>,
            children: this.getTreeFromSchema({'items': schema[k].items}, []),
            expanded: true
          });
        } else {
          output.push({
            title: <InlineTextBox snode={cloneWithoutChildren} element_name="key" master={this} />,
            subtitle: <InlineOptionSelect snode={cloneWithoutChildren} element_name="type" master={this} optionsList={this.state.typeOptions}/>
          });
        }
      }
    }
    return output;
  }


  getSchemaFromTree(tree, output) {
    if (tree.constructor === Array) {
      for (let i = 0; i < tree.length; i++) {
        this.getSchemaFromTree(tree[i], output);
      }
    }
    if (tree.title !== undefined) {
      const attrName = tree.title.props.snode.key;

      const cloneWithoutKey = Object.assign({}, tree.title.props.snode);
      //Below if block is for bug no.183
      if(cloneWithoutKey.type==='object' && cloneWithoutKey.hasOwnProperty('items') && cloneWithoutKey.items.hasOwnProperty('properties')){
        delete cloneWithoutKey.items;
      }
      delete cloneWithoutKey.key;

      for (const k in tree) {
        if (k === 'title') {
          output[attrName] = cloneWithoutKey;
        }

        if (k === 'children') {
          for (let i = 0; i < tree[k].length; i++) {
            if (output[attrName].properties === undefined) {
              output[attrName].properties = {};
            }
            output[attrName].properties = this.getSchemaFromTree(tree[k][i], output[attrName].properties);
          }
          if (tree[k].length > 0) {
              //Below if block is for bug no.183
            if(output[attrName].type===(tree.hasOwnProperty('subtitle') ? tree.subtitle.props.snode.type:false)){
                output[attrName].type = tree.subtitle.props.snode.type;
                if(output[attrName].type==='array' && output[attrName].hasOwnProperty('properties') && output[attrName].hasOwnProperty('items')){
                    output[attrName].items = output[attrName].properties.items;
                    delete output[attrName].properties;
                }
            }else{
                output[attrName].type = 'object';
            }
          } else {
            output[attrName].type = 'string';
          }
        }
      }
    }
    return output;
  }


  // This is used to preserve state(Expanded or colapsed) information by comparing two tree information
  diffExpandedTree(oldTree, updatedTree) {
    if (oldTree.constructor === Array) {
      for (let i = 0; i < oldTree.length; i++) {
        this.diffExpandedTree(oldTree[i], updatedTree[i])
      }
    }

    for (let k in oldTree) {
      if (oldTree.title !== undefined) {
        if (k === 'expanded') {
          updatedTree[k] = oldTree[k];
        } else if (k === 'children') {
          for (let j = 0; j < oldTree[k].length; j++) {
            if (updatedTree[k]) {
              this.diffExpandedTree(oldTree[k][j], updatedTree[k][j]);
            }
          }
        } else {
          // do nothing
        }
      }
    }
    return updatedTree;
  }


  addNode(rowInfo) {
    let { path } = rowInfo;
    path.pop();
    const parentNode = getNodeAtPath({
      treeData: this.state.treeData,
      path,
      getNodeKey: ({ treeIndex }) => treeIndex,
      ignoreCollapsed: true
    });
    const getNodeKey = ({ node: object, treeIndex: number }) => { // eslint-disable-line no-unused-vars
      return number;
    };
    let parentKey = getNodeKey(parentNode);
    if (parentKey === -1) {
      parentKey = null;
    }

    const NEW_NODE = {
      title: <InlineTextBox
        snode={{
          key: ('AttributeName' + (parentNode.node.children.length + 1)),
          type: 'string'
        }}
        element_name={'key'}
        master={this}
      />,
      subtitle: <InlineOptionSelect
        snode={{ key: 'AttributeName', type: 'string' }}
        element_name={'type'}
        master={this}
      />
    };

    const newTree = addNodeUnderParent({
      treeData: this.state.treeData,
      newNode: NEW_NODE,
      expandParent: true,
      parentKey,
      getNodeKey: ({ treeIndex }) => treeIndex
    });
    this.updateTreeData(newTree.treeData);
  }

  removeNode(rowInfo) {
    let { path } = rowInfo;
    this.updateTreeData(removeNodeAtPath({
      treeData: this.state.treeData,
      path,   // You can use path from here
      getNodeKey: ({ node: TreeNode, treeIndex: number }) => { // eslint-disable-line no-unused-vars
        //
        return number;
      },
      ignoreCollapsed: false
    })
    );
  }
  updateTreeData(treeData) {
    const updatedSchema = this.getSchemaFromTree(treeData, {});
    const updatedTreeData = this.getTreeFromSchema(updatedSchema, []);
    // below is used to just persist expand and collapse of tree state only
    const expandedUpdateTree = this.diffExpandedTree(treeData, updatedTreeData);
    const newValidationTree = this.updateSelectedRow(expandedUpdateTree);
    this.setState({
      schema: updatedSchema
    });
    this.setState({
      treeData: newValidationTree,
      re_render_toggle: !this.state.re_render_toggle
    });
  }

  validationSettings(rowInfo) {
    this.setState(
      {
        currentRowInfo: rowInfo,
        showModal: true
      }
    );
  }

  updateSelectedRow(treeData) {
    walk({
      treeData,
      getNodeKey: ({ node: TreeNode, treeIndex: number }) => { // eslint-disable-line no-unused-vars
        //
        return number;
      },
      callback: (rowInfo) => {
        if (rowInfo.path.join(',') === (this.state.currentRowInfo.path || []).join(',')) {
          rowInfo.node = this.state.currentRowInfo.node;
          treeData = changeNodeAtPath({
            treeData,
            path: rowInfo.path,
            newNode: this.state.currentRowInfo.node,
            getNodeKey: defaultGetNodeKey
          });
        }
      }
    });
    return treeData;
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

  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  updateSchemaAndTree(newSchema) {
    if (Object.keys(JSON.parse(newSchema)).length === 0) {
      newSchema = '{"schema":{}}';
    }
    if (this.IsJsonString(newSchema)) {
      this.updateJSON(JSON.parse(newSchema));
      if (this.props.master.client_store.store_name === 'RestClientStore') {
        var configObj =  this.props.master.client_store.configJson;
        if (this.props.master.client_store.currentGroupType === 'source') {
          configObj['outputSchema'] = JSON.parse(newSchema);
        } else if (this.props.master.client_store.currentGroupType === 'target') {
          configObj['inputSchema'] = JSON.parse(newSchema);
        }
        this.props.master.client_store.setvalue('configJson', configObj);
      }
      if (this.props.master.client_store.currentGroupType === 'source') {
        this.props.master.client_store.setvalue('outputSchema', JSON.parse(newSchema));
      } else if (this.props.master.client_store.currentGroupType === 'target') {
        this.props.master.client_store.setvalue('inputSchema', JSON.parse(newSchema));
      }
      if (this.props.master.client_store.store_name === 'SoapConfigStore') {
        var config = this.props.master.client_store.configJson;
        if (this.props.master.client_store.currentGroupType === 'source') {
          config['SelectedResponseSchema'] = JSON.parse(newSchema);
          this.props.brs.setvalue('responseXSD2Json', JSON.parse(newSchema));
        } else if (this.props.master.client_store.currentGroupType === 'target') {
          config['SelectedRequestSchema'] = JSON.parse(newSchema);
          this.props.brs.setvalue('requestXSD2Json', JSON.parse(newSchema));
        }
        this.props.master.client_store.setvalue('configJson', config);
      }
      this.props.master.client_store.SetPropValues({ inputSchema: this.props.master.client_store.inputSchema, outputSchema: this.props.master.client_store.outputSchema });
    }
  }

  updateOnlySchema(newSchema) {
    if (this.IsJsonString(newSchema)) {
      this.setState({ schema: JSON.parse(newSchema) });
    }
  }

  downloadSchema(){
    var fileDownload = require('js-file-download');
    var downloadable_config = {}
    downloadable_config = this.returnSchema();
    fileDownload(JSON.stringify(downloadable_config), 'Schema_'+this.props.master.client_store.name+'.json');
  }



  render() {
    var codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: false,
      extraKeys: {
        'Ctrl-S': function (instance) { this.updateSchemaAndTree(instance.getValue()); }.bind(this),
        'Ctrl-/': 'undo'
      }
    };
    var download_schema_tooltip = (<Tooltip id="tooltip-download-schema"><strong>Download </strong> Schema.</Tooltip>)
    return (
      <div>
        <ValidationSettings rowInfo={this.state.currentRowInfo} master={this} />
        <Col xs={6} sm={6} md={6} lg={6} style={{ height: (this.getTreeHeight(this.state.treeData) * 66) }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={this.updateTreeData.bind(this)}
            generateNodeProps={rowInfo => ({
              buttons: [
                <div>
                  <Button
                    bsSize="xsmall"
                    label="Settings"
                    onClick={() => this.validationSettings(rowInfo)}
                  >
                    <i className="fa fa-gear"></i>
                  </Button>
                  <Button
                    bsSize="xsmall"
                    label="Add"
                    onClick={() => this.addNode(rowInfo)}
                  >
                    <i className="fa fa-plus-square"></i>
                  </Button>
                  <Button
                    bsSize="xsmall"
                    label="Delete"
                    onClick={() => this.removeNode(rowInfo)}
                  >
                    <i className="fa fa-window-close"></i>
                  </Button>
                </div>
              ],
              title: [<p>row</p>],
              style: {
                height: '50px'
              }
            })}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} >


          <Row style={{ textAlign: 'left' }}>
            Press <Label bsStyle="info">Ctrl + S</Label> to save changes from code editor.
            <OverlayTrigger rootClose={true} placement="left" overlay={download_schema_tooltip}>
              <Button
                className="pull-right"
                bsSize="xsmall"
                bsStyle="info"
                onClick={this.downloadSchema.bind(this)}
                >
                <i className="fa fa-download"></i>
              </Button>
            </OverlayTrigger>
          </Row>
          <Row>
            <CodeMirror
              value={JSON.stringify(this.state.schema, null, 2)}
              onChange={this.updateOnlySchema.bind(this)} options={codeOptions}
            />
          </Row>
        </Col>
      </div>
    );
  }
}

SchemaEdit.propTypes = {
  store: React.PropTypes.object
};

export default SchemaEdit;
