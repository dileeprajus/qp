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


class Weekly extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange(event) {
        this.props.master_this.setState({ week: event.target.value });
    }

    render() {
        let week_options = [];
        for (let i = 1; i <= 7; i++) {
            week_options.push(<option key={'week_' + i.toString()} value={i}>{i}</option>);
        }
        return (
            <Col>
                <FormControl componentClass="select" placeholder="Select Freequency" onChange={this.handleChange.bind(this)} value={this.props.master_this.week}>
                    {week_options}
                </FormControl>
            </Col>
        );
    }
}

Weekly.propTypes = {
    store: React.PropTypes.object
};

export default Weekly;
