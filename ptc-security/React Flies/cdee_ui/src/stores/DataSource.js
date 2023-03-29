/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { observable, computed, action } from 'mobx';

class DataSource {
  name = 'Datasources';
  description = 'This is used to get datasources by typename';
  @observable list = {};

  @computed get flex_things() {
    return this.numClicks % 2 === 0 ? 'even' : 'odd';
  }

  @action clickButton() {
    this.numClicks++;
  }
}

export default DataSource;
