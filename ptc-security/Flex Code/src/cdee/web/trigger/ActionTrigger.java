/*
 * Created on 06/20/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */

package cdee.web.trigger;

import wt.fc.WTObject;
import wt.util.WTException;
import cdee.web.util.AppUtil;

import java.io.IOException;
import java.util.Collection;

import org.json.simple.parser.ParseException;

import cdee.web.util.TRCCache;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;

public class ActionTrigger {
//private static final Logger LOGGER = LogR.getLogger(ActionTrigger.class.getName());
//private static final String CLASSNAME = ActionTrigger.class.getName();
	
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	 * @throws ParseException 
	 * @throws IOException 
	*/
	public static void preDelete(WTObject obj)throws WTException, IOException, ParseException
	{
		//if (LOGGER.isDebugEnabled())
		{
                //LOGGER.debug((Object) (CLASSNAME + "***** Begining Inside the PRE_DELETE  ***** " ));
                //LOGGER.debug((Object) (CLASSNAME + "***** PRE_DELETE ***** "+obj.getType() ));
		}
		
		if (!TRCCache.isInitialized()) 
			TRCCache.refresh();
		TriggerService.callHttpService("DELETE",obj);
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void postDelete(WTObject obj)throws WTException, IOException, ParseException
	{
		//if (LOGGER.isDebugEnabled())
		{
                //LOGGER.debug((Object) (CLASSNAME + "***** Begining Inside the triggers POST_DELETE ***** " ));
                //LOGGER.debug((Object) (CLASSNAME + "***** POST_DELETE ***** "+obj.getType() ));
		}
		
		
	}
	
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void preDerive(WTObject obj)throws WTException
	{
	
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void preCreateDerive(WTObject obj)throws WTException
	{
	
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void preUpdateDerive(WTObject obj)throws WTException
	{
	
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void postDerive(WTObject obj)throws WTException
	{
	
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void postCreateDerive(WTObject obj)throws WTException
	{
	
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void postUpdateDerive(WTObject obj)throws WTException
	{
	
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void prePersist(WTObject obj)throws WTException
	{
	
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void preCreatePersist(WTObject obj)throws WTException
	{
	
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void preUpdatePersist(WTObject obj)throws WTException
	{
	
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	*/
	public static void postPersist(WTObject obj)throws WTException
	{
	
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	 * @throws ParseException 
	 * @throws IOException 
	*/
	public static void postCreatePersist(WTObject obj)throws WTException, IOException, ParseException
	{
		//if (LOGGER.isDebugEnabled())
		{
                //LOGGER.debug((Object) (CLASSNAME + "***** Begining Inside the triggers POST_CREATE_PERSIST ***** " ));
                //LOGGER.debug((Object) (CLASSNAME + "***** POST_CREATE_PERSIST ***** "+obj.getType() ));
		}
		
		if (!TRCCache.isInitialized()) 
			TRCCache.refresh();
		TriggerService.callHttpService("CREATE",obj);
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	 * @throws ParseException 
	 * @throws IOException 
	*/
	public static void postUpdatePersist(WTObject obj)throws WTException, IOException, ParseException
	{
		//if (LOGGER.isDebugEnabled())
		//{
                //LOGGER.debug((Object) (CLASSNAME + "***** Begining Inside the triggers POST_UPDATE_PERSIST ***** " ));
                //LOGGER.debug((Object) (CLASSNAME + "***** POST_UPDATE_PERSIST ***** "+obj.getType() ));
		//}
		AppUtil util = new AppUtil();
		if (!TRCCache.isInitialized()) 
			TRCCache.refresh();
		String objectType=obj.getType();
		Collection flexObjects = util.getFlexLinkObjects();
		boolean found = flexObjects.contains(objectType);
		if(!found)
			TriggerService.callHttpService("UPDATE",obj);
	}

	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	 * @throws ParseException 
	 * @throws IOException 
	*/
	public static void preUpdatePrimarycontentPersist(WTObject obj)throws WTException, IOException, ParseException
	{
	//if (LOGGER.isDebugEnabled())
		{
                //LOGGER.debug((Object) (CLASSNAME + "***** Begining Inside the triggers PRE_UPDATE_PRIMARYCONTENT_PERSIST ***** " ));
                //LOGGER.debug((Object) (CLASSNAME + "***** PRE_UPDATE_PRIMARYCONTENT_PERSIST ***** "+obj.getType() ));
		}
		if (!TRCCache.isInitialized()) 
			TRCCache.refresh();
		TriggerService.callHttpService("PRE_UPDATE_PRIMARYCONTENT_PERSIST",obj);
		
	}
	/**
	* This method is called when configured trigger is fired from FlexPLM application,
	* @param WTObject obj
	 * @throws ParseException 
	 * @throws IOException 
	*/
	public static void postUpdatePrimarycontentPersist(WTObject obj)throws WTException, IOException, ParseException
	{
		//if (LOGGER.isDebugEnabled())
		{
                //LOGGER.debug((Object) (CLASSNAME + "***** Begining Inside the triggers POST_UPDATE_PRIMARYCONTENT_PERSIST ***** " ));
                //LOGGER.debug((Object) (CLASSNAME + "***** POST_UPDATE_PRIMARYCONTENT_PERSIST ***** "+obj.getType() ));
		}
		if (!TRCCache.isInitialized()) 
			TRCCache.refresh();
		TriggerService.callHttpService("POST_UPDATE_PRIMARYCONTENT_PERSIST",obj);
		
	}
}