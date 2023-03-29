package cdee.web.upload;

import com.lcs.wc.util.LCSProperties;
import cdee.web.util.FileHelper;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import javax.ws.rs.core.Response.Status;
//import org.apache.log4j.Logger;
import wt.log4j.LogR;
import wt.util.WTException;
import cdee.web.exceptions.SizeNotValidException;
import com.lcs.wc.document.LCSDocument;
import com.lcs.wc.document.LCSDocumentClientModel;
import com.lcs.wc.flextype.FlexTypeAttribute;

import cdee.web.util.AppUtil;

import com.lcs.wc.util.FileLocation;
import com.lcs.wc.util.FormatHelper;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import com.lcs.wc.foundation.LCSQuery;
import com.ptc.rfa.rest.utility.PersistableUtility;
//import org.apache.log4j.Logger;
import wt.content.ApplicationData;
import wt.content.ContentHelper;
import wt.content.ContentService;
import wt.doc.WTDocument;
import wt.log4j.LogR;
import wt.util.WTException;
import wt.content.ApplicationData;
import wt.content.ContentServerHelper;
import wt.content.ContentServiceSvr;
import java.beans.PropertyVetoException;
import java.util.Base64;
import java.util.Collection;
import java.util.Vector;

public class DownLoadService {
	public static final long MAX_FILE_SIZE = (long) LCSProperties.get("com.lcs.wc.content.documentMaxFileSize",
			1.048576E8F);
	private static final Object[] UPLOAD = new Object[0];
	//private static final Logger LOGGER = LogR.getLogger(DownLoadService.class.getName());
	//private static final String CLASSNAME = DownLoadService.class.getName();

	public FileItem getDocument(String oid) throws Exception {
		if (oid.isEmpty()) {
			return null;
		}
		PersistableUtility persistableUtility = new PersistableUtility();
		LCSDocument document = (LCSDocument) persistableUtility.getPersistable(oid);
		if (document == null) {
			return null;
		}
		// DocumentContentBuilder documentContentBuilder = new DocumentContentBuilder();
		FileItem fileDownloadItem = getPrimary(document);

		return fileDownloadItem;
	}

//D:\ptc\Windchill_11.0\Windchill\codebase\images\000001\000001\000001
	public FileItem getPrimary(WTDocument doc) throws WTException, PropertyVetoException {
		InputStream inputStream = null;
		FileItem fileDownloadItem = null;
		if (doc != null) {
			ApplicationData primary = getPrimaryApplicationData(doc);
			inputStream = getStream(primary);
			if ((primary != null) && (inputStream != null)) {
				fileDownloadItem = new FileItem();
				fileDownloadItem.setFileName(primary.getFileName());
				fileDownloadItem.setInputStream(inputStream);
				//if (LOGGER.isDebugEnabled())
					//LOGGER.debug("getPrimary found file: " + primary.getFileName());
			}
		}
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug("Primary file not found, returning null)");
		return fileDownloadItem;
	}

	public InputStream getStream(ApplicationData appData) throws WTException {
		InputStream inputStream = null;
		try {
			if (appData != null) {
				inputStream = ContentServerHelper.service.findContentStream(appData);
			}
		} catch (Exception ex) {
		}

		return inputStream;
	}

	public ApplicationData getPrimaryApplicationData(WTDocument doc) throws WTException, PropertyVetoException {
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug("in getPrimaryApplicationData");
		doc = (WTDocument) ContentHelper.service.getContents(doc);
		ApplicationData primary = (ApplicationData) ContentHelper.getPrimary(doc);
		return primary;
	}

