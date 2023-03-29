/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import { observable, computed } from 'mobx';

class RestClientStore {
  constructor(name) {
    // If you want to get a thing particularly then mention thing name
    //else it will default to RestClient
    this.name = name ? name : 'RestConfig';
    this.store_name = 'RestClientStore'; //This is the filename
  }

  description = 'This is used to get RestConfigs from ThingWorx';

  sourceType = ''; //To identify type of source data2cdee , schema or datafromcdee. For type data2cdee taking the value as empty

  // declare thing attributes which are used in default thing group
  @observable new_config_name = '';
  @observable new_config_description = '';
  @observable currentGroupName = '';
  @observable currentGroupType = '';
  @observable TargetData = {};
  @observable LogData = true;
  @observable currentTenantID = '';
  @observable RequestVariablesConfig = {};
  @observable CustomEndPoints = [];
  @observable RequestVariables = {};
  @observable oldDomain = '';
  @observable newDomain = '';
  @observable TempRequestVariables = {
    data_url: {},
    query_params: {},
    headers: {},
    payload: {}
  }
  @observable configJson = {
    inputSchema: {},
    outputSchema: {},
    PrimaryKey: '',
    LogData: true,
    TimestampFrom: 'Current Timestamp',
    CreatedAtDataProvider: '',
    UpdatedAtDataProvider: '',
    TransformationRules: [],
    PreTransformationRules: [],
    RequestVariables: {},
    TempRequestVariables: {},
    basic_auth_details: {
      username: '',
      password: ''
    },
    payload_option: {},
    current_method_type: 'GET',
    current_data_format: 'JSON',
    data_url: '',
    query_params: [],
    current_auth_type: 'NoAuth',
    headers: [],
    payload: {},
    current_payload_option: 'raw',
    current_raw_payload_option : 'JSON(application/json)',
    oauth_details: {
      token_name: '',
      auth_url: '',
      access_token_url: '',
      client_id: '',
      client_secret: '',
      scope: '',
      grant_type: 'password',
      username: '',
      password: '',
      code: '',
      auth_code_type: 'Static',
      AuthorizationCodeGrant: {
        auth_code_url: '',
        method_type: 'GET',
        client_id: '',
        response_type: 'code',
        state: '',
        redirect_uri: '',
        scope: '',
        headers: {},
        auth_details: {
          auth_type: '',
          username: '',
          password: ''
        },
        TransformationRules: []
      }
    },
    oauth_token_data: {},
    payload_form_data: [],
    payload_form_url_encoded: [],
    schema_source: 'SchemaFromData',
    schemafromurl_details: {},
    schema_from_file_data: {},
    sourceType: '',
    datafromcdee_basic_auth_details: {
      username: '',
      password: ''
    },
    csv_delimeter: '',
    master_obj: '',
    customAuthDetails: {
      customAuthUrl: '',
      custom_auth_method_type : 'GET',
      custom_auth_current_payload_option: 'raw',
      headers: {},
      payload: {},
      TransformationRules: [],
      configured: false, //it will be true only after all field values are filled.if this flag is false will go with no auth for main configJson
      expirityTime: '0',
      retryCount: '1',
      enableCache: false,
    },
    enableSOP: false,
    executeSOP: ''
    
  };
  @observable  updatedConfigJson = {};
  @observable schemafromurl_details = {
    schema_current_auth_type: 'NoAuth',
    schema_basic_auth_details: {
      username: '',
      password: ''
    },
    schema_oauth_details: {
      token_name: '',
      auth_url: '',
      access_token_url: '',
      client_id: '',
      client_secret: '',
      scope: '',
      grant_type: 'password',
      username: '',
      password: '',
      code: ''
    },
    schema_oauth_token_data: {},
    schema_payload_form_data: [],
    schema_payload_form_url_encoded: [],
    schema_current_method_type: 'GET',
    schema_data_url: '',
    schema_query_params: [],
    schema_headers: [],
    schema_payload: {},
    schema_current_payload_option: 'raw',
    schema_master_obj: ''
  }

