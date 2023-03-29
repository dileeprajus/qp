//INPUT  input= {}
// request_variables = {}
//OUTPUT  result= {}

try{
    var googlePubSubMessageData;
    var grpName = me.GetThingTemplate().rows[0].name;
    var sub_Name = me.googlePubSubEditFileInfo.subscriptionName;
    var private_key = Things['GenericIEMasterConfig'].GooglePubSubDynamicGroupConfig[grpName]['privateKey']['fileData'];
    var project_name = Things['GenericIEMasterConfig'].GooglePubSubDynamicGroupConfig[grpName]['privateKey']['fileData']['project_id'];
    var authkey = Things["GCPAuthSvcThing"].GetAuthTokenInter({
        privateKey: private_key /* JSON */,
        Scope: 'https://www.googleapis.com/auth/pubsub' /* STRING */
    });
    var org_auth_key = "Bearer "+authkey.tokenValue;
    if(me.selectMode === "Subscriber")
    {
    var params = {
        proxyScheme: undefined /* STRING */,
        headers: {"Content-Type":"application/json","Accept":"application/json","Authorization": org_auth_key} /* JSON */,
        ignoreSSLErrors: undefined /* BOOLEAN */,
        useNTLM: undefined /* BOOLEAN */,
        workstation: undefined /* STRING */,
        useProxy: undefined /* BOOLEAN */,
        withCookies: undefined /* BOOLEAN */,
        proxyHost: undefined /* STRING */,
        url: "https://pubsub.googleapis.com/v1/projects/"+project_name+"/subscriptions/"+sub_Name+":pull" /* STRING */,
        content: {"maxMessages": 1} /* JSON */,
        timeout: undefined /* NUMBER */,
        proxyPort: undefined /* INTEGER */,
        password: undefined /* STRING */,
        domain: undefined /* STRING */,
        username: undefined /* STRING */
    };
    // result: JSON
    var pullMessage_result = Resources["ContentLoaderFunctions"].PostJSON(params);
        if(pullMessage_result.headers !== null)
        {
    delete pullMessage_result.headers;
        googlePubSubMessageData = pullMessage_result.receivedMessages[0].message;  
        googlePubSubMessageData.data = JSON.parse(base64DecodeString(googlePubSubMessageData.data));
      result = {"data":googlePubSubMessageData};
            logger.warn("GooglePubSubData"+JSON.stringify(googlePubSubMessageData));
        }
    }else{
        var hostInfoObj = me.GetGooglePubSubHostInfo();
        var configObj = input.configJson['googlePubSubEditFileInfo'];
        var params = {
            input: input /* JSON */,
            request_variables: request_variables /* JSON */,
            configObj: configObj /* JSON */
        };
        // result: JSON
        var config = me.OverRideRequestVariables(params);
    
        var filepathObj = {
            "action": "readFileContent",
            "googlePubSubEditFileInfo" :{
                "fileType" : config.fileType
            },
            "hostProperties" :hostInfoObj
        }
        var params = {
            inputJson: filepathObj /* JSON */
        };
    
        // result: JSON
        if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
        logger.warn(':::::::ReadDataFromFilePayload::::::'+JSON.stringify(params));
        }
        var res = Things["GooglePubSubConfig"].readDataFromFile(params);
         logger.warn("File data"+JSON.stringify(params)); 
         result = {"fileType": config.fileType, "response":res ? res["result"]["filesList"] : {"result":[]}};
    }
    }catch(e){
        result = {"error":{"result":[]}};
        logger.warn('Exception in readData from JavaService'+e.message);
    }