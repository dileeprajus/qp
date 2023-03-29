package com.ftp.controller;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.FileAlreadyExistsException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;

import com.thingworx.logging.LogUtilities;


public class FTPFileOperations {
	
	private static Logger _logger = LogUtilities.getInstance().getApplicationLogger(FTPFileOperations.class);
	
	/*
	 * This method is going to call respective methods based on the input action.
	 * @Params JSONObject jsonObject
	 * @return JSONObject
	 */
	public org.json.simple.JSONObject getFtpFileTransfer(JSONObject jsonObject) throws ParseException,JSONException{
		
		String action = (String) jsonObject.get("action");
		String status = "";
		JSONObject hostJson = (JSONObject) jsonObject.get("hostProperties");
		JSONObject ftpFileJson = (JSONObject) jsonObject.get("ftpFileInfo");
		org.json.simple.JSONObject responseJson = new org.json.simple.JSONObject();
		
		if("connect".equalsIgnoreCase(action)){
			FTPClient fc = isFtpClientConnected(hostJson);
			if(fc.getReplyCode() == 230){
				responseJson.put("FtpConnection", "success");
			}else{
				responseJson.put("FtpConnection", "failure");
			}
		} else if("writeDataToFile".equalsIgnoreCase(action)){
			_logger.warn("inside  writeDataToFile...." );
			try{
				org.json.simple.JSONObject simpleJsonResponse = createNewFile(hostJson,ftpFileJson);
				Object object = simpleJsonResponse;
				//String outputFileName = ftpFileJson.getString("fileName")+"."+ftpFileJson.getString("fileType");
				JSONObject temp = appendDataToFile(hostJson,ftpFileJson,simpleJsonResponse.get("outputFileName").toString());
				responseJson.put("createFile", object);
				responseJson.put("appendData", temp.getString("appendData"));
			}catch(IOException ioe){
				_logger.error(ioe.getMessage());
			}
		}else if("readFileContent".equalsIgnoreCase(action)){
			try{
				String fileContent = readFileContent(hostJson,ftpFileJson);
				
				responseJson.put("filesList",fileContent);
			}catch(IOException ioe){
				ioe.printStackTrace();
			}
		}else if("fileSortedList".equalsIgnoreCase(action)){
			try{
				List<String> filesList = getSortedFileList(hostJson,ftpFileJson);
				
				responseJson.put("filesList",filesList);
			}catch(IOException ioe){
				ioe.printStackTrace();
			}
		}
		return responseJson;
	}
	
	public boolean fileDateComparision(String dateStart, String dateEnd, String fileDate) {
		if(dateStart == null  && dateEnd == null){
			return false;
		} else {
			if((dateStart != null) && (dateEnd == null)){
				if(dateStart.compareTo(fileDate) < 0 ) {
					return true;
				}else {
					return false;
				}
			} else if((dateStart == null) && (dateEnd != null)){
				if(dateEnd.compareTo(fileDate) >= 0 ) {
					return true;
				}else {
					return false;
				}
			} else if((dateStart != null) && (dateEnd != null)){
				if((dateStart.compareTo(fileDate) < 0 )  && (dateEnd.compareTo(fileDate) >= 0)){
					_logger.warn("compareTo true ....");
					return true;
				}else {
					return false;
				}
			}
			return false;
		}
	}

	public boolean fileSizeComparision(String minSize, String maxSize, String fileSize){
		long minS = 0;
		long maxS = 0;
		if(minSize != null){
			minS = Long.parseLong(minSize);
		}else{
			minS = 0;
		}
		
		if(maxSize != null){
			maxS = Long.parseLong(maxSize);
		}else{
			maxS = 0;
		}
		long fileS = Long.parseLong(fileSize);
		
		if(minS == 0  && maxS == 0){
			return false;
		}else { 
			if(minS != 0  && maxS != 0){
				if((fileS >= minS) && (fileS <= maxS)){
					return true;
				}else{
					return false;
				}
			}else if(minS == 0 && maxS > 0 ){
				if(fileS <= maxS){
					return true;
				}else{
					return false;
				}
			}else if(minS > 0 && maxS == 0 ){
				if(fileS >= minS) {
					return true;
				}else{
					return false;
				}
			}
			return false;
		}
	}

