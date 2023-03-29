/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import {observable,computed} from 'mobx';

class DataBaseStore {
  constructor(name) {
    // If you want to get a thing particularly then mention thing name else it will default to FlexConfig
    this.name = name ? name : 'DataBaseConfig';
    this.store_name = 'DataBaseStore'; //This is the filename
  }

  description = 'This is used to get DataBaseConfigs from ThingWorx';

  // declare thing attributes which are used in default thing template
  @observable currentTenantID = '';
  @observable new_config_name = '';
  @observable new_config_description = '';
  @observable new_config_data_source_category = '';
  @observable DataBaseConfigs = [];
  @observable Configs = [];
  @observable config_names = [];
  @observable FlexTotalAssInput = [];
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

  @observable RequestVariablesConfig = {}
  @observable RequestVariables = {}

  @observable configJson = {
    inputSchema: {},
    outputSchema: {},
    RequestVariablesConfig: {},
    RequestVariables: {},
    PrimaryKey: '',
    TimestampKey: '',
    TimestampFrom: 'Current Timestamp',
    CreatedAtDataProvider: '',
    UpdatedAtDataProvider: '',
    TransformationRules: [],
    current_data_format: 'JSON',
    enableSOP: false,
    executeSOP: ''
  };
  @observable currentGroupName = '';
  @observable currentGroupType = '';
  @observable selectedFlexRootObjName = '';
  @observable selectedFlexRootObjTypeName = 'Select Any Node';
  // This callback is used when API call is made, but callback is optional
  @observable async_callback = null;
    // this fix for bug no. 262
  @observable updatedConfigJson={};

