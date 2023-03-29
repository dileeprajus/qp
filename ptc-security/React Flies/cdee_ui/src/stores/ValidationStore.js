/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { observable } from 'mobx';

class ValidationStore {
  constructor() {
  }
  @observable state = {
    custom_store: '',
    custom_name: null,
    custom_description: null,
    custom_delimeter: null,
    custom_data_content: null,
    show_err_name_msg:false,
    show_err_desc_msg:false,
    show_err_deli_msg:false,
    show_err_data_content_msg:false
  };
  InitialState() {
    this.state.custom_name = null;
    this.state.custom_description = null;
    this.state.custom_delimeter = null;
    this.state.custom_data_content = null;
    this.state.show_err_name_msg = false;
    this.state.show_err_desc_msg = false;
    this.state.show_err_deli_msg = false;
    this.state.show_err_data_content_msg = false;
  }

  ValidateThingCreate(functionType) {
    var name,description;
      if((this.state.custom_store.groupType === 'source') || (this.state.custom_store.groupType === 'target') || (this.state.custom_store.groupType === 'mapping')) {
         name = this.state.custom_store.newGroupName.length;
         description = this.state.custom_store.newGroupDescription.length;
      }else {
         name = this.state.custom_store.new_config_name.length;
         description = this.state.custom_store.new_config_description.length;
      }
      if (functionType === 'submit') {
        if (name <= 1){
          this.state.custom_name = 'error';
          this.state.show_err_name_msg = true;
        }if (description <= 2){
          this.state.custom_description = 'error';
          this.state.show_err_desc_msg = true;
        }
      }if (functionType === 'onchange') {
        if(name > 2){
          this.state.custom_name = 'success';
          this.state.show_err_name_msg = false;
        }if(description > 2){
          this.state.custom_description = 'success';
          this.state.show_err_desc_msg = false;
        }
      }
  }


  StaticNewThingValidation(functionType) {
    const name = this.state.custom_store.new_config_name.length;
    const description = this.state.custom_store.new_config_description.length;
    if (functionType === 'submit') {
      if (name <= 1) {
        this.state.custom_name = 'error';
        this.state.show_err_name_msg = true;
      }
      if (description <= 2) {
        this.state.custom_description = 'error';
        this.state.show_err_desc_msg = true;
      }
    }
    if (functionType === 'onchange') {
      if (name > 2) {
        this.state.custom_name = 'success';
        this.state.show_err_name_msg = false;
      }
      if (description > 2) {
        this.state.custom_description = 'success';
        this.state.show_err_desc_msg = false;
      }
    }
  }

}

export default ValidationStore;
