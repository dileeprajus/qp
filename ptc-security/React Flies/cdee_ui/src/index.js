/* Copyright(C) 2015-2018 - Quantela Inc

 * All Rights Reserved

* Unauthorized copying of this file via any medium is strictly prohibited

* See LICENSE file in the project root for full license information

*/
/* global ieGlobalVariable */
require('normalize.css/normalize.css');
require('styles/main.css');
import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import createHashHistory from 'history/createHashHistory';
import {Provider} from 'mobx-react';
import {RouterStore} from 'mobx-react-router';
import {Row} from 'react-bootstrap';
import {Router, Route} from 'react-router-dom';
import NavbarInstance from './components/static/layout/navbar';
import App from './components/App';
import Settings from './components/Settings';

import SchemaEdit from './components/smart/GenericComponents/schema/edit';
import MappingConfig from './components/smart/GenericComponents/schema/map/mappingConfig';
import AllArchivedGroups from './components/smart/GenericComponents/all_archived_groups';

import FlexThings from './components/FlexThings';
import FlexThingShow from './components/smart/Flex/show';
import FlexThingEdit from './components/smart/Flex/edit';
import FlexThingSummary from './components/smart/Flex/summary';

import SocketConfigs from './components/SocketConfigs';
import SocketConfigShow from './components/smart/Socket/show';
import SocketConfigEdit from './components/smart/Socket/edit';
import SocketConfigSummary from './components/smart/Socket/summary';
import SocketConfigMetaInfo from './components/smart/Socket/socketConfigMetaInfo';

import DataBaseConfigs from './components/DataBaseConfigs';
import DataBaseConfigShow from './components/smart/DataBase/show';
import DataBaseConfigEdit from './components/smart/DataBase/edit';
import DataBaseConfigSummary from './components/smart/DataBase/summary';
import DataBaseConfigMetaInfo from './components/smart/DataBase/dataBaseConfigMetaInfo';

import FTPConfigs from './components/FTPConfigs';
import FTPConfigShow from './components/smart/FTP/show';
import FTPConfigEdit from './components/smart/FTP/edit';
import FTPConfigSummary from './components/smart/FTP/summary';

import StaticFileClientThings from './components/StaticFileClientThings';
import StaticFileClientThingShow from './components/smart/StaticFileClient/show';
import StaticFileClientThingEdit from './components/smart/StaticFileClient/edit';
import StaticFileClientThingSummary from './components/smart/StaticFileClient/summary';
import StaticFileConfigMetaInfo from './components/smart/StaticFileClient/staticFileConfigMetaInfo';

import RestClientThings from './components/RestClientThings';
import RestClientThingShow from './components/smart/RestClient/show';
import RestClientThingEdit from './components/smart/RestClient/edit_new';
import RestClientThingSummary from './components/smart/RestClient/summary';
import RestConfigMetaInfo from './components/smart/RestClient/restConfigMetaInfo';

import SoapClientThings from './components/SoapClientThings';
import SoapClientThingShow from './components/smart/SoapClient/show';
import SoapClientThingEdit from './components/smart/SoapClient/edit';
import SoapClientThingSummary from './components/smart/SoapClient/summary';
import SoapConfigMetaInfo from './components/smart/SoapClient/soapConfigMetaInfo';

import GooglePubSubConfigs from './components/GooglePubSubConfigs';
import GooglePubSubConfigEdit from './components/smart/GooglePubSub/edit';
import GooglePubSubConfigSummary from './components/smart/GooglePubSub/summary';
import GooglePubSubShow from './components/smart/GooglePubSub/show';


import MappingThings from './components/MappingThings';
import MappingSetup from './components/smart/Mapping/setup';
import MappingThingShow from './components/smart/Mapping/show';
import MappingThingEdit from './components/smart/Mapping/edit';
import MappingConfigMetaInfo from './components/smart/Mapping/mappingConfigMetaInfo';

import Dashboard from './components/Dashboard';
import LogsMonitoring from './components/LogsMonitoring';
import Login from './components/Login';
import SourceSystems from './components/SourceSystems';
import TargetSystems from './components/TargetSystems';
import MappingSystems from './components/MappingSystems';

import SoapGroupEdit from './components/smart/Groups/soap_edit';
import FlexGroupEdit from './components/smart/Groups/flex_edit';
import SocketGroupEdit from './components/smart/Groups/socketEdit';
import DataBaseGroupEdit from './components/smart/Groups/databaseEdit';
import FTPEdit from './components/smart/Groups/FTPEdit';
import GroupEdit from './components/smart/Groups/edit';
import UpdateServerURL from './components/smart/Groups/updateServerURL';
import GooglePubSubGroupEdit from './components/smart/Groups/GooglePubSubEdit';


