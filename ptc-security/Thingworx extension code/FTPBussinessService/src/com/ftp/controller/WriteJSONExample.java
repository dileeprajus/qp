package com.ftp.controller;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;

import org.apache.commons.net.ftp.FTPClient;
import org.json.JSONException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.file.FileAlreadyExistsException;
import java.util.List;

import org.apache.commons.net.ftp.FTP;
 
public class WriteJSONExample
{
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
    @SuppressWarnings("unchecked")
    public static void main2(String[] args) throws Exception {
		System.out.println("In listAllfiles(File) method");
		FTPFileTransfer a = new FTPFileTransfer();

		JSONObject jsonObject = new JSONObject();
		jsonObject.put("action", "connect");
		
		JSONObject hostJson = new JSONObject();
		JSONObject employeeDetails2 = new JSONObject();
		/*hostJson.put("hostName", "20.52.220.157");
		System.out.println("inside  isFtpClientConnected....hostJson...."+employeeDetails2);
		hostJson.put("port", "21");
		hostJson.put("userName", "user");
		hostJson.put("password", "3GuM47gYQFHDv623");
		hostJson.put("selectMode","FTP");
		hostJson.put("rootDirectory","/home");
		hostJson.put("userName","user");*/
		
		/*hostJson.put("hostName", "demo.wftpserver.com");
		System.out.println("inside  isFtpClientConnected....hostJson...."+employeeDetails2);
		hostJson.put("port", "21");
		hostJson.put("userName", "demo");
		hostJson.put("password", "demo");
		hostJson.put("selectMode","FTP");
		hostJson.put("rootDirectory","/home");
		hostJson.put("userName","user");*/
		
		hostJson.put("hostName", "ftp.dlptest.com");
		System.out.println("inside  isFtpClientConnected....hostJson...."+employeeDetails2);
		hostJson.put("port", "21");
		hostJson.put("userName", "dlpuser");
		hostJson.put("password", "rNrKYTX9g7z3RgJRmxWuGHbeu");
		hostJson.put("selectMode","FTP");
		hostJson.put("rootDirectory","/home");
		hostJson.put("userName","user");
		
		WriteJSONExample ft = new WriteJSONExample();
		System.out.println("inside  isFtpClientConnected....hostJson...."+hostJson);
		FTPClient ftpClient = ft.isFtpClientConnected(hostJson);
		System.out.println("inside  isFtpClientConnected....ftpClient...."+ftpClient);
		InputStream in = ftpClient.retrieveFileStream("/SampleJson.json");
		 //InputStream in = ftpClient.retrieveFileStream("/upload/sample2.json");
		// InputStream in = ftpClient.retrieveFileStream("/home/user/WriteAccess/sample2.Json");
		 System.out.println("inside  in...."+in);
		// InputStream in = ftpClient.retrieveFileStream(ftpFileJson.getString("filePath"));
	      BufferedReader reader = null;
		String fileContent = "";
		reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
		System.out.println("inside  reader...."+reader);
		String firstLine;
		while ((firstLine = reader.readLine()) != null) {
			System.out.println("File content firstLine : " + firstLine);
			String fileType = "JSON";
			if (fileType.equalsIgnoreCase("CSV")) {
				fileContent = fileContent + firstLine + "\n";
			} else {
				fileContent = fileContent + firstLine;
			}
			System.out.println("File content fileContent:: : " + fileContent);
		}
		System.out.println("File::: " + fileContent);
		in.close();

		System.out.println( fileContent);
	   }
    
    
/*	public org.json.simple.JSONObject createNewFile(JSONObject hostJson,JSONObject ftpFileJson) throws IOException, JSONException{
		org.json.simple.JSONObject dirJson = createDirs(hostJson,ftpFileJson);
		FTPClient ftpClient = (FTPClient)dirJson.get("ftpClient");
		_logger.warn("inside  createNewFile..ftpClient connected.." + ftpClient.isConnected());
		try {
			ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
			String filePath = ftpFileJson.getString("filePath");
			String outputFileName = filePath.substring(filePath.lastIndexOf("/")+1);//ftpFileJson.getString("fileName")+"_"+fileExt+"."+ftpFileJson.getString("fileType");
			List<String> filesList = listAllFiles(hostJson, ftpFileJson,false);
			dirJson.put("outputFileName", outputFileName);
			if(filesList.size() == 0 ){
				dirJson.put("filesList", "There are no files exists in this directory");
			}else {
				dirJson.put("filesList", "There are "+filesList.size()+"  files exists in this directory");
			}
			if(filesList.contains(outputFileName)){
				dirJson.put("fileCreation", "File Already Exists");
				
				throw new FileAlreadyExistsException(outputFileName);
			}else{
				ftpClient.storeFileStream(outputFileName);
				dirJson.put("fileCreation", "New File Created Successfully");
			}
		} catch (IOException ex) {
			_logger.error("Error: " + ex.getMessage());
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
	}*/
	
	 public static void main(String[] args) {
	        String server = "ftp.dlptest.com";
	        int port = 21;
	        String user = "dlpuser";
	        String pass = "rNrKYTX9g7z3RgJRmxWuGHbeu";
	 
	        FTPClient ftpClient = new FTPClient();
	        try {
	 
	            ftpClient.connect(server, port);
	            ftpClient.login(user, pass);
	            ftpClient.enterLocalPassiveMode();
	            ftpClient.setFileType(FTP.BINARY_FILE_TYPE);
	 
	            // APPROACH #1: using retrieveFile(String, OutputStream)
	            String remoteFile1 = "/2021/SampleJson.json";
	            File downloadFile1 = new File("D:/SampleJson3.json");
	            OutputStream outputStream1 = new BufferedOutputStream(new FileOutputStream(downloadFile1));
	            boolean success = ftpClient.retrieveFile(remoteFile1, outputStream1);
	            outputStream1.close();
	 
	            if (success) {
	                System.out.println("File #1 has been downloaded successfully.");
	            }
	 
	            // APPROACH #2: using InputStream retrieveFileStream(String)
	            String remoteFile2 = "/SampleJson.json";
	            File downloadFile2 = new File("D:/SampleJson.json");
	            OutputStream outputStream2 = new BufferedOutputStream(new FileOutputStream(downloadFile2));
	            InputStream inputStream = ftpClient.retrieveFileStream(remoteFile2);
	            byte[] bytesArray = new byte[4096];
	            int bytesRead = -1;
	            while ((bytesRead = inputStream.read(bytesArray)) != -1) {
	                outputStream2.write(bytesArray, 0, bytesRead);
	            }
	 
	            success = ftpClient.completePendingCommand();
	            if (success) {
	                System.out.println("File #2 has been downloaded successfully.");
	            }
	            outputStream2.close();
	            inputStream.close();
	 
	        } catch (IOException ex) {
	            System.out.println("Error: " + ex.getMessage());
	            ex.printStackTrace();
	        } finally {
	            try {
	                if (ftpClient.isConnected()) {
	                    ftpClient.logout();
	                    ftpClient.disconnect();
	                }
	            } catch (IOException ex) {
	                ex.printStackTrace();
	            }
	        }
	    }
	}