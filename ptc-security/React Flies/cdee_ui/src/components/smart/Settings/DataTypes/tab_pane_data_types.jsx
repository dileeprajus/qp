/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import mobx from 'mobx';
import { observer } from 'mobx-react';
import { ListGroup, ListGroupItem, Col, Checkbox, FormGroup, FormControl, ControlLabel, Button, Panel } from 'react-bootstrap';

@observer
class TabPaneDataTypes extends React.Component {
  constructor(props) {
    super(props);
    this.type_manager_store = this.props.type_manager_store;
    this.state = {
      dataType: '',
      can_map_to: [],
      hideForm: true,
      hide_dataType_textbox: true,
      new_data_type: {},
      show_error_msg: false
    };
  }

  componentWillMount() {
    this.type_manager_store.GetDataTypes;
  }

  onSelect(event) {
    if (event.target.name === 'add_data_type') {
      var arr = [];
      Object.keys(this.type_manager_store.data_types).forEach(function(data_type) {
        arr.push({ value: data_type });
      });
      this.setState({ hide_dataType_textbox: false, dataType: '', color: '', can_map_to: arr, hideForm: false });
    } else {
      this.setState({ dataType: event.target.name, hide_dataType_textbox: true });
      this.setState({ color: this.type_manager_store.data_types[event.target.name]['color'] });

      var can_map_to_array = mobx.toJS(this.type_manager_store.data_types[event.target.name]['can_map_to']);
      var new_can_map = [];
      Object.keys(this.type_manager_store.data_types).forEach(function (data_type) {
        if (can_map_to_array.indexOf(data_type) === -1) {
          new_can_map.push({ value: data_type })
        } else {
          new_can_map.push({ value: data_type, selected: true })
        }
      });
      this.setState({ can_map_to: new_can_map });
    }
    if (this.state.dataType === ' ') {
      this.setState({ hideForm: true });
    } else {
      this.setState({ hideForm: false });
    }
  }

  onChange(event) {
    this.setState({ color: event.target.value });
    if (!this.state.hide_dataType_textbox) {
    } else {
      var temp = this.type_manager_store.data_types;
      temp[this.state.dataType][event.target.name] = event.target.value;
      this.type_manager_store.setvalue('data_types', temp);
    }
  }
  setDataTypeValue(event) {
    var arr = Object.keys(this.type_manager_store.data_types);
    var msg = false;
    if (arr.indexOf(event.target.value.toLowerCase()) === -1) {
      msg = false;
    } else msg = true;
    this.setState({ dataType: event.target.value, show_error_msg: msg });
  }
  selectItems(element, checked) {
    if (!this.state.hide_dataType_textbox) {
      var temp = this.state.new_data_type;
       if (Object.keys(temp).length === 0) {
         temp[this.state.dataType] = { can_map_to: [] };
         this.setState({ new_data_type: temp });
       }
     } else {
        var temp = this.type_manager_store.data_types;
     }
    var index = temp[this.state.dataType]['can_map_to'].indexOf(element)
    if (checked.target.checked === true) {
      if (index === -1) {
        temp[this.state.dataType]['can_map_to'].push(element);
      }
    } else {
      temp[this.state.dataType]['can_map_to'].splice(index, 1);
    }
    if (!this.state.hide_dataType_textbox) {
      this.setState({ new_data_type: temp });
    } else {
      this.type_manager_store.setvalue('data_types', temp);
    }
    this.setState({ dataType: this.state.dataType });
  }
  addDataType() {
    var obj = {};
    obj = this.state.new_data_type;
    if (obj[this.state.dataType] === undefined) {
      obj[this.state.dataType] = {};
    }
    obj[this.state.dataType]['color'] = this.state.color;
    if (obj[this.state.dataType]['can_map_to'] === undefined) {
      obj[this.state.dataType]['can_map_to'] = [];
    }
    var temp_obj = this.type_manager_store.data_types;
    if (temp_obj[this.state.dataType] === undefined) {
      temp_obj[this.state.dataType] = {};
    }
    temp_obj[this.state.dataType] = obj[this.state.dataType];
    this.type_manager_store.setvalue('data_types', temp_obj);
    this.setState({ hideForm: true });
  }

