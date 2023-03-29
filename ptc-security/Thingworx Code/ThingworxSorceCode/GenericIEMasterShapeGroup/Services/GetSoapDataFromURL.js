//INPUTS input(JSON){FromURL:soapurl to get the data}
// OUTPUTS: JSON({Result:wsdlstring})
try{
    var from_url = input.FromURL;
    var params = {
    headers: {"Content-Type": "application/xml",} /* JSON */,	
	url: from_url /* STRING */,	
    };

    // result: XML
    var wsdlresult = Resources["ContentLoaderFunctions"].GetXML(params);
    var wsdl_str = "";
   	wsdl_str = wsdlresult;
    var result = {"Result":wsdl_str};
}catch(e){
    var result={"Result":"Exception"+e};
    logger.warn("Exception in GetSoapDataFromURL service: "+e);
}
