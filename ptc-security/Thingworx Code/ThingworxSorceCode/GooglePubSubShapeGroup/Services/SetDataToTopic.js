try{
	//var obj = JSON.stringify(sampleJSON);
	var obj = JSON.stringify(JSON.parse(sampleJSON));
	var reqObj={};
	var encodedOut = base64EncodeString(obj).replace(new RegExp("\n", 'g'), "");
	logger.warn("Encoded output"+encodedOut);
	// result: JSON
	var authkey = Things["GCPAuthSvcThing"].GetAuthTokenInter({
		privateKey: privateKey/* JSON */,
		Scope: scope /* STRING */
	});
		
	
	var org_auth_key = "Bearer "+authkey.tokenValue;
	
	reqObj.headers = {"Content-Type":"application/json","Accept":"application/json","Authorization": org_auth_key};
	reqObj.url = "https://pubsub.googleapis.com/v1/projects/"+projectName+"/topics/"+topicName+":publish";
	reqObj.content = {
	"messages": [
	{
	"data": encodedOut
	}
	]
	}/* JSON */;
	// result: JSON
	var pubsubOut =  Things["RestConfig"].CustomHTTPRequest({
		methodType: 'POST' /* STRING */,
		requestObject: reqObj /* JSON */
	});
	delete pubsubOut['headers'];
	//pubsubOut['Data'] = sampleJSON;
	result = pubsubOut;
	logger.warn("Decoded output"+base64DecodeString(encodedOut));
	}
	catch(err){
	logger.warn("Exception in GooglePubSub SetDataToTopic Service :"+err.message+"linenumber"+err.lineNumber);    
	}	