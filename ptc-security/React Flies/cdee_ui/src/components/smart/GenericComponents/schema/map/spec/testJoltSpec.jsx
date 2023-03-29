/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import CDEEBussinessRulesStore from '../../../../../../stores/CDEEBussinessRulesStore';

import jsf from 'json-schema-faker';
import api from 'json-schema-compatibility';

@inject('breadcrumb_store', 'generic_master_store', 'cdee_bussiness_rules_store')
@observer
class TestJoltSpec extends React.Component {
  constructor(props) {
    super(props);
    this.brs = new CDEEBussinessRulesStore();
    this.generic_master_store = this.props.generic_master_store;
    this.cdee_bussiness_rules_store = this.props.cdee_bussiness_rules_store;
    this.state = {
      toggleSpec: true,
      sample_source: {}
    }
  }

  componentWillMount() {
      this.props.cdee_bussiness_rules_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
  }

  modifyTargetAttrString(unSrcPrefixArr, targetPrefixArr){
    let firstIndexSrc = 0;

    let targetStarLastIndex = targetPrefixArr.lastIndexOf('*');
    let srcStarLastIndex = unSrcPrefixArr.lastIndexOf('*');

    if (srcStarLastIndex > -1) {
      firstIndexSrc = unSrcPrefixArr.length - srcStarLastIndex;
    }

    if (targetStarLastIndex > -1){
      if (firstIndexSrc > -1){
        targetPrefixArr[targetStarLastIndex] = '[#' + firstIndexSrc + ']';
        unSrcPrefixArr[srcStarLastIndex] = '-';
      }else{
        targetPrefixArr[targetStarLastIndex] = '[#0]'
      }
      targetPrefixArr = this.modifyTargetAttrString(unSrcPrefixArr, targetPrefixArr);
    }
    return targetPrefixArr;
  }

  iterateAndConstructDefaultSpecJSON(output, unchangedSrcPrefix,unchangedTrgtPrefix, srcItrPrefix, trgtItrPrefix,RemoteSourcesObj){
    let srcItrArray = [];
    let trgtItrArray = [];
    if (srcItrPrefix){
      srcItrArray = srcItrPrefix.split('.');
    }

    if (trgtItrPrefix) {
      trgtItrArray = trgtItrPrefix.split('.');
      if (trgtItrArray.lastIndexOf('*') > -1){
        trgtItrPrefix = this.modifyTargetAttrString(unchangedSrcPrefix.split('.'), trgtItrArray).join('.');
      }
    }
    let currentIndexKey = srcItrArray[0] || '';
    let nextSubset = srcItrArray.splice(1);

    if (nextSubset.length > 0) {
      if (currentIndexKey !== '') {
        if(output[currentIndexKey] === undefined){
          output[currentIndexKey] = {};
        }
        else if(typeof output[currentIndexKey]==='string'){
          var temp_value = output[currentIndexKey];
          output[currentIndexKey]={}
          output[currentIndexKey]['@']=[temp_value];
        }
        else{}
        output[currentIndexKey] = this.iterateAndConstructDefaultSpecJSON(output[currentIndexKey], unchangedSrcPrefix, unchangedTrgtPrefix,nextSubset.join('.'), trgtItrPrefix,RemoteSourcesObj);
      } else {
        output = this.iterateAndConstructDefaultSpecJSON(output, unchangedSrcPrefix,unchangedTrgtPrefix, nextSubset.join('.'), trgtItrPrefix,RemoteSourcesObj);
      }
    } else {
      if(output[currentIndexKey]===undefined){
        if(currentIndexKey==='*'){
          if (unchangedTrgtPrefix) {
            trgtItrArray = unchangedTrgtPrefix.split('.');
            if (trgtItrArray.lastIndexOf('*') > -1){
              var temp_src_prefix = unchangedSrcPrefix+'.@';
              trgtItrPrefix = this.modifyTargetAttrString(temp_src_prefix.split('.'), trgtItrArray).join('.');
            }
          }
          output[currentIndexKey] = {'@':[trgtItrPrefix]}
        }
        else{
          output[currentIndexKey] = trgtItrPrefix;
        }
      }
      else{
        if(typeof output[currentIndexKey]==='string'){
          var temp = [output[currentIndexKey]];
          if(temp.indexOf(trgtItrPrefix)===-1){
            temp.push(trgtItrPrefix);
          }
          output[currentIndexKey] = temp;
        }
        else if(typeof output[currentIndexKey]==='object' && output[currentIndexKey].length===undefined){
          if (unchangedTrgtPrefix) {
            trgtItrArray = unchangedTrgtPrefix.split('.');
            if (trgtItrArray.lastIndexOf('*') > -1){
              var temp_src_prefix = unchangedSrcPrefix+'.@';
              trgtItrPrefix = this.modifyTargetAttrString(temp_src_prefix.split('.'), trgtItrArray).join('.');
            }
          }
          if(output[currentIndexKey]['@']==undefined){
            output[currentIndexKey]['@'] = [trgtItrPrefix];
          }
          else{
            output[currentIndexKey]['@'].push(trgtItrPrefix);
          }
        }
        else if(typeof output[currentIndexKey]==='object' && output[currentIndexKey].length!==undefined){//if array
          var temp = output[currentIndexKey];
          if(temp.indexOf(trgtItrPrefix)===-1){
            temp.push(trgtItrPrefix);
          }
          output[currentIndexKey] = temp;
        }
        else{
          if(output[currentIndexKey] !== trgtItrPrefix){
            output[currentIndexKey] = trgtItrPrefix;
          }
        }
      }
    }
    return output;
  }


