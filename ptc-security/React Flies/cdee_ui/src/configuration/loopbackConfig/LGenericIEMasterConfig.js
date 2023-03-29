/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
class LGenericIEMasterConfig {
    formatPayload(input) {
        switch (input.endpoint) {
            case 'getTransactionLogsData':
                {
                    input.midpoint = 'generic';
                    input.callback = this.getTransactionLogsDataCB;
                    input.payload = input.payload.input;
                    input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                    break;
                }
            case 'getPersistenceObjectData':
                {
                    input.midpoint = input.payload.input.type == 'Dashboard' ? 'generic' : input.payload.input.groupType+'PersistentObjects';
                    input.callback = this.genericCallback;
                    input.payload = input.payload.input;
                    break;
                }
            case 'getTransactionInfo':
                {
                    input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                    input.midpoint = 'generic';
                    input.callback = this.getTransactionInfoCB;
                    break;
                }
            case 'getGroups':
                {
                    input.midpoint = input.payload.input.groupType ? input.payload.input.groupType : 'source';
                    input.callback = this.getGroupsCB;
                    if(input.payload.input)
                    input.payload.input.tenantId =  input.payload.input.tenantId ? input.payload.input.tenantId: undefined;
                    input.payload = input.payload.input;
                    break;
                }
            case 'getTotalGroups':
                {
                    input.midpoint = input.payload.groupType ? input.payload.groupType : 'source';
                    if(input.payload)
                    input.payload.tenantId =  input.payload.tenantId ? input.payload.tenantId: undefined;
                    input.callback = this.genericCallback;
                    break;
                }
            case 'createGroup':
                {
                    input.payload.input.applicationId = input.payload.input.category || '';
                    input.payload.input.tenantId = input.payload.input.tenantID || '';
                    input.midpoint = input.payload.input.groupType;
                    input.callback = this.genericCallback;
                    input.payload = input.payload.input;
                    input.payload.title = input.payload.name;
                    return input;
                }
            case 'createConfig':
            {
                input.midpoint = input.payload.input.configDataSourceCategory + 'Config';
                input.callback = this.createConfigCB;
                input.payload = input.payload.input;
                input.payload.title = input.payload.name;
                return input;
            }
            case 'getAllConfigs':
                {
                    input.midpoint = input.payload.groupType + 'Config';
                    input.callback = this.getAllConfigsCB;
                    break;
                }
            case 'deleteGroup':
            {
                input.midpoint = input.payload.groupType;
                input.callback = this.genericCallback;
                if(input.payload.input && (typeof input.payload.input == 'object'))
                input.payload = input.payload.input;
                break;
            }
            case 'getAllArchivedGroups':
            {
                input.midpoint = 'generic';
                input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                input.callback = this.getAllArchivedGroupsCB;
                break;
            }
            case 'restoreGroup':
            {
                input.midpoint = input.payload.groupType;
                input.callback = this.genericCallback;
                break;
            }
            case 'setConfigPriority':
            {
                input.midpoint = input.payload.input.groupType+'Config';
                input.callback = this.setConfigPriorityCB;
                if(input.payload.input && (typeof input.payload.input == 'object'))
                    input.payload = input.payload.input;
                break;
            }
            case 'getGroupDescription':
            {
                input.midpoint = input.payload.input.groupType;
                input.callback = this.genericCallback;
                input.payload = input.payload.input;
                break;
            }
            case 'setGroupDescription':
            {
                input.midpoint = input.payload.input.groupType;
                input.callback = this.genericCallback;
                input.payload = input.payload.input;
                break;
            }
            case 'getAllGroupsWithConfigs':
            {
                input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                input.midpoint = 'generic';
                input.callback = this.genericCallback;
                break;
            }
            case 'execCustomEndPoint':
            {
                input.midpoint = 'generic';
                input.callback = this.genericCallback;
                input.payload = input.payload.input;
                break;
            }
            case 'getAllMappingForTarget':
            {
                input.midpoint = 'generic';
                input.callback = this.genericCallback;
                input.payload = input.payload.input;
                break;
            }
            case 'saveCustomEndPoints':
            {
                input.midpoint = 'customEndPoints';
                input.callback = this.genericCallback;
                input.payload = input.payload.input;
                break;
            }
            case 'getCustomEndPoints':
            {
                input.midpoint = 'customEndPoints';
                input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                if(Object.keys(input.payload.query).length) {
                  if(input.payload.query.where.tenantId) {
                    input.payload.query.where.tenantId = input.payload.query.where.tenantId ? input.payload.query.where.tenantId : undefined;
                  }
                }
                input.callback = this.genericCallback;
                break;
            }
            case 'deleteCustomEndPoints':
            {
                input.midpoint = 'customEndPoints';
                input.callback = this.genericCallback;
                break;
            }
            case 'setGroupHostProperties':
            {
                input.midpoint = 'generic';
                input.endpoint = 'setGroupHostProperties';
                input.payload = input.payload.input;
                input.payload.socketHostConfig = input.payload.hostProperties;
                delete input.payload.socketHostConfig.result;
                input.callback = this.genericCallback;
                break;
            }
            case 'getGroupHostProperties':
            {
                input.midpoint = 'generic';
                input.endpoint = 'getGroupHostProperties';
                input.payload = input.payload.input;
                input.callback = this.genericCallback;
                break;
            }
            case 'getUploadWSDLS':
            {
                input.midpoint = 'generic';
                input.endpoint = 'getGroupHostProperties';
                input.payload = input.payload.input;
                input.callback = this.genericGetSoapCallback;
                break;
            }
            case 'updateWSDL':
            {
                input.midpoint = 'generic';
                input.endpoint = 'setGroupHostProperties';
                input.payload = input.payload.input;
                input.payload.hostProperties = input.payload.uploadedWSDLS;
                delete input.payload.uploadedWSDLS;
                input.callback = this.genericSetSoapCallback;
                break;
            }
            case 'getConfigInfo':
            {
                input.payload = input.payload.input;
                input.midpoint = 'generic';
                input.endpoint = 'getConfigInfo';
                input.callback = this.genericCallback;
                break;
            }
            case 'setConfigInfo':
            {
                input.payload = input.payload.input;
                input.midpoint = 'generic';
                input.endpoint = 'setConfigInfo';
                input.callback = this.genericCallback;
                break;
            }
            case 'getDBVersion':
            {
                input.payload = input.payload.input;
                input.midpoint = 'generic';
                input.endpoint = 'getDBVersion';
                input.callback = this.genericCallback;
                break;
            }
            case 'getPropValues':
            {
              if(input.payload.type === 'tenant') {
                input.midpoint = 'tenant';
                input.endpoint = 'getTenants';
                input.callback = this.genericTenantCB;
                input.payload.input.includeAll = input.payload.includeAll ? input.payload.includeAll : undefined;
                input.payload = input.payload.input;
                return input;
              }
            }
            case 'getDashboardStats':
            {
                input.payload = input.payload.input;
                input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                input.midpoint = 'generic';
                input.endpoint = 'getDashboardStats';
                input.callback = this.genericCallback;
                break;
            }
            case 'getDashboardMetrics':
            {
                input.payload = input.payload.input;
                input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                input.midpoint = 'generic';
                input.endpoint = 'getDashboardMetrics';
                input.callback = this.genericCallback;
                break;
            }
            case 'getTransactions':
            {
                input.payload = input.payload.input;
                input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                input.midpoint = 'generic';
                input.endpoint = 'getTransactions';
                input.callback = this.genericCallback;
                break;
            }
            case 'setPropValues':
            {
                input.payload = input.payload.input;
                input.payload.name = input.payload.tenantName;
                input.midpoint = 'tenant';
                input.endpoint = 'saveTenant';
                delete input.payload.tenantName;
                input.callback = this.genericCallback;
                return input;
            }
            case 'refreshMCCWithFlow':
            {
                input.midpoint = 'masterCreateContext';
                input.endpoint = 'refreshMCCWithFlow';
                input.callback = this.genericCallback;
                break;
            }
            case 'getAllAccessTokens':
            {   input.payload = input.payload.input;
                input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                if(input.payload.query) {
                    if (input.payload.query.where && Object.keys(input.payload.query.where).length) {
                        input.payload.query.where.groupType = input.payload.query.where.groupType ? input.payload.query.where.groupType : undefined;
                        input.payload.query.where.groupName = input.payload.query.where.groupName ? input.payload.query.where.groupName : undefined;
                    }
                }
                input.midpoint = 'apiUsers';
                input.endpoint = 'getApiKeys';
                input.callback = this.genericCallback;
                return input;
            }
            case 'generateAPIKey':
            {   input.payload = input.payload.input;
                input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                input.midpoint = 'apiUsers';
                input.endpoint = 'generateAPIKey';
                input.callback = this.genericCallback;
                break;
            }
            case 'getSopTemplates':
            {   input.payload = input.payload.input;
                input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                input.midpoint = 'sopTemplates';
                input.endpoint = 'getSopTemplates';
                input.callback = this.genericCallback;
                break;
            }
            case 'saveSopTemplate':
            {   input.payload = input.payload.input;
                input.midpoint = 'sopTemplates';
                input.endpoint = 'saveSopTemplate';
                input.callback = this.genericCallback;
                break;
            }
            case 'validateScriptForTemplate':
            {   input.payload = input.payload.input;
                input.midpoint = 'sopTemplates';
                input.endpoint = 'validateScriptForTemplate';
                input.callback = this.genericScriptCallback;
                break;
            }
            case 'getTemplatePreview':
            {   input.payload = input.payload.input;
                input.midpoint = 'sopTemplates';
                input.endpoint = 'getTemplatePreview';
                input.callback = this.genericCallback;
                break;
            }
            case 'triggerSopEvent':
            {   input.payload = input.payload.input;
                input.midpoint = 'sopTemplates';
                input.endpoint = 'triggerSopEvent';
                input.callback = this.genericCallback;
                break;
            }
            case 'deleteSopTemplate':
            {   input.payload = input.payload.input;
                input.midpoint = 'sopTemplates';
                input.endpoint = 'deleteSopTemplate';
                input.callback = this.genericCallback;
                break;
            }
            case 'getContextsList':
            {   input.payload = input.payload.input;
                input.midpoint = 'generic';
                input.endpoint = 'getContextsList';
                input.callback = this.genericCallback;
                break;
            }
        }
        return input;
    }

