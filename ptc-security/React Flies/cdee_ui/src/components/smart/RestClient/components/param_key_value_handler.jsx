/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import mobx from 'mobx';
import {observer} from 'mobx-react';
import {Row, Col, FormControl, ButtonToolbar, Button} from 'react-bootstrap'
import AlertContainer from 'react-alert';

@observer
class ParamKeyValues extends React.Component {
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

    showAlert = (msg) => {
      this.msg.show(msg, {
        type: 'error'
      })
    };
    alertOptions = {
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    };

    onChange(){

    }

    updateAttribute(event){
      var obj = {};
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

    updateRequestVars(tmp_arr){
      var obj={};
      for(var i=0;i<tmp_arr.length;i++){//as key and value are stored in array
        for(var j=0;j<tmp_arr[i].length;j++){ // to consider variables in keys also
          var temp_json = this.rest_client_store.extractTempRequestVariables(tmp_arr[i][j],this.attr_keyword);
          obj = Object.assign({},obj, temp_json);
        }
      }
      var temp_request_variables = this.rest_client_store.TempRequestVariables;
      temp_request_variables[this.attr_keyword]=obj;
      this.rest_client_store.setvalue('TempRequestVariables', temp_request_variables);
      this.rest_client_store.normRequestVariables();
    }

    deleteParams(index) {
      this.rest_client_store[this.attr_keyword].splice(index, 1);
      var tmp_arr = mobx.toJS(this.rest_client_store[this.attr_keyword]);
      this.updateRequestVars(tmp_arr);
    }

    addParams() {
      if(this.state.new_header_attr_key!==''  || this.state.new_header_attr_val!==''){
      var new_obj = [this.state.new_header_attr_key, this.state.new_header_attr_val];
      var tmp_arr = mobx.toJS(this.rest_client_store[this.attr_keyword])
      var keys = [];
      for(var k=0;k<tmp_arr.length;k++){ //to check uniqness of keys
        keys.push(tmp_arr[k][0])
      }
      if(keys.indexOf(this.state.new_header_attr_key)===-1){
        tmp_arr.push(new_obj);
        this.rest_client_store.setvalue(this.attr_keyword, tmp_arr);
        this.setState({'new_header_attr_key': '', 'new_header_attr_val': ''});
        this.updateRequestVars(tmp_arr);
      }
      else{
        this.showAlert('Key name shoud be uniq');
      }
    }
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
                        <FormControl key={key} type="text"  className = "navtab key-param" placeholder="Key" name={key} value={key} onInput={this.updateAttributeValues.bind(this, 'key', index)} onChange={this.onChange.bind(this)} readOnly/>
                    </Col>
                    <Col sm={4}>
                        <FormControl key={val} type="text"  className = "navtab key-param" placeholder="Value" name={key} value={val} onInput={this.updateAttributeValues.bind(this, 'value', index)} onChange={this.onChange.bind(this)} readOnly/>
                    </Col>
                    <Col sm={1}>
                        <ButtonToolbar>
                            <Button key={this.attr_keyword + '_deleteParams'} bsStyle="danger" className = "navtab key-param" onClick={this.deleteParams.bind(this, index)}><i className="fa fa-times"></i></Button>
                        </ButtonToolbar>
                    </Col>
                </Col>
              </Row>
            )
        })
        return (
            <div key={this.attr_keyword}>
                {attributes}
                <Row >
                <Col xs={12}  xsOffset ={2}>
                    <Col sm={4}>
                        <FormControl key={this.attr_keyword + '_newAttrKey'} className = "navtab key-param" type="text" placeholder="Key" name="new_header_attr_key" value={this.state.new_header_attr_key} onInput={ this.updateAttribute.bind(this) } onChange={this.onChange.bind(this)}/>
                    </Col>
                    <Col sm={4}>
                        <FormControl key={this.attr_keyword + '_newAttrVal'} className = "navtab key-param" type="text" placeholder="Value" name="new_header_attr_val" value={this.state.new_header_attr_val} onInput={ this.updateAttribute.bind(this)} onChange={this.onChange.bind(this)}/>
                    </Col>
                    <Col sm={1}>
                        <ButtonToolbar>
                            <Button key={this.attr_keyword + '_addAttr'} bsStyle="success" className = "navtab key-param" onClick={this.addParams.bind(this)}><i className="fa fa-plus"></i></Button>
                        </ButtonToolbar>
                    </Col>
                  </Col>
                </Row>
                <AlertContainer ref={a => this.msg = a} {...this.alertOptions}/>
            </div>
        )
    }
}

ParamKeyValues.propTypes = {
    store: React.PropTypes.object
};

export default ParamKeyValues;