  render() {
    var opt = ['one', 'two', 'three'];
    var defaultOption = opt[0];
    var  addstyle = {
      color: 'red',
      background: 'white'
    };
    var data_types = [];
    var type = this;
    Object.keys(this.type_manager_store.data_types).forEach(function (data_type,index) {
      data_types.push(<ListGroupItem key={data_type} href="#" name={data_type} style={{ color: 'white', backgroundColor: type.type_manager_store.data_types[data_type]['color']}}>
       <span style={{ cursor: 'pointer' }} ><i className=" fa fa-remove pull-right" ></i></span>
      {data_type}</ListGroupItem>);
    });


    var data_type_objects = [];


    Object.keys(this.type_manager_store.data_types).forEach(function (data_type) {
      data_type_objects.push({ value: data_type });
    });


    var selected_data_types=[];
    if (this.type_manager_store.data_types[this.state.dataType] !== undefined) {
      this.type_manager_store.data_types[this.state.dataType]['can_map_to'].forEach(function(data_type) {
        selected_data_types.push(<h5 key={data_type}><font color={type.type_manager_store.data_types[data_type]['color']}>{data_type}</font></h5>)
      });
    }

    var modifiedObj = {}
    modifiedObj[this.state.dataType]=this.type_manager_store.data_types[this.state.dataType];
    var options = [];
    this.state.can_map_to.map(ac => {
        options.push(

          <Checkbox key={ac.value} onClick={this.selectItems.bind(this, ac.value)}><ListGroupItem key={'Datatype_' + ac.value} id={ac.value} >{ac.value}</ListGroupItem></Checkbox>
      )
    });

    return (
      <div>
        <Col xs={2}>
          <ListGroup onClick={this.onSelect.bind(this)}>
            {data_types}

            <ListGroupItem
              key="add_data_type" href="#" name="add_data_type"
              style={{ color: 'white', backgroundColor: 'lightgreen' }}
            >+Add</ListGroupItem>
          </ListGroup>
        </Col>

        <Col xs={9} hidden={this.state.hideForm}>
          <FormGroup>
            <Col xs={2}>
              <ControlLabel>DataType</ControlLabel>
            </Col>
            <Col xs={10}>
              <p
                className="delimeter-para" hidden={!this.state.hide_dataType_textbox}
              >{this.state.dataType}</p>
              <p className="delimeter-para" hidden={this.state.hide_dataType_textbox}>
                <FormControl
                  type="text" placeholder="Enter New DataType" name="dataType"
                  value={this.state.dataType} onChange={this.setDataTypeValue.bind(this)}
                />
                <span
                  hidden={!this.state.show_error_msg} style={{ color: 'red' }}
                ><ControlLabel> Data Type already exists. please enter new one</ControlLabel></span>
              </p>
            </Col>
            <Col xs={12}></Col>
            <Col xs={2}>
              <ControlLabel>Color</ControlLabel>
            </Col>
            <Col xs={2}>
              <FormControl
                type="color" placeholder="Enter Colorcode" name="color" value={this.state.color}
                onChange={this.onChange.bind(this)}
              />
            </Col>
          </FormGroup>
          <Col xs={12}></Col><Col xs={12}></Col><Col xs={12}></Col>
          <FormGroup>
            <Col xs={2}>
            <ControlLabel>Can MapTo</ControlLabel>
            </Col>
            <Col xs={3}>

              <ListGroup ref="myRef" id={this.state.can_map_to+'key'} data={this.state.can_map_to} disabled={this.state.dataType === ''}>
                {options}
               </ListGroup>

            </Col>
            <Col xs={2} hidden={this.state.hide_dataType_textbox}>
              <Button
                bsStyle="warning" className="pull-right" onClick={this.addDataType.bind(this)}
                disabled={this.state.show_error_msg || (this.state.dataType === '' || this.state.dataType === null)}
              >Add DataType</Button>
            </Col>
            <Col xs={5}>
              <Panel>
                <ControlLabel>Selected DataTypes: </ControlLabel>
                {selected_data_types}
              </Panel>
            </Col>
          </FormGroup>
        </Col>
        <Col xs={1} hidden={this.state.hideForm}>
          <Button
            bsStyle="success" className="pull-right"
            onClick={() => { this.type_manager_store.SetPropValues('data_types', modifiedObj, 'DataTypes'); }}
          >Save</Button>
        </Col>
      </div>
    );
  }
}

TabPaneDataTypes.propTypes = {
  store: React.PropTypes.object
};

export default TabPaneDataTypes;
