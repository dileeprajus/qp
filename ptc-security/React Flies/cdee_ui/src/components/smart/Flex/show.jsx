/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Col, Row } from 'react-bootstrap';
import BasicConfigInfoTable from '../../static/layout/basicinfotable';
import Navigator from '../GenericComponents/navigator';


import FlexStore from '../../../stores/FlexStore';
import SchemaBrowser from './schema_browser';

@inject('breadcrumb_store', 'generic_master_store')
@observer
class FlexThingShow extends React.Component {
  constructor(props) {
      super(props);
      // This is not creating new datasource
      const FlxStr = new FlexStore(this.props.match.params.name);
      this.flexstore = FlxStr;
      this.breadcrumb_store = this.props.breadcrumb_store;
  }


  componentWillMount() {
    this.flexstore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
    this.flexstore.setvalue('currentGroupType', this.props.generic_master_store.groupType);
    if (this.props.match.params.name.indexOf('-') !== -1) {
      var brd_name = this.props.match.params.name.split('-')[1];
    }else{
      brd_name = this.props.match.params.name;
    }
    var PageName = 'Show:' + brd_name;
    this.breadcrumb_store.Bread_crumb_obj = { name: PageName, path: this.props.match.url };
    this.breadcrumb_store.pushBreadCrumbsItem();
    this.flexstore.GetBasicConfigInfo(this.renderSchemaByTypeId.bind(this));
  }
  renderSchemaByTypeId(){
    if(this.flexstore.BasicConfigInfo) {
        if (this.flexstore.BasicConfigInfo.ConfigJson) {
            if (Object.keys(this.flexstore.BasicConfigInfo['ConfigJson']).length > 0) {
                var flexObj = this.flexstore.BasicConfigInfo.ConfigJson.SelectedTypeHierarchy;
                if (this.flexstore.BasicConfigInfo.ConfigJson.SelectedFlexObjects.length > 0) {
                    this.flexstore.GetSchemaByTypeID([{ flexObject: flexObj[flexObj.length - 1].flexObject, typeId: flexObj[flexObj.length - 1].typeId }]);
                }
            }
        }
    }
  }
  render() {
    return (
      <div>
        <Col xs={12}>
          <Row>
            <Navigator history={this.props.history} action={'Show'} type={'/Flex'} tempStore={this.flexstore} source={'Thing'}/>
          </Row>
          <BasicConfigInfoTable table_info={this.flexstore.BasicConfigInfo} temp_store={this.flexstore} />
          <SchemaBrowser Name={this.props.match.params.name} flexstore={this.flexstore} />
        </Col>
      </div>
    );
  }
}

FlexThingShow.propTypes = {
  store: React.PropTypes.object
};

export default FlexThingShow;
