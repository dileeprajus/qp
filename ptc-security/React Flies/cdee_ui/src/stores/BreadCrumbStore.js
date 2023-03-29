/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { observable } from 'mobx';


class BreadCrumbStore {
  constructor() {

  }

  @observable Bread_crumb_obj = {};
  @observable Bread_crumbs_arr = [];
  @observable current_crumb_name = '';

    // Push the breadcrumb items
  pushBreadCrumbsItem() {
    var count = 0;
    var obj = {
      name: this.Bread_crumb_obj.name,
      path: this.Bread_crumb_obj.path,
      groupName: this.Bread_crumb_obj.groupName, //group name and type will be used when redirect from mappinggroup viewDetails to dataSource(flex/soap/rest/static) in breadcrumb
      groupType: this.Bread_crumb_obj.groupType
    };
    this.current_crumb_name = obj.name;
    this.Bread_crumbs_arr.map(function (crumb) {
      if (crumb.name !== obj.name) {
        count = count + 1;
      }
    });
    if (count === this.Bread_crumbs_arr.length) {
      if (obj.name === 'TargetSystems' || obj.name === 'SourceSystems' || obj.name === 'MappingSystems' ||  obj.name === 'Settings' ||  obj.name === 'ArchivedGroups' || obj.name === 'LogsMonitoring') {
        this.Bread_crumbs_arr.length = 0;
        this.Bread_crumbs_arr.push(obj);
      } else if (obj.name === 'Dashboard') {
        this.Bread_crumbs_arr.length = 0;
      } else {
        this.Bread_crumbs_arr.push(obj);
      }
    } else this.popBreadCrumbsItem();
  }
  popBreadCrumbsItem() {
    var indexVal = this.getIndex(this.current_crumb_name,this.Bread_crumbs_arr);
    if (indexVal === -1) {
      this.Bread_crumbs_arr.length = 0;
    } else if (indexVal === 0) {
      this.Bread_crumbs_arr.length = 1;
    } else {
      if (indexVal !== this.Bread_crumbs_arr.length - 1) {
        for (var i = indexVal+1; i < this.Bread_crumbs_arr.length; i++) {
          this.Bread_crumbs_arr.pop();
        }
        this.Bread_crumbs_arr.length = indexVal;
      }
    }
  }
  setLoading(){
    ieGlobalVariable.loaderStore.turnon();
    setTimeout(() => {
      ieGlobalVariable.loaderStore.turnoff();
    }, 10000);
  }
  getIndex(value, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]['name'] === value) {
        return i;
      }
    }
    return -1; //to handle the case where the value doesn't exist
  }
  // This method is used to set values in the object
  setvalue(name, value) {
    this[name] = value;
  }
}

export default BreadCrumbStore;