    genericTenantCB(response) {
        if (response.data && response.data) {
            response.data.tenantIDs = {};
            response.data.tenantIDs.arr = [];
            for(var i=0;i<response.data['result'].length;i++){
                response.data['result'][i].tenantName = response.data['result'][i].name;
                response.data['result'][i].executionMethod = response.data['result'][i].executionMethod;
                response.data['result'][i].status = response.data['result'][i].status;
                response.data.tenantIDs.arr.push(response.data['result'][i]);
            }

        }
        return response;

    }

    genericScriptCallback(response){
        if (response.data && response.data) {
            response.data.result = response.data['result'].value;
        }
        return response;
    }

    genericCallback(response){
        return response;
    }

    genericGetSoapCallback(response){
        if (response.data && response.data) {
            response.data.uploadedWSDLS = response.data['result']['hostProperties'];
            delete response.data['result'];
        }
        return response;
    }
    genericSetSoapCallback(response){
        if (response.data && response.data) {
            response.data.uploadedWSDLS = JSON.parse(response.data.hostProperties);
        }
        return response;
    }
    getTransactionInfoCB (response) {
        if(response.data){
            response.data.Mappings = {'Configs': response.data.mappings};
            response.data.Targets = {'Configs': response.data.target };
        }
        return response;
    }


