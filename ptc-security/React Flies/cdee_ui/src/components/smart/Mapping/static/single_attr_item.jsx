/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { ListGroupItem} from 'react-bootstrap'
import { inject, observer } from 'mobx-react';
import Box from '../dnd_elements/Box';
import Dropbin from '../dnd_elements/Dropbin';
import mobx from 'mobx';

import {getDataTypeStyle} from '../../../../lib/MappingLoggic'


@inject('breadcrumb_store')
@observer
class SingleAttrItem extends React.Component {
    constructor(props) {
        super(props);
        this.mapping_store = this.props.mapping_store;
        this.color_style = getDataTypeStyle(this.props.type);
    }

    componentWillMount() {
      // update client and host mappping schema
      if(this.props.which_side === 'Host'){
        this.props.mapping_store.configJson.SourceConfig.SelectedSchema[this.props.master_obj['typeName']] = mobx.toJS(this.props.Schema);
      }else if(this.props.which_side === 'Client'){
        this.props.mapping_store.configJson.DestinationConfig.SelectedSchema[this.props.master_obj['typeName']] = mobx.toJS(this.props.Schema);
      }else{
      }
    }


    render() {
        var list_item_group = [];
        var flip_ui = '';
        var style = {
          textAlign: 'right'
        };
        if(this.props.which_side === 'Client'){
          style = { float: 'right'}
        }
          if (this.props.show_key_box) { //This condition is used for text filter
            list_item_group.push(
            <ListGroupItem className="col-md-12 col-lg-12 col-sm-12" key={this.props.attrKey}>
              <div className={'col-md-10 col-lg-10 col-sm-10 ' + flip_ui} style={style}>
                {' '.repeat(this.props.indent)}
                <Box
                  data_store_type_name={this.props.data_store_type_name}
                  data_source_name={this.props.data_source_name}
                  master_obj={this.props.master_obj}
                  attrConcatKey={this.props.attrConcatKey}
                  mapping_store={this.mapping_store}
                  which_side={this.props.which_side}
                  name={this.props.attrKey}
                  type={this.props.type}
                  key_required = {this.props.key_required}
                  color_style={this.color_style}
                  mappable={this.props.mappable}
                  indent={this.props.indent}
                  mapping_store={this.props.mapping_store}
                  />
              </div>
              <div className={'col-md-2 col-lg-2 col-sm-2 ' + flip_ui}>
                <Dropbin
                  data_store_type_name={this.props.data_store_type_name}
                  data_source_name={this.props.data_source_name}
                  master_obj={this.props.master_obj}
                  attrConcatKey={this.props.attrConcatKey}
                  mapping_store={this.mapping_store}
                  which_side={this.props.which_side}
                  name={this.props.attrKey}
                  type={this.props.type}
                  key_required = {this.props.key_required}
                  color_style={this.color_style}
                  mappable={this.props.mappable}
                  mapping_store={this.props.mapping_store}
                  />
              </div>
            </ListGroupItem>
          );
          }

        return (
          <div>
            {list_item_group}
          </div>
        );
    }
}

SingleAttrItem.propTypes = {
    store: React.PropTypes.object
};

export default SingleAttrItem;
