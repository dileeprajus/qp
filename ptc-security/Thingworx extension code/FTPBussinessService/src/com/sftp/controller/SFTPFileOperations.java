package com.sftp.controller;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.FileAlreadyExistsException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;

import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.ChannelSftp.LsEntry;
import com.jcraft.jsch.ChannelSftp.LsEntrySelector;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpATTRS;
import com.jcraft.jsch.SftpException;
import com.thingworx.logging.LogUtilities;

public class SFTPFileOperations {
	private  Logger _logger = (Logger) LogUtilities.getInstance().getApplicationLogger(SFTPFileOperations.class);
	private  final int SESSION_TIMEOUT = 10000;
	private  final int CHANNEL_TIMEOUT = 5000;
	

	public org.json.simple.JSONObject getSFTPFileTransfer(JSONObject jsonObject) throws ParseException, JSONException, SftpException, JSchException, IOException {
		String action = (String) jsonObject.get("action");
		JSONObject hostJson = (JSONObject) jsonObject.get("hostProperties");
		JSONObject ftpFileJson = (JSONObject) jsonObject.get("ftpFileInfo");
		org.json.simple.JSONObject responseJson = new org.json.simple.JSONObject();
		
		/*if(jschSession!=null)
		_logger.error("init isSFtpClientConnected jschSession..."+jschSession.isConnected());
		if(ftpClient!=null)
		_logger.error("init isSFtpClientConnected ftpClient..."+ftpClient.isConnected());*/
		Channel ftpClient = null;
		try{
			ftpClient = isSFtpClientConnected(hostJson);
		}
		catch (JSchException ie) {
			_logger.error("isSFtpClientConnected expection "+ie.getMessage());
			throw new SftpException(SESSION_TIMEOUT, ie.getMessage(), null);
		}
		catch (JSONException iex) {
			_logger.error("isSFtpClientConnected expection "+iex.getMessage());
			throw new JSONException("Exception caused "+iex);
		}
		

		if ("connect".equalsIgnoreCase(action)) {
			if (ftpClient.isConnected()) {
				responseJson.put("SFTPConnection", "success");
			} else {
				responseJson.put("SFTPConnection", "failure");
			}
			
		} else if ("writeDataToFile".equalsIgnoreCase(action)) {
			
			
			try {
		
				String filePath = ftpFileJson.getString("filePath");
				String outputFileName = filePath.substring(filePath.lastIndexOf("/") + 1);
				JSONObject temp = appendDataToFile(hostJson, ftpFileJson,outputFileName,ftpClient);
				responseJson.put("fileCreation", "File Created Successfully "+outputFileName);
				responseJson.put("outputFileName", outputFileName);
				responseJson.put("appendData", temp.getString("appendData"));
			} catch (JSONException ioe) {
				_logger.error(ioe.getMessage());
				responseJson.put("JSONException", "Unable to write file");
				throw new JSONException( ioe.getMessage());
			}catch (JSchException ie) {
				_logger.error("isSFtpClientConnected expection "+ie.getMessage());
				throw new SftpException(SESSION_TIMEOUT, ie.getMessage(), null);
			}catch (SftpException exp) {
				_logger.error(exp.getMessage());
				responseJson.put("FileCreationException", "Unable to write file");
				throw new SftpException(SESSION_TIMEOUT, exp.getMessage(), null);
			}
			
		} else if ("readFileContent".equalsIgnoreCase(action)) {
			try {
				String fileContent = readFileContent(hostJson, ftpFileJson,ftpClient);
				responseJson.put("filesList", fileContent);
			} catch (IOException ioe) {
				//ioe.printStackTrace();
				_logger.error(ioe.getMessage());
				responseJson.put("IOException", "Unable to read file");
				throw new IOException( ioe.getMessage());
			}
		} else if ("fileSortedList".equalsIgnoreCase(action)) {
			try {
				List<String> filesList = getSortedFileList(hostJson, ftpFileJson,ftpClient);
				responseJson.put("filesList", filesList);
			} catch (IOException ioe) {
				//ioe.printStackTrace();
				_logger.error(ioe.getMessage());
				responseJson.put("IOException", "Unable to read file");
				throw new IOException( ioe.getMessage());
			}
		}
		
		/*if (channelSftp != null)
			channelSftp.disconnect();
		if (ftpClient != null)
			ftpClient.disconnect();
		if (jschSession != null) {
			jschSession.disconnect();
		}*/
		//System.out.println("at line  0  in ftp file... " + responseJson);
	
		return responseJson;
	}

