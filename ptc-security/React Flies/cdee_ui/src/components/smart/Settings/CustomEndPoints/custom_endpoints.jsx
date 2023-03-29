/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
import React from 'react';
import {inject, observer} from 'mobx-react';
import {Row, Col, Table, ControlLabel, Button, FormGroup, FormControl, Modal, Checkbox, Panel} from 'react-bootstrap';
import CodeMirror from 'react-codemirror';

@inject('routing', 'breadcrumb_store', 'generic_master_store', 'validation_store', 'mapping_store', 'modal_store')
@observer

class CustomEndPoints extends React.Component {
    constructor(props) {
        super(props);
        this.generic_master_store = this.props.generic_master_store;
        this.modal_store = this.props.modal_store;
        this.mapping_store = this.props.mapping_store;
        this.state = {
            selectedGroupName :'',
            showAllScripts:[],
            showScriptData: false,
            showModal:false,
            modalTitle:'',
            modalBody:'',
            modalBtn:'',
            disable_btn:false,
            disabled_msg:false,
            service_name:'',
            channels : [],
            selectedChannels: [],
            selectedMapping:'',
            isActive: false
        }
    }
    componentWillMount() {
    }

    selectedCepList() {
        var that = this;
        var cepObj = that.generic_master_store.cepRender, selectedGroupObj = {}, selectedConfigObj = {};
        if (cepObj && Object.keys(cepObj).length) {
            this.generic_master_store.getAllGroupWithConfigs.then(function () {
                that.generic_master_store.customScripts.Groups.forEach(function (item) {
                    if (item.name === cepObj.name && item.tenantId === cepObj.tenantId && item.groupType === cepObj.groupType) {
                        selectedGroupObj = item;
                    }
                });
                that.onAction(true, {target: {value: JSON.stringify(selectedGroupObj)}});
                if(Object.keys(selectedGroupObj).length) {
                    selectedGroupObj.configs.forEach(config => {
                        if (config.name === cepObj.configName) {
                            selectedConfigObj = config;
                        }
                    });
                }
                if (cepObj.type === 'CONFIG') {
                    that.onAction(false, {target: {value: JSON.stringify(selectedConfigObj)}})
                }
                if (cepObj.type === 'MAPPING') {
                    that.onAction(false, {target: {value: JSON.stringify(selectedConfigObj)}});
                    that.generic_master_store.configMe.isMcc = true;
                    that.generic_master_store.getAllMappingForTarget(function () {
                        that.onChange({target: {name:'WithMCC', checked: true, value:cepObj.displayName}})
                    });
                }

            });
        }else {
            if(ieGlobalVariable.tenantID === '' || ieGlobalVariable.tenantID === undefined ) {
               this.props.generic_master_store.setvalue('tenantID', '');
            }
            this.getAllScripts('SelectGroup');
            this.generic_master_store.getAllGroupWithConfigs;
        }
    }

    componentWillUnmount() {
        this.generic_master_store.setvalue('cepRender', {});
        var cepObj = this.generic_master_store.cepRender;
        if (cepObj && Object.keys(cepObj).length) {
            if (cepObj.type !== 'CONFIG' || cepObj.type !== 'MAPPING') {
                if (ieGlobalVariable.tenantID === '' || ieGlobalVariable.tenantID === undefined) {
                    this.generic_master_store.tenantID = '';
                }
            }
        }
    }