	public FileItem getAppDocument(String oid) throws WTException, PropertyVetoException {
		InputStream inputStream = null;
		FileItem fileDownloadItem = null;
		// LCSDocument lcsDocumentInput = (LCSDocument) LCSQuery.findObjectById(oid);
		ApplicationData primary = (ApplicationData) LCSQuery.findObjectById(oid);
		// ApplicationData primary = getPrimaryApplicationData(doc);
		try {
	
			inputStream = getStream(primary);
			if ((primary != null) && (inputStream != null)) {
				fileDownloadItem = new FileItem();
				fileDownloadItem.setFileName(primary.getFileName());
				fileDownloadItem.setInputStream(inputStream);
				//if (LOGGER.isDebugEnabled())
					//LOGGER.debug("getPrimary found file: " + primary.getFileName());
			}
		} catch (Exception ex) {
			//System.out.println("new service exception ... " + ex);
		}
		// }
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug("Primary file not found, returning null)");
		return fileDownloadItem;
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////
	public FileItem getSecondaryDocument(String oid) throws Exception {
		if (oid.isEmpty()) {
			return null;
		}
		PersistableUtility persistableUtility = new PersistableUtility();
		LCSDocument document = (LCSDocument) persistableUtility.getPersistable(oid);
		if (document == null) {
			return null;
		}
		// DocumentContentBuilder documentContentBuilder = new DocumentContentBuilder();
		FileItem fileDownloadItem = getSecondaryInfo(document);

		return fileDownloadItem;
	}

	public FileItem getSecondaryInfo(WTDocument doc) throws WTException, PropertyVetoException {
		InputStream inputStream = null;
		FileItem fileDownloadItem = null;

		ApplicationData secondary = getSecondaryApplicationData(doc);
		// ApplicationData secondary = (ApplicationData)
		// LCSQuery.findObjectById("OR:wt.content.ApplicationData:8274841");
		inputStream = getStream(secondary);
		if ((secondary != null) && (inputStream != null)) {
			fileDownloadItem = new FileItem();
			fileDownloadItem.setFileName(secondary.getFileName());
			fileDownloadItem.setInputStream(inputStream);
			//if (LOGGER.isDebugEnabled())
				//LOGGER.debug("getPrimary found file: " + secondary.getFileName());
		}

		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug("Primary file not found, returning null)");
		return fileDownloadItem;
	}

	public ApplicationData getSecondaryApplicationData(WTDocument doc) throws WTException, PropertyVetoException {
		ApplicationData primary = null;
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug("in getSecondaryApplicationData");
		doc = (LCSDocument) ContentHelper.service.getContents(doc);
		Vector<?> contents = ContentHelper.getContentList(doc);
		for (int i = 0; i < contents.size(); i++) {
			primary = (ApplicationData) contents.elementAt(i);
		}
		doc = (WTDocument) ContentHelper.service.getContents(doc);
		// ApplicationData primary = (ApplicationData)ContentHelper.getPrimary(doc);
		return primary;
	}
///////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////
	public FileItem getGenericDocument(String oid, String applicatioOid) throws Exception {
		if (oid.isEmpty()) {
			return null;
		}
		PersistableUtility persistableUtility = new PersistableUtility();
		LCSDocument document = (LCSDocument) persistableUtility.getPersistable(oid);
		if (document == null) {
			return null;
		}
//DocumentContentBuilder documentContentBuilder = new DocumentContentBuilder();
		FileItem fileDownloadItem = getGenericInfo(document,applicatioOid);

		return fileDownloadItem;
	}

	public FileItem getGenericInfo(WTDocument doc,String applicationOid) throws WTException, PropertyVetoException {
		InputStream inputStream = null;
		FileItem fileDownloadItem = null;

		ApplicationData secondary = getGenericApplicationData(doc,applicationOid);
//ApplicationData secondary = (ApplicationData) LCSQuery.findObjectById("OR:wt.content.ApplicationData:6061241");
		inputStream = getStream(secondary);
		if ((secondary != null) && (inputStream != null)) {
			fileDownloadItem = new FileItem();
			fileDownloadItem.setFileName(secondary.getFileName());
			fileDownloadItem.setInputStream(inputStream);
			//if (LOGGER.isDebugEnabled())
				//LOGGER.debug("getPrimary found file: " + secondary.getFileName());
		}

		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug("Primary file not found, returning null)");
		return fileDownloadItem;
	}

	public ApplicationData getGenericApplicationData(WTDocument doc,String applicationOid) throws WTException, PropertyVetoException {
		ApplicationData appData = null;
		ApplicationData appDataDownload = null;
		//if (LOGGER.isDebugEnabled())
			//LOGGER.debug("in getSecondaryApplicationData");
		doc = (LCSDocument) ContentHelper.service.getContents(doc);
		Vector<?> contents = ContentHelper.getContentList(doc);
		for (int i = 0; i < contents.size(); i++) {
			appData = (ApplicationData) contents.elementAt(i);
			if(FormatHelper.getObjectId(appData).equals(applicationOid))
			{
				appDataDownload =appData;
			}
		}
		//doc = (WTDocument) ContentHelper.service.getContents(doc);
//ApplicationData primary = (ApplicationData)ContentHelper.getPrimary(doc);
		return appDataDownload;
	}
///////////////////////////////////////////////////////////////////////////////
	public FileItem findThumbnailData(String docOid) {
	       //if (LOGGER.isDebugEnabled())
	           //LOGGER.debug((Object) (CLASSNAME + "***** findThumbnails ***** "+ docOid));
	        String imageThumbnail = "";
	        FileItem fileDownloadItem = new FileItem();
	       
	        try {
	            LCSDocument lcsDocument = (LCSDocument) LCSQuery.findObjectById(docOid);
	            imageThumbnail = lcsDocument.getThumbnailLocation();
	            //if (LOGGER.isDebugEnabled())
	                //LOGGER.debug((Object) (CLASSNAME + "***** PartPrimaryImageURL ****** "+ imageThumbnail));
	            if (FormatHelper.hasContent(imageThumbnail)) {
	                imageThumbnail = imageThumbnail.trim();
	                String inputImage = lcsDocument.getThumbnailLocation();
	                String stImage = "/images/";
	                int indx = inputImage.lastIndexOf(stImage);
	                if (indx > -1) {
	                inputImage = inputImage.substring(indx + stImage.length());
	                }
	                inputImage = com.lcs.wc.util.FileLocation.imageLocation.concat(File.separator).concat(inputImage);
	                //if (LOGGER.isDebugEnabled())
	                //LOGGER.debug((Object) (CLASSNAME + "********* inputImage findThumbnails ***** "+ inputImage));
	                //imageThumbnail = FileLocation.imageLocation.trim() + FileLocation.fileSeperator.trim() + imageThumbnail;
	                File file = new File(inputImage);
	                
	                InputStream inputStream = null;
	        		 if ((file.canRead()) && (file.length() > 0L))
	        	        {
	        			 inputStream = new FileInputStream(file);
	        			 
	        	        }
	        		 if (inputStream != null) {
	        				fileDownloadItem.setFileName(file.getName());
	        				fileDownloadItem.setInputStream(inputStream);
	        				//if (LOGGER.isDebugEnabled())
	        					//LOGGER.debug("getPrimary found file: " + fileDownloadItem.getFileName());
	        			}
				
	               
	            }

	        }

	        catch(Exception ex) {
	            //if (LOGGER.isDebugEnabled())
	                //LOGGER.debug((Object) (CLASSNAME + "********* Exception  .." + ex));
	        }
	        
	        return fileDownloadItem;
	       
	    }
}
