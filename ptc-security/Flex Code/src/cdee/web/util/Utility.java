package cdee.web.util;

import java.io.IOException;
import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.rmi.RemoteException;
import java.time.LocalDateTime;

//import org.apache.log4j.Logger;
import org.json.simple.parser.ParseException;

import com.lcs.wc.util.LCSProperties;

import wt.method.RemoteAccess;

import wt.log4j.LogR;
import wt.method.RemoteMethodServer;
import wt.queue.ProcessingQueue;
import wt.queue.QueueHelper;
import wt.services.StandardManager;
import wt.session.SessionHelper;
import wt.util.WTException;
import wt.util.WTProperties;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class Utility extends StandardManager implements Serializable, RemoteAccess {

	//private static final Logger LOGGER = LogR.getLogger(Utility.class.getName());
  	//private static final String CLASSNAME = Utility.class.getName();

	private static final long serialVersionUID = 1L;

	public void cacheOptions(String option) throws WTException, IOException, ParseException {
		//if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** Invoked using Utility ########################################################" ));

		if (option.equalsIgnoreCase("RefreshCache")) {
			//if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** RefreshCache"));
			TRCCache.clearCache();
			TRCCache.refresh();
		} else if (option.equalsIgnoreCase("ClearCache")) {
			//if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** Clear Cache"));
		
			TRCCache.clearCache();
		} else if (option.equalsIgnoreCase("TriggerCache")) {
			//if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** Get Trigger Cache"));
			
		} else if (option.equalsIgnoreCase("RelationshipCache")) {
			//if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** Get Relationship Cache"));
			
		}
		//if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** Exit Utility #############################"));
		
	}

	public void properties(String option) throws WTException, IOException, ParseException {
		//if (LOGGER.isDebugEnabled())
               //	{LOGGER.debug((Object) (CLASSNAME + "Invoked using Utility. Checking TRC related properties"));
               	           		//LOGGER.debug((Object) (CLASSNAME + "########################################################"));	}

		String[] lcsProperties = { "TRC.email.fromEmailId", "TRC.email.toEmailId",
				"com.wc.Integration.CDEE.trigger.location", "com.wc.Integration.CDEE.Outbound.QueueName",
				"TRC.QueueName.stopQueueFlag" };
		String[] wtProperties = { "wt.mail.mailhost", "wt.rmi.server.hostname", "wt.webserver.protocol","wt.env.PATH","wt.java.classpath","wt.webinf.mylib" };

		
		//if (LOGGER.isDebugEnabled())
              // 	{
               		//LOGGER.debug((Object) (CLASSNAME + "IExit Utility"));
               	    //LOGGER.debug((Object) (CLASSNAME + "########################################################"));
              // 	    }
		

	}
	public void getTRCVersion()
	{
		//if (LOGGER.isDebugEnabled())
       	{
       		//LOGGER.debug((Object) (CLASSNAME + "TRC Version 1.4 "));
       	    //LOGGER.debug((Object) (CLASSNAME + "########################################################"));
       	    }
		
	}
	
	

	public static void main(String args[]) {
		if (args.length < 5 || !"-u".equals(args[0]) || !"-p".equals(args[2])) {
		
			System.exit(1);
		}
		String username = args[1];
		String password = args[3];
		RemoteMethodServer rms = RemoteMethodServer.getDefault();
		rms.setUserName(username);
		rms.setPassword(password);

		// TRCCache cache = new TRCCac
		try {
			Class<?>[] argTypes = { String.class };
			Object[] argValues = { "" };
			if (args[4].equals("-cache")) {
				argValues[1] = args[5];
				rms.invoke("cacheOptions", null, new Utility(), argTypes, argValues);
			} else if (args[4].equals("-prop")) {
				rms.invoke("properties", null, new Utility(), argTypes, argValues);
			}
		} catch (RemoteException | InvocationTargetException e) {
			e.printStackTrace();
		}
	}
}
