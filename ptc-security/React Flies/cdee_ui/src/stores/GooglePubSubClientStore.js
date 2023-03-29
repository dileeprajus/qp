/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */

import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import { observable, computed } from 'mobx';

class GooglePubSubClientStore {
constructor(name) {
    this.name = name ? name : 'GooglePubSubConfig';
    this.store_name = 'GooglePubSubClientStore';
}

description = 'This is used to get GooglePubSubConfigs from ThingWorx';

// declare thing attributes which are used in default thing template
@observable new_config_name = '';
@observable new_config_description = '';
@observable GooglePubSubConfigs = [];
@observable Configs = [];
@observable config_names = [];
@observable JSONData = {};
@observable updatedConfigJson = {};
@observable configJson = {
  inputSchema: {},
  outputSchema: {},
  PrimaryKey: '',
  TimestampFrom: 'Current Timestamp',
  CreatedAtDataProvider: '',
  UpdatedAtDataProvider: '',
  TransformationRules: [],
  RequestVariables: {},
  RequestVariablesConfig: {},
  enableSOP: false,
  executeSOP: '',
  schedularScript: [],
  privateKeyFileInfo:{},
  googlePubSubEditFileInfo:{}
}
@observable schedularScript = [];
@observable privateKeyFileInfo = {
  fileName: '',
  fileType: 'JSON',
  fileData: '',
  fileEncodeType: '',
  csvDelimeter : ','
  
}
@observable googlePubSubEditFileInfo = {
  fileName: '',
  fileType: 'JSON',
  fileData: '',
  fileEncodeType: '',
  csvDelimeter : ',',
  topicName :'',
  subscriptionName : '',
  maxMessages : 1
}
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
@observable inputData = {};
@observable triggerData = '';
@observable triggerDataResponse = {};
@observable currentGroupName = '';
@observable currentGroupType = '';
@observable currentTenantID = '';
@observable configMetaInfo={};
@observable isPersistance = false;
@observable  expiryTime = '';
@observable  title = '';
@observable HostProperties = {};


GetHostProperties() {
  var searchQuery = { groupName: this.currentGroupName,  groupType: this.currentGroupType, tenantId: this.currentTenantID, type: 'Publisher'};
  var GooglePubSubConfigThis = this;
  ieGlobalVariable.loaderStore.turnon();
  const apiInput = {
    midpoint: 'GenericIEMasterConfig',
    endpoint: 'GetGroupHostProperties',
    methodType: 'POST',
    payload: {
      input: searchQuery
    },
    queryparam: null,
    headers: null
  };
  backendServer.api_call(apiInput)
    .then(function (response) {
      GooglePubSubConfigThis.HostProperties = response.data;
      console.log('host response data',response.data);
      GooglePubSubConfigThis.HostProperties.fileContent ='';
        GooglePubSubConfigThis.HostProperties.filestate ='';
       var gcpcontent= response.data.privateKey;
        if(gcpcontent.fileData!==undefined){
        var gcpcontent2= gcpcontent.fileData;
         
          if(gcpcontent2.private_key!==undefined){
            GooglePubSubConfigThis.HostProperties.fileContent = 'File Exists';
          }
        }
      if ((response.data.selectMode === '' && GooglePubSubConfigThis.currentGroupType === 'target') || (response.data.selectMode === undefined && GooglePubSubConfigThis.currentGroupType === 'target')) {
        GooglePubSubConfigThis.HostProperties.selectMode = 'Publisher';
      }
      else if ((response.data.selectMode === '' && GooglePubSubConfigThis.currentGroupType === 'source') || (response.data.selectMode === undefined && GooglePubSubConfigThis.currentGroupType === 'source')){
        GooglePubSubConfigThis.HostProperties.selectMode = 'Subscriber';
      }
      ieGlobalVariable.loaderStore.turnoff();
      if (GooglePubSubConfigThis.async_callback) {
        GooglePubSubConfigThis.async_callback(GooglePubSubConfigThis, response);
      }
    })
    .catch(function (error) {
      ieGlobalVariable.loaderStore.turnoff();
      if (GooglePubSubConfigThis.async_callback) {
        GooglePubSubConfigThis.async_callback(error);
      }
    });
}

@observable googlePubSubConnectionStatus = '';
  @computed get SetHostProperties() {
    // HostProperties json as input to the API call
    var searchQuery = { groupName: this.currentGroupName, hostProperties: this.HostProperties, type: 'Publisher' };
    var GooglePubSubConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'SetGroupHostProperties',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    return backendServer.api_call(apiInput)
      .then(function (response) {
        if(Object.keys(response.data).length) {
          GooglePubSubConfigThis.googlePubSubConnectionStatus = response.data.status;
        }
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        GooglePubSubConfigThis.GetHostProperties();
        if (GooglePubSubConfigThis.async_callback) {
          GooglePubSubConfigThis.async_callback(GooglePubSubConfigThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (GooglePubSubConfigThis.async_callback) {
          GooglePubSubConfigThis.async_callback(error);
        }
      });
  }
  @observable topicsList = [];
  @computed get GetListOfTopics() {
    // HostProperties json as input to the API call
    var searchQuery = { groupName : this.currentGroupName};
    var GooglePubSubConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GooglePubSubConfig',
      endpoint: 'GetListOfTopics',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    return backendServer.api_call(apiInput)
      .then(function (response) {
        if(Object.keys(response.data).length) {
          GooglePubSubConfigThis.topicsList = response.data.topics;
          console.log('List of topics',response.data.topics);
          GooglePubSubConfigThis.GetListOfSubscriptions(GooglePubSubConfigThis.googlePubSubEditFileInfo.topicName);
        }
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        if (GooglePubSubConfigThis.async_callback) {
          GooglePubSubConfigThis.async_callback(GooglePubSubConfigThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (GooglePubSubConfigThis.async_callback) {
          GooglePubSubConfigThis.async_callback(error);
        }
      });
  }
  @observable subscriptionList = [];
   GetListOfSubscriptions(topic_name) {
    // HostProperties json as input to the API call
    var searchQuery = { groupName : this.currentGroupName , topicName : topic_name};
    var GooglePubSubConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GooglePubSubConfig',
      endpoint: 'GetListOfSubscriptions',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    return backendServer.api_call(apiInput)
      .then(function (response) {
        if(Object.keys(response.data).length) {
          GooglePubSubConfigThis.subscriptionList = response.data.subscriptions;
          console.log('List of subscriptions',response.data.subscriptions);
        }
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        if (GooglePubSubConfigThis.async_callback) {
          GooglePubSubConfigThis.async_callback(GooglePubSubConfigThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (GooglePubSubConfigThis.async_callback) {
          GooglePubSubConfigThis.async_callback(error);
        }
      });
  }

  DeleteConfig(configName) {
    var searchQuery = configName;
    var GooglePubSubConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
  const apiInput = {
    midpoint: 'GooglePubSubConfig',
    endpoint: 'DeleteConfig',
    methodType: 'POST',
    payload: { input: searchQuery, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: searchQuery, tenantId: this.currentTenantID },
    queryparam: null,
    headers: null
  };
  backendServer.api_call(apiInput)
      .then(function (response) {
        GooglePubSubConfigThis.setvalue('GooglePubSubConfigs', response.data.Configs);
        GooglePubSubConfigThis.setvalue('Configs', response.data.Configs);
        ieGlobalVariable.loaderStore.turnoff();
        GooglePubSubConfigThis.setvalue('name', 'GooglePubSubConfig');
        GooglePubSubConfigThis.getGooglePubSubConfigs;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
  @computed get getGooglePubSubConfigs() {
    var GooglePubSubConfigThis = this;
    if (this.GooglePubSubConfigs.length === 0) {
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
        GooglePubSubConfigThis.setvalue('GooglePubSubConfigs', response.data.Configs);
        GooglePubSubConfigThis.setvalue('Configs', response.data.Configs);
        GooglePubSubConfigThis.getTotalConfigs;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function () {
        ieGlobalVariable.loaderStore.turnoff();
      });
  }
  @computed get getTotalConfigs() {
    var GooglePubSubConfigThis = this;
    const apiInput = {
      midpoint: 'GooglePubSubConfig',
      endpoint: 'GetTotalConfigs',
      methodType: 'POST',
      payload: { groupName: this.currentGroupName, groupType: this.currentGroupType, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        GooglePubSubConfigThis.config_names = response.data.Configs;
        GooglePubSubConfigThis.config_names = GooglePubSubConfigThis.config_names.map(function (x) { return x.toUpperCase() });
      })
      .catch(function (error) {
        return error;
      });
  }

  CreateConfig(generic_master_store, enable_modal_tabs) {
    var searchQuery = {
      name: this.new_config_name,
        description: this.new_config_description,
        groupName: this.currentGroupName,
        configDataSourceCategory: generic_master_store.groupType,
        isGooglePubSub: true,
        tenantId: this.currentTenantID
    }
    var GooglePubSubConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GooglePubSubConfig',
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
          GooglePubSubConfigThis.name = response.data.result.Name;
          GooglePubSubConfigThis.setvalue('name', response.data.result.Name);
        }
        GooglePubSubConfigThis.new_config_name = '';
        GooglePubSubConfigThis.new_config_description = '';
        ieGlobalVariable.loaderStore.turnoff();
        enable_modal_tabs();
        GooglePubSubConfigThis.getGooglePubSubConfigs;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
  @observable BasicConfigInfo = {};
  GetBasicConfigInfo() {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID };
    var GooglePubSubConfigThis = this;
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
        GooglePubSubConfigThis.BasicConfigInfo = response.data;
        GooglePubSubConfigThis.inputSchema = GooglePubSubConfigThis.BasicConfigInfo.inputSchema;
        GooglePubSubConfigThis.outputSchema = GooglePubSubConfigThis.BasicConfigInfo.outputSchema;
        if(Object.keys(GooglePubSubConfigThis.BasicConfigInfo.googlePubSubEditFileInfo).length) {
          GooglePubSubConfigThis.googlePubSubEditFileInfo = GooglePubSubConfigThis.BasicConfigInfo.googlePubSubEditFileInfo;
        }
        if (response.data.ConfigJson) {
          if (Object.keys(response.data.ConfigJson).length > 0) {
            GooglePubSubConfigThis.configJson = GooglePubSubConfigThis.BasicConfigInfo.ConfigJson;
            GooglePubSubConfigThis.configJson.inputSchema  = GooglePubSubConfigThis.BasicConfigInfo.inputSchema;
            GooglePubSubConfigThis.configJson.outputSchema  = GooglePubSubConfigThis.BasicConfigInfo.outputSchema;
            GooglePubSubConfigThis.updatedConfigJson = GooglePubSubConfigThis.BasicConfigInfo.ConfigJson;
            if(Object.keys(GooglePubSubConfigThis.BasicConfigInfo.ConfigJson.RequestVariables).length) {
              GooglePubSubConfigThis.requestVariables = GooglePubSubConfigThis.BasicConfigInfo.ConfigJson.RequestVariables;
              GooglePubSubConfigThis.requestVariablesConfig = GooglePubSubConfigThis.BasicConfigInfo.ConfigJson.RequestVariablesConfig;
            }
              GooglePubSubConfigThis.schedularScript = GooglePubSubConfigThis.BasicConfigInfo.ConfigJson.schedularScript;

          }
        }
        if (GooglePubSubConfigThis.currentGroupName === '') {
          GooglePubSubConfigThis.currentGroupName = GooglePubSubConfigThis.BasicConfigInfo.Group;
        }
        if (GooglePubSubConfigThis.currentGroupType !== GooglePubSubConfigThis.BasicConfigInfo.GroupType) {
          GooglePubSubConfigThis.currentGroupType = GooglePubSubConfigThis.BasicConfigInfo.GroupType;
        }
        GooglePubSubConfigThis.GetListOfTopics();
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
  testGooglePubSubData(input_data) {
    var searchQuery = input_data;
    var GooglePubSubConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'TestGooglePubSubData',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        if (response.data) {
          GooglePubSubConfigThis.JSONData = response.data.JSONData;
          if (GooglePubSubConfigThis.currentGroupType === 'source') {
            GooglePubSubConfigThis.outputSchema = response.data.SchemaFromData;
          } else if (GooglePubSubConfigThis.currentGroupType === 'target') {
            GooglePubSubConfigThis.inputSchema = response.data.SchemaFromData;
          }
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @observable requestVariables = {
    filePath:{},
    fileName:{}
  };
  @observable requestVariablesConfig = {
    filePath:{},
    fileName:{}
  };
  
  normaliseRequestVariables() {
    for (var rv in this.requestVariablesConfig) {
      if (Object.keys(this.requestVariablesConfig[rv]).length) {
        for(var k in this.requestVariablesConfig[rv]) {
          this.requestVariables[rv][k] = this.requestVariablesConfig[rv][k].defaultValue
        }
      }
    }
    var r =  this.requestVariables // eslint-disable-line no-unused-vars
  }

  extractRequestVariables(txt,key){
    var newTxt = txt.split('((');
    var variables = [];
    for (var i = 1; i < newTxt.length; i++) {
      variables.push(newTxt[i].split('))')[0]);
    }
    var temp_json = {};
    var temp_rv_config = {};
    var existed_json = this.requestVariables[key];
    var existed_rv_json = this.requestVariablesConfig[key];
    if(variables.length>0){
      for(var k=0;k<variables.length;k++){
        if (variables[k]!=='') {
          if(existed_json[variables[k]]!==undefined){
            temp_json[variables[k]]=existed_json[variables[k]];
            temp_rv_config[variables[k]]=existed_rv_json[variables[k]];
          } else {
            temp_json[variables[k]]='';
            temp_rv_config[variables[k]] = {};
          }
          if(temp_rv_config[variables[k]]) {
            temp_rv_config[variables[k]]['defaultValue'] = '';
          }
        }
      }
    }
    this.requestVariables[key] = temp_json;
    this.requestVariablesConfig[key] = temp_rv_config;
  }
  @observable inputSchema = {};
  @observable outputSchema = {};
  @computed get GetSchema() {
    // Config JSON will ge in BasicConfigInfo so we will update the same in server also
    var searchQuery = { propertyArr: ['inputSchema', 'outputSchema'], groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID };
    var GooglePubSubConfigThis = this;
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
        GooglePubSubConfigThis.inputSchema = response.data['inputSchema'];
        GooglePubSubConfigThis.outputSchema = response.data['outputSchema'];
      })
      .catch(function (error) {
        return error;
      });
  }
  @computed get UpdateConfigJson() {
    // Config JSON will ge in BasicConfigInfo so we will update the same in server also
    var searchQuery = { ConfigJson: this.BasicConfigInfo['ConfigJson'] };
    var GooglePubSubConfigThis = this;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'UpdateConfigJson',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function () {
        // Return Data
        // Update the same from the server - refetch the same values from server
        GooglePubSubConfigThis.GetBasicConfigInfo();
      })
      .catch(function (error) {
        return error;
      });
  }
  SetPropValues(input_data) {
    var searchQuery = input_data;
    var GooglePubSubConfigThis = this;
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
      .then(function () {
        ieGlobalVariable.loaderStore.turnoff();
        GooglePubSubConfigThis.GetSchema;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
  testApi() {
    var GooglePubSubConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    var input = {};
    input.configJson = this.configJson;
    input.configJson.googlePubSubEditFileInfo = this.googlePubSubEditFileInfo;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'TestApi',
      methodType: 'POST',
      payload: { input: input, request_variables: this.requestVariables, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        if(response.data){
        GooglePubSubConfigThis.googlePubSubEditFileInfo.fileData = response.data;
        ieGlobalVariable.loaderStore.turnoff();
        }
      })
      .catch(function (error) {
        GooglePubSubConfigThis.googlePubSubEditFileInfo.fileData = (GooglePubSubConfigThis.googlePubSubEditFileInfo.fileType === 'JSON') ? {'error': 'failed or no file found with that path or invalid data'} : '/"error/":/"failed/"';
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }


setvalue(name, value) {
    this[name] = value;
  }
}

export default GooglePubSubClientStore;