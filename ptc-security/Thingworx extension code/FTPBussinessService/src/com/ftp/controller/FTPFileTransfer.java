package com.ftp.controller;

import java.io.ByteArrayInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.FileAlreadyExistsException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;

import com.thingworx.logging.LogUtilities;


public class FTPFileTransfer {
	
	//private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(FTPFileTransfer.class);
	
	/*
	 * This method is going to call respective methods based on the input action.
	 * @Params JSONObject jsonObject
	 * @return JSONObject
	 */
	public org.json.simple.JSONObject getFtpFileTransfer(JSONObject jsonObject) throws JSONException{
		
		String action = (String) jsonObject.get("action");
		String status = "";
		JSONObject hostJson = (JSONObject) jsonObject.get("hostProperties");
		JSONObject ftpFileJson = (JSONObject) jsonObject.get("ftpFileInfo");
		org.json.simple.JSONObject responseJson = new org.json.simple.JSONObject();
		if("connect".equalsIgnoreCase(action)){
			
			FTPClient fc = isFtpClientConnected(hostJson);
			if(fc.isConnected()){
				System.out.println("connected");
				responseJson.put("FtpConnection", "success");
				//status = "success";
			}else{
				System.out.println("failure");
				responseJson.put("FtpConnection", "failure");
				//status = "failure";
			}
		} else if("writeDataToFile".equalsIgnoreCase(action)){
			//_logger.warn("inside  writeDataToFile...." + action);
			try{
				org.json.simple.JSONObject simpleJsonResponse = createNewFile(hostJson,ftpFileJson);
				Object object = simpleJsonResponse;
				//String outputFileName = ftpFileJson.getString("fileName")+"."+ftpFileJson.getString("fileType");
				JSONObject temp = appendDataToFile(hostJson,ftpFileJson,simpleJsonResponse.get("outputFileName").toString());
				responseJson.put("createFile", object);
				responseJson.put("appendData", temp.getString("appendData"));
			}catch(IOException ioe){
				//ioe.printStackTrace();
			}
		}else if("createDirectory".equalsIgnoreCase(action)){
			try{
				org.json.simple.JSONObject jo = createDirs(hostJson,ftpFileJson);
				responseJson.put("createDir", jo);
				responseJson.put("CreateDirectory", jo.get("createDir").toString());
			}catch(IOException ioe){
				ioe.printStackTrace();
			}
		} else if("filesList".equalsIgnoreCase(action)){
			try{
				List<String> filesList = listAllFiles(hostJson,ftpFileJson);
				responseJson.put("filesList",filesList);
			}catch(IOException ioe){
				ioe.printStackTrace();
			}
		}else if("newFileCreation".equalsIgnoreCase(action)){
			try{
				createNewFile(hostJson,ftpFileJson);
				//responseJson.put("filesList",filesList);
			}catch(IOException ioe){
				ioe.printStackTrace();
			}
		} else if("appendData".equalsIgnoreCase(action)){
			try{
				String outputFileName = ftpFileJson.getString("fileName")+"."+ftpFileJson.getString("fileType");
				appendDataToFile(hostJson,ftpFileJson,outputFileName);
			}catch(IOException e){
				e.printStackTrace();
			}
		}else if("deleteFiles".equalsIgnoreCase(action)){
			try{
				String response = deleteFileFromFtp(hostJson,ftpFileJson);
				responseJson.put("filesDelete", response);
			}catch(IOException e){
				e.printStackTrace();
			}
		}
		//_logger.warn("at line 107 in ftp file... "+responseJson);
		return responseJson;
	}
	
	/*
	 * This method is going to provide the list of files existing in the given directory.
	 * @Params JSONObject hostJson
	 * @Params JSONObject ftpFileJson
	 * @Exception IOException
	 * @return List<String>
	 */	
	public List<String> listAllFiles(JSONObject hostJson, JSONObject ftpFileJson) throws IOException, JSONException {
		List<String> filesList = new ArrayList<String>();
		FTPClient ftpClient = isFtpClientConnected(hostJson);
		String dirPath = ftpFileJson.getString("filePath");
    	String[] pathElements = dirPath.split("/");
    	if (pathElements != null && pathElements.length > 0) {
    		 for (String singleDir : pathElements) {
                 boolean existed = ftpClient.changeWorkingDirectory(singleDir);
                 if(!existed){
                	 return filesList;
                 }
    		 }
    	}
		FTPFile[] fileNames = ftpClient.listFiles();
		for (FTPFile file : fileNames) {
			if (!file.isDirectory()) {
				filesList.add(file.getName().toString());
			}
		}
		return filesList;
	}
	

