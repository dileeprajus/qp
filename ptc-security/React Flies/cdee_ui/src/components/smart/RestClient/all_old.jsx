/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { observer } from 'mobx-react';
import { Thumbnail, Col,  Button, Row, Label, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { Link } from 'react-router-dom'

@observer
class AllRestClientThings extends React.Component {
  constructor(props) {
    super(props);
    this.rest_client_store = this.props.rest_client_store;
  }

  componentWillMount() {
    this.rest_client_store.getRestClients;
  }

render() {
    const ViewToolTip =  (<Tooltip id="RestView"> View Thing</Tooltip>);
    const EditToolTip =  (<Tooltip id="RestEdit"> Edit Thing</Tooltip>);
    const SummaryToolTip =  (<Tooltip id="RestSummary">Summary Transactions</Tooltip>);
    var rest_client_thing_tiles = [];
    this.rest_client_store.RestClients.map(rest_client_thing => {
      var canbe_usable = String(rest_client_thing.CanBeUsable);
        rest_client_thing_tiles.push(

            <Col key={rest_client_thing.Name}  xs={12} sm={6} md={6} lg={4}>
                <Thumbnail className = "fixedheight">
                    <p className="pull-right">
                        <OverlayTrigger placement="bottom" overlay={ViewToolTip}>
                          <Link className="" to={this.props.match.url+'/Show/'+rest_client_thing.Name}><i className="fa fa-eye custom-warning" aria-hidden="true"></i></Link>
                        </OverlayTrigger>&nbsp;&nbsp;
                        <OverlayTrigger placement="bottom" overlay={EditToolTip}>
                          <Link className="" to={this.props.match.url+'/Edit/'+rest_client_thing.Name}><i className="fa fa-pencil-square-o custom-success" aria-hidden="true"></i></Link>
                        </OverlayTrigger>&nbsp;
                         <OverlayTrigger placement="bottom" overlay={SummaryToolTip}>
                            <Link to={this.props.match.url+'/Summary/'+rest_client_thing.Name}><i className="fa fa-exchange custom-info"></i></Link>
                         </OverlayTrigger>
                    </p>

                    <h3>{rest_client_thing.Name}</h3>
                    <p>{rest_client_thing.Description}</p>
                    <p>
                       canBeUsable: <Label bsStyle={rest_client_thing.CanBeUsable? 'success' : 'danger'  }> {canbe_usable} </Label>
                    </p>
                </Thumbnail>

            </Col>


        );
    });


    return (
      <div>
        <Col xs={12}>
          <h3>RestClientThings.</h3>
        </Col>
          {rest_client_thing_tiles}
      </div>
    );
  }
}


AllRestClientThings.propTypes = {
  store: React.PropTypes.object
};

export default AllRestClientThings;
