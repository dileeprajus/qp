/*
 * Created on 06/05/2017
 *
 * Mtuity, Inc. All rights reserved. 
 *
 * This document is confidential
 * information and may contain proprietary information and/or trade
 * secrets of Mtuity, Inc. and may not be distributed without
 * prior written authorization.
 */

package cdee.web.controller;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.DELETE;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.Response;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import com.google.gson.Gson;
import wt.util.WTException;
import cdee.web.services.insert.CreateFlexService;
import cdee.web.services.update.UpdateFlexService;
import cdee.web.services.delete.DeleteFlexService;
import org.json.simple.JSONArray;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import cdee.web.util.AppUtil;
import cdee.web.model.material.MaterialModel;
import cdee.web.exceptions.*;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Contact;
import io.swagger.annotations.Info;
import io.swagger.annotations.License;
import io.swagger.annotations.SwaggerDefinition;
import io.swagger.annotations.Tag;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import wt.log4j.LogR;
////import org.apache.log4j.Logger;

@SwaggerDefinition(info = @Info(description = "This is a sample server", version = "1.0.0", title = "Swagger Sample Servlet", termsOfService = "http://swagger.io/terms/", contact = @Contact(name = "Sponge-Bob", email = "apiteam@swagger.io", url = "http://swagger.io"), license = @License(name = "Apache 2.0", url = "http://www.apache.org/licenses/LICENSE-2.0.html")), consumes = {
		"application/json", "application/xml" }, produces = { "application/json",
				"application/xml" }, schemes = { SwaggerDefinition.Scheme.HTTP, SwaggerDefinition.Scheme.HTTPS })

@Api(value = "/cdee", tags = { "Thingworx Retail Connector Services" })
//initial path of rest api
@Path("/cdee")

public class FlexObjectsController {
//	//private static final Logger LOGGER = LogR.getLogger(FlexObjectsController.class.getName());
  //  //private static final String CLASSNAME = FlexObjectsController.class.getName();

	public String message = "Deleted Successfully";
	public int statusCode = 200;
	CreateFlexService createFlexService = new CreateFlexService();
	UpdateFlexService updateFlexService = new UpdateFlexService();
	DeleteFlexService deleteFlexService = new DeleteFlexService();
	Gson gson = new Gson();
	JSONParser parser = new JSONParser();
	AppUtil util = new AppUtil();

	/**
	 * @description This Method is used to insert records of given type
	 * @method POST
	 * @Param headers
	 * @Param jsonString
	 * @return {Response}
	 */

