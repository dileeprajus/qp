/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import {Button} from 'react-bootstrap'
import {observer } from 'mobx-react';
import MappingThingShow from '../show'

@observer
class ExampleOutPutData extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    rerenderOutput(){
    this.forceUpdate();

    }

    render() {
      var output = []
      if(this.props.mapping_store.configJson.MappingSchema.length > 0){
          output.push(<MappingThingShow key={this.props.mapping_store.name} name={this.props.mapping_store.name} show_table={false} />)
      }
        return (

          <div>
            <Button onClick={()=>{this.rerenderOutput()}}>Test</Button>
            {
              output
            }
          </div>
        );
    }
}

ExampleOutPutData.propTypes = {
    store: React.PropTypes.object
};

export default ExampleOutPutData;
