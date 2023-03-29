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
import com.lcs.wc.util.VersionHelper;
import com.ptc.rfa.rest.utility.PersistableUtility;
import wt.fc.Persistable;
import wt.folder.Folder;
import wt.locks.LockHelper;
import wt.locks.Lockable;
import wt.util.WTException;
import wt.vc.wip.CheckoutLink;
import wt.vc.wip.WorkInProgressHelper;
import wt.vc.wip.WorkInProgressService;
import wt.vc.wip.Workable;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;


public class VersionHelperUtil{
    //private static final Logger LOGGER = LogR.getLogger(VersionHelperUtil.class.getName());
    //private static final String CLASSNAME = VersionHelperUtil.class.getName();

	public boolean validateCheckInOutObjectType (String objectType){
		if(objectType.equals("BOM") || objectType.equals("Document"))
			return true;
		else
			return false;
	}


	public boolean validateCheckInOutAction (String action){
		if(action.equals("CheckIn") || action.equals("CheckOut") || action.equals("UndoCheckOut"))
			return true;
		else
			return false;
	}
	
public static Persistable checkOut(String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** checkOut" ));
        Persistable persistable = null;
        if (FormatHelper.hasContent((String)oid)) {
            PersistableUtility persistableUtility = new PersistableUtility();
            persistable = persistableUtility.getPersistable(oid);
        } else {
        	throw new Exception ("Oid is Null");
        }
        if (persistable == null) {
            return null;
        }        

        boolean needToCheckout = true;
        if (VersionHelper.isCheckedOut((Workable)((Workable)persistable))) {
        	needToCheckout = false;
        }

        if (needToCheckout) {
            Folder checkoutFolder = WorkInProgressHelper.service.getCheckoutFolder();
            WorkInProgressHelper.service.checkout((Workable)persistable, checkoutFolder, "CheckOut");
        }
        if (VersionHelper.isWorkingCopy((Workable)((Workable)persistable))) {
            return persistable;
        }
        return WorkInProgressHelper.service.workingCopyOf((Workable)persistable);
    }

    public static Persistable checkIn(String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** checkIn" ));
        Persistable persistable = null;
        if (FormatHelper.hasContent((String)oid)) {
            PersistableUtility persistableUtility = new PersistableUtility();
            persistable = persistableUtility.getPersistable(oid);
        }else{
        	throw new Exception ("Oid is Null");
        }

        if (persistable == null) {
            return null;
        }
        if (!WorkInProgressHelper.isCheckedOut((Workable)((Workable)persistable))) {
            throw new Exception ("Object is not Checked Out");
        }
        return WorkInProgressHelper.service.checkin((Workable)persistable, "");
    }

    public static Persistable undoCheckOut(String oid) throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** undoCheckOut" ));
        Persistable persistable = null;
        if (FormatHelper.hasContent((String)oid)) {
            PersistableUtility persistableUtility = new PersistableUtility();
            persistable = persistableUtility.getPersistable(oid);
        }
        else{
        	throw new Exception ("Oid is Null");
        }

        if (persistable == null) {
            return null;
        }

        if (WorkInProgressHelper.isCheckedOut((Workable)((Workable)persistable))) 
        {
        	return WorkInProgressHelper.service.undoCheckout((Workable)persistable);
        }
        else
        {
        	throw new Exception ("Object is not CheckOut");
        }
    }



}