try{
result = {};
// Token: JSON
var token = me.GetAuthToken({
	SvcAcctKey: privateKey /* JSON */,
	Scope: Scope /* STRING */
});

if(token.expirationTimeMillis != undefined && token.tokenValue != undefined)
{
    result.status = "Success";
}else{
    result.status = "failure";
}
} catch(err) {
logger.warn("Exception in LoginInputJSON service ::"+err.message);
}

