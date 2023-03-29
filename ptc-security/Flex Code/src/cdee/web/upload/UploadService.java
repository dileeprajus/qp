package cdee.web.upload;

import com.lcs.wc.util.LCSProperties;
import cdee.web.util.FileHelper;
import java.io.File;
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
import cdee.web.util.AppUtil;
import com.lcs.wc.util.FormatHelper;
import org.json.simple.JSONObject;
import com.lcs.wc.foundation.LCSQuery;


public class UploadService
{
  public static final long MAX_FILE_SIZE = (long)LCSProperties.get("com.lcs.wc.content.documentMaxFileSize", 1.048576E8F);
  private static final Object[] UPLOAD = new Object[0];
  //private static final Logger LOGGER = LogR.getLogger(UploadService.class.getName());
  //private static final String CLASSNAME = UploadService.class.getName();
  
 /* public JSONObject uploadFile(String fileName, InputStream contentStream, String documentOid)
    throws SizeNotValidException,IOException, WTException
  {
    String tempFile = FileHelper.getTempFilePath(fileName);
    LCSDocumentClientModel documentModel = new LCSDocumentClientModel();
    String[] secondaryContentFiles = new String[10];
    JSONObject responseObject = new JSONObject();
    AppUtil util = new AppUtil();
    try
    {
      Path tempFilePath = new File(tempFile).toPath();
      Files.copy(contentStream, tempFilePath, new CopyOption[] { StandardCopyOption.REPLACE_EXISTING });
      if (tempFilePath.toFile().length() > MAX_FILE_SIZE)
      {
        //String localizedMessageFileSize = StringHelper.getLocalizedMessage("com.plugin76.rest.localized.ParameterRB", "fileSize", UPLOAD);
        
      //  System.out.println("uploadFile(): file size=" + tempFilePath.toFile().length() + ", max size=" + MAX_FILE_SIZE);
        //throw new InputValidationException("Size not accepted");
        throw new SizeNotValidException("uploadFile(): file size="+ tempFilePath.toFile().length() + ", max size=" + MAX_FILE_SIZE);

      }
      LCSDocument lcsDocumentInput = (LCSDocument) LCSQuery.findObjectById(documentOid);
      System.out.println("documentModel =" + documentOid);
      System.out.println("tempFilePath  =" + tempFilePath.toString());
      com.plugin76.rest.documents.service.P76DocumentLogic p76doc = new com.plugin76.rest.documents.service.P76DocumentLogic() ;
      String[] secondary = secondary = new String[0];
      lcsDocumentInput = p76doc.save(lcsDocumentInput, tempFilePath.toString(), null, secondary,null,null,null);
      com.lcs.wc.document.LCSDocumentLogic lcsdocLogic = new com.lcs.wc.document.LCSDocumentLogic();
      String documentid = FormatHelper.getVersionId(lcsDocumentInput).toString();
      responseObject = util.getUpdateResponse(documentid,"Document", responseObject);

      
    }catch(Exception e){
            System.out.println("Exception=== =" + e);
            responseObject = util.getExceptionJson(e.getMessage());
        }
    finally
    {
      contentStream.close();
    }
    return responseObject;
  }*/
  public JSONObject uploadFile(String fileName, InputStream contentStream, String documentOid)
    throws SizeNotValidException,IOException, WTException
  {
    //if (LOGGER.isDebugEnabled())
    {
          //LOGGER.debug((Object) (CLASSNAME + "***** uploadFile..fileName: " + fileName));
          //LOGGER.debug((Object) (CLASSNAME + "*****uploadFile..contentStream: " + contentStream));
          //LOGGER.debug((Object) (CLASSNAME + "*****uploadFile..documentOid: " + documentOid));
     }
    
     /*try{
     int data = contentStream.read();
     System.out.println("...uploadFile..documentOid data data .... "+data);
      while(data != -1) {
      //do something with data...
      System.out.println("...uploadFile..documentOid reading data .... "+data);

      data = contentStream.read();
    }
    System.out.println("...uploadFile..after read data data .... "+data);
  }catch(Exception ex)
  {
    System.out.println("...uploadFile..ex... "+ex);

  }*/
    //Sets as primary content but keeps file in temp folder
    String tempFile = FileHelper.getTempFilePath(fileName);
    LCSDocumentClientModel documentModel = new LCSDocumentClientModel();
    String[] secondaryContentFiles = new String[10];
    JSONObject responseObject = new JSONObject();
    AppUtil util = new AppUtil();
    try
    {
      Path tempFilePath = new File(tempFile).toPath();
      //System.out.println("File path "+tempFile);
      Path tempFilePath1 = new File("I:\\test\\"+fileName).toPath();
      //System.out.println("File path "+tempFilePath1);
      Files.copy(contentStream, tempFilePath1, new CopyOption[] { StandardCopyOption.REPLACE_EXISTING });
      Files.copy(contentStream, tempFilePath, new CopyOption[] { StandardCopyOption.REPLACE_EXISTING });
      if (tempFilePath.toFile().length() > MAX_FILE_SIZE)
      {

        throw new SizeNotValidException("uploadFile(): file size="+ tempFilePath.toFile().length() + ", max size=" + MAX_FILE_SIZE);

      }
      LCSDocument lcsDocumentInput = (LCSDocument) LCSQuery.findObjectById(documentOid);
      //if (LOGGER.isDebugEnabled())
      {
          //LOGGER.debug("uploadFile..documentOid: " + documentOid);
          //LOGGER.debug("uploadFile..tempFilePath: " + tempFilePath.toString());
         
       }
     
      com.lcs.wc.document.LCSDocumentLogic lcsdocLogic = new com.lcs.wc.document.LCSDocumentLogic();
      //This add's value to primary, thumbnails, additional file but deleting in temp folder
      //lcsDocumentInput = lcsdocLogic.associateContent(lcsDocumentInput,tempFilePath.toString());
      // Adding only yo primary file
      lcsDocumentInput = lcsdocLogic.associateContentLoad(lcsDocumentInput,tempFilePath.toString(),null);

      String documentid = FormatHelper.getVersionId(lcsDocumentInput).toString();
      responseObject = util.getUpdateResponse(documentid,"Document", responseObject);

      
    }catch(Exception e){
      //if (LOGGER.isDebugEnabled())
            //LOGGER.debug("Exception=== =: " + e.getMessage());
            responseObject = util.getExceptionJson(e.getMessage());
        }
    finally
    {
      contentStream.close();
    }
    return responseObject;
  }
  public JSONObject uploadFileold(String fileName, InputStream contentStream, String documentOid)
    throws SizeNotValidException,IOException, WTException
  {
    String tempFile = FileHelper.getTempFilePath(fileName);
    LCSDocumentClientModel documentModel = new LCSDocumentClientModel();
    String[] secondaryContentFiles = new String[10];
    JSONObject responseObject = new JSONObject();
    AppUtil util = new AppUtil();
    try
    {
      Path tempFilePath = new File(tempFile).toPath();
      Files.copy(contentStream, tempFilePath, new CopyOption[] { StandardCopyOption.REPLACE_EXISTING });
      if (tempFilePath.toFile().length() > MAX_FILE_SIZE)
      {
        throw new SizeNotValidException("uploadFile(): file size="+ tempFilePath.toFile().length() + ", max size=" + MAX_FILE_SIZE);

      }
      documentModel.load(documentOid);
     // System.out.println("documentModel =" + documentOid);
     // System.out.println("tempFilePath  =" + tempFilePath.toString());
     
      //documentModel.setContentFile(tempFilePath.toString());
        if(documentModel.getContentFile()!= null)
        {
      secondaryContentFiles[1]= tempFilePath.toString();
      documentModel.setSecondaryContentFiles(secondaryContentFiles);
    }
    else
      documentModel.setContentFile(tempFilePath.toString());
      //float imageGenerationMode = ((Float)document.getValue("imageGenerationMode")).floatValue();
      documentModel.save();
      String documentid = FormatHelper.getVersionId(documentModel.getBusinessObject()).toString();
      responseObject = util.getUpdateResponse(documentid,"Document", responseObject);

      
    }catch(Exception e){
            responseObject = util.getExceptionJson(e.getMessage());
        }
    finally
    {
      contentStream.close();
    }
    return responseObject;
  }
  
  public void copyFile(String src, String dest)
    throws IOException
  {
    Files.copy(new File(src).toPath(), new File(dest).toPath(), new CopyOption[] { StandardCopyOption.REPLACE_EXISTING });
  }
}
