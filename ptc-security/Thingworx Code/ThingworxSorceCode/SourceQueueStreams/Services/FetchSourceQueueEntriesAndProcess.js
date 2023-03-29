var cnt = me.GetStreamEntryCount();
if(cnt!==0) {
// result: INFOTABLE dataShape: ""
var result =  me.GetStreamEntriesWithData({
	oldestFirst: true /* BOOLEAN */,
	maxItems: maxItems /* NUMBER */
});
var schedulerCnt = me.schedularCount;
me.schedularCount = schedulerCnt+1;
var stream = me;
    if(result.rows.length) {
        logger.warn("in fetch entries"+result.rows.length);
    	for(var row=0; row < result.rows.length; row++){
        var sourceObj  = result.rows[row];
         me.AsyncServiceToSendDataForProcessing({
            sourceObj: sourceObj /* JSON */
        });
        stream.DeleteStreamEntry({ streamEntryId: sourceObj.id }); 
            pause(me.SleepTime);
    }
    }
}else {
     if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
  		 logger.warn('::::::::::NO STREAM RECORDS TO PROCESS::::::::::'+me.GetStreamEntryCount());
     }
}