try{
	var pubsubOut,params;
	var pubsubTempArray = new Array();
	var grpName = input.groupName;
	var private_key = Things['GenericIEMasterConfig'].GooglePubSubDynamicGroupConfig[grpName]['privateKey']['fileData'];
	var project_name = Things['GenericIEMasterConfig'].GooglePubSubDynamicGroupConfig[grpName]['privateKey']['fileData']['project_id'];
	var authkey = Things["GCPAuthSvcThing"].GetAuthTokenInter({
		privateKey: private_key /* JSON */,
		Scope: 'https://www.googleapis.com/auth/pubsub' /* STRING */
	});
	var org_auth_key = "Bearer "+authkey.tokenValue;
	logger.warn("Authentication key"+org_auth_key);
	var count = 0;
	do{
	if(count == 0){
	params = {
		proxyScheme: undefined /* STRING */,
		headers: {"Content-Type":"application/json","Accept":"application/json","Authorization": org_auth_key} /* JSON */,
		ignoreSSLErrors: undefined /* BOOLEAN */,
		useNTLM: undefined /* BOOLEAN */,
		workstation: undefined /* STRING */,
		useProxy: undefined /* BOOLEAN */,
		withCookies: undefined /* BOOLEAN */,
		proxyHost: undefined /* STRING */,
		url: "https://pubsub.googleapis.com/v1/projects/"+project_name+"/topics"+"?pageSize=1000",
		content: undefined /* JSON */,
		timeout: undefined /* NUMBER */,
		proxyPort: undefined /* INTEGER */,
		password: undefined /* STRING */,
		domain: undefined /* STRING */,
		username: undefined /* STRING */,
	};
	}else{
	params = {
		proxyScheme: undefined /* STRING */,
		headers: {"Content-Type":"application/json","Accept":"application/json","Authorization": org_auth_key} /* JSON */,
		ignoreSSLErrors: undefined /* BOOLEAN */,
		useNTLM: undefined /* BOOLEAN */,
		workstation: undefined /* STRING */,
		useProxy: undefined /* BOOLEAN */,
		withCookies: undefined /* BOOLEAN */,
		proxyHost: undefined /* STRING */,
		url: "https://pubsub.googleapis.com/v1/projects/"+project_name+"/topics"+"?pageSize=1000&pageToken="+pubsubOut["nextPageToken"],
		content: undefined /* JSON */,
		timeout: undefined /* NUMBER */,
		proxyPort: undefined /* INTEGER */,
		password: undefined /* STRING */,
		domain: undefined /* STRING */,
		username: undefined /* STRING */,
	};
	}
	// result: JSON
	pubsubOut = Resources["ContentLoaderFunctions"].GetJSON(params);
	delete pubsubOut['headers'];
	for(var j=0; j<pubsubOut.topics.length; j++) {
		pubsubTempArray.push(pubsubOut.topics[j]);
	  }
	count++;
	}while(pubsubOut["nextPageToken"]);
	pubsubOut.topics = pubsubTempArray;
	logger.warn("Response of pubsubOut before reading topics"+JSON.stringify(pubsubOut));
	for(var i=0;i<pubsubOut.topics.length;i++)
	{
	   pubsubOut.topics[i] = pubsubOut.topics[i].name.split("/")[3];
	}
	
	var result = pubsubOut;
	logger.warn("pubsubOut topics length"+pubsubOut.topics.length);
	//logger.warn("pubsubOut1 topics data"+JSON.stringify(pubsubOut1));
	
	}catch(e){
		var result = {"error":e.message};
		logger.warn("Exception in GetListOfTopics Service: "+e.message+"linenumber"+e.lineNumber);
	}