/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
class LFlexConfig {
    formatPayload(input) {
        switch (input.endpoint) {
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
        }

        return input;
    }

    genericCallback(response){
        return response;
    }
}

export default LFlexConfig;
