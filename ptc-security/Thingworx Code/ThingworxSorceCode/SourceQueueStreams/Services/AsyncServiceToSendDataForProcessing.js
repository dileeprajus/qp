try {
    if (sourceObj.SourceType === "Flex" || sourceObj.SourceType === "Rest" || sourceObj.SourceType === "Soap") {
        var transactionObj = sourceObj.transactionObj;
        transactionObj.sourceData = sourceObj.Payload.data;
        transactionObj.TIMESTAMP = sourceObj.timestamp;
        var params = {
            input: sourceObj.Payload.data,
            transactionObj: transactionObj
        };
        if (sourceObj.ServiceName === "CreateTrigger") {
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            	logger.warn('CreateTrigger of ' + sourceObj.SourceType);
            }
            Things[sourceObj.SourceName].SynchronousCreateTrigger(params);
        } else if (sourceObj.ServiceName === "UpdateTrigger") {
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
            	logger.warn('UpdateTrigger of ' + sourceObj.SourceType);
            }
            Things[sourceObj.SourceName].SynchronousUpdateTrigger(params);
        } else if (sourceObj.ServiceName === "DeleteTrigger") {
            if (Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
                logger.warn('DeleteTrigger of ' + sourceObj.SourceType);
            }
            Things[sourceObj.SourceName].SynchronousDeleteTrigger(params);
        } else {
            logger.warn('No Trigger is enabled');
        }
    }
} catch (error) {
    logger.error("Error in AsyncServiceToSendDataForProcessing : " + error);
}