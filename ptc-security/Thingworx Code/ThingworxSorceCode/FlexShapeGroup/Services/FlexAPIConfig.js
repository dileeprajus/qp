//Inputs : Nothing
//Output: JSON

try{
    var flexConfig = me.FlexConfig;
    var obj = {};
    obj={
        //"midPoint": "http://"+me.hostname+"/"+me.midpoint,
        "midPoint": me.hostname+"/"+me.midpoint,
        "username": me.username,
        "password": me.password,
        "createRecord": "/createFlexObject",
        "createOrUpdateFlexObject": "/createOrUpdateFlexObject",
        "updateRecord": "/updateFlexObject",
        "deleteRecord": "/deleteFlexObject",
        "triggerConfig": "/triggerConfig",
        "getFlexObjects": "/getFlexObjects",
        "getRecordsData": "/getRecordsData",
        "getFlexSchema": "/getFlexSchema",
        "getTypeHierarchy": "/getFlexTypeHierarchy",
        "getCSRFToken":"/security/csrf",
        "getAssociationsofRecord": "/getRecordsData",
    };
    me.FlexConfig = obj;
    var result = me.FlexConfig;
}catch(e){
    var result={
      //"midPoint": "http://"+me.hostname+"/"+me.midpoint,
       "midPoint": me.hostname+"/"+me.midpoint,
      "username": me.username,
      "password": me.password,
      "createRecord": "/createFlexObject",
      "createOrUpdateFlexObject": "/createOrUpdateFlexObject",
      "updateRecord": "/updateFlexObject",
      "deleteRecord": "/deleteFlexObject",
      "triggerConfig": "/triggerConfig",
      "getFlexObjects": "/getFlexObjects",
      "getRecordsData": "/getRecordsData",
      "getFlexSchema": "/getFlexSchema",
      "getTypeHierarchy": "/getFlexTypeHierarchy",
       "getCSRFToken":"/security/csrf",
        "getAssociationsofRecord":  "/getRecordsData",
    };
}