  iterateAndConstructCustomSpecJSON(output, unchangedSrcPrefix, srcItrPrefix, trgtItrPrefix, mappingConf,customRule,index) {

    if (mappingConf) {
        let srcItrArray = [];
        let trgtItrArray = [];

        if (srcItrPrefix) {
          srcItrArray = srcItrPrefix.split('.');
        }
        if (trgtItrPrefix) {
          trgtItrArray = trgtItrPrefix.split('.');
          if (trgtItrArray.lastIndexOf('*') > -1) {
            trgtItrPrefix = this.modifyTargetAttrString(unchangedSrcPrefix.split('.'), trgtItrArray).join('.');
          }
        }
        let currentIndexKey = srcItrArray[0] || '';
        let nextSubset = srcItrArray.splice(1);

        if (nextSubset.length > 0) {
          if (currentIndexKey !== '') {
            if (output[currentIndexKey] === undefined) {
              output[currentIndexKey] = {};
            }
            this.iterateAndConstructCustomSpecJSON(output[currentIndexKey], unchangedSrcPrefix, nextSubset.join('.'), trgtItrPrefix, mappingConf,customRule,index);
          } else {
            this.iterateAndConstructCustomSpecJSON(output, unchangedSrcPrefix, nextSubset.join('.'), trgtItrPrefix, mappingConf,customRule,index);
          }
        } else {
          if (customRule==='enumMap' && mappingConf['enumMap']) {
              let input_str = JSON.stringify(mappingConf['enumMap'])//.replace(/"/g, '\\"');
              output[currentIndexKey] = '=optionalList(@(1,' + currentIndexKey + "),'" + input_str + "')";
        }
        if(customRule==='TransformationRules' && mappingConf['TransformationRules']){
          let input_obj = {
            mappingConfigName :this.props.masterComponent.props.mappingStore.name,
            mappingSpecIndex:String(index),
            mappingGroupName :this.props.masterComponent.props.mappingStore.currentGroupName,
            'tenantId': this.props.masterComponent.props.mappingStore.currentTenantID ? this.props.masterComponent.props.mappingStore.currentTenantID : ''
          };
          if(currentIndexKey==='*'){
            var array_index = unchangedSrcPrefix.split('.')
            //currentIndexKey[currentIndexKey.length-2][0] this is to fetch before vlaue of * and [&] is to get each value from array in each iteration
            output[currentIndexKey] = '=customScript(@(2,' + array_index[array_index.length-2]+"[&]),'"+ JSON.stringify(input_obj) + "')";
          }
          else{
            output[currentIndexKey] = '=customScript(@(1,' + currentIndexKey + "),'"+ JSON.stringify(input_obj) + "')";
          }
        }
        if(customRule==='placeHolders' && mappingConf['placeHolders']){
          var ph_types = Object.keys(mappingConf['placeHolders']);
          if(ph_types.length===2){ //if both source and target are placeHolders
            output[mappingConf['placeHolders']['target']['placeholderKey']] = mappingConf['placeHolders']['source']['placeholderValue'];
          }
          else if(ph_types.length===1 && ph_types[0]==='source'){ //if source is a placeHolder
            output[currentIndexKey] = mappingConf['placeHolders']['source']['placeholderValue'];
          }
          else if(ph_types.length===1 && ph_types[0]==='target'){//if target is a placeHolder
            output[mappingConf['placeHolders']['target']['placeholderKey']] = '@(1,' + currentIndexKey+')';
          }
        }
        if(customRule==='StaticValue'){
          output[currentIndexKey] = index.replace('$@$','');
        }
        if(customRule==='RemoteAPIConfig' && mappingConf['RemoteAPIConfig']){
          //for now at a time from only one source data will be fetched
          for(var ki in mappingConf['RemoteAPIConfig']){
            var config_name = ki;
          }// so only one config_name will be there

          var sourceObj = this.generic_master_store.returnSelectedObject('source', config_name);
          var end_point_obj = {
            'ConfigName': config_name,
            'ServiceName': 'PullInputDataStream',
            'GroupName': sourceObj.Group,
            'tenantId': this.props.masterComponent.props.mappingStore.currentTenantID ? this.props.masterComponent.props.mappingStore.currentTenantID : ''
          }
          var MCC = {
            source_group_name: '',
            source_config_name: '',
            target_group_name: '',
            target_config_name: '',
            mapping_group_name: '',
            mapping_config_name: '',
            primary_key_at_dataprovider: ''
          }
          var level = unchangedSrcPrefix.split('.').length;
          var request_variables = '@('+level+',JOLT_TEMP.remoteAPI.'+config_name+')';
          var current_index = '@(' + 1 + ',_index)';
          var delim = mappingConf['RemoteAPIConfig'][config_name]['TargetDelimeter'];
          if (delim === 'RootObject'){
            delim = '.schema.RootObject';
          }
          output[currentIndexKey] = "=getAPIService('" + JSON.stringify(end_point_obj) + "','" + JSON.stringify(MCC) + "'," + request_variables + ',' + current_index + ',' +delim+')';

        }
      }
    }
        return output;
  }

