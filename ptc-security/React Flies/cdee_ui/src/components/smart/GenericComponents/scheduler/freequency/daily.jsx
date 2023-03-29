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


class Daily extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange(event){
        this.props.master_this.setState({day: event.target.value});
    }

    render() {
        return (
            <Col>
                <FormControl
                    type="text"
                    value={this.props.master_this.day}
                    placeholder="Enter text"
                    onChange={this.handleChange.bind(this)}
                />
            </Col>
        );
    }
}

Daily.propTypes = {
    store: React.PropTypes.object
};

export default Daily;
