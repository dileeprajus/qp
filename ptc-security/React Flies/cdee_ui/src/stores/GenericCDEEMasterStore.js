/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
// GenericCDEEMasterStore
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import {observable, computed} from 'mobx';
import React from 'react';
import {Button } from 'react-bootstrap';

class GenericCDEEMasterStore {
    constructor(name) {
        this.name = name ? name : 'FlexConfig';
        this.store_name = 'GenericCDEEMasterStore'; //This is the filename

        this.tags = ['HostThing', 'DestinationThing'];

        this.short_name_tag_color = {
            FlexThingTemplate: {short_name: 'Flex', color: '#34495e', store_name: 'FlexStore'},
            RestClientThingTemplate: {short_name: 'Rest', color: '#9b59b6', store_name: 'RestClientStore'},
            StaticFileClientThingTemplate: {
                short_name: 'Static',
                color: '#e74c3c',
                store_name: 'StaticFileClientStore'
            },
            SoapClientThingTemplate: {short_name: 'Soap', color: '#3498db', store_name: 'SoapClientStore' },
            Flex: {short_name: 'Flex', color: '#34495e', store_name: 'FlexStore' },
            Rest: {short_name: 'Rest', color: '#9b59b6', store_name: 'RestClientStore' },
            Static: {short_name: 'Static', color: '#e74c3c', store_name: 'StaticFileClientStore' },
            Soap: {short_name: 'Soap', color: '#3498db', store_name: 'SoapClientStore' },
            Socket: {short_name: 'Socket', color: '#22a31b', store_name: 'SocketStore' },
            FTP: {short_name: 'FTP', color: '#7aa1a3', store_name: 'FTPClientStore' },
            'Google Pub/Sub': {short_name: 'Google Pub/Sub',color: '#006400', store_name: 'GooglePubSubClientStore' },
            DataBase: {short_name: 'DataBase', color: 'rgb(163, 163, 27)', store_name: 'DataBaseStore' },
            Mapping: {short_name: 'Mapping', color: 'rgb(219, 148, 52)', store_name: 'MappingStore' }
        };
    }

    description = 'This is used to get all things and analytics services from thingworx';

    @observable currentGroupName = '';
    @observable currentGroupDesc = '';
    @observable currentGroupTitle = '';
    @observable groupDesc = '';
    @observable newGroupName = '';
    @observable newGroupDescription = '';
    @observable dataSourceType = ''; //Flex or Soap or Rest or StaticFile
    @observable tenantID = ieGlobalVariable.tenantID;
    @observable category = 'General';
    @observable groupType = 'source'; //source or target or mapping
    @observable endPointsPath = ''; //to redirect to configs screen if endpoint btn clicked

    @observable selectedSourceGroup = '';
    @observable selectedTargetGroup = '';
    @observable SourceConfigs = [];
    @observable TargetConfigs = [];
    @observable totalGroupNames = [];
    @observable tenantIDs = [];
    @observable tenantIDsArr = [];
    @observable applicationIDs = [];
    @observable deletedTenantIDs = [];
    @observable dashboardStats = {
      transactions: 521,
      averageTransactionTime: 5658.349,
      clients: 0,
      mappings: 0,
      totalSuccess: 379,
      totalFailures: 2
    }
    @observable dashboardMetrics = [];

    @observable transactionInfo = {
        Mappings: {Configs: []},
        Targets: {Configs: []}
    };
    @observable transactionLogsData = [];
    @observable persistenceObjectData = [];
    @observable transactionAuditData = [];
    @observable TRCAuditData = [];
    @observable summaryConfig = '';
    @observable selectedSourceConfig = '';
    @observable selectedTargetConfig = '';
    @observable selectedMappingConfig = '';
    @observable transactions = [];
    @observable selectedTenantId = '';
    @observable cepRender = {};
    @observable fromDate = '';
    @observable toDate = '';
    @observable transactionId = '';
    @observable parentId = '';
    @observable username = '';
    @observable password = '';
    @observable showModal = false;
    @observable modalTitle = '';
    @observable modalBody = '';
    @observable modalBtnTxt = '';
    @observable serviceName = '';
    @observable isEnableLogs = false;
    @observable EmailConfiguration = {
        To: '',
        CC: '',
        BCC: ''
    }

    @observable scheduarEnabled = false;
    @observable cronString = '';
    @observable RequestCount = '';
    @observable userGroupName = '';
    @observable SleepTime = '';
    // This callback is used when API call is made, but callback is optional
    @observable async_callback = null;

