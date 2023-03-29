package cdee.web.trigger;

import com.google.gson.Gson;
import com.lcs.wc.util.LCSProperties;

import org.json.simple.JSONObject;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import wt.log4j.LogR;
import wt.queue.ProcessingQueue;
import wt.queue.QueueHelper;
import wt.util.WTException;
//import org.apache.log4j.Logger;
import cdee.web.trigger.CallAsyncQueueProcessor;
import cdee.web.util.EmailUtility;
import javax.net.ssl.SSLHandshakeException;

public final class CallAsyncQueueProcessor {

	//private static final String CLASSNAME = CallAsyncQueueProcessor.class.getName();
	//private static final Logger LOGGER = LogR.getLogger((String) CallAsyncQueueProcessor.class.getName());
	public static String queueName = LCSProperties.get("com.wc.Integration.CDEE.Outbound.QueueName", "CDEEQueue");
	public static String stopQueueFlag = LCSProperties.get("TRC.QueueName.stopQueueFlag", "true");	
	public static String mailSubject = LCSProperties.get("TRC.email.mailSubject", "Error Sending Data to TRC. Check with FlexPLM Administrator. ");
	public static String mailBody = LCSProperties.get("TRC.email.mailBody", "<B>An error occurred in sending the JSON message to TRC.<BR><BR>JSON message</B>");
	private static String postBody = "";
	private static String queueStopped = "Stopping TRC Queue.";

	/**
	 * CallAsyncQueueProcessorProcessor implements Thread to execute service
	 * asynchronous
	 * 
	 * @throws Exception
	 */

	public static void createFlexObjectAsynch(String url, JSONObject triggerObject, String appKey) throws Exception {
		//if (LOGGER.isDebugEnabled()) {
			//LOGGER.debug(CLASSNAME + "  ::createFlexObjectAsynch::::url " + url);
		//}
		Gson gson = new Gson();
		HttpURLConnection con = null;
		DataOutputStream wr = null;
		postBody = "";
		boolean stopQueue = false;
		try {
			URL obj1 = new URL(url);
			con = (HttpURLConnection) obj1.openConnection();
			con.setRequestMethod("POST");
			String USER_AGENT = "Mozilla/5.0";
			con.setRequestProperty("User-Agent", USER_AGENT);
			con.setRequestProperty("Content-Type", "application/json");
			con.setRequestProperty("accept", "application/json");
			con.setRequestProperty("ignoreSSLErrors", "true");
			con.setRequestProperty("appKey", appKey);
			con.setConnectTimeout(500);
			String defaultTime = "0";
			String  sTime = (String) LCSProperties.get("com.wc.Integration.CDEE.readTimeOut",defaultTime);
			int readTime = Integer.parseInt(sTime);

			try{
				con.setReadTimeout(readTime);
				}
				catch(Exception ex)
				{
				throw new Exception(ex);
				}
			JSONObject postBodyObject = new JSONObject();
			postBodyObject.put("type", "ASYNC");
			postBodyObject.put("input", triggerObject);
			postBody = gson.toJson(postBodyObject).toString();
			
			con.setDoOutput(true);
			OutputStream outstream;
			// If Thingworx is down, then exception happens in next line.
			try {
				outstream = con.getOutputStream();
			} catch (Exception e) {
				//if (LOGGER.isDebugEnabled()) {
					//LOGGER.debug(CLASSNAME + "  ::Exception raised while sending data to Thingworx " + e.getMessage());
				//	}
				stopQueue = true;
				throw new Exception(e);
			}
			wr = new DataOutputStream(outstream);
			wr.write(postBody.getBytes("UTF-8"));
			
			int responseCode = con.getResponseCode();
			wr.flush();
			wr.close();

		}catch (SSLHandshakeException  sslexception) {
			stopQueue = true;
			throw new Exception(sslexception);
		} catch (Exception exception) {
			//System.out.println("::createFlexObjectAsynch::::Exception raised with "+exception.getMessage());
			stopQueue = true;
			throw new Exception(exception);
		} finally {
			//System.out.println("::createFlexObjectAsynch::::finally ");
			if (wr != null) {
				try {
					wr.close();
				} catch (Exception e) {
				}
			}
			if (con != null) {
				//if (LOGGER.isDebugEnabled()) {
					//LOGGER.debug(CLASSNAME + "::createFlexObjectAsynch::::connection not null ");
				//	}
				
				con.disconnect();
			}
			if (stopQueue) {
				//if (LOGGER.isDebugEnabled()) {
					//LOGGER.debug(CLASSNAME + "  ::If Queue stopped " +stopQueue);
					//}
				//System.out.println("::createFlexObjectAsynch::::stopQueueFlag "+stopQueueFlag);
				if (stopQueueFlag.equalsIgnoreCase("true")) {
					mailSubject = mailSubject+queueStopped;
					//EmailUtility.sendMail(mailSubject , mailBody+" : "+ postBody);
					try{
						stopProcessingQueue();
					}catch (Exception exception) {
						//System.out.println("::createFlexObjectAsynch::::stopProcessingQueue "+exception.getMessage());
			
					}
					EmailUtility.sendMail(mailSubject , mailBody+" : "+ postBody);
				}
				else
				{
					EmailUtility.sendMail(mailSubject , mailBody+" : "+ postBody);
				}
				//System.out.println("::createFlexObjectAsynch::::postBody "+postBody);
			}
		}
	}
	
	private static void stopProcessingQueue() throws WTException {
		//if (LOGGER.isDebugEnabled()) {
					//LOGGER.debug(CLASSNAME +  "::createFlexObjectAsynch::::stopProcessingQueue ");
					//}
		//System.out.println("::createFlexObjectAsynch::::stopProcessingQueue ");
			ProcessingQueue pq = QueueHelper.manager.getQueue(queueName);
			try{
				QueueHelper.manager.stopQueue(pq);
			}catch (Exception exception) {
					//if (LOGGER.isDebugEnabled()) {
					//LOGGER.debug(CLASSNAME +  "::createFlexObjectAsynch::::stopProcessingQueue "+exception.getMessage());
					//}

					}
			
		
	} 
}
