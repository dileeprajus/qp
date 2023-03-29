/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, FormGroup, FormControl, ListGroup, ListGroupItem, Row, InputGroup, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import GenericStatusMessage from '../../GenericComponents/generic_status_component';
import ModalInstance from '../../../static/layout/modalinstance';
import AlertContainer from 'react-alert';

@inject('generic_master_store', 'modal_store')
@observer
class applicationIDs extends React.Component {
    constructor(props) {
        super(props);
        this.generic_master_store = this.props.generic_master_store;
        this.modal_store = this.props.modal_store;
        this.state = {
            applicationID: '',
            selected_application_index: null,
            service_name: '',
            custom_path: '',
            dis_msg: false
        }
    }

    componentWillMount() {
    }
    showAlert = (msg) => {
        this.msg.show(msg, {
            type: 'error'
        })
    };
    addApplicationID() {
        var s_name = this.state.applicationID;
        if (s_name !== '' && s_name !== null) {
            this.generic_master_store.applicationIDs.push({
                name: this.state.applicationID
            });
            this.setState({
                applicationID: ''
            });
            this.modal_store.modal.saveBtnMsg = false;
        }else {
            this.showAlert('Please enter uniq name for application');
        }
    }
    saveApplicationIDs() {
        if (this.generic_master_store.applicationIDs.length !== 0) {
            this.modal_store.modal.modal_title = 'Save ApplicationIDs';
            this.setState({service_name: 'SetApplicationIDs'});
            this.modal_store.modal.serviceName = 'SetApplicationIDs';
            this.modal_store.modal.modalBtnTxt = 'SaveApplicationID';
            this.modal_store.showModal(<p>Are you sure you want to Save ApplicationIDs?</p>);
        }
    }
    getEdit(event) {
        this.setState({
            selected_script_index: event.target.name
        });
    }

    deleteApplicationID(obj, index) {
        this.setState({ service_name: 'DeleteApplicationID', custom_path: '/Settings' });
        this.modal_store.modal.selectedScriptIndex = index;
        this.modal_store.modal.serviceName = 'DeleteApplicationID';
        this.modal_store.modal.modal_title = 'Delete applicationID ?';
        this.modal_store.modal.modalBtnTxt = 'Delete';
        this.modal_store.showModal(
            <p>Are you sure you want to delete {obj.name}  ApplicationID ?</p>);
    }
    onChange(event) {
        var val = event.target.value.replace(/^\s+|\s{3}$/gm,'');
        this.setState({ applicationID: val.toUpperCase() })
        var Aid = this.generic_master_store.applicationIDs;
        for (var i = 0; i < Aid.length; i++) {
            if(Aid[i].name.toUpperCase() === event.target.value.toUpperCase()) {
                this.setState({dis_msg: true});
                return false;
            }else {
                this.setState({dis_msg: false});
            }
        }
    }
    render() {
        const del_applicationID_tooltip = (<Tooltip id="tooltip-script-addordel"><strong>Delete</strong> this applicationID</Tooltip>)
        var applicationIDList = this.generic_master_store.applicationIDs.map((obj, index) => {
            if (obj) {
                return (
                    <ListGroupItem
                        key={obj.name + index + '_script'} name={index}
                        active={(index == this.state.selected_application_index)}
                        style={{ wordBreak: 'break-all' }}
                    >
                        <OverlayTrigger placement="left" overlay={del_applicationID_tooltip} >
                            <Button
                                className="pull-right btn btn-xs btn-danger"
                                bsSize="xsmall" bsStyle="danger"
                                onClick={this.deleteApplicationID.bind(this, obj, index)}
                            >
                                <i className="fa fa-times"></i>
                            </Button>
                        </OverlayTrigger>
                        {obj.name.toUpperCase()}</ListGroupItem>
                );
            }
        });
        return (
            <div>
                <Row>
                    <Col sm={4} md={4} lg={4}>
                        <FormGroup validationState={this.state.dis_msg? 'warning' : null}>
                            <InputGroup>
                                <FormControl type="text" placeholder="Add New ApplicationID" value={this.state.applicationID} onChange={this.onChange.bind(this)} />
                                <InputGroup.Button>
                                    <Button
                                        bsStyle="success" style={{ fontSize: '15px' }}
                                        disabled = {this.state.applicationID === '' || this.state.dis_msg}
                                        onClick={this.addApplicationID.bind(this)}
                                    >+</Button>
                                </InputGroup.Button>
                            </InputGroup>
                            <span hidden={!this.state.dis_msg} style={{ color: '#F4BA41' }}>Application ID already exists</span>
                        </FormGroup>
                        <div hidden={this.generic_master_store.applicationIDs.length === 0}>
                            <b>Added ApplicationIDs</b>
                            <ListGroup>
                                {applicationIDList}
                            </ListGroup>
                        </div>
                        <div hidden={this.generic_master_store.applicationIDs.length !== 0}>
                            <GenericStatusMessage statusMsg={'Application IDs are not created yet. Please create Application ID'} />
                        </div>
                          <Button bsStyle="success" className="pull-right" disabled = {this.state.dis_msg || this.modal_store.modal.saveBtnMsg} onClick={this.saveApplicationIDs.bind(this)}>Save</Button>
                    </Col>
                </Row>
                <ModalInstance
                    custom_store={this.generic_master_store} custom_path={this.state.custom_path} selectedScriptIndex={this.state.selected_application_index}
                    custom_history={this.props.history} service_name={this.state.service_name}
                />
                <AlertContainer ref={a => this.msg = a} {...this.alertOptions}/>
            </div>
        );
    }
}

applicationIDs.propTypes = {
    store: React.PropTypes.object
};

export default applicationIDs;
