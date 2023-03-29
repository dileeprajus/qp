/* Copyright(C) 2015-2018 - Quantela Inc 
 * All Rights Reserved
 * Unauthorized copying of this file via any medium is strictly prohibited
 * See LICENSE file in the project root for full license information*/
package com.cdee.util;

import java.security.MessageDigest;
import org.slf4j.Logger;
import com.thingworx.logging.LogUtilities;
import java.security.Key;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class UtilServices {
	private static final String ALGO = "AES";
	
	public static Logger _logger = LogUtilities.getInstance().getApplicationLogger(UtilServices.class);
	 public String encryptSHAH(String inputData)throws Exception
	    {
	    	//String password = inputData ;
		 	//_logger.warn("InputData for encryptSHAH : "+inputData);
	        MessageDigest md = MessageDigest.getInstance("SHA-256");
	        md.update(inputData.getBytes());
	        
	        byte byteData[] = md.digest();
	 
	        //convert the byte to hex format method 1
	        StringBuffer sb = new StringBuffer();
	        for (int i = 0; i < byteData.length; i++) {
	         sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
	        }
	     
	       // System.out.println("Hex format : " + sb.toString());
	        _logger.warn("Hex format : "+sb.toString());
	    	
	    	return sb.toString();
	    }
	 
	    /**
	     * Encrypt a string with AES algorithm.
	     *
	     * @param data is a string
	     * @return the encrypted string
	     */
	    public static String encrypt(String data,String secretKey) throws Exception {
	        Key key = generateKey(secretKey);
	        Cipher c = Cipher.getInstance(ALGO);
	        c.init(Cipher.ENCRYPT_MODE, key);
	        byte[] encVal = c.doFinal(data.getBytes());
	        return Base64.getEncoder().encodeToString(encVal);
	    }

	    /**
	     * Decrypt a string with AES algorithm.
	     *
	     * @param encryptedData is a string
	     * @return the decrypted string
	     */
	    public static String decrypt(String encryptedData,String secretKey) throws Exception {
	        Key key = generateKey(secretKey);
	        Cipher c = Cipher.getInstance(ALGO);
	        c.init(Cipher.DECRYPT_MODE, key);
	        byte[] decordedValue = Base64.getDecoder().decode(encryptedData);
	        byte[] decValue = c.doFinal(decordedValue);
	        return new String(decValue);
	    }

	    /**
	     * Generate a new encryption key.
	     */
	    private static Key generateKey(String algorithmKey) throws Exception {
	        return new SecretKeySpec(algorithmKey.substring(0, 16).getBytes(), ALGO);
	    }

}
