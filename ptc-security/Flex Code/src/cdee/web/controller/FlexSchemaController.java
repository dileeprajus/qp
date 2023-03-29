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


import org.json.simple.JSONArray;
import cdee.web.services.schema.CreateFlexSchemaService;
import cdee.web.util.AppUtil;
import cdee.web.util.TRCCache;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.DELETE;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import com.google.gson.Gson;
import wt.util.WTException;
import org.json.simple.JSONArray;
import java.util.Iterator;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.File;
import java.io.FileOutputStream;

import wt.util.WTProperties;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import cdee.web.model.bom.*;
import cdee.web.model.product.*;
import com.lcs.wc.flextype.FlexTypeCache;
import java.util.*;
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
import io.swagger.annotations.ApiParam;
import cdee.web.util.VersionHelperUtil;
import java.io.IOException;
import java.io.PrintWriter;
import cdee.web.services.GenericObjectService;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.HeaderParam;

import com.lcs.wc.util.FormatHelper;
import com.lcs.wc.util.LCSProperties;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import cdee.web.upload.UploadService;
import javax.ws.rs.core.Response.ResponseBuilder;  
import cdee.web.upload.DownLoadService;  
import cdee.web.upload.FileItem;
//import org.apache.log4j.Logger;
import wt.log4j.LogR;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.core.MultivaluedMap;
import wt.log4j.LogR;
//import org.apache.log4j.Logger;
import com.google.gson.GsonBuilder;
import com.ptc.core.common.model.Item;
import com.ptc.core.common.model.ItemList;
import com.ptc.core.appsec.CSRFProtector;
import wt.servlet.ServletState;
import org.apache.commons.io.IOUtils;

@SwaggerDefinition(
        info = @Info(
                description = "This is a sample server",
                version = "1.0.0",
                title = "Swagger Sample Servlet",
                termsOfService = "http://swagger.io/terms/",
                contact = @Contact(name = "Sponge-Bob", email = "apiteam@swagger.io", url = "http://swagger.io"),
                license = @License(name = "Apache 2.0", url = "http://www.apache.org/licenses/LICENSE-2.0.html")
        ),
        consumes = {"application/json", "application/xml"},
        produces = {"application/json", "application/xml"},
        schemes = {SwaggerDefinition.Scheme.HTTP, SwaggerDefinition.Scheme.HTTPS}
)

@Api(value="/cdee", tags={"Thingworx Retail Connector Services"})
//initial path of rest api
@Path("/cdee")
public class FlexSchemaController {

    //private static final Logger LOGGER = LogR.getLogger(FlexSchemaController.class.getName());
    //private static final String CLASSNAME = FlexSchemaController.class.getName();
    CreateFlexSchemaService schemaService = new CreateFlexSchemaService();
    AppUtil appUtil = new AppUtil();
    Gson gson = new Gson();

  
    /**
     * @description This Method is used to get the flexObjects of through out
     *              application.
     * @method GET
     * @return String It returns flexObjects
     */

    
    @ApiOperation(httpMethod = "GET", value = "Get the List of all the objects supported by TRC", notes="Returns the list of objects supported by TRC. This API is used for FlexPLM end point configuration in TRC UI only.", response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
    @GET
    @Path("/getFlexObjects")
    @Produces({ MediaType.APPLICATION_JSON })   
    
    public String getFlexObjects() throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** getFlexObjects :" ));
        return schemaService.getFlexObjects();
    }

    /**
     * @description This Method is used to get the tree formated Hierarchy of
     *              given FlexObject
     * @method POST
     * @Param inputJson contains array of flexObjects
     * @return String {It returns tree typed Hierarchy of each FlexObject}
     */
    
    @ApiOperation(httpMethod = "POST", value = "Get the SubType Hierarchy for FlexPLM Object(s)", notes="Returns the Subtype Hierarchy for the FlexPLM Object(s). This API is used for FlexPLM end point configuration in TRC UI.<br> <br>Example: To get information for single Object.<br> {\n<br>\t\"inputs\": [\"Material\"]<br>\n}<br><br> Example: To get information for multiple Objects.<br> {\n<br>\t\"inputs\": [\"Material\",\"Color\"]<br>\n}<br><br> To get the list of FlexPLM objects, refer to /cdee/getFlexObjects endpoint.",  response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
    
    @POST
    @Path("/getFlexTypeHierarchy")
    @Consumes("application/json")
    @Produces("application/json")

    
    public String getFlexTypeHierarchy(String inputJson) throws InputValidationException,Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** getFlexTypeHierarchy " ));
        String response = "";
        JSONObject exceptionObject = new JSONObject();
        try{
            if((inputJson!=null) && !("".equalsIgnoreCase(inputJson))){
               response =  schemaService.getFlexTypeHierarchy(inputJson);
            }else{
                throw new InputValidationException("Enter a valid Input in the body");
            }
        }catch(InputValidationException Ie){
            exceptionObject = appUtil.getExceptionJson(Ie.getMessage());
            response = gson.toJson(exceptionObject);
        }catch(FlexObjectNotFoundException fe){
            exceptionObject = appUtil.getExceptionJson(fe.getMessage());
            response = gson.toJson(exceptionObject);
        }catch(JSONArrayNotFoundException je){
            exceptionObject = appUtil.getExceptionJson(je.getMessage());
            response = gson.toJson(exceptionObject);
        }catch(Exception e){
            exceptionObject = appUtil.getExceptionJson(e.getMessage());
            response = gson.toJson(exceptionObject);
        }
        return response;
    }

    /**
     * @description This Method is used to get the schema of typeId given in the schemaJson
     * @method POST
     * @Param schemaJson {contains flexOject anf typeId}
     * @return String {get the schema of given typeId}
     */
  
