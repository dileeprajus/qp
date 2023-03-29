/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col } from 'react-bootstrap';

@inject('routing', 'breadcrumb_store')
@observer


class Yearly extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Col>
                Yearly
            </Col>
        );
    }
}

Yearly.propTypes = {
    store: React.PropTypes.object
};

export default Yearly;
