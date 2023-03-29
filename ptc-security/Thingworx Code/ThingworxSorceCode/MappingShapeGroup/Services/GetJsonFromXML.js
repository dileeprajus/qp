//***********************************************************************
// Main function. Clears the given xml and then starts the recursion
//***********************************************************************
function xml2json(xmlStr){
    xmlStr = cleanXML(xmlStr);
    return xml2jsonRecurse(xmlStr,0);
}
 
//***********************************************************************
// Recursive function that creates a JSON object with a given XML string.
//***********************************************************************
function xml2jsonRecurse(xmlStr) {
    var obj = {},
        tagName, indexClosingTag, inner_substring, tempVal, openingTag;
 
    while (xmlStr.match(/<[^\/][^>]*>/)) {
        openingTag = xmlStr.match(/<[^\/][^>]*>/)[0];
        tagName = openingTag.substring(1, openingTag.length - 1);
        indexClosingTag = xmlStr.indexOf(openingTag.replace('<', '</'));
 
        // account for case where additional information in the openning tag
        if (indexClosingTag == -1) {
 
            tagName = openingTag.match(/[^<][\w+$]*/)[0];
            indexClosingTag = xmlStr.indexOf('</' + tagName);
            if (indexClosingTag == -1) {
                indexClosingTag = xmlStr.indexOf('<\\/' + tagName);
            }
        }
        inner_substring = xmlStr.substring(openingTag.length, indexClosingTag);
        if (inner_substring.match(/<[^\/][^>]*>/)) {
            tempVal = xml2json(inner_substring);
        }
        else {
            tempVal = inner_substring;
            if(tempVal===""||tempVal===undefined||tempVal===null){
				tempVal = "NULL";
            }
            var params = {
				//XmlString: tempVal
                input: tempVal
			};
			// result: JSON
			var exact_value = me.GetDataType(params);
            logger.warn(JSON.stringify(exact_value));
            tempVal = exact_value["value"];
            
        }
        // account for array or obj //
        if (obj[tagName] === undefined) {
            obj[tagName] = tempVal;
        }
        else if (Array.isArray(obj[tagName])) {
            obj[tagName].push(tempVal);
        }
        else {
            obj[tagName] = [obj[tagName], tempVal];
        }
 
        xmlStr = xmlStr.substring(openingTag.length * 2 + 1 + inner_substring.length);
    }
 
    return obj;
}
 
