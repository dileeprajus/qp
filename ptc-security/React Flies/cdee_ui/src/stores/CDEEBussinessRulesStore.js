/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import BackendServer from '../configuration/BackendServer';
const backendServer = new BackendServer();
import { observable, action } from 'mobx';
import FlexStore from './FlexStore';
import StaticFileClientStore from './StaticFileClientStore';
import RestClientStore from './RestClientStore';
import SoapClientStore from './SoapClientStore';
import TypeManagerStore from './TypeManagerStore';

// This store is used to generate Mapping and also act as history
class CDEEBussinessRulesStore {

  constructor(name) {
    // If you want to get a thing particularly then mention
    //thing name else it will default to FlexThing
    this.name = name ? name : 'MappingConfig';
    this.store_name = 'CDEEBussinessRulesStore'; //This is the filename
    this.type_manager_store = new TypeManagerStore();
  }

  description = 'This is used to map datastores';

  getThing = {
    FlexStore: FlexStore,
    StaticFileClientStore: StaticFileClientStore,
    RestClientStore: RestClientStore,
    SoapClientStore: SoapClientStore
  }

  @observable customJson = { a: 'avlaue', b: 'b value' };
  @observable customXML = '<a>xml a value</a>';
  @observable Json2XmlData = '';
  @observable Xml2JsonData = {};
  @observable InputWSDL = '';
  @observable InputWSDLServiceName = '';
  @observable InputWSDLElementName = '';
  @observable OutputWSDLElementName = '';
  @observable InputWSDLEndPointUrl = '';
  @observable InputWSDLServiceSoapAction = '';
  @observable InputWSDLServicePortBinding = '';
  @observable SpecJson = {};
  @observable async_callback = null;
  @observable groupName = '';
  @observable groupType = '';
  @observable configName = '';
  @observable currentTenantID = '';

