/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

 * Unauthorized copying of this file via any medium is strictly prohibited

 * See LICENSE file in the project root for full license information

 */
/* global ieGlobalVariable */
import React from 'react';
import { inject, observer } from 'mobx-react';
import {ControlLabel, FormGroup, Radio, Row, Col, FormControl, Button, Table} from 'react-bootstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';

@inject('generic_master_store', 'modal_store')
@observer
class AccessToken extends React.Component {
    constructor(props) {
        super(props);
        this.generic_master_store = this.props.generic_master_store;
        this.modal_store = this.props.modal_store;
        this.state = {
          selection: 'tenant',
          tempGroupType: ''
        }
    }

    componentWillMount() {
        this.generic_master_store.setvalue('tempTenantId', ieGlobalVariable.tenantID ? ieGlobalVariable.tenantID : '');
        this.generic_master_store.getAllAccessTokens();
    }

    onChange(event) {
       if(event.target.name === 'tenant') {
          this.setState({selection: event.target.value});
          this.generic_master_store.setvalue('isGroupKey', false);
       }else {
          this.setState({selection: event.target.value});
          this.generic_master_store.setvalue('isGroupKey', true);
       }
       this.generic_master_store.setvalue('tempTenantId', ieGlobalVariable.tenantID ? ieGlobalVariable.tenantID : '');
       this.generic_master_store.setvalue('tempGroupName', '');
       this.generic_master_store.setvalue('tempGroupType', '');
       this.generic_master_store.getAllAccessTokens();
    }

    handleChange(event) {
        if (event.target.name === 'tenantIdSelect') {
           if(event.target.value === 'selectTenantId') {
               this.generic_master_store.setvalue('tempTenantId', '');
           }else {
               this.generic_master_store.setvalue('tempTenantId', event.target.value);
           }
           this.generic_master_store.setvalue('tempGroupType', '');
           this.generic_master_store.setvalue('tempGroupName', '');
        }else if(event.target.name === 'groupType') {
            if(event.target.value === 'SelectGroupType') {
                this.generic_master_store.setvalue('tempGroupType', '');
            }else {
               this.generic_master_store.setvalue('tempGroupType', event.target.value);
               this.generic_master_store.setvalue('tenantID', this.generic_master_store.tempTenantId);
               this.generic_master_store.getAllGroups(event.target.value)
            }
            this.generic_master_store.setvalue('tempGroupName', '');
        }else if(event.target.name === 'groupName') {
            if(event.target.value === 'SelectGroupName') {
               this.generic_master_store.setvalue('tempGroupName', '');
            }else {
               this.generic_master_store.setvalue('tempGroupName', event.target.value);
            }
        }
        this.generic_master_store.getAllAccessTokens();
    }

    generateAccessToken() {
      this.generic_master_store.generateAPIKey();
       NotificationManager.success('Access Token Created SuccessFully', 'Success',1000);
    }

