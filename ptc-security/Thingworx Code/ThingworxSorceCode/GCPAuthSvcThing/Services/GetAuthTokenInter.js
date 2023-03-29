try {
result = {};
// Token: JSON
var result = me.GetAuthToken({
	SvcAcctKey: privateKey /* JSON */,
	Scope: Scope /* STRING */
});
} catch(err) {
logger.warn("Exception in getAuthTokenInter service ::"+err.message);
}
