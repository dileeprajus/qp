/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
class LStaticFileConfig {
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
                    input.callback = this.createConfigCB;
                    input.payload = input.payload.input;
                    input.payload.title = input.payload.name;
                    return input;
                }
            case 'deleteConfig':
                {
                    input.midpoint = input.payload.groupType + 'Config';
                    input.callback = this.getAllConfigsCB;
                    break;
                }
            case 'createTrigger':
            {
                input.midpoint = 'generic';
                input.callback = this.createTriggerCB;
                input.payload = input.payload.input;
                input.endpoint = 'createTrigger';
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
        }

        return input;
    }

    getAllConfigsCB(response) {
        if (response.data && response.data) {
            for (let res in response.data['Configs']) {
                response.data['Configs'][res].Name = response.data['Configs'][res].name;
                response.data['Configs'][res].Description = response.data['Configs'][res].description;
                response.data['Configs'][res].Group = response.data['Configs'][res].groupName;
                response.data['Configs'][res].PriorityOrder = response.data['Configs'][res].priorityOrder;
                if (response.data['Configs'][res].canBeUsable !== undefined)
                    response.data['Configs'][res].CanBeUsable = response.data['Configs'][res].canBeUsable;
                if (response.data['Configs'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 ][res].configJson !== undefined)
                    response.data['Configs'][res].ConfigJson = response.data['Configs'][res].configJson;
                if (response.data['Configs'][res].dataSourceType !== undefined)
                    response.data['Configs'][res].DataSourceType = response.data['Configs'][res].dataSourceType;
                if (response.data['Configs'][res].selectedSourceType !== undefined)
                    response.data['Configs'][res].SelectedSourceType = response.data['Configs'][res].selectedSourceType;
                if (response.data['Configs'][res].selectedTargetType !== undefined)
                    response.data['Configs'][res].SelectedTargetType = response.data['Configs'][res].selectedTargetType;
            }
        }
        return response;
    }

    genericCallback(response) {
        return response;
    }

    createTriggerCB(response) {
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

export default LStaticFileConfig;
