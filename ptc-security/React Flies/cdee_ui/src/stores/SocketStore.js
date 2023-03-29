/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import {observable,computed} from 'mobx';

class SocketStore {
  constructor(name) {
    // If you want to get a thing particularly then mention thing name else it will default to SocketConfig
    this.name = name ? name : 'SocketConfig';
    this.store_name = 'SocketStore'; //This is the filename
  }

  description = 'This is used to get SocketConfigs from ThingWorx';

  // declare thing attributes which are used in default thing template
  @observable new_config_name = '';
  @observable new_config_description = '';
  @observable new_config_data_source_category = '';
  @observable SocketConfigs = [];
  @observable Configs = [];
  @observable config_names = [];
  @observable FlexTotalAssInput = [];
  @observable SourceData = {};
  @observable TargetData = {};
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
  @observable configJson = {
    inputSchema: {},
    outputSchema: {},
    RequestVariables: {},
    RequestVariablesConfig: {},
    PrimaryKey: '',
    FlexPrimaryAPI: '',
    TimestampKey: '',
    TimestampFrom: 'Current Timestamp',
    CreatedAtDataProvider: '',
    UpdatedAtDataProvider: '',
    TransformationRules: [],
    eventName : '',
    current_data_format:'',
    eventPayload:'',
    enableSOP: false,
    executeSOP: ''
  };
  @observable currentGroupName = '';
  @observable currentGroupType = '';
  @observable currentTenantID = '';
  // This callback is used when API call is made, but callback is optional
  @observable async_callback = null;
  @observable updatedConfigJson={};
  @observable configMetaInfo={};
  @observable isPersistance = false;
  @observable isCaching = false;
  @observable  expiryTime = '';
  @observable  title = '';

