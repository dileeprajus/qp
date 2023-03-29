/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { observable, action } from 'mobx';

class LoaderStore {
  @observable showLoader = [];

  @action turnon() {
    this.showLoader.push(true);
  }

  @action turnoff() {
    this.showLoader.pop();
  }
}

export default LoaderStore;
