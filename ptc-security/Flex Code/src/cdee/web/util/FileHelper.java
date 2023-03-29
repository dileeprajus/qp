/*
 * Created on 06/07/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */
package cdee.web.util;

import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.LCSProperties;
import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Base64.Encoder;
import java.util.Date;
import java.util.StringTokenizer;
import wt.util.WTMessage;
import wt.util.WTProperties;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class FileHelper
{

  //private static final Logger LOGGER = LogR.getLogger(FileHelper.class.getName());
  //private static final String CLASSNAME = FileHelper.class.getName();
  private static final String IMAGE_FILE_LOCATION = LCSProperties.get("com.lcs.wc.content.imagefilePath");
  private static final String IMAGE_FILE_PATH_OVERRIDE = LCSProperties.get("com.lcs.wc.content.imagefilePathOverride");
  private static String TEMP_THUMBNAIL_FOLDER;
  private static final boolean DEBUG = LCSProperties.getBoolean("com.plugin76.rest.util.FileHelper");
  
  static
  {
    try
    {
      TEMP_THUMBNAIL_FOLDER = WTProperties.getLocalProperties().getProperty("wt.temp");
    }
    catch (IOException e)
    {
      e.printStackTrace();
    }
  }
  
  public static String fileDirectoryLocation()
    throws IOException
  {
    //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** fileDirectoryLocation " ));
    String fileLocation;
    //String fileLocation;
    if (FormatHelper.hasContent(IMAGE_FILE_PATH_OVERRIDE))
    {
      StringTokenizer st = new StringTokenizer(IMAGE_FILE_PATH_OVERRIDE);
      String filePath = st.nextToken();
      fileLocation = filePath;
    }
    else
    {
      WTProperties wtProperties = WTProperties.getLocalProperties();
      String filePath = FormatHelper.formatOSFolderLocation(IMAGE_FILE_LOCATION);
      fileLocation = wtProperties.getProperty("wt.home") + filePath;
    }
    return fileLocation;
  }
  
  public static String parseImageDirectory(String thumbnail)
    throws IOException
  {
    //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** parseImageDirectory " ));
    int lastIndexOf = thumbnail.lastIndexOf("/") + 1;
    String newThumbnail = thumbnail.substring(lastIndexOf, thumbnail.length());
    
    String fileDirectoryLocation = fileDirectoryLocation();
    if (fileDirectoryLocation == null) {
      return null;
    }
    String fileLocation = fileDirectoryLocation + File.separator + newThumbnail;
    return fileLocation;
  }
  
  public static String encodeThumbnailFile(String thumbnail)
    throws IOException
  {
    //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** encodeThumbnailFile " ));
    String fileLocation = parseImageDirectory(thumbnail);
    Path path = Paths.get(fileLocation, new String[0]);
    
    byte[] data = Files.readAllBytes(path);
    Base64.Encoder encoder = Base64.getEncoder();
    String encodedString = encoder.encodeToString(data);
    
    return encodedString;
  }
  
  public static String convertToUniqThumbnailFilename(String fn)
  {
    String ext = fn.substring(fn.lastIndexOf('.'));
    String file = fn.substring(0, fn.lastIndexOf('.') - 1);
    
    String uniqueFileName = file + "-.-" + new Date().getTime() / 1000L + ext;
    return uniqueFileName;
  }
  
  public static void copyThumbImageToFolders(String folders, String source, String name)
  {
    //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** copyThumbImageToFolders " ));
    StringTokenizer st = new StringTokenizer(folders, ",");
    File file = new File(source);
    while (st.hasMoreTokens())
    {
      String saveFolder = st.nextToken();
      File copiedFile = new File(saveFolder + File.separator + name);
      if (copiedFile.exists())
      {
        if (DEBUG) {
         // System.out.println("\t The file " + saveFolder + File.separator + name + " exists already");
        }
      }
      else {
        try
        {
          if (DEBUG) {
         //   System.out.println("\t copying file to " + copiedFile.getAbsolutePath());
          }
          Files.copy(file.toPath(), copiedFile.toPath(), new CopyOption[0]);
        }
        catch (IOException e)
        {
          e.printStackTrace();
          Object[] objA = { saveFolder + File.separator + file.getName() };
        //  System.out.println(WTMessage.getLocalizedMessage("com.lcs.wc.resource.UtilRB", "clusterCopy_ERR", objA));
        }
      }
    }
  }
  
  public static String getTempFilePath(String fileName)
  {
    String contentFile = TEMP_THUMBNAIL_FOLDER + File.separatorChar + fileName;
    if (DEBUG) {
    //  System.out.println("getTempFilePath(): contentFile=" + contentFile);
    }
    return contentFile;
  }
}