//*****************************************************************
// Removes some characters that would break the recursive function.
//*****************************************************************
function cleanXML(xmlStr) {
 
    xmlStr = xmlStr.replace( /<!--[\s\S]*?-->/g, '' ); //remove commented lines
    xmlStr = xmlStr.replace(/\<(\?xml|(\!DOCTYPE[^\>\[]+(\[[^\]]+)?))+[^>]+\>/g, ''); //remove !DOCTYPE, ?xml tags
    xmlStr = xmlStr.replace(/\n|\t|\r/g, ''); //replace special characters
    xmlStr = xmlStr.replace(/ {1,}<|\t{1,}</g, '<'); //replace leading spaces and tabs
    xmlStr = xmlStr.replace(/> {1,}|>\t{1,}/g, '>'); //replace trailing spaces and tabs
    xmlStr = xmlStr.replace(/<\?[^>]*\?>/g, ''); //delete docType tags
 
    xmlStr = replaceSelfClosingTags(xmlStr); //replace self closing tags
    xmlStr = replaceAloneValues(xmlStr); //replace the alone tags values
    xmlStr = replaceAttributes(xmlStr); //replace attributes
 
    return xmlStr;
}
 
//************************************************************************************************************
// Replaces all the self closing tags with attributes with another tag containing its attribute as a property.
// The function works if the tag contains multiple attributes.
//
// Example : '<tagName attrName="attrValue" />' becomes
//           '<tagName><attrName>attrValue</attrName></tagName>'
//************************************************************************************************************
function replaceSelfClosingTags(xmlStr) {
 
    var selfClosingTags = xmlStr.match(/<[^/][^>]*\/>/g);
 
    if (selfClosingTags) {
        for (var i = 0; i < selfClosingTags.length; i++) {
 
            var oldTag = selfClosingTags[i];
            var tempTag = oldTag.substring(0, oldTag.length - 2);
            tempTag += ">";
 
            var tagName = oldTag.match(/[^<][\w+$]*/)[0];
            var closingTag = "</" + tagName + ">";
            var newTag = "<" + tagName + ">";
 
            //var attrs = tempTag.match(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g);
 			var attrs = oldTag.match(/(\S+)=/g);
            
            if (attrs) {
                /*for(var j = 0; j < attrs.length; j++) {
                    var attr = attrs[j];
                    var attrName = attr.substring(0, attr.indexOf('='));
                    var attrValue = attr.substring(attr.indexOf('"') + 1, attr.lastIndexOf('"'));
 					*/
                for(var s = 0; s < attrs.length; s++) {
                var attrName = attrs[s].slice(0, -1);
                if(s===attrs.length-1){
                    
                	var attrValue = tempTag.substring(tempTag.indexOf(attrs[s])+attrs[s].length,tempTag.indexOf('>'))
                }
                else{
                    var attrValue = tempTag.substring(tempTag.indexOf(attrs[s])+attrs[s].length,tempTag.indexOf(attrs[s+1])-1);
                }
                    //newTag += "<" +  attrName + ">" + attrValue + "</" +  attrName + ">";
                	newTag += "<" + "_" + attrName + ">" + stripEndQuotes(attrValue) + "</" +  "_" +attrName + ">";
                }
            }
 
            newTag += closingTag;
 
            xmlStr = xmlStr.replace(oldTag, newTag);
        }
    }
 
    return xmlStr;
}
 
//*************************************************************************************************
// Replaces all the tags with attributes and a value with a new tag.
//
// Example : '<tagName attrName="attrValue">tagValue</tagName>' becomes
//           '<tagName><attrName>attrValue</attrName><_@attribute>tagValue</_@attribute></tagName>'
//*************************************************************************************************
function replaceAloneValues(xmlStr) {
 
    var tagsWithAttributesAndValue = xmlStr.match(/<[^\/][^>][^<]+\s+.[^<]+[=][^<]+>{1}([^<]+)/g);
 
    if (tagsWithAttributesAndValue) {
        for(var i = 0; i < tagsWithAttributesAndValue.length; i++) {
 
            var oldTag = tagsWithAttributesAndValue[i];
            var oldTagName = oldTag.substring(0, oldTag.indexOf(">") + 1);
            var oldTagValue = oldTag.substring(oldTag.indexOf(">") + 1);
 
            //var newTag = oldTagName + "<_@ttribute>" + oldTagValue + "</_@ttribute>";
			var newTag = oldTagName + "<__text>" + oldTagValue + "</__text>";
            
            xmlStr = xmlStr.replace(oldTag, newTag);
        }
    }
 
    return xmlStr;
}
 
//*****************************************************************************************************************
// Replaces all the tags with attributes with another tag containing its attribute as a property.
// The function works if the tag contains multiple attributes.
//
// Example : '<tagName attrName="attrValue"></tagName>' becomes '<tagName><attrName>attrValue</attrName></tagName>'
//*****************************************************************************************************************
function replaceAttributes(xmlStr) {
 
    var tagsWithAttributes = xmlStr.match(/<[^\/][^>][^<]+\s+.[^<]+[=][^<]+>/g);
    if (tagsWithAttributes) {
        for (var i = 0; i < tagsWithAttributes.length; i++) {
 			
            var oldTag = tagsWithAttributes[i];
            var tagName = oldTag.match(/[^<][\w+$]*/)[0];
            var newTag = "<" + tagName + ">";            
			
            var attrs = oldTag.match(/(\S+)=/g);
            for(var s = 0; s < attrs.length; s++) {
                if(s===attrs.length-1){
                    
                	var attrValue = oldTag.substring(oldTag.indexOf(attrs[s])+attrs[s].length,oldTag.indexOf('>'))
                }
                else{
                    var attrValue = oldTag.substring(oldTag.indexOf(attrs[s])+attrs[s].length,oldTag.indexOf(attrs[s+1])-1);
                }
                newTag += "<" + "_" + attrs[s].slice(0, -1) + ">" + stripEndQuotes(attrValue) + "</" +  "_" +attrs[s].slice(0, -1) + ">";
                
            }
            
            xmlStr = xmlStr.replace(oldTag, newTag);
        }
    }
 
    return xmlStr;
}

function stripEndQuotes(s){
    s=s.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
	var t=s.length;
	if ((s.charAt(0)=="'") || (s.charAt(0)=='"')) s=s.substring(1,t--);
	if ((s.charAt(--t)=="'") || (s.charAt(t)=='"')) s=s.substring(0,t);
	return s;
}

var result = xml2json(input);