    @ApiOperation(httpMethod = "POST", value = "Get the FlexSchema for FlexPLM Object", notes="Returns the FlexPLM Schema (attribute information) for the FlexPLM Object. This API is used for FlexPLM end point configuration in TRC UI. <br><br> Example : Material <br> {\n \"inputs\": [\n   {\n     \"flexObject\": \"Material\",\n     \"typeId\": \"VR:com.ptc.core.meta.type.mgmt.server.impl.WTTypeDefinition:76596\"\n   }\n  ]\n}<br><br> For FlexObject Valid values, refer to /cdee/getFlexObjects endpoint. ",  response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=400, message="Failure", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @POST
    @Path("/getFlexSchema")
    @Consumes("application/json")
    @Produces("application/json")
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})

    public String getFlexSchema(String schemaJson) throws Exception {
         //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** getFlexSchema " ));
        String response = "";
        JSONObject exceptionObject = new JSONObject();
        try{
            if((schemaJson!=null) && !("".equalsIgnoreCase(schemaJson))){
                response = schemaService.getFlexSchema(schemaJson);
            }else{
                throw new InputValidationException("Enter a valid Input");
            }
        }catch(InputValidationException Ie){
            exceptionObject = appUtil.getExceptionJson(Ie.getMessage());
            response = gson.toJson(exceptionObject);
        }catch(WTException we){
            exceptionObject = appUtil.getExceptionJson(we.getMessage());
            response = gson.toJson(exceptionObject);
        }catch(Exception e){
            exceptionObject = appUtil.getExceptionJson(e.getMessage());
            response = gson.toJson(exceptionObject);
        }
        return response;
    }

    /**
     * @description This Method is used to get the reference object list
     * @method POST
     * @Param inputJson contains array of flexObjects
     * @return String
     */
    @POST
    @Path("/getRefObjList")
    @Consumes("application/json")
    @Produces("application/json")
    public String getRefObjList(String inputJson,@HeaderParam("CSRF_NONCE") String csrfKey) throws Exception {
        return schemaService.getRefObjList(inputJson);
    }

    

    /**
     * @description This Method is used to get the schema of typeId given in the schemaJson
     * @method POST
     * @Param schemaJson {contains flexOject anf typeId}
     * @return String {get the schema of given typeId}
     */
    @POST
    @Path("/getFlexSchemaInfo")
    @Produces("application/json")
    public String getFlexSchemaInfo(String schemaJson,@HeaderParam("CSRF_NONCE") String csrfKey) throws Exception {
        return schemaService.getFlexSchemaInfo(schemaJson);
    }

    /**
     * @description This method is used to get the flex object records with all associations of given type
     * @method POST
     * @Param schemaJson {contains flexOject or oid,attributes,includes informtion}
     * @return String {get the flex object records with all associations of given type}
     */

    @POST
    @Path("/getFlexObjectAssociations")
    @ApiOperation(httpMethod = "POST", value = "Get the Associated objects for FlexPLM object", notes="Returns the Associated objects for the FlexPLM Object. This returns the parent object attributes as well as associated object information. <br><br>Example : Get Material Supplier information for Material. <br> {\"inputs\": [  {    \"Material\": {      \"oid\": \"VR:com.lcs.wc.material.LCSMaterial:975543\",      \"fromIndex\": \"0\",      \"includes\": {        \"Material Supplier\": {        }      }    }  }]} <br><br>Example : Get Product Component information for Product.  <br>{\"inputs\":[{\"Product\":{\"oid\":\"VR:com.lcs.wc.product.LCSProduct:1418643\",\"fromIndex\":\"0\",\"includes\":{\"Colorway\":{},\"Product Season Link\":{},  \"Season\":{}, \"Sourcing Configuration\":{}}}}]} <br><br>Example : Get FlexPLM BOM including BOM link attributes for Product.  <br>{\"inputs\":[{\"Product\":{\"oid\":\"VR:com.lcs.wc.product.LCSProduct:1418643\",\"fromIndex\":\"0\",\"includes\":{\"BOM\":{\"includes\":{\"BOM Link\":{}}}}}}]}<br><br>Supported Associations for \"Product\" :  \"Season\",\"Sourcing Configuration\",\"BOM\",\"Cost Sheet\",\"Measurements\",\"Plan\",\"Product Destination\",\"Size Category\",\"Size Definition\",\"Colorway\",\"Specification\",\"Product Season Link\",\"Sample\"<br><br>Supported Associations for \"Colorway\" :  \"Product\",\"Season\"<br><br>Supported Associations for \"Sourcing Configuration\" :  \"Product\",\"Colorway\",\"BOM\",\"Cost Sheet\"<br><br>Supported Associations for \"\"Sample :  \"Product\",\"Sourcing Configuration\",\"Specification\",\"Material\",\"Supplier\",\"Material Supplier\",\"Material Color\",\"Color\",\"Sample Request\"<br><br>Supported Associations for \"BOM\" :  \"Product\",\"BOM Link\"<br><br>Supported Associations for \"Measurement\" :  \"POM\"<br><br>Supported Associations for \"Specification\" :  \"Reference Document\"<br><br>Supported Associations for \"Test Specification\" :  \"Test Details\",\"Test Property\",\"Test Method\",\"Test Condition\",\"Test Standard\"<br><br>Supported Associations for \"Placeholder\" :  \"Product\"<br><br>Supported Associations for \"Material\" :  \"Material Supplier\",\"Material Color\",\"BOM\",\"Reference Document\",\"Palette\"<br><br>Supported Associations for \"Material Supplier\" :  \"Material\",Supplier\",\"Material Color\",\"BOM\"<br><br>Supported Associations for \"Material Color\" :  \"Material Pricing\",\"Sample\"<br><br>Supported Associations for \"Palette\" :  \"Material\",\"Color\",Material Color\",\"Material Supplier\",\"Season\",\"Sub Palette\"<br>",  response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=400, message="Failure", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @Consumes("application/json")
    @Produces("application/json")
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
    public String getFlexObjectAssociations(String schemaJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** getFlexObjectAssociations " ));
        String response = "";
        JSONObject exceptionObject = new JSONObject();
        try{
            if((schemaJson!=null) && !("".equalsIgnoreCase(schemaJson))){
                JSONObject obj = schemaService.getFlexObjectAssociations(schemaJson);
                //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** getFlexObjectAssociations controller obj. "+obj));
                response = gson.toJson(schemaService.getFlexObjectAssociations(schemaJson));
            }else{
                throw new InputValidationException("Enter a valid Input in the body");
            }
        }catch(JSONArrayNotFoundException jae){
            exceptionObject = appUtil.getExceptionJson(jae.getMessage());
            response = gson.toJson(exceptionObject);
        }catch(JSONObjectNotFoundException je){
            exceptionObject = appUtil.getExceptionJson(je.getMessage());
            response = gson.toJson(exceptionObject);
        }catch(InputValidationException Ie){
            exceptionObject = appUtil.getExceptionJson(Ie.getMessage());
            response = gson.toJson(exceptionObject);
        }catch(NullPointerException ne){
            exceptionObject = appUtil.getExceptionJson(ne.getMessage()+" :You are Entered a Empty JSONObject in the body");
            response = gson.toJson(exceptionObject);
        }catch(Exception e){
            exceptionObject = appUtil.getExceptionJson(e.getMessage());
            response = gson.toJson(exceptionObject);
        }
        return response;
    }

     /**
     * @description This method is used to get the Linked flexobject records with all associations of given oids
     * @method POST
     * @Param schemaJson {contains flexOject and oids}
     * @return String {get the Linked flexObject records with all associations of given type}
     */

    @POST
    @Path("/getFlexLinks")
    @ApiOperation(httpMethod = "POST", value = "Get the FlexPLM Link objects", notes="Returns the Link objects. <br><br>Example - Get Product Season Link based on Product and Season objects. <br>{<br>\"inputs\": [<br>{<br>\"Product Season Link\": {<br>\"productOid\":\"VR:com.lcs.wc.product.LCSProduct:977457\",<br>\"seasonOid\":\"VR:com.lcs.wc.season.LCSSeason:583430\"<br>}<br>}<br>]<br>}",  response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=400, message="Failure", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @Consumes("application/json")
    @Produces("application/json")
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
    public String getFlexLinks(String schemaJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** getFlexLinks " ));
        String response = "";
        JSONObject exceptionObject = new JSONObject();
        try{
            if((schemaJson!=null) && !("".equalsIgnoreCase(schemaJson))){
                response = schemaService.getFlexLinks(schemaJson);
            }else{
                throw new InputValidationException("Enter a valid Input in the body");
            }
        }catch(InputValidationException Ie){
            exceptionObject = appUtil.getExceptionJson(Ie.getMessage());
            response = gson.toJson(exceptionObject);
        }catch(Exception e){
            exceptionObject = appUtil.getExceptionJson(e.getMessage());
            response = gson.toJson(exceptionObject);
        }
        return response;
    }
 


    /**
     * @description This Method is used to get the records of
     *              given FlexObject to the given criteria
     * @method POST
     * @Param inputCriteria
     * @return Response {It returns the filtered records to the given criteria}
     */
    @POST
    @Path("/getRecordsData")
    @ApiOperation(httpMethod = "POST", value = "Search FlexPLM Objects using Attributes", notes="Search FlexPLM objects using OID or attributes. Note - Link objects are not supported by this method. <br><br> Example : Search Material using Material Hierarchy and attributes<br> {\n\"objectType\": \"Material\",\n\"attributes\": {\n \"typeHierarchyName\": \"Material\",\n \"vrdStatus\" : \"vrdApproved\",\n \"ptcmaterialName\": \"Aluminum*\"\n}\n}<br><br> Example : Search Material using attributes only<br> {\n\"objectType\": \"Material\",\n\"attributes\": {\n \"vrdStatus\" : \"vrdApproved\",\n \"ptcmaterialName\": \"Aluminum*\"\n}\n}<br><br> Example : Search Material without attributes <br> {\n\"objectType\": \"Material\"}<br><br>To get the list of FlexPLM objects, refer to /cdee/getFlexObjects endpoint.",  response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=400, message="Failure", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @Consumes("application/json")
    @Produces("application/json")
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
    public Response getRecordsData(String inputCriteria) throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** getRecordsData " ));

        int statusCode=200;
        JSONObject responseObject = new JSONObject();
        JSONObject payload=new JSONObject(); 
         try {
            if((inputCriteria!=null) && !("".equalsIgnoreCase(inputCriteria))){
                payload=(JSONObject)new JSONParser().parse(inputCriteria);
            }else{
                throw new InputValidationException("Enter a valid Input in the body");
            }
            String fromIndex = "0";
            String toIndex = "0";
            String mediaType=null;
            if (payload.containsKey("fromIndex")) {
                fromIndex = (String) payload.get("fromIndex");
            }
            if (payload.containsKey("toIndex")) {
                toIndex = (String) payload.get("toIndex");
            }
            if (payload.containsKey("mediaType")) {
                mediaType = (String) payload.get("mediaType");
            }
            if (payload.containsKey("attributes")) {
                JSONObject attributesObject = (JSONObject) payload.get("attributes");

                //Check for date creteria
                if ((attributesObject.containsKey("createDateFrom")|| attributesObject.containsKey("createDateTo") || attributesObject.containsKey("modifiedDateTo") || attributesObject.containsKey("modifiedDateFrom")) && payload.containsKey("objectType")) {
                    attributesObject = appUtil.getModifiedJson(attributesObject,(String) payload.get("objectType"));
                }
                
               
            }
            if (payload.containsKey("association")&& payload.containsKey("oid")&& payload.containsKey("objectType")) {
                responseObject = schemaService.getRecordByOid((String) payload.get("objectType"),(String) payload.get("oid"),(String) payload.get("association"),mediaType);
            } else if (payload.containsKey("oid")&& payload.containsKey("getPreviousIterationOid")) {
                responseObject = schemaService.getRecordByOid((String) payload.get("objectType"),(String) payload.get("oid"),((Boolean) payload.get("getPreviousIterationOid")).booleanValue(), mediaType);
            } else if (payload.containsKey("oid")&& payload.containsKey("objectType")) {
                responseObject = schemaService.getRecordByOid((String) payload.get("objectType"),(String) payload.get("oid"),mediaType);
            } else if (payload.containsKey("objectType")&& payload.containsKey("attributes")) {
                responseObject = schemaService.getRecords((String) payload.get("objectType"),(JSONObject) payload.get("attributes"), fromIndex,mediaType, toIndex);
            } else if (payload.containsKey("objectType")) {
                responseObject = schemaService.getRecords((String) payload.get("objectType"), null,fromIndex,mediaType,toIndex);
            } else if (payload.containsKey("objectType")) {
                responseObject = schemaService.getRecords((String) payload.get("objectType"), new JSONObject(),fromIndex,mediaType,toIndex);
            } else {
                responseObject=appUtil.getExceptionJson("Bad request");
                statusCode=400;
            }
        }catch(InputValidationException Ie){
            responseObject = appUtil.getExceptionJson(Ie.getMessage());
            statusCode=400;
        }catch (Exception e) {
            responseObject=appUtil.getExceptionJson(e.getMessage());
            statusCode=400;
        }
         if(responseObject.containsKey("statusCode")){
                statusCode=(int)responseObject.get("statusCode");
            }
            
        return Response.status(statusCode).entity(gson.toJson(responseObject)).build();
    }
   
    /**
     * @description This Method is used to set the configuration for triggers
     * @method POST
     * @Param inputJson contains the configuration for triggers in json format
     * @return Response {It returns the status of the api}
     */

    @POST
    @Path("triggerConfig")
    @ApiOperation(httpMethod = "POST", value = "Resource to save trigger configuration which is used as input for triggers", notes="This API is only used by TRC.",  response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=400, message="Failure", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @Consumes("application/json")
    @Produces("application/json")
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})    
    public Response triggerConfig(String inputJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** triggerConfig " ));

        JSONObject responseObject = new JSONObject();
        JSONParser parser = new JSONParser();
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        try {
            JSONObject inputJsonObject = (JSONObject) parser.parse(inputJson);
            try {
                String codebase = WTProperties.getServerProperties().getProperty("wt.codebase.location");
                String defaultFileLocation = codebase + File.separator + "rfa" + File.separator + "CDEE" + File.separator;
                String fileLocation = (String) LCSProperties.get("com.wc.cde.CDEE.trigger.location",defaultFileLocation);
                fileLocation = fileLocation  + "triggerConfig.json";
                FileReader fileRead = new FileReader(fileLocation);
                JSONArray fileObj = (JSONArray) parser.parse(fileRead);
                JSONArray fileWriteObject = new JSONArray();
                boolean objectFound = false;
                fileRead.close();
                Iterator itr = fileObj.iterator();
                while (itr.hasNext()) {
                    JSONObject singleObject = (JSONObject) itr.next();
                    String str1 = (String) singleObject.get("thing_name");
                    String str2 = (String) inputJsonObject.get("thing_name");
                    String base_url1 = (String) singleObject.get("base_url");
                    String base_url2 = (String) inputJsonObject.get("base_url");
                    
                    if (str1.equals(str2) && base_url1.equals(base_url2)) {
                        fileWriteObject.add(inputJsonObject);
                        objectFound = true;
                    } else {
                        fileWriteObject.add(singleObject);
                    }
                }
                if (!objectFound) {
                    fileWriteObject.add(inputJsonObject);
                }
                FileWriter file = new FileWriter(fileLocation);
                file.write("");
                file.flush();
                file.write(gson.toJson(fileWriteObject));
                file.flush();
                file.close();
                responseObject.put("Status", "Success");
                responseObject.put("Message", "Configuration Saved!");
                TRCCache.clearCache();
                TRCCache.refresh();
                return Response.status(200).entity(gson.toJson(responseObject)).build();
            } catch (Exception e) {
                //if (LOGGER.isDebugEnabled())
                    //LOGGER.debug((Object) (CLASSNAME + "***** Exception "+e.getMessage() ));
                responseObject.put("Status", "Failure");
                return Response.status(400).entity(gson.toJson(responseObject)).build();
            }
        } catch (Exception e) {
            responseObject.put("Status", "Failure");
            responseObject.put("Message", "Invalid Format!");
            return Response.status(400).entity(gson.toJson(responseObject))
                    .build();
        }
    }
    /**
     * @description This Method is used to set the configuration for triggers
     * @method POST
     * @Param inputJson contains the configuration for triggers in json format
     * @return Response {It returns the status of the api}
     */
    @POST
    @Path("resetTriggerBaseUrl")

    @ApiOperation(httpMethod = "POST", value = "Resource to save FlexPLM URL Change", notes="This API is only used by TRC.",  response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=400, message="Failure", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @Consumes("application/json")
    @Produces("application/json")
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})    

    public Response resetTriggerBaseUrl(String inputJson) throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** resetTriggerBaseUrl " ));

        JSONObject responseObject = new JSONObject();
        JSONParser parser = new JSONParser();
        Gson gson = new Gson();
        try {
            JSONObject inputJsonObject = (JSONObject) parser.parse(inputJson);
            try {

                String codebase = WTProperties.getServerProperties().getProperty("wt.codebase.location");
                //String fileLocation = codebase + File.separator + "rfa" + File.separator + "CDEE" + File.separator + "triggerConfig.json";
                String defaultFileLocation = codebase + File.separator + "rfa" + File.separator + "CDEE" + File.separator;
                String fileLocation = (String) LCSProperties.get("com.wc.Integration.CDEE.trigger.location",defaultFileLocation);
                fileLocation = fileLocation  + "triggerConfig.json";
                FileReader fileRead = new FileReader(fileLocation);
                JSONArray fileObj = (JSONArray) parser.parse(fileRead);
                JSONArray fileWriteObject = new JSONArray();
                boolean objectFound = false;
                fileRead.close();
                String oldBaseUrl = (String) inputJsonObject.get("oldBaseUrl");
                String newBaseUrl = (String) inputJsonObject.get("newBaseUrl");
                String thingTemplate = (String) inputJsonObject.get("thingTemplate");
                Iterator itr = fileObj.iterator();
                while (itr.hasNext()) {
                    JSONObject singleObject = (JSONObject) itr.next();
                    String baseUrl = (String) singleObject.get("base_url");
                    String thingTemplateInt = (String) singleObject.get("thingTemplate");
                    if(thingTemplate.equals(thingTemplateInt)){
                       if(baseUrl.indexOf(oldBaseUrl)!=-1? true: false){
                        baseUrl=baseUrl.replace(oldBaseUrl,newBaseUrl);
                        singleObject.remove("base_url");
                        singleObject.put("base_url",baseUrl);
                        } 
                    }
                    fileWriteObject.add(singleObject);
                }
                FileWriter file = new FileWriter(fileLocation);
                file.write("");
                file.flush();
                
                file.write(gson.toJson(fileWriteObject));
                file.flush();
                file.close();
                responseObject.put("Status", "Success");
                responseObject.put("Message", "Configuration Updated!");
                TRCCache.clearCache();
                TRCCache.refresh();
                return Response.status(200).entity(gson.toJson(responseObject)).build();
            } catch (Exception e) {
                responseObject.put("Status", "Failure");
                return Response.status(400).entity(gson.toJson(responseObject)).build();
            }
        } catch (Exception e) {
            responseObject.put("Status", "Failure");
            responseObject.put("Message", "Invalid Format!");
            return Response.status(400).entity(gson.toJson(responseObject))
                    .build();
        }
    }


    @POST
    @Path("versionHelper")
    @ApiOperation(httpMethod = "POST", value = "CheckIn/CheckOut Objects", notes="Check In/ Check Out / Undo CheckOut for BOM, Document",  response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=400, message="Failure", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @Consumes("application/json")
    @Produces("application/json")
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})



    public Response versionHelper(String inputCriteria) throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** versionHelper " ));

        int statusCode=200;
        JSONObject responseObject = new JSONObject();
        JSONObject payload=new JSONObject(); 
        VersionHelperUtil customVersionHelper = new VersionHelperUtil();
         try {
            if((inputCriteria!=null) && !("".equalsIgnoreCase(inputCriteria))){
                payload=(JSONObject)new JSONParser().parse(inputCriteria);
            }else{
                throw new InputValidationException("Enter a valid Input in the body");
            }
            
            if (payload.containsKey("objectType")) {
                if(!customVersionHelper.validateCheckInOutObjectType((String)payload.get("objectType"))){
                    throw new InputValidationException(payload.get("objectType")+" is not Valid for CheckIn/CheckOut ");
                }
            }

            if (payload.containsKey("action")) {
                if(!customVersionHelper.validateCheckInOutAction((String)payload.get("action"))){
                    throw new InputValidationException(payload.get("action")+" is not Valid action for "+payload.get("objectType"));
                }
            }

            if (payload.containsKey("objectType")&& payload.containsKey("oid")&& payload.containsKey("action")) {
                responseObject = GenericObjectService.getModelInstance((String) payload.get("objectType")).checkInOut((String) payload.get("oid"),(String) payload.get("action"));
                  // responseObject = GenericObjectService.getModelInstance(objectType).getFlexLinkInfo(objectType, rootObject,propertiesObject);                 
            } else {
                responseObject=appUtil.getExceptionJson("Bad request");
                statusCode=400;
            }
        }catch(InputValidationException Ie){
            responseObject = appUtil.getExceptionJson(Ie.getMessage());
            statusCode=400;
        }catch (Exception e) {
            responseObject=appUtil.getExceptionJson(e.getMessage());
            statusCode=400;
        }
         if(responseObject.containsKey("statusCode")){
                statusCode=(int)responseObject.get("statusCode");
            }
        return Response.status(statusCode).entity(gson.toJson(responseObject)).build();
    }

    @ApiOperation(httpMethod = "GET", value = "Clear TRC and Relation Cache", notes="Clears TRC and Relation Cache", response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
    @GET
    @Path("/clearTRCCache")
    @Produces({ MediaType.APPLICATION_JSON })   
    
    public String clearTRCCache() throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** clearTRCCache " ));

        TRCCache.clearCache();
        return "Successfully cleared Cache";
    }    

    @ApiOperation(httpMethod = "GET", value = "Refresh TRC and Relation Cache", notes="Refresh TRC and Relation Cache.", response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
    @GET
    @Path("/refreshTRCCache")
    @Produces({ MediaType.APPLICATION_JSON })   
    
    public JSONArray refreshTRCCache() throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** refreshTRCCache " ));

        TRCCache.clearCache();
        TRCCache.refresh();
        return TRCCache.getTriggerCache();
    }   
    
    @ApiOperation(httpMethod = "GET", value = "Fetch TRC Cache", notes="Fetch TRC Cache", response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
    @GET
    @Path("/getTRCCache")
    @Produces({ MediaType.APPLICATION_JSON })   
    
    public JSONArray getTRCCache() throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** getTRCCache " ));

        JSONArray returnArray = new JSONArray();
        if(TRCCache.getTriggerCache() != null) 
            returnArray = TRCCache.getTriggerCache();
        
        return returnArray;
    }       
    
    @ApiOperation(httpMethod = "GET", value = "Fetch Relation Cache", notes="Fetch Relation Cache", response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
    @GET
    @Path("/getRelationCache")
    @Produces({ MediaType.APPLICATION_JSON })   
    
    public JSONObject getRelationCache() throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** getRelationCache " ));

        JSONObject returnObject = new JSONObject();
        if(TRCCache.getRelationCache() != null) 
            returnObject = TRCCache.getRelationCache();
        
        return returnObject;
    }  

  @POST
  @Path("upload/{filename}")
  @Consumes({"application/octet-stream"})  
   
  //@Consumes({"multipart/form-data"})  
  //@Consumes({"text/plain"})   
  @ApiOperation(httpMethod = "POST", value = "Resource to save trigger configuration which is used as input for triggers", notes="This API is only used by TRC.",  response = org.json.simple.JSONObject.class)
  @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=400, message="Failure", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
  @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
  public Response doUploadFile(@PathParam("filename") @ApiParam(name="filename", value="the name of the uploaded file, this must be URL encoded") String filename, @ApiParam(name="file", required=true) InputStream bodyStream, @Context HttpHeaders headers)
  {
    //if (LOGGER.isDebugEnabled())
        //LOGGER.debug((Object) (CLASSNAME + "***** doUploadFile " ));

    JSONObject responseObject = new JSONObject();
    int statusCode=200;
    UploadService uploadService = new UploadService();
    String documentOid = headers.getRequestHeader("documentOid").get(0);

    
    try
    {
      String decodedFilename = URLDecoder.decode(filename, "UTF-8");
			/*
			 * File convertFile = new File("I:\\test\\"+decodedFilename); FileOutputStream
			 * out = new FileOutputStream(convertFile); int len = 0; byte[] buffer = new
			 * byte[4096];
			 * 
			 * System.out.println("fis is " + bodyStream.read(buffer)); while((len =
			 * bodyStream.read(buffer)) != -1) { System.out.println("len is " + len);
			 * out.write(buffer, 0, len); System.out.println(buffer); } out.close();
			 * //convertFile.
			 */      
      responseObject =  uploadService.uploadFile(decodedFilename, bodyStream,documentOid);
      //responseObject.put("filepath",filePath);//  return Response.status(statusCode).entity(gson.toJson(responseObject)).build();
    }
    catch (Exception e)
    {
      responseObject.put("error",e.getMessage());
      try
      {
        bodyStream.close();
      }
      catch (IOException localIOException) {}
      responseObject=appUtil.getExceptionJson(e.getMessage());
            statusCode=400;
    }
       return Response.status(statusCode).entity(gson.toJson(responseObject)).build();

  }

  @GET
  @Path("documents/{id}/primarycontent")
  @Produces({"application/octet-stream"})
  @ApiOperation(value="Get the primary content associated to the document id", notes="Returns the primary content of the provided document id as a direct download<br><br>Example<br>/documents/VR:com.lcs.wc.document.LCSDocument:12345/primarycontent")
  @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Returns document", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unkown error")})
  public Response downloadPrimary(@PathParam("id") @ApiParam(name="id", value="the id of the document") String id)
  {
    //if (LOGGER.isDebugEnabled())
        //LOGGER.debug((Object) (CLASSNAME + "***** downloadPrimary " ));
    ResponseBuilder response = null; 
    Object data = null;
    try
    {
     DownLoadService downLoadService=   new DownLoadService();
     FileItem fileDownloadItem = downLoadService.getDocument(id);
     if (fileDownloadItem != null)
    {
   
      if (fileDownloadItem.getInputStream() != null) {
        data = fileDownloadItem.getInputStream();
      } else {
        data =fileDownloadItem.getStreamingOutput();
      }
      response = Response.status(Response.Status.OK).entity(data);
      String fileName = fileDownloadItem.getFileName();
      response.header("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

       
    }}
    catch (Exception e)
    {
      ////LOGGER.error("Problem retrieving document", e);
     //return buildResponse("Problem retrieving document", e).build();
      return Response.status(400).entity(gson.toJson("Problem retrieving document")).build();
    }
    return response.build();  
  }
  
  @GET
  @Path("download/{id}")
  @Produces({"application/octet-stream"})
  @ApiOperation(value="Get the attached document with given appdata id", notes="Returns the primary content of the provided document id as a direct download<br><br>Example<br>/documents/VR:com.lcs.wc.document.LCSDocument:12345/primarycontent")
  @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Returns document", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unkown error")})
  public Response downloadFile(@PathParam("id") @ApiParam(name="id", value="the id of the document") String id)
  {
    //if (LOGGER.isDebugEnabled())
        //LOGGER.debug((Object) (CLASSNAME + "***** downloadPrimary " ));

    ResponseBuilder response = null; 
    Object data = null;
    try
    {
     DownLoadService downLoadService=   new DownLoadService();
     FileItem fileDownloadItem = downLoadService.getAppDocument(id);
     if (fileDownloadItem != null)
    {
   
      if (fileDownloadItem.getInputStream() != null) {
        data = fileDownloadItem.getInputStream();
      } else {
        data =fileDownloadItem.getStreamingOutput();
      }
      response = Response.status(Response.Status.OK).entity(data);
      String fileName = fileDownloadItem.getFileName();
      response.header("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

       
    }}
    catch (Exception e)
    {
      ////LOGGER.error("Problem retrieving document", e);
     //return buildResponse("Problem retrieving document", e).build();
      return Response.status(400).entity(gson.toJson("Problem retrieving document")).build();
    }
    return response.build();  
  }

  
  private static final String FILE_PATH = "D:\\ptc\\Windchill_11.0\\Windchill\\codebase\\images\\000001\\000001\\000001\\ball.png";  
  @GET  
  @Path("/download")
  @Produces(MediaType.APPLICATION_OCTET_STREAM)
  public Response downloadFileWithGet(@QueryParam("file") String file) {
      File fileDownload = new File(FILE_PATH);
      ResponseBuilder response = Response.ok((Object) fileDownload);
      response.header("Content-Disposition", "attachment;filename=" + file);
      return response.build();
  }
  
 // private static final String FILE_PATH = "D:\\ptc\\Windchill_11.0\\Windchill\\codebase\\images\\000001\\000001\\000001\\ball.png";  
    @GET  
    @Path("/image")  
    @Produces("image/png")  
    public Response getFile() {  
        File file = new File(FILE_PATH);  
        ResponseBuilder response = Response.ok((Object) file);  
        response.header("Content-Disposition","attachment; filename=\"javatpoint_image.png\"");  
        return response.build();  
   
    }  

@GET
@Path("/testRedirect")
@Produces(MediaType.APPLICATION_JSON)
public Response foo(@Context UriInfo uriInfo) {
    int statusCode=200;
    //MultivaluedMap<String, String> queryParams = uriInfo.getQueryParameters(); 
    JSONObject queryParameters = new JSONObject();
    MultivaluedMap<String, String> queryParametersMultiMap = uriInfo.getQueryParameters();
    try{
       // Map<String, Set<String>> queryParameters = new HashMap<>();

        for (Map.Entry<String, List<String>> queryEntry : queryParametersMultiMap.entrySet()) {
            queryParameters.put(queryEntry.getKey(), queryEntry.getValue());
        }
        }catch (Exception exception) {
      queryParameters=appUtil.getExceptionJson(exception.getMessage());
            statusCode=400;
    }
       return Response.status(statusCode).entity(gson.toJson(queryParameters)).build();
     
   
}

/**
     * @description This Method is used to get the thumbnail data of
     *              given FlexObject
     * @method POST
     * @Param inputCriteria
     * @return Response {It returns the filtered records to the given criteria}
     */
    @POST
    @Path("/getThumbnailData")
    @ApiOperation(httpMethod = "POST", value = "Get Thumbnail of FlexPLM Objects using object", notes="Search Thumbnail FlexPLM objects using OID <br><br> Example : Get Thumbnail of product<br> {\n\"objectType\": \"Product\",n\"oid\": \"VR:com.lcs.wc.product.LCSProduct:1418643\"}<br><br> refer to /cdee/getFlexObjects endpoint.",  response = org.json.simple.JSONObject.class)
    @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=400, message="Failure", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
    @Consumes("application/json")
    @Produces("application/json")
    @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
    public Response getThumbnailData(String inputCriteria,@HeaderParam("CSRF_NONCE") String csrfKey) throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** getRecordsData " ));

        int statusCode=200;
        JSONObject responseObject = new JSONObject();
        JSONObject payload=new JSONObject(); 
         try {
            if((inputCriteria!=null) && !("".equalsIgnoreCase(inputCriteria))){
                payload=(JSONObject)new JSONParser().parse(inputCriteria);
            }else{
                throw new InputValidationException("Enter a valid Input in the body");
            }
            
          
           if (payload.containsKey("objectType")&& payload.containsKey("oid")) {
                responseObject = schemaService.getThumbnail((String) payload.get("objectType"),(String) payload.get("oid"));
            }  else {
                responseObject=appUtil.getExceptionJson("Bad request");
                statusCode=400;
            }
        }catch(InputValidationException Ie){
            responseObject = appUtil.getExceptionJson(Ie.getMessage());
            statusCode=400;
        }catch (Exception e) {
            responseObject=appUtil.getExceptionJson(e.getMessage());
            statusCode=400;
        }
         if(responseObject.containsKey("statusCode")){
                statusCode=(int)responseObject.get("statusCode");
            }
            
        return Response.status(statusCode).entity(gson.toJson(responseObject)).build();
    }
   
    @GET
    @Path("/security/csrf")
    @Produces("application/json")
    @Consumes("application/json")
    public Response getCSRF(@Context HttpHeaders headers) throws Exception
    {
        int statusCode=200;
        ItemList localItemList = new ItemList();
        Item localItem = new Item();
        localItem.setId("csrf");
        localItem.addAttribute("nonce_key", "CSRF_NONCE");
        localItem.addAttribute("nonce", CSRFProtector.getNonce((HttpServletRequest) ServletState.getServletRequest()));
        localItemList.add(localItem);
        return Response.status(statusCode).entity(gson.toJson(localItemList)).build();
    }
    
    /**
     * @description This Method is used to get  current version of TRC 
     * @method GET     * 
     */
    @GET
    @Path("/getTRCVersion")
    @Produces({ MediaType.APPLICATION_JSON })   
    
    public String getTRCVersion() throws Exception {
        //if (LOGGER.isDebugEnabled())
               //LOGGER.debug((Object) (CLASSNAME + "***** getTRCVersion :" ));
        JSONObject responseobj = new JSONObject();
        responseobj.put("Version", "1.4.0");
        String response ="";
        response = gson.toJson(responseobj);
        return response;
    }

 @POST