  rest_method_list = ['GET', 'POST', 'PUT', 'DELETE']
  data_format_list = ['JSON', 'XML', 'CSV']
  grant_types_list = ['password', 'authorization_code']
  payload_option_list = ['form-data', 'x-www-form-urlencoded', 'raw']
  raw_payload_option_list = ['Text(text/plain)', 'JSON(application/json)', 'XML(application/xml)','XML(text/xml)']
  form_method_type = ['Text', 'File']
  rest_auth_types = ['NoAuth', 'BasicAuth', 'OAuth2.0', 'CustomAuth'];
  @observable RestConfigs = [];
  @observable Configs = [];
  @observable config_names = [];
  @observable current_raw_payload_option = 'JSON(application/json)'

  //********************Variable for type datatocdee and schema*******************

  @observable current_form_method_type = 'Text';
  @observable schema_current_form_method_type = 'Text';
  @observable current_method_type = 'GET';
  @observable schema_current_method_type = 'GET';
  @observable current_data_format = 'JSON';
  @observable schema_current_data_format = 'JSON';
  @observable data_url = '';
  @observable schema_data_url = '';
  @observable query_params = [];
  @observable schema_query_params = [];
  @observable current_auth_type = 'NoAuth';
  @observable schema_current_auth_type = 'NoAuth';
  @observable headers = [];
  @observable schema_headers = [];

  @observable Triggers = {
    sourceTrigger: 'Data Push',
    destinationTrigger: 'Data Send',
    DataIn: {
      DataPull: false,
      DataPush: true
    },
    DataOut: {
      DataSave: false,
      DataSend: true
    }
  }


   @observable current_selected_source_type = '';
   @observable current_service_name = '';
   @observable current_custom_path = '';
   @observable inputData = {};
   @observable async_call_back= null;


