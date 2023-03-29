/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormControl, Col } from 'react-bootstrap';

@inject('routing', 'breadcrumb_store')
@observer


class Hourly extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange(event) {
        this.props.master_this.setState({ hour: event.target.value });
    }

    render() {
        let hour_options = [];
        for(let i=0;i<24; i++){
            hour_options.push(<option key={'hour_' + i.toString()} value={i}>{i}</option>);
        }
        return (
            <Col>
                <FormControl componentClass="select" placeholder="Select Freequency" onChange={this.handleChange.bind(this)} value={this.props.master_this.hour}>
                    {hour_options}
                </FormControl>
            </Col>
        );
    }
}

Hourly.propTypes = {
    store: React.PropTypes.object
};

export default Hourly;