	private String getTargetDateFormat(String sourceDate) throws ParseException{
		_logger.warn("getTargetDateFormat ....");
		DateFormat targetFormat = new SimpleDateFormat("yyyy/MM/dd");
		DateFormat originalFormat = new SimpleDateFormat("yyyy-MM-dd");
		String formattedDate = targetFormat.format(originalFormat.parse(sourceDate));
		_logger.warn("formattedDate ...."+formattedDate);
		return formattedDate;
	}

	public List<String> getSortedFileList(JSONObject hostJson, JSONObject ftpFileJson) throws IOException,ParseException,JSONException{
		List<String> filesList = listAllFiles(hostJson,ftpFileJson,true);
		String dateStart = null; 
		String dateEnd = null;
		String minSize =  null;
		String maxSize = null;
		
		if(ftpFileJson.has("fromDate")){
			dateStart = ftpFileJson.getString("fromDate");
		}
		if(ftpFileJson.has("toDate")){
			dateEnd = ftpFileJson.getString("toDate");
		}
		if(ftpFileJson.has("minSize")){
			minSize = ftpFileJson.getString("minSize");
		}
		if(ftpFileJson.has("maxSize")){
			maxSize = ftpFileJson.getString("maxSize");
		}
		
		_logger.warn("dates and sizes..."+dateStart+"  "+dateEnd+"  "+minSize+"  "+maxSize);
		
	    List<String> filteredFileList = new ArrayList<String>();
	    _logger.warn("files List...."+filesList);
	    for(String fileInfo : filesList){
	    	String[] fileInfoSplit = fileInfo.split("---");
	    	String fileEndsWith = "."+ftpFileJson.getString("type");
	    	_logger.warn("fileEndsWith ...."+fileEndsWith);
	    	if(fileInfoSplit[0].endsWith(fileEndsWith)){
	    		if(dateStart ==null && dateEnd==null){
					if(minSize ==null && maxSize==null){
		   				filteredFileList.add(fileInfoSplit[0]);
		   			}else{
		   				boolean isFileSizeWithInRange = fileSizeComparision(minSize, maxSize, fileInfoSplit[2]);
			   			if(isFileSizeWithInRange){
			   				filteredFileList.add(fileInfoSplit[0]);
			   			}
		   			}
	   			} else{
	   				boolean isFileDateWithInRange = fileDateComparision(dateStart, dateEnd, getTargetDateFormat(fileInfoSplit[1]));
	   				_logger.warn("isFileDateWithInRange ...."+isFileDateWithInRange);
	   				if(isFileDateWithInRange){
		   		   		if(minSize ==null && maxSize==null){
	   						filteredFileList.add(fileInfoSplit[0]);
	   					}else{
	   						boolean isFileSizeWithInRange = fileSizeComparision(minSize, maxSize, fileInfoSplit[2]);
	   						_logger.warn("isFileSizeWithInRange ...."+isFileSizeWithInRange);
	   						if(isFileSizeWithInRange){
	   							filteredFileList.add(fileInfoSplit[0]);
	   						}
	   					}
	   		   		}
	   			}
	    	}
	    }
	    if(ftpFileJson.has("fileName")){
			return getListSortedByName(ftpFileJson.getString("fileName"),filteredFileList);
		}
		return filteredFileList;
	}

