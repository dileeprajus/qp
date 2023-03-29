/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import { observable, computed, action } from 'mobx';
import FlexStore from './FlexStore';
import StaticFileClientStore from './StaticFileClientStore';
import RestClientStore from './RestClientStore';
import SoapClientStore from './SoapClientStore';
import TypeManagerStore from './TypeManagerStore';
import GenericCDEEMasterStore from './GenericCDEEMasterStore';

// This store is used to generate Mapping and also act as history
class MappingStore {

  constructor(name) {
    // If you want to get a thing particularly then mention
    //thing name else it will default to FlexThing
    this.name = name ? name : 'MappingConfig';
    this.store_name = 'MappingStore'; //This is the filename
    this.type_manager_store = new TypeManagerStore();
    this.generic_master_store = new GenericCDEEMasterStore();
  }

  description = 'This is used to map datastores';

  getThing = {
    FlexStore: FlexStore,
    StaticFileClientStore: StaticFileClientStore,
    RestClientStore: RestClientStore,
    SoapClientStore: SoapClientStore
  }


  @observable configJson = {
    SourceConfig: {
      Name: '',
      StoreName: '',
      GroupName: '',   //GroupName
      Type: '',    //Selected dataSourceType (Flex/Rest/Static/Soap)
      GroupType: 'source' //For IE
    },
    TargetConfig: {
      Name: '',
      StoreName: '',
      GroupName: '',   //GroupName
      Type: '',    //Selected dataSourceType (Flex/Rest/Static/Soap)
      GroupType: 'target'  //For IE
    },
    schemaMap: [],
    mappingSpec: [],
    RemoteSourceConfig: {},
    enableSOP: false,
    executeSOP: ''
  };

  @observable sourceSchema = {};
  @observable targetSchema = {};
  @observable mappingSpecJson = {};

  @observable current_single_attribute_mapping = '';
  @observable selected_script_index = null;
  @observable to_re_render = null;

  // declare thing attributes which are used in default thing template
  @observable new_config_name = '';
  @observable new_config_description = '';
  @observable newConfigTitle = '';
  @observable MappingConfigs = [];
  @observable Configs = [];
  @observable config_names = [];
  @observable currentGroupName = '';
  @observable currentGroupType = '';
  @observable currentTenantID = '';
  @observable selectedRemoteName = '';
  @observable remoteAPIDataSchemas = {};
  @observable title = '';

  // This callback is used when API call is made, but callback is optional
  @observable async_callback = null;

  @computed get flex_things() {
    return this.numClicks % 2 === 0 ? 'even' : 'odd';
  }