  @observable payload = {};
  @observable payload_form_data = [];
  @observable schema_payload_form_data = [];
  @observable payload_form_url_encoded = [];
  @observable schema_payload_form_url_encoded = [];
  @observable schema_payload = {};
  @observable current_payload_option = 'raw';
  @observable schema_current_payload_option = 'raw';
  @observable custom_auth_current_payload_option = 'raw';
  @observable basic_auth_details={ username: '', password: '' }
  @observable schema_basic_auth_details={ username: '', password: '' }
  @observable oauth_details={ token_name: '', auth_url: '', access_token_url: '', client_id: '', client_secret: '', scope: '', grant_type: 'password', username: '', password: '', code: '',auth_code_type: 'Static',
  AuthorizationCodeGrant: {
    auth_code_url: '',
    method_type: 'GET',
    client_id: '',
    response_type: 'code',
    state: '',
    redirect_uri: '',
    scope: '',
    headers: {},
    auth_details: {
      auth_type: '',
      username: '',
      password: ''
    },
    TransformationRules: []
  } }
  @observable schema_oauth_details={ token_name: '', auth_url: '', access_token_url: '', client_id: '', client_secret: '', scope: '', grant_type: 'password', username: '', password: '', code: '' }
  @observable oauth_token_data = {};
  @observable schema_oauth_token_data = {};
  @observable oauth_data_panel_status = 'warning';
  @observable schema_oauth_data_panel_status = 'warning';
  @observable schema_source = 'SchemaFromData';
  @observable schema_from_file_data = {};
  @observable customAuthDetails = { custom_auth_method_type: 'GET', customAuthUrl: '', headers: {}, payload: {}, TransformationRules: [] ,custom_auth_current_payload_option:'raw', expirityTime: '0', enableCache: false, retryCount: '1'};
  @observable AuthorizationCodeGrant =  {
    auth_code_url: '',
    method_type: 'GET',
    client_id: '',
    response_type: 'code',
    state: '',
    redirect_uri: '',
    scope: '',
    headers: {},
    auth_details: {
      auth_type: '',
      username: '',
      password: ''
    },
    TransformationRules: []
  }
  @observable custom_auth_method_type = 'GET';
//***********************pull or push data vars*****************
external_data_payload = {};
external_data_headers = {};
external_data_url_params = {};
datafromcdee_external_data_payload = {};
datafromcdee_external_data_headers = {};
datafromcdee_external_data_url_params = {};

@observable csv_delimeter = '';
@observable datafromcdee_csv_delimeter = '';
@observable master_obj = '';
@observable datafromcdee_master_obj = '';
@observable schema_master_obj = '';
@observable configMetaInfo={};
@observable isPersistance = false;
@observable isCaching = false;
@observable  expiryTime = '';
extractTempRequestVariables(txt,key){
  var newTxt = txt.split('((');
  var variables = [];
  for (var i = 1; i < newTxt.length; i++) {
    variables.push(newTxt[i].split('))')[0]);
}
  var temp_json = {}
  var existed_json = this.TempRequestVariables[key];
  if(variables.length>0){
    for(var k=0;k<variables.length;k++){
      if (variables[k]!=='') {
        if(existed_json[variables[k]]!==undefined){
          temp_json[variables[k]]=existed_json[variables[k]];
        }
        else{
          temp_json[variables[k]]='';
        }
      }
    }
  }
  return temp_json;
}
  // Methods On Default Thing group
  @computed get getRestConfigs() {
    var restConfigThis = this;
    if (this.RestConfigs.length === 0) {
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
        restConfigThis.setvalue('RestConfigs', response.data.Configs);
        restConfigThis.setvalue('Configs', response.data.Configs);
        restConfigThis.getTotalConfigs;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
@observable updateDomainStatus = {};
  updateDomain(generic_store, responseCallback) {
    var restConfigThis = this;
    if (this.RestConfigs.length === 0) {
      ieGlobalVariable.loaderStore.turnon();
    }
    const apiInput = {
      midpoint: this.name,
      endpoint: 'UpdateDomain',
      methodType: 'POST',
      payload: {
        input: {
          groupName: generic_store.currentGroupName,
          groupType: generic_store.groupType,
          tenantId: generic_store.tenantID,
          oldDomain: this.oldDomain,
          newDomain: this.newDomain
        }
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        restConfigThis.updateDomainStatus = response.data;
        // Return Data
        if(response) {
          responseCallback();
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @observable title = '';
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

    var restConfigThis = this;
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
        restConfigThis.configMetaInfo = response.data.result.metaInfo;
        restConfigThis.isPersistance = response.data.result.persisting;
        restConfigThis.isCaching = response.data.result.caching;
        restConfigThis.expiryTime = response.data.result.expiryTime;
        restConfigThis.title = response.data.result.title;
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
    var restConfigThis = this;
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
        restConfigThis.configMetaInfo = response.data.result.metaInfo;
        restConfigThis.title = response.data.result.title;
        configUpdation('Success');
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @computed get getTotalConfigs() {
    var restConfigThis = this;
    const apiInput = {
      midpoint: 'RestConfig',
      endpoint: 'GetTotalConfigs',
      methodType: 'POST',
      payload: { groupName: this.currentGroupName, groupType: this.currentGroupType, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        restConfigThis.config_names = response.data.Configs;
        restConfigThis.config_names = restConfigThis.config_names.map(function (x) { return x.toUpperCase() });

      })
      .catch(function (error) {
        return error;
      });
  }

  CreateConfig(generic_master_store, enable_modal_tabs) {
    var searchQuery = { name: this.new_config_name, description: this.new_config_description, groupName: this.currentGroupName, isFlex: false, configDataSourceCategory: generic_master_store.groupType, tenantId:this.currentTenantID }
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'RestConfig',
      endpoint: 'CreateConfig',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        if (response.data.result) {
          restConfigThis.name = response.data.result.Name;
          restConfigThis.setvalue('name', response.data.result.Name);
          restConfigThis.setvalue('currentTenantID', response.data.result.tenantId);
          restConfigThis.getRestConfigs;
          if (enable_modal_tabs){
              enable_modal_tabs(response.data.result.tenantId);
          }
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }


  // Methods on specific Configs
  @observable BasicConfigInfo = {};

  @observable inputSchema = {};
  @observable outputSchema = {};
  GetBasicConfigInfo(updateSchema, createAlert) {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID }
    var restConfigThis = this;
     ieGlobalVariable.loaderStore.turnon();
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
        restConfigThis.BasicConfigInfo = response.data;
        if (restConfigThis.currentGroupType === 'source') {
          restConfigThis.outputSchema =  restConfigThis.BasicConfigInfo['outputSchema'];
        } else if (restConfigThis.currentGroupType === 'target') {
          restConfigThis.inputSchema =  restConfigThis.BasicConfigInfo['inputSchema'];
        }
        if (restConfigThis.currentGroupName === '') {
          restConfigThis.currentGroupName = restConfigThis.BasicConfigInfo.Group;
        }
        if (restConfigThis.currentGroupType !== restConfigThis.BasicConfigInfo.GroupType) {
          restConfigThis.currentGroupType = restConfigThis.BasicConfigInfo.GroupType;
        }
        if (restConfigThis.currentTenantID === '') {
            restConfigThis.currentTenantID = restConfigThis.BasicConfigInfo.TenantId;
        }
        if (restConfigThis.async_call_back) {
            restConfigThis.async_call_back((restConfigThis.BasicConfigInfo && restConfigThis.BasicConfigInfo.ConfigJson?restConfigThis.BasicConfigInfo.ConfigJson:''), response);
        }
      if(updateSchema){
        updateSchema();
      }
      if(BACKEND !== 'LoopBack'){
        if(createAlert) {
            createAlert();
        }
      }
       ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
          if (restConfigThis.async_callback) {
              restConfigThis.async_callback(error);
          }
      });
  }

   //Input: name of the thing to delete
  DeleteConfig(configName) {
    var searchQuery = configName;
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'RestConfig',
      endpoint: 'DeleteConfig',
      methodType: 'POST',
      payload: { input: searchQuery, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: configName, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        restConfigThis.setvalue('RestConfigs', response.data.Configs);
        restConfigThis.setvalue('Configs', response.data.Configs);
        ieGlobalVariable.loaderStore.turnoff();
        restConfigThis.setvalue('name', 'RestConfig');
        restConfigThis.getRestConfigs;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }


  FormConfigJSON(type) {
    var config = {};

    if (this[type+ 'current_auth_type'] === 'OAuth2.0') {
      delete this.configJson[type+ 'basic_auth_details'];
    }
    else if (this[type+ 'current_auth_type'] === 'BasicAuth') {
      delete this.configJson[type+ 'oauth_details'];
      delete this.configJson[type+ 'oauth_token_data'];
    }
    else {
      delete this.configJson[type+ 'basic_auth_details'];
      delete this.configJson[type+ 'oauth_details'];
      delete this.configJson[type+ 'oauth_token_data'];
    }

    if (this.schema_source === 'SchemaFromURL') {
      delete this.configJson.schema_from_file_data;
    }
    else if (this.schema_source === 'SchemaFromFile') {
      delete this.configJson.schemafromurl_details;
    }
    else {
      delete this.configJson.schemafromurl_details;
      delete this.configJson.schema_from_file_data;
    }

    for (var key in this.configJson) {
      config[key] = this[key];
    }

    if (this[type+ 'current_auth_type'] === 'BasicAuth') {
      config[type+ 'basic_auth_details'] = this[type+ 'basic_auth_details'];
    }
    else if (this[type+ 'current_auth_type'] === 'OAuth2.0') {
      config[type+ 'oauth_details'] = this[type+ 'oauth_details'];
      config[type+ 'oauth_details']['AuthorizationCodeGrant']['TransformationRules'] = this['AuthorizationCodeGrant']['TransformationRules'];
      config[type+ 'oauth_token_data'] = this[type+ 'oauth_token_data'];
    }
    else if (this[type+ 'current_auth_type'] === 'CustomAuth') {
      config['customAuthDetails'] = this.customAuthDetails;
    }
    else {}

    if (this.schema_source === 'SchemaFromFile'){
      config['schema_from_file_data'] = this.schema_from_file_data;
    }
    else if (this.schema_source === 'SchemaFromURL') {
      config['schemafromurl_details'] = {}
      for (var key in this.schemafromurl_details) {
        config['schemafromurl_details'][key] = this[key];
      }
    }
    else{}
    config['sourceType'] = type;
    config[type+ 'external_data_payload']={};
    config[type+ 'external_data_headers']={};
    config[type+ 'external_data_url_params']={};
    //TODO : Need to call this separately. On Submit click only it should executed
    config['PrimaryKey']=this.configJson.PrimaryKey;
    config['LogData']=this.configJson.LogData;
    config['TimestampFrom']=this.configJson.TimestampFrom;
    config['CreatedAtDataProvider']=this.configJson.CreatedAtDataProvider;
    config['UpdatedAtDataProvider']=this.configJson.UpdatedAtDataProvider;
    config['RequestVariablesConfig']=this.RequestVariablesConfig;
    config['TempRequestVariables']=this.TempRequestVariables;
    config['current_raw_payload_option']=this.current_raw_payload_option;
    var norm_rv={}
    for(var rv in this.TempRequestVariables){
      if(typeof this.TempRequestVariables[rv]==='object' && (rv=='payload' || rv=='data_url' || rv=='headers' || rv=='query_params' || rv =='payload_form_url_encoded')){
        for(var s_key in this.TempRequestVariables[rv]){
          norm_rv[s_key]=this.TempRequestVariables[rv][s_key]
        }
      }else{
        norm_rv[rv]=this.TempRequestVariables[rv];
      }
    }
    norm_rv = norm_rv['payload_form_url_encoded'] ? norm_rv['payload_form_url_encoded'] : norm_rv;
    config['RequestVariables']=norm_rv;
    config['TransformationRules']=this.configJson.TransformationRules;
    config['PreTransformationRules']=this.configJson.PreTransformationRules;
    config['enableSOP']=this.configJson.enableSOP;
    config['executeSOP']=this.configJson.executeSOP;
    return config;
  }

  normRequestVariables(){
    var norm_rv={}
    for(var rv in this.TempRequestVariables){
      if(typeof this.TempRequestVariables[rv]==='object' && (rv=='payload' || rv=='data_url' || rv=='headers' || rv=='query_params' || rv=='payload_form_url_encoded')){
        for(var s_key in this.TempRequestVariables[rv]){
          norm_rv[s_key]=this.TempRequestVariables[rv][s_key]
        }
      }else{
        norm_rv[rv]=this.TempRequestVariables[rv];
      }
    }
    norm_rv = norm_rv['payload_form_url_encoded'] ? norm_rv['payload_form_url_encoded'] : norm_rv;
    this.RequestVariables = norm_rv
    this.normRequestVariablesConfig();
  }

  normRequestVariablesConfig(){
    var norm_rv={}
    for(var rv in this.RequestVariables){
      if(this.RequestVariablesConfig[rv]!==undefined){
        norm_rv[rv]=this.RequestVariablesConfig[rv]
      }else{
        norm_rv[rv]={}
      }
    }
    this.RequestVariablesConfig = norm_rv
  }

  callTestApi(type) {
    var config = this.FormConfigJSON(type);
    if(this[type+ 'current_data_format']==='JSON'){
      this.testApi(config);
    }
    else if(this[type+ 'current_data_format']==='XML'){
      this.testApiXml(config);
    }
    else if(this[type+ 'current_data_format']==='CSV'){
      this.testApiCsv(config);
    }
    else{}
  }

  callSetPropValues(type) {
    var config = this.FormConfigJSON(type);

    this.configJson = config; // to update rest show immediately
    this.SetPropValues({ ConfigJson: config, inputSchema: this.inputSchema, outputSchema: this.outputSchema });
  }

  //input is json key is property name and value is updated value: { 'propertyName':value}
  SetPropValues(inputData) {
    var searchQuery = inputData;
    var restThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetPropValues',
      methodType: 'POST',
      payload: { input: searchQuery, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
        .then(function (response) {
          ieGlobalVariable.loaderStore.turnoff();
          if (inputData['ConfigJson']) {
            restThis.GetConfigJson;
          }
          if(response && response.hasOwnProperty('data') && response.data.hasOwnProperty('ConfigJson')){
                restThis.updatedConfigJson=response.data.ConfigJson
            }
        })
        .catch(function (error) {
          ieGlobalVariable.loaderStore.turnoff();
          return error;
        });
  }


    @computed get GetConfigJson() {
    var searchQuery = { propertyArr: ['ConfigJson'], groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId:this.currentTenantID };
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
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
        if(JSON.stringify(response.data['ConfigJson'])!=='{}'){
          restConfigThis.configJson = response.data['ConfigJson'];
          restConfigThis.UpdateVariablesFromConfigJson(restConfigThis.configJson);
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }


  UpdateVariablesFromConfigJson(configJson) {
    for (var key in configJson) {
      this[key] = configJson[key];
    }
    //********To handle existing configs which are created before RV linearization
    if(configJson['TempRequestVariables']===undefined){
      this.configJson['TempRequestVariables']=configJson['RequestVariables'];
      this.TempRequestVariables=configJson['RequestVariables'];
      this.normRequestVariables()
    }
    //*******************
    //********To handle existing configs which are created before Authcode api
    if(configJson['oauth_details']){
      this.configJson['oauth_details']['auth_code_type']=configJson['oauth_details']['auth_code_type']?configJson['oauth_details']['auth_code_type']:'Static'
      this.oauth_details.auth_code_type=configJson['oauth_details']['auth_code_type']?configJson['oauth_details']['auth_code_type']:'Static'
      this.AuthorizationCodeGrant.TransformationRules = configJson['oauth_details']['AuthorizationCodeGrant']['TransformationRules']
    }
    //*******************
    if(configJson['customAuthDetails']){
      this.custom_auth_method_type = configJson['customAuthDetails']['custom_auth_method_type']
      this.custom_auth_current_payload_option = configJson['customAuthDetails']['custom_auth_current_payload_option']
    }
  }

  @observable test_response = {};
  @observable schema_test_response = {};
  @observable datafromcdee_test_response = {};

  testApi(configJson) {
    var rv_json = {};
    var rv = configJson.TempRequestVariables;
    for(var key in rv){
      var s_rv = rv[key];
      for(var k in s_rv){
        rv_json[k]=s_rv[k]
      }
    }
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'TestApi',
      methodType: 'POST',
      payload: { input: configJson, request_variables: rv_json, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        if(restConfigThis.currentGroupType === 'target') {
          restConfigThis.TargetData = response.data['result'];
        }
        else{
          restConfigThis[configJson.sourceType + 'test_response'] = response.data['result'];
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        restConfigThis[configJson.sourceType+ 'test_response']={ 'error': 'Failed' };
        return error;
      });
  }
  @observable auth_code_test_response = {};
  testAuthCodeAPI(){
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetAuthCodeFromExternalAPI',
      methodType: 'POST',
      payload: { input: this.oauth_details.AuthorizationCodeGrant, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        restConfigThis.auth_code_test_response = response.data;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        restConfigThis.auth_code_test_response={ 'error': 'Failed' };
        return error;
      });
  }

  @observable custom_auth_test_response = {};
  testCustomAuth(){
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'ExecuteCustomAuth',
      methodType: 'POST',
      payload: { input: this.customAuthDetails, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        restConfigThis.custom_auth_test_response = response.data;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        restConfigThis.custom_auth_test_response={ 'error': 'Failed' };
        return error;
      });
  }

  fetchSchemaFromData(type) {
    if (this.currentGroupType==='target'){
      if (this.current_data_format === 'XML') {
        this.XMLToJson(type);
      } else if (this.current_data_format === 'CSV') {
        this.CSVToJson(type);
      } else { this.fetchSchemaFromRawData(type); }
    } else {
    var configJson = this.FormConfigJSON(type);
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'FetchSchemaUsingConfigJson',
      methodType: 'POST',
      payload: { input: configJson, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId:this.currentTenantID  },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        if (restConfigThis.currentGroupType === 'source') {
          restConfigThis.outputSchema = response.data;
          restConfigThis.configJson.outputSchema = response.data;
        } else if (restConfigThis.currentGroupType === 'target') {
          restConfigThis.inputSchema = response.data;
          restConfigThis.configJson.inputSchema = response.data;
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (restConfigThis.currentGroupType === 'source') {
          restConfigThis.outputSchema = {};
          restConfigThis.configJson.outputSchema = { error: 'Failed' };
        } else if (restConfigThis.currentGroupType === 'target') {
          restConfigThis.inputSchema = {};
          restConfigThis.configJson.inputSchema = { error: 'Failed' };
        }
        return error;
      });
    }
  }

  fetchSchemaFromRawData() {
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'GetSchemaFromJson',
      methodType: 'POST',
      payload: { input: this.TargetData, draft_type: 3, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name,current_data_format:this.configJson.current_data_format, tenantId:this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        restConfigThis.inputSchema = response.data;
        restConfigThis.configJson.inputSchema = response.data;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        restConfigThis.inputSchema = {};
        restConfigThis.configJson.inputSchema = { 'error': 'Failed' };
        return error;
      });
  }

  testApiXml(configJson) {
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'TestApiXML',
      methodType: 'POST',
      payload: { input: configJson, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        if (restConfigThis.currentGroupType === 'target') {
          restConfigThis.TargetData = response.data['result'];
        }
        restConfigThis[configJson.sourceType + 'test_response'] = response.data['result'];
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        restConfigThis[configJson.sourceType+ 'test_response']='Failed';
        return error;
      });
  }

  testApiCsv(configJson) {
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'TestApiCSV',
      methodType: 'POST',
      payload: { input: configJson, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        restConfigThis[configJson.sourceType+ 'test_response']=response.data['result'];
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        restConfigThis[configJson.sourceType+ 'test_response']='Failed';
        return error;
      });
  }

  TestOAuthToken(type) {  //TODO : Need to change this based on sourceType
    var restConfigThis = this;
    var input = this[type+ 'oauth_details'];
    if(input.grant_type==='password'){
      delete input['code'];
    }
    else{
      delete input['username'];
      delete input['password'];
    }
    var searchQuery = input;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'RestConfig',
      endpoint: 'TestOAuthToken',
      methodType: 'POST',
      payload: { input: searchQuery, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        restConfigThis[type+ 'oauth_token_data'] = response.data;
        if(response.data.hasOwnProperty('access_token')){
          restConfigThis[type+ 'oauth_data_panel_status'] = 'success';
        }
        else{
          restConfigThis[type+ 'oauth_data_panel_status'] = 'danger';
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @computed get GetSchema() {
    var searchQuery = { propertyArr: ['Schema', 'inputSchema', 'outputSchema'], groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name };
    var restConfigThis = this;
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
        restConfigThis.inputSchema = response.data['inputSchema'];
        restConfigThis.outputSchema = response.data['outputSchema'];
      })
      .catch(function (error) {
        return error;
      });
  }

  getInputData() {
    var restConfigThis = this;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetInputData',
      methodType: 'POST',
      payload: { input: {} },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        restConfigThis.inputData = response.data;
      })
      .catch(function (error) {
        return error;
      });
  }