	private List<String> getListSortedByName(String inputFileName, List<String> originalList){
		List<String> finalResult = new ArrayList<String>();
		String	ext = inputFileName.substring(inputFileName.lastIndexOf("."));
		originalList.removeIf(n -> (!n.substring(n.lastIndexOf(".")).equalsIgnoreCase(ext)));
		String[] strArray = inputFileName.substring(0,inputFileName.lastIndexOf(".")).split("\\*");
		originalList.removeIf(n -> (!n.startsWith(strArray[0])));
		for(String indi : originalList){
			String fileName = indi.substring(0, indi.lastIndexOf("."));
			String searchFile = fileName.substring(strArray[0].length());
			String temp = strArray[0];
			for(int i=1;i<strArray.length;i++){
				if(searchFile.contains(strArray[i])){
					temp = temp+searchFile.substring(0, searchFile.indexOf(strArray[i])+strArray[i].length());
					searchFile = searchFile.substring(searchFile.indexOf(strArray[i])+strArray[i].length());
				}else{
					finalResult.add(indi);
				}
			}
		}
		originalList.removeAll(finalResult);
		return originalList;
	}
	
	/*
	 * This method is going to establish connection with the FTP server.
	 * @Params JSONObject hostJson
	 * @return FTPClient
	 */
	public FTPClient isFtpClientConnected(JSONObject hostJson) throws JSONException{
		_logger.warn("inside  isFtpClientConnected....hostJson....");
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
			_logger.error("Error: " + ioe.getMessage());
			ioe.printStackTrace();
		}
		_logger.warn("inside  isFtpClientConnected..isConnected.."+ftpClient.isAvailable()+" is avaialble"+ftpClient.isConnected());
		return ftpClient;
	}
	
	/*public void readFileContent1() throws IOException{
		FTPClient ftpClient = null;//getFTPClient();
		 InputStream in = ftpClient.retrieveFileStream("material3333.json");
		 
	        BufferedInputStream inbf = new BufferedInputStream(in);
	         
	        int bytesRead;
	        byte[] buffer=new byte[1024]; 
	        String fileContent=null;
	         
	        while((bytesRead=inbf.read(buffer))!=-1)
	           {
	               fileContent=new String(buffer,0,bytesRead); 
	           }
	            
	           System.out.println("File: " + fileContent);
	        
	}
*/
	/*
	 * This method is going to create directories if not existed existed
	 * @Params JSONObject hostJson
	 * @Params JSONObject ftpFileJson
	 * @Exception IOException
	 * @return boolean
	 */
    public org.json.simple.JSONObject createDirs(JSONObject hostJson,JSONObject ftpFileJson) throws IOException, JSONException{
    	_logger.warn("inside  createDirs...ftpFileJson...");
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
			_logger.warn("Error: " + ioe.getMessage());
			ioe.printStackTrace();
		}
    	if(ftpClient.getReplyCode() == 230){
    		_logger.warn("inside  createDirs  Connected....");
    		jo.put("FtpConnection", "Ftp Server connection successfully.");
		}else{
			_logger.warn("inside  createDirs  notConnected....");
			jo.put("FtpConnection", "Ftp server connection failed.");
		}
    	jo.put("ftpClient", ftpClient);
    	String filePath = ftpFileJson.getString("filePath");
    	
    	String dirPath = filePath.substring(0,filePath.lastIndexOf("/")); //ftpFileJson.getString("filePath");
    	String[] pathElements = dirPath.split("/");
    	if (pathElements != null && pathElements.length > 0) {
    		 for (String singleDir : pathElements) {
                 boolean existed = ftpClient.changeWorkingDirectory(singleDir);
                 if (!existed) {
                	 _logger.warn("singleDir..... "+singleDir);
                	 //_logger.warn("ftpClient..... "+ftpClient.isAvailable()+" connected.... "+ftpClient.isConnected());
                	 boolean created = ftpClient.makeDirectory(singleDir);
                	 if (created) {
                		 _logger.warn("inside  createDirs dir created....");
                         ftpClient.changeWorkingDirectory(singleDir);
                     } else {
                    	 _logger.warn("inside  createDirs dir not created....");
                         jo.put("createDir", "Directory Created Failure");
                         return jo;
                     }
                 }
    		 }
    	}
    	jo.put("createDir", "Directory created Successfully");
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
		org.json.simple.JSONObject dirJson = createDirs(hostJson,ftpFileJson);
		FTPClient ftpClient = (FTPClient)dirJson.get("ftpClient");
		_logger.warn("inside  createNewFile..ftpClient connected.." );
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
	}
	/*public String readFileContent(JSONObject hostJson,JSONObject ftpFileJson) throws IOException,JSONException{
		FTPClient ftpClient = isFtpClientConnected(hostJson);

		InputStream in = ftpClient.retrieveFileStream(ftpFileJson.getString("filePath"));

		       BufferedInputStream inbf = new BufferedInputStream(in);
		        
		       int bytesRead;
		      // List<Byte> list = new ArrayList<Byte>();
		       byte[] buffer=new byte[10000000]; 
		       String fileContent=null;
		        
		       while((bytesRead=inbf.read(buffer))!=-1)
		          {
		              fileContent=new String(buffer,0,bytesRead); 
		          }
		   //	_logger.warn("Error: " + fileContent);

		        //  System.out.println("File: " + fileContent);
		       return fileContent;
		}*/
	public String readFileContentold(org.json.JSONObject hostJson, org.json.JSONObject ftpFileJson) throws IOException, JSONException {
	      FTPClient ftpClient = this.isFtpClientConnected(hostJson);
	      InputStream in = ftpClient.retrieveFileStream(ftpFileJson.getString("filePath"));
	      BufferedReader reader = null;
	      String fileContent = "";

	      String firstLine;
	      for(reader = new BufferedReader(new InputStreamReader(in, "UTF-8")); (firstLine = reader.readLine()) != null; _logger.warn("File content fileContent : " + fileContent)) {
	         String fileType = ftpFileJson.getString("fileType");
	         if (fileType.equalsIgnoreCase("CSV")) {
	            fileContent = fileContent + firstLine + "\n";
	         } else {
	            fileContent = fileContent + firstLine;
	         }
	      }

	      return fileContent;
	   }
	
	public String readFileContent(org.json.JSONObject hostJson, org.json.JSONObject ftpFileJson) throws IOException, JSONException {
		 _logger.warn("Ftp readFileContent: : " );
		FTPClient ftpClient = this.isFtpClientConnected(hostJson);
	      _logger.warn("Ftp filePath: : " + ftpFileJson.getString("filePath"));
	      InputStream in = ftpClient.retrieveFileStream(ftpFileJson.getString("filePath"));
	      BufferedReader reader = null;
		String fileContent = "";
		reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
		String firstLine;
		while ((firstLine = reader.readLine()) != null) {
			System.out.println("File content firstLine : " + firstLine);
			String fileType = ftpFileJson.getString("fileType");
			if (fileType.equalsIgnoreCase("CSV")) {
				fileContent = fileContent + firstLine + "\n";
			} else {
				fileContent = fileContent + firstLine;
			}
		}
		 _logger.warn("File::: " + fileContent);
		in.close();

		return fileContent;
	   }
	
	/*public String readFileContent(JSONObject hostJson,JSONObject ftpFileJson) throws IOException,JSONException{
		FTPClient ftpClient = isFtpClientConnected(hostJson);
		_logger.warn("at line 305....: " + ftpClient.isConnected());
		_logger.warn("at line 407....: " + ftpFileJson.getString("filePath"));
		 InputStream in = ftpClient.retrieveFileStream(ftpFileJson.getString("filePath"));
		 _logger.warn("at line 409....: " + in.read());
		 //BufferedReader reader = null;
		 _logger.warn("at line 411....: ");
		 String fileContent="";
		 
	        BufferedInputStream inbf = new BufferedInputStream(in);
	         
	        int bytesRead;
	       // List<Byte> list = new ArrayList<Byte>();
	        byte[] buffer=new byte[10000000]; 
	        String fileContent=null;
	         
	        while((bytesRead=inbf.read(buffer))!=-1)
	           {
	               fileContent=new String(buffer,0,bytesRead); 
	           }
		 _logger.warn("InputStreamReader in  " + in.read());
		 BufferedReader reader = new BufferedReader(new InputStreamReader(in, "UTF-8"));
         String firstLine="";
         _logger.warn("firstLine::::::: " + firstLine);
         try
         {
         while ((firstLine = reader.readLine()) != null) {
        	 _logger.warn("File content firstLine : " + firstLine);
        	 String fileType = (String)ftpFileJson.getString("fileType");
        	 if(fileType.equalsIgnoreCase("CSV"))
        	 {
        		 fileContent = fileContent+firstLine+"\n";
        	 }
        	 else
        		 fileContent = fileContent+firstLine;
        	 _logger.warn("File content fileContent : " + fileContent);
         }
	    	_logger.warn("File: " + fileContent);
			
         }
         catch(Exception ex){
        	 _logger.warn("Exception: " + ex);
         }
	        return fileContent;
	}*/
	
	
	public List<String> listAllFiles(JSONObject hostJson, JSONObject ftpFileJson,boolean filter) throws IOException, JSONException {
		List<String> filesList = new ArrayList<String>();
		FTPClient ftpClient = isFtpClientConnected(hostJson);
		String filePath = ftpFileJson.getString("filePath");
		_logger.warn("filePath....: " + filePath);
	
		String dirPath = filePath.substring(0, filePath.lastIndexOf("/") + 1);
		_logger.warn("dirPath....: " + dirPath);
    	
                 boolean existed = ftpClient.changeWorkingDirectory(dirPath);
                 _logger.warn("dirPath.existed...: " + existed);
                 if(!existed){
                	 return filesList;
                 }
    	
    	FTPFile[] fileNames = ftpClient.listFiles();
		for (FTPFile file : fileNames) {
			if (!file.isDirectory()) {
				if(!filter){
					  _logger.warn("file.getName...: " + file.getName().toString());
					filesList.add(file.getName().toString());
				}else{
				 SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				 filesList.add(file.getName().toString()+"---"+sdf.format(file.getTimestamp().getTime()).toString()+"---"+file.getSize());
				}
			}
		}
		return filesList;
	}
	
	public List<String> listAllFilesold(JSONObject hostJson, JSONObject ftpFileJson,boolean filter) throws IOException, JSONException {
		List<String> filesList = new ArrayList<String>();
		FTPClient ftpClient = isFtpClientConnected(hostJson);
		String filePath = ftpFileJson.getString("filePath");
	//	String dirPath = filePath.substring(0,filePath.lastIndexOf("/")); 
		//filePath = filePath.substring(0, filePath.lastIndexOf("/") + 1);
    	String[] pathElements = filePath.split("/");
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
				if(!filter){
					filesList.add(file.getName().toString());
				}else{
				 SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				 filesList.add(file.getName().toString()+"---"+sdf.format(file.getTimestamp().getTime()).toString()+"---"+file.getSize());
				}
			}
		}
		return filesList;
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
		String filePath = ftpFileJson.getString("filePath");
		String dirPath = filePath.substring(0,filePath.lastIndexOf("/"));
		ftpClient.changeWorkingDirectory(dirPath); //ftpFileJson.getString("filePath"));
		String fileData = ftpFileJson.get("fileData").toString();		
		//JSONObject fileData = (JSONObject)ftpFileJson.get("fileData");
		InputStream input = new ByteArrayInputStream(fileData.toString().getBytes());
		JSONObject responseJson = new JSONObject();
		try {
			ftpClient.appendFile(fileName, input);
			responseJson.put("appendData", "Data appended to file successfully");
		} catch (IOException e) {
			responseJson.put("appendData", "Data appended to file Failed.");
			e.printStackTrace();
		} 
		return responseJson;
	}
}