  iterateAndConstructRemoteSpecJSON(RemoteSourcesObj,configJson){
    var output = {}
    for(var key in RemoteSourcesObj){
      var sourceObj = this.generic_master_store.returnSelectedObject('source', key);
      var end_point_obj = {
        'ConfigName': key,
        'ServiceName': 'PullInputDataStream',
        'GroupName': sourceObj.Group,
        'tenantId': this.props.masterComponent.props.mappingStore.currentTenantID ? this.props.masterComponent.props.mappingStore.currentTenantID : ''
      }
      var MCC = {
          'source_group_name': configJson.SourceConfig.GroupName,
          'source_config_name': configJson.SourceConfig.Name,
          'target_group_name': configJson.TargetConfig.GroupName,
          'target_config_name': configJson.TargetConfig.Name,
          'mapping_group_name': this.props.masterComponent.props.mappingStore.currentGroupName,
          'mapping_config_name': this.props.masterComponent.props.mappingStore.name,
          'primary_key_at_dataprovider': ''
      }
      var request_variables = '@(2,JOLT_TEMP.inputVar.'+key+')';
      var PrimaryKey = '@(2,JOLT_TEMP.PrimaryKey)';
      output[key] = "=initiateAsync('"+ JSON.stringify(end_point_obj) + "','"+JSON.stringify(MCC)+"',"+request_variables+','+PrimaryKey+')';
    }
    return output;
  }