    onChange(event) {
        var configuration = this.generic_master_store.configMe;
        if(event.target.name === 'customScriptName') {
            configuration.name = event.target.value;
            var csArr = this.generic_master_store.CustomScriptsList;
            if(this.generic_master_store.cepRender && Object.keys(this.generic_master_store.cepRender).length && this.generic_master_store.cepRender.groupType === 'source' || this.generic_master_store.cepRender.groupType === 'target') {
              for (var i = 0; i < csArr.length; i++) {
                if ((event.target.value !== '') && (csArr[i].name.toLowerCase() === event.target.value.toLowerCase())) {
                  this.setState({disabled_msg: true});
                  return false;
                } else {
                  this.setState({disabled_msg: false});
                }
              }
            }else {
              this.validationMethod(configuration);
            }

        }else if(event.target.name === 'WithMCC') {
            configuration.isMcc = event.target.checked;
            configuration.mapping = {};
            this.setState({selectedChannels:[]});
        }else if(event.target.name === 'isActive') {
            this.setState({isActive : event.target.checked});
            configuration.isActive = event.target.checked;
        }else if(event.target.name === 'context') {
            configuration.context = event.target.value;
        }else {

        }
        if(this.generic_master_store.configMe.isMcc) {
            if(event.target.value === 'Select Mapping Config') {
                this.setState({selectedMapping:'Select Mapping Config'});
                configuration.mapping = {};
            }else{
                var targetMappings = this.generic_master_store.mappingsForTarget;
                if(targetMappings.Mappings !== undefined) {
                  for (var i = 0; i < targetMappings.Mappings.length; i++) {
                    if (targetMappings.Mappings[i].dispalyValue === event.target.value) {
                      this.setState({selectedMapping: event.target.value});
                      configuration.mapping = targetMappings.Mappings[i];
                        if(this.generic_master_store.cepRender && Object.keys(this.generic_master_store.cepRender).length) {
                            if(this.generic_master_store.cepRender.type === 'MAPPING') {
                                this.getAllScripts(configuration.groupName, configuration.groupType, configuration.configName, configuration.mapping.dispalyValue);
                            }
                        }
                    }
                  }
                }
            }

        }else {
            this.setState({selectedMapping:''});
            configuration.mapping = {};
        }
        this.generic_master_store.setvalue('configMe', configuration);
    }

    onSelect() {
        var tmp_arr = this.state.channels;
        tmp_arr = [];
        var targetMappings = this.generic_master_store.mappingsForTarget.Mappings;
        if (targetMappings !== undefined) {
            for (var i = 0; i < targetMappings.length; i++) {
                tmp_arr.push(targetMappings[i].dispalyValue);
            }
        }
        this.setState({ channels: tmp_arr });
    }
    onChangeMultiSelect(value) {
        var configuration = this.generic_master_store.configMe;
        this.setState({selectedChannels: value});
        var arr = [];
        var targetMappings = this.generic_master_store.mappingsForTarget;
        for (var i = 0; i < targetMappings.Mappings.length; i++) {
            for (var j = 0; j < value.length; j++) {
                if(targetMappings.Mappings[i].dispalyValue === value[j].label) {
                    arr.push(targetMappings.Mappings[i]);
                }

            }
        }
        configuration.mapping = arr;
        this.generic_master_store.setvalue('configMe', configuration);
        this.generic_master_store.getAllMappingForTarget();
        this.setState({ channels: [] });
        this.onSelect();
    }

