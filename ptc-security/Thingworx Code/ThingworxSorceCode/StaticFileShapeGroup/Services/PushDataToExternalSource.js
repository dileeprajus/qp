//INPUTS: body(JSON),headers(JSON),url_params(JSON)
//OUTPUTS: result(JSON)
try{
	var result = body;
//    	var tTime = new Date();
//	var getParams = {
//			input: {
//					"tSeq" : Things["FlexConfig"].FindCurrentHieghtTransactionSequenceNum(),
//					"name" : me.name,
//					"tTime": tTime
//			} /* JSON */
//	};
//	// result: JSON
//	var tranSeqresult = Things[me.name].GetCurrentTargetTransactionSeqRow(getParams);
   // logger.warn("Data is pushed successfully to "+me.name+" Config: "+result);
}catch(e){
    var result = {"Exception":e};
    logger.warn("Exception in PushDataToExternalSource service  "+e);
	    var mailService =  Things["GenericIEMasterConfig"].HandleCatchExceptions({
        input: {
            CC: Things["GenericIEMasterConfig"].EmailConfiguration.CC,
            BCC:Things["GenericIEMasterConfig"].EmailConfiguration.BCC,
            To:Things["GenericIEMasterConfig"].EmailConfiguration.To,
            payload:e.message,
            Subject:"PushDataToExternalSource"
        }
    });
}
