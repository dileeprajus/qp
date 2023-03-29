/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import ThingWorx from './Thingworx';
import LoopBack from './LoopBack';

// TODO: We need a conditional load in the dist level using webpack. But for now we are loading two js classes and assigning only one based on condition. which works for now but not a good solution.
let BackendServer = ThingWorx;

try {
    if (BACKEND === 'LoopBack') {
        BackendServer = LoopBack;
    }
}
catch (err) {
   console.log('BACKEND must be defined'+err); // eslint-disable-line no-console
}

export default BackendServer;
