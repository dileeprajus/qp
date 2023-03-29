package com.content85;

import com.thingworx.logging.LogUtilities;
import com.thingworx.metadata.annotations.ThingworxServiceDefinition;
import com.thingworx.metadata.annotations.ThingworxServiceParameter;
import com.thingworx.metadata.annotations.ThingworxServiceResult;
import com.thingworx.common.utils.HttpUtilities;
import com.thingworx.common.utils.StringUtilities;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;

public class CLoaderServiceShape {
	
	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(CLoaderServiceShape.class);


	public CLoaderServiceShape() {
		// TODO Auto-generated constructor stub
	}
	
	@ThingworxServiceDefinition(name = "PostJSON", description = "PostJSON", category = "", isAllowOverride = false, aspects = {
	"isAsync:false" })
@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
public JSONObject PostJSON(
	@ThingworxServiceParameter(name = "url", description = "URL to load", baseType = "STRING") String url,
	@ThingworxServiceParameter(name = "content", description = "Posted content as JSON object", baseType = "JSON") JSONObject content,
	@ThingworxServiceParameter(name = "username", description = "Optional user name credential", baseType = "STRING") String username,
	@ThingworxServiceParameter(name = "password", description = "Optional password credential", baseType = "STRING") String password,
	@ThingworxServiceParameter(name = "headers", description = "Optional HTTP headers", baseType = "JSON") JSONObject headers,
	@ThingworxServiceParameter(name = "ignoreSSLErrors", description = "Ignore SSL Certificate Errors", baseType = "BOOLEAN") Boolean ignoreSSLErrors,
	@ThingworxServiceParameter(name = "withCookies", description = "Include cookies in response", baseType = "BOOLEAN", aspects = {
			"defaultValue:false" }) Boolean withCookies,
	@ThingworxServiceParameter(name = "timeout", description = "Optional timeout in seconds", baseType = "NUMBER", aspects = {
			"defaultValue:60" }) Double timeout,
	@ThingworxServiceParameter(name = "useNTLM", description = "Use NTLM Authentication", baseType = "BOOLEAN", aspects = {
			"defaultValue:false" }) Boolean useNTLM,
	@ThingworxServiceParameter(name = "workstation", description = "Auth workstation", baseType = "STRING", aspects = {
			"defaultValue:" }) String workstation,
	@ThingworxServiceParameter(name = "domain", description = "Auth domain", baseType = "STRING", aspects = {
			"defaultValue:" }) String domain,
	@ThingworxServiceParameter(name = "useProxy", description = "Use Proxy server", baseType = "BOOLEAN", aspects = {
			"defaultValue:false" }) Boolean useProxy,
	@ThingworxServiceParameter(name = "proxyHost", description = "Proxy host", baseType = "STRING", aspects = {
			"defaultValue:" }) String proxyHost,
	@ThingworxServiceParameter(name = "proxyPort", description = "Proxy port", baseType = "INTEGER", aspects = {
			"defaultValue:8080" }) Integer proxyPort,
	@ThingworxServiceParameter(name = "proxyScheme", description = "Proxy scheme", baseType = "STRING", aspects = {
			"defaultValue:http" }) String proxyScheme)
	throws Exception {

JSONObject resultjsonObject = new JSONObject();
try {
	resultjsonObject = HttpUtilities.PostJSON(url, content, username,
			StringUtilities.stringToByteArray(password), headers, ignoreSSLErrors, withCookies, timeout,
			useNTLM, workstation, domain, useProxy, proxyHost, proxyPort, proxyScheme, Boolean.valueOf(true));
	if(resultjsonObject.has("responseHeaders"))
		resultjsonObject.remove("responseHeaders");
} catch (JSONException e) {

	resultjsonObject.put("error", e.getMessage());
}
return resultjsonObject;
}

@ThingworxServiceDefinition(name = "LoadJSON", description = "Get json content from a URL", category = "JSON", isAllowOverride = false, aspects = {
	"isAsync:false" })
@ThingworxServiceResult(name = "Result", description = "Loaded content as text content", baseType = "JSON", aspects = {})
public JSONObject LoadJSON(
	@ThingworxServiceParameter(name = "url", description = "URL to load", baseType = "STRING") String url,
	@ThingworxServiceParameter(name = "content", description = "Posted content as JSON object", baseType = "JSON") JSONObject content,
	@ThingworxServiceParameter(name = "username", description = "Optional user name credential", baseType = "STRING") String username,
	@ThingworxServiceParameter(name = "password", description = "Optional password credential", baseType = "STRING") String password,
	@ThingworxServiceParameter(name = "headers", description = "Optional HTTP headers", baseType = "JSON") JSONObject headers,
	@ThingworxServiceParameter(name = "ignoreSSLErrors", description = "Ignore SSL Certificate Errors", baseType = "BOOLEAN") Boolean ignoreSSLErrors,
	@ThingworxServiceParameter(name = "withCookies", description = "Include cookies in response", baseType = "BOOLEAN", aspects = {
			"defaultValue:false" }) Boolean withCookies,
	@ThingworxServiceParameter(name = "timeout", description = "Optional timeout in seconds", baseType = "NUMBER", aspects = {
			"defaultValue:60" }) Double timeout,
	@ThingworxServiceParameter(name = "useNTLM", description = "Use NTLM Authentication", baseType = "BOOLEAN", aspects = {
			"defaultValue:false" }) Boolean useNTLM,
	@ThingworxServiceParameter(name = "workstation", description = "Auth workstation", baseType = "STRING", aspects = {
			"defaultValue:" }) String workstation,
	@ThingworxServiceParameter(name = "domain", description = "Auth domain", baseType = "STRING", aspects = {
			"defaultValue:" }) String domain,
	@ThingworxServiceParameter(name = "useProxy", description = "Use Proxy server", baseType = "BOOLEAN", aspects = {
			"defaultValue:false" }) Boolean useProxy,
	@ThingworxServiceParameter(name = "proxyHost", description = "Proxy host", baseType = "STRING", aspects = {
			"defaultValue:" }) String proxyHost,
	@ThingworxServiceParameter(name = "proxyPort", description = "Proxy port", baseType = "INTEGER", aspects = {
			"defaultValue:8080" }) Integer proxyPort,
	@ThingworxServiceParameter(name = "proxyScheme", description = "Proxy scheme", baseType = "STRING", aspects = {
			"defaultValue:http" }) String proxyScheme)
	throws Exception {

JSONObject resultjsonObject = new JSONObject();
try {
	resultjsonObject = HttpUtilities.LoadJSON(url, username, StringUtilities.stringToByteArray(password),
			headers, ignoreSSLErrors, withCookies, timeout, useNTLM, workstation, domain, useProxy, proxyHost,
			proxyPort, proxyScheme, Boolean.valueOf(true));
	if(resultjsonObject.has("responseHeaders"))
		resultjsonObject.remove("responseHeaders");
} catch (JSONException e) {
	resultjsonObject.put("error", e.getMessage());
}
return resultjsonObject;
}

@ThingworxServiceDefinition(name = "GetJSON", description = "Get json content from a URL", category = "JSON", isAllowOverride = false, aspects = {
	"isAsync:false" })
@ThingworxServiceResult(name = "result", description = "Loaded content as text content", baseType = "JSON", aspects = {})
public JSONObject GetJSON(
	@ThingworxServiceParameter(name = "url", description = "URL to load", baseType = "STRING") String url,
	@ThingworxServiceParameter(name = "content", description = "Posted content as JSON object", baseType = "JSON") JSONObject content,
	@ThingworxServiceParameter(name = "username", description = "Optional user name credential", baseType = "STRING") String username,
	@ThingworxServiceParameter(name = "password", description = "Optional password credential", baseType = "STRING") String password,
	@ThingworxServiceParameter(name = "headers", description = "Optional HTTP headers", baseType = "JSON") JSONObject headers,
	@ThingworxServiceParameter(name = "ignoreSSLErrors", description = "Ignore SSL Certificate Errors", baseType = "BOOLEAN") Boolean ignoreSSLErrors,
	@ThingworxServiceParameter(name = "withCookies", description = "Include cookies in response", baseType = "BOOLEAN", aspects = {
			"defaultValue:false" }) Boolean withCookies,
	@ThingworxServiceParameter(name = "timeout", description = "Optional timeout in seconds", baseType = "NUMBER", aspects = {
			"defaultValue:60" }) Double timeout,
	@ThingworxServiceParameter(name = "useNTLM", description = "Use NTLM Authentication", baseType = "BOOLEAN", aspects = {
			"defaultValue:false" }) Boolean useNTLM,
	@ThingworxServiceParameter(name = "workstation", description = "Auth workstation", baseType = "STRING", aspects = {
			"defaultValue:" }) String workstation,
	@ThingworxServiceParameter(name = "domain", description = "Auth domain", baseType = "STRING", aspects = {
			"defaultValue:" }) String domain,
	@ThingworxServiceParameter(name = "useProxy", description = "Use Proxy server", baseType = "BOOLEAN", aspects = {
			"defaultValue:false" }) Boolean useProxy,
	@ThingworxServiceParameter(name = "proxyHost", description = "Proxy host", baseType = "STRING", aspects = {
			"defaultValue:" }) String proxyHost,
	@ThingworxServiceParameter(name = "proxyPort", description = "Proxy port", baseType = "INTEGER", aspects = {
			"defaultValue:8080" }) Integer proxyPort,
	@ThingworxServiceParameter(name = "proxyScheme", description = "Proxy scheme", baseType = "STRING", aspects = {
			"defaultValue:http" }) String proxyScheme)
	throws Exception {

JSONObject resultjsonObject = new JSONObject();
try {
	resultjsonObject = HttpUtilities.LoadJSON(url, username, StringUtilities.stringToByteArray(password),
			headers, ignoreSSLErrors, withCookies, timeout, useNTLM, workstation, domain, useProxy, proxyHost,
			proxyPort, proxyScheme, Boolean.valueOf(true));
	if(resultjsonObject.has("responseHeaders"))
		resultjsonObject.remove("responseHeaders");
	
} catch (JSONException e) {
	resultjsonObject.put("error", e.getMessage());
}
return resultjsonObject;
}


