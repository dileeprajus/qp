/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { ListGroupItem, ListGroup, Col } from 'react-bootstrap';
import 'codemirror/mode/xml/xml';

@observer
class ShowWsdls extends React.Component { //TODO : this should be moved to tempaltes folder
  constructor(props) {
    super(props);
    this.soap_client_store = this.props.soap_client_store;
    this.breadcrumb_store = this.props.breadcrumb_store;
    this.brs = this.props.brs;
    this.state = {
      selectwsdl:'',
      show: false,
      modalTitle : '',
      modalBody : ''
    }
  }

  showWsdl(event) {
    this.setState({ modalTitle: event.target.name, modalBody: this.soap_client_store.GroupWsdls['uploadedWSDLS'][event.target.name]['data'] });
    this.soap_client_store.setvalue('previousSelectedWsdl', this.soap_client_store.SelectedWsdl);
    this.soap_client_store.SelectedWsdl = event.target.name;
    if (this.soap_client_store.SelectedWsdl !== this.soap_client_store.previousSelectedWsdl && this.soap_client_store.previousSelectedWsdl !== '' ) {
      this.brs.setvalue('InputWSDLServiceName', '');
    }
    var configObj = this.soap_client_store.configJson;
    if (configObj['SelectedWsdl']) {
      if (configObj['SelectedWsdl'] === event.target.name) {
        this.brs.setvalue('InputWSDLServiceName', configObj['SelectedService']);
        this.brs.setvalue('requestXSDFromSoapEndPoint', configObj['SelectedRequestServiceXSD']);
        this.brs.setvalue('responseXSDFromSoapEndPoint', configObj['SelectedResponseServiceXSD']);
        this.brs.setvalue('InputWSDLElementName', configObj['SelectedInputElement']);
        this.brs.setvalue('OutputWSDLElementName', configObj['SelectedOutputElement']);
        this.brs.setvalue('InputWSDLEndPointUrl', configObj['SelectedEndPointUrl']);
        this.brs.setvalue('InputWSDLServicePortBinding', configObj['SelectedPortBinding']);
        this.brs.setvalue('InputWSDLServiceSoapAction', configObj['SelectedSoapAction']);
        this.brs.setvalue('responseXSD2Json', configObj['SelectedResponseSchema']);
        this.brs.setvalue('requestXSD2Json', configObj['SelectedRequestSchema']);
      }
    }
  }

  componentWillMount() {
  }

  render() {
    var wsdlsList = [];
    var wsdls = this.soap_client_store.GroupWsdls['uploadedWSDLS'];
    for (var ws in wsdls) {
      wsdlsList.push(
        <Col key={ws + 'wsdl_endpts'} xs={12} sm={6} md={6} lg={4}>
          <ListGroup  key={ws}>
            <ListGroupItem key={ws} name={ws} href="" className="SortableItem" onClick={this.showWsdl.bind(this)} active={(this.soap_client_store.SelectedWsdl === ws) ? true : false}>
             {ws}
            </ListGroupItem>
          </ListGroup>
        </Col>
      );
    }
    return (
      <div>
        {wsdlsList}
      </div>
    );
  }
}

ShowWsdls.propTypes = {
  store: React.PropTypes.object
};

export default ShowWsdls;
