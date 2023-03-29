/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import { observable, computed } from 'mobx';

class SoapConfigStore {
  constructor(name) {
    // If you want to get a thing particularly then mention
    //thing name else it will default to SoapClient
    this.name = name ? name : 'SoapConfig';
    this.store_name = 'SoapConfigStore'; //This is the filename
  }

  description = 'This is used to get SoapConfigs from ThingWorx';

  // declare thing attributes which are used in default thing template
  @observable currentTenantID = '';
  @observable new_config_name = '';
  @observable new_config_description = '';
  @observable previousSelectedWsdl = '';
  @observable SelectedWsdl = '';
  @observable SoapConfigs = [];
  @observable Configs = [];
  @observable config_names = [];
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
  @observable currentGroupName = '';
  @observable currentGroupType = '';
  @observable async_callback = null;
  // Methods On Default Thing template
  @computed get getSoapConfigs() {
    // for now search query is nil
    var soapConfigThis = this;
    if (this.SoapConfigs.length === 0) {
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
        soapConfigThis.setvalue('SoapConfigs', response.data.Configs);
        soapConfigThis.setvalue('Configs', response.data.Configs);
        soapConfigThis.getTotalConfigs;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @computed get getTotalConfigs() {
    var soapConfigThis = this;

    const apiInput = {
      midpoint: 'SoapConfig',
      endpoint: 'GetTotalConfigs',
      methodType: 'POST',
      payload: { groupName: this.currentGroupName, groupType: this.currentGroupType, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        soapConfigThis.config_names = response.data.Configs;
        soapConfigThis.config_names = soapConfigThis.config_names.map(function (x) { return x.toUpperCase() });
      })
      .catch(function (error) {
        return error;
      });
  }


  CreateConfig(generic_master_store, redirectToEdit) {
    var searchQuery = { name: this.new_config_name, description: this.new_config_description, groupName: this.currentGroupName, configDataSourceCategory: generic_master_store.groupType, isFlex: false, tenantId: this.currentTenantID }
    var soapConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();

    const apiInput = {
      midpoint: 'GenericIEMasterConfig',//'SoapConfig',
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
          soapConfigThis.name = response.data.result.Name;
          soapConfigThis.setvalue('name', response.data.result.Name);
        }
        soapConfigThis.new_config_name = '';
        soapConfigThis.new_config_description = '';
        ieGlobalVariable.loaderStore.turnoff();
        // update the list
        soapConfigThis.getSoapConfigs;
        redirectToEdit();
        if (soapConfigThis.async_callback) {
          soapConfigThis.async_callback(soapConfigThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (soapConfigThis.async_callback) {
          soapConfigThis.async_callback(error);
        }
      });
  }


  // Methods on specific Configs
  @observable BasicConfigInfo = {};

  @observable inputSchema = {};
  @observable outputSchema = {};
  GetBasicConfigInfo(updatewsdl, createAlert) {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID }
    var soapConfigThis = this;
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
        soapConfigThis.BasicConfigInfo = response.data;
        soapConfigThis.configJson = soapConfigThis.BasicConfigInfo['ConfigJson'];
        soapConfigThis.RequestVariables = soapConfigThis.BasicConfigInfo['ConfigJson']['RequestVariables'];
        soapConfigThis.RequestVariablesConfig = soapConfigThis.BasicConfigInfo['ConfigJson']['RequestVariablesConfig'] ? soapConfigThis.BasicConfigInfo['ConfigJson']['RequestVariablesConfig'] : {};
        if (soapConfigThis.currentGroupType === 'source') {
          soapConfigThis.outputSchema = soapConfigThis.BasicConfigInfo['outputSchema'];
        } else if (soapConfigThis.currentGroupType === 'target') {
          soapConfigThis.inputSchema = soapConfigThis.BasicConfigInfo['inputSchema'];
        }
        if (soapConfigThis.currentGroupName === '') {
          soapConfigThis.currentGroupName = soapConfigThis.BasicConfigInfo.Group;
        }
        if (soapConfigThis.currentGroupType !== soapConfigThis.BasicConfigInfo.GroupType) {
          soapConfigThis.currentGroupType = soapConfigThis.BasicConfigInfo.GroupType;
        }
        if (updatewsdl) {
          updatewsdl();
        }
        if (createAlert) {
          createAlert();
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @observable GroupWsdls = {}
  @computed get GetWSDLS() {
    var searchQuery = { groupName: this.currentGroupName, groupType: this.currentGroupType, configName: this.name, tenantId: this.currentTenantID };
    var soapConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();            //added changes for bug 269
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetUploadWSDLS',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        soapConfigThis.GroupWsdls = response.data;
        ieGlobalVariable.loaderStore.turnoff();

      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
  @observable RequestVariables = {};
  @observable RequestVariablesConfig = {};
@observable configJson = {
  PrimaryKey: '',
  TimestampKey: '',
  TimestampFrom: 'Current Timestamp',
  CreatedAtDataProvider: '',
  UpdatedAtDataProvider: '',
  TransformationRules: [],
  RequestVariables: {},
  enableSOP: false,
  executeSOP: ''
};
@observable SoapRestConfig = {
  current_method_type: 'GET',
  data_url: '',
  basic_auth_details: {
    username: '',
    password: ''
  },
  current_auth_type: 'NoAuth',
  sourceType: '',
  headers: '',
  query_params: '',
  current_data_format: '',
  body: {}
};
  @observable updatedConfigJson={};
  @computed get UpdateConfigJson() {
    var searchQuery = { ConfigJson: this.configJson };
    var soapConfigThis = this;

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
        // Return Data
        // Update the same from the server - refetch the same values from server
        soapConfigThis.GetBasicConfigInfo();
      })
      .catch(function (error) {
        return error;
      });
  }

  SetPropValues(input_data) {
     var searchQuery = input_data;
     var soapConfigThis = this;
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
           if(response && response.hasOwnProperty('data') && response.data.hasOwnProperty('ConfigJson')){
               soapConfigThis.updatedConfigJson=response.data.ConfigJson
           }
       })
       .catch(function (error) {
         ieGlobalVariable.loaderStore.turnoff();
         return error;
       });
   }
    //Input: name of the thing to delete
  DeleteConfig(configName) {
    var searchQuery = configName;
    var soapConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();

    const apiInput = {
      midpoint: 'SoapConfig',
      endpoint: 'DeleteConfig',
      methodType: 'POST',
      payload: { input: searchQuery, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: configName, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        soapConfigThis.setvalue('SoapConfigs', response.data.Configs);
        soapConfigThis.setvalue('Configs', response.data.Configs);
        ieGlobalVariable.loaderStore.turnoff();
        soapConfigThis.setvalue('name', 'SoapConfig');
        soapConfigThis.getSoapConfigs;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  getInputData() {
    var soapConfigThis = this;

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
        soapConfigThis.inputData = response.data;
      })
      .catch(function (error) {
        return error;
      });
  }


  //Soap Group Variables and apis
  @observable newWSDLKey = '';
  @observable newURLWSDLKey = '';
  @observable newWSDLFile = '';
  @observable newWSDLUrl = '';
  @observable wsdlUrlData = '';
  @observable hideUrlData = true;
  @observable currentSelectedWSDLKey = '';
  @observable wsdlType = 'FileUpload'; //wsdl type is either fileupload or fromurl
  @observable uploadedWsdls = {};
  @observable disableUrlKey = false;
  @observable disableUploadKey = false;
  @observable title = '';
  //Inputs: groupName(String)
  //output: response.data(JSON)
  getUploadWsdls(createAlert) {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name, tenantId: this.currentTenantID };
    var soapConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'GetUploadWSDLS',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
     .then(function (response) {
        // Return Data
       soapConfigThis.uploadedWsdls = response.data.uploadedWSDLS;
       soapConfigThis.wsdlType = 'FileUpload';
       ieGlobalVariable.loaderStore.turnoff();
         createAlert();

       if (soapConfigThis.async_callback) {
         soapConfigThis.async_callback(soapConfigThis, response);
       }
     })
    .catch(function (error) {
      ieGlobalVariable.loaderStore.turnoff();

      if (soapConfigThis.async_callback) {
        soapConfigThis.async_callback(error);
      }
    });
  }