    getTransactionLogsDataCB(response) {
        if (response.data['Result'] && response.data['Result']) {
            for (let res in response.data['Result']) {
                response.data['Result'][res].configType = response.data['Result'][res].groupType;
                response.data['Result'][res].errorORInfo = JSON.stringify(response.data['Result'][res].errorORInfo);
            }
        }
        return response;
    }

    getGroupsCB(response) {
        if (response.data && response.data) {
            for (let res in response.data['Groups']) {
                response.data['Groups'][res].Name = response.data['Groups'][res].name;
                response.data['Groups'][res].Description = response.data['Groups'][res].description;
            }
        }
        return response;
    }

    getAllConfigsCB(response) {
        if (response.data && response.data) {
            for (let res in response.data['Configs']) {
                response.data['Configs'][res].Name = response.data['Configs'][res].name;
                response.data['Configs'][res].Description = response.data['Configs'][res].description;
                response.data['Configs'][res].Group = response.data['Configs'][res].groupName;
                if (response.data['Configs'][res].canBeUsable !== undefined)
                    response.data['Configs'][res].CanBeUsable = response.data['Configs'][res].canBeUsable;
                if (response.data['Configs'][res].configJson !== undefined)
                    response.data['Configs'][res].ConfigJson = response.data['Configs'][res].configJson;
                if (response.data['Configs'][res].dataSourceType !== undefined)
                    response.data['Configs'][res].DataSourceType = response.data['Configs'][res].dataSourceType;
                if (response.data['Configs'][res].tenantId !== undefined)
                    response.data['Configs'][res].TenantId = response.data['Configs'][res].tenantId;
            }
        }
        return response;
    }

    getAllArchivedGroupsCB(response) {
        if (response.data && response.data) {
            for (let res in response.data['Groups']) {
                response.data['Groups'][res].Name = response.data['Groups'][res].name;
                response.data['Groups'][res].Description = response.data['Groups'][res].description;
            }
        }
        return response;
    }

    setConfigPriorityCB(response){
        if (response.data && response.data) {
            response.data.PriorityOrder = response.data.priorityOrder;
        }
        return response;
    }

    createConfigCB(response) {
        if (response.data && response.data) {
            response.data['result'].Name = response.data['result'].name;
            response.data['result'].Description = response.data['result'].description;
            response.data['result'].Group = response.data['result'].groupName;
            if (response.data['result'].canBeUsable !== undefined)
                response.data['result'].CanBeUsable = response.data['result'].canBeUsable;
            if (response.data['result'].configJson !== undefined)
                response.data['result'].ConfigJson = response.data['result'].configJson;
            if (response.data['result'].dataSourceType !== undefined)
                response.data['result'].DataSourceType = response.data['result'].dataSourceType;
        }

        return response;
    }
}

export default LGenericIEMasterConfig;
