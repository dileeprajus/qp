
package cdee.web.util;

import java.rmi.RemoteException;
import java.util.Calendar;
import java.util.TimeZone;
import wt.cache.MessengerIfc.MessageReceiverIfc;

//import org.apache.log4j.Logger;

import com.lcs.wc.util.LCSProperties;
import wt.cache.Messenger;
import wt.log4j.LogR;
import wt.util.JvmIdUtils;
import wt.util.WTProperties;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class TRCCache {
	//private static final Logger LOGGER = LogR.getLogger(TRCCache.class.getName());
	//private static final String CLASSNAME = TRCCache.class.getName();
    private static String propTimeZone = LCSProperties.get("com.lcs.wc.db.QueryTime.TIMEZONE", "GMT");

	static boolean TIMEDEBUG;
	static JSONArray triggerArray;
	static JSONObject relationObject;
	
	public static String admin = "Administrator";
	public static volatile boolean initialized = false;

    public static final class TRCMessenger extends Messenger {

        public TRCMessenger() throws RemoteException {
            super();
            //if (LOGGER.isDebugEnabled())
    	         	//LOGGER.debug((Object) (CLASSNAME + "***** TRCMessenger Initialized: " ));
        }
    }

	private static TRCMessenger messenger;

	static {
        try {
            admin = WTProperties.getServerProperties().getProperty("wt.admin.defaultAdministratorName");
            // Initialize the messenger service to clear the cache when signaled
            // by another method server.
            messenger = new TRCMessenger();
            messenger.addReceiver(new MessageReceiverIfc() {
            	@Override
                public void receiveMessage(Object obj) {
                    if (TRCCache.isInitialized()) {
                        //if (LOGGER.isDebugEnabled())
                            //LOGGER.debug("*******************************\n TRCMessenger received:" + (String) obj);
                        try {
                            clearCache(false);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        //if (LOGGER.isDebugEnabled())
                            //LOGGER.debug(" TRCMessenger processed:" + (String) obj + "\n*******************************");
                    } else {
                        //if (LOGGER.isDebugEnabled())
                            //LOGGER.debug("*******************************\n TRCMessenger received:" + (String) obj);
                        //LOGGER.debug(" TRCCache not initialized yet. Ignoring request.");
                        //if (LOGGER.isDebugEnabled())
                            //LOGGER.debug(" TRCMessenger processed:" + (String) obj + "\n*******************************");
                    }

                }
            	@Override
                public void receiveReset() {
                    if (TRCCache.isInitialized()) {
                        //LOGGER.debug("*******************************\n TRCMessenger received: reset");
                        try {
                            clearCache(false);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                        //LOGGER.debug(" TRCMessenger processed: reset \n*******************************");
                    } else {
                        //LOGGER.debug("*******************************\n TRCMessenger received: reset ");
                        //LOGGER.debug(" TRCCache not initialized yet. Ignoring request.");
                        //LOGGER.debug(" TRCMessenger processed: reset \n*******************************");
                    }
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

	public static boolean isInitialized() {
		return initialized;
	}

	public static synchronized void init() throws IOException, ParseException {
		//if (LOGGER.isDebugEnabled()) {
			//LOGGER.debug((Object) ("TRC Cache: initialized:" + initialized));
		//}
		if (initialized) {
			return;
		}
		//LOGGER.debug((Object) "Initializing user cache");
		long startTRCC = System.currentTimeMillis();
		TRCCache.timeDebug((String) "\n****UserCache Populating: Start Time");
		triggerArray = new JSONArray();
		relationObject = new JSONObject();

		try {
			JSONParser parser = new JSONParser();
			String codebase = WTProperties.getServerProperties().getProperty("wt.codebase.location");
			String defaultFileLocation = codebase + File.separator + "rfa" + File.separator + "CDEE" + File.separator;
			String fileLocation = (String) LCSProperties.get("com.wc.Integration.CDEE.trigger.location",
					defaultFileLocation);
			//if (LOGGER.isDebugEnabled()) {
				//LOGGER.debug((Object) ("TRC Cache: fileLocation:" + fileLocation));
			//}
			String triggerFileLocation = fileLocation + "triggerConfig.json";
			FileReader triggerFileRead = new FileReader(triggerFileLocation);
			triggerArray = (JSONArray) parser.parse(triggerFileRead);
			triggerFileRead.close();
			String relationFileLocation = fileLocation + "configurationRelations.json";
			FileReader relationFileRead = new FileReader(relationFileLocation);
			relationObject = (JSONObject) parser.parse(relationFileRead);
			relationFileRead.close();
			initialized = true;
		} catch (IOException e) {
			//if (LOGGER.isDebugEnabled()) {
				//LOGGER.debug((Object) ("Error initializing TRC cache due to IO Error"));
			//}
            e.printStackTrace();


		} catch (ParseException e) {
			//if (LOGGER.isDebugEnabled()) {
				//LOGGER.debug((Object) ("Error initializing TRC cache due to Parsing Error"));
			//}
			e.printStackTrace();

		}

        timeDebug("------>Total Time it took to populate TRC Cache:" + getQueryTime(System.currentTimeMillis() - startTRCC));

	}


    public static void refresh() throws ParseException, IOException {
        init();
    }

	public static synchronized void clearCache() throws IOException, ParseException {
		clearCache((boolean) true);
	}

    
	private static synchronized void clearCache(boolean notifyAll) throws IOException, ParseException {
		if (initialized) {
			//if (LOGGER.isDebugEnabled()) {
				//LOGGER.debug((Object) (CLASSNAME
						//+ ".clearCache ############################################################"));
				//LOGGER.debug((Object) (CLASSNAME
						//+ ".clearCache ## TRC Cache: CLEARING TRCCache                           "));
				//LOGGER.debug((Object) (CLASSNAME
						//+ ".clearCache ##                                                          "));
				//LOGGER.debug((Object) (CLASSNAME
						//+ ".clearCache ##    PERFORMANCE WARNING !!!!!!!!!!!!!!!!!!!!!!!!!!!       "));
				//LOGGER.debug((Object) (CLASSNAME
					//	+ ".clearCache ##                                                          "));
				//LOGGER.debug((Object) (CLASSNAME + ".clearCache ## Notify All:  " + notifyAll));
				//LOGGER.debug((Object) (CLASSNAME
						//+ ".clearCache ############################################################"));
			//}
			triggerArray = new JSONArray();
			relationObject = new JSONObject();
			initialized = false;
		} 
		/*else //if (LOGGER.isDebugEnabled()) {
			//LOGGER.debug(
					(Object) (CLASSNAME + ".clearCache ############################################################"));
			//LOGGER.debug(
					(Object) (CLASSNAME + ".clearCache ## TRC Cache: CLEARING USERCACHE                           "));
			//LOGGER.debug(
					(Object) (CLASSNAME + ".clearCache ##                                                          "));
			//LOGGER.debug((Object) (CLASSNAME + ".clearCache ##    local TRC Cache is not initialized yet"));
			//LOGGER.debug(
					(Object) (CLASSNAME + ".clearCache ##                                                          "));
			//LOGGER.debug((Object) (CLASSNAME + ".clearCache ## Notify All:  " + notifyAll));
			//LOGGER.debug(
					(Object) (CLASSNAME + ".clearCache ############################################################"));
		}*/

		if (notifyAll) {
			String msg = getUniqueId();
			//if (LOGGER.isDebugEnabled()) {
				//LOGGER.debug(
		//				(Object) ("*****************************************************\n UCMessenger notify all CLEAR UserCache msg sent:"
		//						+ msg + "\n*****************************************************"));
		//	}
			messenger.sendMessage(msg);
		}
	}

	private static String getUniqueId() {
		return System.currentTimeMillis() + "." + JvmIdUtils.getJvmHost() + ":" + JvmIdUtils.getJvmId();
	}

	static void timeDebug(String msg) {
		if (TIMEDEBUG) {
		//	System.out.println(msg);
		}
	}

	public static String getQueryTime(long queryTime) {

        TimeZone timeZone = TimeZone.getTimeZone(propTimeZone);
        Calendar cal = Calendar.getInstance(timeZone);
        cal.setTime(new java.util.Date(queryTime));
        String time = "";
        int hour = cal.get(Calendar.HOUR);
        int minute = cal.get(Calendar.MINUTE);
        int second = cal.get(Calendar.SECOND);
        int milli = cal.get(Calendar.MILLISECOND);

        if (hour > 0) {
            time += hour + ":";
        }
        if (minute > 0) {
            time += minute + ":";
        }

        time += second + "." + milli;

        return time;
    }

	public static JSONArray getTriggerCache() {
		return triggerArray;
	}
	public static JSONObject getRelationCache() {
		return relationObject;
	}

	public static void main(String[] args) {
        try {
            long start = System.currentTimeMillis();
            if (args[0].equalsIgnoreCase("Start")) {
                init(); 
          
            }else {
            	 if (args[0].equalsIgnoreCase("Clear")) {
                     clearCache();
           
                 }else {
                	 if (args[0].equalsIgnoreCase("Print")) {
                
                      }else {
                	 if (args[0].equalsIgnoreCase("Refresh")) {
                         refresh();
                	
                      }
                 }
            }
            }
        }
        
        catch (Exception e) {
            e.printStackTrace();
        }
        System.exit(0);
    }

}