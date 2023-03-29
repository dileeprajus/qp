/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { observable, action } from 'mobx';


class ModalStore {
  constructor() {
  }

  @observable modal = {
    modal_title: 'Modal Title',
    show: false,
    body: null,
    show_msg: false,
    check_inputs: true,
    hide_create_div: true,
    generic_show: false,
    groupName: '',
    tableName: '',
    isHardDelete: false,
    configName: '',
    groupType:'',
    schedulerConfigName: '',
    selectedScriptIndex: -1,

    show_alert: false,
    show_alert_msg: '',
    show_alert_style: '',
    notification: false,
    save_btn_dsbld: true,
    disable_endpt_btn: false,
    test_script_btn_dsbld: true,
    serviceName: '',
    tenantID: '',
    tenantIDIndex: '',
    modalBtnTxt: '',
    saveBtnMsg: true,
    grpDescEnableBtn:false,
    selectedTenantID:''
  };
  @observable inputValues='';
  @action showModal(body) {
    this.modal.show = true;
    this.modal.body = body;
  }
  @action closeModal() {
    this.modal.generic_show = false;
    this.modal.show = false;
    this.modal.body = null;
  }
   @action setTimeOut() {
     setTimeout(function () {
      this.modal.show_alert = false;
     }.bind(this), 3000);
   }
}

export default ModalStore;
