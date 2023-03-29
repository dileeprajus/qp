/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import {observable,computed} from 'mobx';

class FlexStore {
  constructor(name) {
    // If you want to get a thing particularly then mention thing name else it will default to FlexConfig
    this.name = name ? name : 'FlexConfig';
    this.store_name = 'FlexStore'; //This is the filename
  }

  description = 'This is used to get FlexConfigs from ThingWorx';

  // declare thing attributes which are used in default thing template
  @observable new_config_name = '';
  @observable new_config_description = '';
  @observable new_config_data_source_category = '';
  @observable FlexConfigs = [];
  @observable Configs = [];
  @observable config_names = [];
  @observable FlexTotalAssInput = [];
  @observable oldURL = '';
  @observable newURL = '';
  @observable disable_trigger = false;
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

 
  @observable RequestVariables = {}
  @observable configJson = {
    SelectedFlexObjects: [],
    SelectedTypeHierarchy: [],
    inputSchema: {},
    outputSchema: {},
    RequestVariables: {},
    PrimaryKey: '',
    FlexPrimaryAPI: '',
    FlexMediaType: '',
    TimestampKey: '',
    TimestampFrom: 'Current Timestamp',
    CreatedAtDataProvider: '',
    UpdatedAtDataProvider: '',
    TransformationRules: [],
    Associations: {},
    AssociationsObj: {},
    Validations: {
      FlexObjectsCount: 0,
      TypeHierarchyCount: 0,
      SchemaCount: 0
    },
    temp_hierarchy_name: ''
  };
  @observable enableFlexTrigger = false;
  @observable enableFlexUpdateTrigger = false;
  @observable enableFlexDeleteTrigger = false;
  @observable validationFormula = '';
  @observable currentGroupName = '';
  @observable currentGroupType = '';
  @observable selectedFlexRootObjName = '';
  @observable selectedFlexRootObjTypeName = 'Select Any Node';
  // This callback is used when API call is made, but callback is optional
  @observable async_callback = null;
    
  @observable updatedConfigJson={};


