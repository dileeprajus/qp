//INPUTS:	input(JSON)
// OUTPUTS: result(JSON)

var params = {
	InputJson: input
};
// result: JSON
var result = Things["MappingConfig"].GetOAuth2Authentication(params);
logger.warn("AuthoCodeGrantType Response : "+JSON.stringify(result))