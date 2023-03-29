/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
class LTypeManagerConfig {
    formatPayload(input) {
        switch (input.endpoint) {
            case 'getFilterScripts':
                {
                    input.midpoint = 'conversionScripts';
                    input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                    input.callback = this.genericCallback;
                    break;
                }
            case 'getDataTypes':
                {
                    input.payload.tenantId = input.payload.tenantId ? input.payload.tenantId : undefined;
                    input.midpoint = 'dataTypes';
                    input.callback = this.dataTypesCB;
                    break;
                }
            case 'setPropValues':
                {
                    if (input.payload.type && input.payload.type === 'DataTypes') {
                        input.midpoint = 'dataTypes';
                        input.callback = this.setPropValuesCB;
                        var payload;
                        for (var key in input.payload.modifiedObj) {
                            input.payload.modifiedObj[key].mappedTo = input.payload.modifiedObj[key].can_map_to;
                            payload = input.payload.modifiedObj[key];
                            payload.name = key;
                        }
                        input.payload = payload;
                    } else if (input.payload.type && input.payload.type === 'FilterScripts') {
                        input.midpoint = 'conversionScripts';
                        input.callback = this.setconversionScriptsCB;
                        input.payload.modifiedObj.tenantId = input.payload.tenantId
                        input.payload = input.payload.modifiedObj;
                    }
                    break;
                }
            case 'deleteFilterScripts':
                {
                    input.midpoint = 'conversionScripts';
                    input.callback = this.deleteFilterScriptsCB;
                    if(input.payload.input && (typeof input.payload.input == 'object'))
                    input.payload = input.payload.input;
                    break;
                }
            case 'testScript':
                {
                    input.midpoint = 'conversionScripts';
                    input.callback = this.genericCallback;
                    break;
                }
        }

        return input;
    }

    setPropValuesCB(response) {
        if (response) {
            response.data_types = response;
        }
        return response;
    }

    dataTypesCB(response) {
        if (response.data) {
            for (let res in response.data) {
                response.data[res].can_map_to = response.data[res].mappedTo;
            }
        }
        return response;
    }

    genericCallback(response) {
        return response;
    }

    deleteFilterScriptsCB(response) {
        return response;
    }

    setconversionScriptsCB(response) {
        if (response) {
            response.filter_scripts = response;
        }
        return response;
    }
}

export default LTypeManagerConfig;
