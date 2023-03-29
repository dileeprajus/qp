var params = {
	withCookies: true /* BOOLEAN */,
	url: "https://jsonplaceholder.typicode.com/users" /* STRING */,
};
// result: JSON
//var result = Resources["ContentLoaderFunctions"].GetJSON(params);


var params = {
	url: "https://jsonplaceholder.typicode.com/users" /* STRING */,
};

// result: STRING
//var result = Resources["ContentLoaderFunctions"].GetCookies(params);


var params = {
	proxyScheme: undefined /* STRING */,
	headers: undefined /* JSON */,
	ignoreSSLErrors: undefined /* BOOLEAN */,
	useNTLM: undefined /* BOOLEAN */,
	workstation: undefined /* STRING */,
	useProxy: undefined /* BOOLEAN */,
	withCookies: undefined /* BOOLEAN */,
	proxyHost: undefined /* STRING */,
	url: undefined /* STRING */,
	content: undefined /* STRING */,
	timeout: undefined /* NUMBER */,
	proxyPort: undefined /* INTEGER */,
	password: undefined /* STRING */,
	domain: undefined /* STRING */,
	contentType: undefined /* STRING */,
	username: undefined /* STRING */
};

// result: STRING
//var result = Resources["ContentLoaderFunctions"].PostText(params);





var params = {
    headers:  {"Content-Type": "application/x-www-form-urlencoded"} /* JSON */,
	withCookies: true /* BOOLEAN */,
    ignoreSSLErrors: true /* BOOLEAN */,
	url: "https://cdp-cary.cisco.com/cdp/v1/login" /* STRING */,
	content: "client_id=F8XKe8Zr86XIUkGzL44bbPJn3eQa&client_secret=Q3N8LxLneegx2sPRXpmS4dBeJgca&username=caryoperator@cdp.com&password=LY3mkq@6&grant_type=client_credentials&" /* STRING */,
};
// result: STRING
var result = Resources["ContentLoaderFunctions"].PostText(params);




