	// no change
	public boolean fileDateComparision(String dateStart, String dateEnd, String fileDate) {
		if (dateStart == null && dateEnd == null) {
			return false;
		} else {
			if ((dateStart != null) && (dateEnd == null)) {
				if (dateStart.compareTo(fileDate) < 0) {
					return true;
				} else {
					return false;
				}
			} else if ((dateStart == null) && (dateEnd != null)) {
				if (dateEnd.compareTo(fileDate) >= 0) {
					return true;
				} else {
					return false;
				}
			} else if ((dateStart != null) && (dateEnd != null)) {
				if ((dateStart.compareTo(fileDate) < 0) && (dateEnd.compareTo(fileDate) >= 0)) {
					//System.out.println("101 true ....");
					return true;
				} else {
					return false;
				}
			}
			return false;
		}
	}

	// no change
	public boolean fileSizeComparision(String minSize, String maxSize, String fileSize) {
		long minS = 0;
		long maxS = 0;
		if (minSize != null) {
			minS = Long.parseLong(minSize);
		} else {
			minS = 0;
		}

		if (maxSize != null) {
			maxS = Long.parseLong(maxSize);
		} else {
			maxS = 0;
		}
		long fileS = Long.parseLong(fileSize);

		if (minS == 0 && maxS == 0) {
			return false;
		} else {
			if (minS != 0 && maxS != 0) {
				if ((fileS >= minS) && (fileS <= maxS)) {
					return true;
				} else {
					return false;
				}
			} else if (minS == 0 && maxS > 0) {
				if (fileS <= maxS) {
					return true;
				} else {
					return false;
				}
			} else if (minS > 0 && maxS == 0) {
				if (fileS >= minS) {
					return true;
				} else {
					return false;
				}
			}
			return false;
		}
	}

	private String getTargetDateFormat(String sourceDate) throws ParseException {
		DateFormat targetFormat = new SimpleDateFormat("yyyy/MM/dd");
		DateFormat originalFormat = new SimpleDateFormat("yyyy-MM-dd");
		String formattedDate = targetFormat.format(originalFormat.parse(sourceDate));
		return formattedDate;
	}

	public List<String> getSortedFileList(JSONObject hostJson, JSONObject ftpFileJson,Channel ftpClient)
			throws IOException, ParseException, JSONException, SftpException {
		List<String> filesList = listAllFiles(hostJson, ftpFileJson, true,ftpClient);
		String dateStart = null;
		String dateEnd = null;
		String minSize = null;
		String maxSize = null;

		if (ftpFileJson.has("fromDate")) {
			dateStart = ftpFileJson.getString("fromDate");
		}
		if (ftpFileJson.has("toDate")) {
			dateEnd = ftpFileJson.getString("toDate");
		}
		if (ftpFileJson.has("minSize")) {
			minSize = ftpFileJson.getString("minSize");
		}
		if (ftpFileJson.has("maxSize")) {
			maxSize = ftpFileJson.getString("maxSize");
		}
		List<String> filteredFileList = new ArrayList<String>();
		for (String fileInfo : filesList) {
			String[] fileInfoSplit = fileInfo.split("---");
			String fileEndsWith = "." + ftpFileJson.getString("type");
			if (fileInfoSplit[0].endsWith(fileEndsWith)) {
				if (dateStart == null && dateEnd == null) {
					if (minSize == null && maxSize == null) {
						filteredFileList.add(fileInfoSplit[0]);
					} else {
						boolean isFileSizeWithInRange = fileSizeComparision(minSize, maxSize, fileInfoSplit[2]);
						if (isFileSizeWithInRange) {
							filteredFileList.add(fileInfoSplit[0]);
						}
					}
				} else {
					boolean isFileDateWithInRange = fileDateComparision(dateStart, dateEnd,
							getTargetDateFormat(fileInfoSplit[1]));
					if (isFileDateWithInRange) {
						if (minSize == null && maxSize == null) {

							filteredFileList.add(fileInfoSplit[0]);
						} else {
							boolean isFileSizeWithInRange = fileSizeComparision(minSize, maxSize, fileInfoSplit[2]);
							if (isFileSizeWithInRange) {
								filteredFileList.add(fileInfoSplit[0]);
							}
						}
					}
				}
			}
		}
		if (ftpFileJson.has("fileName")) {
			return getListSortedByName(ftpFileJson.getString("fileName"), filteredFileList);
		}
		return filteredFileList;
	}

