/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import React from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import FlexStore from '../../../stores/FlexStore';
import SocketStore from '../../../stores/SocketStore';
import SoapClientStore from '../../../stores/SoapClientStore';
import MappingStore from '../../../stores/MappingStore';
import GooglePubSubClientStore from '../../../stores/GooglePubSubClientStore';

@inject('validation_store', 'modal_store')
@observer
class GroupNew extends React.Component {
  constructor(props) {
    super(props);
    this.v_store = this.props.validation_store;
    this.generic_master_store = this.props.generic_master_store;
    this.modal_store = this.props.modal_store;
    this.flexstore = new FlexStore('GenericIEMasterConfig');
    this.soap_client_store = new SoapClientStore('GenericIEMasterConfig');
    this.socketStore = new SocketStore('GenericIEMasterConfig');
    this.mapping_store = new MappingStore('GenericIEMasterConfig');
    this.googlepubsubstore = new GooglePubSubClientStore('GenericIEMasterConfig');
    this.state = {
      custom_style: null,
      show_err_msg: false,
      show_warning_msg: true
    };
  }
  componentWillMount() {
    this.v_store.InitialState();
    this.generic_master_store.GetPropValues({ propertyArr: ['tenantIDs'] }, 'tenant');
  }
  onChange(event) {
    var tempEventText = event.target.value.replace(/^\s+|\s{3}$/gm,'');
    if(event.target.name === 'newGroupName') {
        var iChars = "!@#$%^&*()+=-[]\\\';,./ {}|\":_<>?";
    }else{
        var iChars = '';
    }
    for (var i = 0; i < tempEventText.length; i++) {
       if (iChars.indexOf(tempEventText.charAt(i)) != -1) {
         this.setState({show_specialchar_err_msg: true});
         return false;
       }
    }
    this.generic_master_store.setvalue(event.target.name, tempEventText);
    this.setState({ show_specialchar_err_msg: false });
    this.v_store.state.custom_store = this.generic_master_store;
    this.v_store.ValidateThingCreate('onchange');
    var totalGroupNames = this.generic_master_store.totalGroupNames;
    if (event.target.name === 'newGroupName') {
      if ((this.generic_master_store.newGroupName !== '' || totalGroupNames.indexOf((tempEventText).toUpperCase()) !== -1) && (tempEventText.length>2)) {
        this.setState({ show_err_msg: true });
      }else{
          this.setState({ show_err_msg: false });
      }
      if (tempEventText.length <= 2) {
        this.v_store.state.custom_name = null;
      }
    }
    if (event.target.name === 'newGroupDescription') {
      if (this.generic_master_store.newGroupDescription !== '' && tempEventText.length>2) {
        this.setState({ show_err_msg: true });
      }else{
          this.setState({ show_err_msg: false });
      }
      if (tempEventText.length <= 2) {
        this.v_store.state.custom_description = null;
      }
    }
    if (event.target.name === 'dataSourceType') {
      if (tempEventText !== 'Select DataSource Type') {
        this.setState({ show_err_msg: true });
      }
    }
    if (event.target.name === 'tenantID') {
      if(BACKEND === 'LoopBack') {
        if (totalGroupNames.length) {
          for (var i = 0; i < totalGroupNames.length; i++) {
            if ((totalGroupNames[i].split('-')[0] === this.generic_master_store.newGroupName.toUpperCase()) && (totalGroupNames[i].split('-')[1] === event.target.value.toUpperCase())) {
              this.setState({show_warning_msg: false});
              break;
            } else {
              this.setState({show_warning_msg: true});
            }
          }
        }else {
          this.setState({show_warning_msg: true});
        }
      }
    }
    if((this.generic_master_store.newGroupDescription && this.generic_master_store.newGroupDescription.length<3) || (this.generic_master_store.newGroupName && this.generic_master_store.newGroupName.length<3)){
        this.setState({ show_err_msg: false });
    }
    var temStore = this.generic_master_store;
    if (this.props.template === 'Mapping') {
      if (temStore.newGroupName === '' || temStore.newGroupDescription === '' || temStore.tenantID === '') {
        this.setState({ show_err_msg: false });
      }
    } else {
        if (temStore.newGroupName === '' || temStore.newGroupDescription === '' || temStore.dataSourceType === 'Select DataSource Type' || temStore.dataSourceType === '' || temStore.newGroupName.indexOf(' ') > -1 || temStore.tenantID === '') {
          this.setState({ show_err_msg: false });
        }
    }
  }
  handleSubmit() {
    this.v_store.state.custom_store = this.generic_master_store;
    const name = this.generic_master_store.newGroupName.length;
    const description = this.generic_master_store.newGroupDescription.length;
    if ((name > 1) && (description > 2)) {
      this.generic_master_store.createGroup(this.redirectToDataSource.bind(this), this.modal_store, );
      this.modal_store.modal.notification = true;
    } else {
      this.v_store.ValidateThingCreate('submit');
    }
  }
  redirectToDataSource() {
    if (this.props.template !== 'Mapping') {
      if (this.generic_master_store.dataSourceType === 'Rest') {
        this.props.history.push('/RestClient/'+this.generic_master_store.currentGroupName);
      } else if (this.generic_master_store.dataSourceType === 'Flex') {
        this.flexstore.setvalue('currentGroupName', this.generic_master_store.currentGroupName);
        this.flexstore.setvalue('groupHostProperties', {});
        this.flexstore.getGroupHostProperties();
        this.props.history.push('/Groups/FlexEdit/'+this.generic_master_store.currentGroupName);
      } else if (this.generic_master_store.dataSourceType === 'Static') {
        this.props.history.push('/StaticFileClient/'+this.generic_master_store.currentGroupName);
      } else if (this.generic_master_store.dataSourceType === 'Soap') {
        this.soap_client_store.setvalue('currentGroupName', this.generic_master_store.currentGroupName);
        this.props.history.push('/Groups/SoapEdit/'+this.generic_master_store.currentGroupName);
      } else if (this.generic_master_store.dataSourceType === 'Socket') {
        this.soap_client_store.setvalue('currentGroupName', this.generic_master_store.currentGroupName);
        this.props.history.push('/Groups/SocketEdit/'+this.generic_master_store.currentGroupName);
      } else if (this.generic_master_store.dataSourceType === 'DataBase') {
        this.soap_client_store.setvalue('currentGroupName', this.generic_master_store.currentGroupName);
        this.props.history.push('/Groups/DataBaseEdit/'+this.generic_master_store.currentGroupName);
      }else if (this.generic_master_store.dataSourceType === 'FTP') {
        this.soap_client_store.setvalue('currentGroupName', this.generic_master_store.currentGroupName);
        this.props.history.push('/Groups/FTPEdit/'+this.generic_master_store.currentGroupName);
    }else if (this.generic_master_store.dataSourceType === 'Google Pub/Sub') {
      this.soap_client_store.setvalue('currentGroupName', this.generic_master_store.currentGroupName);
      this.props.history.push('/Groups/GooglePubSubEdit/'+this.generic_master_store.currentGroupName);
    }else {}
    } else {
      this.props.history.push('/Mapping/'+this.generic_master_store.currentGroupName);
      this.mapping_store.setvalue('currentTenantID', this.generic_master_store)

    }
    this.generic_master_store.setvalue('dataSourceType', '');
  }
  returnList(optionsArr) {
    var list = [];
    for (var i = 0; i < optionsArr.length; i++) {
      list.push(
        <option key={optionsArr[i]} value={optionsArr[i]}>{optionsArr[i]}</option>
      );
    }
    return list;
  }
  returnSourceList(optionsArr) {
    var list = [];
    for (var i = 0; i < optionsArr.length; i++) {
      list.push(
        <option key={optionsArr[i]} value={optionsArr[i]}>{optionsArr[i] === 'Flex' ? 'FlexPLM': optionsArr[i]}</option>
      );
    }
    return list;
  }
  render() {
    var tenantIDList = [];
    tenantIDList = this.returnList(this.generic_master_store.tenantIDsArr);

    var optionsArr = [];
    if(this.generic_master_store.groupType==='target') {
      optionsArr = ['Flex', 'Soap', 'Rest', 'FTP', 'Google Pub/Sub'];
    }else {
      optionsArr = ['Flex', 'Soap', 'Rest', 'Static', 'FTP', 'Google Pub/Sub'];
    }
    var list = this.returnSourceList(optionsArr);
    const totalGroupNames = this.generic_master_store.totalGroupNames;
      return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup validationState={
             this.state.show_specialchar_err_msg || (BACKEND === 'LoopBack' ? !this.state.show_warning_msg : totalGroupNames.indexOf((this.generic_master_store.newGroupName).toUpperCase()) !== -1) ? 'warning' : this.v_store.state.custom_name
          }>
            <FormControl
              type="text" placeholder="Name" name="newGroupName"
              value={this.generic_master_store.newGroupName}
              onChange={this.onChange.bind(this)}
            />
            <FormControl.Feedback />
            <span hidden={!this.state.show_specialchar_err_msg} style={{ color: '#F4BA41' }}>Special Characters and Spaces are not allowed</span>
            <span hidden={BACKEND === 'LoopBack' ? this.state.show_warning_msg : totalGroupNames.indexOf((this.generic_master_store.newGroupName).toUpperCase()) === -1} style={{ color: '#F4BA41' }}>A group with this name already exists. Use a different name.</span>
          </FormGroup>
          <FormGroup  validationState={this.v_store.state.custom_description} >
            <FormControl
              componentClass="textarea" style={{ resize: 'none' }} placeholder="Description" name="newGroupDescription"
              value={this.generic_master_store.newGroupDescription} onChange={this.onChange.bind(this)}
            />
          <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="formControlsSelect" hidden={this.props.template === 'Mapping'}>
            <FormControl
              componentClass="select" placeholder="Select DataSource Type" name="dataSourceType"
              onChange={this.onChange.bind(this)} value={this.generic_master_store.dataSourceType}
            >
              <option value="Select DataSource Type">Select DataSource type</option>
              {list}
            </FormControl>
          </FormGroup>
          <FormGroup controlId="formControlsSelect">
            <FormControl
              componentClass="text" placeholder="Select TenantID" name="tenantID"
              onChange={this.onChange.bind(this)} value={this.generic_master_store.tenantID}
            >PTC
            </FormControl>
          </FormGroup>
          <Button
            bsStyle="primary" onClick={this.handleSubmit.bind(this)} block
            disabled={(/^\d+$/.test(this.generic_master_store.newGroupName))||!this.state.show_err_msg || !(BACKEND === 'LoopBack' ? this.state.show_warning_msg : totalGroupNames.indexOf((this.generic_master_store.newGroupName).toUpperCase()) === -1)
              || (this.generic_master_store.dataSourceType === '' && this.props.template !== 'Mapping')}
          >Create</Button>
        </form>
      </div>
    );
  }
}

GroupNew.propTypes = {
  store: React.PropTypes.object
};

export default GroupNew;
