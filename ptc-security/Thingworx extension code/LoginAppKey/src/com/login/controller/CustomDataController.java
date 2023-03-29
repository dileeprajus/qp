package com.login.controller;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.json.JSONException;
import org.json.simple.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;


@Path("/dataServices")
public class CustomDataController {
	
	


	@POST
	  @Produces({"application/json"})
	  @Path("/login")
	  public Response getAppKey(JSONObject json)
	    throws IOException, JSONException
	  {
	    RestTemplate restTemplate = new RestTemplate();
	    HttpHeaders headers = new HttpHeaders();
	    List<MediaType> mtArray = Arrays.asList(new MediaType[] { MediaType.APPLICATION_JSON });
	    String userPass = json.get("userId") + ":" + json.get("password");
	    String authHeaderValue = "Basic " + Base64.getEncoder().encodeToString(userPass.getBytes());
	    headers.add("Authorization", authHeaderValue);
	    headers.setAccept(mtArray);
	    headers.setContentType(MediaType.APPLICATION_JSON);
	    HttpEntity<String> entity = new HttpEntity(headers);
	    String hostName = "http://localhost";
	    if (json.containsKey("hostName")) {
	      hostName = json.get("hostName").toString().replace("\\/", "/");
	    }
	    String url = hostName + "/Thingworx/ApplicationKeys/PTC/Services/GetKeyID";
	    String response = "";
	    try
	    {
	      response = (String)restTemplate.postForObject(url, entity, String.class, new Object[0]);
	    }
	    catch (HttpClientErrorException ex)
	    {
	      response = ""+ex.getStatusCode();
	    }
	    System.out.println(response + "......");
	    return Response.status(Response.Status.OK).entity(response).build();
	  }
	}