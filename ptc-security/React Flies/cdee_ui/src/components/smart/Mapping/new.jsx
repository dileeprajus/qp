/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { ControlLabel, Button, FormGroup, FormControl } from 'react-bootstrap';

@inject('validation_store', 'generic_master_store', 'modal_store')
@observer
class MappingThingNew extends React.Component {
  constructor(props) {
    super(props);
    this.modal_store = this.props.modal_store;
    this.state = {
      show_err_msg: false,
      selectedTargetName: '',
      selectedTargetStoreName: '',
      selectedTargetGroupName: '',

      selectedSourceName: '',
      selectedSourceStoreName: '',
      selectedSourceGroupName: '',
      show_specialchar_err_msg: false

    };
  }

  componentWillMount() {
    this.props.mapping_store.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.props.mapping_store.setvalue('newConfigTitle', '');
    this.props.mapping_store.setvalue('new_config_description', '');
  }

  onTextChange(event) {
    var tempEventText = event.target.value.replace(/^\s+|\s{3}$/gm,'');
    if (event.target.name === 'newConfigTitle') {
      var iChars = "!@#$%^&*()+=-[]\\\';,./ {}|\":_<>?";
    } else {
      var iChars = '';
    }
    for (var i = 0; i < event.target.value.length; i++) {
      if (iChars.indexOf(event.target.value.charAt(i)) != -1) {
        this.setState({ show_specialchar_err_msg: true });
        return false;
      }
    }
    this.props.mapping_store.setvalue(event.target.name, tempEventText);
    this.setState({ show_specialchar_err_msg: false });
    if (event.target.name === 'new_config_name') {
      if (this.props.mapping_store.config_names.indexOf(tempEventText) !== -1) {
        this.setState({ show_err_msg: true });
      } else this.setState({ show_err_msg: false });
    }
  }

  // TODO: CanbeUsable true and false based on that we must allow user to go further
  onOptionSelect(thingWhat, event) {
    var tmpName = this.props.mapping_store.new_config_name;
    var tempArr = [];
    tempArr = (event.target.value).split(',');
    if (thingWhat === 'SourceConfig') {
      this.setState({
        selectedSourceName: tempArr[0],
        selectedSourceGroupName: tempArr[1],
        selectedSourceStoreName: event.target.options[event.target.selectedIndex].dataset.store
      });
      var tempTargetName = (tempArr[0] === this.state.selectedTargetName) ? '' : this.state.selectedTargetName;
      this.setState({ selectedTargetName: tempTargetName });
      tmpName = tempArr[0] + '-' + tempTargetName;
    } else if (thingWhat === 'TargetConfig') {
      this.setState({
        selectedTargetName: tempArr[0],
        selectedTargetGroupName: tempArr[1],
        selectedTargetStoreName: event.target.options[event.target.selectedIndex].dataset.store
      });
      tmpName = this.state.selectedSourceName + '-' + tempArr[0];
    } else {
    }
    this.props.mapping_store.setvalue('new_config_name', tmpName);
    var newName = this.props.mapping_store.currentGroupName + '-' + this.props.mapping_store.new_config_name;
    if (this.props.mapping_store.config_names.indexOf(newName) !== -1) {
      this.setState({ show_err_msg: true });
    } else this.setState({ show_err_msg: false });
  }

  goToMappingConfigPage() {
    var sourceObj = this.props.generic_master_store.returnSelectedObject('source', this.state.selectedSourceName, this.state.selectedSourceGroupName);
    var targetObj = this.props.generic_master_store.returnSelectedObject('target', this.state.selectedTargetName, this.state.selectedTargetGroupName);
    var mapping_config = this.props.mapping_store.configJson;
    mapping_config['SourceConfig']['Name'] = this.state.selectedSourceName;
    mapping_config['SourceConfig']['StoreName'] = this.state.selectedSourceStoreName;
    mapping_config['SourceConfig']['GroupName'] = sourceObj.Group;
    mapping_config['SourceConfig']['Type'] = sourceObj.DataSourceType;
    mapping_config['TargetConfig']['Name'] = this.state.selectedTargetName;
    mapping_config['TargetConfig']['StoreName'] = this.state.selectedTargetStoreName;
    mapping_config['TargetConfig']['GroupName'] = targetObj.Group;
    mapping_config['TargetConfig']['Type'] = targetObj.DataSourceType;
    this.props.mapping_store.setvalue(this.props.mapping_store.configJson, mapping_config);
    this.props.mapping_store.CreateConfig(this.props.generic_master_store, this.redirectToEdit.bind(this), this.createConfigAlert.bind(this));

    this.props.modalClose();
  }
  redirectToEdit() {
      if(BACKEND === 'LoopBack') {
          this.props.history.push('/Mapping/'+this.props.match.params.groupName);
      } else {
          this.props.history.push('/'+this.props.url.split('/')[1] + '/Edit/' + this.props.generic_master_store.currentGroupName + '-' + this.state.selectedSourceName + '-' + this.state.selectedTargetName);
      }
  }
  createConfigAlert() {
    this.modal_store.modal.notification = true;
    this.setState({
      selectedSourceName: '',
      selectedSourceStoreName: '',
      selectedTargetName: '',
      selectedTargetStoreName: ''
    });
  }