    mappingGroupConfigLists() {
       var configuration = this.generic_master_store.configMe;
        if(this.generic_master_store.cepRender && Object.keys(this.generic_master_store.cepRender).length) {
          if(this.generic_master_store.cepRender.type === 'CONFIG') {
              this.getAllScripts(configuration.groupName, configuration.groupType, configuration.configName);
          }else if(this.generic_master_store.cepRender.type === 'MAPPING') {
             this.getAllScripts(configuration.groupName, configuration.groupType, configuration.configName, configuration.mapping.dispalyValue);
          }
        }else {
           configuration.groupName = '';
           configuration.configName = '';
           configuration.groupType = '';
           this.setState({selectedGroupName: ''});
           this.getAllScripts('SelectGroup');
        }
        configuration.script = [];
        configuration.name = '';
        configuration.isMcc = false;
        configuration.context = '';
        this.setState({isActive : false});
        configuration.isActive = false;
        configuration.mapping = {};
        this.generic_master_store.setvalue('configMe', configuration);
        this.generic_master_store.resultCustomScript = {};
    }
    onAction(select, event) {
        var configuration = this.generic_master_store.configMe;
        if(event.target.value === 'Select Group') {
            this.getAllScripts('SelectGroup');
            configuration.groupName = '';
            configuration.groupType = '';
            configuration.configName = '';
        }
        if(event.target.value === 'Select Config') {
           configuration.configName = '';
           this.getAllScripts(configuration.groupName, configuration.groupType);
        }
        configuration.isMcc = false;
        configuration.mapping = {};
        this.setState({selectedMapping: 'Select Mapping'});
        if((event.target.value !== 'Select Group') || (event.target.value !== 'Select Config')) {
           var obj = JSON.parse(event.target.value);
        }
        if(obj) {
           if(select) {
              this.generic_master_store.setvalue('selectedGroup', obj);
              configuration.groupName = obj.name;
              configuration.groupType = obj.groupType;
              if(obj.groupType === 'source') {
                configuration.isActive = true;
              }
              this.setState({selectedGroupName: configuration.groupName});
              this.getAllScripts(configuration.groupName, configuration.groupType);
              configuration.configName = '';
           }else {
              this.generic_master_store.setvalue('selectedConfig', obj);
              configuration.configName = obj.name;
              this.getAllScripts(configuration.groupName, configuration.groupType, configuration.configName);
              this.generic_master_store.getAllMappingForTarget();
              this.setState({selectedChannels:[]});
           }
           this.generic_master_store.setvalue('tenantID', obj.tenantId);
           this.validationMethod(configuration);
        }
        this.generic_master_store.setvalue('configMe', configuration);
    }

    validationMethod(configuration) {
      var csArr = this.generic_master_store.CustomScriptsList;
      if(csArr && csArr.length) {
        for (var i = 0; i < csArr.length; i++) {
          if ((configuration.name !== '') && (csArr[i].name.toLowerCase() === configuration.name.toLowerCase()) &&
            (csArr[i].groupName === configuration.groupName) && (csArr[i].groupType === configuration.groupType) &&
            (csArr[i].configName === configuration.configName) &&  (csArr[i].tenantId === this.generic_master_store.tenantId)) {
            this.setState({disabled_msg: true});
            return false;
          } else {
            this.setState({disabled_msg: false});
          }
        }
      }
    }
    getAllScripts(grpName, grpType, configName, mapping) {
        var csArr = this.generic_master_store.CustomScriptsList;
        var list = [];
        for (var i = 0; i < csArr.length; i++) {
          if (((csArr[i].groupName === 'SelectGroup') || (grpName === 'SelectGroup') ) && ((csArr[i].groupType === undefined) ||(grpType === undefined) ) && (configName === undefined)){
              list.push(csArr[i]);
          }else{
            if(configName === undefined)  {
                if ((csArr[i].groupName === grpName) && (csArr[i].groupType === grpType) ){
                    list.push(csArr[i])
                }
            }else{
                if (csArr[i].groupName === grpName && csArr[i].groupType === grpType && csArr[i].configName === configName && mapping === undefined) {
                    list.push(csArr[i])
                }else if((csArr[i].groupName === grpName && csArr[i].groupType === grpType && csArr[i].configName === configName && csArr[i].mapping && csArr[i].mapping.dispalyValue === mapping)) {
                    list.push(csArr[i])
                }
            }
          }
        }
        this.setState({showAllScripts: list});
    }

    updateCode(value) {
        this.generic_master_store.configMe.script = value.split('\n');
        if(value === '') {
            this.setState({disable_btn:false});
        }else {
            this.setState({disable_btn:true});
        }
    }

    saveScript() {
        this.setState({ showModal: true, modalTitle: 'Save Custom EndPoint' });
        if(this.generic_master_store.configMe.isActive) {
           if (this.generic_master_store.mappingsForTarget.Mappings.length > 0) {
             if (this.generic_master_store.configMe.isMcc === false) {
               var body = (<p>Do you want to override the MappingFlow for <span style={{fontWeight: 'bold'}}>{' ' + this.generic_master_store.configMe.configName + ' - ' + this.generic_master_store.configMe.groupType}</span></p>);
             } else {
               body = (<span>Do you want to Save the Custom EndPoint</span>);
             }
           } else {
              body = (<p> Do you want to Save the Custom EndPoint</p>);
           }
        }else{
           body = (<p>Do you want to Save the Custom EndPoint</p>);
        }
        this.setState({ modalBody :body, modalBtn :'Save' });
    }