  convertMappingSpecToJoltSpec(configJson) {
    var mapSpec = configJson.mappingSpec;
    var RemoteSourcesObj = configJson.RemoteSourceConfig;
    let joltSpecDefault = {};
    let joltCustomSpec = {};
    let joltTextInput = {};
    var customMappingConf = ['placeHolders','enumMap', 'RemoteAPIConfig','TransformationRules']; //order is important here, always placeHolders should execute first.

    for (let i = 0; i < mapSpec.length; i++) {
      let currentMapAttr = mapSpec[i];
      let { source, target } = currentMapAttr;
      let mappingConf = currentMapAttr['mappingConf'];
      if (source.attrPrefix && target.attrPrefix && mappingConf['placeHolders']===undefined){
        joltSpecDefault = this.iterateAndConstructDefaultSpecJSON(joltSpecDefault, source.attrPrefix, target.attrPrefix,source.attrPrefix, target.attrPrefix,RemoteSourcesObj);
      }
      if(mappingConf['placeHolders']){
      var ph_types = Object.keys(mappingConf['placeHolders']);
      if(ph_types.length===1 && ph_types[0]==='target'){//if only target is a placeHolder
        joltSpecDefault = this.iterateAndConstructDefaultSpecJSON(joltSpecDefault, source.attrPrefix, target.attrPrefix,source.attrPrefix, target.attrPrefix,RemoteSourcesObj);
      }
    }
      //To form spec for RemoteAPI configs
      if(mappingConf['RemoteAPIConfig']!==undefined){
        var sources = mappingConf['RemoteAPIConfig'];
        for(var s in sources){
          var s_obj = sources[s]['RequestVariables'];
          for(var rv in s_obj){
              // Add index value as a key so that it will be used in remote api call
              var new_source_prefix = source.attrPrefix.split('.');
              // replace last key with _index
              new_source_prefix[new_source_prefix.length -1] = '$';
              new_source_prefix = new_source_prefix.join('.');


              // Add index value as a key so that it will be used in remote api call
              var new_target_prefix = target.attrPrefix.split('.');
              // replace last key with _index
              new_target_prefix[new_target_prefix.length - 1] = '_index';
              new_target_prefix = new_target_prefix.join('.');

              //Check if remote variable is a static value or a dynamic
              if (s_obj[rv].substring(0, 3) !== '$@$') {
                joltSpecDefault = this.iterateAndConstructDefaultSpecJSON(joltSpecDefault, s_obj[rv], 'JOLT_TEMP.remoteAPI.' + s + '.&1.' + rv,s_obj[rv], 'JOLT_TEMP.remoteAPI.' + s + '.&1.' + rv, sources);
              }
              // If the value of a remote variable is static(User input value) then we will use that value
              else {

                var new_source_static_value_prefix = source.attrPrefix.split('.');
                // replace last key with _index
                new_source_static_value_prefix[new_source_static_value_prefix.length - 1] = '#'.concat(s_obj[rv].replace('$@$', ''));
                new_source_static_value_prefix = new_source_static_value_prefix.join('.');


                joltSpecDefault = this.iterateAndConstructDefaultSpecJSON(joltSpecDefault, new_source_prefix, 'JOLT_TEMP.remoteAPI.' + s + '.&1.' + rv,new_source_static_value_prefix, 'JOLT_TEMP.remoteAPI.' + s + '.&1.' + rv, sources);
              }

              if(new_source_prefix==='$'){
                new_source_prefix = '.schema.'+new_source_prefix
              }
              joltSpecDefault = this.iterateAndConstructDefaultSpecJSON(joltSpecDefault, new_source_prefix, new_target_prefix,new_source_prefix, new_target_prefix, sources);

          }
        }
      }



        if(JSON.stringify(mappingConf)!='{}'){
        for(var k=0;k<customMappingConf.length;k++){
          if(mappingConf[customMappingConf[k]]!==undefined && JSON.stringify(mappingConf[customMappingConf[k]])!='{}' && JSON.stringify(mappingConf[customMappingConf[k]])!='[]'){
            if(customMappingConf[k]==='placeHolders'){
              var ph_types = Object.keys(mappingConf['placeHolders']);
              if(ph_types.length===2 || (ph_types.length===1 && ph_types[0]==='source')){ //if only source or both are placeHolders
                if(joltCustomSpec[customMappingConf[k]]===undefined){
                  joltCustomSpec[customMappingConf[k]]={}
                }
                joltCustomSpec[customMappingConf[k]] = this.iterateAndConstructCustomSpecJSON(joltCustomSpec[customMappingConf[k]], target.attrPrefix, target.attrPrefix, target.attrPrefix, mappingConf,customMappingConf[k],i);
              }
            }
            else{
              if(joltCustomSpec[customMappingConf[k]]===undefined){
                joltCustomSpec[customMappingConf[k]]={}
              }
              joltCustomSpec[customMappingConf[k]] = this.iterateAndConstructCustomSpecJSON(joltCustomSpec[customMappingConf[k]], target.attrPrefix, target.attrPrefix, target.attrPrefix, mappingConf,customMappingConf[k],i);
            }
        }
        }
      }
    }

    for(var source in RemoteSourcesObj){
      var s_obj = RemoteSourcesObj[source];
      for(var rv in s_obj){
        if(s_obj[rv].substring(0, 3) !== '$@$'){
          joltSpecDefault = this.iterateAndConstructDefaultSpecJSON(joltSpecDefault, s_obj[rv], 'JOLT_TEMP.inputVar.'+source+'.'+rv,s_obj[rv], 'JOLT_TEMP.inputVar.'+source+'.'+rv,RemoteSourcesObj);
        }
        else{
          joltTextInput = this.iterateAndConstructCustomSpecJSON(joltTextInput, 'JOLT_TEMP.inputVar.'+source+'.'+rv, 'JOLT_TEMP.inputVar.'+source+'.'+rv, 'JOLT_TEMP.inputVar.'+source+'.'+rv,{}, 'StaticValue', s_obj[rv]); //to assign request variables static values
        }
      }
    }

    //For PrimaryKey
    var primary_key = configJson.SourceConfig.PrimaryKey;
    joltSpecDefault = this.iterateAndConstructDefaultSpecJSON(joltSpecDefault, '.schema.' + primary_key,'JOLT_TEMP.PrimaryKey', '.schema.' +primary_key, 'JOLT_TEMP.PrimaryKey',RemoteSourcesObj);


    let returnOutput = [
      {
        operation: 'shift',
        spec: joltSpecDefault
      }
    ];

    if(JSON.stringify(joltTextInput)!='{}'){
        returnOutput.push(
          {
            operation: 'customTransformation', //TODO
            spec: joltTextInput
          }
        )
      }
      for(var c=0;c<customMappingConf.length;c++){
        var key = customMappingConf[c];
        if(joltCustomSpec[key] && JSON.stringify(joltCustomSpec[key])!='{}' && JSON.stringify(joltCustomSpec[key]['schema'])!='{}'){
        returnOutput.push(
          {
            operation: 'customTransformation',
            spec: joltCustomSpec[key]
          }
        )
      }
    }

    // //RemoteTransformation
    if (Object.keys(RemoteSourcesObj).length > 0) {
      var RemoteSpec = this.iterateAndConstructRemoteSpecJSON(RemoteSourcesObj, configJson);

      returnOutput.push(
        {
          operation: 'customTransformation', //TODO
          spec: {
            JOLT_TEMP: RemoteSpec
          }
        }
      )
    }


  returnOutput.push(
    {
    'operation': 'remove',
    'spec': {
      'JOLT_TEMP': ''
      }
    }
  );
    this.props.saveMappingSpec(returnOutput);

    return returnOutput;
  }

