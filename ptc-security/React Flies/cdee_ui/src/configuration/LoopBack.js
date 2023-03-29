/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/*global SERVER_APP_KEY, SERVER_BASE_URL*/
import axios from 'axios';
import LGenericIEMasterConfig from './loopbackConfig/LGenericIEMasterConfig';
import LTypeManagerConfig from './loopbackConfig/LTypeManagerConfig';
import LRestConfig from './loopbackConfig/LRestConfig';
import LFlexConfig from './loopbackConfig/LFlexConfig';
import LDynamicMidPoint from './loopbackConfig/LDynamicMidPoint';
import LWeeklySchedulerConfig from './loopbackConfig/LWeeklySchedulerConfig';
import LMappingConfig from './loopbackConfig/LMappingConfig';
import LSocketConfig from './loopbackConfig/LSocketConfig'
import LStaticFileConfig from './loopbackConfig/LStaticFileConfig';
import LSoapConfig from './loopbackConfig/LSoapConfig';
import LDatabBaseConfig from './loopbackConfig/LDataBaseConfig';


class LoopBack {

    getHeaders(headers = {}) {
        let default_headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };

        // If headers is null or empty then it has to be an object
        if (headers !== null && typeof headers === 'object') {} else {
            headers = {};
        }

        // Add or override default header properties
        for (var property in default_headers) {
            if (default_headers.hasOwnProperty(property)) {
                headers[property] = default_headers[property];
            }
        }
        return headers;
    }

    getQueryParamsString(queryparams) {
        let queryString = '?access_token='.concat(SERVER_APP_KEY);
        if (queryparams !== null && typeof queryparams === 'object') {
            for (var property in queryparams) {
                if (queryparams.hasOwnProperty(property)) {
                    queryString.concat('&', property, '=', JSON.stringify(queryparams[property]));
                }
            }
        }
        return queryString;
    }

    get_mid_url(midname, headers) {
        return axios.create({
            baseURL: SERVER_BASE_URL.concat('/api/v1/', midname),
            headers: this.getHeaders(headers)
        });
    }

    getCamelcase(value) {
        return value[0].toLowerCase() + value.substr(1, value.length);
    }

    getUppercase(value) {
        return value[0].toUpperCase() + value.substr(1, value.length);
    }

    api_call(input) {
        let formatted = input;
        formatted.endpoint = this.getCamelcase(formatted.endpoint);
        switch (formatted.midpoint) {
            case 'GenericIEMasterConfig':
                formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                break;
            case 'TypeManagerConfig':
                formatted = new LTypeManagerConfig().formatPayload(formatted);
                break;
            case 'RestConfig':
                formatted = new LRestConfig().formatPayload(formatted);
                break;
            case 'FlexConfig':
                formatted = new LFlexConfig().formatPayload(formatted);
                break;
            case 'DailySchedulerConfig':
            case 'FiveMinuteSchedulerConfig':
            case 'HourlySchedulerConfig':
            case 'WeeklySchedulerConfig':
            case 'MinuteSchedulerConfig':
            case 'FifteenMinuteSchedulerConfig':
                formatted = new LWeeklySchedulerConfig().formatPayload(formatted);
                break;
            case 'MappingConfig':
                formatted = new LMappingConfig().formatPayload(formatted);
                break;
            case 'SocketConfig':
                formatted = new LSocketConfig().formatPayload(formatted);
                break;
            case 'StaticFileConfig':
                formatted = new LStaticFileConfig().formatPayload(formatted);
                break;
            case 'SoapConfig':
                formatted = new LSoapConfig().formatPayload(formatted);
                break;
            case 'DataBaseConfig':
                formatted = new LDatabBaseConfig().formatPayload(formatted);
                break;

            default:
                {
                    switch (formatted.endpoint) {
                        case 'getBasicConfigInfo':
                            formatted = new LDynamicMidPoint().getBasicConfigInfo(formatted);
                            break;
                        case 'getPropValues':
                            formatted = new LDynamicMidPoint().getPropValues(formatted);
                            break;
                        case 'setPropValues':
                            formatted = new LDynamicMidPoint().setPropValues(formatted);
                            break;
                        case 'testApi':
                            formatted = new LDynamicMidPoint().testApi(formatted);
                            break;
                        case 'testApiXML':
                            formatted = new LDynamicMidPoint().testApi(formatted);
                            break;
                        case 'testApiCSV':
                            formatted = new LDynamicMidPoint().testApi(formatted);
                            break;
                        case 'fetchSchemaUsingConfigJson':
                            formatted = new LDynamicMidPoint().fetchSchemaUsingConfigJson(formatted);
                            break;
                        case 'getAllConfigs':
                            formatted = new LRestConfig().formatPayload(formatted);
                            break;
                        case 'getSchemaFromJson':
                            formatted = new LDynamicMidPoint().getSchemaFromJson(formatted);
                            break;
                        case 'testAPIWithRequestVars':
                            formatted = new LDynamicMidPoint().testAPIWithRequestVars(formatted);
                            break;
                        case 'getConfigInfo':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'setConfigInfo':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getAllGroupsWithConfigs':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'execCustomEndPoint':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getAllMappingForTarget':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'saveCustomEndPoints':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'deleteCustomEndPoints':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getCustomEndPoints':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'testCustomAuth':
                            formatted = new LDynamicMidPoint().testCustomAuth(formatted);
                            break;
                        case 'executeCustomAuth':
                            formatted = new LDynamicMidPoint().testCustomAuth(formatted);
                            break;
                        case 'testStaticData':
                            formatted = new LDynamicMidPoint().testStaticData(formatted);
                            break;
                        case 'createTrigger':
                            formatted = new LStaticFileConfig().formatPayload(formatted);
                            break;
                        case 'getDBVersion':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getWSDLFromURL':
                            formatted = new LMappingConfig().formatPayload(formatted);
                            break;
                        case 'getUploadWSDLS':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'updateWSDL':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getWSDLMetaInfo':
                            formatted = new LMappingConfig().formatPayload(formatted);
                            break;
                        case 'getXSDForSoapEndPoint':
                            formatted = new LMappingConfig().formatPayload(formatted);
                            break;
                        case 'xSDToJson':
                            formatted = new LMappingConfig().formatPayload(formatted);
                            break;
                        case 'getDashboardStats':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getDashboardMetrics':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getTransactions':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getTransactionLogsData':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'setApplicationID':
                            formatted = new LDynamicMidPoint().setApplicationID(formatted);
                            break;
                        case 'getApplicationIDs':
                            formatted = new LDynamicMidPoint().getApplicationIDs(formatted);
                            break;
                        case 'deleteApplicationIDs':
                            formatted = new LDynamicMidPoint().deleteApplicationIDs(formatted);
                            break;
                        case 'refreshMCCWithFlow':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getTotalConfigs':
                            formatted = new LDynamicMidPoint().getTotalConfigs(formatted);
                            break;
                        case 'testDBApi':
                            formatted = new LDynamicMidPoint().testDBApi(formatted);
                            break;
                        case 'getAllAccessTokens':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                         case 'generateAPIKey':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getSopTemplates':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'saveSopTemplate':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'validateScriptForTemplate':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getTemplatePreview':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'triggerSopEvent':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'deleteSopTemplate':
                            formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                            break;
                        case 'getContextsList':
                          formatted = new LGenericIEMasterConfig().formatPayload(formatted);
                          break;
                }
            }
        }
        let {
            midpoint,
            endpoint,
            payload,
            queryparams,
            headers
        } = formatted;
        let genericAPI = this.get_mid_url(midpoint, headers);
        let queryParamString = this.getQueryParamsString(queryparams);
        return new Promise(function (resolve, reject) {
            genericAPI.post(endpoint + queryParamString, payload)
                .then(function (response) {
                    resolve(formatted.callback(response));
                })
                .catch(function (error) {
                    reject(error);
                });
        });
    }
}

export default LoopBack;
