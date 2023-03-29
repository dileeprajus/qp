try {
	var config = me.FlexAPIConfig();
	var tempMidPoint = (config.midPoint);
	var params = {
		proxyScheme: undefined /* STRING */,
		headers: {"Content-Type": "application/json","Accept":"application/json"} /* JSON */,
		ignoreSSLErrors: undefined /* BOOLEAN */,
		useNTLM: undefined /* BOOLEAN */,
		workstation: undefined /* STRING */,
		useProxy: undefined /* BOOLEAN */,
		withCookies: undefined /* BOOLEAN */,
		proxyHost: undefined /* STRING */,
		//url:"http://PP-20170907021949733.portal.ptc.io:80/Windchill/servlet/rest/security/csrf" /* STRING */,
		url: tempMidPoint + config.getCSRFToken,
		timeout: undefined /* NUMBER */,
		proxyPort: undefined /* INTEGER */,
		password: me.password /* STRING */,
		domain: undefined /* STRING */,
		username: me.username /* STRING */
	};
	// result: JSON
	var csrf_obj = Resources["ContentLoaderFunctions"].GetJSON(params);
	var result = {};
	var csrf_key = csrf_obj["items"][0].attributes["nonce_key"];
	var csrf_token = csrf_obj["items"][0].attributes["nonce"];
	//result[csrf_key] = csrf_token;
	var arr= [csrf_key,csrf_token];
	result["Result"] = arr;
	}catch(e) {
	result = {"result":[]};
	}