    //Inputs: groupName(String)
    //output: response.data.Configs(JSON)
    getConfigs(tagName, type) {
        var internalThis = this;
        if (this.SourceConfigs.length === 0 || this.TargetConfigs.length === 0) {
            ieGlobalVariable.loaderStore.turnon();
        }
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetAllConfigs',
            methodType: 'POST',
            payload: {type: type, groupType: tagName, tenantId: this.tenantID},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                if (tagName === 'source') {
                    internalThis.SourceConfigs = response.data.Configs;
                } else {
                    internalThis.TargetConfigs = response.data.Configs;
                }
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

    @computed get GetAllSourceConfigs() {
      this.getConfigs('source', 'allSourceConfigs');
    }

    @computed get GetAllTargetConfigs() {
      this.getConfigs('target', 'allTargetConfigs');
    }

    //Inputs: name(String), description(String), groupType(String), dataSourceType(String)
    //output: Nothing
    createGroup(redirectToDataSource, modal_store) {
      var searchQuery = {
        name: this.newGroupName,
        description: this.newGroupDescription,
        groupType: this.groupType,
        dataSourceType: this.dataSourceType,
        category: this.category.toUpperCase(),
        tenantID: this.tenantID
      }
      if (this.groupType === 'mapping') {
        searchQuery['selectedSourceGroup'] = this.selectedSourceGroup;
        searchQuery['selectedTargetGroup'] = this.selectedTargetGroup;
        if (modal_store) {
          modal_store.modal.show_alert_msg = 'Created ' + this.selectedSourceGroup + ' - ' + this.selectedTargetGroup + ' Group Successfully';
        }
      }
    var internalThis = this;
    this.currentGroupName = this.newGroupName;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'CreateGroup',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        internalThis.currentGroupName = internalThis.newGroupName;
        internalThis.newGroupName = '';
        internalThis.newGroupDescription = '';
        if (redirectToDataSource) {
          redirectToDataSource();
        }

        if (internalThis.async_callback) {
          internalThis.async_callback(internalThis, response);
        }
        internalThis.getAllGroups(internalThis.groupType);
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (internalThis.async_callback) {
          internalThis.async_callback(error);
        }
      });
    }

    @observable SourceGroups = [];
    @observable TargetGroups = [];
    @observable MappingGroups = [];
    @observable AllSourceGroupNames = [];
    @observable AllTargetGroupNames = [];
    @observable AllArchivedGroups = [];

    //Inputs: groupType(String) either source/target/mapping
    //output: response.data.Groups(Array)
    getAllGroups(type) {
        var searchQuery = {
            groupType: type,
            tenantId: this.tenantID
        };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetGroups',
            methodType: 'POST',
            payload: {input: searchQuery},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                if (type === 'target') {
                    internalThis.TargetGroups = response.data.Groups;
                    internalThis.AllTargetGroupNames = internalThis.getGroupNames(internalThis.TargetGroups);
                } else if (type === 'source') {
                    internalThis.SourceGroups = response.data.Groups;
                    internalThis.AllSourceGroupNames = internalThis.getGroupNames(internalThis.SourceGroups);
                } else if (type === 'mapping') {
                    internalThis.MappingGroups = response.data.Groups;
                } else {
                }
                if (internalThis.async_callback) {
                    internalThis.async_callback(internalThis, response);
                }
                internalThis.getTotalGroups();
                ieGlobalVariable.loaderStore.turnoff();
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                if (internalThis.async_callback) {
                    internalThis.async_callback(error);
                }
            });
    }

    //Inputs: Nothingg
    //output: response.data.Groups(Array)
    getTotalGroups() {
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetTotalGroups',
            methodType: 'POST',
            payload: {
              groupType: this.groupType,
              tenantId: this.tenantID
            },
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.totalGroupNames = response.data.Groups;
                internalThis.totalGroupNames = internalThis.totalGroupNames.map(function (x) { return x.toUpperCase() });
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

    //Inputs: Nothingg
    //output: response.data.Groups(Array)
    getArchivedGroups() {
        var internalThis = this;
        var searchQuery = {};
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetAllArchivedGroups',
            methodType: 'POST',
            payload: {input: searchQuery, tenantId: this.tenantID},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.setvalue('AllArchivedGroups', response.data.Groups);
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

    //Inputs: groupName(String)
    //output: response.data(JSON)
    restoreGroup() {
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'RestoreGroup',
            methodType: 'POST',
            payload: {input: this.currentGroupName, groupType: this.groupType, tenantId: this.tenantID},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                if (internalThis.async_callback) {
                    internalThis.async_callback(internalThis, response);
                } else {
                  if (BACKEND === 'LoopBack') {
                    if(ieGlobalVariable.tenantID === '' || ieGlobalVariable.tenantID === undefined ) {
                      internalThis.tenantID = '';
                    }
                  }
                  internalThis.getArchivedGroups();
                  ieGlobalVariable.loaderStore.turnoff();
                }
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                if (internalThis.async_callback) {
                    internalThis.async_callback(error);
                }
            });
    }

    //Input: name of the ThingTemplate to delete
    deleteGroup(groupName, type, isHardDelete, deleteGroupCallback) {

        if(BACKEND === 'LoopBack') {

          var searchQuery = { groupName: groupName, tenantId: this.tenantID, isHardDelete: isHardDelete }

        }else {

           searchQuery = groupName;

        }

        var internalThis = this;

        ieGlobalVariable.loaderStore.turnon();

        const apiInput = {

            midpoint: 'GenericIEMasterConfig',

            endpoint: 'DeleteGroup',

            methodType: 'POST',

            payload: {input: searchQuery, isHardDelete: isHardDelete, groupType: this.groupType, groupName: groupName},

            queryparam: null,

            headers: null

        };

        backendServer.api_call(apiInput)

            .then(function (response) {

                ieGlobalVariable.loaderStore.turnoff();

                if (internalThis.async_callback) {

                    internalThis.async_callback(internalThis, response);

                } else {

                    internalThis.getArchivedGroups();

                    internalThis.getAllGroups(type);

                }

                if (deleteGroupCallback) {

                    deleteGroupCallback(response);

                }

            })

            .catch(function (error) {

                ieGlobalVariable.loaderStore.turnoff();

                if (internalThis.async_callback) {

                    internalThis.async_callback(error);

                }

                if (deleteGroupCallback) {

                    deleteGroupCallback('Failed');

                }

            });

    }

    // INPUTS: configName(String) and priority(Number)
    // Output: JSON {configName:updatedPriority}
    setConfigPriority(configName, priority) {
        var searchQuery = {
            name: configName,
            priority: priority,
            groupType: this.groupType,
            groupName: this.currentGroupName
        };
        var internalThis = this;
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'SetConfigPriority',
            methodType: 'POST',
            payload: {input: searchQuery},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                if (internalThis.async_callback) {
                    internalThis.async_callback(internalThis, response);
                }
            })
            .catch(function (error) {                
                if (internalThis.async_callback) {
                    internalThis.async_callback(error);
                }
            });
    }

    //Inputs: Nothing
    //output: response.data(JSON)
    getTransactionInfo() {        
        var searchQuery = {};
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetTransactionInfo',
            methodType: 'POST',
            payload: {input: searchQuery, tenantId: this.tenantID},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.transactionInfo = response.data;
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


    //Inputs: JSON
    //output: response.data(JSON)
    getTransactionLogsData(configName, type, groupType, filterType) {
        var searchQuery = {configName: configName, type: type, groupType: groupType, groupName: this.currentGroupName, tenantId: this.tenantID, filterType: filterType, fromDate: this.fromDate, toDate: this.toDate };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetTransactionLogsData',
            methodType: 'POST',
            payload: {input: searchQuery},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.transactionLogsData = response.data.Result;
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
    //Inputs: JSON
    //output: response.data(JSON)
    getRow(configName, type, groupType, filter, tableType) {
        var searchQuery = {configName: configName, type: type, groupType: groupType, groupName: this.currentGroupName, tenantId: this.tenantID, filter: filter, tableType: tableType };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetRow',
            methodType: 'POST',
            payload: {input: searchQuery},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                ieGlobalVariable.loaderStore.turnoff();

                if (internalThis.async_callback) {
                    internalThis.async_callback(internalThis, response.data.Result,filter.columnValue);
                }
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                if (internalThis.async_callback) {
                    internalThis.async_callback(error);
                }
            });
    }



    //Inputs: JSON
    //output: response.data(JSON)
    getPeristenceObjectData(configName, type, groupType, filterType) {
        var searchQuery = {configName: configName, type: type, groupType: groupType, groupName: this.currentGroupName, tenantId: this.tenantID, filterType: filterType, fromDate: this.fromDate, toDate: this.toDate };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetPersistenceObjectData',
            methodType: 'POST',
            payload: {input: searchQuery},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.persistenceObjectData = response.data.Result;
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

    getTransactionAuditData(configName, type, groupType, filterType) {
        var searchQuery = { configName: configName, type: type, groupType: groupType, groupName: this.currentGroupName, tenantId: this.tenantID, filterType: filterType, fromDate: this.fromDate, toDate: this.toDate };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetTransactionAuditData',
            methodType: 'POST',
            payload: { input: searchQuery },
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.transactionAuditData = response.data.Result;
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

    getTRCAuditData(configName, type, groupType, filterType, serviceInfo,maxitems,filtervalue) {
        var searchQuery = {configName: configName, type: type, groupType: groupType, groupName: this.currentGroupName, tenantId: this.tenantID, filterType: filterType, fromDate: this.fromDate, toDate: this.toDate, serviceInfo: serviceInfo,maxitems:maxitems,filtervalue:filtervalue };
        if(this.fromDate && this.toDate) {
            var fromDate = this.fromDate+':00'
            var toDate = this.toDate+':00'
            fromDate = new Date(fromDate.replace('T',' ')).toISOString().replace('Z','');
            toDate = new Date(toDate.replace('T',' ')).toISOString().replace('Z','');
        var searchQuery = {configName: configName, type: type, groupType: groupType, groupName: this.currentGroupName, tenantId: this.tenantID, filterType: filterType, fromDate: fromDate, toDate: toDate, serviceInfo: serviceInfo };
        }
            var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetTRCAuditData',
            methodType: 'POST',
            payload: { input: searchQuery },
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.TRCAuditData = response.data.Result;
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
    getConcurrentValue() {
        var searchQuery = {};
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetConcurrentValue',
            methodType: 'POST',
            payload: { input: searchQuery },
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                if(response.data) {
                 internalThis.RequestCount = typeof response.data.count == 'number' ? response.data.count.toString() : '0';
                }
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
    getSleepTime() {
        var searchQuery = {};
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetSleepTime',
            methodType: 'POST',
            payload: { input: searchQuery },
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                if(response.data) {
                 internalThis.SleepTime = typeof response.data.count == 'number' ? response.data.count.toString() : '0';
                }
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

    setTRCQueueConfiguration(configName, getData) {
        const cronString = '0/'+this.cronString+' * * * * ? *'
        var searchQuery = {
          configName: configName,
          cronString:  cronString,
          RequestCount: this.RequestCount ? parseInt(this.RequestCount): 0,
          scheduarEnabled: this.scheduarEnabled,
          status: getData,
          SleepTime: this.SleepTime ? parseInt(this.SleepTime): 0
        }
        var schedulerThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
          midpoint: 'GenericIEMasterConfig',
          endpoint: 'SetTRCQueueConfiguration',
          methodType: 'POST',
          payload: {
            input: searchQuery
          },
          queryparam: null,
          headers: null
        };
        backendServer.api_call(apiInput)
          .then(function (response) {
            if(response.data) {
                if(getData === 'GetData') {
                    schedulerThis.scheduarEnabled = response.data.rows[0].enabled;
                    var tempdata = response.data.rows[0].schedule;
                    schedulerThis.cronString = tempdata.split(' ')[0].replace('0/','');
                }
            }
            ieGlobalVariable.loaderStore.turnoff();
            if (schedulerThis.async_callback) {
              schedulerThis.async_callback(schedulerThis, response);
            }
          })
          .catch(function (error) {
            ieGlobalVariable.loaderStore.turnoff();
            if (schedulerThis.async_callback) {
              schedulerThis.async_callback(error);
            }
          });
      }

    //Inputs: {groupName: currentGroupName, description: currentGroupDesc}
    //if method is set other wise groupName is sufficient.
    //Output: result(Json) {result: description}
    updateDescription(methodType) {
      ieGlobalVariable.loaderStore.turnon();
      var internalThis = this;
      var searchQuery = { groupName: this.currentGroupName, groupType: this.groupType, title: this.currentGroupTitle, tenantId: this.tenantID };
      if (methodType === 'Set') {
        searchQuery = {
          groupName: this.currentGroupName,
          description: this.currentGroupDesc,
          groupType: this.groupType,
          tenantId: this.tenantID,
          title: this.currentGroupTitle
        };
      }
      const apiInput = {
        midpoint: this.name,
        endpoint: methodType.concat('GroupDescription'),
        methodType: 'POST',
        payload: { input: searchQuery },
        queryparam: null,
        headers: null
      };
      backendServer.api_call(apiInput)
      .then(function (response) {
          // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        if(response.data) {
          if (BACKEND === 'LoopBack') {
             internalThis.currentGroupDesc = response.data.result.description;
             internalThis.currentGroupTitle = response.data.result.title;
          } else {
             internalThis.currentGroupDesc = response.data.result;
          }
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

    @computed get getGroupDescription() {
        this.updateDescription('Get');
    }

    @computed get setGroupDescription() {
        this.updateDescription('Set');
    }


    //*************Schema Normalise************
    extractKeys(nObj, k, val, p) {
        if (typeof val === 'object' && val !== 'null' && val.length === undefined) {//if val is object loop through val and assaign parent to each key
            for (var key in val) {
                var parent = p + '.' + key;
                nObj[parent] = val[key];
            }
        } else { //if the val is only string then assign that key to parent and store the value(datatype) in new key
            var parent = p + '.' + k;
            nObj[parent] = val;
        }
    }

    getObj(Item, from) {
        if (Item && Item['schema']) {
            Item = Item['schema'];
        }
        return this.extract({schema: Item?Item:{}}, {}, '', from);
    }

    extract(schema, output, attrPrefix, from) {
        for (const k in schema) {
            const cloneWithoutChildren = Object.assign({}, schema[k]);
            cloneWithoutChildren.key = k;
            delete cloneWithoutChildren.properties;
            if (schema[k].type === 'object') {
                let objAttrPrefix = attrPrefix + '.' + k;
                objAttrPrefix = objAttrPrefix.replace('.items', '.*');
                if (from !== 'RequestVariables' && from !== 'PrimaryKey' && from !== 'SoapSchema') { //for request variables and primary key only leaf childs can be selected as values
                    output[objAttrPrefix] = objAttrPrefix;
                }
                this.extract(schema[k].properties, output, objAttrPrefix, from)
            } else if (schema[k].type === 'array') {
                let arryAttrPrefix = attrPrefix + '.' + k; //+ '.*';
                arryAttrPrefix = arryAttrPrefix.replace('.items', '.*');
                if (from !== 'RequestVariables' && from !== 'PrimaryKey' && from !== 'SoapSchema') {
                    output[arryAttrPrefix] = arryAttrPrefix;
                }
                this.extract(schema[k], output, arryAttrPrefix, from)
            } else {
                if (schema[k] !== null && typeof schema[k] === 'object') {
                    let endAttribute = attrPrefix + '.' + k;
                    let endAttributeArray = endAttribute.split('.');
                    if (endAttributeArray.lastIndexOf('items') > 0) {
                    }
                    output[endAttribute] = endAttribute;
                }
            }
        }
        return output;

    }


    //*************Schema Normalise************
    @observable configBasicInfo = {};

    GetBasicConfigInfo(configName, callback, groupName) {
        var searchQuery = {groupName: groupName, groupType: 'source', configName: configName, tenantId: this.tenantID};
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: configName,
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
                internalThis.configBasicInfo = response.data;
                if (callback) {
                    callback();
                }
                ieGlobalVariable.loaderStore.turnoff();
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }


    @observable RequestVarsTestResult = {};
    @observable RequestVarsObj = {};

    TestRequestVars(request_variables, configName, groupName, groupType, basicConfigInfo, configJson, inputSchema, outputSchema, SoapRestConfig, schedularScript) {
        var searchQuery = {
            requestVariables: request_variables,
            configName: configName,
            groupName: groupName,
            groupType: groupType,
            dataSourceType: basicConfigInfo.DataSourceType,
            configJson: configJson,
            inputSchema: inputSchema,
            outputSchema:outputSchema,
            tenantId: basicConfigInfo.tenantId,
            SoapRestConfig: SoapRestConfig,
            schedularScript: schedularScript
        };
        if(Object.keys(basicConfigInfo).length) {
          if(basicConfigInfo.dataSourceType === 'FTP') {
            searchQuery = {
              input: searchQuery
            }
          }
        }
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: configName,
            endpoint: 'TestAPIWithRequestVars',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.RequestVarsTestResult = response.data;
                ieGlobalVariable.loaderStore.turnoff();
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }

    @observable customScripts = {};
    @computed get  getAllGroupWithConfigs() {
        var searchQuery = { tenantId: this.tenantID };
        var internalThis = this;
        const apiInput = {
            midpoint: '',
            endpoint: 'getAllGroupsWithConfigs',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        return backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.customScripts = response.data;

            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }

    @observable MCCData = [];

  getAllMCCData(configName, type, groupType) {
    var searchQuery = { configName: configName, type: type, groupType: groupType, groupName: this.currentGroupName, tenantId: this.tenantID };
    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'GetAllMCCData',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
          // Return Data
        internalThis.MCCData = response.data.result;
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

  @observable mappingsForSource = [];
  getAllMappingsForConfig(configName, groupType, callOpenModal) {
    var searchQuery = { configName: configName, groupType: groupType, groupName: this.currentGroupName, tenantId: this.tenantID };
    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'GetAllMappingsForConfig',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
          // Return Data
        if (internalThis.groupType === 'source') {
          internalThis.mappingsForSource = response.data.Configs;
        } else internalThis.mappingsForTarget = response.data.Configs;

        if (callOpenModal) {
          callOpenModal(configName);
        }
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
  @observable versionDetails = {};
  getDBVerison() {
    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'GetDBVersion',
      methodType: 'POST',
      payload: { tenantId: this.tenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
          // Return Data
        internalThis.versionDetails = response.data;
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
  SetPropValues(inputData, type, obj) {
    var searchQuery = (BACKEND === 'LoopBack' ? obj : inputData);
    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'SetPropValues',
      methodType: 'POST',
      payload: {
        input: searchQuery, type: type
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        ieGlobalVariable.loaderStore.turnoff();
        if (internalThis.async_callback) {
          internalThis.async_callback(internalThis, response);
        }
        if (type === 'tenant') {
          if(BACKEND === 'LoopBack') {
             internalThis.GetPropValues({propertyArr: ['tenantIDs']}, 'tenant', true);
          }
          internalThis.deletedTenantIDs = [];
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (internalThis.async_callback) {
          internalThis.async_callback(error);
        }
      });
  }
  GetPropValues(inputData, type, includeAll) {
    var searchQuery = inputData;
    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'GetPropValues',
      methodType: 'POST',
      payload: {
        input: searchQuery, type: type, includeAll:includeAll
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        ieGlobalVariable.loaderStore.turnoff();
        if (response.data['tenantIDs']) {
          internalThis.tenantIDs = response.data['tenantIDs']['arr'];
          internalThis.tenantIDsArr = [];
          internalThis.tenantIDsArr = internalThis.getGroupNames(response.data['tenantIDs']['arr'], 'tenant');
          internalThis.tenantIDsArr = (response.data['tenantIDs']['arr'].length === 0) ? [] : internalThis.tenantIDsArr;
        }
        if(response.data['EmailConfiguration']){
            internalThis.EmailConfiguration = response.data['EmailConfiguration']
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

  @computed get getApplicationIDs() {
    var typeManagerThis = this;
    const apiInput = {
        midpoint: '',
        endpoint: 'GetApplicationIDs',
        methodType: 'POST',
        payload: {},
        queryparam: null,
        headers: null
    };
    backendServer.api_call(apiInput)
        .then(function (response) {
            // Return Data
            typeManagerThis.applicationIDs = response.data.result;
        })
        .catch(function (error) {
          return error;
        });
  }

  @computed get refreshAllMCCs() {
    //var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
        midpoint: '',
        endpoint: 'refreshMCCWithFlow',
        methodType: 'POST',
        payload: {},
        queryparam: null,
        headers: null
    };
    backendServer.api_call(apiInput)
        .then(function () {
            // Return Data
            ieGlobalVariable.loaderStore.turnoff();
        })
        .catch(function (error) {
          return error;
        });
   }

   setApplicationIDs(obj={}, type) {
       var searchQuery = { applicationIDs: { ids: this.applicationIDs } };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'SetApplicationID',
            methodType: 'POST',
            payload: { input: searchQuery, modifiedObj: obj, type: type },
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function () {
                // Return Data
                ieGlobalVariable.loaderStore.turnoff();
                internalThis.getApplicationIDs;
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }

    deleteApplicationID(obj, type) {
        var searchQuery = obj;
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'DeleteApplicationIDs',
            methodType: 'POST',
            payload: { input: searchQuery, type: type },
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function () {
                // Return Data
                internalThis.getApplicationIDs;
                ieGlobalVariable.loaderStore.turnoff();

            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }

    @observable selectedGroup = {};
    @observable selectedConfig = {};
    @observable resultCustomScript={};
    @observable createdCustomScripts={};
    @observable CustomScriptsList = [];
    @observable configMe={
      name: '',
      groupName: '',
      groupType: '',
      configName: '',
      context: '',
      contextConfig: {},
      isMcc: false,
      script: [],
      mapping: {},
      isActive: false,
      tenantId: this.tenantID
    };

    saveCustomScripts(getlist) {
        var searchQuery = {
            input:{
                name: this.configMe.name,
                isMcc:this.configMe.isMcc,
                groupName:this.configMe.groupName,
                configName:this.configMe.configName,
                groupType: this.configMe.groupType,
                script: this.configMe.script,
                mapping: this.configMe.mapping,
                isActive: this.configMe.isActive,
                context: this.configMe.context,
                contextConfig: this.configMe.contextConfig,
                tenantId: ieGlobalVariable.tenantID ? ieGlobalVariable.tenantID : this.configMe.tenantId
              }
        };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'saveCustomEndPoints',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.createdCustomScripts = response.data.result;
                internalThis.getCustomScript(getlist);
                ieGlobalVariable.loaderStore.turnoff();

            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }

    deleteCustomscripts(getList) {
        var searchQuery = {
            name: this.configMe.name,
            groupName: this.configMe.groupName,
            configName:this.configMe.configName,
            groupType: this.configMe.groupType ,
            isMcc:this.configMe.isMcc,
            tenantId: this.tenantID
        };
        var internalThis = this;
        const apiInput = {
            midpoint: '',
            endpoint: 'deleteCustomEndPoints',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function () {
                // Return Data
              if(BACKEND === 'LoopBack') {
                if(ieGlobalVariable.tenantID === '' || ieGlobalVariable.tenantID === undefined ) {
                  internalThis.tenantID =  '';
                }
              }
              internalThis.getCustomScript(getList);

            })
            .catch(function (error) {
              return error;
            });
    }

    getCustomScript(getlist) {
        var query = {};
        if (this.cepRender) {
            if(this.cepRender.type === 'CONFIG' || this.cepRender.type === 'MAPPING') {
               query = {
                   where:{
                       configName: this.configMe.configName,
                       groupName: this.configMe.groupName,
                       tenantId: ieGlobalVariable.tenantID ? ieGlobalVariable.tenantID: this.tenantID,
                       groupType: this.configMe.groupType
                   }
               }
            }
        }
        var searchQuery = {
               name: this.configMe.name,
               isMcc:this.configMe.isMcc,
               groupName:this.configMe.groupName,
               configName:this.configMe.configName,
               groupType: this.configMe.groupType,
               tenantId: ieGlobalVariable.tenantID ? ieGlobalVariable.tenantID: this.tenantID,
               query : query
            };
        var internalThis = this;
        const apiInput = {
            midpoint: '',
            endpoint: 'getCustomEndPoints',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.CustomScriptsList = response.data.result;
                if(getlist) {
                    getlist();
                }
            })
            .catch(function (error) {
              return error;
            });
    }

    @observable mailTemplateConfig = {
        templateName: '',
        templateSubject:'',
        sopType: '',
        tRecipients: '',
        isActive: false,
        groupName: '',
        groupType: '',
        configName: '',
        tenantId:'',
        applicationId: '',
        script: [],
        template:'',
        data:{}
    };
    @observable mailTemplatesList = [];
    @observable htmlResponse = '';

    getSopTemplates() {
        var searchQuery = {
            input: this.mailTemplateConfig
        };
        var internalThis = this;
        const apiInput = {
            midpoint: '',
            endpoint: 'getSopTemplates',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
               internalThis.mailTemplatesList = response.data.result;
            })
            .catch(function (error) {
              return error;
            });
    }

    @observable createdTemplate = {};
    saveSopTemplate() {
        var searchQuery = {
            input:this.mailTemplateConfig
        };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'saveSopTemplate',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        return backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.createdTemplate = response.data.result;
                internalThis.getSopTemplates();
                ieGlobalVariable.loaderStore.turnoff();
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }

    validateScriptForTemplate(scriptErrCb) {
        var searchQuery = {
            input:this.mailTemplateConfig
        };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'validateScriptForTemplate',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        return backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.mailTemplateConfig.data = response.data.result;
                ieGlobalVariable.loaderStore.turnoff();
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                if(scriptErrCb){
                    scriptErrCb('Fail');
                }
                return error;
            });
    }

    getTemplatePreview() {
        var searchQuery = {
            input:this.mailTemplateConfig
        };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'getTemplatePreview',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        return backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.htmlResponse = response.data.result;
                ieGlobalVariable.loaderStore.turnoff();
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }

    @observable mailStatusMsg = '';
    triggerSopEvent(mailStatus) {
        var searchQuery = {
            input:this.mailTemplateConfig
        };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'triggerSopEvent',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        return backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.mailStatusMsg = response.data.result;
                if(mailStatus) {
                    mailStatus('true');
                }
                ieGlobalVariable.loaderStore.turnoff();
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                if(mailStatus) {
                    mailStatus('false');
                }
                return error;
            });
    }

    deleteSopTemplate() {
        var searchQuery = {
            input:this.mailTemplateConfig
        };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'deleteSopTemplate',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function () {
                // Return Data
                internalThis.getSopTemplates();
                ieGlobalVariable.loaderStore.turnoff();

            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }

    @computed get   executeCustomScripts() {
        var searchQuery = {
            input:{
                name: this.configMe.name,
                isMcc:this.configMe.isMcc,
                groupName:this.configMe.groupName,
                configName:this.configMe.configName,
                groupType: this.configMe.groupType,
                script: this.configMe.script,
                mapping: this.configMe.mapping,
                isActive: this.configMe.isActive,
                tenantId: this.tenantID
            }
        };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'execCustomEndPoint',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.resultCustomScript = response.data;
                ieGlobalVariable.loaderStore.turnoff();

            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }
    @observable mappingsForTarget = {};
    getAllMappingForTarget(onSelect) {
        var searchQuery = {
            input:{
                name: this.configMe.name,
                isMcc:this.configMe.isMcc,
                groupName:this.configMe.groupName,
                configName:this.configMe.configName,
                groupType: this.configMe.groupType,
                script: this.configMe.script,
                mapping: this.configMe.mapping,
                isActive: this.configMe.isActive,
                tenantId: this.tenantID
            }
        };
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'getAllMappingForTarget',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                response.data.Mappings.forEach((item)=>{
                    item.dispalyValue = item.name + ' -- '+ item.groupName;
                });
                internalThis.mappingsForTarget = response.data;
                if (onSelect) {
                    onSelect();
                }
                ieGlobalVariable.loaderStore.turnoff();

            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }

    @observable summary_json = [];
    getDashboardStats(setHeaders) {
        var searchQuery = {tenantId: this.tenantID};
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetDashboardStats',
            methodType: 'POST',
            payload: {input: searchQuery},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.dashboardStats = response.data.result;
                ieGlobalVariable.loaderStore.turnoff();
              if(setHeaders) {
                setHeaders();
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

    getDashboardMetrics() {
        var searchQuery = {tenantId: this.tenantID};
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetDashboardMetrics',
            methodType: 'POST',
            payload: {input: searchQuery},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.dashboardMetrics = response.data.result;
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

    deleteDTEntries(tableName,configName,groupType) {
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        var input = {};
        if(this.fromDate && this.toDate) { 
            var fromDate = this.fromDate+':00'
            var toDate = this.toDate+':00'
            fromDate = new Date(fromDate.replace('T',' ')).toISOString().replace('Z','');
            toDate = new Date(toDate.replace('T',' ')).toISOString().replace('Z','');
            input = {'tableName':tableName, fromDate: fromDate, toDate: toDate}
        }else {
            input = {'tableName':tableName }
        }
       
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'DeleteDTEntries',
            methodType: 'POST',
            payload: {input: input},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                if (response.data && response.data['success']) {
                  if(tableName === 'TRCAuditTable'){
                      if(groupType === 'source' || groupType === 'target'){
                        internalThis.getTRCAuditData(configName,tableName,groupType)
                      }
                      else{
                      internalThis.getTRCAuditData(tableName, 'Dashboard');
                      }
                  } else {
                    internalThis.getPeristenceObjectData(tableName, 'Config');
                  }
                }
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
    deleteSummaryEntries() {
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'DeleteSummaryTableEntries',
            methodType: 'POST',
            payload: {},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                if (response.data && response.data['success']) {
                  internalThis.getDashboardMetrics();
                }
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

    getTransactions() {
        var searchQuery = {tenantId: this.tenantID};
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: 'GenericIEMasterConfig',
            endpoint: 'GetTransactions',
            methodType: 'POST',
            payload: {input: searchQuery},
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.transactions = response.data.result;
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

    @observable accessTokens = [];
    @observable isGroupKey = false;
    @observable tempGroupName = '';
    @observable tempGroupType = '';
    @observable tempTenantId = '';
    getAllAccessTokens() {
        var internalThis = this;
        var query = {};
        if (this.isGroupKey === true) {
          query = {
            where:{
                groupType: this.tempGroupType,
                groupName: this.tempGroupName
            }
          }
        }
        var searchQuery = {
            input: {
                tenantId: this.tempTenantId,
                isGroupKey: this.isGroupKey,
                query: query
            }
        };
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'getAllAccessTokens',
            methodType: 'POST',
            payload: searchQuery,
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.accessTokens = response.data.result;
                ieGlobalVariable.loaderStore.turnoff();
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }
    @observable apiKey = {};
    generateAPIKey() {
        var internalThis = this;
        ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
            midpoint: '',
            endpoint: 'generateAPIKey',
            methodType: 'POST',
            payload: {
                input:{
                   tenantId: this.tempTenantId,
                   isGroupKey:this.isGroupKey,
                   groupType: this.tempGroupType,
                   groupName: this.tempGroupName
                }
            },
            queryparam: null,
            headers: null
        };
        backendServer.api_call(apiInput)
            .then(function (response) {
                // Return Data
                internalThis.apiKey = response.data;
                ieGlobalVariable.loaderStore.turnoff();
                internalThis.getAllAccessTokens();
            })
            .catch(function (error) {
                ieGlobalVariable.loaderStore.turnoff();
                return error;
            });
    }
  enableScriptLogs() {
    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'EnableScriptLogStatus',
      methodType: 'POST',
      payload: {
        input:{
          tenantId: this.tempTenantId,
          isEnableLogs:this.isEnableLogs
        }
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        internalThis.isEnableLogs = response.data.Status;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  getScriptLogsStatus() {
    var internalThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
      endpoint: 'GetScriptLogsStatus',
      methodType: 'POST',
      payload: {
        input:{}
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        internalThis.isEnableLogs = response.data.Status;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @observable contextList = [];
  getContextsList() {
    var searchQuery = {};
    var internalThis = this;
     ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: '',
      endpoint: 'getContextsList',
      methodType: 'POST',
      payload: searchQuery,
      queryparam: null,
      headers: null
    };
    return backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        internalThis.contextList = response.data.result;
         ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  //get TRC application key using given authentication versionDetails
  getTRCAppKey(username, password) { // eslint-disable-line no-unused-vars
    if(AUTHURL===null){
        var data = JSON.stringify({
            'userId': this.username,
            'password': this.password
            });
    }else{
        var data = JSON.stringify({
        'userId': this.username,
        'password': this.password,
        'hostName': AUTHURL
        });
    }
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    ieGlobalVariable.loaderStore.turnon();
    var internalThis = this;
    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        ieGlobalVariable.loaderStore.turnoff();
        if (this.status === 200 && this.response!=='401 UNAUTHORIZED') {
          ieGlobalVariable.serverAppKey = JSON.parse(this.responseText).rows[0].KeyID;
        } else {
          console.log('Getting error: Invalid Credentials ',this.status); // eslint-disable-line no-console
        }
        if (internalThis.async_callback) {
            var responseVal = (this.status === 200 && this.response!=='401 UNAUTHORIZED') ? JSON.parse(this.responseText) : this.responseText;
            internalThis.async_callback(this,responseVal);
        }
      }
    });

    xhr.open('POST', SERVER_BASE_URL + '/LoginAppKey/dataServices/login');
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('accept', 'application/json');
    xhr.send(data);
  }
  getUserGroup(Username) {
        var internalThis = this;
         ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
          midpoint: 'GenericIEMasterConfig',
          endpoint: 'GetUserGroup',
          methodType: 'POST',
          payload: {
          input:{Username : Username}
          },
          queryparam: null,
          headers: { 'Content-Type': 'application/json' , 'Accept' : 'application/json' }
        };
         return backendServer.api_call(apiInput)
          .then(function (response) {
            // Return Data
            internalThis.userGroupName = response.data.UserGroup;
             ieGlobalVariable.loaderStore.turnoff();
          })
          .catch(function (error) {
            ieGlobalVariable.loaderStore.turnoff();
            return error;
          });
      }
      getTitleNameMap(groupName,groupType,configName) {
        var internalThis = this;
         ieGlobalVariable.loaderStore.turnon();
        const apiInput = {
          midpoint: 'GenericIEMasterConfig',
          endpoint: 'getTitleNameMap',
          methodType: 'POST',
          payload: {
          input:{groupName : groupName,groupType:groupType,configName:configName}
          },
          queryparam: null,
          headers: null
        };
         return backendServer.api_call(apiInput)
          .then(function (response) {
            // Return Data
             ieGlobalVariable.loaderStore.turnoff();
             return response.data;
          })
          .catch(function (error) {
            ieGlobalVariable.loaderStore.turnoff();
            return error;
          });
      }
//returnSelectedObject service will return the selected source or target config basic details as object
    returnSelectedObject(type, name, groupName) {
        var arrObj = [];
        if (type === 'source') {
            arrObj = this.SourceConfigs;
        } else if (type === 'target') {
            arrObj = this.TargetConfigs;
        } else {
        }
        for (var i = 0; i < arrObj.length; i++) {
            if (groupName) {
                if (name === arrObj[i].Name && groupName === arrObj[i].Group) {
                    return arrObj[i];
                }
            } else {
                if (name === arrObj[i].Name) {
                    return arrObj[i];
                }
            }
        }
    }

structureJson(inpdata,key,main_obj_name,nodeSelectFunc,nodeStyle,client_store){
var responseObject={};
var valueObject=inpdata[key];
if(typeof valueObject==='object'){
 var childArray=[];
 var locObj=valueObject;
 for(var c_key in locObj){
   childArray.push(this.structureJson(locObj,c_key,main_obj_name,nodeSelectFunc,nodeStyle,client_store));
 }
 responseObject['children']=childArray;
 responseObject['schemaSubset']=childArray;
}
var type_arr = key.split('@#TYPEID#@');
var style_obj = JSON.parse(JSON.stringify(nodeStyle))
if(client_store.FlexTotalAssInput[0] && type_arr[1]===client_store.FlexTotalAssInput[0]['typeId']){
  style_obj['background-color']='lightgreen';
}
let k = (<Button bsSize="xsmall" style={style_obj} className="pull-right" onClick={nodeSelectFunc.bind(this,key,main_obj_name)}>{type_arr[0]}</Button>);
responseObject['title']=k;
return responseObject;
}

constructObjectFromArray(obj, keys, v) {
  if (keys.length === 1) {
    obj[keys[0]] = v;
  } else {
    var key = keys.shift();
    obj[key] = this.constructObjectFromArray(typeof obj[key] === 'undefined' ? {} : obj[key], keys, v);
  }
  return obj;
}

formTreeFromFlexTypes(flexTypes,nodeSelectFunc,nodeStyle={},client_store){
  var temp_tree = [];
  for(var key in flexTypes){
    var c_arr = [];
    var c_obj = {};
    var array_of_arrays = [];
    var th_obj = flexTypes[key];
    for(var c_key in th_obj) {
      var temp_c_key = c_key//+'@#T#@'+typeID;
      var tmp_arr = temp_c_key.split('\\');
      var new_arr = [];
      var tmp_str = tmp_arr[0];
      new_arr.push(tmp_arr[0]+'@#TYPEID#@'+th_obj[tmp_arr[0]]['typeId']+'@#TYPEID#@'+tmp_arr[0]);
      for(var ar=1;ar<tmp_arr.length;ar++){
        tmp_str = tmp_str+'\\'+tmp_arr[ar];
        new_arr.push(tmp_arr[ar]+'@#TYPEID#@'+th_obj[tmp_str]['typeId']+'@#TYPEID#@'+tmp_str);
      }
     array_of_arrays.push(new_arr);
      c_arr.push({title: c_key})
    }
    array_of_arrays = array_of_arrays.sort(function (a, b) {
                          return a.length - b.length;
                      });
    for(var i=0;i<array_of_arrays.length;i++){
      c_obj = this.constructObjectFromArray(c_obj, array_of_arrays[i], {});
    }

    var parent_key = '';
    for(var Pkey in c_obj){ //as there will be only one main key for each TypeHierarchy
      parent_key = Pkey;
    }
    c_arr = this.structureJson(c_obj,parent_key,key,nodeSelectFunc,nodeStyle,client_store);
    var display_key = parent_key.split('@#TYPEID#@')[0];
    if(display_key!==key){
      display_key = key;
    }
    var style_obj = JSON.parse(JSON.stringify(nodeStyle))
    if(client_store.FlexTotalAssInput[0] && display_key===client_store.FlexTotalAssInput[0]['flexObject']){
      style_obj['background-color']='lightgreen';
    }
    let k = (<Button bsSize="xsmall" style={style_obj} className="pull-right" onClick={nodeSelectFunc.bind(this,parent_key,key)}>{display_key}</Button>);
    temp_tree.push({title: k, expanded: false,children: c_arr['children'],schemaSubset: c_arr['children']});
  }
  return temp_tree;
}

  //getGroupNames service will take array of objects ,
  //where each object must contain Name value, then it will return the array of names
  getGroupNames(arr, type) {
    var names = [];
    for (var i = 0; i < arr.length; i++) {
      if (type === 'tenant') {
        names.push(arr[i].tenantName);
      } else names.push(arr[i].Name);
    }
    return names;
  }

  //return PrimaryKey from given config json, if schema doesn't contain atleast one key then primary key value will be empty otherwise it will return configjson primary key value
  returnPrimaryKey(schemaJson, config) {
    schemaJson = schemaJson['schema'] ? schemaJson['schema'] : schemaJson;
    if (schemaJson['properties']) {
      if (Object.keys(schemaJson['properties']).length > 0) {
          if(config['PrimaryKey'] !== 'Select') {
              return (config['PrimaryKey'] ? config['PrimaryKey'] : '');
          }else {
              return '';
          }
      }
    }
    return '';
  }
    // This method is used to set values in the object
    setvalue(name, value) {
        this[name] = value;
    }

}

export default GenericCDEEMasterStore;
