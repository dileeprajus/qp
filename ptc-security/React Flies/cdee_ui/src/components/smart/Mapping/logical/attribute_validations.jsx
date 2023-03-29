/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {Table,Row,Label} from 'react-bootstrap'
import {observer } from 'mobx-react';

@observer
class AttributeValidations extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
      }
  }

  onChange(event) {

  }


  render() {

    var rows = [];
    for(var key in this.props.mapping_schema[this.props.index]['host']['validations']){
        if((JSON.stringify(this.props.mapping_schema[this.props.index]['host'][key]) === '[]' || JSON.stringify(this.props.mapping_schema[this.props.index]['host'][key]) === '{}')  && (JSON.stringify(this.props.mapping_schema[this.props.index]['client'][key]) === '[]' || JSON.stringify(this.props.mapping_schema[this.props.index]['client'][key]) === '{}')){
        }
        else{
          if(JSON.stringify(this.props.mapping_schema[this.props.index]['host'][key]) === '[]' || JSON.stringify(this.props.mapping_schema[this.props.index]['host'][key]) === '{}'){
            var td1 = <Label bsStyle="default"> NA </Label>
          }
          else{
            var td1 = <Label bsStyle={this.props.mapping_schema[this.props.index]['host']['validations'][key]? 'success' : 'danger'  }> {String(this.props.mapping_schema[this.props.index]['host']['validations'][key])} </Label>
          }

          if(JSON.stringify(this.props.mapping_schema[this.props.index]['client'][key]) === '[]' || JSON.stringify(this.props.mapping_schema[this.props.index]['client'][key]) === '{}'){
            var td2 = <Label bsStyle="default"> NA </Label>
          }
          else{
            var td2 = <Label bsStyle={this.props.mapping_schema[this.props.index]['client']['validations'][key]? 'success' : 'danger'  }> {String(this.props.mapping_schema[this.props.index]['client']['validations'][key])} </Label>
          }
          rows.push(
          <tr key={key}>
            <th>{key}</th>
            <td>{td1}</td>
            <td>{td2}</td>
          </tr>
          )
        }
    }

    return (
       <Row className="show-grid">
          <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Host to Client</th>
                  <th>Clinet to Host</th>
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </Table>
        </Row>
    );
  }
}

AttributeValidations.propTypes = {
    store: React.PropTypes.object
};

export default AttributeValidations;