  // Methods On Default Thing template
  @computed get getFlexConfigs() {
    
    var flexThis = this;
    if (this.FlexConfigs.length === 0) {
      ieGlobalVariable.loaderStore.turnon();
    }
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetAllConfigs',
      methodType: 'POST',
      payload: {
        groupName: this.currentGroupName,
        groupType: this.currentGroupType
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        flexThis.setvalue('FlexConfigs', response.data.Configs);
        flexThis.setvalue('Configs', response.data.Configs);
        flexThis.getTotalConfigs;
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(error);
        }
      });
  }

  @computed get getTotalConfigs() {
    var flexThis = this;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetTotalConfigs',
      methodType: 'POST',
      payload: {
        groupName: this.currentGroupName,
        groupType: this.currentGroupType
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        flexThis.config_names = response.data.Configs;
        flexThis.config_names = flexThis.config_names.map(function (x) { return x.toUpperCase() });
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
      })
      .catch(function (error) {
        if (flexThis.async_callback) {
          flexThis.async_callback(error);
        }
      });
  }


  CreateConfig(generic_master_store, enable_modal_tabs) {
    var searchQuery = {
      name: this.new_config_name,
      description: this.new_config_description,
      configDataSourceCategory: generic_master_store.groupType,
      groupName: this.currentGroupName,
      isFlex: true
    }
    var flexThis = this;
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
        flexThis.getFlexConfigs;
        flexThis.GetHostProperties;
        ieGlobalVariable.loaderStore.turnoff();
        enable_modal_tabs();
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(error);
        }
      });
  }


  // Methods on specific Configs
  @observable BasicConfigInfo = {};

  @observable inputSchema = {};
  @observable outputSchema = {};
  GetBasicConfigInfo(updateSchema, createAlert, renderSchemaByTypeId) {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name }
    var flexThis = this;
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
        flexThis.BasicConfigInfo = response.data;
        flexThis.inputSchema = flexThis.BasicConfigInfo['inputSchema'];
        flexThis.outputSchema = flexThis.BasicConfigInfo['outputSchema'];
        flexThis.configJson = flexThis.BasicConfigInfo['ConfigJson'];
        flexThis.enableFlexTrigger = flexThis.BasicConfigInfo['enableFlexTrigger'] ? flexThis.BasicConfigInfo['enableFlexTrigger'] : flexThis.enableFlexTrigger;
        flexThis.enableFlexUpdateTrigger = flexThis.BasicConfigInfo['enableFlexUpdateTrigger'] ? flexThis.BasicConfigInfo['enableFlexUpdateTrigger'] : flexThis.enableFlexUpdateTrigger;
        flexThis.enableFlexDeleteTrigger = flexThis.BasicConfigInfo['enableFlexDeleteTrigger'] ? flexThis.BasicConfigInfo['enableFlexDeleteTrigger'] : flexThis.enableFlexDeleteTrigger;
        if (flexThis.currentGroupName === '') {
          flexThis.currentGroupName = flexThis.BasicConfigInfo.Group;
        }
        if (flexThis.currentGroupType !== flexThis.BasicConfigInfo.GroupType) {
          flexThis.currentGroupType = flexThis.BasicConfigInfo.GroupType;
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
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(error);
        }
      });
  }
  @observable ServerStatus = {};
  UpdateConfigurations(groupName,responseCallback) {
    var searchQuery = {
      Name: groupName
  }
    var flexThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'UpdateConfigurations',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        flexThis.ServerStatus = response.data;
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

  //Input: name of the thing to delete
  DeleteConfig(configName) {
    var searchQuery = configName;
    var flexThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'DeleteConfig',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        flexThis.setvalue('FlexConfigs', response.data.Configs);
        flexThis.setvalue('Configs', response.data.Configs);
        flexThis.setvalue('name', 'FlexConfig');
        flexThis.getFlexConfigs;
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
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
    var flexThis = this;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetPropValues',
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
        // Update the same from the server - refetch the same values from server
        ieGlobalVariable.loaderStore.turnoff();
        flexThis.GetBasicConfigInfo;
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(error);
        }
      });
  }

  @observable HostProperties = {};
  // Request: {}
  // Result: {'host_name':host_name,'host_url':host_url,'password': password, 'username': username}
  @computed get GetHostProperties() {
    var searchQuery = {}
    var flexThis = this;
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
        flexThis.HostProperties = response.data;
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(error);
        }
      });
  }

  // Result: {"input": {"host_name":host_name,"host_url":host_url,"password": password, "username": username}}
  SetHostProperties(configName, from, showSubmitBtn) {
    // HostProperties json as input to the API call
    var searchQuery = this.HostProperties;
    var flexThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: configName,
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
        flexThis.GetHostProperties;
        if (from === 'groupEdit') {
         flexThis.GetFlexObjects(showSubmitBtn);
        }
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(error);
        }
      });
  }


  @observable FlexObjects = [];
  // FlexAPI: GetFlexObjects
  // Request: {}
  GetFlexObjects(showSubmitBtn) {
    var searchQuery = {};
    var flexThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetFlexObjects',
      methodType: 'POST',
      payload: searchQuery,
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        flexThis.FlexObjects = response.data['FlexObjects'];
        flexThis.GetFlexLinkObjects();
        if (showSubmitBtn) {
          showSubmitBtn();
        } else {
          flexThis.BasicConfigInfo['CanBeUsable'] = true;
          flexThis.UpdateConfigJson;
        }
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
      })
      .catch(function () {
        if (showSubmitBtn) {
          showSubmitBtn();
        }
        ieGlobalVariable.loaderStore.turnoff();
        flexThis.BasicConfigInfo['CanBeUsable'] = false;
        flexThis.UpdateConfigJson;
      });
  }
  @observable FlexLinks = [];
  GetFlexLinkObjects(responseCall) {
    var searchQuery = {};
    var flexThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'getFlexLinks',
      methodType: 'POST',
      payload: searchQuery,
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
       flexThis.FlexLinks = response.data['FlexObjects']; 
        if(responseCall) {
          responseCall();
        }
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
  @observable TypeHierarchy = {};
  @observable AssTypeHierarchy = {};
  GetTypeHierarchy(flex_obj_name_list, updateStateVar) {
    return computed(() => {

      ieGlobalVariable.loaderStore.turnon();
      // flex_obj_name_list json as input to the API call
      var searchQuery = {
        input: {
          inputs: flex_obj_name_list
        }
      };
      var flexThis = this;
      const apiInput = {
        midpoint: this.name,
        endpoint: 'GetTypeHierarchy',
        methodType: 'POST',
        payload: searchQuery,
        queryparam: null,
        headers: null
      };
      backendServer.api_call(apiInput)
        .then(function (response) {
          // Return Data
          flexThis.TypeHierarchy = response.data;
          flexThis.AssTypeHierarchy = response.data;
          ieGlobalVariable.loaderStore.turnoff();
          if (flexThis.async_callback) {
            flexThis.async_callback(flexThis, response);
          }
          if(updateStateVar){
            updateStateVar();
          }
        })
        .catch(function (error) {
          ieGlobalVariable.loaderStore.turnoff();
          return error;
        });
    }).get();
  }


  @observable SchemaByTypeID = {};
  @observable AssSchemaByTypeID = {};
  // FlexAPI: GetSchemaByTypeID
  // Request: "{"flexObject": "Color", "typeID":"VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4228744"}"
  //mappingStoreThing can be source or destination thing if destination also a flex
  GetSchemaByTypeID(flex_obj_typeId_list, mappingStoreThing = {}, callback,from) {
    return computed(() => {
      // flex_obj_typeId_list json as input to the API call
      var searchQuery = {
        input: {
          inputs: flex_obj_typeId_list
        }
      };
      var flexThis = this;
      ieGlobalVariable.loaderStore.turnon();
      const apiInput = {
        midpoint: this.name,
        endpoint: 'GetSchemaByTypeID',
        methodType: 'POST',
        payload: searchQuery,
        queryparam: null,
        headers: null
      };
      backendServer.api_call(apiInput)
        .then(function (response) {
          // Return Data
          ieGlobalVariable.loaderStore.turnoff();
          if(from==='Root'){
            flexThis.SchemaByTypeID = response.data;
          }else if(from==='Association'){
            flexThis.AssSchemaByTypeID = response.data;
          }else{}
           
          mappingStoreThing['SelectedSchema'] = response.data;
          if (response.data !== undefined && Object.keys(response.data).length > 0) {
            if (flexThis.currentGroupType === 'source') {
              flexThis.outputSchema = response.data;
            } else if (flexThis.currentGroupType === 'target') {
              flexThis.inputSchema = response.data;
            }
          }
          if (callback) {
            callback();
          }


          if (flexThis.async_callback) {
            flexThis.async_callback(flexThis, response);
          }

        })
        .catch(function (error) {
          ieGlobalVariable.loaderStore.turnoff();
          if (flexThis.async_callback) {
            flexThis.async_callback(error);
          }
        });
    }).get();
  }

  @observable RecordsData = {};
  // FlexAPI: GetRecords
  // Request: "{"flexObject": "Color", "typeId":"VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:4228744","fromIndex":1}"
  GetRecords(flex_obj_typeId_list) {
    return computed(() => {
      // flex_obj_typeId_list json as input to the API call
      var searchQuery = {
        input: flex_obj_typeId_list
      };
      var flexThis = this;
      ieGlobalVariable.loaderStore.turnon();
      const apiInput = {
        midpoint: this.name,
        endpoint: 'GetRecords',
        methodType: 'POST',
        payload: searchQuery,
        queryparam: null,
        headers: null
      };
      backendServer.api_call(apiInput)
        .then(function (response) {
          // Return Data
          flexThis.RecordsData = response.data;
          if (flexThis.async_callback) {
            flexThis.async_callback(flexThis, response);
          }
          setTimeout(function () {
            ieGlobalVariable.loaderStore.turnoff();
          }.bind(this), 2000);
        })
        .catch(function (error) {
          ieGlobalVariable.loaderStore.turnoff();
          if (flexThis.async_callback) {
            flexThis.async_callback(error);
          }
        });
    }).get();
  }

  @observable RecordsDataByOId = {};
  // FlexAPI: GetRecordsByOId
  // Request: '{'flexObject': 'Material', 'OId':'VR:com.lcs.wc.material.LCSMaterial:182414'}'
  GetRecordsByOId(flex_obj_oId_list) {
    return computed(() => {
      // flex_obj_oId_list json as input to the API call
      var searchQuery = {
        input: flex_obj_oId_list
      };
      var flexThis = this;
      ieGlobalVariable.loaderStore.turnon();
      const apiInput = {
        midpoint: this.name,
        endpoint: 'GetRecordsByOId',
        methodType: 'POST',
        payload: searchQuery,
        queryparam: null,
        headers: null
      };
      backendServer.api_call(apiInput)
        .then(function (response) {
          // Return Data
          flexThis.RecordsDataByOId = response.data;
          ieGlobalVariable.loaderStore.turnoff();
          if (flexThis.async_callback) {
            flexThis.async_callback(flexThis, response);
          }
        })
        .catch(function (error) {
          ieGlobalVariable.loaderStore.turnoff();
          if (flexThis.async_callback) {
            flexThis.async_callback(error);
          }
        });
    }).get();
  }

  //input is json key is property name and value is updated value: {"propertyName":value}
  SetPropValues(inputData) {
    var searchQuery = inputData;
    var flexThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetPropValues',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        //rest_this.TestApi; //To test the apis
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
        if(response && response.hasOwnProperty('data') && response.data.hasOwnProperty('ConfigJson')){
            flexThis.updatedConfigJson=response.data.ConfigJson
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(error);
        }
      });
  }
  resetTriggerBaseUrl() {
    var searchQuery = { groupName: this.currentGroupName, groupType: this.currentGroupType, oldURL: this.oldURL, newURL: this.newURL };
    var flexThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'UpdateTRCServerURLInFlexPLM	',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(error);
        }
      });
  }
  @computed get getConfigJson() {
    // Config JSON will ge in BasicConfigInfo so we will update the same in server also
    var searchQuery = {
      propertyArr: ['ConfigJson', 'enableFlexTrigger','enableFlexUpdateTrigger','enableFlexDeleteTrigger'],
      groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name
    };
    var flexThis = this;
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
          flexThis.configJson = response.data['ConfigJson'];
        }
        flexThis.enableFlexTrigger = response.data['enableFlexTrigger'] ? response.data['enableFlexTrigger'] : flexThis.enableFlexTrigger;
        flexThis.enableFlexUpdateTrigger = response.data['enableFlexUpdateTrigger'] ? response.data['enableFlexUpdateTrigger'] : flexThis.enableFlexUpdateTrigger;
        flexThis.enableFlexDeleteTrigger = response.data['enableFlexDeleteTrigger'] ? response.data['enableFlexDeleteTrigger'] : flexThis.enableFlexDeleteTrigger;
        if (flexThis.async_callback) {
          flexThis.async_callback(flexThis, response);
        }
        setTimeout(function () {
            ieGlobalVariable.loaderStore.turnoff();
        }.bind(this), 3000);
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (flexThis.async_callback) {
          flexThis.async_callback(error);
        }
      });
  }


  @observable groupHostProperties = {};
  //Inputs: groupName(String)
  //output: response.data(JSON)
  getGroupHostProperties(createAlert, testHostProps) {
     // for now search query is nil
    var searchQuery = { groupName: this.currentGroupName };
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
       // update the list
       ieGlobalVariable.loaderStore.turnoff();
       internalThis.groupHostProperties = response.data;
       if (testHostProps) {
         testHostProps();
       }
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
      // for now search query is nil
    var searchQuery = { groupName: this.currentGroupName, hostProperties: this.groupHostProperties };
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
      // update the list
      ieGlobalVariable.loaderStore.turnoff();
      internalThis.groupHostProperties = response.data;

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

  // This method is used to set values in the object
  setvalue(name, value) {
    this[name] = value;
  }

}

export default FlexStore;