  //Inputs: groupName(String)
  //output: response.data(JSON)
  updateWSDL() {
    var searchQuery = { groupName: this.currentGroupName, uploadedWSDLS: this.uploadedWsdls, groupType: this.currentGroupType, configName: this.name, tenantId: this.currentTenantID};
    var soapConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'UpdateWSDL',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
     .then(function (response) {
        // Return Data
       soapConfigThis.uploadedWsdls = response.data.uploadedWSDLS;
       if (soapConfigThis.wsdlType === 'FileUpload') {
         soapConfigThis.newWSDLKey = '';
         soapConfigThis.newWSDLFile = '';
       } else {
         soapConfigThis.newWSDLUrl = '';
         soapConfigThis.newURLWSDLKey = '';
         soapConfigThis.wsdlUrlData = '';
         soapConfigThis.hideUrlData = true;
         soapConfigThis.SoapRestConfig = {
           current_method_type: 'GET',
           data_url: '',
           basic_auth_details: {
             username: '',
             password: ''
           },
           current_auth_type: 'NoAuth',
           sourceType: '',
           headers: '',
           query_params: '',
           current_data_format: '',
           body: {}
         };
       }
       ieGlobalVariable.loaderStore.turnoff();

       if (soapConfigThis.async_callback) {
         soapConfigThis.async_callback(soapConfigThis, response);
       }
     })
    .catch(function (error) {
      ieGlobalVariable.loaderStore.turnoff();

      if (soapConfigThis.async_callback) {
        soapConfigThis.async_callback(error);
      }
    });
  }

