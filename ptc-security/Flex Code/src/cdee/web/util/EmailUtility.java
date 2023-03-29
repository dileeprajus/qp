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

import java.io.IOException;
import java.util.Date;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
//import org.apache.log4j.Logger;
import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.LCSProperties;
import wt.log4j.LogR;
import wt.util.WTException;
import wt.util.WTProperties;

public final class EmailUtility {

	private EmailUtility() {
	}

	//private static final Logger LOGGER = LogR.getLogger(EmailUtility.class.getName());
  	//private static final String CLASSNAME = EmailUtility.class.getName();

	private static final String TAGBAR = "<br>";
	private static final String FLEX_ERROR_UNKNOWN_ERROR = "Flex Error: Unknown Error";
	private static final String MAIL_SMTP_HOST = "mail.smtp.host";

	public static void sendMail(String mailSubject, String mailBody) throws WTException, IOException {
		//if (LOGGER.isDebugEnabled())
    	         //LOGGER.debug((Object) (CLASSNAME + "***** sendMail " ));
		String messageBody = "";
		Message msg;
		Multipart multipart;
		MimeBodyPart messageBodyPart;
		String fromEmailid = LCSProperties.get("TRC.email.fromEmailId", "admin@admin.com");
		String toEmailid = LCSProperties.get("TRC.email.toEmailId", "admin@admin.com");
		String smtpHost = WTProperties.getLocalProperties().getProperty("wt.mail.mailhost");
		Properties props = new Properties();
		props.put(MAIL_SMTP_HOST, smtpHost);
		Session session = Session.getDefaultInstance(props, null);
		WTProperties wtproperties = WTProperties.getLocalProperties();
		String hostName = wtproperties.getProperty("wt.rmi.server.hostname");
		String protcol = wtproperties.getProperty("wt.webserver.protocol");
		String env = "FlexPLM Server : ";
		if (com.lcs.wc.util.FormatHelper.hasContent(hostName) && com.lcs.wc.util.FormatHelper.hasContent(protcol)) {
			env = env + protcol + "://" + hostName;
		}

		if (!FormatHelper.hasContent(mailSubject)) {
			mailSubject = FLEX_ERROR_UNKNOWN_ERROR;
		}

		if (FormatHelper.hasContent(mailBody)) {
			messageBody += TAGBAR + mailBody + TAGBAR;
		}

		if (FormatHelper.hasContent(env)) {
			messageBody += TAGBAR + env;
		}

		try {
			msg = new MimeMessage(session);
			msg.setFrom(new InternetAddress(fromEmailid));
			msg.addRecipient(Message.RecipientType.TO, new InternetAddress(toEmailid));
			msg.setSubject(mailSubject);
			msg.setSentDate(new Date());
			multipart = new MimeMultipart();
			messageBodyPart = new MimeBodyPart();
			messageBodyPart.setContent(messageBody, "text/html; charset=utf-8");
			multipart.addBodyPart(messageBodyPart);
			msg.setContent(multipart);
			Transport.send(msg);
		} catch (MessagingException exp) {
			throw new WTException("Unable to Connect to Email Server. Subject:" + mailSubject + "+\nBody:+" + mailBody
					+ "\n\n Exception:" + exp);
		}
	}
}