  JsonToXML() {
    // for now search query is nil
    var searchQuery = this.customJson;
    var CDEEBussinessRulesThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'JsonToXML',
      methodType: 'POST',
      payload: { InputJson: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        CDEEBussinessRulesThis.Json2XmlData = response.data;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  XMLToJson() {
    // for now search query is nil
    var searchQuery = this.customXML;
    var CDEEBussinessRulesThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'XMLToJson',
      methodType: 'POST',
      payload: { InputXML: searchQuery },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        CDEEBussinessRulesThis.Xml2JsonData = response.data;
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @observable requestXSDFromSoapEndPoint = '';
  @observable respoonseXSDFromSoapEndPoint = '';
  GetXSDForSoapEndPoint(elementType, storeSchema) {
    // for now search query is nil
    var CDEEBussinessRulesThis = this;
    var tempElementName = '';
    if (elementType === 'request') {
      tempElementName = this.InputWSDLElementName;
    } else if (elementType === 'response') {
      tempElementName = this.OutputWSDLElementName;
    } else {}
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'GetXSDForSoapEndPoint',
      methodType: 'POST',
      payload: { InputWSDL: this.InputWSDL, ElementName: tempElementName, groupName:this.groupName, groupType:this.groupType, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        if (elementType === 'request') {
          CDEEBussinessRulesThis.requestXSDFromSoapEndPoint = response.data['result'];
        } else if (elementType === 'response') {
          CDEEBussinessRulesThis.responseXSDFromSoapEndPoint = response.data['result'];
        } else {}
          CDEEBussinessRulesThis.XSDToJson(elementType, storeSchema);
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @observable serviceNamesList = '';
  GetServiceNames() {
    // for now search query is nil
    var CDEEBussinessRulesThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'GetServiceNames',
      methodType: 'POST',
      payload: { InputWSDL: this.InputWSDL },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        CDEEBussinessRulesThis.serviceNamesList = response.data;
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @observable requestXSD2Json = {};
  @observable responseXSD2Json = {};
  XSDToJson(elementType, storeSchema) {
    // for now search query is nil
    var CDEEBussinessRulesThis = this;
    var tempXSD = '';
    if (elementType === 'request') {
      tempXSD = this.requestXSDFromSoapEndPoint;
    } else if (elementType === 'response') {
      tempXSD = this.responseXSDFromSoapEndPoint;
    } else {}
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'XSDToJson',
      methodType: 'POST',
      payload: { InputXSD: tempXSD, groupName:this.groupName, groupType:this.groupType, configName:this.configName, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
       if (elementType === 'request') {
          CDEEBussinessRulesThis.requestXSD2Json = response.data['result'];
        } else if (elementType === 'response') {
          CDEEBussinessRulesThis.responseXSD2Json = response.data['result'];
          //update the responseXSD2Json in Schema variable in soap client store
        } else {}
          var temp = CDEEBussinessRulesThis.groupType == 'source' ? CDEEBussinessRulesThis.responseXSD2Json : CDEEBussinessRulesThis.requestXSD2Json
          var mytemp = JSON.stringify(temp);
          mytemp = mytemp.replace(':tns',':ns2');
          mytemp = mytemp.replace('tns:','ns2:');
          var newTemp = JSON.parse(mytemp);
          if (CDEEBussinessRulesThis.groupType == 'source') {
            CDEEBussinessRulesThis.responseXSD2Json = newTemp;
          } else if (CDEEBussinessRulesThis.groupType == 'target') {
            CDEEBussinessRulesThis.requestXSD2Json = newTemp;
          }
          storeSchema();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  GetSoapEndPoint() {
    // for now search query is nil
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'GetSoapEndPoint',
      methodType: 'POST',
      payload: { InputWSDL: this.InputWSDL, tenantId: this.currentTenantID },
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

  @observable wsdlMetaInfo = [];
// getWSDLMetaInfo service will return the soap meta information like operation name,
//element names, port bindind, soap action etc...
//input is WSDL data
  getWSDLMetaInfo() {
    var CDEEBussinessRulesThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'GetWSDLMetaInfo',
      methodType: 'POST',
      payload: { InputWSDL: this.InputWSDL, groupName:this.groupName, groupType:this.groupType, tenantId: this.currentTenantID },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        CDEEBussinessRulesThis.wsdlMetaInfo = response.data['result'] ? response.data['result'] : [];
        ieGlobalVariable.loaderStore.turnoff();
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

@observable JsonSchema = {};
  validateJson() {
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'ValidateJSON',
      methodType: 'POST',
      payload: { InputJson: this.InputJson, JsonSchema: this.JsonSchema },
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

  SendRequestObject() {
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'SendRequestObject',
      methodType: 'POST',
      payload: { InputURL: '', InputWSDL: this.InputWSDL, InputRequestBody: '' },
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

  // Inputs: inputJson, specJson
  // output: transformedOutputJson
  @observable transformedOutputJson = {};

  DataTransformer(inputJson, specJson) {
    // for now search query is nil
    var CDEEBussinessRulesThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'DataTransformer',
      methodType: 'POST',
      payload: { InputJson: { schema: inputJson }, SpecJson: specJson },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        if (response.data.result){
          CDEEBussinessRulesThis.transformedOutputJson = response.data.result;
        }else{
          CDEEBussinessRulesThis.transformedOutputJson = response.data;
        }

      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  CustomTransformer(inputJson, specJson, tenantId) {
    // for now search query is nil
    var CDEEBussinessRulesThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'customTransformer',
      methodType: 'POST',
      payload: { InputJson: { schema: inputJson }, SpecJson: specJson, CFC: {}, MCC: {}, transactionObj:{'testApi':true}, tenantId: tenantId },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        if (response.data.result) {
          CDEEBussinessRulesThis.transformedOutputJson = response.data.result;
        } else {
          CDEEBussinessRulesThis.transformedOutputJson = response.data;
        }
        if (BACKEND === 'Thingworx') {
          CDEEBussinessRulesThis.removeAllOccurancesOfJsonKey(CDEEBussinessRulesThis.transformedOutputJson, '_index');
        }
      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  removeAllOccurancesOfJsonKey(inputJson, jsonKey) {
    var CDEEBussinessRulesThis = this;
    ieGlobalVariable.loaderStore.turnon();
    const apiInput = {
      midpoint: 'MappingConfig',
      endpoint: 'removeAllOccurancesOfJsonKey',
      methodType: 'POST',
      payload: { jsonObject: inputJson, jsonKey: jsonKey },
      queryparam: null,
      headers: null
    };
    backendServer.api_call(apiInput)
      .then(function (response) {
        // Return Data
        ieGlobalVariable.loaderStore.turnoff();
        if (response.data.result) {
          CDEEBussinessRulesThis.transformedOutputJson = response.data.result;
        } else {
          CDEEBussinessRulesThis.transformedOutputJson = response.data;
        }

      })
      .catch(function (error) {
        ieGlobalVariable.loaderStore.turnoff();
        return error;
      });
  }

  @action clickButton() {
    this.numClicks++;
  }

  setvalue(name, value) {
    this[name] = value;
  }


}

export default CDEEBussinessRulesStore;
