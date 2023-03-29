/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/

class LDynamicMidPoint {

    getBasicConfigInfo(input) {
        input.midpoint = 'generic';
        input.callback = this.getBasicConfigInfoCB;
        input.payload = typeof input.payload.input == 'object' ? input.payload.input : input.payload;
        return input;
    }

    getPropValues(input) {
        input.midpoint = 'generic';
        input.callback = this.getPropValuesCB;
        input.payload = typeof input.payload.input == 'object' ? input.payload.input : input.payload;
        return input;
    }

    setPropValues(input) {
        input.midpoint = 'generic';
        input.callback = this.getPropValuesCB;

        return input;
    }

    testApi(input) {
        input.midpoint = 'generic';
        input.endpoint = 'testApi';
        input.callback = this.getPropValuesCB;
        return input;
    }

    testCustomAuth(input) {
        input.midpoint = 'generic';
        input.endpoint = 'testCustomAuth';
        input.callback = this.getPropValuesCB;
        return input;
    }

    fetchSchemaUsingConfigJson(input) {
        input.midpoint = 'generic';
        input.endpoint = 'fetchSchemaUsingConfigJson';
        input.callback = this.fetchSchemaUsingConfigJsonCB;
        return input;
    }
    getSchemaFromJson(input){
        input.midpoint = 'generic';
        input.endpoint = 'getSchemaFromJson';
        input.callback = this.fetchSchemaUsingConfigJsonCB;
        return input;
    }
    testStaticData(input){
        input.payload =  input.payload.input;
        input.midpoint = 'generic';
        input.endpoint = 'testStaticData';
        input.callback = this.fetchSchemaUsingConfigJsonCB;
        return input;
    }
    setApplicationID(input) {
        input.midpoint = 'application';
        input.endpoint = 'setApplicationID';
        input.callback = this.setApplicationIDCB;
        input.payload = input.payload.modifiedObj;
        return input;
    }
    getApplicationIDs(input) {
        input.midpoint = 'application';
        input.endpoint = 'getApplicationIDs';
        input.callback = this.getPropValuesCB;
        return input;
    }

    getTotalConfigs(input){
        input.midpoint = input.payload.groupType + 'Config';
        input.callback = this.genericCallback;
        input.endpoint = 'getTotalConfigs';
        return input
    }

    genericCallback(response) {
        return response;
    }

    testDBApi(input){
        input.midpoint = 'generic';
        input.callback = this.genericCallback;
        input.endpoint = 'testDatabaseQuery';
        return input;
    }

    genericCallback(response) {
        return response;
    }

    deleteApplicationIDs(input) {
        input.midpoint = 'application';
        input.payload = input.payload.input;
        input.endpoint = 'deleteApplicationID';
        input.callback = this.getPropValuesCB;
        return input;
    }

    setApplicationIDCB(response) {
        if (response) {
            response.applicationIDs = response;
        }
        return response;
    }

    getBasicConfigInfoCB(response) {
        if (response.data) {
            response.data.Name = response.data.name;
            response.data.Description = response.data.description;
            response.data.Group = response.data.groupName;
            if (response.data.canBeUsable !== undefined)
                response.data.CanBeUsable = response.data.canBeUsable;
            if (response.data.dataSourceType !== undefined)
                response.data.DataSourceType = response.data.dataSourceType;
            if (response.data.configJson){
                response.data.ConfigJson = response.data.configJson;
            }
            if (response.data.configJson){
                response.data.Data = response.data.configJson.dataContent;
                response.data.DataFormat = response.data.configJson.current_data_format;
                response.data.Delimeter = response.data.configJson.delimeter;
            }
            if (response.data.schema) {
                response.data.Schema = response.data.schema;
            }
            if (response.data.tenantId) {
                response.data.TenantId = response.data.tenantId;
            }
            if (response.data.updatedSchema) {
                response.data.UpdatedSchema = response.data.updatedSchema;
            }
        }
        return response;
    }

    getPropValuesCB(response) {
        return response;
    }

    SetPropValuesCB(response) {
        return response;
    }

    testApiCB(response) {
        return response;
    }

    fetchSchemaUsingConfigJsonCB(response) {
        return response;
    }

    testAPIWithRequestVars(input) {
        if(input.payload.dataSourceType === 'Soap') {
            input.midpoint = 'generic';
            input.endpoint = 'soapRequestVariables'
            input.callback = this.testAPIWithRequestVarsCB;
            return input;
         }else {
            input.midpoint = 'generic';
            input.endpoint = 'testAPIWithRequestVars'
            input.callback = this.testAPIWithRequestVarsCB;
            return input;
         }
    }

    testAPIWithRequestVarsCB(response) {
        return response;
    }
}

export default LDynamicMidPoint;
