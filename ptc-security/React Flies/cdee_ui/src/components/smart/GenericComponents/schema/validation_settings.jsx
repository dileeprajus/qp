/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { OverlayTrigger, Popover, Button, Modal, Table, Tabs, Tab } from 'react-bootstrap';
import InlineTextBox from './inlineEdit/textbox';
import InlineOptionSelect from './inlineEdit/optionSelect';
import TypeManagerStore from '../../../../stores/TypeManagerStore';
import ScriptFilters from './transformationRules/script_filters';
import MultipleOf from './validationTypes/multipleOf';
import Maximum from './validationTypes/maximum';
import ExclusiveMaximum from './validationTypes/exclusiveMaximum';
import Minimum from './validationTypes/minimum';
import ExclusiveMinimum from './validationTypes/exclusiveMinimum';
import MaxLength from './validationTypes/maxLength';
import MinLength from './validationTypes/minLength';
import Pattern from './validationTypes/pattern';
import AdditionalItems from './validationTypes/additionalItems';
import MaxItems from './validationTypes/maxItems';
import MinItems from './validationTypes/minItems';
import UniqueItems from './validationTypes/uniqueItems';
import Contains from './validationTypes/contains';
import MaxProperties from './validationTypes/maxProperties';
import MinProperties from './validationTypes/minProperties';
import Required from './validationTypes/required';
import Type from './validationTypes/type';
import PatternProperties from './validationTypes/patternProperties';
import AdditionalProperties from './validationTypes/additionalProperties';
import Dependencies from './validationTypes/dependencies';
import PropertyNames from './validationTypes/propertyNames';
import Enum from './validationTypes/enum';
import Const from './validationTypes/const';
import AllOf from './validationTypes/allOf';
import AnyOf from './validationTypes/anyOf';
import OneOf from './validationTypes/oneOf';
import Not from './validationTypes/not';
import 'codemirror/mode/javascript/javascript';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class ValidationSettings extends React.Component {
  constructor(props) {
    super(props);
    this.type_manager_store = new TypeManagerStore('TypeManagerConfig');
    this.state = {
      activeTab: 1,
      showModal: this.props.showModal,
      // TODO: Need to fetch all available object types here
      typeOptions: [
        { id: 'object', text: 'object' },
        { id: 'null', text: 'null' },
        { id: 'boolean', text: 'boolean' },
        { id: 'array', text: 'array' },
        { id: 'number', text: 'number' },
        { id: 'string', text: 'string' }
      ],
      validationComponentName: {
        multipleOf: {
          component_name: MultipleOf, display_name: 'MultipleOf', type_name: 'multipleOf', description : 'A numeric instance is valid against "multipleOf" if the result of the division of the instance by this keywords value is an integer'
        },
        maximum: {
          component_name: Maximum, display_name: 'Maximum', type_name: 'maximum', description: 'This attribute defines the maximum value of the instance property when the type of the instance value is a number'
        },
        exclusiveMaximum: {
          component_name: ExclusiveMaximum, display_name: 'ExclusiveMaximum', type_name: 'exclusiveMaximum', description: 'This attribute indicates if the value of the instance (if theinstance is a number) can not equal the number defined by the"maximum" attribute.  This is false by default meaning the instance value can be less then or equal to the maximum value'
        },
        minimum: {
          component_name: Minimum, display_name: 'Minimum', type_name: 'minimum', description :'This attribute defines the minimum value of the instance property when the type of the instance value is a number'
        },
        exclusiveMinimum: {
          component_name: ExclusiveMinimum, display_name: 'ExclusiveMinimum', type_name: 'exclusiveMinimum', description : 'This attribute indicates if the value of the instance (if the instance is a number) can not equal the number defined by the "minimum" attribute.  This is false by default, meaning the instance value can be greater then or equal to the minimum value'
        },
        maxLength: {
          component_name: MaxLength, display_name: 'MaxLength', type_name: 'maxLength', description : ' When the instance value is a string, this defines the maximum length of the string'
        },
        minLength: {
          component_name: MinLength, display_name: 'MinLength', type_name: 'minLength', description : 'When the instance value is a string, this defines the minimum length of the string'
        },
        pattern: {
          component_name: Pattern, display_name: 'Pattern', type_name: 'pattern', description : 'When the instance value is a string, this provides a regular expression that a string instance MUST match in order to be valid'
        },
        additionalItems: {
          component_name: AdditionalItems, display_name: 'AdditionalItems', type_name: 'additionalItems', description : 'This provides a definition for additional items in an array instance when tuple definitions of the items is provided.  This can be false to indicate additional items in the array are not allowed, or it can be a schema that defines the schema of the additional items'
        },
        maxItems: {
          component_name: MaxItems, display_name: 'MaxItems', type_name: 'maxItems', description : 'This attribute defines the maximum number of values in an array when the array is the instance value'
        },
        minItems: {
          component_name: MinItems, display_name: 'MinItems', type_name: 'minItems', description : 'This attribute defines the minimum number of values in an array when the array is the instance value'
        },
        uniqueItems: {
          component_name: UniqueItems, display_name: 'UniqueItems', type_name: 'uniqueItems', description: 'This attribute indicates that all items in an array instance MUST be unique (contains no two identical values)'
        },
        contains: {
          component_name: Contains, display_name: 'Contains', type_name: 'contains', description : 'The array is valid if it contains at least one item that is valid according to this schema'
        },
        maxProperties: {
          component_name: MaxProperties, display_name: 'MaxProperties', type_name: 'maxProperties', description : 'An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword'
        },
        minProperties: {
          component_name: MinProperties, display_name: 'MinProperties', type_name: 'minProperties', description : 'An object instance is valid against "minProperties" if its number of properties is greater than, or equal to, the value of this keyword'
        },
        required: {
          component_name: Required, display_name: 'Required', type_name: 'required', description: 'This attribute indicates if the instance must have a value, and not be undefined.  This is false by default, making the instance optional'
        },
        type: {
          component_name: Type, display_name: 'Type', type_name: 'type', description : 'This attribute defines what the primitive type or the schema of the instance MUST be in order to validate'
        },
        patternProperties: {
          component_name: PatternProperties, display_name: 'PatternProperties', type_name: 'patternProperties', description : 'This attribute is an object that defines the schema for a set of property names of an object instance'
        },
        additionalProperties: {
          component_name: AdditionalProperties, display_name: 'AdditionalProperties', type_name: 'additionalProperties', description : 'This attribute defines a schema for all properties that are not explicitly defined in an object type definition'
        },
        dependencies: {
          component_name: Dependencies, display_name: 'Dependencies', type_name: 'dependencies', description : 'This attribute is an object that defines the requirements of a property on an instance object.  If an object instance has a property with the same name as a property in this attributes object then the instance must be valid against the attributes property value'
        },
        propertyNames: {
          component_name: PropertyNames, display_name: 'PropertyNames', type_name: 'propertyNames', description : 'For data object to be valid each property name in this object should be valid according to this schema'
        },
        enum: {
          component_name: Enum, display_name: 'Enum', type_name: 'enum', description : 'This provides an enumeration of all possible values that are valid for the instance property.  This MUST be an array, and each item in the array represents a possible value for the instance value'
        },
        const: {
          component_name: Const, display_name: 'Const', type_name: 'const', description : 'The value of this keyword can be anything. The data is valid if it is deeply equal to the value of the keyword'
        },
        allOf: {
          component_name: AllOf, display_name: 'AllOf', type_name: 'allOf', description : 'An instance is valid against this keyword if and only if it is valid against all the schemas in this keywords value'
        },
        anyOf: {
          component_name: AnyOf, display_name: 'AnyOf', type_name: 'anyOf', description : 'An instance is valid against this keyword if and only if it is valid against at least one schema in this keywords value'
        },
        oneOf: {
          component_name: OneOf, display_name: 'OneOf', type_name: 'oneOf', description : 'An instance is valid against this keyword if and only if it is valid against exactly one schema in this keywords value'
        },
        not: {
          component_name: Not, display_name: 'Not', type_name: 'not', description : 'An instance is valid against this keyword if and only if it fails to validate against this keywords value'
        }
      },
      typeToComponent: [
        { type: 'object', components: ['required', 'patternProperties','maxProperties','minProperties'] },
        { type: 'null', components: ['required'] },
        { type: 'boolean', components: ['required', 'enum', 'const', 'not'] },
        { type: 'array', components: ['required', 'enum', 'const', 'not', 'additionalItems', 'maxItems', 'minItems', 'uniqueItems', 'contains'] },
        { type: 'number', components: ['required', 'enum', 'const', 'not', 'multipleOf', 'maximum', 'exclusiveMaximum', 'minimum', 'exclusiveMinimum'] },
        { type: 'string', components: ['required', 'enum', 'const', 'not', 'maxLength', 'minLength', 'pattern'] }
      ]
    };
  }

  componentWillMount() {
    this.type_manager_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    this.type_manager_store.GetFilterScripts;
    this.type_manager_store.GetDataTypes;
  }

  close() {
    this.props.master.setState({ showModal: false });
  }

  open() {
    this.props.master.setState({ showModal: true });
  }

  handleSelect(activeTab) {
    this.setState({ activeTab });
  }


  render() {
    const nameTooltip = (
      <Popover id="modal-popover" title="Name">
        This attribute is a string that provides a full description of the of purpose the instance property
      </Popover>
    );
    const typeTooltip = (
      <Popover id="modal-popover" title="Type">
        This attribute defines what the primitive type or the schema of the instance MUST be in order to validate
      </Popover>
    );

    let modalRender = '';
    let staticValidationPropRender = [];

    if(this.props.master.state.currentRowInfo.node){
      for(let i = 0; i < this.state.typeToComponent.length; i++){
        if (this.state.typeToComponent[i].type === this.props.master.state.currentRowInfo.node.title.props.snode.type ){
          for(let j = 0; j < this.state.typeToComponent[i].components.length; j++){
            let validation_keyword_name = this.state.typeToComponent[i].components[j]
            let component = this.state.validationComponentName[validation_keyword_name].component_name;
            let description = this.state.validationComponentName[validation_keyword_name].description;
            let display_name = this.state.validationComponentName[validation_keyword_name].display_name;
            const descTooltip = (
              <Popover id="modal-popover" title={display_name}>
                  {description}
             </Popover>
            );
            staticValidationPropRender.push(
              <tr key={validation_keyword_name}>
                <td className="col-md-2"><OverlayTrigger overlay={descTooltip}><b>{display_name}</b></OverlayTrigger> </td>
                <td className="col-md-8">
                  {
                    React.createElement(component,
                      {
                        snode: this.props.master.state.currentRowInfo.node.title.props.snode,
                        element_name: validation_keyword_name,
                        master: this.props.master
                      }
                    )
                  }
                </td>
              </tr>
            );
          }
        }
      }
    }

    if (this.props.master.state.currentRowInfo.node !== undefined) {
      modalRender =
        (<Modal show={this.props.master.state.showModal} onHide={this.close.bind(this)} bsSize="lg" >
        <Modal.Header  closeButton>
          <Modal.Title>Attribute Meta Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey={1} activeKey={this.state.activeTab} onSelect={this.handleSelect.bind(this)} id="controlled-tab-example">
            <Tab tabClassName="arrowshapetab" eventKey={1} title="Validation Rules">
              <Table striped bordered condensed hover>
                <tbody className="tablealign">
                  <tr>
                    <td className="col-md-2"><OverlayTrigger overlay={nameTooltip}><b>Name</b></OverlayTrigger> </td>
                    <td className="col-md-8">
                      <InlineTextBox
                        snode={this.props.master.state.currentRowInfo.node.title.props.snode}
                        element_name="key"
                        master={this.props.master}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="col-md-2"><OverlayTrigger overlay={typeTooltip}><b>Type</b></OverlayTrigger> </td>
                    <td className="col-md-8"> <InlineOptionSelect
                      snode={this.props.master.state.currentRowInfo.node.title.props.snode}
                      element_name="type" master={this.props.master}
                      optionsList={this.state.typeOptions}
                    /> </td>
                  </tr>
                  {staticValidationPropRender}

                </tbody>
              </Table>
            </Tab>
            <Tab tabClassName="arrowshapetab" eventKey={3} title="Transformation Scriptlets">
              <ScriptFilters
                source_key="host"
                destination_key="client"
                snode={this.props.master.state.currentRowInfo.node.title.props.snode}
                master={this.props.master}
                type_manager_store={this.type_manager_store}
                from="schema_edit"
                prop_key="TransformationRules"
              />
            </Tab>
          </Tabs>
          </Modal.Body>
          <Modal.Footer className="modal-footer" data-reactid="1758" >
            <Button className="btn btn-default" bsStyle="default" onClick={this.close.bind(this)}>Close</Button>
          </Modal.Footer>
      </Modal>
      );
    }

    return (
      <div>
        {modalRender}
      </div>
    );
  }
}

ValidationSettings.propTypes = {
  store: React.PropTypes.object
};

export default ValidationSettings;