	private List<String> getListSortedByName(String inputFileName, List<String> originalList) {
		List<String> finalResult = new ArrayList<String>();
		String ext = inputFileName.substring(inputFileName.lastIndexOf("."));
		originalList.removeIf(n -> (!n.substring(n.lastIndexOf(".")).equalsIgnoreCase(ext)));
		String[] strArray = inputFileName.substring(0, inputFileName.lastIndexOf(".")).split("\\*");
		originalList.removeIf(n -> (!n.startsWith(strArray[0])));
		for (String indi : originalList) {
			String fileName = indi.substring(0, indi.lastIndexOf("."));
			String searchFile = fileName.substring(strArray[0].length());
			String temp = strArray[0];
			for (int i = 1; i < strArray.length; i++) {
				if (searchFile.contains(strArray[i])) {
					temp = temp + searchFile.substring(0, searchFile.indexOf(strArray[i]) + strArray[i].length());
					searchFile = searchFile.substring(searchFile.indexOf(strArray[i]) + strArray[i].length());
				} else {
					finalResult.add(indi);
				}
			}
		}
		originalList.removeAll(finalResult);
		return originalList;
	}

	/* Done */
	public Channel isSFtpClientConnected(JSONObject hostJson) throws JSchException,JSONException {
		String server = (String) hostJson.get("hostName");
		String portStr = (String) hostJson.get("port");
		int port = Integer.parseInt(portStr);
		String userName = (String) hostJson.get("userName");
		String password = (String) hostJson.get("password");
		  Channel ftpClient = null;
		//  ChannelSftp channelSftp = null;
		  Session jschSession = null;

		try {
			JSch jsch = new JSch();
			// jsch.setKnownHosts("known_hosts.txt");
			jschSession = jsch.getSession(userName, server, port);
			jschSession.setPassword(password);
			java.util.Properties config = new java.util.Properties();
		    config.put("StrictHostKeyChecking", "no");
		    jschSession.setConfig(config);
			//jschSession.setConfig("StrictHostKeyChecking", "no");
			jschSession.connect();
			ftpClient = jschSession.openChannel("sftp");
			
			ftpClient.connect();
		//	channelSftp = (ChannelSftp) ftpClient;
		} catch (JSchException e) {
			e.printStackTrace();
			_logger.error("SFTP JSchException = " + e.getMessage());
			throw new JSchException(" Error connecting to sftp.");
			
		}
		/*finally {
			_logger.error("SFTP finally = ");
		}*/
		return ftpClient;
	}

// done
	public JSONObject createDirs(JSONObject hostJson, JSONObject ftpFileJson,Channel ftpClient)
			throws IOException, JSONException, SftpException {
		JSONObject jo = new JSONObject();
		SftpATTRS attrs = null;
		ChannelSftp channelSftp = (ChannelSftp) ftpClient;
		
		if (ftpClient.isConnected()) {
			jo.put("SFTPConnection", "SFTP Server connection successfully.");
		} else {
			jo.put("SFTPConnection", "SFTP server connection failed.");
		}
		//"ftpClient":{"charset":"UTF-8","controlKeepAliveReplyTimeout":1000,"defaultTimeout":0,"available":false,"serverSocketFactory":"javax.net.DefaultServerSocketFactory@438605c","passivePort":-1,"defaultPort":21,"controlKeepAliveTimeout":0,"replyString":"","strictMultilineParsing":false,"restartOffset":0,"receiveDataSocketBufferSize":0,"connectTimeout":0,"dataConnectionMode":0,"controlEncoding":"ISO-8859-1","useEPSVwithIPv4":false,"replyCode":426,"replyStrings":[],"connected":false,"listHiddenFiles":false,"autodetectUTF8":false,"sendDataSocketBufferSize":0,"remoteVerificationEnabled":true,"bufferSize":0,"charsetName":"UTF-8"}
		jo.put("ftpClient", ftpClient);
		String filePath = ftpFileJson.getString("filePath");
		String dirPath = filePath.substring(0, filePath.lastIndexOf("/"));
		String[] pathElements = dirPath.split("/");
		if (pathElements != null && pathElements.length > 0) {
			for (String singleDir : pathElements) {
				try {
					attrs = channelSftp.stat(singleDir);
				} catch (Exception e) {
					// channelSftp.mkdir(singleDir);
				}
				try {
					attrs = channelSftp.stat(singleDir);
				} catch (Exception e) {
					jo.put("createDir", "Directory Created Failure");
					return jo;
				}
			}
		}

		jo.put("createDir", "Directory created Successfully");
		return jo;
	}

