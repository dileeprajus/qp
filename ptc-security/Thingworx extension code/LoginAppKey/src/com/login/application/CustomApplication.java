package com.login.application;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.core.Application;

import com.login.controller.CustomDataController;

public class CustomApplication extends Application {

	private Set <Object> singletons = new HashSet <Object>();

	public CustomApplication () {
		singletons.add(new CustomDataController());
	}

	@Override
	public Set <Object> getSingletons () {
		return singletons;
	}

}
