/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'

@inject('routing', 'breadcrumb_store')
@observer
class ThingFooter extends Component {
  render() {
    return (
      <div className="">
        <Link className="" to={this.props.url+'/Show/'+this.props.thing_name}><font color="#7BCFFF"> View </font></Link> &nbsp;|&nbsp;
        <Link className="" to={this.props.url+'/Edit/'+this.props.thing_name}><font color="red"> Edit </font></Link> &nbsp;|&nbsp;
        <Link to={this.props.url+'/Summary/'+this.props.thing_name}><font color="black"> Transactions </font></Link>&nbsp;
          <Link  className="fa-pull-right" to=""><font color="#6D6D6D"><i className="fa fa-crosshairs" aria-hidden="true"></i></font>
          </Link>
      </div>
    );
  }
}

ThingFooter.propTypes = {
  store: React.PropTypes.object
};
export default ThingFooter;
