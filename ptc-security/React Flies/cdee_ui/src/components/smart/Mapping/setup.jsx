/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import MappingConfig from '../GenericComponents/schema/map/mappingConfig';


@inject('breadcrumb_store', 'mapping_store')
@observer
class MappingSetup extends React.Component {
  constructor(props) {
    super(props);
    this.breadcrumb_store = this.props.breadcrumb_store;
  }

  componentWillMount() {
    var PageName = 'MappingSetup';
    this.breadcrumb_store.Bread_crumb_obj = {'name':PageName,'path':'/MappingSetup'};
    this.breadcrumb_store.pushBreadCrumbsItem();
  }

  render() {
    return (
      <MappingConfig mappingStore={this.props.mapping_store} />
    );
  }
}

MappingSetup.propTypes = {
  store: React.PropTypes.object
};

export default MappingSetup;
