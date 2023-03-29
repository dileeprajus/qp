/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Alert } from 'react-bootstrap';
@observer
class AlertInstance extends Component {
    constructor(props) {
        super(props);
    }
    handleAlertDismiss() {
    }
    render() {
        return (
            <Alert className="alert-style" bsStyle={this.props.modal_store.modal.show_alert_style===''? null:this.props.modal_store.modal.show_alert_style} hidden={!this.props.modal_store.modal.show_alert}> {this.props.modal_store.modal.show_alert_msg} </Alert>
        )
    }
}

export default AlertInstance;
