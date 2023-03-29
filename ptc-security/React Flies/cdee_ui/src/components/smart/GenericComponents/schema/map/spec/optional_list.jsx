/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, FormGroup, FormControl, ControlLabel, Radio } from 'react-bootstrap';

@inject('breadcrumb_store')
@observer
class OptionalList extends React.Component {
  constructor(props) {
    super(props);
    this.masterComponent = this.props.masterComponent;

    this.currenumMap = [];
    this.currenumMapObj = {};
    if (this.props.currMapSpec.mappingConf.enumMap) {
      this.currenumMap = this.props.currMapSpec.mappingConf['enumMap'];
      for (var i = 0; i < this.currenumMap.length; i++) {
        //form the currenumObj to display the already selected OptionalList
        this.currenumMapObj[this.currenumMap[i][0]] = [this.currenumMap[i][0], this.currenumMap[i][1]];
      }
    }

    this.setEnumListVals(); // fix for #254 bug
    this.state = {
      selectedOptionalList: this.currenumMap,
      selectedOPObj: this.currenumMapObj
    };
  }

  componentWillMount() {
    //   CODE HERE
  }
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setEnumListVals(); //fix for #254 bug
    }
  }

  setEnumListVals() { // to set source and target enum and enumDisplayNames values
    this.masterComponent = this.props.masterComponent;
    if (this.props.currMapSpec.source.schemaSubset) {
      this.sourceEnumList = this.props.currMapSpec.source.schemaSubset.enum ? this.props.currMapSpec.source.schemaSubset.enum : [];
      this.sourceEnumListDisplayNames = this.props.currMapSpec.source.schemaSubset.enumDisplayNames ? this.props.currMapSpec.source.schemaSubset.enumDisplayNames : this.sourceEnumList;
    } else {
      this.sourceEnumList = [];
      this.sourceEnumListDisplayNames = [];
    }
    if (this.props.currMapSpec.target.schemaSubset) {
      this.targetEnumList = this.props.currMapSpec.target.schemaSubset.enum ? this.props.currMapSpec.target.schemaSubset.enum : [];
      this.targetEnumListDisplayNames = this.props.currMapSpec.target.schemaSubset.enumDisplayNames ? this.props.currMapSpec.target.schemaSubset.enumDisplayNames : this.targetEnumList;
    } else {
      this.targetEnumList = [];
      this.targetEnumListDisplayNames = [];
    }
  }
  onChange(type, arr, event) {
    var list = this.state.selectedOPObj;
    if (type === 'source') {
      for (var k in list) { // first delete the key if it is already in list then update as new key
        if (list[k][1] === arr[0]) {
          delete list[k];
        }
      }
      if (event.target.value !== '') { //do not push if the input value is empty
        list[event.target.value] = [event.target.value, arr[0]];
      }
    } else if (type === 'target') {
      for (var k in list) { // first delete the key if it is already in list then update as new key
        if (list[k][0] === arr[0]) {
          delete list[k];
        }
        //fix for #311 & #298: When Update button is clicking in the optional list tab,already selected Wild card value is deselecting
        var selectedTarget = this.returnSelectedTarget();
        var selectedSource = this.returnSelectedSource(selectedTarget);
        if (selectedSource === arr[0] || selectedSource === '') { //fix for #256
          if (k === '*') {
            if (event.target.value === '') {
              delete list['*']; //Fix for #249:Optional List along with Wild card value is not removing in the Jolt and Map Spec even after it is removed
            }
          }
        }
      }
      if (event.target.value !== '') { //do not push if the input value is empty
        list[arr[0]] = [arr[0], event.target.value];
      }
    } else { }
    var temp = [];
    for (var k in list) {
      temp.push(list[k]);
    }
    this.setState({ selectedOPObj: list, selectedOptionalList: temp });
    this.onOptionalListUpdate('onChange', temp); //Fix for #300
  }
  onWildcardSelect(type, arr) {
    var list = this.state.selectedOPObj;
    if (type === 'source') { // if type is source then get the selected target value for this source from selectedOPObj state vlaue
      if (list[arr[0]]) {
        list['*'] = ['*', list[arr[0]][1]];
      }
    } else if (type === 'target') { // if type is target then directly assign the target key value arr[1] to *.
      list['*'] = ['*', arr[0]];
    } else {}
    var temp = [];
    for (var k in list) {
      temp.push(list[k]);
    }
    this.setState({ selectedOPObj: list, selectedOptionalList: temp });
    this.onOptionalListUpdate('onWildcard', temp); //Fix for #300
  }
  onSelect(sourceList, event) {
    var targetList = event.target.value.split(',');
    var list = this.state.selectedOPObj;
    if (targetList.length !== 1) {
      list[sourceList[0]] = [sourceList[0], targetList[0]];
    }
    if (targetList.length === 1) { //if selected option is 'select' then remove the key value from list
      delete list[sourceList[0]];
    }
    var starFound = false; //this variable is to find whether the selected wild card has target value or not other than 'Select' value
    var starArr = list['*'] ? list['*'] : [];
    if (starArr.length !== 0) {
      for (var k in list) {
        if (list[k][1] === starArr[1] && list[k][0] !== '*') {
          starFound = true;
        }
      }
      if (starFound === false) {
        delete list['*']; //Fix for #249:Optional List along with Wild card value is not removing in the Jolt and Map Spec even after it is removed
      }
    }
    var temp = [];
    for (var k in list) {
      temp.push(list[k]);
    }
    this.setState({ selectedOPObj: list, selectedOptionalList: temp });
    this.onOptionalListUpdate('onSelect', temp); //Fix for #300
  }

  onOptionalListUpdate(from, temp) {
    // adding selected optional list to current mapping conf set, which will further added to Jolt Map Spec
    if (this.props.currMapSpec.mappingConf === undefined) {
      this.props.currMapSpec.mappingConf = {};
    }
    this.props.currMapSpec.mappingConf['enumMap'] = temp ? temp : this.state.selectedOptionalList;
    var tempConf = this.props.masterComponent.props.mappingStore.configJson;
    let overallMapSpec = tempConf.mappingSpec;
    overallMapSpec[this.props.currMapSpecIndex] = this.props.currMapSpec;
    tempConf['mappingSpec'] = overallMapSpec;
    this.props.masterComponent.props.mappingStore.setvalue('configJson', tempConf);
  }
  returnSelectedTarget() {
    //returnSelectedTarget function will return the selectedTarget value
    //whose wildCard value is selected. this selectedTarget will be used to
    // find the selected source value and already selected wildcard value
    var selectedTarget = '';
    for (var j = 0; j < this.state.selectedOptionalList.length; j++) {
      if (this.state.selectedOptionalList[j][0] === '*') {
        selectedTarget = this.state.selectedOptionalList[j][1];
        break;
      }
    }
    return selectedTarget;
  }
  returnSelectedSource(selectedTarget) {
    //returnSelectedSource function will return the selectedSource value
    //this value will be used to check already selected wildcard value
    var selectedSource = '';
    for (var j = 0; j < this.state.selectedOptionalList.length; j++) {
      if (this.state.selectedOptionalList[j][1] === selectedTarget && this.state.selectedOptionalList[j][0] !== '*') {
        selectedSource = this.state.selectedOptionalList[j][0];
        break;
      }
    }
    return selectedSource;
  }
  returnDisplayTarget(inputType, optList) {
    var displayTarget;
    if (inputType === 'selectInput') {
      // for selectInput type displayTarget datatype is Array
      //because in option tag we are displaying both key and display value
      // so we need to return the targetEnumList [key, displayValue] for selectInput type
      displayTarget = [];
    } else displayTarget = '';
    var isTargetFind = false;
    for (var i = 0; i < this.state.selectedOptionalList.length; i++) {
      if (optList[0] === this.state.selectedOptionalList[i][0]) { //Check sourceEnumList key value is matches the selectedOptionalList[i][0] value
        if (inputType === 'selectInput') {
          var tempTarget = this.state.selectedOptionalList[i][1];
          for (var j = 0; j < this.targetEnumList.length; j++) {
            if (tempTarget === this.targetEnumList[j]) {
              displayTarget = [this.targetEnumList[j], this.targetEnumListDisplayNames[j]];
              isTargetFind = true;
              break;
            }
          }
        } else if (inputType === 'targetTextInput') {
          // return the target value for the sourceEnumList[0]
          displayTarget = this.state.selectedOptionalList[i][1];
          isTargetFind = true;
          break;
        } else {}
      } else if (optList[0] === this.state.selectedOptionalList[i][1]) { //Check targetEnumList key value is matches the selectedOptionalList[i][1] value
        if (inputType === 'sourceTextInput') {
          // return the source value for the targetEnumList[0]
          if (this.state.selectedOptionalList[i][0] !== '*') {
            displayTarget = this.state.selectedOptionalList[i][0];
            isTargetFind = true;
            break;
          }
        }
      }
      if (isTargetFind) {
        //break the loop if required value is found
        break;
      }
    }
    return displayTarget;
  }
  render() {
    var optionalList = [
      <Row key="OptionalListHeadings">
        <Col sm={4} md={4} lg={4} xs={4} style={{ textAlign: 'left' }}>
          Source Attribute Value
        </Col>
        <Col sm={4} md={4} lg={4} xs={4}>
          Target Attribute Value
        </Col>
        <Col sm={4} md={4} lg={4} xs={4} style={{ textAlign: 'center' }}>
          Wildcard Value
        </Col>
      </Row>
    ];
    var selectedTarget = this.returnSelectedTarget();
    if (this.targetEnumList.length === 0) {
      for (var i = 0; i < this.sourceEnumList.length; i++) {
        // show display name this.sourceEnumListDisplayNames[i] in control label but while passing data this.sourceEnumList[i]
        var selectedSource = this.returnSelectedSource(selectedTarget);
        var displayTarget = this.returnDisplayTarget('targetTextInput', [this.sourceEnumList[i], this.sourceEnumListDisplayNames[i]]);
        optionalList.push(
          <Row key={'row_' + this.sourceEnumList[i]}>
          <FormGroup key={'form_' + this.sourceEnumList[i]} className="navtab">
            <Col sm={4} md={4} lg={4} xs={4} style={{ textAlign: 'left' }}>
              <ControlLabel>{this.sourceEnumListDisplayNames[i]}</ControlLabel>
            </Col>
            <Col sm={4} md={4} lg={4} xs={4}>
              <FormControl
                type="text" key={this.sourceEnumList[i]} placeholder="Target value"
                name={this.sourceEnumList[i]}
                value={displayTarget}
                onChange={this.onChange.bind(this, 'target', [this.sourceEnumList[i], this.sourceEnumListDisplayNames[i]])}
              />
            </Col>
            <Col sm={4} md={4} lg={4} xs={4} style={{ textAlign: 'center' }}>
              <Radio
                name="new_target_text_optional_list" value={this.sourceEnumListDisplayNames[i]}
                onChange={this.onWildcardSelect.bind(this, 'source', [this.sourceEnumList[i], this.sourceEnumListDisplayNames[i]])} inline
                checked={selectedSource === this.sourceEnumList[i]}
              />
            </Col>
          </FormGroup>
          </Row>
        );
      }
    } else if (this.sourceEnumList.length === 0) {
      for (var i = 0; i < this.targetEnumList.length; i++) {
        // show display name this.sourceEnumListDisplayNames[i] in control label but while passing data this.sourceEnumList[i]
        var displayTarget = this.returnDisplayTarget('sourceTextInput', [this.targetEnumList[i], this.targetEnumListDisplayNames[i]]);
        optionalList.push(
          <Row key={'row_' + this.targetEnumList[i]} >
            <FormGroup key={'form_' + this.targetEnumList[i]} className="navtab">
              <Col sm={4} md={4} lg={4} xs={4}>
                <FormControl
                  type="text" key={this.targetEnumList[i]} placeholder="Source value"
                  name={this.targetEnumList[i]} value={displayTarget}
                  onChange={this.onChange.bind(this, 'source', [this.targetEnumList[i], this.targetEnumListDisplayNames[i]])}
                />
              </Col>
              <Col sm={4} md={4} lg={4} xs={4}>
                <ControlLabel>{this.targetEnumListDisplayNames[i]}</ControlLabel>
              </Col>
              <Col sm={4} md={4} lg={4} xs={4} style={{ textAlign: 'center' }}>
                <Radio
                  name="new_source_text_optional_list" value={this.targetEnumListDisplayNames[i]}
                  onChange={this.onWildcardSelect.bind(this, 'target', [this.targetEnumList[i], this.targetEnumListDisplayNames[i]])} inline
                  checked={selectedTarget === this.targetEnumList[i]}
                />
              </Col>
            </FormGroup>
          </Row>
        );
      }
    } else {
      var list = [];
      for (var i = 0; i < this.targetEnumList.length; i++) {
        // give the option tag value as [key, displayValue] which will be used to save the optional list
        list.push(
          <option
            key={this.targetEnumList[i]}
            value={[this.targetEnumList[i], this.targetEnumListDisplayNames[i]]}
          >{this.targetEnumListDisplayNames[i]}</option>
        );
      }
      for (var i = 0; i < this.sourceEnumList.length; i++) {
        var selectedSource = this.returnSelectedSource(selectedTarget);
        var displayTarget = this.returnDisplayTarget('selectInput', [this.sourceEnumList[i], this.sourceEnumListDisplayNames[i]] );
        optionalList.push(
          <Row key={'row_' + this.sourceEnumList[i]} >
            <FormGroup key={'form_' + this.sourceEnumList[i]} className="navtab">
              <Col sm={4} md={4} lg={4} xs={4}>
                <ControlLabel>{this.sourceEnumListDisplayNames[i]}</ControlLabel>
              </Col>
              <Col sm={4} md={4} lg={4} xs={4} >
                <FormGroup controlId="formControlsSelect">
                  <FormControl
                    componentClass="select" placeholder="Select" name="targetOPList"
                    onChange={this.onSelect.bind(this, [this.sourceEnumList[i], this.sourceEnumListDisplayNames[i]])}
                    value={displayTarget}
                  >
                    <option value="">Select</option>
                    {list}
                  </FormControl>
                </FormGroup>
              </Col>
              <Col sm={4} md={4} lg={4} xs={4} style={{ textAlign: 'center' }}>
                <Radio
                  name="new_target_select_optional_list" value={this.sourceEnumListDisplayNames[i]}
                  onChange={this.onWildcardSelect.bind(this, 'source', [this.sourceEnumList[i], this.sourceEnumListDisplayNames[i]])}
                  inline checked={selectedSource === this.sourceEnumList[i]}
                />
              </Col>
            </FormGroup>
          </Row>
        );
      }
    }

    // if (optionalList.length > 0 && optionalList.length !== 1) {
    //   optionalList.push(<Button key="optionalListUpdate" hidden={optionalList.length === 1} className="pull-right" bsStyle="primary" onClick={this.onOptionalListUpdate.bind(this)}>Update</Button>);
    // }
    return (
      <div>
        <div hidden={optionalList.length === 1}>
          {optionalList}
        </div>
        <div hidden={optionalList.length !== 1} style={{ textAlign: 'center' }}>
          <span style={{ color: 'lightgray' }}>
            There is no optional list for current mapping
          </span>
        </div>
      </div>
    );
  }
}

OptionalList.propTypes = {
  store: React.PropTypes.object
};

export default OptionalList;
