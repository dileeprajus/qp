/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormGroup, ControlLabel, FormControl, Row, Col } from 'react-bootstrap';


@inject('breadcrumb_store')
@observer
class PlaceholderDetails extends React.Component {
  constructor(props) {
    super(props);
    this.masterComponent = this.props.masterComponent;
    this.currMapSpec = this.props.currMapSpec;
    this.state = {
      placeholderKey: this.currMapSpec[this.props.whichSide].placeholderKey,
      placeholderValue: this.currMapSpec[this.props.whichSide].placeholderValue
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if(this.props != nextProps) {
      this.masterComponent = this.props.masterComponent;
      this.currMapSpec = this.props.currMapSpec;
      this.state = {
        placeholderKey: this.currMapSpec[this.props.whichSide].placeholderKey,
        placeholderValue: this.currMapSpec[this.props.whichSide].placeholderValue
      };
    }
  }

  onChange(event) {
    this.state[event.target.name] = event.target.value;
      //attrPrefix
      this.currMapSpec[this.props.whichSide][event.target.name] = event.target.value;
        if(this.props.whichSide=='source'){
          this.currMapSpec[this.props.whichSide]['attrPrefix'] = event.target.value;
        }else{
          this.currMapSpec[this.props.whichSide]['attrPrefix'] = event.target.value;
        }
      if(this.currMapSpec['mappingConf']['placeHolders']===undefined){
        this.currMapSpec['mappingConf']['placeHolders']={}
      }
      if(this.currMapSpec['mappingConf']['placeHolders'][this.props.whichSide]===undefined){
        this.currMapSpec['mappingConf']['placeHolders'][this.props.whichSide]={}
      }
      this.currMapSpec['mappingConf']['placeHolders'][this.props.whichSide][event.target.name] = event.target.value;
      if(this.props.whichSide=='source'){
        this.currMapSpec['mappingConf']['placeHolders'][this.props.whichSide]['attrPrefix'] = this.currMapSpec.target.attrPrefix
      }
      else{
        this.currMapSpec['mappingConf']['placeHolders'][this.props.whichSide]['attrPrefix'] = this.currMapSpec.source.attrPrefix
      }
    this.setState({ value: event.target.value });
  }

  render() {
    var formComponent  = ''
    var ph_heading = '';
    if(this.props.whichSide==='source'){
      ph_heading = (
        <Col sm={6} md={6} lg={6} xs={6} style={{ textAlign: 'center' }}>
          Placeholder Value
        </Col>
      )
      formComponent = (<Col sm={6} md={6} lg={6} xs={6}>
        <FormControl
          type="text" key={this.props.currMapSpecIndex + 'placeholderValue'}
          placeholder="Placeholder value" name={'placeholderValue'}
          value={this.state.placeholderValue} onChange={this.onChange.bind(this)}
        />
      </Col>)
    }
    else{
      ph_heading = (
        <Col sm={6} md={6} lg={6} xs={6} style={{ textAlign: 'center' }}>
          Placeholder Key
        </Col>
      )
      formComponent = (
        <Col sm={6} md={6} lg={6} xs={6}>
          <FormControl
            type="text" key={this.props.currMapSpecIndex + 'placeholderKey'}
            placeholder="Placeholder key" name={'placeholderKey'}
            value={this.state.placeholderKey} onChange={this.onChange.bind(this)}
          />
        </Col>
      )
    }
    return (
      <div>
        <ControlLabel>{this.props.whichSide}</ControlLabel>
        <Row key="PlaceholderHeadings">
          {ph_heading}
        </Row>
        <Row key={'row_placeholderdetails'} >
          <FormGroup key={'form_placeholderdetails'} className="navtab">
            {formComponent}

          </FormGroup>
        </Row>
      </div>
    );
  }
}

PlaceholderDetails.propTypes = {
  store: React.PropTypes.object
};

export default PlaceholderDetails;