  // Methods On Default Thing template
  @computed get getMappingConfigs() {
    var mappingThis = this;
    if (this.MappingConfigs.length === 0) {
      ieGlobalVariable.loaderStore.turnon();
    }
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetAllConfigs',
      methodType: 'POST',
      payload: { groupName: this.currentGroupName, groupType: this.currentGroupType, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        mappingThis.setvalue('MappingConfigs', response.data.Configs);
        mappingThis.setvalue('Configs', response.data.Configs);
        ieGlobalVariable.loaderStore.turnoff();

        if (mappingThis.async_callback) {
          mappingThis.async_callback(mappingThis, response);
        }
        mappingThis.getTotalConfigs;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();

        if (mappingThis.async_callback) {
          mappingThis.async_callback(error);
        }
      });
  }

  @computed get getTotalConfigs() {
    var mappingThis = this;
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'GetTotalConfigs',
      methodType: 'POST',
      payload: { groupName: this.currentGroupName, groupType: this.currentGroupType, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        mappingThis.config_names = response.data.Configs;
        if (mappingThis.async_callback) {
          mappingThis.async_callback(mappingThis, response);
        }
      })
      .catch(function (error) {

        if (mappingThis.async_callback) {
          mappingThis.async_callback(error);
        }
      });
  }


  CreateConfig(generic_master_store, redirectToEdit, createConfigAlert) {
    var searchQuery = {
      name: this.new_config_name,
      description: this.new_config_description,
      configDataSourceCategory: generic_master_store.groupType,
      ConfigJson: this.configJson, groupName: this.currentGroupName,
      isFlex: false, title: this.newConfigTitle,
      selectedSourceGroupName: this.configJson.SourceConfig.GroupName,
      selectedTargetGroupName: this.configJson.TargetConfig.GroupName,
      selectedSourceConfigName: this.configJson.SourceConfig.Name,
      selectedTargetConfigName: this.configJson.TargetConfig.Name,
      selectedSourceType: this.configJson.SourceConfig.Type,
      selectedTargetType: this.configJson.TargetConfig.Type,
      tenantId: this.currentTenantID
    }
    var mappingThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'CreateConfig',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        mappingThis.new_config_name = '';
        mappingThis.new_config_description = '';
        ieGlobalVariable.loaderStore.turnoff();
        if (mappingThis.async_callback) {
          mappingThis.async_callback(mappingThis, response);
        }
        mappingThis.getMappingConfigs;
        redirectToEdit();
        if (createConfigAlert) {
          createConfigAlert();
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();

        if (mappingThis.async_callback) {
          mappingThis.async_callback(error);
        }
      });
  }

  //Input: name of the thing to delete
  DeleteConfig(configName) {
    var searchQuery = configName;
    var mappingThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'DeleteConfig',
      methodType: 'POST',
      payload: { input: searchQuery, groupName: this.currentGroupName, groupType: this.currentGroupType, configName: configName, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)

      .then(function (response) {
        mappingThis.setvalue('MappingConfigs', response.data.Configs);
        mappingThis.setvalue('Configs', response.data.Configs);
        ieGlobalVariable.loaderStore.turnoff();
        mappingThis.setvalue('name', 'MappingConfig');
        if (mappingThis.async_callback) {
          mappingThis.async_callback(mappingThis, response);
        }
        mappingThis.getMappingConfigs;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();

        if (mappingThis.async_callback) {
          mappingThis.async_callback(error);
        }
      });
  }

  getSourceAndTargetSchemas() {
    var sourceConfigAPI = this.configJson.SourceConfig.Name;
    var targetConfigAPI = this.configJson.TargetConfig.Name;

    var sourceSearchQuery = { propertyArr: ['outputSchema'], groupType: 'source', groupName: this.configJson.SourceConfig.GroupName, configName: this.configJson.SourceConfig.Name, tenantId: this.currentTenantID };
    var targetSearchQuery = { propertyArr: ['inputSchema'], groupType: 'target', groupName: this.configJson.TargetConfig.GroupName, configName: this.configJson.TargetConfig.Name, tenantId: this.currentTenantID };
    var mappingThis = this;


    const sourceApiInput = {
      midpoint: sourceConfigAPI,
      endpoint: 'GetPropValues',
      methodType: 'POST',
      payload: { input: sourceSearchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(sourceApiInput)
      .then(function (response) {
        mappingThis.sourceSchema = { schema: response.data.outputSchema };
        if (mappingThis.async_callback) {
          mappingThis.async_callback(mappingThis, response);
        }
      })
      .catch(function (error) {
        if (mappingThis.async_callback) {
          mappingThis.async_callback(error);
        }
      });

    const targetApiInput = {
      midpoint: targetConfigAPI,
      endpoint: 'GetPropValues',
      methodType: 'POST',
      payload: { input: targetSearchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(targetApiInput)
      .then(function (response) {
        mappingThis.targetSchema = { schema: response.data.inputSchema };
        if (mappingThis.async_callback) {
          mappingThis.async_callback(mappingThis, response);
        }
      })
      .catch(function (error) {
        if (mappingThis.async_callback) {
          mappingThis.async_callback(error);
        }
      });
  }

  @computed get GetConfigJson() {
    var searchQuery = { propertyArr: ['ConfigJson'], groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID };
    var mappingThis = this;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetPropValues',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        mappingThis.configJson = response.data['ConfigJson'];

        if (mappingThis.async_callback) {
          mappingThis.async_callback(mappingThis, response);
        }
      })
      .catch(function (error) {
        if (mappingThis.async_callback) {
          mappingThis.async_callback(error);
        }
      });
  }

  @observable BasicConfigInfo = {};
  @computed get GetBasicConfigInfo() {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID };
    var mappingThis = this;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetBasicConfigInfo',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        mappingThis.BasicConfigInfo = response.data;
        if (mappingThis.currentGroupName === '') {
          mappingThis.currentGroupName = mappingThis.BasicConfigInfo.Group;
        }
        if (mappingThis.currentGroupType !== mappingThis.BasicConfigInfo.GroupType) {
          mappingThis.currentGroupType = mappingThis.BasicConfigInfo.GroupType;
        }
        if (mappingThis.async_callback) {
          mappingThis.async_callback(mappingThis, response);
        }
      })
      .catch(function (error) {
        if (mappingThis.async_callback) {
          mappingThis.async_callback(error);
        }
      });
  }

  //input is json key is property name and value is updated value: {"propertyName":value}
  SetPropValues(input_data,configUploadCallback) {
    var searchQuery = input_data;
    var mappingThis = this;

    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetPropValues',
      methodType: 'POST',
      payload: { input: searchQuery, groupName: this.currentGroupName, groupType: this.currentGroupType, configName: this.name, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        ieGlobalVariable.loaderStore.turnoff();

        if (mappingThis.async_callback) {
          mappingThis.async_callback(mappingThis, response);
        }

        if(configUploadCallback){
          configUploadCallback('Success');
        }

      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();

        if (mappingThis.async_callback) {
          mappingThis.async_callback(error);
        }

        if(configUploadCallback){
          configUploadCallback('Failed');
        }
      });
  }
  @observable isPersistance = false;
  @observable isCaching = false;
  @observable  expiryTime = '';

  @computed get getConfigMetaInfo() {
    var searchQuery = {
      groupName: this.currentGroupName,
      groupType: this.currentGroupType,
      name: this.name,
      persisting: this.isPersistance,
      caching: this.isCaching,
      expiryTime: this.expiryTime,
      tenantId: this.currentTenantID
    };

    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();

    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetConfigInfo',
      methodType: 'POST',
      payload: { input : searchQuery },
      queryparam: null,
      headers: null
    };

    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        internalThis.configMetaInfo = response.data.result.metaInfo;
        internalThis.isPersistance = response.data.result.persisting;
        internalThis.isCaching = response.data.result.caching;
        internalThis.expiryTime = response.data.result.expiryTime;
        internalThis.title = response.data.result.title;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  setConfigMetaInfo(configUpdation) {
    var searchQuery = {
      groupName: this.currentGroupName,
      groupType: this.currentGroupType,
      name: this.name,
      metaInfo: this.configMetaInfo,
      persisting: this.isPersistance,
      caching: this.isCaching,
      expiryTime: this.expiryTime,
      tenantId: this.currentTenantID,
      title: this.title
    };
    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();

    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetConfigInfo',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        internalThis.configMetaInfo = response.data.result.metaInfo;
        internalThis.title = response.data.result.title;
        configUpdation('Success');
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
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
        // TODO: For now if right side have array and left side have no array we will point to current object meaning it will be array of one element
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
          output[currentIndexKey]={};
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
          if(output[currentIndexKey]['@'] === undefined){
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
            if(typeof output !== 'string') {
              output[currentIndexKey] = {};
            }
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
            mappingConfigName :this.name,
            mappingSpecIndex:String(index),
            mappingGroupName :this.currentGroupName,
            'tenantId': this.currentTenantID ? this.currentTenantID : ''
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
            'tenantId': this.currentTenantID ? this.currentTenantID : ''
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
          if(output !== undefined) {
            output[currentIndexKey] = "=getAPIService('" + JSON.stringify(end_point_obj) + "','" + JSON.stringify(MCC) + "'," + request_variables + ',' + current_index + ',' + delim + ')';
          }
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
        'tenantId': this.currentTenantID ? this.currentTenantID : ''
      }
      var MCC = {
        'source_group_name': configJson.SourceConfig.GroupName,
        'source_config_name': configJson.SourceConfig.Name,
        'target_group_name': configJson.TargetConfig.GroupName,
        'target_config_name': configJson.TargetConfig.Name,
        'mapping_group_name': this.currentGroupName,
        'mapping_config_name': this.name,
        'primary_key_at_dataprovider': ''
      }
      var request_variables = '@(2,JOLT_TEMP.inputVar.'+key+')';
      var PrimaryKey = '@(2,JOLT_TEMP.PrimaryKey)';
      output[key] = "=initiateAsync('"+ JSON.stringify(end_point_obj) + "','"+JSON.stringify(MCC)+"',"+request_variables+','+PrimaryKey+')';
    }
    return output;
  }


  convertMappingSpecToJoltSpec(configJson,generic_master_store) {
    this.generic_master_store = generic_master_store
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

    return returnOutput;
  }



  @action clickButton() {
    this.numClicks++;
  }

  setvalue(name, value) {
    this[name] = value;
  }

  @observable map_config_names = [];
  @observable thing_exists = this.map_config_names.indexOf(this.new_config_name) === -1 ? false : true;

}

export default MappingStore;
