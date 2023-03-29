/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import { observable, computed, action } from 'mobx';

class TypeManagerStore {

  constructor(name) {
    this.name = name ? name : 'TypeManagerConfig';
    this.store_name = 'TypeManagerStore'; //This is the filename
  }

  name = 'TypeManagerStore';
  store_name = 'TypeManagerStore'; //This is the filename

  description = 'This is used to manage all data types';
  @observable filter_scripts = [];
  @observable filterScriptsArr = [];
  @observable selected_script_index = null;
  @observable TransformationRules = {selected_script_index: null,testScipt_input_value:{'value':''},test_script_output:{ data_type: '', value: ''}};
  @observable PreTransformationRules = {selected_script_index: null,testScipt_input_value:{'value':''},test_script_output:{ data_type: '', value: ''}};

  modifyScript(input, arr){
    return new Function(input, arr.join('\n'));
  }

  @action clickButton() {
    this.numClicks++;
  }


@observable data_types = {};
@observable test_input_value =  '';
@observable  test_output_value = '';
@observable currentTenantID = '';
@observable modalShow = false;
@observable scriptStatus = false;
@observable scriptObj = {};
@observable typeStoreProps = {};
@observable modalStatus = false;


@computed get GetDataTypes() {
  var typeManagerThis = this;
  if (Object.keys(this.data_types).length === 0) {
  }
  const apiInput = {
    midpoint: this.name,
    endpoint: 'GetDataTypes',
    methodType: 'POST',
    payload: { tenantId: this.currentTenantID },
    queryparam: null,
    headers: null
  };
  backendServer.api_call(apiInput)
    .then(function (response) {
      // Return Data
      typeManagerThis.data_types = response.data;
    })
    .catch(function (error) {
      return error;
    });
}


@computed get GetFilterScripts() {
  var typeManagerThis = this;
  const apiInput = {
    midpoint: this.name,
    endpoint: 'GetFilterScripts',
    methodType: 'POST',
    payload: { tenantId: this.currentTenantID },
    queryparam: null,
    headers: null
  };
  backendServer.api_call(apiInput)
    .then(function (response) {
      // Return Data
      typeManagerThis.filter_scripts = response.data.scripts;
      typeManagerThis.getFilterScriptsArr(response.data.scripts);
    })
    .catch(function (error) {
      return error;
    });
}

//input : { input:{propertyName:value}}
  SetPropValues(input_name,modifiedObj={},type) {
    var searchQuery = {};
    searchQuery[input_name] = this[input_name];
    var typeManagerThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetPropValues',
      methodType: 'POST',
      payload: { input: searchQuery, modifiedObj: modifiedObj, type: type, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function () {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        typeManagerThis.GetDataTypes;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
  @observable testScipt_input_value= {'value':''};

  @observable test_script_output = { data_type: '', value: ''};
  TestScript(script, input,prop_key='TransformationRules') {
    var typeManagerThis = this;
    const apiInput = {
      midpoint: this.name,
      endpoint: 'TestScript',
      methodType: 'POST',
      payload: { input: input, sample_script: { script_array: script }, tenantId: this.currentTenantID,testApi:true },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        typeManagerThis.test_script_output = response.data;
        typeManagerThis[prop_key]['test_script_output']=response.data;
      })
      .catch(function (error) {
        return error;
      });
  }


  //input : { input:{propertyName:value}}
  UploadFilterScripts(modifiedObj={}, saveScriptCallback) {
    var searchQuery = { filter_scripts: { scripts: this.filter_scripts } };
    var typeManagerThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'SetPropValues',
      methodType: 'POST',
      payload: { input: searchQuery, modifiedObj: modifiedObj, type: 'FilterScripts', tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function () {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        typeManagerThis.GetFilterScripts;
        if(saveScriptCallback){
            saveScriptCallback('Success');
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        if(saveScriptCallback){
            saveScriptCallback('Failed');
        }
        return error;
      });
  }
  //input : { input:{obj}}
  deleteFilterScript(obj) {
    var searchQuery = obj;
    searchQuery.tenantId = this.currentTenantID;
    var typeManagerThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: this.name,
      endpoint: 'DeleteFilterScripts',
      methodType: 'POST',
      payload: { input: searchQuery, type: 'FilterScripts' },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function () {
        // Return Data
        typeManagerThis.GetFilterScripts;
        ieGlobalVariable.loaderStore.turnoff();

      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }
  getFilterScriptsArr(obj) {
    var arr = [];
    for (var key in obj) {
      arr.push(obj[key].name);
    }
    this.filterScriptsArr = arr;
    return arr;
  }
  // This method is used to set values in the object
  setvalue(name, value) {
    this[name] = value;
  }


}

export default TypeManagerStore;
