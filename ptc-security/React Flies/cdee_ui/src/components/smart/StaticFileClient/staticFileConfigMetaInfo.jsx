/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { FormGroup, FormControl, Button, Grid, Row, Thumbnail, Col, ControlLabel, Checkbox } from 'react-bootstrap';
import { inject, observer } from 'mobx-react';
import ModalInstance from '../../static/layout/modalinstance';
import StaticFileClientStore from '../../../stores/StaticFileClientStore';
import {NotificationContainer} from 'react-notifications';
import CodeMirror from 'react-codemirror';


@inject('generic_master_store', 'modal_store', 'breadcrumb_store')
@observer
class StaticFileConfigMetaInfo extends React.Component {
  constructor(props) {
    super(props);
    this.name =  this.props.match.params.name;
    this.client_store = new StaticFileClientStore(this.name)
    this.generic_master_store = this.props.generic_master_store
    this.modal_store = this.props.modal_store;
    this.breadcrumb_store = this.props.breadcrumb_store;

    this.state = {
      show_err_msg: false,
      updateMetaMsg:true
    };
  }
  componentWillMount() {
    this.client_store.setvalue('currentGroupName', this.generic_master_store.currentGroupName);
    this.client_store.setvalue('currentGroupType', this.generic_master_store.groupType);
    this.client_store.setvalue('currentTenantID', this.generic_master_store.tenantID);
    var PageName = 'MetaConfig:' + this.props.match.params.name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url};
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.client_store.getConfigMetaInfo;
  }

  onChange(event) {
    if(typeof event !== 'object') {
        this.client_store.setvalue('configMetaInfo',  JSON.parse(event));
    }else {
        if(event.target.name === 'isPersistence') {
            this.client_store.setvalue('isPersistance', event.target.checked);
        }else if(event.target.name === 'isCaching') {
            this.client_store.setvalue('isCaching', event.target.checked);
            this.client_store.setvalue('expiryTime', '1');
        }else if(event.target.name === 'expiryTime') {
            this.client_store.setvalue('expiryTime', event.target.value);
        }else if(event.target.name === 'title') {
            this.client_store.setvalue('title', event.target.value);
        }else {

        }
    }
    this.setState({updateMetaMsg:false})
  }

  handleSubmit() {
    this.setState({ updateMetaMsg: true });
    this.modal_store.modal.modalBtnTxt = 'Update';
    this.modal_store.modal.modal_title = 'Update ' + this.props.match.params.name + ' Meta Info';
    this.modal_store.showModal(<p>Are you sure you want to update metaInfo</p>);
  }

  render() {
    const codeOptions = {
      lineNumbers: false,
      mode: 'javascript',
      theme: 'dracula',
      smartIndent:true,
      readOnly: false
      };
////TODO : need to navigate the parenttemplate from edit desc of template
    return (
      <div>
        <Row>
          <Grid>
            <Col xs={8} xsOffset={2}>
              <h3>Update {this.props.match.params.name} Config Info</h3>
              <Thumbnail>
                <form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <ControlLabel>Title</ControlLabel>
                    <FormControl
                        type="text" placeholder="Title" name="title" value={this.client_store.title}
                        onChange={this.onChange.bind(this)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Meta Info</ControlLabel>
                  <CodeMirror id="metaConfig" onChange={this.onChange.bind(this)} value={JSON.stringify(this.client_store.configMetaInfo, null, 2)} options={codeOptions}/>
                  </FormGroup>
                  <FormGroup>
                    <Checkbox name="isPersistence"  checked={this.client_store.isPersistance} onChange={this.onChange.bind(this)} inline>isPersistance</Checkbox>
                  </FormGroup>
                  <FormGroup>
                    <Checkbox name="isCaching"  checked={this.client_store.isCaching} onChange={this.onChange.bind(this)} inline>Caching</Checkbox>
                  </FormGroup>
                  <FormGroup hidden={!this.client_store.isCaching}>
                    <ControlLabel>Expiry Time(sec)</ControlLabel>
                    <FormControl type="number" min="1" placeholder="expiryTime" name="expiryTime" value={this.client_store.expiryTime} onChange={this.onChange.bind(this)}/>
                  </FormGroup>
                  <Button
                    bsStyle="primary" onClick={this.handleSubmit.bind(this)} block disabled={this.state.updateMetaMsg}
                  >Update</Button>
                </form>
              </Thumbnail>
            </Col>
          </Grid>
        </Row>
        <ModalInstance
          custom_store={this.client_store}
          custom_history={this.props.history} service_name={'setConfigMetaInfo'}
          configName={this.props.match.params.name}
        />
        <NotificationContainer />
        {this.props.children}
      </div>
    );
  }
}

StaticFileConfigMetaInfo.propTypes = {
  store: React.PropTypes.object
};

export default StaticFileConfigMetaInfo;
