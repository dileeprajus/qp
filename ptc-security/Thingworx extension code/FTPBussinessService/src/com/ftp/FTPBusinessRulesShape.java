package com.ftp;

import java.io.IOException;
import java.text.ParseException;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;

import com.ftp.controller.FTPFileOperations;
import com.sftp.controller.SFTPFileOperations;
import com.thingworx.logging.LogUtilities;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.SftpException;
import com.thingworx.metadata.annotations.ThingworxServiceDefinition;
import com.thingworx.metadata.annotations.ThingworxServiceParameter;
import com.thingworx.metadata.annotations.ThingworxServiceResult;

public class FTPBusinessRulesShape {
	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(FTPBusinessRulesShape.class);

	FTPFileOperations ftpFileOperations = new FTPFileOperations();
	SFTPFileOperations sftpFileOperations = new SFTPFileOperations();
	public FTPBusinessRulesShape() {
		// TODO Auto-generated constructor stub
	}
	
	/*@ThingworxServiceDefinition(name = "FTPFileWritter", description = "Writing file to FTP server", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject FTPFileWritter(
			@ThingworxServiceParameter(name = "FileLocation", description = "", baseType = "STRING", aspects = {
					"isRequired:true" }) String fileLocation,
			@ThingworxServiceParameter(name = "FileName", description = "File Name", baseType = "STRING", aspects = {
					"isRequired:true" }) String fileName) {
		_logger.trace("Entering Service: FTPFileWritter");
		_logger.trace("Exiting Service: FTPFileWritter");
		return ftpFileWriter.ftpFileWrite(fileLocation, fileName);
	}
*/	
	
	
	/**
	 * Check FTP Connection
	 * 
	 * @param ftpJSON 
	 * returns String json.
	 * @throws JSchException 
	 * @throws IOException 
	 */	
	@ThingworxServiceDefinition(name = "CheckFTPConnection", description = "Checking whether FTP server is up and running or not", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject CheckFTPConnection(
			@ThingworxServiceParameter(name = "ftpJSON", description = "host Properties", baseType = "JSON", aspects = {
					"isRequired:true" }) JSONObject ftpJSON) throws ParseException,JSONException,SftpException, JSchException, IOException{
		_logger.error("Entering Service: CheckFTPConnection");
	//	_logger.error("Exiting Service: CheckFTPConnection"+ftpJSON );
		JSONObject jo = new JSONObject();
		JSONObject hostJson = (JSONObject) ftpJSON.get("hostProperties");
		String mode = (String) hostJson.get("selectMode");
		org.json.simple.JSONObject jsonObj = new org.json.simple.JSONObject();
		try{
			if(mode.equalsIgnoreCase("FTP"))
			{
				jsonObj =  ftpFileOperations.getFtpFileTransfer(ftpJSON);
			}
			else if (mode.equalsIgnoreCase("SFTP"))
			{
				jsonObj =  sftpFileOperations.getSFTPFileTransfer(ftpJSON);
			}
			//JSONObject jo = new JSONObject();
			jo.put("result", jsonObj);
			return jo;
		}catch(JSONException je){
			jo.put("FtpConnection", je.getMessage());
			return jo;
		}
	}

	@ThingworxServiceDefinition(name = "DeleteAllFiles", description = "", category = "", isAllowOverride = false, aspects = {
			"isAsync:false" })
	@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
	public JSONObject DeleteAllFiles(
			@ThingworxServiceParameter(name = "inputJson", description = "", baseType = "JSON", aspects = {
					"isRequired:true" }) JSONObject inputJson) throws ParseException,JSONException,SftpException, JSchException, IOException {
		_logger.info("Entering Service: DeleteAllFiles");
		JSONObject hostJson = (JSONObject) inputJson.get("hostProperties");
		String mode = (String) hostJson.get("selectMode");
		
		org.json.simple.JSONObject jsonObj = new org.json.simple.JSONObject();
		if(mode.equalsIgnoreCase("FTP"))
		{
			jsonObj =   ftpFileOperations.getFtpFileTransfer(inputJson);
		}
		else if (mode.equalsIgnoreCase("SFTP"))
		{
			jsonObj =   sftpFileOperations.getSFTPFileTransfer(inputJson);
		}
		
		JSONObject jo = new JSONObject();
		jo.put("result", jsonObj);
		return jo;
	}
	
	@ThingworxServiceDefinition(name = "getListOfFiles", description = "", category = "", isAllowOverride = false, aspects = {
	"isAsync:false" })
@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
public JSONObject getListOfFiles(
	@ThingworxServiceParameter(name = "inputJson", description = "", baseType = "JSON", aspects = {
			"isRequired:true" }) JSONObject inputJson) throws ParseException,JSONException,SftpException, JSchException, IOException {
_logger.info("Entering Service: getListOfFiles");
_logger.error("Exiting Service: getListOfFiles");
JSONObject hostJson = (JSONObject) inputJson.get("hostProperties");
String mode = (String) hostJson.get("selectMode");

org.json.simple.JSONObject jsonObj = new org.json.simple.JSONObject();
if(mode.equalsIgnoreCase("FTP"))
{
	jsonObj =   ftpFileOperations.getFtpFileTransfer(inputJson);
}
else if (mode.equalsIgnoreCase("SFTP"))
{
	jsonObj =   sftpFileOperations.getSFTPFileTransfer(inputJson);
}
//org.json.simple.JSONObject jsonObj =   ftpFileOperations.getFtpFileTransfer(inputJson);
JSONObject jo = new JSONObject();
jo.put("result", jsonObj);
return jo;
}
	
	@ThingworxServiceDefinition(name = "readDataFromFile", description = "", category = "", isAllowOverride = false, aspects = {
	"isAsync:false" })
@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
public JSONObject readDataFromFile(
	@ThingworxServiceParameter(name = "inputJson", description = "", baseType = "JSON", aspects = {
			"isRequired:true" }) JSONObject inputJson) throws ParseException,JSONException,SftpException, JSchException, IOException {
_logger.info("Entering Service: readDataFromFile");

org.json.simple.JSONObject jsonObj = new org.json.simple.JSONObject();

JSONObject hostJson = (JSONObject) inputJson.get("hostProperties");
String mode = (String) hostJson.get("selectMode");
if(mode.equalsIgnoreCase("FTP"))
{
	jsonObj =   ftpFileOperations.getFtpFileTransfer(inputJson);
}
else if (mode.equalsIgnoreCase("SFTP"))
{	
	jsonObj =   sftpFileOperations.getSFTPFileTransfer(inputJson);
	
}
//org.json.simple.JSONObject jsonObj =   ftpFileOperations.getFtpFileTransfer(inputJson);
_logger.info("readDataFromFile 102..."+jsonObj);
JSONObject jo = new JSONObject();
jo.put("result", jsonObj);
return jo;
}
	
	@ThingworxServiceDefinition(name = "getFileSortedList", description = "", category = "", isAllowOverride = false, aspects = {
	"isAsync:false" })
@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
public JSONObject getFileSortedList(
	@ThingworxServiceParameter(name = "inputJson", description = "", baseType = "JSON", aspects = {
			"isRequired:true" }) JSONObject inputJson) throws ParseException,JSONException,SftpException, JSchException, IOException {
_logger.info("Entering Service: getFileSortedList");


JSONObject hostJson = (JSONObject) inputJson.get("hostProperties");
String mode = (String) hostJson.get("selectMode");
org.json.simple.JSONObject jsonObj = new org.json.simple.JSONObject();
if(mode.equalsIgnoreCase("FTP"))
{
	jsonObj =   ftpFileOperations.getFtpFileTransfer(inputJson);
}
else if (mode.equalsIgnoreCase("SFTP"))
{
	jsonObj =   sftpFileOperations.getSFTPFileTransfer(inputJson);
}
//org.json.simple.JSONObject jsonObj =   ftpFileOperations.getFtpFileTransfer(inputJson);
JSONObject jo = new JSONObject();
jo.put("result", jsonObj);
return jo;
}
	
	@ThingworxServiceDefinition(name = "WriteDataToFile", description = "", category = "", isAllowOverride = false, aspects = {
	"isAsync:false" })
@ThingworxServiceResult(name = "Result", description = "", baseType = "JSON", aspects = {})
public JSONObject WriteDataToFile(
	@ThingworxServiceParameter(name = "inputJson", description = "", baseType = "JSON", aspects = {
			"isRequired:true" }) JSONObject inputJson) throws ParseException,JSONException,SftpException, JSchException, IOException {
		JSONObject hostJson = (JSONObject) inputJson.get("hostProperties");
		String mode = (String) hostJson.get("selectMode");
		org.json.simple.JSONObject jsonObj = new org.json.simple.JSONObject();
		if(mode.equalsIgnoreCase("FTP"))
		{
			jsonObj =   ftpFileOperations.getFtpFileTransfer(inputJson);
		}
		else if (mode.equalsIgnoreCase("SFTP"))
		{
			jsonObj =   sftpFileOperations.getSFTPFileTransfer(inputJson);
		}
		//org.json.simple.JSONObject jsonObj =  ftpFileOperations.getFtpFileTransfer(inputJson);
		_logger.warn("at line 86 in shape... "+jsonObj);
		JSONObject jo = new JSONObject();
		jo.put("result", jsonObj);
		jo.put("status", "success");
		_logger.warn("at line 90 in shape... "+jo);
		return jo;
}

}