  // Methods On Default Thing template
  @computed get getSocketConfigs() {
    var socketThis = this;
    if (this.SocketConfigs.length === 0) {
      ieGlobalVariable.loaderStore.turnon();
    }
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetAllConfigs',
      methodType: 'POST',
      payload: {
        groupName: this.currentGroupName,
        groupType: this.currentGroupType,
        tenantId: this.currentTenantID
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        socketThis.setvalue('SocketConfigs', response.data.Configs);
        socketThis.setvalue('Configs', response.data.Configs);
        socketThis.getTotalConfigs;
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(socketThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(error);
        }
      });
  }

  @computed get getTotalConfigs() {
    var searchQuery = {
        groupName: this.currentGroupName,
        groupType: this.currentGroupType,
        tenantId: this.currentTenantID
    }
    var socketThis = this;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetTotalConfigs',
      methodType: 'POST',
      payload: {
         input: searchQuery, groupType: this.currentGroupType
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        socketThis.config_names = response.data.Configs;
        socketThis.config_names = socketThis.config_names.map(function (x) { return x.toUpperCase() });
        if (socketThis.async_callback) {
          socketThis.async_callback(socketThis, response);
        }
      })
      .catch(function (error) {
        if (socketThis.async_callback) {
          socketThis.async_callback(error);
        }
      });
  }


  CreateConfig(generic_master_store, enable_modal_tabs) {
    var searchQuery = {
      name: this.new_config_name,
      description: this.new_config_description,
      configDataSourceCategory: generic_master_store.groupType,
      groupName: this.currentGroupName,
      isFlex: true,
      tenantId: this.currentTenantID
    }
    var socketThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'CreateConfig',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        socketThis.getSocketConfigs;
        socketThis.GetHostProperties;
        ieGlobalVariable.loaderStore.turnoff();
        enable_modal_tabs();
        if (socketThis.async_callback) {
          socketThis.async_callback(socketThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(error);
        }
      });
  }


  // Methods on specific Configs
  @observable BasicConfigInfo = {};

  @observable inputSchema = {};
  @observable outputSchema = {};
  GetBasicConfigInfo(createAlert, setStateSchema) {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID };
    var socketThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetBasicConfigInfo',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        socketThis.BasicConfigInfo = response.data;
        socketThis.inputSchema = socketThis.BasicConfigInfo['inputSchema'];
        socketThis.outputSchema = socketThis.BasicConfigInfo['outputSchema'];
        socketThis.configJson = socketThis.BasicConfigInfo['ConfigJson'];
        socketThis.RequestVariablesConfig = socketThis.configJson['RequestVariablesConfig']?socketThis.configJson['RequestVariablesConfig']:{};
        socketThis.RequestVariables = socketThis.configJson['RequestVariables']?socketThis.configJson['RequestVariables']:{};
        if (response.data.ConfigJson) {
          if (Object.keys(response.data.ConfigJson).length > 0) {
            socketThis.configJson = socketThis.BasicConfigInfo['ConfigJson'];
            socketThis.updatedConfigJson = socketThis.BasicConfigInfo.ConfigJson;
          }
        }
        if (socketThis.currentGroupName === '') {
          socketThis.currentGroupName = socketThis.BasicConfigInfo.Group;
        }
        if (socketThis.currentGroupType !== socketThis.BasicConfigInfo.GroupType) {
          socketThis.currentGroupType = socketThis.BasicConfigInfo.GroupType;
        }
        if (createAlert) {
          createAlert();
        }
        setTimeout(function () {
          ieGlobalVariable.loaderStore.turnoff();
        }.bind(this), 2000);
        if (socketThis.async_callback) {
          socketThis.async_callback(socketThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(error);
        }
      });
      if(setStateSchema) {
          setStateSchema();
      }
  }

  //Input: name of the thing to delete
  DeleteConfig(configName) {
    var searchQuery = configName;
    var socketThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'SocketConfig',
      endpoint: 'DeleteConfig',
      methodType: 'POST',
      payload: { input: searchQuery, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: configName, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        socketThis.setvalue('SocketConfigs', response.data.Configs);
        socketThis.setvalue('Configs', response.data.Configs);
        socketThis.setvalue('name', 'SocketConfig');
        socketThis.getSocketConfigs;
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(socketThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @observable HostProperties = {};
  // Request: {}
  // Result: {'host_name':host_name,'host_url':host_url,'password': password, 'username': username}
  @computed get GetHostProperties() {
    var searchQuery = {}
    var socketThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetHostProperties',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        socketThis.HostProperties = response.data;
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(socketThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(error);
        }
      });
  }

  // Request: {"input": {"host_name":host_name,"host_url":host_url,"password": password, "username": username}}
  // Result: {"input": {"host_name":host_name,"host_url":host_url,"password": password, "username": username}}
  @computed get SetHostProperties() {
    // HostProperties json as input to the API call
    var searchQuery = this.HostProperties;
    var socketThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetHostProperties',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        socketThis.GetHostProperties;
        if (socketThis.async_callback) {
          socketThis.async_callback(socketThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(error);
        }
      });
  }

  //input is json key is property name and value is updated value: {"propertyName":value}
  SetPropValues(inputData) {
    var searchQuery = inputData;
      var socketThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetPropValues',
      methodType: 'POST',
      payload: {
        input: searchQuery, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(socketThis, response);
        }
        if(response && response.hasOwnProperty('data') && response.data.hasOwnProperty('ConfigJson')){
            socketThis.updatedConfigJson=response.data.ConfigJson
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(error);
        }
      });
  }
  @computed get getConfigJson() {
    // Config JSON will ge in BasicConfigInfo so we will update the same in server also
    var searchQuery = {
      propertyArr: ['ConfigJson'],
      groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID
    };
    var socketThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetPropValues',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        if (JSON.stringify(response.data['ConfigJson']) !== '{}') {
          socketThis.configJson = response.data['ConfigJson'];
        }

        if (socketThis.async_callback) {
          socketThis.async_callback(socketThis, response);
        }
        setTimeout(function () {
            ieGlobalVariable.loaderStore.turnoff();
        }.bind(this), 3000);
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (socketThis.async_callback) {
          socketThis.async_callback(error);
        }
      });
  }


  @observable groupHostProperties = {};
  //Inputs: groupName(String)
  //output: response.data(JSON)
  getGroupHostProperties(createAlert) {
    var searchQuery = { groupName: this.currentGroupName,  groupType: this.currentGroupType, tenantId: this.currentTenantID, type: 'socket' };
    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'GetGroupHostProperties',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
     .then(function (response) {
        // Return Data
       internalThis.groupHostProperties = response.data.result.hostProperties;
       internalThis.currentTenantID = response.data.result.tenantId;
       ieGlobalVariable.loaderStore.turnoff();
       if(createAlert) {
         createAlert();
       }

       if (internalThis.async_callback) {
         internalThis.async_callback(internalThis, response);
       }
     })
    .catch(function (error) {
      ieGlobalVariable.loaderStore.turnoff();

      if (internalThis.async_callback) {
        internalThis.async_callback(error);
      }
    });
  }

  //Inputs: groupName(String), HostProperties(JSON)
  //output: response.data(JSON)
  setGroupHostProperties() {
    var searchQuery = {
        groupName: this.currentGroupName, hostProperties: this.groupHostProperties, groupType: this.currentGroupType, tenantId: this.currentTenantID, type: 'socket'
    };
    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'SetGroupHostProperties',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
    .then(function (response) {
      // Return Data
      internalThis.groupHostProperties = response.data;
      ieGlobalVariable.loaderStore.turnoff();

      if (internalThis.async_callback) {
        internalThis.async_callback(internalThis, response);
      }
    })
    .catch(function (error) {
      ieGlobalVariable.loaderStore.turnoff();

      if (internalThis.async_callback) {
        internalThis.async_callback(error);
      }
    });
  }

  testApi() {
      var internalThis = this;
      ieGlobalVariable.loaderStore.turnon();
      const apiInput = {
          midpoint: 'SocketConfig',
          endpoint: 'TestApi',
          methodType: 'POST',
          payload: {
              input: {
                  socketInfo: this.groupHostProperties,
                  configJson: this.configJson,
                  groupType: this.currentGroupType,
                  groupName: this.currentGroupName,
                  configName: this.name,
                  tenantId: this.currentTenantID
              }
          },
          queryparam: null,
          headers: null
      };
      backendServer.api_call(apiInput)
          .then(function (response) {
              if(internalThis.currentGroupType === 'target') {
                  internalThis.TargetData = response.data['result'];
              }
              else{
                  internalThis.SourceData = response.data['result'];
              }
              ieGlobalVariable.loaderStore.turnoff();
          })
          .catch(function (error) {
              ieGlobalVariable.loaderStore.turnoff();
              return error;
          });
  }


  fetchSchemaFromData() {
      var data = {};
      ieGlobalVariable.loaderStore.turnon();
      if (this.currentGroupType === 'source') {
          try{
            data = JSON.parse(this.SourceData);
          }catch(err){
            data = this.SourceData;
          }
      } else if (this.currentGroupType === 'target') {
          try{
            data = JSON.parse(this.TargetData);
          }catch(err){
            data = this.TargetData;
          }
      }
      var internalThis = this;
      const apiInput = {
          midpoint: this.name,
          endpoint: 'getSchemaFromJson',
          methodType: 'POST',
          payload: {
              input: data,
              groupType: this.currentGroupType,
              groupName: this.currentGroupName,
              configName: this.name,
              configJson:this.configJson,
              current_data_format: this.configJson.current_data_format,
              tenantId: this.currentTenantID
          },
          queryparam: null,
          headers: null
      };
      backendServer.api_call(apiInput)
          .then(function (response) {
              if (internalThis.currentGroupType === 'source') {
                  internalThis.outputSchema = response.data;
                  internalThis.configJson.outputSchema = response.data;
              } else if (internalThis.currentGroupType === 'target') {
                  internalThis.inputSchema = response.data;
                  internalThis.configJson.inputSchema = response.data;
              }
              ieGlobalVariable.loaderStore.turnoff();
          })
          .catch(function (error) {
              ieGlobalVariable.loaderStore.turnoff();
              if (internalThis.currentGroupType === 'source') {
                  internalThis.outputSchema = {};
                  internalThis.configJson.outputSchema = { error: 'Failed' };
              } else if (internalThis.currentGroupType === 'target') {
                  internalThis.inputSchema = {};
                  internalThis.configJson.inputSchema = { error: 'Failed' };
              }
              return error;
          });
  }

  @computed get getConfigMetaInfo() {
     var searchQuery = {
       groupName: this.currentGroupName,
       groupType: this.currentGroupType,
       name:this.name,
       persisting:this.isPersistance,
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

  @observable RequestVariables = {}
  @observable RequestVariablesConfig = {}

  extractRequestVariables(txt){
    var newTxt = txt.split('((');
    var variables = [];
    for (var i = 1; i < newTxt.length; i++) {
      variables.push(newTxt[i].split('))')[0]);
  }
    var temp_json = {}
    var existed_json = this.RequestVariables;
    if(variables.length>0){
      for(var k=0;k<variables.length;k++){
        if(existed_json[variables[k]]!==undefined){
          temp_json[variables[k]]=existed_json[variables[k]];
        }
        else{
          temp_json[variables[k]] = '';
        }
      }
    }
    return temp_json;
  }

  extractRequestVariablesConfig(txt){
    var newTxt = txt.split('((');
    var variables = [];
    for (var i = 1; i < newTxt.length; i++) {
      variables.push(newTxt[i].split('))')[0]);
  }
    var temp_json = {}
    var existed_json = this.RequestVariablesConfig;
    if(variables.length>0){
      for(var k=0;k<variables.length;k++){
        if(existed_json[variables[k]]!==undefined){
          temp_json[variables[k]]=existed_json[variables[k]];
        }
        else{
          temp_json[variables[k]] = '';
        }
      }
    }
    return temp_json;
  }

  // This method is used to set values in the object
  setvalue(name, value) {
    this[name] = value;
  }

}

export default SocketStore;