@Path("/postStream")
@Consumes( { MediaType.APPLICATION_OCTET_STREAM, MediaType.APPLICATION_XML})
public Response handlePost(final InputStream in, @HeaderParam("Transfer-Encoding") String transferEncoding) {
    try {
        byte[] bytes = IOUtils.toByteArray(in);
        String entity = new String(bytes, "UTF-8");
        java.nio.file.Path tempFilePath = new File("I:\\test\\ball.png").toPath();
        java.nio.file.Files.copy(in, tempFilePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        //
        File convertFile = new File("I:\\test\\ball.png");
        convertFile.createNewFile();
        java.io.FileOutputStream fout = new java.io.FileOutputStream(convertFile);
        fout.write(bytes);
        fout.close();

        return Response.ok(entity).build();
    } catch (Exception e) {
        return Response.serverError().build();
    }
}
 @ApiOperation(httpMethod = "GET", value = "Get the List of all link objects supported by TRC", notes="Returns the list of link objects supported by TRC. This API is used for FlexPLM end point configuration in TRC UI only.", response = org.json.simple.JSONObject.class)
 @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Success", response=org.json.simple.JSONObject.class),@io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unexpected error")})
 @ApiImplicitParams({@io.swagger.annotations.ApiImplicitParam(name="CSRF_NONCE", value="The CSRF nonce as returned from the /security/csrf endpoint.  See the Swagger documentation titled CSRF Protection for more information.", required=true, dataType="string", paramType="header")})
 @GET
 @Path("/getFlexLinkObjects")
 @Produces({ MediaType.APPLICATION_JSON })   
 
 public String getFlexLinkObjects() throws Exception {
     //if (LOGGER.isDebugEnabled())
            //LOGGER.debug((Object) (CLASSNAME + "***** getFlexLinkObjects :" ));
     return schemaService.getLinkObjects();
 }
 
 @GET
 @Path("documents/{id}/secondarycontent")
 @Produces({"application/octet-stream"})
 @ApiOperation(value="Get the primary content associated to the document id", notes="Returns the primary content of the provided document id as a direct download<br><br>Example<br>/documents/VR:com.lcs.wc.document.LCSDocument:12345/primarycontent")
 @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Returns document", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unkown error")})
 public Response downloadSecondary(@PathParam("id") @ApiParam(name="id", value="the id of the document") String id)
 {
   //if (LOGGER.isDebugEnabled())
       //LOGGER.debug((Object) (CLASSNAME + "***** downloadPrimary " ));
   ResponseBuilder response = null; 
   Object data = null;
   try
   {
    DownLoadService downLoadService=   new DownLoadService();
    FileItem fileDownloadItem = downLoadService.getSecondaryDocument(id);
    if (fileDownloadItem != null)
   {
  
     if (fileDownloadItem.getInputStream() != null) {
       data = fileDownloadItem.getInputStream();
     } else {
       data =fileDownloadItem.getStreamingOutput();
     }
     response = Response.status(Response.Status.OK).entity(data);
     String fileName = fileDownloadItem.getFileName();
     response.header("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

      
   }}
   catch (Exception e)
   {
     ////LOGGER.error("Problem retrieving document", e);
    //return buildResponse("Problem retrieving document", e).build();
     return Response.status(400).entity(gson.toJson("Problem retrieving document")).build();
   }
   return response.build();  
 }

 
 @GET
 @Path("downloadfile/{id}")
 @Produces({"application/octet-stream"})
 @ApiOperation(value="Get the primary content associated to the document id", notes="Returns the primary content of the provided document id as a direct download<br><br>Example<br>/documents/VR:com.lcs.wc.document.LCSDocument:12345/primarycontent")
 @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Returns document", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unkown error")})
 public Response downloadGenericFile(@PathParam("id") @ApiParam(name="id", value="the id of the document") String id,@Context HttpHeaders headers)
 {
   //if (LOGGER.isDebugEnabled())
       //LOGGER.debug((Object) (CLASSNAME + "***** downloadPrimary " ));
   ResponseBuilder response = null; 
   String applicationoid = "";
   Object data = null;
   try
   {
    DownLoadService downLoadService=   new DownLoadService();
    applicationoid = headers.getRequestHeader("applicationoid").get(0);
    
    FileItem fileDownloadItem = downLoadService.getGenericDocument(id,applicationoid);
    if (fileDownloadItem != null)
   {
  
     if (fileDownloadItem.getInputStream() != null) {
       data = fileDownloadItem.getInputStream();
     } else {
       data =fileDownloadItem.getStreamingOutput();
     }
     response = Response.status(Response.Status.OK).entity(data);
     String fileName = fileDownloadItem.getFileName();
     response.header("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

      
   }}
   catch (Exception e)
   {
     ////LOGGER.error("Problem retrieving document", e);
    //return buildResponse("Problem retrieving document", e).build();
     return Response.status(400).entity(gson.toJson("Problem retrieving document")).build();
   }
   return response.build();  
 }
 
 
 @GET
 @Path("documents/{id}/content/{appid}")
 @Produces({"application/octet-stream"})
 @ApiOperation(value="Get the primary content associated to the document id", notes="Returns the primary content of the provided document id as a direct download<br><br>Example<br>/documents/VR:com.lcs.wc.document.LCSDocument:12345/primarycontent")
 @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Returns document", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unkown error")})
 public Response genericFileDownload(@PathParam("id") @ApiParam(name="id", value="the id of the document") String id,@PathParam("appid") @ApiParam(name="appid", value="the ApplicationData of the document") String appid)
 {
   //if (LOGGER.isDebugEnabled())
       //LOGGER.debug((Object) (CLASSNAME + "***** downloadPrimary " ));
   ResponseBuilder response = null; 
  
   Object data = null;
   try
   {
    DownLoadService downLoadService=   new DownLoadService();
    
    
    FileItem fileDownloadItem = downLoadService.getGenericDocument(id,appid);
    if (fileDownloadItem != null)
   {
  
     if (fileDownloadItem.getInputStream() != null) {
       data = fileDownloadItem.getInputStream();
     } else {
       data =fileDownloadItem.getStreamingOutput();
     }
     response = Response.status(Response.Status.OK).entity(data);
     String fileName = fileDownloadItem.getFileName();
     response.header("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

      
   }}
   catch (Exception e)
   {
     ////LOGGER.error("Problem retrieving document", e);
    //return buildResponse("Problem retrieving document", e).build();
     return Response.status(400).entity(gson.toJson("Problem retrieving document")).build();
   }
   return response.build();  
 }
 
 @GET
 @Path("thumbnail/{id}")
 @Produces({"application/octet-stream"})
 @ApiOperation(value="Get the primary content associated to the document id", notes="Returns the primary content of the provided document id as a direct download<br><br>Example<br>/documents/VR:com.lcs.wc.document.LCSDocument:12345/primarycontent")
 @ApiResponses({@io.swagger.annotations.ApiResponse(code=200, message="Returns document", response=org.json.simple.JSONObject.class), @io.swagger.annotations.ApiResponse(code=404, message="Invalid uri"), @io.swagger.annotations.ApiResponse(code=500, message="Unkown error")})
 public Response downloadThumnail(@PathParam("id") @ApiParam(name="id", value="the id of the document") String id)
 {
   //if (LOGGER.isDebugEnabled())
       //LOGGER.debug((Object) (CLASSNAME + "***** downloadPrimary " ));
   ResponseBuilder response = null; 
   Object data = null;
   try
   {
    DownLoadService downLoadService=   new DownLoadService();
    
    FileItem fileDownloadItem = downLoadService.findThumbnailData(id);
    if (fileDownloadItem != null)
   {
  
     if (fileDownloadItem.getInputStream() != null) {
       data = fileDownloadItem.getInputStream();
     } else {
       data =fileDownloadItem.getStreamingOutput();
     }
     response = Response.status(Response.Status.OK).entity(data);
     String fileName = fileDownloadItem.getFileName();
     response.header("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

      
   }}
   catch (Exception e)
   {
     ////LOGGER.error("Problem retrieving document", e);
    //return buildResponse("Problem retrieving document", e).build();
     return Response.status(400).entity(gson.toJson("Problem retrieving document")).build();
   }
   return response.build();  
 }
 
   
}