  // Methods On Default Thing template
  @computed get getDataBaseConfigs() {
    var dbThis = this;
    if (this.DataBaseConfigs.length === 0) {
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
        dbThis.setvalue('DataBaseConfigs', response.data.Configs);
        dbThis.setvalue('Configs', response.data.Configs);
        dbThis.getTotalConfigs;
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(dbThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(error);
        }
      });
  }

  @computed get getTotalConfigs() {
    var dbThis = this;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetTotalConfigs',
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
        dbThis.config_names = response.data.Configs;
        dbThis.config_names = dbThis.config_names.map(function (x) { return x.toUpperCase() });
        if (dbThis.async_callback) {
          dbThis.async_callback(dbThis, response);
        }
      })
      .catch(function (error) {
        if (dbThis.async_callback) {
          dbThis.async_callback(error);
        }
      });
  }


  CreateConfig(generic_master_store, enable_modal_tabs) {
    var searchQuery = {
      name: this.new_config_name,
      description: this.new_config_description,
      configDataSourceCategory: generic_master_store.groupType,
      groupName: this.currentGroupName,
      isFlex: false,
      tenantId: this.currentTenantID,
      groupType: this.currentGroupType
    }
    var dbThis = this;
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
        if (response.data.result) {
          dbThis.name = response.data.result.Name;
          dbThis.setvalue('name', response.data.result.Name);
          dbThis.setvalue('currentTenantID', response.data.result.tenantId);
        dbThis.getDataBaseConfigs;
        if (enable_modal_tabs) {
          enable_modal_tabs(response.data.result.tenantId);
        }
      }
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(dbThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(error);
        }
      });
  }


  // Methods on specific Configs
  @observable BasicConfigInfo = {};

  @observable inputSchema = {};
  @observable outputSchema = {};
  GetBasicConfigInfo(updateSchema, createAlert, renderSchemaByTypeId) {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID }
    var dbThis = this;
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
        dbThis.BasicConfigInfo = response.data;
        dbThis.inputSchema = dbThis.BasicConfigInfo['inputSchema'];
        dbThis.outputSchema = dbThis.BasicConfigInfo['outputSchema'];
        dbThis.configJson = dbThis.BasicConfigInfo['ConfigJson'];
        dbThis.RequestVariablesConfig = dbThis.configJson['RequestVariablesConfig']?dbThis.configJson['RequestVariablesConfig']:{};
        dbThis.RequestVariables = dbThis.configJson['RequestVariables']?dbThis.configJson['RequestVariables']:{};
        if (dbThis.currentGroupName === '') {
          dbThis.currentGroupName = dbThis.BasicConfigInfo.Group;
        }
        if (dbThis.currentGroupType !== dbThis.BasicConfigInfo.GroupType) {
          dbThis.currentGroupType = dbThis.BasicConfigInfo.GroupType;
        }
        if (updateSchema) {
          updateSchema();
        }
        if(createAlert) {
            createAlert();
        }
        if(renderSchemaByTypeId) {
            renderSchemaByTypeId();
        }

        setTimeout(function () {
          ieGlobalVariable.loaderStore.turnoff();
        }.bind(this), 2000);
        if (dbThis.async_callback) {
          dbThis.async_callback(dbThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(error);
        }
      });
  }

  //Input: name of the thing to delete
  DeleteConfig(configName) {
    var searchQuery = configName;
    var dbThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'DeleteConfig',
      methodType: 'POST',
      payload: {
        input: searchQuery, tenantId: this.currentTenantID, groupType: this.currentGroupType, groupName: this.currentGroupName
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        dbThis.setvalue('DataBaseConfigs', response.data.Configs);
        dbThis.setvalue('Configs', response.data.Configs);
        dbThis.setvalue('name', 'DataBaseConfig');
        dbThis.getDataBaseConfigs;
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(dbThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @computed get UpdateConfigJson() {
    // Config JSON will ge in BasicConfigInfo so we will update the same in server also
    var searchQuery = {
      ConfigJson: this.BasicConfigInfo['ConfigJson']
    };
    var dbThis = this;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetPropValues',
      methodType: 'POST',
      payload: {
        input: searchQuery, tenantId: this.currentTenantID, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        // Update the same from the server - refetch the same values from server
        dbThis.GetBasicConfigInfo;
        if (dbThis.async_callback) {
          dbThis.async_callback(dbThis, response);
        }
      })
      .catch(function (error) {
        if (dbThis.async_callback) {
          dbThis.async_callback(error);
        }
      });
  }

  @observable HostProperties = {};
  @computed get GetHostProperties() {
    // for now search query is nil
    var searchQuery = {}
    var dbThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetHostProperties',
      methodType: 'POST',
      payload: {
        input: searchQuery, tenantId: this.currentTenantID, groupType: this.currentGroupType, groupName: this.currentGroupName
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        dbThis.HostProperties = response.data;
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(dbThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(error);
        }
      });
  }

  // Request: {"input": {"host_name":host_name,"host_url":host_url,"password": password, "username": username}}
  // Result: {"input": {"host_name":host_name,"host_url":host_url,"password": password, "username": username}}
  @computed get SetHostProperties() {
    // HostProperties json as input to the API call
    var searchQuery = this.HostProperties;
    var dbThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetHostProperties',
      methodType: 'POST',
      payload: {
        input: searchQuery, tenantId: this.currentTenantID, groupType: this.currentGroupType, groupName: this.currentGroupName
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        dbThis.GetHostProperties;
        if (dbThis.async_callback) {
          dbThis.async_callback(dbThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(error);
        }
      });
  }

//*****************************************************TODO
  //input is json key is property name and value is updated value: {"propertyName":value}
  SetPropValues(inputData) {
    var searchQuery = inputData;
    var dbThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetPropValues',
      methodType: 'POST',
      payload: {
        input: searchQuery, tenantId: this.currentTenantID, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(dbThis, response);
        }
        if(response && response.hasOwnProperty('data') && response.data.hasOwnProperty('ConfigJson')){
            dbThis.updatedConfigJson=response.data.ConfigJson
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(error);
        }
      });
  }
  @computed get getConfigJson() {
    // Config JSON will ge in BasicConfigInfo so we will update the same in server also
    var searchQuery = {
      propertyArr: ['ConfigJson'],
      groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID
    };
    var dbThis = this;
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
          dbThis.configJson = response.data['ConfigJson'];
        }
        if (dbThis.async_callback) {
          dbThis.async_callback(dbThis, response);
        }
        setTimeout(function () {
            ieGlobalVariable.loaderStore.turnoff();
        }.bind(this), 3000);
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (dbThis.async_callback) {
          dbThis.async_callback(error);
        }
      });
  }


  @observable groupHostProperties = { url: '', port: '', userName: '', password: '', databaseName: '', databaseType: '' };
  //Inputs: groupName(String)
  //output: response.data(JSON)
  getGroupHostProperties(createAlert) {
    var searchQuery = { groupName: this.currentGroupName, type: 'database', groupType: this.currentGroupType, tenantId: this.currentTenantID };
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
    var searchQuery = { groupName: this.currentGroupName, hostProperties: this.groupHostProperties, type: 'database', groupType: this.currentGroupType, tenantId: this.currentTenantID };
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

  @observable test_response = {};
  @observable TargetData = {};

  testDBApi() {
    var dbConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'TestDBApi',
      methodType: 'POST',
      payload: { input: this.configJson, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        if(dbConfigThis.currentGroupType === 'target') {
          dbConfigThis.TargetData = response.data['result'];
        }
        else{
          dbConfigThis.test_response = response.data['result'];
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        dbConfigThis.test_response={ 'error': 'Failed' };
        return error;
      });
  }

  fetchSchemaFromRawData() {
    var data = {};
    if (this.currentGroupType==='target'){
      data = this.TargetData;
    }else{
      data = this.test_response;
    }
    var dbConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'GetSchemaFromJson',
      methodType: 'POST',
      payload: { input: data, draft_type: 3, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, current_data_format:this.configJson.current_data_format, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {

        if (dbConfigThis.currentGroupType === 'source') {
          dbConfigThis.outputSchema = response.data;
          dbConfigThis.configJson.outputSchema = response.data;
        } else if (dbConfigThis.currentGroupType === 'target') {
          dbConfigThis.inputSchema = response.data;
          dbConfigThis.configJson.inputSchema = response.data;
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function () {
        ieGlobalVariable.loaderStore.turnoff();
        dbConfigThis.inputSchema = {};
        dbConfigThis.configJson.inputSchema = { 'error': 'Failed' };
      });
  }

  setvalue(name, value) {
    this[name] = value;
  }

}

export default DataBaseStore;
