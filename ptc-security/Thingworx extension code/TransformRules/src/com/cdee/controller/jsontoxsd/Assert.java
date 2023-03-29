package com.cdee.controller.jsontoxsd;

/**
 * 
 * @author mha
 */
public class Assert
{
	public static void isTrue(boolean expression, String message)
	{
		if (! expression)
		{
			throw new IllegalArgumentException(message);
		}
	}
	
	public static void notNull(Object obj, String message)
	{
		if (obj == null)
		{
			throw new IllegalArgumentException(message);
		}
	}
}