  render() {
    var TargetSelectMenu = [];
    var SourceSelectMenu = [];
    this.props.generic_master_store.TargetConfigs.map(targetConfig => {
      var tempVal1 = '';
      if(BACKEND === 'LoopBack') {
        tempVal1 = targetConfig.TenantId + ' - ' + targetConfig.DataSourceType + ' - ' + targetConfig.Group + ' - ' + targetConfig.Name;
      } else {
        tempVal1 = targetConfig.DataSourceType + ' - ' + targetConfig.Name;
      }
      TargetSelectMenu.push(
        <option key={[targetConfig.Name,targetConfig.Group, targetConfig.TenantId]} disabled={!targetConfig.CanBeUsable} className="optionDisable" data-store={this.props.generic_master_store.short_name_tag_color[targetConfig.DataSourceType]['store_name']} value={[targetConfig.Name, targetConfig.Group]}> {tempVal1}</option>
      );
    });

    this.props.generic_master_store.SourceConfigs.map(sourceConfig => {
      var tempVal = '';
      if(BACKEND === 'LoopBack') {
        tempVal = sourceConfig.TenantId + ' - ' + sourceConfig.DataSourceType + ' - ' + sourceConfig.Group + ' - ' + sourceConfig.Name;
      } else {
        tempVal = sourceConfig.DataSourceType + ' - ' + sourceConfig.Name;
      }
      SourceSelectMenu.push(
        <option key={[sourceConfig.Name,sourceConfig.Group,sourceConfig.TenantId]} className="optionDisable" disabled={!sourceConfig.CanBeUsable} data-store={this.props.generic_master_store.short_name_tag_color[sourceConfig.DataSourceType]['store_name']} value={[sourceConfig.Name, sourceConfig.Group]}>{tempVal}</option>
      );
    });

    return (
      <div>
        <FormGroup hidden>
          <FormControl
            type="text" placeholder="Name" name="new_config_name"
            value={this.props.mapping_store.new_config_name} readOnly
          />
          <span hidden={!this.state.show_err_msg} style={{ color: '#F4BA41' }}>Config name already exists</span>
        </FormGroup>
        <FormGroup validationState={this.state.show_specialchar_err_msg ? 'warning' : null}>
          <FormControl
            type="text" placeholder="Title" name="newConfigTitle"
            value={this.props.mapping_store.newConfigTitle}
            onChange={this.onTextChange.bind(this)}
          />
          <FormControl.Feedback />
          <span hidden={!this.state.show_specialchar_err_msg} style={{ color: '#F4BA41' }}>Special Characters and Spaces are not allowed</span>
        </FormGroup>
        <FormGroup>
          <FormControl componentClass="textarea" style={{ resize: 'none' }} placeholder="Description" name="new_config_description"
                       value={this.props.mapping_store.new_config_description}
                       onChange={this.onTextChange.bind(this)}
          />
        </FormGroup>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Source Type</ControlLabel>
          <FormControl componentClass="select" placeholder="select" onChange={this.onOptionSelect.bind(this, 'SourceConfig')} value={[this.state.selectedSourceName, this.state.selectedSourceGroupName]}>
            <option key='Default' value="">Source Type </option>
            {SourceSelectMenu}
          </FormControl>
        </FormGroup>
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Target Type</ControlLabel>
          <FormControl componentClass="select" placeholder="select" onChange={this.onOptionSelect.bind(this, 'TargetConfig')} value={[this.state.selectedTargetName, this.state.selectedTargetGroupName]}>
            <option key='Default' value="">Target Type</option>
            {TargetSelectMenu}
          </FormControl>
          <span hidden={!this.state.show_err_msg} style={{ color: 'orange' }}>Config name already exists. Please select different source/target type</span>
        </FormGroup>
        <Button
          bsStyle="primary" onClick={this.goToMappingConfigPage.bind(this)}
          disabled={this.props.mapping_store.new_config_name === '' || this.state.selectedSourceName === '' || this.state.selectedTargetName === '' || this.state.show_err_msg || this.props.mapping_store.new_config_name.indexOf(' ') > -1 || this.props.mapping_store.newConfigTitle.length < 3 || this.props.mapping_store.new_config_description.length < 3 }  block
        >Submit</Button>
      </div>
    );
  }
}

MappingThingNew.propTypes = {
  store: React.PropTypes.object
};

export default MappingThingNew;