    getlist() {
        var configuration = this.generic_master_store.configMe;
        if(this.generic_master_store.cepRender && Object.keys(this.generic_master_store.cepRender).length) {
            if(this.generic_master_store.cepRender.type === 'CONFIG') {
               configuration.isMcc = false;
                configuration.mapping = {};
            }
            this.generic_master_store.setvalue('tenantID', this.generic_master_store.cepRender.tenantId);
        }else {
          configuration.configName='';
          configuration.isMcc = false;
          configuration.mapping = {};
        }
        configuration.script = [];
        configuration.name = '';
        configuration.context = '';
        this.setState({isActive : false});
        configuration.isActive = false;
        this.setState({channels:[]});
        this.setState({selectedChannels:[]});
        this.generic_master_store.setvalue('configMe', configuration);
        this.generic_master_store.resultCustomScript = {};
        if((configuration.groupName)&&(configuration.configName === '')&&(configuration.groupType)) {
            this.getAllScripts(configuration.groupName, configuration.groupType)
        }else if((configuration.groupName === '') && ((configuration.groupType === 'target') || (configuration.groupType === '')) && (configuration.configName === '')){
            this.getAllScripts('SelectGroup')
        }else if(configuration.groupName && (configuration.groupType ||configuration.groupType === '') && configuration.configName && Object.keys(configuration.mapping).length && configuration.mapping.dispalyValue === this.state.selectedMapping){
            this.getAllScripts(configuration.groupName, configuration.groupType, configuration.configName, configuration.mapping.dispalyValue);
        } else{
            this.getAllScripts(configuration.groupName, configuration.groupType, configuration.configName);
        }
    }

    testScript() {
        this.generic_master_store.executeCustomScripts
    }

    returnList(optionsArr) {
        var list = [];
        if (optionsArr !== undefined) {
            optionsArr.map(mappingGrp => {
                list.push(
                    <option>{mappingGrp.Name}</option>
                );
            });
        }
        return list;
    }


    viewCustomScript(ws) {
        this.setState({ showScriptData: true, modalTitle: ws.name, modalBody:ws });
    }

    editCustomScript(ws) {
        var grpArray = this.generic_master_store.customScripts.Groups;
        for (var i = 0; i < grpArray.length; i++) {
          if ((grpArray[i].name === ws.groupName) && (grpArray[i].tenantId === ws.tenantId)) {
            this.generic_master_store.setvalue('selectedGroup', grpArray[i]);
          }
        }
        this.setState({selectedChannels: []});
        var configuration = this.generic_master_store.configMe;
        configuration.configName = ws.configName;
        configuration.groupType = ws.groupType;
        configuration.groupName = ws.groupName;
        configuration.name = ws.name;
        configuration.script = ws.script;
        configuration.isMcc= ws.isMcc;
        configuration.mapping= ws.mapping;
        configuration.context= ws.context;
        this.setState({isActive : ws.isActive});
        configuration.isActive= ws.isActive;
        configuration.tenantId= ws.tenantId;
        this.setState({selectedGroupName: ws.groupName});
        this.generic_master_store.setvalue('configMe', configuration);
        this.generic_master_store.setvalue('tenantID', ws.tenantId ? ws.tenantId: '');
       if(Object.keys(ws.mapping).length !== 0) {
         this.generic_master_store.getAllMappingForTarget();
         this.setState({selectedMapping: ws.mapping.dispalyValue});
       }
        this.setState({disabled_msg:false});
        this.setState({disable_btn:true});
    }

    deleteCustomScript(ws) {
        this.generic_master_store.configMe.name = ws.name;
        this.generic_master_store.tenantID = ws.tenantId;
        this.setState({ showModal: true, modalTitle: 'Delete Custom EndPoint' });
        var body = (<p> Do you want to Delete the Custom EndPoint</p>);
        this.setState({ modalBody :body, modalBtn :'Delete' });
    }

