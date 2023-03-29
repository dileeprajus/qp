/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

 * Unauthorized copying of this file via any medium is strictly prohibited

 * See LICENSE file in the project root for full license information

 */
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Thumbnail, Row, Col, Button, Tooltip, OverlayTrigger, Popover, Modal, FormGroup, ControlLabel, FormControl, Panel, Checkbox, Badge } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import renderHTML from 'react-render-html';
import {NotificationContainer, NotificationManager} from 'react-notifications';

@inject('generic_master_store', 'modal_store', 'mapping_store')

@observer

class MailTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.generic_master_store = this.props.generic_master_store;
        this.client_store = this.props.client_store;
        this.state = {
            show: false,
            isActive: false,
            modalTitle:'',
            modalBody:'',
            modalFooter:'',
            disable_btn:false,
            script_valid_msg: false,
            disabled_msg: false
        }
    }

    componentWillMount() {
      this.reset();
      this.generic_master_store.getSopTemplates();
    }

    addMailTemplate() {
      this.reset();
      this.setState({show: true, modalTitle: 'New Template', modalBody:'create', modalFooter: 'create'});
    }

    handleChange(event) {
        var mailTempConf = this.generic_master_store.mailTemplateConfig;
        if(event.target.name === 'templateName') {
            mailTempConf.templateName = event.target.value;
            var mTempArray = this.generic_master_store.mailTemplatesList;
            for (var i = 0; i < mTempArray.length; i++) {
                if( (event.target.value !== '') && (mTempArray[i].templateName.toLowerCase() === event.target.value.toLowerCase()) &&
                    (mTempArray[i].tenantId === mailTempConf.tenantId) && (mTempArray[i].configName === mailTempConf.configName)
                    && (mTempArray[i].groupType === mailTempConf.groupType) && (mTempArray[i].groupName === mailTempConf.groupName)) {
                    this.setState({disabled_msg:true});
                    return false;
                }else {
                    this.setState({disabled_msg:false});
                }
            }
        }else if(event.target.name === 'templateSubject') {
            mailTempConf.templateSubject = event.target.value;
        }else if(event.target.name === 'tRecipients') {
            mailTempConf.tRecipients = event.target.value;
        }else if(event.target.name === 'sopType') {
            mailTempConf.sopType = event.target.value;
        }else if(event.target.name === 'isActive') {
            mailTempConf.isActive = event.target.checked;
            this.setState({isActive : event.target.checked});
        }else {

        }
        this.generic_master_store.setvalue('mailTemplateConfig', mailTempConf);
    }

    scriptChange(value) {
        var mailTempConf = this.generic_master_store.mailTemplateConfig;
            mailTempConf.script = value.split('\n');
        this.generic_master_store.setvalue('mailTemplateConfig', mailTempConf);
        if(value === '') {
            this.setState({disable_btn:false});
        }else {
            this.setState({disable_btn:true});
        }
    }

    testScript() {
       this.generic_master_store.validateScriptForTemplate(this.scriptErrCb.bind(this));
    }

    scriptErrCb(type) {
        if (type === 'Fail') {
           this.setState({script_valid_msg: true});
        }
    }

    testHtmlCode() {
        this.generic_master_store.getTemplatePreview();
    }

    reset() {
        this.generic_master_store.setvalue('mailTemplateConfig', {
           groupName : this.client_store.currentGroupName,
           groupType : this.client_store.currentGroupType,
           configName : this.client_store.name,
           tenantId : this.client_store.currentTenantID,
           applicationId : '',
           templateName  : '',
           templateSubject:'',
           tRecipients:'',
           isActive:false,
           script: [],
           template:'',
           sopType:'',
           data:{}
        });
        this.generic_master_store.setvalue('htmlResponse', '');
        this.setState({isActive : false});
    }


    testMail() {
      this.generic_master_store.triggerSopEvent(this.mailStatus.bind(this));
    }

    mailStatus(status) {
        if (status === 'true') {
            NotificationManager.success('TestMail sent Successfully', 'Success', 1000);
        } else {
            NotificationManager.warning('TestMail failed', 'Error', 1000);
        }
    }

    saveTemplate() {
       this.generic_master_store.saveSopTemplate();
       this.closeModal()
    }

    viewTemplate(template) {
       this.setState({show: true, modalTitle: template.templateName, modalBody:'view'});
        var mailTempConf = this.generic_master_store.mailTemplateConfig;
            mailTempConf.template = template.template;
            mailTempConf.templateName = template.templateName;
            mailTempConf.templateSubject = template.templateSubject;
            mailTempConf.tRecipients = template.tRecipients;
            mailTempConf.groupName = template.groupName;
            mailTempConf.groupType = template.groupType;
            mailTempConf.configName = template.configName;
            mailTempConf.tenantId = template.tenantId;
            mailTempConf.sopType = template.sopType;
            mailTempConf.isActive = template.isActive;
            mailTempConf.script = template.script;
        this.generic_master_store.setvalue('mailTemplateConfig', mailTempConf);
        this.setState({isActive : template.isActive});
    }

    editTemplate(template) {
        var mailTempConf = this.generic_master_store.mailTemplateConfig;
            mailTempConf.template = template.template;
            mailTempConf.templateName = template.templateName;
            mailTempConf.templateSubject = template.templateSubject;
            mailTempConf.tRecipients = template.tRecipients;
            mailTempConf.groupName = template.groupName;
            mailTempConf.groupType = template.groupType;
            mailTempConf.configName = template.configName;
            mailTempConf.tenantId = template.tenantId;
            mailTempConf.sopType = template.sopType;
            mailTempConf.isActive = template.isActive;
            mailTempConf.script = template.script;
        this.generic_master_store.setvalue('mailTemplateConfig', mailTempConf);
        this.generic_master_store.htmlResponse = '';
        this.setState({isActive : template.isActive});
        this.setState({disable_btn:true});
        this.setState({show: true, modalTitle: template.templateName, modalBody:'create', modalFooter: 'create'});
    }

    deleteTemplate(template) {
        var mailTempConf = this.generic_master_store.mailTemplateConfig;
            mailTempConf.templateName = template.templateName;
            mailTempConf.groupName = template.groupName;
            mailTempConf.groupType = template.groupType;
            mailTempConf.configName = template.configName;
            mailTempConf.tenantId = template.tenantId;
        this.generic_master_store.setvalue('mailTemplateConfig', mailTempConf);
        this.generic_master_store.deleteSopTemplate();
        NotificationManager.success('Template Deleted Successfully', 'Success', 1000);
    }

    closeModal() {
      this.setState({ show: false });
    }

    onChangeHtml(event) {
        var mailTempConf = this.generic_master_store.mailTemplateConfig;
        mailTempConf.template = event;
        this.generic_master_store.setvalue('mailTemplateConfig', mailTempConf);
    }
    enableSop(event) {
      var tempConfig = this.client_store.configJson;
        if(event.target.name === 'enableSOP') {
           tempConfig['enableSOP'] = event.target.checked;
        }else {
           tempConfig['executeSOP'] = event.target.value;
        }
      this.client_store.setvalue('configJson', tempConfig);
    }
    render() {
       var enableSOP = ['ALL', 'PULL', 'PUSH', 'SCHEDULER'];
       var sopTypes = ['MAIL', 'SMS', 'FR'];
        var sopList = [];
        var sopTempList = [];
        var enableSOPList = [];
        sopTypes.map(type => {
            sopList.push(
                <option key={type} value={type}>{type}</option>
            );
        });
       var test_script_tooltip = (<Tooltip id="tooltip-script-test"><strong>Test </strong> this Script.</Tooltip>);
       var test_htmlcode = (<Tooltip id="tooltip-htmlcode-test"><strong>Preview </strong> this HTML Code.</Tooltip>);

       var codeOptions = {
         lineNumbers: true,
         mode: 'javascript'
       };
       var viewerCodeOptions = {
          lineNumbers: false,
          mode: 'javascript',
          theme: 'dracula',
          smartIndent: true,
          readOnly: true
       };
        var htmlCodeOptions = {
            lineNumbers: true,
            mode: 'text/html',
            theme: 'dracula'
        };
        var addStyle = {
            color: 'orange',
            background: '#f7f7f7'
        };
        const btnviewstyle = {
            backgroundColor: 'white',
            color: '#3BAFDA',
            border: 'none',
            boxShadow: 'none'
        };
        const btneditstyle = {
            backgroundColor: 'white',
            border: 'none',
            boxShadow: 'none'
        };
        const btndelstyle = {
            color:'red',
            backgroundColor: 'white',
            border: 'none',
            boxShadow: 'none'
        };

        enableSOP.map(type => {
            enableSOPList.push(
                <option key={type} value={type}>{type}</option>
            );
        });
        this.generic_master_store.mailTemplatesList.map(template => {
            const popoverBottom = (
                <Popover id="popover-trigger-hover-focus" title="Recipients">
                    <strong>{template.tRecipients.split(',').join('\n')}</strong>
                </Popover>
            );
            sopTempList.push(
                <Col key={template.groupName+'-'+template.tenantId+'-'+template.configName+'-'+template.templateName} xs={6} sm={4} md={4} lg={3}>
                    <Thumbnail className="thumbnail-height">
                        <Col className="thingHeader">
                            <Badge
                                className="badge_thing_name" style={{ backgroundColor: '#6b6ecd'}}>
                                {template.sopType}</Badge>
                        </Col>
                        <div className="thingMainbody">
                            <div><strong>TemplateName: </strong><span className="test">{template.templateName}</span></div>
                            <div><strong>Active: </strong>{(template.isActive === false) ? 'false' : 'true'}</div>
                            <div><strong>Recipients: </strong><span className="test">{template.tRecipients.split(',')[0]}</span>
                                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popoverBottom}>
                                <Badge>{template.tRecipients.split(',').length}</Badge>
                                </OverlayTrigger>
                            </div>
                        </div>
                        <div className="thingFooter">
                            <Button style={btnviewstyle} className="view-btn-txt" name={template.templateName} value={'Show'} onClick={this.viewTemplate.bind(this, template)}>View</Button>
                            &nbsp;<font color="#ff8c1a">|</font>
                            <Button style={btneditstyle} className="edit-btn-txt-clr" name={template.templateName} value={'Edit'} onClick={this.editTemplate.bind(this, template)}>Edit</Button>
                            &nbsp;<font color="black">|</font>
                            <Button className="delete-txt-btn" style={btndelstyle} name={template.templateName} onClick={this.deleteTemplate.bind(this, template)}>Delete</Button>
                        </div>
                    </Thumbnail>
                </Col>
            );
        });
        var data = '';
        if(this.state.script_valid_msg === true) {
            data = (<div><span> Enter Valid script (or) No data from Source</span></div>)
        }else {
            data = (<CodeMirror value={JSON.stringify(this.generic_master_store.mailTemplateConfig.data,null,2)} options={viewerCodeOptions}/>)
        }

       var bodyContent = '', footerContent = '';
        if(this.state.modalBody === 'create'){
            bodyContent = (
                <FormGroup>
                    <Row>
                        <Col>
                            <Col xs={3} md={3} lg={3}>
                                <ControlLabel>SOP Type</ControlLabel>
                            </Col>
                            <Col xs={9} md={9} lg={9}>
                                <Row>
                                    <Col xs={8} md={8} lg={8}>
                                        <FormGroup>
                                            <FormControl componentClass="select" name="sopType" placeholder="select" onChange={this.handleChange.bind(this)} value={this.generic_master_store.mailTemplateConfig.sopType}>
                                                <option key='Default'  value="SelectSOPType">Select SOP Type</option>
                                                {sopList}
                                            </FormControl>
                                        </FormGroup>
                                    </Col>
                                    <Col xs={4} md={4} lg={4}>
                                        <FormGroup>
                                            <Checkbox name="isActive"  checked={this.state.isActive} onChange={this.handleChange.bind(this)} inline>Active</Checkbox>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Col xs={3} md={3} lg={3}>
                                <ControlLabel>Template Name:</ControlLabel>
                            </Col>
                        </Col>
                        <Col>
                            <Col xs={9} md={9} lg={9}>
                                <FormGroup controlId="formTemplateName" validationState={this.state.disabled_msg? 'warning' : null}>
                                    <FormControl type="text" value={this.generic_master_store.mailTemplateConfig.templateName}
                                                 name="templateName" placeholder="Template Name" onChange={this.handleChange.bind(this)}/>
                                    <span hidden={!this.state.disabled_msg} style={{ color: '#F4BA41' }}>TemplateName already existed</span>
                                </FormGroup>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Col xs={3} md={3} lg={3}>
                                <ControlLabel>Template Subject:</ControlLabel>
                            </Col>
                        </Col>
                        <Col>
                            <Col xs={9} md={9} lg={9}>
                                <FormGroup controlId="TemplateSubjectId">
                                    <FormControl type="textarea" value={this.generic_master_store.mailTemplateConfig.templateSubject}
                                                 name="templateSubject" placeholder="Template Subject" onChange={this.handleChange.bind(this)}/>
                                </FormGroup>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Col xs={3} md={3} lg={3}>
                                <ControlLabel>Template Recipients:</ControlLabel>
                            </Col>
                        </Col>
                        <Col>
                            <Col xs={9} md={9} lg={9}>
                                <FormGroup controlId="tRecipients">
                                    <FormControl type="email" value={this.generic_master_store.mailTemplateConfig.tRecipients}
                                                 name="tRecipients" placeholder="Template Recipients" onChange={this.handleChange.bind(this)}/>
                                </FormGroup>
                            </Col>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} md={6} lg={6}>
                            <FormGroup>
                                <ControlLabel>Template Script</ControlLabel>
                                <OverlayTrigger placement="left" overlay={test_script_tooltip}>
                                    <Button
                                        className="pull-right"
                                        bsSize="xsmall"
                                        bsStyle="info"
                                        onClick={this.testScript.bind(this)}
                                    >
                                        <i className="fa fa-flask"></i>
                                    </Button>
                                </OverlayTrigger>
                                <CodeMirror
                                    value={this.generic_master_store.mailTemplateConfig.script.join('\n')}
                                    onChange={this.scriptChange.bind(this)} options={codeOptions}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={6} md={6} lg={6}>
                                <ControlLabel>Output</ControlLabel>
                            {data}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} sm={6} md={6} lg={6}>
                            <FormGroup className="mail-temaplate-html-editor">
                                <ControlLabel>Template Editor</ControlLabel>
                                <OverlayTrigger placement="left" overlay={test_htmlcode}>
                                    <Button
                                        className="pull-right"
                                        bsSize="xsmall"
                                        bsStyle="info"
                                        onClick={this.testHtmlCode.bind(this)}
                                    >
                                        <i className="fa fa-video-camera" aria-hidden="true"></i>
                                    </Button>
                                </OverlayTrigger>
                                <CodeMirror
                                    value={this.generic_master_store.mailTemplateConfig.template}
                                    onChange={this.onChangeHtml.bind(this)} options={htmlCodeOptions}
                                />
                            </FormGroup>
                        </Col>
                        <Col xs={6} md={6} lg={6}>
                            <ControlLabel>Template Preview</ControlLabel>
                            <Panel style={{backgroundColor: 'aliceblue', overflow:'auto'}}>
                                {renderHTML(this.generic_master_store.htmlResponse)}
                            </Panel>
                        </Col>
                    </Row>
                </FormGroup>
            );
            footerContent = (
                <FormGroup>
                    <p className="pull-left">
                        <Button className="" name="testMail" bsSize="small" bsStyle="warning"
                                onClick={this.testMail.bind(this)}>TestMail</Button>
                    </p>
                    <p className="pull-right">
                        <Button className="" name="reset" bsSize="small" bsStyle="primary"
                                onClick={this.reset.bind(this)}>Reset</Button>&nbsp;&nbsp;
                        <Button className="" name="saveTemplate" bsSize="small" bsStyle="success"
                                onClick={this.saveTemplate.bind(this)}
                                disabled={this.generic_master_store.mailTemplateConfig.templateName === '' ||
                                this.generic_master_store.mailTemplateConfig.templateSubject === '' ||
                                this.generic_master_store.mailTemplateConfig.tRecipients === '' ||
                                this.generic_master_store.mailTemplateConfig.sopType === '' ||
                                this.generic_master_store.mailTemplateConfig.template === '' ||
                                !this.state.disable_btn ||
                                this.state.disabled_msg
                                }>Save</Button>&nbsp;&nbsp;
                        <Button className="" name="testMail" bsSize="small" onClick={this.closeModal.bind(this)}>Close</Button>
                    </p>
                </FormGroup>
            );
        }else {
            bodyContent = (
                <CodeMirror value={JSON.stringify(this.generic_master_store.mailTemplateConfig,null,2)}  options={viewerCodeOptions}/>
            )
        }

      return (
        <div>
            <Col xs={12}>
              <Panel>
                  <Col xsOffset={1} xs={3} md={3} lg={3}>
                      <FormGroup>
                          <Checkbox name="enableSOP"  checked={this.client_store.configJson.enableSOP} onChange={this.enableSop.bind(this)} inline><ControlLabel>Enable SOP</ControlLabel></Checkbox>
                      </FormGroup>
                  </Col>
                  <Col xs={8} md={8} lg={8}>
                      <ControlLabel>Execution SOP Mode:</ControlLabel>
                        <FormGroup>
                           <FormControl componentClass="select" name="sopType" placeholder="select" onChange={this.enableSop.bind(this)} value={this.client_store.configJson.executeSOP}>
                              <option key='Default'  value="">Select Execution Mode</option>
                               {enableSOPList}
                           </FormControl>
                      </FormGroup>
                  </Col>
                </Panel>
            </Col>
           <Col key={'templateNew'} xs={6} sm={4} md={4} lg={3}>
             <Thumbnail className="thumbnail-height thumbnail-select">
                <Button className="newthing-button" onClick={this.addMailTemplate.bind(this)}>
                    <div  style={addStyle}>
                        <div className="newthing-font-icon"><i className="fa fa-plus-circle " aria-hidden="true"></i></div>
                        <h1>Create New Template</h1>
                    </div>
                </Button>
             </Thumbnail>
           </Col>
            <Col>
                {sopTempList}
            </Col>
            <Modal
                show={this.state.show}
                onHide={this.closeModal.bind(this)}
                container={this}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-lg">{this.state.modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {bodyContent}
                </Modal.Body>
                <Modal.Footer>
                  {footerContent}
                </Modal.Footer>
            </Modal>
            <NotificationContainer />
        </div>
      );
    }
}

MailTemplate.propTypes = {
    store: React.PropTypes.object
};

export default MailTemplate;