import BreadCrumbStore from './stores/BreadCrumbStore';
import MappingStore from './stores/MappingStore';
import ModalStore from './stores/ModalStore';
import ValidationStore from './stores/ValidationStore';
import GenericCDEEMasterStore from './stores/GenericCDEEMasterStore';
import TypeManagerStore from './stores/TypeManagerStore';
import SchedulerStore from './stores/SchedulerStore';
import LoaderStore from './stores/LoaderStore';
import CDEEBussinessRulesStore from './stores/CDEEBussinessRulesStore';
import RestClientStore from './stores/RestClientStore';

const hashHistory = createHashHistory();
const routingStore = new RouterStore();
const style = {
  marginRight: '2rem',
  marginLeft: '2rem'
};
const breadcrumbStore = new BreadCrumbStore();
const newModalStore = new ModalStore();
const newValidationStore = new ValidationStore();
const mappingStore = new MappingStore();
const genericMasterStore = new GenericCDEEMasterStore();
const schedulerStore = new SchedulerStore();
const cdeeBussinessRulesStore = new CDEEBussinessRulesStore();
const typeManagerStore = new TypeManagerStore();
const restClientStore = new RestClientStore();
ieGlobalVariable.loaderStore = new LoaderStore();
const stores = {
  routing: routingStore,
  breadcrumb_store: breadcrumbStore,
  modal_store: newModalStore,
  mapping_store: mappingStore,
  validation_store: newValidationStore,
  generic_master_store: genericMasterStore,
  scheduler_store: schedulerStore,
  cdee_bussiness_rules_store: cdeeBussinessRulesStore,
  type_manager_store: typeManagerStore,
  rest_client_store: restClientStore
};

const root = document.createElement('div');
root.id = 'app';
document.body.appendChild(root);

