/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
class LMappingConfig {
    formatPayload(input) {
        switch (input.endpoint) {
            case 'getAllConfigs':
                {
                    input.midpoint = input.payload.groupType + 'Config';
                    input.callback = this.getAllConfigsCB;
                    break;
                }
            case 'getTotalConfigs':
                {
                    input.midpoint = input.payload.groupType + 'Config';
                    input.callback = this.genericCallback;
                    input.endpoint = 'getTotalConfigs';
                    break;
                }
            case 'createConfig':
                {
                    input.midpoint = input.payload.input.configDataSourceCategory + 'Config';
                    input.callback = this.genericCallback;
                    input.payload = input.payload.input;
                    input.payload.name = input.payload.selectedSourceGroupName+'-'+input.payload.selectedSourceConfigName+'--'+input.payload.selectedTargetGroupName+'-'+input.payload.selectedTargetConfigName
                    return input;
                }
            case 'customTransformer':
                {
                    input.midpoint = 'generic';
                    input.callback = this.customTransformerCB;
                    input.payload = {
                        inputJson: input.payload.InputJson,
                        specJson:input.payload.SpecJson.Spec,
                        tenantId:input.payload.tenantId
                    };
                    break;
                }
            case 'deleteConfig':
                {
                    input.midpoint = input.payload.groupType + 'Config';
                    input.callback = this.getAllConfigsCB;
                    break;
                }
            case 'getAllMCCData':
                {
                    input.midpoint = 'masterCreateContext';
                    input.endpoint = 'getAllMCCData';
                    input.payload = input.payload.input;
                    input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                    input.callback = this.genericCallback;
                    break;
                }
            case 'getSchemaFromJson':
                {
                    input.midpoint = 'generic';
                    input.callback = this.genericCallback;
                    break;
                }
            case 'getConfigInfo':
            {
                input.midpoint = 'generic';
                input.endpoint = 'getConfigInfo';
                input.payload = input.payload.input;
                input.callback = this.genericCallback;
                break;
            }
            case 'setConfigInfo':
            {
                input.midpoint = 'generic';
                input.endpoint = 'setConfigInfo';
                input.payload = input.payload.input;
                input.callback = this.genericCallback;
                break;
            }
            case 'getWSDLMetaInfo':
            {
                input.midpoint = 'generic';
                input.endpoint = 'getWSDLMetaInfo';
                input.callback = this.genericCallback;
                break;
            }
            case 'getXSDForSoapEndPoint':
            {
                input.midpoint = 'generic';
                input.endpoint = 'getXSDForSoapEndPoint';
                input.callback = this.genericCallback;
                break;
            }
            case 'xSDToJson':
            {
                input.midpoint = 'generic';
                input.endpoint = 'getJsonFromXsd';
                input.callback = this.genericCallback;
                break;
            }
            case 'getWSDLFromURL':
            {
                input.midpoint = 'generic';
                input.endpoint = 'getSoapDataFromURL';
                input.payload = input.payload.AuthJson;
                input.callback = this.genericCallback;
                break;
            }
        }

        return input;
    }

    getAllConfigsCB(response) {
        if (response.data && response.data) {
            for (let res in response.data['Configs']) {
                response.data['Configs'][res].Name = response.data['Configs'][res].name;
                response.data['Configs'][res].Description = response.data['Configs'][res].description;
                response.data['Configs'][res].Group = response.data['Configs'][res].groupName;
                response.data['Configs'][res].Title = response.data['Configs'][res].title;
                response.data['Configs'][res].PriorityOrder = response.data['Configs'][res].priorityOrder;
                if (response.data['Configs'][res].canBeUsable !== undefined)
                    response.data['Configs'][res].CanBeUsable = response.data['Configs'][res].canBeUsable;
                if (response.data['Configs'][res].configJson !== undefined)
                    response.data['Configs'][res].ConfigJson = response.data['Configs'][res].configJson;
                if (response.data['Configs'][res].dataSourceType !== undefined)
                    response.data['Configs'][res].DataSourceType = response.data['Configs'][res].dataSourceType;
                if (response.data['Configs'][res].selectedSourceType !== undefined)
                    response.data['Configs'][res].SelectedSourceType = response.data['Configs'][res].selectedSourceType;
                if (response.data['Configs'][res].selectedTargetType !== undefined)
                    response.data['Configs'][res].SelectedTargetType = response.data['Configs'][res].selectedTargetType;
                if (response.data['Configs'][res].tenantId !== undefined)
                    response.data['Configs'][res].TenantId = response.data['Configs'][res].tenantId;
            }
        }
        return response;
    }

    genericCallback(response) {
        return response;
    }

    customTransformerCB(response) {
        return response;
    }

}

export default LMappingConfig;
