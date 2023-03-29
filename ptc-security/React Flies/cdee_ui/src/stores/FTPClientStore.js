/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import { observable, computed } from 'mobx';

class FTPClientStore {

  constructor(name) {
    // If you want to get a thing particularly then mention
    //thing name else it will default to FTPClient
    this.name = name ? name : 'FTPConfig';
    this.store_name = 'FTPClientStore'; //This is the filename
  }

  description = 'This is used to get FTPConfigs from ThingWorx';

  // declare thing attributes which are used in default thing template
  @observable new_config_name = '';
  @observable new_config_description = '';
  @observable FTPConfigs = [];
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
    ftpFileInfo:{}
  }
  @observable schedularScript = [];
  @observable ftpFileInfo = {
    fileName: '',
    fileType: '',
    filePath: '',
    fileData: '',
    fileEncodeType: '',
    csvDelimeter : ','
    
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

  // Methods On Default Thing template
  @computed get getFTPConfigs() {
    var ftpConfigThis = this;
    if (this.FTPConfigs.length === 0) {
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
        ftpConfigThis.setvalue('FTPConfigs', response.data.Configs);
        ftpConfigThis.setvalue('Configs', response.data.Configs);
        ftpConfigThis.getTotalConfigs;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function () {
        ieGlobalVariable.loaderStore.turnoff();
      });
  }

  @computed get getTotalConfigs() {
    var ftpConfigThis = this;
    const apiInput = {
      midpoint: 'FTPConfig',
      endpoint: 'GetTotalConfigs',
      methodType: 'POST',
      payload: { groupName: this.currentGroupName, groupType: this.currentGroupType, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        ftpConfigThis.config_names = response.data.Configs;
        ftpConfigThis.config_names = ftpConfigThis.config_names.map(function (x) { return x.toUpperCase() });
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
        isFTP: true,
        tenantId: this.currentTenantID
    }
    var ftpConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'FTPConfig',
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
          ftpConfigThis.name = response.data.result.Name;
          ftpConfigThis.setvalue('name', response.data.result.Name);
        }
        ftpConfigThis.new_config_name = '';
        ftpConfigThis.new_config_description = '';
        ieGlobalVariable.loaderStore.turnoff();
        enable_modal_tabs();
        ftpConfigThis.getFTPConfigs;
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

  // Methods on specific things
  @observable BasicConfigInfo = {};
  GetBasicConfigInfo() {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID };
    var ftpConfigThis = this;
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
        ftpConfigThis.BasicConfigInfo = response.data;
        ftpConfigThis.inputSchema = ftpConfigThis.BasicConfigInfo.inputSchema;
        ftpConfigThis.outputSchema = ftpConfigThis.BasicConfigInfo.outputSchema;
        if(Object.keys(ftpConfigThis.BasicConfigInfo.ftpFileInfo).length) {
          ftpConfigThis.ftpFileInfo = ftpConfigThis.BasicConfigInfo.ftpFileInfo;
        }
        if (response.data.ConfigJson) {
          if (Object.keys(response.data.ConfigJson).length > 0) {
            ftpConfigThis.configJson = ftpConfigThis.BasicConfigInfo.ConfigJson;
            ftpConfigThis.configJson.inputSchema  = ftpConfigThis.BasicConfigInfo.inputSchema;
            ftpConfigThis.configJson.outputSchema  = ftpConfigThis.BasicConfigInfo.outputSchema;
            ftpConfigThis.updatedConfigJson = ftpConfigThis.BasicConfigInfo.ConfigJson;
            if(Object.keys(ftpConfigThis.BasicConfigInfo.ConfigJson.RequestVariables).length) {
              ftpConfigThis.requestVariables = ftpConfigThis.BasicConfigInfo.ConfigJson.RequestVariables;
              ftpConfigThis.requestVariablesConfig = ftpConfigThis.BasicConfigInfo.ConfigJson.RequestVariablesConfig;
            }
              ftpConfigThis.schedularScript = ftpConfigThis.BasicConfigInfo.ConfigJson.schedularScript;

          }
        }
        if (ftpConfigThis.currentGroupName === '') {
          ftpConfigThis.currentGroupName = ftpConfigThis.BasicConfigInfo.Group;
        }
        if (ftpConfigThis.currentGroupType !== ftpConfigThis.BasicConfigInfo.GroupType) {
          ftpConfigThis.currentGroupType = ftpConfigThis.BasicConfigInfo.GroupType;
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @observable HostProperties = {};
  // Request: {}
  // Result: {'host_name':host_name,'host_url':host_url,'password': password, 'username': username}
  GetHostProperties() {
    var searchQuery = { groupName: this.currentGroupName,  groupType: this.currentGroupType, tenantId: this.currentTenantID, type: 'FTP'};
    var ftpConfigThis = this;
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
        // Return Data
        ftpConfigThis.HostProperties = response.data;
        if (response.data.selectMode === '' || response.data.selectMode === undefined) {
          ftpConfigThis.HostProperties.selectMode = 'FTP';
        }
        ieGlobalVariable.loaderStore.turnoff();
        if (ftpConfigThis.async_callback) {
          ftpConfigThis.async_callback(ftpConfigThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (ftpConfigThis.async_callback) {
          ftpConfigThis.async_callback(error);
        }
      });
  }
 @observable ftpConnectionStatus = '';
  @computed get SetHostProperties() {
    // HostProperties json as input to the API call
    var searchQuery = { groupName: this.currentGroupName, hostProperties: this.HostProperties, type: 'FTP' };
    var ftpConfigThis = this;
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
          ftpConfigThis.ftpConnectionStatus = response.data.result.FtpConnection || response.data.result.SFTPConnection;
        }
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        ftpConfigThis.GetHostProperties();
        if (ftpConfigThis.async_callback) {
          ftpConfigThis.async_callback(ftpConfigThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (ftpConfigThis.async_callback) {
          ftpConfigThis.async_callback(error);
        }
      });
  }

  @observable inputSchema = {};
  @observable outputSchema = {};
  @computed get GetSchema() {
    // Config JSON will ge in BasicConfigInfo so we will update the same in server also
    var searchQuery = { propertyArr: ['inputSchema', 'outputSchema'], groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID };
    var ftpConfigThis = this;
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
        ftpConfigThis.inputSchema = response.data['inputSchema'];
        ftpConfigThis.outputSchema = response.data['outputSchema'];
      })
      .catch(function (error) {
        return error;
      });
  }

  @computed get UpdateConfigJson() {
    // Config JSON will ge in BasicConfigInfo so we will update the same in server also
    var searchQuery = { ConfigJson: this.BasicConfigInfo['ConfigJson'] };
    var ftpConfigThis = this;
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
        ftpConfigThis.GetBasicConfigInfo();
      })
      .catch(function (error) {
        return error;
      });
  }
    //input is json key is property name and value is updated value: {'propertyName':value}
  SetPropValues(input_data) {
    var searchQuery = input_data;
    var ftpConfigThis = this;
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
        ftpConfigThis.GetSchema;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
  testApi() {
    var ftpConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    var input = {};
    input.configJson = this.configJson;
    input.configJson.ftpFileInfo = this.ftpFileInfo;
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
          if(response.data['response']) {
            if(response.data.fileType === 'JSON') {
              ftpConfigThis.ftpFileInfo.fileData = JSON.parse(response.data['response']);
            }else {
              ftpConfigThis.ftpFileInfo.fileData = response.data['response'];
            }
          }else {
            ftpConfigThis.ftpFileInfo.fileData = '/"error/":/"failed/"';
          }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ftpConfigThis.ftpFileInfo.fileData = (ftpConfigThis.ftpFileInfo.fileType === 'JSON') ? {'error': 'failed or no file found with that path or invalid data'} : '/"error/":/"failed/"';
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  testFTPData(input_data) {
    var searchQuery = input_data;
    var ftpConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'TestFTPData',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        if (response.data) {
          ftpConfigThis.JSONData = response.data.JSONData;
          if (ftpConfigThis.currentGroupType === 'source') {
            ftpConfigThis.outputSchema = response.data.SchemaFromData;
          } else if (ftpConfigThis.currentGroupType === 'target') {
            ftpConfigThis.inputSchema = response.data.SchemaFromData;
          }
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

    //Input: name of the thing to delete
    DeleteConfig(configName) {
      var searchQuery = configName;
      var ftpConfigThis = this;
      ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'FTPConfig',
      endpoint: 'DeleteConfig',
      methodType: 'POST',
      payload: { input: searchQuery, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: searchQuery, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
        .then(function (response) {
          ftpConfigThis.setvalue('FTPConfigs', response.data.Configs);
          ftpConfigThis.setvalue('Configs', response.data.Configs);
          ieGlobalVariable.loaderStore.turnoff();
          ftpConfigThis.setvalue('name', 'FTPConfig');
          ftpConfigThis.getFTPConfigs;
        })
        .catch(function (error) {
          ieGlobalVariable.loaderStore.turnoff();
          return error;
        });
    }
  @observable filesListData = {};
  getFilesListData(scriptResponse) {
    var ftpConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetFilesListData',
      methodType: 'POST',
      payload: {
        input: {
          scriptResponse: scriptResponse, ftpFileInfo:this.ftpFileInfo, groupType: this.currentGroupType, groupName: this.currentGroupName, tenantId: this.currentTenantID
        }
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        ftpConfigThis.filesListData = response.data;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  getInputData() {
    var ftpConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'PushDataToExternalSource',
      methodType: 'POST',
      payload: { input: {} },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
        .then(function (response) {
          ftpConfigThis.inputData = response.data;
          ieGlobalVariable.loaderStore.turnoff();
        })
        .catch(function (error) {
          ieGlobalVariable.loaderStore.turnoff();
          return error;
        });
  }

// This method is used to set values in the object
  setvalue(name, value) {
    this[name] = value;
  }

}

export default FTPClientStore;

