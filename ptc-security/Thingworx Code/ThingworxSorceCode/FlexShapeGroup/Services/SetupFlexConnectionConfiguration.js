//INPUTS: fromDelete(BOOLEAN)
// OUTPUTS: result(JSON)
try{
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
      logger.warn("input fromDelete is : "+fromDelete);
    }
      logger.warn("endpointsobj"+endpointsobj);
      var enpointsRefObj = endpointsobj;
      var endpoints = {};
      if(enpointsRefObj && enpointsRefObj.create_trigger === true) {
      endpoints.create_trigger = "CreateTrigger";
      }
      if(enpointsRefObj && enpointsRefObj.update_trigger === true) {
      endpoints.update_trigger = "UpdateTrigger";
      }
      if(enpointsRefObj && enpointsRefObj.delete_trigger === true) {
      endpoints.delete_trigger = "DeleteTrigger";
      }
      
       //config : JSON
      var config = me.FlexAPIConfig();
      var flex_connection_json = me.FlexConnectionConfiguration;
      var config_json = me.ConfigJson;
      var type_hierarchy;
      var flex_obj = "";
      var type_id = "";
      var enableAPI = false;
      var result = {};
      var isSource=false;
      var tags= me.GetTags();
     // result: TAGS
  
      var serverUrl = Things["GenericIEMasterConfig"].serverName;
      // result: STRING
      var appKeyID = ApplicationKeys["PTC"].GetKeyID();
      var associationsObj = config_json["AssociationsObj"] ? config_json["AssociationsObj"] : {};
      var validation_formula = config_json["Validation"] ? config_json["Validation"] : '';
      if(tags=="Applications:IE;Applications:DynamicConfig;Applications:Source"){
          isSource = true;
      }
      var params = {
          input: me.outputSchema /* JSON */
      };
  
      // result: BOOLEAN
      var isSchemaValid = me.isSchemaValid(params);
  
  
      if(config_json["SelectedTypeHierarchy"]){
          flex_obj = config_json["SelectedFlexObjects"][0];
          for(var i=0;i<config_json["SelectedTypeHierarchy"].length;i++){ //get the type id whose flex object is matches flex object in selectedtypehierachy obj
              if(flex_obj === config_json["SelectedTypeHierarchy"][i].flexObject){
                  type_id = config_json["SelectedTypeHierarchy"][i].typeId;
                  break;	
              }
          }
          enableAPI = true;
      }
      if(fromDelete){ // if setupFlexConneciton service is calling from delete thing service then remove the enpoints and send at json to flex
              flex_connection_json = {
              //"base_url": "http://twx.mtuity.com:8080/Thingworx/Things/"+me.name+"/Services",
              "base_url": serverUrl + "/Thingworx/Things/"+me.name+"/Services",
              "end_points": {                
                  },
              "app_key": appKeyID,
              "thing_name": me.name,
              "flexObject": flex_obj,
              "typeId": type_id,
              "thingTemplate":me.thingTemplate,
              "mediaType": config_json['FlexMediaType']
          };
           flex_connection_json["validation"]=validation_formula;
      }else{
              flex_connection_json = {
              //"base_url": "http://twx.mtuity.com:8080/Thingworx/Things/"+me.name+"/Services",
              "base_url": serverUrl + "/Thingworx/Things/"+me.name+"/Services",
              "end_points": endpoints,
              "app_key": appKeyID,
              "thing_name": me.name,
              "flexObject": flex_obj,
              "typeId": type_id,
              "thingTemplate":me.thingTemplate,
              "mediaType": config_json['FlexMediaType']
          };
          if (config_json["AssociationsObj"]) {
            flex_connection_json["includes"] = associationsObj;
          }
          flex_connection_json["validation"]=validation_formula;
          me.FlexConnectionConfiguration = flex_connection_json; //connectionconfigjson is notsaving thing because the thing is already deleted so we can't save the value in that thing
      }
      
      if(enableAPI && isSchemaValid && isSource){ // call flex triggerConfig api if the flexconfiguration json is valid/correct one
          var params = {
              headers: {"Content-Type": "application/json"} /* JSON */,	
              url: config.midPoint + config.triggerConfig /* STRING */,
              content: flex_connection_json /* JSON */,	
              password: config.password /* STRING */,
              username: config.username /* STRING */
          };
  
          // result: JSON
          result = Resources["ContentLoaderFunctions"].PostJSON(params);
          delete result.responseHeaders;
          delete result.responseStatus;
          if(Object.keys(result).length===1){//if the result contains only headers then the flex plm may be 11 verison so get the csrf token and then call the api
              var params = {
                  endPoint: config.midPoint + config.triggerConfig /* STRING */,
                  headersValue: {"Content-Type": "application/json"} /* JSON */,
                  contentValue: flex_connection_json /* JSON */,
                  methodType: "post" /* STRING */
              };
  
              // result: JSON
              result = me.TestFlexAPI(params);
          }
      } else{
         result = {};
      }
     if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
      logger.warn("Result for SetupFlexConnectionConfiguration service: "+result);
     }
  }
  catch(e){
      logger.warn("Error in SetupFlexConnectionConfiguration service: "+e.message);
      var result ={"error":e.message};
  }
  