	@ThingworxServiceDefinition(name = "Delete", description = "Invoke an HTTP delete request on a URL", category = "Delete")
	public void Delete(
			@ThingworxServiceParameter(name = "url", description = "URL to load", baseType = "STRING") String url,
			@ThingworxServiceParameter(name = "username", description = "Optional user name credential", baseType = "STRING") String username,
			@ThingworxServiceParameter(name = "password", description = "Optional password credential", baseType = "STRING") String password,
			@ThingworxServiceParameter(name = "headers", description = "Optional HTTP headers", baseType = "JSON") JSONObject headers,
			@ThingworxServiceParameter(name = "ignoreSSLErrors", description = "Ignore SSL Certificate Errors", baseType = "BOOLEAN") Boolean ignoreSSLErrors,
			@ThingworxServiceParameter(name = "withCookies", description = "Include cookies in response", baseType = "BOOLEAN", aspects = {
					"defaultValue:false" }) Boolean withCookies,
			@ThingworxServiceParameter(name = "timeout", description = "Optional timeout in seconds", baseType = "NUMBER", aspects = {
					"defaultValue:60" }) Double timeout,
			@ThingworxServiceParameter(name = "useNTLM", description = "Use NTLM Authentication", baseType = "BOOLEAN", aspects = {
					"defaultValue:false" }) Boolean useNTLM,
			@ThingworxServiceParameter(name = "workstation", description = "Auth workstation", baseType = "STRING", aspects = {
					"defaultValue:" }) String workstation,
			@ThingworxServiceParameter(name = "domain", description = "Auth domain", baseType = "STRING", aspects = {
					"defaultValue:" }) String domain,
			@ThingworxServiceParameter(name = "useProxy", description = "Use Proxy server", baseType = "BOOLEAN", aspects = {
					"defaultValue:false" }) Boolean useProxy,
			@ThingworxServiceParameter(name = "proxyHost", description = "Proxy host", baseType = "STRING", aspects = {
					"defaultValue:" }) String proxyHost,
			@ThingworxServiceParameter(name = "proxyPort", description = "Proxy port", baseType = "INTEGER", aspects = {
					"defaultValue:8080" }) Integer proxyPort,
			@ThingworxServiceParameter(name = "proxyScheme", description = "Proxy scheme", baseType = "STRING", aspects = {
					"defaultValue:http" }) String proxyScheme)
			throws Exception
{
  HttpUtilities.Delete(url, username, StringUtilities.stringToByteArray(password), headers, ignoreSSLErrors, withCookies, timeout, useNTLM, workstation, domain, useProxy, proxyHost, proxyPort, proxyScheme, Boolean.valueOf(true));
}
	
