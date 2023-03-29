/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
class LWeeklySchedulerConfig {
    formatPayload(input) {
        switch (input.endpoint) {
            case 'getScheduleConfigName':
            {
                input.midpoint = 'schedulerConfig';
                input.callback = this.getScheduleConfigNameCB;
                input.payload = input.payload.input;
                break;
            }
            case 'getAllConfigs':
            {
                input.midpoint = 'schedulerConfig';
                input.callback = this.getAllConfigsCB;
                break;
            }
            case 'pushConfigNamesToArr':
            {
                input.midpoint = 'schedulerConfig';
                input.callback = this.pushConfigNamesToArrCB;
                input.payload = input.payload.input;
                break;
            }
        }
        return input;
    }

    getScheduleConfigNameCB(response) {
        if(response.data) {
            response.data['schedule_config'] = response.data;
        }
        return response;
    }

    getAllConfigsCB(response) {
        if(response.data) {
            response.data['Configs'] = response.data;
            for (let res in response.data['Configs']) {
                response.data['Configs'][res].Name = response.data['Configs'][res].name;
                response.data['Configs'][res].Description = response.data['Configs'][res].description;
                response.data['Configs'][res].Group = response.data['Configs'][res].groupName;
                response.data['Configs'][res]['ConfigNames'] = {};
                response.data['Configs'][res]['ConfigNames']['Configs'] = response.data['Configs'][res].configs;
            }
        }
        return response;
    }

    pushConfigNamesToArrCB(response) {
        if(response.data) {
            response.data['Configs'] = response.data;
        }
        return response;
    }
}

export default LWeeklySchedulerConfig;
