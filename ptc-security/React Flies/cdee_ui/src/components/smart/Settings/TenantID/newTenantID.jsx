/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Radio, FormGroup, FormControl, ControlLabel, ListGroup, ListGroupItem, Row, InputGroup, Button, OverlayTrigger, Tooltip, Checkbox } from 'react-bootstrap';
import ModalInstance from '../../../static/layout/modalinstance';
@inject('generic_master_store', 'modal_store')
@observer
class newTenantID extends React.Component {
  constructor(props) {
    super(props);
    this.generic_master_store = this.props.generic_master_store;
    this.modal_store = this.props.modal_store;
    this.state = {
      newTenantID: '',
      service_name: '',
      custom_path: '',
      newExecutionMethod: '',
      selectedExecutionMethod: '',
      status: false,
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    }
  }

  componentWillMount() {
    this.generic_master_store.GetPropValues({ propertyArr: ['tenantIDs'] }, 'tenant');
  }
  addTenantID() {
    if (this.state.newTenantID !== '') {
      this.generic_master_store.tenantIDs.push({
          tenantName: this.state.newTenantID,
          executionMethod: this.state.newExecutionMethod
      });
      this.generic_master_store.tenantIDsArr.push(this.state.newTenantID);
      this.setState({ newTenantID: '', newExecutionMethod: '' });
    }
  }
  deleteTenantID(obj, index) {
    this.modal_store.modal.selectedTenantID = (index === 0) ? '' : 0;
    this.modal_store.modal.serviceName = 'DeleteTenantID';
    this.modal_store.modal.tenantID = obj.tenantName;
    this.modal_store.modal.tenantIDIndex = index;
    this.modal_store.modal.modal_title = 'Delete TenantID';
    this.modal_store.modal.modalBtnTxt = 'DeleteTenantID';
    this.modal_store.showModal(<p>Are you sure you want to delete tenantID : {obj.tenantName} ?</p>);
  }
  onTenantIDSelect(obj, index) {
    this.modal_store.modal.selectedTenantID = index;
    this.modal_store.modal.tenantID = obj.tenantName;
    this.modal_store.modal.tenantIDIndex = index;
  }
  saveTenantIDs() {
    this.setState({ service_name: 'UpdateTenantIDs', custom_path: '/Settings', newTenantID: '' }); //fix for #795
    if (this.generic_master_store.deletedTenantIDs.length !== 0 || this.generic_master_store.tenantIDs.length !== 0) {
      this.modal_store.modal.serviceName = 'UpdateTenantIDs';
      this.modal_store.modal.modal_title = 'Update TenantIDs';
      this.modal_store.modal.modalBtnTxt = 'SaveTenantIDs';
      this.modal_store.showModal(
        <p>Are you sure you want to update tenantIDs ?</p>);
    }
  }
  onExcecutionMethodSelect(event) {
    this.setState({ newExecutionMethod: event });
  }
  handleChange(event) {
    this.generic_master_store.tenantIDs[this.modal_store.modal.selectedTenantID].status = event.target.checked
  }
  render() {
    var executionMethodList = [];
    var emList = ['body', 'headers', 'query', 'uri'];
    const deletetenantTooltip = (<Tooltip id="tooltip-script-addordel"><strong>Delete</strong> this Tenant Id</Tooltip>)
    var tenantIDsList = this.generic_master_store.tenantIDs.map((obj, index) => {
      if (obj) {
        return (
          <ListGroupItem
            key={obj.tenantName + index + '_script'} name={index}
            onClick={this.onTenantIDSelect.bind(this, obj, index)}
            active={(index === this.modal_store.modal.selectedTenantID)}
            style={{ wordBreak: 'break-all' }}
          >
            <OverlayTrigger placement="left" overlay={deletetenantTooltip} >
              <Button disabled = {this.state.userCheck === false}
                className="pull-right btn btn-xs btn-danger"
                bsSize="xsmall" bsStyle="danger"
                onClick={this.deleteTenantID.bind(this, obj, index)}
              >
                <i className="fa fa-times"></i>
              </Button>
            </OverlayTrigger>
            {obj.tenantName}</ListGroupItem>
        );
      }
    });
    for (var x = 0; x < emList.length; x++) {
      executionMethodList.push(
        <span>
          <Radio
            name="newExecutionMethod" value={emList[x]}
            disabled={emList[x] === 'uri'}
            onChange={this.onExcecutionMethodSelect.bind(this, emList[x])} inline
          >{emList[x] === 'uri' ? emList[x].toUpperCase() : emList[x].charAt(0).toUpperCase() + emList[x].slice(1)}</Radio>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      );
    }
    var selectedTenantIDDetails = '';
    if ((this.generic_master_store.tenantIDs.length === 0 || this.modal_store.modal.selectedTenantID !== '') && this.generic_master_store.tenantIDs[this.modal_store.modal.selectedTenantID] !== undefined) {
      selectedTenantIDDetails = (<Row>
        <h3>Selected TenantID Details</h3>
        <FormGroup>
          <ControlLabel>TenantID</ControlLabel>
          <FormControl
            type="text" placeholder="TenantID" name="selectedTenantID" disabled
            value={this.generic_master_store.tenantIDs[this.modal_store.modal.selectedTenantID].tenantName}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Execution Method: </ControlLabel>
          <FormControl
            type="text" placeholder="ExecutonMethod" name="ExecutonMetho" disabled
            value={this.generic_master_store.tenantIDs[this.modal_store.modal.selectedTenantID]['executionMethod']}
          />
        </FormGroup>
        <FormGroup hidden={BACKEND !== 'LoopBack'}>
          <Checkbox name="status"  checked={this.generic_master_store.tenantIDs[this.modal_store.modal.selectedTenantID].status} onChange={this.handleChange.bind(this)} inline>Status</Checkbox>
        </FormGroup>
      </Row>);
    } else {

    }
    return (
      <div>
        <Row>
          <Row>
            <Col sm={4} md={4} lg={4}>
              <fieldset className="scheduler-border">
                <legend className="scheduler-border">New TenantID Form</legend>
                <div className="control-group">
                  <ControlLabel>Execution Method</ControlLabel>
                  <FormGroup key="executionMethodList">
                  {executionMethodList}
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <FormControl type="text" placeholder="Add New TenantID" value={this.state.newTenantID} onChange={(event) => this.setState({ newTenantID: event.target.value.replace(/^\s+|$/gm, '') }) } />
                      <InputGroup.Button>
                        <Button
                          bsStyle="success" style={{ fontSize: '15px' }}
                          disabled={this.state.newTenantID === '' || this.generic_master_store.tenantIDsArr.indexOf(this.state.newTenantID) !== -1 || this.state.newExecutionMethod === ''}
                          onClick={this.addTenantID.bind(this)}
                        >+</Button>
                      </InputGroup.Button>
                    </InputGroup>
                  </FormGroup>
                  <span hidden={!(this.generic_master_store.tenantIDsArr.indexOf(this.state.newTenantID) !== -1)} style={{ color: '#F4BA41' }}>tenantID already exists. Please enter different tenantID</span>
                </div>
              </fieldset>
            </Col>
            <Col sm={8} md={8} lg={8}>
                {selectedTenantIDDetails}
            </Col>
          </Row>
          <Row>
            <Col sm={4} md={4} lg={4}>
              <div hidden={this.generic_master_store.tenantIDs.length === 0}>
                <h4><b>Added TenantIDs</b></h4>
                <ListGroup>
                  {tenantIDsList}
                </ListGroup>
              </div>
              <div hidden={(this.generic_master_store.tenantIDs.length === 0 || this.modal_store.modal.selectedTenantID !== '') && this.generic_master_store.tenantIDs[this.modal_store.modal.selectedTenantID] !== undefined}>
                <span style={{ color: 'lightgray' }}>
                  {this.generic_master_store.tenantIDs.length === 0 ? 'Tenant IDs are not created yet. Please create tenantID' : 'Please select a Tenant ID to view its details.'}
                  </span>
              </div>
            </Col>
          </Row>
        </Row>
        <Row>
          <Button bsStyle="success" className="pull-right" onClick={this.saveTenantIDs.bind(this)} disabled={(this.generic_master_store.deletedTenantIDs.length === 0 && this.generic_master_store.tenantIDs.length === 0) || this.state.userCheck === false }>Save</Button>
        </Row>
        <ModalInstance
          custom_store={this.generic_master_store} custom_path={this.state.custom_path}
          custom_history={this.props.history} service_name={this.state.service_name} selectedTenantID={this.modal_store.modal.selectedTenantID}
        />
      </div>
    );
  }
}

newTenantID.propTypes = {
  store: React.PropTypes.object
};

export default newTenantID;