	@ThingworxServiceDefinition(name = "PutJSON", description = "Load JSON content from a URL via HTTP PUT", category = "JSON")
	@ThingworxServiceResult(name = "result", description = "Loaded content as JSON Object", baseType = "JSON")
	public JSONObject PutJSON(
			@ThingworxServiceParameter(name = "url", description = "URL to load", baseType = "STRING") String url,
			@ThingworxServiceParameter(name = "content", description = "Posted content as JSON object", baseType = "JSON") JSONObject content,
			@ThingworxServiceParameter(name = "username", description = "Optional user name credential", baseType = "STRING") String username,
			@ThingworxServiceParameter(name = "password", description = "Optional password credential", baseType = "STRING") String password,
			@ThingworxServiceParameter(name = "headers", description = "Optional HTTP headers", baseType = "JSON") JSONObject headers,
			@ThingworxServiceParameter(name = "ignoreSSLErrors", description = "Ignore SSL Certificate Errors", baseType = "BOOLEAN") Boolean ignoreSSLErrors,
			@ThingworxServiceParameter(name = "withCookies", description = "Include cookies in response", baseType = "BOOLEAN", aspects = {
					"defaultValue:false" }) Boolean withCookies,
			@ThingworxServiceParameter(name = "timeout", description = "Optional timeout in seconds", baseType = "NUMBER", aspects = {
					"defaultValue:60" }) Double timeout,
			@ThingworxServiceParameter(name = "useNTLM", description = "Use NTLM Authentication", baseType = "BOOLEAN", aspects = {
					"defaultValue:false" }) Boolean useNTLM,
			@ThingworxServiceParameter(name = "workstation", description = "Auth workstation", baseType = "STRING", aspects = {
					"defaultValue:" }) String workstation,
			@ThingworxServiceParameter(name = "domain", description = "Auth domain", baseType = "STRING", aspects = {
					"defaultValue:" }) String domain,
			@ThingworxServiceParameter(name = "useProxy", description = "Use Proxy server", baseType = "BOOLEAN", aspects = {
					"defaultValue:false" }) Boolean useProxy,
			@ThingworxServiceParameter(name = "proxyHost", description = "Proxy host", baseType = "STRING", aspects = {
					"defaultValue:" }) String proxyHost,
			@ThingworxServiceParameter(name = "proxyPort", description = "Proxy port", baseType = "INTEGER", aspects = {
					"defaultValue:8080" }) Integer proxyPort,
			@ThingworxServiceParameter(name = "proxyScheme", description = "Proxy scheme", baseType = "STRING", aspects = {
					"defaultValue:http" }) String proxyScheme)
			throws Exception
	  {
	    return HttpUtilities.PutJSON(url, content, username, StringUtilities.stringToByteArray(password), headers, ignoreSSLErrors, withCookies, timeout, useNTLM, workstation, domain, useProxy, proxyHost, proxyPort, proxyScheme, Boolean.valueOf(true));
	  }

}
