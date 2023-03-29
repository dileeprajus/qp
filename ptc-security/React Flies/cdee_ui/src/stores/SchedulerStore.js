/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import { observable, computed } from 'mobx';

class ScheduleStore {
  constructor(name) {
    // If you want to get a thing particularly
    //then mention thing name else it will default to WeeklyscheduleConfig
    this.name = name ? name : 'WeeklySchedulerConfig';
    this.store_name = 'ScheduleStore'; //This is the filename
  }

  description = 'This is used to get Schedules from ThingWorx';

  // declare thing attributes which are used in default thing template
  // Methods On Default Thing template
  @observable new_config_name = '';
  @observable new_config_description = '';
  @observable config_names = [];
  @observable ScheduleConfigs = {};
  @observable Configs = [];
  @observable ScheduleConfigNames = [];
  @observable DataStoreOptions = ['gDrive', 'Local', 'FTP'];
  @observable currentGroupName = '';
  @observable currentGroupType = '';
  @observable currentTenantID = '';
  @observable enableScheduler = false;
  @observable scheduleTypes = ['Manual', 'Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months'];
  @observable currentScheduleType = 'Manual';
  @observable currentSecondsScheduleVal = 10;
  @observable currentMinuteScheduleVal = 0;
  @observable currentHourScheduleVal = 1;
  @observable currentMonthScheduleVal = 1;
  @observable currentDayScheduleVal = 1;
  @observable currentSelectedDayType = 'Every';
  @observable currentSelectedMonthType = 'Day';
  @observable currentMonthSpecsScheduleVal = 1;
  @observable currentWeekDayScheduleVal = 'MON';
  @observable currentSelectedWeekDayVal = '*';
  @observable newCronString = '0 0/1 * * * ?';
  @observable showModal = false;
  @observable modalTitle = '';
  @observable modalBody = '';
  @observable modalBtnTxt = '';
  @observable serviceName = '';
  @observable manualSchedule = {
    Seconds: {
      name: 'Seconds',
      allowedValues: '0 - 59, - */',
      value: '0/1'
    },
    Minutes: {
      name: 'Minutes',
      allowedValues: '0 - 59, - */',
      value: '*'
    },
    Hours: {
      name: 'Hours',
      allowedValues: '1 - 24, - */',
      value: '*'
    },
    DayOfTheMonth: {
      name: 'DayOfTheMonth',
      allowedValues: '1 - 31, - * ? / L W C',
      value: '*'
    },
    Month: {
      name: 'Month',
      allowedValues: '1 - 12 or JAN-DEC, - * /',
      value: '*'
    },
    DayOfWeek: {
      name: 'DayOfWeek',
      allowedValues: 'SUN-SAT, - * ? /',
      value: '?'
    }
  };
  retrunCronExpression(type, val) {
    if (type === 'Seconds') {
      return '0/' + val.seconds + ' * * * * ? *';
    } else if (type === 'Minutes') {
      return val.seconds + ' 0/' + val.minutes + ' * * * ? *';
    } else if (type === 'Hours') {
      return val.seconds + ' ' + val.minutes + ' 0/' + val.hours + ' * * ? *';
    } else if (type === 'Days') {
      if (val.type === 'Every') {
        return val.seconds + ' ' + val.minutes + ' ' + val.hours + ' 1/' + val.days + ' * ? *';
      } else if (val.type === 'EveryWeekDay') {
        return val.seconds + ' ' + val.minutes + ' ' + val.hours + ' 1/' + val.days + ' * MON-FRI *';
      } else if (val.type === 'EveryWeekendDay') {
        return val.seconds + ' ' + val.minutes + ' ' + val.hours + ' ? * SAT,SUN *';
      }
    } else if (type === 'Weeks') {
      return val.seconds + ' ' + val.minutes + ' ' + val.hours + ' ? * ' + val.weeks + ' *';
    } else if (type === 'Months') {
      if (val.type === 'Day') {
        return val.seconds + ' ' + val.minutes + ' ' + val.hours + ' ' + val.days + ' 1/' + val.months + ' ? *';
      } else if (val.type === 'WeekDay') {
        return val.seconds + ' ' + val.minutes + ' ' + val.hours  + ' ?' + ' 1/' + val.months + ' ' + val.weekDays + '#' +val.monthSpecs + ' *';
      }
    } else if (type === 'Manual') {
      return val.seconds + ' ' + val.minutes + ' ' + val.hours + ' ' + val.dayOfMonth + ' ' + val.month + ' ' + val.weeks + ' *';
    }
  }
  @computed get getAllScheduleConfigs() {
    var searchQuery = { groupType: this.currentGroupType, groupName: this.currentGroupName, configName: this.name };
    var scheduleThis = this;
    if (Object.keys(this.ScheduleConfigs).length === 0) {
      ieGlobalVariable.loaderStore.turnon();
    }

    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetAllConfigs',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        scheduleThis.ScheduleConfigs = response.data.Configs;
        scheduleThis.ScheduleConfigNames = [];
        var tempThis = scheduleThis;
        scheduleThis.ScheduleConfigs.map(t => { tempThis.ScheduleConfigNames.push(t.Name); });
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  addConfigToScheduleArr(tempConfig) {
    var searchQuery = { config_name: tempConfig, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: tempConfig, schedulerName: this.name, tenantId: this.currentTenantID };
    ieGlobalVariable.loaderStore.turnon();

    const apiInput = {
      midpoint: this.name,
      endpoint: 'PushConfigNamesToArr',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function () {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

@observable scheduleConfig = 'DailySchedulerConfig';
//Inputs: {input:{config_name:name of the thing ex: WH/Static/Rest etc}}
  getScheduleConfig(tempConfig) {
    var searchQuery = { config_name: tempConfig, groupType: this.currentGroupType, groupName: this.currentGroupName, configName: tempConfig, tenantId: this.currentTenantID };
    var scheduleThis = this;

    const apiInput = {
      midpoint: this.name,
      endpoint: 'GetScheduleConfigName',
      methodType: 'POST',
      payload: { input: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        if (response.data !== '') {
          scheduleThis.setvalue('scheduleConfig', response.data.schedule_config);
        }
      })
      .catch(function () {
      });
  }

  // Methods On Default Thing template
  @observable scheduler = {}; //each config will contain only one single scheduler. so datatype is object not array
  @computed get getSchedulerConfigs() {
    var schedulerThis = this;
    if (Object.keys(this.scheduler).length === 0) {
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
        schedulerThis.setvalue('Configs', response.data.Configs);
        schedulerThis.getTotalConfigs;
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

  @computed get getTotalConfigs() {
    var schedulerThis = this;
    const apiInput = {
      midpoint: 'GenericIEMasterConfig',
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
        schedulerThis.config_names = response.data.Configs;
        schedulerThis.config_names = schedulerThis.config_names.map(function (x) { return x.toUpperCase() });
        if (schedulerThis.async_callback) {
          schedulerThis.async_callback(schedulerThis, response);
        }
      })
      .catch(function (error) {
        if (schedulerThis.async_callback) {
          schedulerThis.async_callback(error);
        }
      });
  }


  CreateConfig(generic_master_store, enable_modal_tabs, configName) {
    var searchQuery = {
      name: this.new_config_name,
      description: this.new_config_description,
      groupName: 'SchedulerGroup',
      configName: configName
    }
    var schedulerThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'DailySchedulerConfig',
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
        schedulerThis.scheduler = response.data.result;
        schedulerThis.new_config_name = '';
        schedulerThis.new_config_description = '';
        ieGlobalVariable.loaderStore.turnoff();
        enable_modal_tabs();
        schedulerThis.getSchedulerConfig(configName);
        if (schedulerThis.async_callback) {
          schedulerThis.async_callback(schedulerThis, response.data);
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (schedulerThis.async_callback) {
          schedulerThis.async_callback(error);
        }
      });
  }

  getSchedulerConfig(configName, showNewForm) {
    var searchQuery = {
      configName: configName
    }
    var schedulerThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'DailySchedulerConfig',
      endpoint: 'GetSchedulerConfig',
      methodType: 'POST',
      payload: {
        input: searchQuery
      },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        schedulerThis.scheduler = response.data.result;
        schedulerThis.newCronString = response.data.result.CronString;
        schedulerThis.enableScheduler = response.data.result.Enabled;
        schedulerThis.currentScheduleType = response.data.result.schedulerType ? response.data.result.schedulerType :'Manual'
        ieGlobalVariable.loaderStore.turnoff();
        schedulerThis.getTotalConfigs;
        if (schedulerThis.async_callback) {
          schedulerThis.async_callback(schedulerThis, response);
        }
        if (showNewForm) {
          showNewForm();
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if (schedulerThis.async_callback) {
          schedulerThis.async_callback(error);
        }
      });
  }

  //Input: name of the thing to delete
 DeleteConfig(scheulerConfigName, configName, showNewForm) {
   var searchQuery = scheulerConfigName;
   var schedulerThis = this;
   ieGlobalVariable.loaderStore.turnon();
   const apiInput = {
     midpoint: 'DailySchedulerConfig',
     endpoint: 'DeleteConfig',
     methodType: 'POST',
     payload: { input: searchQuery },
     queryparam: null,
     headers: null
   };
   backendServer.api_call(apiInput)
     .then(function (response) { // eslint-disable-line no-unused-vars
       ieGlobalVariable.loaderStore.turnoff();
       schedulerThis.getSchedulerConfig(configName, showNewForm);
     })
     .catch(function (error) {
       ieGlobalVariable.loaderStore.turnoff();
       return error;
     });
 }

 saveSchedulerCron(configName) {
   var searchQuery = {
     configName: configName ? configName : this.scheduler.Name,
     cronString: this.newCronString,
     enabled: this.enableScheduler,
     schedulerType: this.currentScheduleType
   }
   var schedulerThis = this;
   ieGlobalVariable.loaderStore.turnon();
   const apiInput = {
     midpoint: 'GenericIEMasterConfig',
     endpoint: 'SetCronConfigurationForSchedular',
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
  // This method is used to set values in the object
  setvalue(name, value) {
    this[name] = value;
  }

}

export default ScheduleStore;