	public JSONObject createNewFile(JSONObject hostJson, JSONObject ftpFileJson,Channel locftpClient)
			throws IOException, JSONException, SftpException, ParseException {
		JSONObject dirJson = createDirs(hostJson, ftpFileJson,locftpClient);
		JSONObject respJson = new JSONObject();
		Channel ftpClient = (Channel) dirJson.get("ftpClient");
		ChannelSftp channelSftp = (ChannelSftp) ftpClient;
		try {
			String filePath = ftpFileJson.getString("filePath");
			String outputFileName = filePath.substring(filePath.lastIndexOf("/") + 1);
			List<String> filesList = listAllFiles(hostJson, ftpFileJson, false,ftpClient);
			respJson.put("outputFileName", outputFileName);
			if (filesList.size() == 0) {
				//System.out.println("inside  createNewFile..filesList size is 0..");
				respJson.put("filesList", "There are no files exists in this directory");
			} else {
				//System.out.println("inside  createNewFile...filesList size > 0..." + filesList.size());
				respJson.put("filesList", "There are " + filesList.size() + "  files exists in this directory");
			}
			if (filesList.contains(outputFileName)) {
				//System.out.println("inside  createNewFile..outputFileName.File Already Exists" + outputFileName);
				respJson.put("fileCreation", "File Already Exists");
				throw new FileAlreadyExistsException(outputFileName);
			} else {
				//System.out.println("inside  createNewFile..outputFileName.New File Created Successfully" + outputFileName);
				//_logger.warn("writing file sftp: " + outputFileName);
				//InputStream ins = new FileInputStream(outputFileName);
				//channelSftp.put(ins, outputFileName);
				//_logger.warn("after write: " + outputFileName);
				//String fileData = ftpFileJson.get("fileData").toString();
				//channelSftp.put(new ByteArrayInputStream(fileData.getBytes()), outputFileName);
				channelSftp.put(new ByteArrayInputStream("".getBytes()), outputFileName);
				
				respJson.put("fileCreation", "New File Created Successfully");
			}
		} catch (IOException ex) {
			_logger.error("Error message: " + ex.getMessage());
			respJson.put("FileCreationException", "Unable to write file");
		} finally {

		}
		return respJson;
	}
	
	public JSONObject createNewFileold(JSONObject hostJson, JSONObject ftpFileJson,Channel locftpClient)
			throws IOException, JSONException, SftpException, ParseException {
		JSONObject dirJson = createDirs(hostJson, ftpFileJson,locftpClient);
		JSONObject respJson = new JSONObject();
		Channel ftpClient = (Channel) dirJson.get("ftpClient");
		ChannelSftp channelSftp = (ChannelSftp) ftpClient;
		try {
			String filePath = ftpFileJson.getString("filePath");
			String outputFileName = filePath.substring(filePath.lastIndexOf("/") + 1);
			List<String> filesList = listAllFiles(hostJson, ftpFileJson, false,ftpClient);
			respJson.put("outputFileName", outputFileName);
			if (filesList.size() == 0) {
				//System.out.println("inside  createNewFile..filesList size is 0..");
				respJson.put("filesList", "There are no files exists in this directory");
			} else {
				//System.out.println("inside  createNewFile...filesList size > 0..." + filesList.size());
				respJson.put("filesList", "There are " + filesList.size() + "  files exists in this directory");
			}
			if (filesList.contains(outputFileName)) {
				//System.out.println("inside  createNewFile..outputFileName.File Already Exists" + outputFileName);
				respJson.put("fileCreation", "File Already Exists");
				throw new FileAlreadyExistsException(outputFileName);
			} else {
				//System.out.println("inside  createNewFile..outputFileName.New File Created Successfully" + outputFileName);
				//_logger.warn("writing file sftp: " + outputFileName);
				//InputStream ins = new FileInputStream(outputFileName);
				//channelSftp.put(ins, outputFileName);
				//_logger.warn("after write: " + outputFileName);
				//String fileData = ftpFileJson.get("fileData").toString();
				//channelSftp.put(new ByteArrayInputStream(fileData.getBytes()), outputFileName);
				channelSftp.put(new ByteArrayInputStream("".getBytes()), outputFileName);
				
				respJson.put("fileCreation", "New File Created Successfully");
			}
		} catch (IOException ex) {
			_logger.error("Error message: " + ex.getMessage());
			respJson.put("FileCreationException", "Unable to write file");
		} finally {

		}
		return respJson;
	}

