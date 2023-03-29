var tObj = transactionObj;
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
logger.warn("Entire Data"+JSON.stringify(pullMessage_result));
delete pullMessage_result.headers;
if(pullMessage_result.receivedMessages )
{
// pullMessage_result.receivedMessages.length;
logger.warn("Full data"+JSON.stringify(pullMessage_result));
var ackIds = new Array(pullMessage_result.receivedMessages.length);
    logger.warn("length before "+ackIds);
for(i=0;i<pullMessage_result.receivedMessages.length;i++){
    ackIds[i] = pullMessage_result.receivedMessages[i].ackId;
    logger.warn("Individual ACK Ids"+pullMessage_result.receivedMessages[i].ackId);
}
var ackIds_JSON = {"ackIds":ackIds};
logger.warn("Acknowledgement Ids"+JSON.stringify(ackIds));
var params_ack = {
	proxyScheme: undefined /* STRING */,
	headers: {"Content-Type":"application/json","Accept":"application/json","Authorization": org_auth_key} /* JSON */,
	ignoreSSLErrors: undefined /* BOOLEAN */,
	useNTLM: undefined /* BOOLEAN */,
	workstation: undefined /* STRING */,
	useProxy: undefined /* BOOLEAN */,
	withCookies: undefined /* BOOLEAN */,
	proxyHost: undefined /* STRING */,
	url: "https://pubsub.googleapis.com/v1/projects/"+project_name+"/subscriptions/"+sub_Name+":acknowledge" /* STRING */,
	content: ackIds_JSON /* JSON */,
	timeout: undefined /* NUMBER */,
	proxyPort: undefined /* INTEGER */,
	password: undefined /* STRING */,
	domain: undefined /* STRING */,
	username: undefined /* STRING */
};

// result: JSON
var result_ack = Resources["ContentLoaderFunctions"].PostJSON(params_ack);
logger.warn("Message data"+JSON.stringify(pullMessage_result.receivedMessages[0].message));
if(result_ack.headers !== null)
{
    googlePubSubMessageData = pullMessage_result.receivedMessages[0].message;  
    googlePubSubMessageData.data = JSON.parse(base64DecodeString(googlePubSubMessageData.data));
}
    else{
        googlePubSubMessageData = {};
    }
var result = googlePubSubMessageData;
}
else{
    var result = {"error":"no messages received from gcp"};
}
}
catch(e){
    var result = {"error":e.message};
    logger.warn("Exception in PullDataFromExternalSource(GooglePubSub) is : "+e.message);
}