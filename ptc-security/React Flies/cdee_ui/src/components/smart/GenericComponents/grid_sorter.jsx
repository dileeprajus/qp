/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Thumbnail, Row, Col, Badge, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { SortableContainer, SortableHandle, SortableElement, arrayMove } from 'react-sortable-hoc';
import ModalInstance from '../../static/layout/modalinstance';


@inject('generic_master_store', 'modal_store', 'mapping_store')

@observer

class GridSorter extends React.Component {
  constructor(props) {
    super(props);
    this.tempStore = this.props.tempStore;
    this.modal_store = this.props.modal_store;
    this.mappingStore = this.props.mapping_store;
    this.state = {
      items: this.props.things,
      userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
    };
  }

  componentWillMount() {
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({ items: arrayMove(this.state.items, oldIndex, newIndex) });
    this.setPriorityOrder();
    this.tempStore.setvalue('Configs', this.state.items);
  }
  setPriorityOrder() {
    for (var i = 0; i < this.state.items.length; i++) {
      this.props.generic_master_store.setConfigPriority(this.state.items[i].Name, i);
    }
  }
  navigateTo(title, tenantId, event) {
    this.props.tempStore.setvalue('currentTenantID', tenantId);
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    var temp=this.props.url.split('/');
    this.props.history.push('/'+temp[1] + '/' + event.target.value + '/' + event.target.name);
    if(this.props.tempStore.store_name === 'MappingStore') {
        this.props.tempStore.setvalue('newConfigTitle', title);
    }
  }