    reset() {
        this.mappingGroupConfigLists();
    }
    onSubmitBtn(type) {
        if(type === 'Save') {
            this.generic_master_store.saveCustomScripts(this.getlist.bind(this));
        }else {
            this.generic_master_store.deleteCustomscripts(this.getlist.bind(this));
        }
        this.setState({ showModal:false })
    }

    render() {
        var configList = [];
        var groupList = [];
        var Mappings = [];
        var context = [];
        if (this.generic_master_store.customScripts.Groups !== undefined) {
            this.generic_master_store.customScripts.Groups.map(groupObj => {
                groupList.push(
                    <option key={groupObj.name+'-'+ (groupObj.groupType ? groupObj.groupType: '')  +(groupObj.tenantId ? groupObj.tenantId : '')} selected={groupObj.name === this.state.selectedGroupName && groupObj.groupType === this.generic_master_store.configMe.groupType && groupObj.tenantId === this.generic_master_store.configMe.tenantId} value={JSON.stringify(groupObj)}>{groupObj.name+' - '+ groupObj.tenantId+' - '+ groupObj.groupType}</option>
                );
            });
        }
        if (this.generic_master_store.selectedGroup && this.generic_master_store.selectedGroup.configs !== undefined) {
            this.generic_master_store.selectedGroup.configs.map(config => {
                configList.push(
                    <option key={config.groupName + '-' + (config.groupType ? config.groupType : '') + config.name + '-'+(config.tenantId ? config.tenantId : '')} selected={config.name === this.generic_master_store.configMe.configName} value={JSON.stringify(config)}>{config.name}</option>
                );
            });
        }

        if (this.generic_master_store.mappingsForTarget.Mappings !== undefined) {
            this.generic_master_store.mappingsForTarget.Mappings.map(mapGroup => {
                Mappings.push(
                    <option key={mapGroup.dispalyValue} >{mapGroup.dispalyValue}</option>
                );
            });
        }
      this.generic_master_store.contextList.map(obj => {
          for (var key in obj) {
            context.push(
            <option key={key} value={key}>{obj[key]}</option>
            );
          }
        });

        var savebtn = false;
        if(this.generic_master_store.configMe.isMcc === true) {
            if(Object.keys(this.generic_master_store.configMe.mapping).length=== 0) {
                savebtn = true;
            }
        }else {
            savebtn = false;
        }
        if(this.generic_master_store.configMe.groupName === '') {
            configList = []
        }
        let close = () => this.setState({ showScriptData: false, showModal: false });
        var codeOptions = {
            lineNumbers: true,
            mode: 'javascript'
        };
        var codeOptions2 = {
            lineNumbers: false,
            mode: 'javascript',
            theme: 'dracula',
            smartIndent: true,
            readOnly: true
        };
        var customList = [];
        var showEndpoints =  this.state.showAllScripts;
        showEndpoints.map(ws => {
            customList.push(
                 <tr key={ws.groupName+'tr'+ws.name} className="tablestyle">
                    <td>{ws.name}</td>
                    <td >{ws.groupName}</td>
                    <td>{ws.configName}</td>
                    <td >{ws.groupType}</td>
                     <td>{ws.isMcc.toString()}</td>
                     <td>{ws.isActive.toString()}</td>
                     <td>
                       <span>
                           <span  style={{ cursor: 'pointer', color:'black' }} onClick={this.viewCustomScript.bind(this, ws)}>
                             &nbsp;&nbsp;  <i className="fa fa-eye" aria-hidden="true"></i> &nbsp;&nbsp;&nbsp;
                           </span>        <font color="#ff8c1a">|</font>&nbsp;&nbsp;&nbsp;
                           <span style={{ cursor: 'pointer', color:'#ff8c1a' }} onClick={this.editCustomScript.bind(this, ws)}>
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;
                           </span>         <font color="#ff8c1a">|</font>&nbsp;&nbsp;&nbsp;
                             <span style={{ cursor: 'pointer', color:'red' }} onClick={this.deleteCustomScript.bind(this, ws)}>
                            <i className="fa fa-trash-o" aria-hidden="true"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                          </span>
                       </span>
                     </td>
                 </tr>
            );
        });
        return(
          <div>
            <Panel>
              <Col xs={12}>
                 <Col xs={6} sm={6} md={6} lg={6}>
                   <Col xs={6} sm={6} md={6} lg={6}>
                     <form>
                         <ControlLabel>Custom EndPoint Name</ControlLabel>
                         <FormGroup validationState={this.state.disabled_msg? 'warning' : null}>
                            <FormControl type="text" placeholder="Name" name="customScriptName" value={this.generic_master_store.configMe.name} onChange={this.onChange.bind(this)} required/>
                             <span hidden={!this.state.disabled_msg} style={{ color: '#F4BA41' }}>CustomEndPoint Name already exists</span>
                         </FormGroup>
                         <FormGroup controlId="formControlsSelect"  hidden={this.generic_master_store.cepRender ? (this.generic_master_store.cepRender.type === 'CONFIG' || this.generic_master_store.cepRender.type === 'MAPPING'): false}>
                             <ControlLabel>Group</ControlLabel>
                             <FormControl componentClass="select" name="Group" placeholder="select" onChange={this.onAction.bind(this, true)} selected={this.state.selectedGroupName}>
                                 <option key='Default'  value="Select Group">Select Group</option>
                                 {groupList}
                             </FormControl>
                         </FormGroup>
                         <FormGroup  controlId="formControlsSelect2" hidden={this.generic_master_store.cepRender ? (this.generic_master_store.cepRender.type === 'CONFIG' || this.generic_master_store.cepRender.type === 'MAPPING'): false}>
                             <ControlLabel>Me </ControlLabel>
                             <FormControl componentClass="select" name="Config" placeholder="select" onChange={this.onAction.bind(this, false)} selected={this.generic_master_store.configMe.configName}>
                                 <option key='Default' value="Select Config">Select Config</option>
                                 {configList}
                             </FormControl>
                         </FormGroup>
                         <Row>
                             <Col xs={12} sm={12} md={12} lg={12} >
                               <Row>
                                 <Col xs={6} sm={6} md={6} lg={6} >
                                    <FormGroup hidden={this.generic_master_store.configMe.groupType === 'source'}>
                                      <Checkbox name="isActive"  checked={this.state.isActive} onChange={this.onChange.bind(this)} inline>IsActive</Checkbox>
                                    </FormGroup>
                                 </Col>
                                 <Col xs={6} sm={6} md={6} lg={6} >
                                     <FormGroup hidden={this.generic_master_store.configMe.configName === '' || this.generic_master_store.cepRender.type === 'MAPPING' || this.generic_master_store.configMe.groupType === 'source'}>
                                      <Checkbox name="WithMCC"  checked={this.generic_master_store.configMe.isMcc} onChange={this.onChange.bind(this)} inline>With MCC</Checkbox>
                                     </FormGroup>
                                 </Col>
                               </Row>
                             </Col>
                         </Row>
                         <FormGroup controlId="formControlsSelect" hidden={!this.generic_master_store.configMe.isMcc || this.generic_master_store.cepRender.type === 'MAPPING'}>
                            <ControlLabel>Mapping Configs Of: {this.generic_master_store.configMe.groupName}</ControlLabel>
                             <FormControl componentClass="select" placeholder="Select Mapping Config" name="mappingConfig" onChange={this.onChange.bind(this)}  value={this.state.selectedMapping}>
                               <option key='Default' value="Select Mapping Config">Select Mapping Config</option>
                                 {Mappings}
                                 </FormControl>
                         </FormGroup>
                       <FormGroup hidden={this.generic_master_store.configMe.groupType === 'target' || this.generic_master_store.configMe.groupType === undefined }>
                         <FormControl componentClass="select" name="context" placeholder="select" onChange={this.onChange.bind(this)} value={this.generic_master_store.configMe.context}>
                           <option key='Default'  value="">Select Context</option>
                           {context}
                         </FormControl>
                       </FormGroup>
                     </form>
                   </Col>
                   <Col xs={12} sm={12} md={12} lg={12}>
                       <FormGroup>
                           <ControlLabel>Script</ControlLabel>
                             <CodeMirror value={this.generic_master_store.configMe.script.join('\n')} onChange={this.updateCode.bind(this)} options={codeOptions}/>
                       </FormGroup>

                     <FormGroup>
                         <p className="pull-right">
                             <Button className="" name="reset" bsSize="small" bsStyle="primary" onClick={this.reset.bind(this)} >Reset</Button>&nbsp;&nbsp;
                             <Button className="" name="Save" bsSize="small" bsStyle="success" onClick={this.saveScript.bind(this)} disabled={this.state.disabled_msg || this.generic_master_store.configMe.name === '' ||
                                                                                                                                           this.generic_master_store.configMe.groupName === '' || this.generic_master_store.configMe.configName === '' ||
                                                                                                                                             !this.state.disable_btn || savebtn /*|| (this.generic_master_store.configMe.groupType === 'source' && this.generic_master_store.configMe.context === '')*/ }>Save</Button>&nbsp;&nbsp;
                             <Button className="" name="Test" bsSize="small" bsStyle="warning" onClick={this.testScript.bind(this)} disabled={this.generic_master_store.configMe.groupName === '' || this.generic_master_store.configMe.configName === '' ||
                                                                                                                                          !this.state.disable_btn}>Test</Button>
                         </p>
                     </FormGroup>
                   </Col>
                   <Col xs={12} sm={12} md={12} lg={12}>
                       <FormGroup>
                          <CodeMirror value={JSON.stringify(this.generic_master_store.resultCustomScript,null,2)} options={codeOptions2}/>
                       </FormGroup>
                   </Col>
                 </Col>
                  <Col xs={6} sm={6} md={6} lg={6}>
                      <div>
                          <div hidden={this.state.showAllScripts.length === 0}>
                            <h5>Custom EndPoints:</h5>
                              <div style={{  marginTop: '15px'}}>
                                  <Table striped bordered condensed hover responsive>
                                      <thead>
                                      <tr className="tablestyle">
                                         <th>Name</th>
                                         <th> Group Name</th>
                                         <th> Config Name</th>
                                         <th> Group Type</th>
                                         <th> Mcc</th>
                                         <th> Active</th>
                                         <th> User Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                    {customList}
                                    </tbody>
                                  </Table>
                              </div>
                          </div>
                          <div hidden={!(this.state.showAllScripts.length === 0)}>
                              <span>Please add Custom EndPoints or select existing Custom EndPoints</span>
                          </div>
                      </div>
                  </Col>
              </Col>

              <div className="modal-container">
                <Modal bsSize="large" show={this.state.showScriptData} onHide={close} container={this} aria-labelledby="contained-modal-title">
                    <Modal.Header closeButton>
                        <h4>Custom EndPoint Name: {this.state.modalTitle}</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <CodeMirror value={JSON.stringify(this.state.modalBody,null,2)} options={codeOptions2} />
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
              </div>
               <div className="modal-container">
                 <Modal show={this.state.showModal} onHide={close} container={this}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">
                            <p style={{ wordWrap: 'break-word' }}> {this.state.modalTitle}</p>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        {this.state.modalBody}
                    </Modal.Body>
                    <Modal.Footer className="modal-footer">
                        <Button bsStyle="default" onClick={close} className="btn btn-default">Cancel</Button>
                        <Button bsStyle="primary" className="btn btn-primary" onClick={this.onSubmitBtn.bind(this, this.state.modalBtn)}>{this.state.modalBtn}</Button>
                    </Modal.Footer>
                 </Modal>
               </div>
            </Panel>
          </div>
        )
    }
}

CustomEndPoints.propTypes = {
    store: React.PropTypes.object
};
export default CustomEndPoints;