	/* Done */
	public String readFileContent(JSONObject hostJson, JSONObject ftpFileJson,Channel ftpClient)
			throws IOException, JSONException, SftpException {
		ChannelSftp channelSftp = (ChannelSftp) ftpClient;
		InputStream in = channelSftp.get(ftpFileJson.getString("filePath"));

		BufferedReader reader = null;
		String fileContent = "";
		reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
		String firstLine;
		while ((firstLine = reader.readLine()) != null) {
			//System.out.println("File content firstLine : " + firstLine);
			String fileType = ftpFileJson.getString("fileType");
			if (fileType.equalsIgnoreCase("CSV")) {
				fileContent = fileContent + firstLine + "\n";
			} else {
				fileContent = fileContent + firstLine;
			}
			//System.out.println("File content fileContent : " + fileContent);
		}
		//System.out.println("File: " + fileContent);
		in.close();

		return fileContent;
	}

	/* Done */
	public List<String> listAllFiles(JSONObject hostJson, JSONObject ftpFileJson, boolean filter,Channel ftpClient)
			throws IOException, JSONException, SftpException, ParseException {
		String filePath = ftpFileJson.getString("filePath");
		//System.out.println("filePath-==" + filePath);
		filePath = filePath.substring(0, filePath.lastIndexOf("/") + 1);
		//System.out.println("filePath-==" + filePath);
		ChannelSftp channelSftp = (ChannelSftp) ftpClient;
		channelSftp.cd(filePath);
		Vector<LsEntry> filelist = new Vector<LsEntry>();
		LsEntrySelector selector = new LsEntrySelector() {
			public int select(LsEntry entry) {
				final String filename = entry.getFilename();
				// System.out.println(filename+entry.getAttrs().isLink()+entry.getAttrs().isDir());
				if (filename.equals(".") || filename.equals("..")) {
					return CONTINUE;
				}
				if (!entry.getAttrs().isLink() && !entry.getAttrs().isDir()) {
					filelist.addElement(entry);
				}
				return CONTINUE;
			}
		};

		channelSftp.ls(filePath, selector);
		List<String> filesList = new ArrayList<>();

		for (int i = 0; i < filelist.size(); i++) {
			final String filename = filelist.get(i).getFilename();
			String modificationTime = channelSftp.lstat(filename).getMtimeString();
			String outDate = new SimpleDateFormat("yyyy-MM-dd")
					.format(new SimpleDateFormat("EEE MMM dd hh:mm:ss zzz yyyy").parse(modificationTime));
			Long size = channelSftp.lstat(filename).getSize();

			if (!filter) {
				filesList.add(filename.toString());
			} else {
				filesList.add(filename + "---" + outDate + "---" + size);
			}
		}
		return filesList;
	}

	/* Done */

	public JSONObject appendDataToFile(JSONObject hostJson, JSONObject ftpFileJson, String fileName,Channel ftpClient)
			throws  JSONException, SftpException, JSchException {
		String filePath = ftpFileJson.getString("filePath");
		String dirPath = filePath.substring(0, filePath.lastIndexOf("/"));
		
		
		String fileData = ftpFileJson.get("fileData").toString();
		JSONObject responseJson = new JSONObject();
		boolean textTry = true;	
	    int count = 0;	
	    ChannelSftp channelSftp = (ChannelSftp) ftpClient;		
		channelSftp.cd(dirPath);
	  //Added loop as disney is facing issue of writing zero byte file with connection issue
	        while(textTry && count < 3){	
	            try{
	            	
	            	
	            	channelSftp.put(new ByteArrayInputStream(fileData.getBytes()), fileName, ChannelSftp.APPEND);	
	            	responseJson.put("appendData", "Data appended to file successfully");
	            	 textTry = false;
	        	}catch(SftpException e){	
	                count++;
	               
	                channelSftp = (ChannelSftp)isSFtpClientConnected(hostJson);
	        		
	                if(count == 3)	
	                {
	                	responseJson.put("appendData", "Data appended to file Failed after attempt .."+count);
	        			throw new SftpException(SESSION_TIMEOUT, e.getMessage(), null);
	                }
	                  
	        	}
	        }
	
		return responseJson;
	}