    render() {
        var staticGroup = ['source', 'target'];
        var grpList = [];
        var accessTokenTableList = [];
        staticGroup.map(type => {
            grpList.push(
                <option key={type} value={type} >{type}</option>
            );
        });
        var tenantIdList = [];
        this.props.generic_master_store.tenantIDs.forEach(function(obj){
            if(obj) {
                tenantIdList.push(
                    <option key={obj.tenantName} value={obj.tenantName}>{obj.tenantName}</option>
                )
            }
        });
        if(this.props.generic_master_store.accessTokens !== undefined && this.props.generic_master_store.accessTokens.length) {
            this.props.generic_master_store.accessTokens.map(obj => {
                accessTokenTableList.push(
                    <tr key={obj.apiKey + 'tr' + obj.tenantId} className="tablestyle">
                        <td>{obj.tenantId}</td>
                        <td>{obj.apiKey}</td>
                        <td hidden={(this.state.selection === 'tenant') ? true : false}>{obj.groupType}</td>
                        <td hidden={(this.state.selection === 'tenant') ? true : false}>{obj.groupName}</td>
                    </tr>
                )
            });
        }
        var allGroups =[];
        if(this.props.generic_master_store.tempGroupType === 'source') {
            allGroups= this.generic_master_store.SourceGroups;
        }else {
            allGroups= this.generic_master_store.TargetGroups;
        }
        var groupNames = [];
        if(allGroups !== undefined && allGroups.length) {
            allGroups.forEach(function (obj) {
                if (obj) {
                    groupNames.push(
                        <option key={obj.name+'-'+obj.tenantId+'-'} value={obj.name}>{obj.name}</option>
                    )
                }
            });
        }else {
            groupNames = [];
        }

        return (
            <div>
                <fieldset className="scheduler-border">
                    <legend className="scheduler-border">Access Token's</legend>
                    <Row>
                       <Col xs={12}>
                          <Col xs={6} sm={6} md={6} lg={6}>
                             <h1>Level of Security</h1>
                             <FormGroup>
                                <Radio name="tenant" value="tenant" onChange={this.onChange.bind(this)} checked={this.state.selection === 'tenant'} inline>
                                    Tenant
                                </Radio>{' '}
                                <Radio name="group" value="group" onChange={this.onChange.bind(this)} checked={this.state.selection === 'group'} inline>
                                    Group
                                </Radio>
                             </FormGroup>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                       <Col xs={12}>
                           <Col xs={5} sm={5} md={5} lg={5}>
                              <h1>Create New:</h1>
                              <FormGroup hidden={ieGlobalVariable.tenantID ? false: true}>
                                  <div><strong>Tenant: </strong><span className="test">{ieGlobalVariable.tenantID ? ieGlobalVariable.tenantID: ''}</span></div>
                              </FormGroup>
                               <Row>
                               <Col xs={10} sm={10} md={10} lg={10}>
                               <FormGroup controlId="accessTokenSelectTenantId" hidden={ieGlobalVariable.tenantID ? true: false}>
                                   <ControlLabel>Tenant Selection</ControlLabel>
                                   <FormControl
                                       componentClass="select" placeholder="Select TenantId" name="tenantIdSelect"
                                       onChange={this.handleChange.bind(this)} value={this.generic_master_store.tempTenantId}
                                   >
                                       <option value="selectTenantId">Select TenantId</option>
                                       {tenantIdList}
                                   </FormControl>
                               </FormGroup>
                              <FormGroup controlId="accessTokenGroupType" hidden={(this.state.selection === 'tenant') ? true :false}>
                                  <ControlLabel>GroupType Selection</ControlLabel>
                                  <FormControl componentClass="select" name="groupType" placeholder="select" value={this.generic_master_store.tempGroupType} onChange={this.handleChange.bind(this)}>
                                       <option key='defaultGroupType'  value="SelectGroupType">Select Group Type</option>
                                       {grpList}
                                   </FormControl>
                              </FormGroup>
                               <FormGroup controlId="accessTokenGroupType" hidden={(this.state.selection === 'tenant') ? true :false}>
                                   <ControlLabel>Group Selection</ControlLabel>
                                   <FormControl componentClass="select" name="groupName" placeholder="select" value={this.generic_master_store.tempGroupName} onChange={this.handleChange.bind(this)}>
                                       <option key='defaultGroupName'  value="SelectGroupName">Select Group</option>
                                       {groupNames}
                                   </FormControl>
                               </FormGroup>
                                   <FormGroup>
                                       <p className="pull-right">
                                           <Button className="" name="generateAccessToken" bsStyle="primary" onClick={this.generateAccessToken.bind(this)}
                                           disabled={(this.state.selection === 'tenant' && this.generic_master_store.tempTenantId === '') ||
                                           ((this.state.selection === 'group') && (this.generic_master_store.tempTenantId === '' || this.generic_master_store.tempGroupType === '' ||
                                           this.generic_master_store.tempGroupName === ''))}>Generate</Button>&nbsp;&nbsp;
                                       </p>
                                   </FormGroup>
                               </Col>
                               </Row>
                           </Col>
                           <Col xs={7} sm={7} md={7} lg={7}>
                               <h1>Token Assigned:</h1>
                               <FormGroup>
                                   <div style={{  marginTop: '15px'}}>
                                       <Table striped bordered condensed hover responsive>
                                           <thead>
                                           <tr className="tablestyle">
                                               <th>TenantId</th>
                                               <th>APIKey</th>
                                               <th hidden={(this.state.selection === 'tenant') ? true :false}>GroupType</th>
                                               <th hidden={(this.state.selection === 'tenant') ? true :false}>GroupName</th>
                                           </tr>
                                           </thead>
                                           <tbody>
                                           {accessTokenTableList}
                                           </tbody>
                                       </Table>
                                   </div>
                               </FormGroup>
                           </Col>
                       </Col>
                    </Row>
                </fieldset>
                <NotificationContainer />
            </div>
        );
    }
}

AccessToken.propTypes = {
    store: React.PropTypes.object
};

export default AccessToken;