  deleteConfig(configName, tenantId) {
    this.props.tempStore.setvalue('currentTenantID', tenantId);
    this.props.generic_master_store.setvalue('tenantID', tenantId);
    this.modal_store.modal.modal_title = 'Deletion of ' + configName + ' Config';
    this.modal_store.modal.configName = configName;
    this.modal_store.modal.modalBtnTxt = 'DeleteConfig';
    if (this.props.tempStore === 'MappingStore' || BACKEND === 'LoopBack' ) {
      this.modal_store.showModal(<p>Are you sure you want to delete: {configName} Config</p>);
    } else {
      this.props.generic_master_store.getAllMappingsForConfig(configName, this.props.generic_master_store.groupType, this.callOpenModal.bind(this, configName));
    }
  }
  viewGroupConfigs(mappingConfig) {
    this.modal_store.modal.show = false;
    this.props.generic_master_store.setvalue('currentGroupName', mappingConfig.groupName);
    this.props.generic_master_store.setvalue('groupType', 'mapping');
    this.props.generic_master_store.setvalue('tenantID', mappingConfig.tenantId);
    this.mappingStore.setvalue('currentGroupName', mappingConfig.groupName);
    this.mappingStore.setvalue('currentGroupType', 'mapping');
    this.mappingStore.setvalue('currentTenantID', mappingConfig.tenantId);
    this.props.history.push('/Mapping/' + mappingConfig.groupName);
  }
  callOpenModal(configName) {
    var template = <span>Are you sure you want to delete: <b>{ configName } </b>Config</span>;
    var configMappings = []; var arr = [];
    if (this.props.generic_master_store.groupType === 'source') {
      configMappings = this.props.generic_master_store.mappingsForSource;
    } else configMappings = this.props.generic_master_store.mappingsForTarget;
    if (configMappings.length > 0) {
      for (var i = 0; i < configMappings.length; i++) {
        arr.push(
          <span>
          <br/>{'>'}<Link className="" key={configMappings[i].configName} to={'/Mapping/'+configMappings[i].groupName} onClick={this.viewGroupConfigs.bind(this, configMappings[i])}><font color="#3BAFDA">{configMappings[i].configName}</font></Link>
        </span>);
      }
      template = (
        <div id="mappingConfigsComponent">
          <b>The current config involves in following mappings. First delete below mappings and then delete current config.</b>
          {arr}
        </div>
      );
    }
    this.modal_store.showModal(<div>{template}</div>);
  }
  render() {
    const DragHandle = SortableHandle(() => <span><i className="fa fa-arrows" aria-hidden=""></i> </span>);
    const SortableItem = SortableElement(({ value, sortable }) => {
      var tempThingHeader = '';
      var fields = '';
      var metaInfoLink = '';
      var transactionLink = '';
      var tempDSType = value.DataSourceType;
        if (tempDSType === '') {
        tempDSType = 'Mapping';
        const MapCountToolTip = (<Tooltip id="MapCount"> There are {value.ConfigJson.mappingSpec.length} Mappings </Tooltip>);
        tempThingHeader = (
          <Row className="thingHeader">
            <Col xs={4}>
              <Badge
                className="badge_thing_name" style={{ backgroundColor: this.props.generic_master_store.short_name_tag_color[value.SelectedSourceType]['color'] }}>
                {value.SelectedSourceType}</Badge>
            </Col>
            <Col xs={4} className="badge-icon-position">
              <OverlayTrigger placement="top" overlay={MapCountToolTip} trigger={['hover', 'focus']}>
                <Badge className="badge_mapping_icon" bsStyle={value.ConfigJson.mappingSpec.length === 0 ? null : 'success'}>
                  <i className="fa fa-random fa-lg" aria-hidden="true"></i>
                </Badge>
              </OverlayTrigger>
            </Col>
            <Col xs={4}>
              <Badge
                className="badge_target_thing_name"
                style={{ backgroundColor: this.props.generic_master_store.short_name_tag_color[value.SelectedTargetType]['color'] ,top:'16px' }}>
               {value.SelectedTargetType}</Badge>
            </Col>
          </Row>
        );
      } else {
        tempThingHeader = (
          <div className="thingHeader">
            <Badge className="badge_thing_name" style={{ backgroundColor: this.props.generic_master_store.short_name_tag_color[tempDSType]['color'] }}>
                {this.props.generic_master_store.short_name_tag_color[tempDSType]['short_name']}</Badge>
            <Badge className="badge_canbeusable" bsStyle={value.CanBeUsable === false ? null : 'success'}>
              <i className="fa fa-check" aria-hidden="true"></i>
            </Badge>
          </div>
        );
      }
      var customName = value.Name;
      if (customName.indexOf('-') !== -1 && value.DataSourceType !== '') {
        customName = value.Name.split('-')[1];
      }
      if (tempDSType === 'Mapping') {
          fields = (
          <div>
            <h3>{value.Title}</h3>
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{customName}</p>
            <p className="test">{value.Description}</p>
          </div>
        );
      }else {
        fields = (
          <div>
            <h3 style={{wordWrap: 'break-word'}}>{customName}</h3>
            <p className="test">{value.Description}</p>
          </div>
        );
      }

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
      const btntransstyle = {
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
        const can_print_draggable = sortable? <DragHandle /> : '';
        const fontTag = (BACKEND === 'LoopBack')? <font color="red">|</font> : '';
        const transactionFont=(tempDSType!=='Mapping')?<font color="red">|</font>:'';// Conditional'Transaction' link font for Bug No. 323
        if(BACKEND === 'LoopBack') {
            metaInfoLink = (
              <Button style={btntransstyle} className="transaction-btn-txt-clr" name={value.Name} value={'MetaInfo'} onClick={this.navigateTo.bind(this,value.Title, value.tenantId ? value.tenantId : value.TenantID)}>Meta</Button>
            );
        }

        if(tempDSType!=='Mapping'){
          transactionLink=(<Button style={btntransstyle} className="transaction-btn-txt-clr" name={value.Name} value={'Summary'} hidden={tempDSType==='Mapping'} onClick={this.navigateTo.bind(this, value.Title, value.tenantId ? value.tenantId : value.TenantID)}>Transactions</Button>);
        }
        return (
        <Col key={(value.Group ? value.Group: '')+'-'+ value.Name+'-'+(value.tenantId ? value.tenantId : value.TenantID)} xs={12} sm={6} md={6} lg={4} >
          <Thumbnail className="thumbnail-height">
            {tempThingHeader}
            <div className="thingMainbody">
             {fields}
            </div>
            <div className="thingFooter">
              <Button style={btnviewstyle} className="view-btn-txt" name={value.Name} value={'Show'} onClick={this.navigateTo.bind(this, value.Title, value.tenantId ? value.tenantId : value.TenantID)}>View</Button>
              &nbsp;<font color="#ff8c1a">|</font>
              <Button style={btneditstyle} className="edit-btn-txt-clr" name={value.Name} value={'Edit'} onClick={this.navigateTo.bind(this, value.Title, value.tenantId ? value.tenantId : value.TenantID)}>Edit</Button>
              &nbsp;<font color="black">|</font>
                {transactionLink}&nbsp;{transactionFont}
                {metaInfoLink}&nbsp;{fontTag}
                <Button disabled = {this.state.userCheck === false} className="delete-txt-btn" style={btndelstyle} name={value.Name} onClick={this.deleteConfig.bind(this, value.Name, value.tenantId ? value.tenantId : value.TenantID)}>Delete</Button>
               <Button className="button-border pull-right" value="" bsStyle="link" disabled>{can_print_draggable}</Button>
            </div>
          </Thumbnail>
        </Col>
      );
    });
    const SortableList = SortableContainer(({ items, sortable }) => {
      return (
        <div>
            {items.map((value, index) =>
              <SortableItem key={`item-${index}`} index={index} sortable={sortable} value={value} />
            )}
        </div>
      );
    });
    return (
      <div className="">
        <SortableList axis="xy"
                      items={this.tempStore.Configs}
                      onSortEnd={this.onSortEnd}
                      sortable={true}
                      useDragHandle={true}
        />
      <ModalInstance
          custom_store={this.tempStore}
          groupType={this.props.generic_master_store.groupType}
          service_name={'Delete'}
      />
      </div>
    );
  }

}

GridSorter.propTypes = {
  store: React.PropTypes.object
};

export default GridSorter;