	public static void main(String args[])
			throws org.json.simple.parser.ParseException, JSONException, ParseException, SftpException, JSchException, IOException {

		// Connect
		// JSONObject abc = new JSONObject(
		// "{\"action\":\"connect\",\"hostProperties\":{\"hostName\":\"demo.wftpserver.com\",\"password\":\"demo\",\"port\":\"2222\",\"selectMode\":\"SFTP\",\"rootDirectory\":\"/\",\"userName\":\"demo\"},\"ftpFileInfo\":{}}");
		// JSONObject abc = new
		// JSONObject("{\"action\":\"connect\",\"hostProperties\":{\"hostName\":\"localhost\",\"password\":\"password\",\"port\":\"22\",\"selectMode\":\"SFTP\",\"rootDirectory\":\"/\",\"userName\":\"ftpuser\"},\"ftpFileInfo\":{}}");

		// read data
		// JSONObject abc = new
		// JSONObject("{\"action\":\"readFileContent\",\"ftpFileInfo\":{\"filePath\":\"/upload/Order.htm\",\"fileType\":\"CSV2\"},\"hostProperties\":{\"hostName\":\"demo.wftpserver.com\",\"password\":\"demo\",\"port\":\"2222\",\"selectMode\":\"SFTP\",\"rootDirectory\":\"/upload\",\"userName\":\"demo\"}}");
		// JSONObject abc = new
		// JSONObject("{\"action\":\"readFileContent\",\"ftpFileInfo\":{\"filePath\":\"/Users/ftpuser/Downloads/abc.xml\",\"fileType\":\"xml\"},\"hostProperties\":{\"hostName\":\"localhost\",\"password\":\"password\",\"port\":\"22\",\"selectMode\":\"SFTP\",\"rootDirectory\":\"/Users\",\"userName\":\"ftpuser\"}}");

		// read file list
		// JSONObject abc = new
		// JSONObject("{\"action\":\"fileSortedList\",\"ftpFileInfo\":{\"fromDate\":\"2020/10/10\",\"fileName\":\"UrdanetaCityDOAS(Logger)*.xb16_TMP\",\"filePath\":\"/upload/\",\"toDate\":\"2020/11/1\",\"maxSize\":\"1000000\",\"minSize\":\"0\",\"type\":\"xb16_TMP\"},\"hostProperties\":{\"hostName\":\"demo.wftpserver.com\",\"password\":\"demo\",\"port\":\"2222\",\"selectMode\":\"SFTP\",\"rootDirectory\":\"/upload\",\"userName\":\"demo\"}}");
		// JSONObject abc = new
		// JSONObject("{\"action\":\"fileSortedList\",\"ftpFileInfo\":{\"fromDate\":\"2020/10/10\",\"fileName\":\"ab*.xml\",\"filePath\":\"/Users/ftpuser/Downloads/\",\"toDate\":\"2020/11/1\",\"maxSize\":\"1000000\",\"minSize\":\"0\",\"type\":\"xml\"},\"hostProperties\":{\"hostName\":\"localhost\",\"password\":\"password\",\"port\":\"22\",\"selectMode\":\"SFTP\",\"rootDirectory\":\"/\",\"userName\":\"ftpuser\"}}");

		JSONObject abc = new JSONObject(
				"{\"action\":\"writeDataToFile\",\"ftpFileInfo\":{\"filePath\":\"/Users/ftpuser/Downloads/abecd.xml\",\"fileData\":\"<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\" standalone=\\\"no\\\"?><ROOT><note headers=\\\"\\\"><heading>Reminder</heading><from>Jani</from><to>Tove</to><body>Don't forget me this weekend!</body></note></ROOT>\",\"fileType\":\"json\"},\"hostProperties\":{\"hostName\":\"localhost\",\"password\":\"password\",\"port\":\"22\",\"selectMode\":\"SFTP\",\"rootDirectory\":\"/\",\"userName\":\"ftpuser\"}}");

		SFTPFileOperations abcd = new SFTPFileOperations();
		abcd.getSFTPFileTransfer(abc);
		// System.out.println(abc);

	}
}
