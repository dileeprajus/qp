//INPUTS:	Nothing
// OUTPUTS: result(XML)

try{
    var xmlAsJson = me.JSONData;
    //var params = {
    //	input: xmlAsJson /* JSON */
    //};
    //
    //// result: STRING
    ////var xmlStr = Things["MappingThing"].GetXMLFromJson(params);
    //
    //var result = Things["MappingThing"].GetXMLFromJson(params);
    var tempJson = xmlAsJson;
    if(xmlAsJson["ROOT"]){
        tempJson = xmlAsJson;
    }
    else {
        tempJson = {"ROOT":xmlAsJson};
    }
    var params = {
        InputJson:  tempJson /* JSON */
    };

    // result: STRING
    var result = me.JsonToXML(params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
   	 logger.warn("Static JsonToXML result is: "+result);
    }

    //var params = {
    //	XmlString: xmlStr /* STRING */
    //};
    //
    //// result: XML
    //var result = Things["MappingThing"].ConvertStringToXML(params);
    //
}
catch(e){
    var result = {"error":e};
    logger.warn("Exception in GetXMLData service:  "+e);
}
