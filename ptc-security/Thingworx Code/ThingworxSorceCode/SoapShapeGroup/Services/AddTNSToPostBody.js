//INPUTS: data(JSON)
//OUTPUTS: string(xml)
try{
    var obj={};
    var params = {
        input: data /* JSON */
    };

    // result: INTEGER
    var obj_length = me.GetObjectLength(params);
    if(obj_length===1){// add the target namespaces as childs to the rootelement in the object
        for(var key in data){
            var temp_obj=data[key];
            var tempSchemaObj = {};
            var tempTags = me.tags;
             if(tempTags == "Applications:IE;Applications:DynamicConfig;Applications:Source"){
                var configJson = me.ConfigJson;
                if(configJson["SelectedRequestSchema"]){
                	tempSchemaObj = configJson["SelectedRequestSchema"];
                }
            } else if(tempTags == "Applications:IE;Applications:DynamicConfig;Applications:Target"){
                tempSchemaObj = me.inputSchema;
            } else{}
            for(var k in tempSchemaObj){
                var arr=k.split("");
                if(arr[0]==="@"){
                    // form targetname space object like{"tns":["@xmlns:tns","http://sdklsdjfsd...."],"xsd":["@xmlns:xsd","http:....."]}
                    var str=k.split(":");
                    //split key with : operator ["@xmlns","tns"]
                    obj[str[2]]=[k,tempSchemaObj[k]];
                    //save obj as {"tns":["@xmlns:tns","namespace value"]}

                    data[key][k]=tempSchemaObj[k];
                }
            }

        }

    }

    //var result=data;
    var xml_params = {
        InputJson: JSON.parse(data)//{"tns__*getDmRawMatMacroFamilyByExternalId":{"externalId":"sed tempor aute laborum","@targetNamespace":"http://services.webservices.rcsdm.cadwin.com/","@xmlns:tns":"http://services.webservices.rcsdm.cadwin.com/","@xmlns:xsd":"http://www.w3.org/2001/XMLSchema","@elementFormDefault":"unqualified","@attributeFormDefault":"unqualified"}} /* JSON */
    };

    // result: STRING
    var json2xml = me.JsonToXML(xml_params);
    if(Things["GenericIEMasterConfig"].isEnableScriptLogs === true) {
    	logger.warn("Result for jsonToxml is: "+json2xml);
    }
    //var result = {"JSON2XML":json2xml}
    var result = json2xml;
    //me.convetedXML = json2xml;

}
catch(e){
    logger.warn('Error in AddTNSToPostBody Service'+e)
    var result=e;
}
