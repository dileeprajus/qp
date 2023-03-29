try{
	var grpName = input.groupName;
	var topicName = input.topicName;
	var private_key = Things['GenericIEMasterConfig'].GooglePubSubDynamicGroupConfig[grpName]['privateKey']['fileData'];
	var project_name = Things['GenericIEMasterConfig'].GooglePubSubDynamicGroupConfig[grpName]['privateKey']['fileData']['project_id'];
	var authkey = Things["GCPAuthSvcThing"].GetAuthTokenInter({
		privateKey: private_key /* JSON */,
		Scope: 'https://www.googleapis.com/auth/pubsub' /* STRING */
	});
	var org_auth_key = "Bearer "+authkey.tokenValue;
	logger.warn("Authentication key"+org_auth_key);
	var params = {
		proxyScheme: undefined /* STRING */,
		headers: {"Content-Type":"application/json","Accept":"application/json","Authorization": org_auth_key} /* JSON */,
		ignoreSSLErrors: undefined /* BOOLEAN */,
		useNTLM: undefined /* BOOLEAN */,
		workstation: undefined /* STRING */,
		useProxy: undefined /* BOOLEAN */,
		withCookies: undefined /* BOOLEAN */,
		proxyHost: undefined /* STRING */,
		url: "https://pubsub.googleapis.com/v1/projects/"+project_name+"/topics/"+topicName+"/subscriptions" /* STRING */,
		content: undefined /* JSON */,
		timeout: undefined /* NUMBER */,
		proxyPort: undefined /* INTEGER */,
		password: undefined /* STRING */,
		domain: undefined /* STRING */,
		username: undefined /* STRING */
	};
	
	// result: JSON
	var subscriptionList = Resources["ContentLoaderFunctions"].GetJSON(params);
		
	delete subscriptionList['headers'];
	for(var i=0;i<subscriptionList.subscriptions.length;i++)
	{
	   subscriptionList.subscriptions[i] = subscriptionList.subscriptions[i].split("/")[3];
	}
	var result = subscriptionList;
	
	}catch(e){
		var result = {"subscriptions":[]};
		logger.warn("Exception in GetListOfSubscriptions Service: "+e.message);
	}
	