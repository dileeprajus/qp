/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Col, ControlLabel, Radio,FormControl } from 'react-bootstrap'

@observer
class SelectDataFormat extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;

    this.state = {
        'hideDataFormat': (this.props.sourceType === 'schema_')? true : false
    }
  }

  componentWillMount() {
  }

  onChange(event){
    this.rest_client_store.setvalue(event.target.name, event.target.value);
    if (event.target.value === 'XML') {
        this.props.rest_client_store[this.props.sourceType + 'test_response'] = '<?xml version="1.0" encoding="UTF-8"?>';
    } else if (event.target.value === 'CSV') {
        this.props.rest_client_store[this.props.sourceType + 'test_response'] = '[]';
    } else if (event.target.value === 'JSON') {
        this.props.rest_client_store[this.props.sourceType + 'test_response'] = {};
    }
  }

  showDelimeterInput(){
    if(this.rest_client_store[this.props.sourceType+'current_data_format']==='CSV'){
      return false;
    }else{
      return true;
    }
  }


  render() {
    var option_list = this.rest_client_store.data_format_list.map(m => {
        return(
          <Radio key={m} name={this.props.sourceType+'current_data_format'} value={m} inline checked={(this.rest_client_store[this.props.sourceType+'current_data_format'] === m)? true : false } onChange={this.onChange.bind(this)}>{m}</Radio>
        )
      });

    return(
      <div hidden={this.state.hideDataFormat}>
      <Col xs={3}></Col>
      <Col xs={8} xsOffset ={4}>
          <div className="radio-btn-div ">
            <ControlLabel>&nbsp;&nbsp;&nbsp;&nbsp;Data Format:&nbsp;&nbsp;&nbsp;&nbsp; </ControlLabel>
            {option_list}
          </div>

          <div className="col-lg-4 col-md-4 col-sm-4 master_obj-div">
            <p className="delimeter-para">
              <FormControl  type="text" placeholder="Master Object" name={this.props.sourceType+'master_obj'} value={this.rest_client_store[this.props.sourceType+'master_obj']} onChange={this.onChange.bind(this)}/>
            </p>
          </div>

          <div className="col-lg-4 col-md-4 col-sm-4 delimeter-div">
            <p className="delimeter-para" hidden={this.showDelimeterInput()}>
              <FormControl  type="text" placeholder="Delimeter" name={this.props.sourceType+'csv_delimeter'} value={this.rest_client_store[this.props.sourceType+'csv_delimeter']} onChange={this.onChange.bind(this)}/>
            </p>
          </div>

      </Col>
      <Col xs={3}></Col>
    </div>
    )
  }
}

SelectDataFormat.propTypes = {
  store: React.PropTypes.object
};

export default SelectDataFormat;