  XMLToJson(type) {
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',      
      endpoint: 'GetJsonFromXML',
      methodType: 'POST',
      payload: {
        input: this['test_response']
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        restConfigThis.TargetData = response.data;
        ieGlobalVariable.loaderStore.turnoff();
        restConfigThis.fetchSchemaFromRawData(type);
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
  CSVToJson(type) {
    var searchQuery = {
      input: this['test_response']
    }
    if (BACKEND === 'Thingworx') {
      searchQuery = { csv_data: this['test_response'], delimeter: this['csv_delimeter'] }
    }
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'GetJsonFromCSV',
      methodType: 'POST',
      payload: searchQuery,
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        restConfigThis.TargetData = response.data;
        ieGlobalVariable.loaderStore.turnoff();
        restConfigThis.fetchSchemaFromRawData(type);
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  getCustomEndPoints(callback){
    if(BACKEND === 'LoopBack'){
    var restConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'api/v1/customEndPoints',
      endpoint: 'getCustomEndPoints',
      methodType: 'POST',
      payload: { groupType: this.currentGroupType,
                 groupName: this.currentGroupName,
                 configName: this.name,
                 tenantId: this.currentTenantID,
                 'query': {
                   'where': {
                     'configName': this.name,
                     'groupName': this.currentGroupName,
                     'tenantId': this.currentTenantID,
                     'groupType': this.currentGroupType,
                     'context':'reqVariables'
                   }
                 }
                },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        var temp_output = [];
        var temp_input = response.data.result;
        var obj = { id: '', text: 'select' }
        temp_output.push(obj)
        for(var i=0;i<temp_input.length;i++){
          var obj = { id: temp_input[i].name, text: temp_input[i].name }
          temp_output.push(obj)
        }
        restConfigThis.CustomEndPoints = temp_output;
        ieGlobalVariable.loaderStore.turnoff();
        if(callback){
          callback();
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        restConfigThis.CustomEndPoints=[{ id: '', text: 'none' }];
        return error;
      });
    }else{
      this.CustomEndPoints=[{ id: '', text: 'none' }];
      if(callback){
        callback();
      }
    }
  }
    // This method is used to set values in the object
  setvalue(name, value) {
    this[name] = value;
  }

}

export default RestClientStore;
