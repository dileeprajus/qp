/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import { observable, computed } from 'mobx';

class StaticFileClientStore {

  constructor(name) {
    // If you want to get a thing particularly then mention
    //thing name else it will default to StaticFileClient
    this.name = name ? name : 'StaticFileConfig';
    this.store_name = 'StaticFileClientStore'; //This is the filename
  }

  description = 'This is used to get StaticFileConfigs from ThingWorx';

  // declare thing attributes which are used in default thing template
  @observable new_config_name = '';
  @observable new_config_description = '';
  @observable StaticFileConfigs = [];
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
    current_data_format:'JSON',
    dataContent:'',
    delimeter:',',
    enableSOP: false,
    executeSOP: ''
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
  @observable isCatching = false;
  @observable  expiryTime = '';
  @observable  title = '';

  // Methods On Default Thing template
  @computed get getStaticFileConfigs() {
    var staticFileConfigThis = this;
    if (this.StaticFileConfigs.length === 0) {
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
        staticFileConfigThis.setvalue('StaticFileConfigs', response.data.Configs);
        staticFileConfigThis.setvalue('Configs', response.data.Configs);
        staticFileConfigThis.getTotalConfigs;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function () {
        ieGlobalVariable.loaderStore.turnoff();
      });
  }

  @computed get getTotalConfigs() {
    var staticFileConfigThis = this;
    const apiInput = {
      midpoint: 'StaticFileConfig',
      endpoint: 'GetTotalConfigs',
      methodType: 'POST',
      payload: { groupName: this.currentGroupName, groupType: this.currentGroupType, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        staticFileConfigThis.config_names = response.data.Configs;
        staticFileConfigThis.config_names = staticFileConfigThis.config_names.map(function (x) { return x.toUpperCase() });
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
        isFlex: false,
        tenantId: this.currentTenantID
    }
    var staticFileConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'StaticFileConfig',
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
          staticFileConfigThis.name = response.data.result.Name;
          staticFileConfigThis.setvalue('name', response.data.result.Name);
        }
        staticFileConfigThis.new_config_name = '';
        staticFileConfigThis.new_config_description = '';
        ieGlobalVariable.loaderStore.turnoff();
        enable_modal_tabs();
        staticFileConfigThis.getStaticFileConfigs;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }


  // Methods on specific things
  @observable BasicConfigInfo = {};
  @observable dataType = '';
  @observable tempData = '';
  GetBasicConfigInfo() {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID }
    var staticFileConfigThis = this;
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
        staticFileConfigThis.BasicConfigInfo = response.data;
        if (response.data.DataFormat === '' || response.data.DataFormat === undefined) {
          staticFileConfigThis.BasicConfigInfo.DataFormat = 'JSON';
        }
        if (response.data['Data'] === 'undefined') {
          staticFileConfigThis.BasicConfigInfo.Data = '';
        }
        staticFileConfigThis.inputSchema = staticFileConfigThis.BasicConfigInfo.inputSchema;
        staticFileConfigThis.outputSchema = staticFileConfigThis.BasicConfigInfo.outputSchema;
        if (response.data.ConfigJson) {
          if (Object.keys(response.data.ConfigJson).length > 0) {
            staticFileConfigThis.configJson = staticFileConfigThis.BasicConfigInfo.ConfigJson;
            staticFileConfigThis.updatedConfigJson = staticFileConfigThis.BasicConfigInfo.ConfigJson;
          }
        }
        if (staticFileConfigThis.currentGroupName === '') {
          staticFileConfigThis.currentGroupName = staticFileConfigThis.BasicConfigInfo.Group;
        }
        if (staticFileConfigThis.currentGroupType !== staticFileConfigThis.BasicConfigInfo.GroupType) {
          staticFileConfigThis.currentGroupType = staticFileConfigThis.BasicConfigInfo.GroupType;
        }
        staticFileConfigThis.dataType = staticFileConfigThis.BasicConfigInfo.DataFormat;
        staticFileConfigThis.tempData = staticFileConfigThis.BasicConfigInfo.Data?staticFileConfigThis.BasicConfigInfo.Data:'';
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }


  @observable inputSchema = {};
  @observable outputSchema = {};
  @computed get GetSchema() {
    // Config JSON will ge in BasicConfigInfo so we will update the same in server also
    var searchQuery = { propertyArr: ['inputSchema', 'outputSchema'], groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID };
    var staticFileConfigThis = this;    
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
        staticFileConfigThis.inputSchema = response.data['inputSchema'];
        staticFileConfigThis.outputSchema = response.data['outputSchema'];       
      })
      .catch(function (error) {       
        return error;
      });
  }

  @computed get UpdateConfigJson() {
    // Config JSON will ge in BasicConfigInfo so we will update the same in server also
    var searchQuery = { ConfigJson: this.BasicConfigInfo['ConfigJson'] };
    var staticFileConfigThis = this;
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
        staticFileConfigThis.GetBasicConfigInfo();
      })
      .catch(function (error) {
        return error;
      });
  }
    //input is json key is property name and value is updated value: {'propertyName':value}
  SetPropValues(input_data) {
    var searchQuery = input_data;
    var staticFileConfigThis = this;
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
        staticFileConfigThis.GetSchema;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
 testStaticData(input_data) {
    if(BACKEND === 'LoopBack') {
      var config = this.configJson;
        config.current_data_format = input_data.dataFormat;
        config.dataContent = input_data.dataContent;
        config.delimeter = input_data.csvDelimeter;
        this.configJson = config;
      var searchQuery = {
        configJson:this.configJson,
        groupType: this.currentGroupType,
        groupName: this.currentGroupName,
        configName: this.name,
        tenantId: this.currentTenantID
      }
    }else {
        searchQuery = input_data;
    }
    var staticFileConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'TestStaticData',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
   return backendServer.api_call(apiInput)
      .then(function (response) {
        if (response.data) {
          staticFileConfigThis.JSONData = response.data.JSONData;
          if (staticFileConfigThis.currentGroupType === 'source') {
            staticFileConfigThis.outputSchema = response.data.SchemaFromData;
          } else if (staticFileConfigThis.currentGroupType === 'target') {
            staticFileConfigThis.inputSchema = response.data.SchemaFromData;
          }
        }
        ieGlobalVariable.loaderStore.turnoff();
        return response.data;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

    //Input: name of the thing to delete
    DeleteConfig(configName) {
      var searchQuery = configName;
      var staticFileConfigThis = this;
      ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'StaticFileConfig',
      endpoint: 'DeleteConfig',
      methodType: 'POST',
      payload: { input: searchQuery, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: searchQuery, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
        .then(function (response) {
          staticFileConfigThis.setvalue('StaticFileConfigs', response.data.Configs);
          staticFileConfigThis.setvalue('Configs', response.data.Configs);
          ieGlobalVariable.loaderStore.turnoff();
          staticFileConfigThis.setvalue('name', 'StaticFileConfig');
          staticFileConfigThis.getStaticFileConfigs;
        })
        .catch(function (error) {
          ieGlobalVariable.loaderStore.turnoff();
          return error;
        });
    }

  getInputData() {
    var staticFileClientThis = this;
    ieGlobalVariable.loaderStore.turnon();
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
          staticFileClientThis.inputData = response.data;
          ieGlobalVariable.loaderStore.turnoff();
        })
        .catch(function (error) {
          ieGlobalVariable.loaderStore.turnoff();
          return error;
        });
  }
  createTrigger() {
    var tempData = this.triggerData;
    if (this.BasicConfigInfo.DataFormat === 'JSON') {
      tempData = JSON.parse(this.triggerData);
    }
    var staticFileClientThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'CreateTrigger',
      methodType: 'POST',
      payload: { input: { input: tempData,groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID } },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
        .then(function (response) {
          staticFileClientThis.triggerDataResponse = response.data;
          ieGlobalVariable.loaderStore.turnoff();
        })
        .catch(function (error) {
          ieGlobalVariable.loaderStore.turnoff();
          return error;
        });
  }

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
      .catch(function () {
          ieGlobalVariable.loaderStore.turnoff();
      });
  }


  // This method is used to set values in the object
  setvalue(name, value) {
    this[name] = value;
  }

}

export default StaticFileClientStore;
