/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import {Row, Col, FormControl,ButtonToolbar, Button} from 'react-bootstrap'

@observer
class FormdataParamHandler extends React.Component {
    constructor(props) {
        super(props);
        this.rest_client_store = this.props.rest_client_store;
        this.attr_keyword = this.props.attr_keyword;
        this.state ={
            'new_header_attr_key': '',
            'new_header_attr_val': ''
        }
    }

    componentWillMount() {

    }

    updateAttribute(event){
        var obj = {}
        obj[event.target.name] = event.target.value;
        this.setState(obj);
    }


    updateAttributeValues(type, index, event) {

        if(type ==='key'){
            this.rest_client_store[this.attr_keyword][index][0] = event.target.value;
        }else{
            this.rest_client_store[this.attr_keyword][index][1] = event.target.value;
        }
    }
    deleteParams(index) {
        this.rest_client_store[this.attr_keyword].splice(index, 1);
    }

    addParams() {
        var new_obj = [this.state.new_header_attr_key, this.state.new_header_attr_val];
        var tmp_arr = mobx.toJS(this.rest_client_store[this.attr_keyword])
        tmp_arr.push(new_obj);
        this.rest_client_store.setvalue(this.attr_keyword, tmp_arr);
        this.setState({'new_header_attr_key': '', 'new_header_attr_val': ''});
    }
    selectItem(event){
        this.rest_client_store.setvalue(this.props.attr_name, event);
    }

    render() {
        var attributes = this.rest_client_store[this.attr_keyword].map(obj => {
            var key = obj[0];
            var val = obj[1];
            var index = this.rest_client_store[this.attr_keyword].indexOf(obj);
            return (
                <Row key={this.attr_keyword + key}>
                    <Col key={key} xs={12}  xsOffset ={2}>
                        <Col sm={4}>
                            <form>
                                        <FormControl key={key} type="text"  className = "navtab key-param" placeholder="Key" name={key} value={key} onInput={this.updateAttributeValues.bind(this, 'key', index)}/>
                            </form>
                        </Col>
                        <Col sm={4}>
                            <FormControl key={val} type="text"  className = "navtab key-param" placeholder="Value" name={key} value={val} onInput={this.updateAttributeValues.bind(this, 'value', index)}/>
                        </Col>
                        <Col sm={1}>
                            <ButtonToolbar>
                                <Button key={this.attr_keyword + '_deleteParams'} bsStyle="danger" className = "navtab key-param" onClick={this.deleteParams.bind(this, index)}><i className="fa fa-times"></i></Button>
                            </ButtonToolbar>
                        </Col>
                    </Col>
                </Row>
            )
        });
        return (
            <div key={this.attr_keyword} >
                {attributes}
                <Row >
                    <Col xs={12}  xsOffset ={2}>
                        <Col sm={4}>
                                    <FormControl key={this.attr_keyword + '_newAttrKey'} className = "navtab key-param" type="text" placeholder="Key" name="new_header_attr_key" value={this.state.new_header_attr_key} onInput={ this.updateAttribute.bind(this) }/>
                        </Col>
                        <Col sm={4}>
                            <FormControl key={this.attr_keyword + '_newAttrVal'} className = "navtab key-param" type="text" placeholder="Value" name="new_header_attr_val" value={this.state.new_header_attr_val} onInput={ this.updateAttribute.bind(this) }/>
                        </Col>
                        <Col sm={1}>
                            <ButtonToolbar>
                                <Button key={this.attr_keyword + '_addAttr'} bsStyle="success" className = "navtab key-param" onClick={this.addParams.bind(this)}><i className="fa fa-plus"></i></Button>
                            </ButtonToolbar>
                        </Col>
                    </Col>
                </Row>
            </div>
        )
    }
}

FormdataParamHandler.propTypes = {
    store: React.PropTypes.object
};

export default FormdataParamHandler;
