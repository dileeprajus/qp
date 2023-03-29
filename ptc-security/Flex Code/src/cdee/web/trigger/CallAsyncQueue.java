package cdee.web.trigger;


import com.google.gson.Gson;
import org.json.simple.JSONObject;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Iterator;
import com.google.gson.Gson;
import java.io.FileReader;
import org.json.simple.parser.JSONParser;
import com.lcs.wc.flextype.FlexType;
import java.io.File;
import wt.util.WTProperties;
import javax.net.ssl.*;
import java.security.cert.*;
import java.security.*;
import wt.util.WTException;
import wt.util.WTPropertyVetoException;
import java.sql.SQLException;
import com.lcs.wc.util.LCSProperties;
import wt.org.WTPrincipal;
import wt.part.WTPartMaster;
import wt.queue.ProcessingQueue;
import wt.queue.QueueHelper;
import wt.session.SessionHelper;
import wt.session.SessionServerHelper;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class CallAsyncQueue  {
//private static final Logger LOGGER = LogR.getLogger(CallAsyncQueue.class.getName());
//private static final String CLASSNAME = CallAsyncQueue.class.getName();
	
	
	
	/**
	 * CallAsyncQueue implements Thread to execute service asynchronous
	 */
	
	

	/**
	 *Get the String to be written to the file and write it to the queue
	 *
	 * @param obj the new integration value on bom
	 * @throws WTException the wT exception
	 * @throws WTPropertyVetoException 
	 * @throws SQLException 
	 */
	public static void callTRCTriggerAsynch(String url, JSONObject triggerObjectInput, String appKey) throws WTException, WTPropertyVetoException, SQLException{
		
			try {
					//if (LOGGER.isDebugEnabled())
					    //LOGGER.debug((Object) (CLASSNAME + "***** Trying to get QueueName assigned ***** " ));
			
					final String queueName = LCSProperties.get("com.wc.Integration.CDEE.Outbound.QueueName","CDEEQueue");
					//if (LOGGER.isDebugEnabled())
					{
		                //LOGGER.debug((Object) (CLASSNAME + "***** Cdee QueueName ***** "+queueName ));
		                //LOGGER.debug((Object) (CLASSNAME + "***** Before adding queue entry ***** " ));
					}
					StringBuffer strFileContent = null;
					addQueueEntry(queueName, url, triggerObjectInput,appKey);
				
			}
			catch (WTException e) {
				e.printStackTrace();
			}
		
	}



	/**
	 * Adds the queue entry.
	 * 
	 * @param strQueueName
	 *            the str queue name
	 * @param strWriteMtToFile
	 *            the str write mt to file
	 * @throws WTException
	 *             the wT exception
	 * @throws SQLException
	 *             the sQL exception
	 */
	public static void addQueueEntry(final String strQueueName,
			final String url, JSONObject triggerObjectInput, String appKey) throws WTException, SQLException {

		
		//ProcessingQueue queue = null;
		boolean enforce = SessionServerHelper.manager.setAccessEnforced(false);
		try {
			ProcessingQueue queue = QueueHelper.manager.getQueue(strQueueName);
			// checking if queue is not null
			if (null != queue) {
			
					String processQ = "createFlexObjectAsynch";
					SessionServerHelper.manager.setAccessEnforced(false);
					final WTPrincipal wtprincipal = SessionHelper.manager
							.getAdministrator();
					//wt.session.SessionContext.setEffectivePrincipal(wtprincipal);
					queue.addEntry(wtprincipal, processQ,
							"cdee.web.trigger.CallAsyncQueueProcessor",
							new Class[] {String.class, JSONObject.class, String.class},
							new Object[] {url, triggerObjectInput, appKey});
					
					SessionServerHelper.manager.setAccessEnforced(true);
				
					
			}
			else
			{
				//queue = QueueHelper.manager.createQueue(strQueueName, true);

			}
		} catch (WTException ex) {
			//if (LOGGER.isDebugEnabled())
					    //LOGGER.debug((Object) (CLASSNAME + "***** WTException ***** "+ex.getMessage() ));
		}
		catch (Exception e) {
			//if (LOGGER.isDebugEnabled())
					    //LOGGER.debug((Object) (CLASSNAME + "***** WTException ***** "+e.getMessage() ));
		}
		finally {
		    SessionServerHelper.manager.setAccessEnforced(enforce);
		}
		//if (LOGGER.isDebugEnabled())
					    //LOGGER.debug((Object) (CLASSNAME + "***** End of add queue entry ***** "));
	}

	
    

}
