//Inputs: input(JSON)
//Output: result(JSON)
try{
    var groupName = input.groupName;
    var groupType = input.groupType;
    var oldURL = input.oldURL;
    var newURL = input.newURL;
    var flexDynamicConfig = Things["GenericIEMasterConfig"].FlexDynamicGroupConfig;
    var hostname = flexDynamicConfig[groupName].hostname;
    var midpoint = flexDynamicConfig[groupName].midpoint;
    var username = flexDynamicConfig[groupName].username;
    var password = flexDynamicConfig[groupName].password;
    var tempResult = {};
    if(hostname !== "" && midpoint !== "" && username !== "" && password !== "") {
    	//first update FlexConfig thing with given group host properties so that we can call generic services to call flex apis in flexshape group
        Things["FlexConfig"].hostname = hostname;
        Things["FlexConfig"].midpoint = midpoint;
        Things["FlexConfig"].username = username;
        Things["FlexConfig"].password = password;
        if (groupType === 'source') {
            var params = {
                input: {
                    "oldBaseUrl": oldURL, "newBaseUrl": newURL, "thingTemplate": groupName
                } /* JSON */
            };

            // result: JSON
            tempResult = Things["FlexConfig"].ResetTriggerBaseUrl(params);
       } else tempResult = {"warning": "Given Flex group is Target type. so can't update the base url for target type "}
    } else tempResult = {"warning": "HostProperties are empty for given flex group"}
    var result =tempResult;
}catch(e){
    var result = {"error":e};
    logger.warn("Exception in UpdateTRCServerURLInFlexPLM service is :"+e);
}
