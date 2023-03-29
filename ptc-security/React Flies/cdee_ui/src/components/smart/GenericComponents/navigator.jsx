/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import { MenuItem, DropdownButton } from 'react-bootstrap';

@inject('generic_master_store')
@observer

class Navigator extends React.Component {
    constructor(props) {
        super(props);
        this.tempStore = this.props.tempStore;
        this.state = {
            dir: true,
            userCheck : (this.props.generic_master_store.userGroupName === 'Admin')?true : false
        };
    }

    componentWillMount() {
    }

  onActionSelect(event) {
    event = event.split(' ').join('');
    if (this.props.source === 'Thing') {
      if (event === 'Show') {
        this.props.history.push(this.props.type + '/Show/' + this.tempStore.name);
      } else if (event === 'Edit') {
        this.props.history.push(this.props.type + '/Edit/' + this.tempStore.name);
      } else if(event === 'Transactions') {
        this.props.history.push(this.props.type + '/Summary/' + this.tempStore.name);
      } else if (event === 'Delete') {
        this.props.delete();
      } else if (event === 'Save') {
        this.props.save();
      } else if (event === 'Endpoints') {
        this.props.tempStore.setvalue('currentGroupName', this.props.generic_master_store.currentGroupName);
        this.props.history.push(this.props.type+'/'+(this.props.tempStore.currentGroupName?this.props.tempStore.currentGroupName:this.props.tempStore.name.split('-')[0]));
      } else if (event === 'DownloadConfig') {
        this.props.downloadConfig();
      }
      else {
      }
    } else if (this.props.source === 'Template') {
      if (event === 'Endpoints') {
          var tmpPathName=this.props.history.location.pathname.split('/');
        this.props.history.push(this.props.type+'/'+tmpPathName[tmpPathName.length-1]);
      } else if (event === 'Dashboard') {
        this.props.history.push('/Dashboard');//changed for the dashboard navigation
      } else {
        this.props.history.push('/' + event);
      }
    } else if (event === 'archivedGroups') {
       this.props.history.push('/ArchivedGroups');
    } else {
      if (event === 'Dashboard') {
        this.props.history.push('/Dashboard');//changed for the dashboard navigation
      } else {
        this.props.history.push('/' + event);
      }
    }
    if (event === 'archivedGroups') {
      this.props.history.push('/ArchivedGroups');
    } else if (event === 'UpdateFlexPLMServerURL') {
      this.props.history.push('/UpdateServerURL');
    }
    if (event === 'EditDescription') {
      var tmpPathName = this.props.generic_master_store.currentGroupName;
      this.props.history.push(this.props.desc+'/'+tmpPathName);
    }
  }

  render() {
    var dropdownTitle = (
      <i className="fa fa-cog" aria-hidden="true"></i>
    );
    var parentGroup = (<div><i className="fa fa-hand-o-left" aria-hidden="true"></i>&nbsp;Endpoints</div>);
    var DownloadConfig = (<div><i className="fa fa-download" aria-hidden="true"></i>&nbsp;DownloadConfig</div>);
    var actions = [];
    if (this.props.source === 'Thing') {
      if (this.props.action === 'Edit') { //TODO : need to do this on template level also
        if(this.props.type==='/Mapping'){
          actions = ['Show', 'Edit', 'Save', 'Endpoints', 'DownloadConfig']; // Removed 'Transaction' link for Bug No. 323
        }
        else{
          actions = ['Show', 'Edit', 'Save', 'Transactions', 'Endpoints', 'Delete'];
        }
      } else if(this.props.type==='/Mapping' && this.props.action === 'Show'){  // Removed 'Transaction' link for Bug No. 342 from product office
          actions = ['Show', 'Edit', 'Endpoints'];
      }else if (this.props.action === 'Show') {
        actions = ['Show', 'Edit', 'Transactions', 'Endpoints'];
      } else if (this.props.action === 'Transactions') {
        actions = ['Show', 'Edit', 'Transactions', 'Endpoints'];
      }
    } else if (this.props.source === 'Template') {
      if (this.props.generic_master_store.groupType === 'source') {
        if (this.props.action === 'All') {
          actions = ['Dashboard', 'Source Systems', 'Target Systems', 'Mapping Systems'];
        } else if (this.props.action === 'Edit') {
          actions = ['Source Systems', 'Mapping Systems'];
          if (this.props.type === '/Flex') {
            actions.push('Update FlexPLM Server URL');
          }
        } else if (this.props.action === 'Config') {
          actions = ['Source Systems', 'Endpoints', 'Edit Description'];
          if (this.props.type === '/Flex') {
            actions.push('Update FlexPLM Server URL');
          }
        } else {}
      } else if (this.props.generic_master_store.groupType === 'target') {
        if (this.props.action === 'All') {
          actions = ['Dashboard', 'Source Systems', 'Target Systems', 'Mapping Systems'];
        } else if (this.props.action === 'Edit') {
          actions = ['Target Systems', 'Mapping Systems'];
        } else if (this.props.action === 'Config') {
          actions = ['Target Systems', 'Endpoints', 'Edit Description'];
        } else {
        }
      } else if (this.props.generic_master_store.groupType === 'mapping') {
        if (this.props.action === 'All') {
          actions = ['Dashboard', 'Source Systems', 'Target Systems' , 'Mapping Systems'];
        } else if (this.props.action === 'Edit') {
          actions = ['Mapping Systems'];
        }
      }
    } else {
      actions = ['Dashboard', 'Source Systems', 'Target Systems', 'Mapping Systems', 'Settings'];
    }
    var options = [];
    actions.map(ac => {
      if (ac === 'Delete') {
        options.push(
          <MenuItem key={'navDropDownDivider'} id="divider" divider />
      );
      } else {
        if (ac === 'Endpoints') {
          options.push(
            <MenuItem key={'navDropDown_' + ac} id={ac} eventKey={ac} disabled={this.props.action === ac}>{parentGroup}</MenuItem>
          );
        }else if (ac === 'DownloadConfig') {
          options.push(
            <MenuItem key={'navDropDown_' + ac} id={ac} eventKey={ac} disabled={this.props.action === ac}>{DownloadConfig}</MenuItem>
          );
        }
        else {
         var navigatoritem = ac.split(' ').join('');
          options.push(
            <MenuItem key={'navDropDown_' + ac} id={ac} eventKey={ac} disabled={this.props.action === navigatoritem || navigatoritem === 'UpdateFlexPLMServerURL' || (navigatoritem === 'Save' && this.state.userCheck === false)}>{ac}</MenuItem>
          );
        }
      }
    });
    var dropDownList = (
      <DropdownButton id={'SelectAction'} className="editDropDown dropdown-menu-left" bsStyle="primary" pullRight={this.state.dir} title={dropdownTitle} onSelect={this.onActionSelect.bind(this)}>
        {options}
        <MenuItem
          id={'archivedGroups'} eventKey={'archivedGroups'}
          disabled={this.props.action === 'archivedGroups'}
        >{'Archived Groups'}</MenuItem>
      </DropdownButton>
    );

    return (
      <div className="pull-right">
        {dropDownList}
      </div>
    );
  }

}
Navigator.propTypes = {
    store: React.PropTypes.object
};

export default Navigator;