  //Inputs: groupName(String)
  //output: response.data(JSON)
  getSoapData() {
    var soapRestConfigInput = this.SoapRestConfig;
    soapRestConfigInput['data_url']=this.newWSDLUrl;
    var searchQuery = { 'from':'SoapRestConfig',groupName: this.currentGroupName, FromURL: this.newWSDLUrl, groupType: this.currentGroupType, configName: this.name };
    for(var key in soapRestConfigInput){
      searchQuery[key]=soapRestConfigInput[key]
    }
    var soapConfigThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',//'RestConfig',//'GenericIEMasterConfig',
      endpoint: 'GetWSDLFromURL',//'TestApiXML',//'GetSoapDataFromURL',
      methodType: 'POST',
      payload: { AuthJson: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
     .then(function (response) {
        // Return Data
       soapConfigThis.wsdlUrlData = (response.data.Result === undefined)? response.data.result : response.data.Result;
       soapConfigThis.hideUrlData = false;

       ieGlobalVariable.loaderStore.turnoff();

       if (soapConfigThis.async_callback) {
         soapConfigThis.async_callback(soapConfigThis, response);
       }
     })
    .catch(function (error) {
      ieGlobalVariable.loaderStore.turnoff();

      if (soapConfigThis.async_callback) {
        soapConfigThis.async_callback(error);
      }
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

     var soapConfigThis = this;
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
            soapConfigThis.configMetaInfo = response.data.result.metaInfo;
            soapConfigThis.isPersistance = response.data.result.persisting;
            soapConfigThis.isCaching = response.data.result.caching;
            soapConfigThis.expiryTime = response.data.result.expiryTime;
            soapConfigThis.title = response.data.result.title;
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
     var soapConfigThis = this;
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
            soapConfigThis.configMetaInfo = response.data.result.metaInfo;
            soapConfigThis.title = response.data.result.title;
            configUpdation('Success');
            ieGlobalVariable.loaderStore.turnoff();
        })
        .catch(function (error) {
            ieGlobalVariable.loaderStore.turnoff();
            return error
        });
    }

  setvalue(name, value) {
    this[name] = value;
  }

}

export default SoapConfigStore;