	/*
	 * This method is going to establish connection with the FTP server.
	 * @Params JSONObject hostJson
	 * @return FTPClient
	 */
	public FTPClient isFtpClientConnected(JSONObject hostJson) throws JSONException{
		System.out.println("inside  isFtpClientConnected....hostJson...."+hostJson);
		String server = (String) hostJson.get("hostName");
		String portStr = (String)hostJson.get("port");
		int port = Integer.parseInt(portStr);
		String userName = (String) hostJson.get("userName");
		String password = (String) hostJson.get("password");

		FTPClient ftpClient = new FTPClient();
		try {
			ftpClient.connect(server, port);
			ftpClient.login(userName, password);
			ftpClient.enterLocalPassiveMode();
		} catch (IOException ioe) {
			System.out.println("Error: " + ioe.getMessage());
			ioe.printStackTrace();
		}
		//_logger.warn("inside  isFtpClientConnected..isConnected.."+ftpClient.isAvailable()+" is avaialble"+ftpClient.isConnected());
		return ftpClient;
	}

	/*
	 * This method is going to create directories if not existed existed
	 * @Params JSONObject hostJson
	 * @Params JSONObject ftpFileJson
	 * @Exception IOException
	 * @return boolean
	 */
    public org.json.simple.JSONObject createDirs(JSONObject hostJson,JSONObject ftpFileJson) throws IOException, JSONException{
    	//_logger.warn("inside  createDirs...ftpFileJson..."+ftpFileJson);
    	org.json.simple.JSONObject jo = new org.json.simple.JSONObject();
    	FTPClient ftpClient = new FTPClient();
    	String server = (String) hostJson.get("hostName");
		String portStr = (String)hostJson.get("port");
		int port = Integer.parseInt(portStr);
		String userName = (String) hostJson.get("userName");
		String password = (String) hostJson.get("password");
		try {
			ftpClient.connect(server, port);
			ftpClient.login(userName, password);
			ftpClient.enterLocalPassiveMode();
		} catch (IOException ioe) {
		//	_logger.warn("Error: " + ioe.getMessage());
			ioe.printStackTrace();
		}
		JSONObject jo1 = new JSONObject();
    	if(ftpClient.isConnected()){
    	//	_logger.warn("inside  createDirs  Connected....");
    		jo.put("FtpConnection", "Ftp Server connection successfully.");
    		jo1.put("FtpConnection", "Ftp Server connection successfully.");
			//status = "success";
		}else{
			//_logger.warn("inside  createDirs  notConnected....");
			jo.put("FtpConnection", "Ftp server connection failed.");
			jo1.put("FtpConnection", "Ftp server connection failed.");
			//status = "failure";
		}
    	jo.put("ftpClient", ftpClient);
    	jo1.put("ftpClient", ftpClient);
    	String dirPath = ftpFileJson.getString("filePath");
    	String[] pathElements = dirPath.split("/");
    	if (pathElements != null && pathElements.length > 0) {
    		 for (String singleDir : pathElements) {
                 boolean existed = ftpClient.changeWorkingDirectory(singleDir);
                 if (!existed) {
                	 boolean created = ftpClient.makeDirectory(singleDir);
                	 if (created) {
                	//	 _logger.warn("inside  createDirs dir created....");
                         ftpClient.changeWorkingDirectory(singleDir);
                     } else {
                    //	 _logger.warn("inside  createDirs dir not created....");
                         jo.put("createDir", "Directory Created Failure");
                         return jo;
                     }
                 }
    		 }
    	}
    	jo.put("createDir", "Directory created Successfully");
    	jo1.put("createDir", "Directory created Successfully");
    	//JSONObject jo1 = new JSONObject();
    	return jo;
    }