  getSampleSource() {
    const InputSchema = JSON.parse(JSON.stringify(this.props.sourceSchema));
    const example_input = jsf(api.v4(InputSchema)).schema || {};
    return example_input;
  }

  sampleInputOnChange(event) {
    var data = JSON.parse(event);
    this.setState({ sample_source: data.schema || {}});
  }

  updateTestOutput(){
    this.props.cdee_bussiness_rules_store.setvalue('currentTenantID', this.props.generic_master_store.tenantID);
    this.brs.CustomTransformer(this.state.sample_source, { Spec: this.convertMappingSpecToJoltSpec(this.props.masterComponent.props.mappingStore.configJson)}, this.props.generic_master_store.tenantID);
  }

  resetInputData() {
    let newInput = this.getSampleSource();
    this.setState({ sample_source: newInput});
  }


  render() {
    const toggleSpec = (
      <Tooltip id="toggleSpec"><strong>Toggle Spec</strong></Tooltip>
    );
    const resetInputData = (
      <Tooltip id="resetInputData"><strong>Generate Sample Input</strong></Tooltip>
    );
    const testSampleData = (
      <Tooltip id="testSampleData"><strong>Test Sample Data</strong></Tooltip>
    );
    const codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: true
    };
    const joltSpecCodeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: false
    };
    let joltSpecJSON = [];
    joltSpecJSON = this.convertMappingSpecToJoltSpec(this.props.masterComponent.props.mappingStore.configJson);
    let joltSpecJSONContainer = <div style={{ display: this.state.toggleSpec ? 'inherit' : 'none' }} >
        <div style={{padding: '5px 20px', color: 'white', cursor: 'pointer'}}>
          <i className="fa fa-toggle-off" onClick={() => { this.setState({ toggleSpec: !this.state.toggleSpec }) }}></i>
        </div>
        <div>
          <CodeMirror id="joltSpecJsonPretty" value={JSON.stringify(joltSpecJSON, null, 2)} options={codeOptions} />
        </div>
      </div>;

    let sampleSourceJSONContainer = <CodeMirror id="joltSpecJsonPretty" value={JSON.stringify({schema: this.state.sample_source}, null, 2)} onChange={this.sampleInputOnChange.bind(this)} options={joltSpecCodeOptions} />;
    let sampleTargetJSONCOntainer = <CodeMirror id="joltSpecJsonPretty" value={JSON.stringify(this.brs.transformedOutputJson, null, 2)} options={codeOptions} />;
    let testDataContainer = <div style={{ display: !this.state.toggleSpec ? 'inherit' : 'none' }} >
      <div style={{padding: '5px 20px', color: 'white', cursor: 'pointer'}}>
        <OverlayTrigger placement="top" overlay={toggleSpec}>
          <i className="fa fa-toggle-on" onClick={() => { this.setState({ toggleSpec: !this.state.toggleSpec }) }} style={{paddingRight: '15px'}} ></i>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={resetInputData}>
          <i className="fa fa-refresh" onClick={this.resetInputData.bind(this)} style={{paddingRight: '15px'}} ></i>
        </OverlayTrigger>
        <OverlayTrigger placement="top" overlay={testSampleData}>
          <i className="fa fa-flask" onClick={this.updateTestOutput.bind(this)} style={{paddingRight: '15px'}} ></i>
        </OverlayTrigger>
      </div>
      <div>
        <Col xs={6} sm={6} md={6} lg={6}> {sampleSourceJSONContainer} </Col>
        <Col xs={6} sm={6} md={6} lg={6}> {sampleTargetJSONCOntainer} </Col>
      </div>
      </div>


    return (
      <Row id="SpecJsonPretty" style={{ backgroundColor: '#282A36' }}>
        {testDataContainer}
        {joltSpecJSONContainer}
      </Row>
    );
  }
}

TestJoltSpec.propTypes = {
  store: React.PropTypes.object
};

export default TestJoltSpec;
