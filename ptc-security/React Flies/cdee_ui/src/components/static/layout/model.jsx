/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import { Button,Modal } from 'react-bootstrap';
import React, { Component } from 'react';
import {inject, observer } from 'mobx-react';

@inject('modal_store')
@observer

class Model extends Component {
    constructor(props) {
        super(props);
        this.modal_store = this.props.modal_store;

    }
    onSubmitBtn(){
        if(this.props.customstore) {
            this.modal_store.modal.show = true;
            this.modal_store.closeModal();
            this.props.customstore.CreateThing;

        }else if (this.props.customedit){
            this.modal_store.modal.show = true;
            this.modal_store.closeModal();
            this.props.customedit.SetHostProperties;
            this.props.customhistory.push(this.props.custompath+this.props.customedit.name);
        }
        else{
            this.modal_store.modal.show = false;
        }
    }

    onCancelBtn(){
        this.modal_store.modal.show = false;
        this.modal_store.closeModal();
    }
    render() {
        return (
            <div className="modal-container">
                <Modal show={this.modal_store.modal.show} onHide={this.close} aria-labelledby="contained-modal-title">
                    <Modal.Header>
                        <Modal.Title id="contained-modal-title">
                            {this.modal_store.modal_title}
                            <a onClick={this.modal_store.closeModal.bind(this.modal_store)} className="primary pull-right">X</a>
                        </Modal.Title>
                    </Modal.Header >
                    <Modal.Body className="modal-body">
                        {this.modal_store.modal.body}
                    </Modal.Body>
                    <Modal.Footer className="modal-footer" data-reactid="1758">
                        <Button bsStyle="default"  className="primary pull-default"  onClick={this.onCancelBtn.bind(this)}>Cancel</Button>
                        <Button bsStyle="primary" className="btn btn-primary" onClick={this.onSubmitBtn.bind(this)}>Submit</Button>
                    </Modal.Footer>
               </Modal>
            </div>
        );
    }
}

export default Model;