	@ApiOperation(httpMethod = "POST", value = "Create or Update FlexPLM Objects", notes = "Enables the create or update of FlexPLM objects. <br>Example: Create Material<br>{  \"search\":{<br>     \"ptcmaterialName\": \"0  Test Material::10000\"<br>},<br>\"typePricingMode\": \"1.0\",<br>\"payload\":{<br>\"typeId\":\"VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:294841\",<br>\"typePricingMode\": \"1.0\",<br>\"materialStatus\": \"concept\",<br>\"developmentDivision\": \"Apparel\",<br>\"materialPricingMode\": \" \",<br>\"sizesOfferedUOM\": \" \",<br>\"vrdWidth\": 72,<br>\"vrdWeightUOM\": \" \",<br>\"colorPatternApplication\": [],<br>\"vrdWalesCoarse\": \"\",<br>\"IDA2A2\": \"2485485\",<br>\"fabricColorLead\": \" \",<br>\"mobMaterailSupplierComments\": \"\",<br>\"flexName\": \"Material\",<br>\"vrdMaterialSize\": \"\",<br>\"higgIndexTable\": \"\",<br>\"vrdYarnCountSize\": \"\",<br>\"sizesOffered\": [],<br>\"developmentSeason\": \" \",<br>\"gauge\": \" \",<br>\"materialStructure\": \"acetateLining\",<br>\"unitOfMeasure\": \"sqyd\",<br>\"typeColorControlled\": \"0.0\",<br>\"hierarchyName\": \"Knit\",<br>\"dyeType\": \" \",<br>\"materialContent\": [\"100.0% acrylic\"],<br>\"materialCategory\": \"knit\",<br>\"materialColorControlled\": \"0\",<br>\"marketName\": \"Test Material::10000\",<br>\"colorOptions\": [],<br>\"vrdWidthUOM\": \"in\",<br>\"vrdFinish\": \" \",<br>\"vrdWeight\": 0,<br>\"alternatives\": \"\",<br>\"dyePrintProcess\": \" \",<br>\"comment\": \"\",<br>\"targetMaterialPrice\": 0,<br>\"matteShiney\": \" \"<br>}<br>}<br>}<br><br>For valid \"objectType\" (header param) value, refer to /cdee/getFlexObjects endpoint.", response = org.json.simple.JSONObject.class)
	@ApiResponses({
			@io.swagger.annotations.ApiResponse(code = 200, message = "Success", response = org.json.simple.JSONObject.class),
			@io.swagger.annotations.ApiResponse(code = 404, message = "Invalid uri"),
			@io.swagger.annotations.ApiResponse(code = 500, message = "Unexpected error") })
	@ApiImplicitParams({
			@io.swagger.annotations.ApiImplicitParam(name = "CSRF_NONCE", value = "The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required = true, dataType = "string", paramType = "header"),
			@io.swagger.annotations.ApiImplicitParam(name = "objectType", value = "FlexPLM Object", required = true, dataType = "string", paramType = "header") })

	@POST
	@Path("/createFlexObject")
	@Produces("application/json")
	@Consumes("application/json")
	public Response createOrUpdateFlexObject(@Context HttpHeaders headers, String jsonString)
			throws WTException, Exception {
		// public Response createOrUpdateFlexObject(HttpHeaders headers,String
		// jsonString) throws WTException,Exception{
		////if (LOGGER.isDebugEnabled())
       //        //LOGGER.debug((Object) (CLASSNAME + "***** createOrUpdateFlexObject hit with CSRF_NONCE "+headers.getRequestHeader("CSRF_NONCE") ));
		JSONObject responseObject = new JSONObject();
		JSONObject jsonObject = new JSONObject();
		String type = "";
		String oid = null;
		JSONObject exObject = new JSONObject();
		try {
			if ((jsonString != null) && !("".equalsIgnoreCase(jsonString))) {
				jsonObject = (JSONObject) parser.parse(jsonString);
			} else {
				throw new InputValidationException("Enter a valid Input in the body");
			}
			type = headers.getRequestHeader("objectType").get(0);
			if (type != null) {
				JSONObject response = createFlexService.createOrUpdateFlexObject(type, oid, jsonObject);
				responseObject.put(type, response);
			} else {
				throw new HeaderNotFoundException("Enter a Header ObjectType");
			}
		} catch (InputValidationException Ie) {
			exObject = util.getExceptionJson(Ie.getMessage());
			return Response.status(400).entity(gson.toJson(exObject)).build();
		} catch (HeaderNotFoundException he) {
			exObject = util.getExceptionJson(he.getMessage());
			return Response.status(400).entity(gson.toJson(exObject)).build();
		} catch (Exception e) {
			exObject = util.getExceptionJson(e.getMessage());
			return Response.status(400).entity(gson.toJson(exObject)).build();
		}
		return Response.status(200).entity(gson.toJson(responseObject)).build();
	}

	/**
	 * @description This Method is used to update records of given oid
	 * @method POST
	 * @Param oid {contains oid information}
	 * @Param headers
	 * @Param updateJson(JSON){contains inserted record attributes information}
	 * @return {Response}
	 */

	@ApiOperation(httpMethod = "POST", value = "Update Objects based on OID (Deprecated method)", notes = "Deprecated method", response = org.json.simple.JSONObject.class)
	@ApiResponses({
			@io.swagger.annotations.ApiResponse(code = 200, message = "Success", response = org.json.simple.JSONObject.class),
			@io.swagger.annotations.ApiResponse(code = 404, message = "Invalid uri"),
			@io.swagger.annotations.ApiResponse(code = 500, message = "Unexpected error") })
	@ApiImplicitParams({
			@io.swagger.annotations.ApiImplicitParam(name = "CSRF_NONCE", value = "The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required = true, dataType = "string", paramType = "header"),
			@io.swagger.annotations.ApiImplicitParam(name = "objectType", value = "FlexPLM Object", required = true, dataType = "string", paramType = "header") })
	@POST
	@Path("/updateFlexObject/{oid}")
	@Produces("application/json")
	public Response updateFlexObjects(@PathParam("oid") String oid, @Context HttpHeaders headers, String updateJson)
			throws FlexObjectNotFoundException, WTException {
		//if (LOGGER.isDebugEnabled())
            //   //LOGGER.debug((Object) (CLASSNAME + "***** updateFlexObjects hit with CSRF_NONCE "+headers.getRequestHeader("CSRF_NONCE") ));

		Gson gson = new Gson();
		JSONObject responseObject = new JSONObject();
		JSONObject exObject = new JSONObject();
		try {
			String type = headers.getRequestHeader("objectType").get(0);
			if (type != null && type != "") {
				responseObject = updateFlexService.updateFlexObjects(oid, type, updateJson);
			} else {
				throw new HeaderNotFoundException("Enter a valid FlexObject");
			}
		} catch (FlexTypeNotFoundException fte) {
			exObject = util.getExceptionJson(fte.getMessage());
			return Response.status(400).entity(gson.toJson(exObject)).build();
		} catch (FlexObjectNotFoundException fe) {
			exObject = util.getExceptionJson(fe.getMessage());
			return Response.status(400).entity(gson.toJson(exObject)).build();
		} catch (HeaderNotFoundException he) {
			exObject = util.getExceptionJson(he.getMessage());
			return Response.status(400).entity(gson.toJson(exObject)).build();
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return Response.status(200).entity(gson.toJson(responseObject)).build();
	}

	/**
	 * @description This Method is used to delete the Flex object for the given oid
	 * @method DELETE
	 * @Param oid
	 * @Param headers
	 * @return {Response}
	 */

	@ApiOperation(httpMethod = "DELETE", value = "Delete Objects based on OID ", notes = "Delete Objects using OID", response = org.json.simple.JSONObject.class)
	@ApiResponses({
			@io.swagger.annotations.ApiResponse(code = 200, message = "Success", response = org.json.simple.JSONObject.class),
			@io.swagger.annotations.ApiResponse(code = 404, message = "Invalid uri"),
			@io.swagger.annotations.ApiResponse(code = 500, message = "Unexpected error") })
	@ApiImplicitParams({
			@io.swagger.annotations.ApiImplicitParam(name = "CSRF_NONCE", value = "The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required = true, dataType = "string", paramType = "header"),
			@io.swagger.annotations.ApiImplicitParam(name = "objectType", value = "FlexPLM Object", required = true, dataType = "string", paramType = "header") })
	@DELETE
	@Path("/deleteFlexObject/{oid}")
	@Produces("application/json")
	public Response deleteFlexObject(@PathParam("oid") String oid, @Context HttpHeaders headers) throws Exception {
		//if (LOGGER.isDebugEnabled())
              // //LOGGER.debug((Object) (CLASSNAME + "***** deleteFlexObject hit with CSRF_NONCE "+headers.getRequestHeader("CSRF_NONCE") ));
		JSONObject responseObject = new JSONObject();
		try {
			String type = headers.getRequestHeader("objectType").get(0);
			responseObject = deleteFlexService.deleteFlexObjects(type, oid);
		} catch (Exception e) {
			responseObject = util.getExceptionJson(e.getMessage());
		}
		return Response.status((int) responseObject.get("statusCode")).entity(gson.toJson(responseObject)).build();
	}
}