var routes = (
  <Provider {...stores}>
    <Router history={hashHistory}>
      <App history={hashHistory}>
        <NavbarInstance history={hashHistory}/>
        <Row style={{...style}}>
        <Route exact path="/" name="Login" component={Login}/>
          <Route exact path="/Dashboard" name="Dashboard" component={Dashboard}/>
          <Route exact path="/Mapping/:groupName" name="MappingThings" component={MappingThings}/>
          {/* <Route exact path="/Mapping" name="MappingThings" component={MappingThingShow} /> */}
          <Route exact path="/Settings" name="Settings" component={Settings}/>
          <Route exact path="/LogsMonitoring" name="LogsMonitoring" component={LogsMonitoring}/>

          <Route exact path="/Flex/:groupName" name="FlexThings" component={FlexThings}/>
          <Route path="/Flex/Show/:name" name="FlexThingShow" component={FlexThingShow}/>
          <Route path="/Flex/Edit/:name" name="FlexThingEdit" component={FlexThingEdit}/>
          <Route path="/Flex/Summary/:name" name="FlexThingSummary" component={FlexThingSummary}/>

          <Route exact path="/Socket/:groupName" name="SocketConfigs" component={SocketConfigs}/>
          <Route path="/Socket/Show/:name" name="SocketConfigShow" component={SocketConfigShow}/>
          <Route path="/Socket/Edit/:name" name="SocketConfigEdit" component={SocketConfigEdit}/>
          <Route path="/Socket/Summary/:name" name="SocketConfigSummary" component={SocketConfigSummary}/>
          <Route path="/Socket/MetaInfo/:name" name="SocketConfigMetaInfo" component={SocketConfigMetaInfo}/>

          <Route exact path="/DataBase/:groupName" name="DataBaseConfigs" component={DataBaseConfigs}/>
          <Route path="/DataBase/Show/:name" name="DataBaseConfigShow" component={DataBaseConfigShow}/>
          <Route path="/DataBase/Edit/:name" name="DataBaseConfigEdit" component={DataBaseConfigEdit}/>
          <Route path="/DataBase/Summary/:name" name="DataBaseConfigSummary" component={DataBaseConfigSummary}/>
          <Route path="/DataBase/MetaInfo/:name" name="DataBaseConfigMetaInfo" component={DataBaseConfigMetaInfo}/>

          <Route exact path="/FTP/:groupName" name="FTPConfigs" component={FTPConfigs}/>
          <Route path="/FTP/Show/:name" name="FTPConfigShow" component={FTPConfigShow}/>
          <Route path="/FTP/Edit/:name" name="FTPpConfigEdit" component={FTPConfigEdit}/>
          <Route path="/FTP/Summary/:name" name="FTPConfigSummary" component={FTPConfigSummary}/>

          <Route exact path="/GooglePubSub/:groupName" name="GooglePubSubConfigs" component={GooglePubSubConfigs}/>
          <Route path="/GooglePubSub/Edit/:name" name="GooglePubSubConfigEdit" component={GooglePubSubConfigEdit}/>
          <Route path="/GooglePubSub/Show/:name" name="GooglePubSubShow" component={GooglePubSubShow}/>
          <Route path="/GooglePubSub/Summary/:name" name="GooglePubSubConfigSummary" component={GooglePubSubConfigSummary}/>

          <Route exact path="/SourceSystems" name="SourceSystems" component={SourceSystems}/>
          <Route exact path="/TargetSystems" name="TargetSystems" component={TargetSystems}/>
          <Route exact path="/MappingSystems" name="MappingSystems" component={MappingSystems}/>

          <Route exact path="/StaticFileClient/:groupName" name="StaticFileClientThings"
                 component={StaticFileClientThings}/>
          <Route path="/StaticFileClient/Show/:name" name="StaticFileClientThingShow"
                 component={StaticFileClientThingShow}/>
          <Route path="/StaticFileClient/Edit/:name" name="StaticFileClientThingEdit"
                 component={StaticFileClientThingEdit}/>
          <Route path="/StaticFileClient/Summary/:name" name="StaticFileClientThingSummary"
                 component={StaticFileClientThingSummary}/>
          <Route path="/StaticFileClient/MetaInfo/:name" name="StaticFileConfigMetaInfo"
                 component={StaticFileConfigMetaInfo}/>

          <Route exact path="/RestClient/:groupName" name="RestClientThings" component={RestClientThings}/>
          <Route path="/RestClient/Show/:name" name="RestClientThingShow" component={RestClientThingShow}/>
          <Route path="/RestClient/Edit/:name" name="RestClientThingEdit" component={RestClientThingEdit}/>
          <Route path="/RestClient/Summary/:name" name="RestClientThingSummary" component={RestClientThingSummary}/>
          <Route path="/RestClient/MetaInfo/:name" name="RestConfigMetaInfoEdit" component={RestConfigMetaInfo}/>


          <Route exact path="/SchemaEdit" name="Schema" component={SchemaEdit}/>
          <Route exact path="/MappingConfig" name="Schema" component={MappingConfig}/>
          <Route exact path="/ArchivedGroups" name="Schema" component={AllArchivedGroups}/>

          <Route exact path="/SoapClient/:groupName" name="SoapClientThings" component={SoapClientThings}/>
          <Route path="/SoapClient/Show/:name" name="SoapClientThingShow" component={SoapClientThingShow}/>
          <Route path="/SoapClient/Edit/:name" name="SoapClientThingEdit" component={SoapClientThingEdit}/>
          <Route path="/SoapClient/Summary/:name" name="SoapClientThingSummary" component={SoapClientThingSummary}/>
          <Route path="/SoapClient/MetaInfo/:name" name="SoapConfigMetaInfo" component={SoapConfigMetaInfo}/>

          <Route exact path="/MappingSetup" name="MappingSetup" component={MappingSetup}/>
          <Route exact path="/Mapping/Show/:name" name="MappingThingShow" component={MappingThingShow}/>
          <Route exact path="/Mapping/Edit/:name" name="MappingThingEdit" component={MappingThingEdit}/>
          <Route path="/Mapping/MetaInfo/:name" name="MappingConfigMetaInfo" component={MappingConfigMetaInfo}/>


          <Route exact path="/Groups/SoapEdit/:groupName" name="SoapGroupEdit" component={SoapGroupEdit}/>
          <Route exact path="/Groups/FlexEdit/:groupName" name="FlexGroupEdit" component={FlexGroupEdit}/>
          <Route exact path="/Groups/SocketEdit/:groupName" name="SocketGroupEdit" component={SocketGroupEdit}/>
          <Route exact path="/Groups/DataBaseEdit/:groupName" name="DataBaseGroupEdit" component={DataBaseGroupEdit}/>
          <Route exact path="/Groups/FTPEdit/:groupName" name="FTPGroupEdit" component={FTPEdit}/>
          <Route exact path="/Groups/Edit/:groupName" name="GroupEdit" component={GroupEdit}/>
          <Route exact path="/UpdateServerURL" name="UpdateServerURL" component={UpdateServerURL} />
          <Route exact path="/Groups/GooglePubSubEdit/:groupName" name="GooglePubSubGroupEdit" component={GooglePubSubGroupEdit}/>
        </Row>
      </App>
    </Router>
  </Provider>
);

ReactDOM.render((<div>{routes}</div>), document.querySelector('#app'));