    /*
	 * This method is going to create new file inthe given path if not existed
	 * @Params JSONObject ftpFileJson
	 * @Params JSONObject hostJson
	 * @Exception IOException
	 * @return void
	 */
	public org.json.simple.JSONObject createNewFile(JSONObject hostJson,JSONObject ftpFileJson) throws IOException, JSONException{
		//_logger.warn("inside  createNewFile..ftpFileJson.." + ftpFileJson);
		org.json.simple.JSONObject dirJson = createDirs(hostJson,ftpFileJson);
		//_logger.warn("inside  createNewFile dirJson...."+dirJson);
		FTPClient ftpClient = (FTPClient)dirJson.get("ftpClient");
		//_logger.warn("inside  createNewFile..ftpClient connected.." + ftpClient.isConnected());
		try {
			ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
			String fileExt = getFileNameFormat(ftpFileJson.getString("fileMode"), ftpFileJson.getString("fileNameType"), ftpFileJson.getString("oid"));
			String outputFileName = ftpFileJson.getString("fileName")+"_"+fileExt+"."+ftpFileJson.getString("fileType");
			List<String> filesList = listAllFiles(hostJson, ftpFileJson);
			dirJson.put("outputFileName", outputFileName);
			if(filesList.size() == 0 ){
				//_logger.warn("inside  createNewFile..filesList size is 0.." );
				dirJson.put("filesList", "There are no files exists in this directory");
			}else {
				//_logger.warn("inside  createNewFile...filesList size > 0..." + filesList.size());
				dirJson.put("filesList", "There are "+filesList.size()+"  files exists in this directory");
			}
			if(filesList.contains(outputFileName)){
				//_logger.warn("inside  createNewFile..outputFileName.File Already Exists"+outputFileName );
				dirJson.put("fileCreation", "File Already Exists");
				
				throw new FileAlreadyExistsException(outputFileName);
			}else{
				//_logger.warn("inside  createNewFile..outputFileName.New File Created Successfully"+outputFileName );
				System.out.println("Start uploading " + outputFileName + " file");
				ftpClient.storeFileStream(outputFileName);
				dirJson.put("fileCreation", "New File Created Successfully");
			}
			
		} catch (IOException ex) {
			System.out.println("Error: " + ex.getMessage());
			dirJson.put("FileCreationException", ex.fillInStackTrace());
			
		} 
		
		finally {
			try {
				if (ftpClient.isConnected()) {
					ftpClient.logout();
					ftpClient.disconnect();
				}
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		return dirJson;
	}

	/*
	 * This method is going to append data at EOF
	 * @Params JSONObject hostJson
	 * @Params JSONObject ftpFileJson
	 * @Params String fileName
	 * @Exception IOException
	 * @return void
	 */
	public JSONObject appendDataToFile(JSONObject hostJson,JSONObject ftpFileJson, String fileName) throws IOException, JSONException{
		FTPClient ftpClient = isFtpClientConnected(hostJson); 
		ftpClient.changeWorkingDirectory(ftpFileJson.getString("filePath"));
		JSONObject fileData = (JSONObject)ftpFileJson.get("fileData");
		InputStream input = new ByteArrayInputStream(fileData.toString().getBytes());
		JSONObject responseJson = new JSONObject();
		try {
			ftpClient.appendFile(fileName, input);
			responseJson.put("appendData", "Data appended to file successfully");
		} catch (IOException e) {
			responseJson.put("appendData", "Data appended to file Failed.");
			e.printStackTrace();
		} finally {
			try {
				
			} catch (Exception ex) {

			}
		}
		return responseJson;
	}

	/*
	 * This method is going to append data at EOF
	 * @Params JSONObject hostJson
	 * @Params JSONObject ftpFileJson
	 * @Params String fileName
	 * @Exception IOException
	 * @return void
	 */
	public String deleteFileFromFtp(JSONObject hostJson,JSONObject ftpFileJson) throws IOException, JSONException{
		FTPClient ftpClient = isFtpClientConnected(hostJson); 
		//ftpClient.changeWorkingDirectory(ftpFileJson.getString("filePath"));
		List<String> filesList = listAllFiles(hostJson, ftpFileJson);
		String delPath = ftpFileJson.getString("filePath");
		if (filesList != null && filesList.size() > 0) {
			 for (String fileName : filesList) {
				 String delFile = delPath+fileName;
				 boolean deleted = ftpClient.deleteFile(delFile);
		            if (deleted) {
		            	return "success";
		            } else {
		            	return "failure";
		            }
			 }
		}
		return "no files";
	}
	
	public String getFileNameFormat(String selectedMode, String fileNameType, String oid){
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("MMddYYYY");
		if("Date".equalsIgnoreCase(fileNameType)){
			switch(selectedMode){
				case "MMddYYYY":	sdf = new SimpleDateFormat("MMddYYYY");
									break;
				case "MMddYYYYHHmmss": sdf = new SimpleDateFormat("MMddYYYYHHmmss");
									   break;
				case "MMdd":	sdf = new SimpleDateFormat("MMdd");
								break;
				case "ddMMYYYY":sdf = new SimpleDateFormat("ddMMYYYY");
								break;
				case "MMYYYY":  sdf = new SimpleDateFormat("MMYYYY");
								break;
				case "YYYYMMdd": sdf = new SimpleDateFormat("YYYYMMdd");
								 break;
			}
			System.out.println(sdf.format(date));
			return sdf.format(date);
		}else if("Oid".equalsIgnoreCase(fileNameType)){
			String id = "";
			switch(selectedMode){
				case "fullPath" : id = oid.replace(':', '_'); break;
				case "id"  :  id = oid.substring(oid.lastIndexOf(":"));
							 break;
			}
			return id;
		}
		return "";
	}
	
	/*public static void main(String[] args) {
		System.out.println("In listAllfiles(File) method");
		FTPFileTransfer a = new FTPFileTransfer();

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("action", "connect");
		
		JSONObject hostJson = new JSONObject();
		hostJson.put("hostName", "172.20.20.146");
		hostJson.put("port", "194");
		hostJson.put("userName", "FTPUser");
		hostJson.put("password", "ftp@2018");
		
		JSONObject jsonData = new JSONObject();
		jsonData.put("a", "aajjjja");
		jsonData.put("b", "bbb");
		jsonData.put("cww", "ccc");
		jsonData.put("d", "dddqqq");
		JSONObject ftpFileJson = new JSONObject();
		ftpFileJson.put("rootDirectory", "/");
		ftpFileJson.put("fileNameType", "Date");
		ftpFileJson.put("fileMode", "MMdd");
		ftpFileJson.put("fileName", "materialColor");
		ftpFileJson.put("fileType", "json");
		ftpFileJson.put("filePath", "/aaa/oooo/yyyy");
		ftpFileJson.put("fileData", jsonData);
		ftpFileJson.put("fileEncodingType", "base64");
		
		jsonObject.put("hostProperties", hostJson);
		jsonObject.put("ftpFileInfo", ftpFileJson);
		System.out.println(jsonObject);
		a.getFtpFileTransfer(jsonObject);
	}*/
	public static void main(String args[]) {
	      //Creating a JSONObject object
		 JSONObject jsonObject = new JSONObject();
		 
		 try {
	     
	      //Inserting key-value pairs into the json object
	      jsonObject.put("ID", "1");
	      jsonObject.put("First_Name", "Shikhar");
	      jsonObject.put("Last_Name", "Dhawan");
	      jsonObject.put("Date_Of_Birth", "1981-12-05");
	      jsonObject.put("Place_Of_Birth", "Delhi");
	      jsonObject.put("Country", "India");
	     
	         FileWriter file = new FileWriter("D:/output.json");
	         file.write(jsonObject.toString());
	         file.close();
	      } catch (IOException e) {
	         // TODO Auto-generated catch block
	    	  System.out.println("weee: "+jsonObject);
	         e.printStackTrace();
	      } catch (JSONException e) {
			// TODO Auto-generated catch block
	    	  System.out.println("weeJSON file created: "+jsonObject);
			e.printStackTrace();
		}
	      System.out.println("JSON file created: "+jsonObject);
	   }
	public static void main2(String[] args) throws Exception {
		System.out.println("In listAllfiles(File) method");
		FTPFileTransfer a = new FTPFileTransfer();

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("action", "connect");
		
		JSONObject hostJson = new JSONObject();
		JSONObject employeeDetails2 = new JSONObject();
		hostJson.put("hostName", "20.52.220.157");
		System.out.println("inside  isFtpClientConnected....hostJson...."+employeeDetails2);
		hostJson.put("port", "21");
		hostJson.put("userName", "user");
		hostJson.put("password", "3GuM47gYQFHDv623");
		hostJson.put("selectMode","FTP");
		hostJson.put("rootDirectory","/home");
		hostJson.put("userName","user");
		
		//FTPFileOperations ft = new FTPFileOperations();
		System.out.println("inside  isFtpClientConnected....hostJson...."+hostJson);
		FTPClient ftpClient = a.isFtpClientConnected(hostJson);
		// InputStream in = ftpClient.retrieveFileStream("/user/WriteAccess/");
}
	
	public static void maolin(String[] args) {
	//	String s = "TestTargetOR:com.lcs.wc.supplier.LCSSupplier:6418588";
	//	String id = s.substring(s.lastIndexOf(":"));
	//	System.out.println(id);
		System.out.println("llllllllllll");
		String filePath= "upload/";
		String[] pathElements = filePath.split("/");
		if (pathElements != null && pathElements.length > 0) {
   		 for (String singleDir : pathElements) {
   			System.out.println("singleDir "+singleDir);
   		 }
   		 
   		 }
		
		System.out.println(pathElements);
	}
}