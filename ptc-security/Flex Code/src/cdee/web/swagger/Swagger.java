package cdee.web.swagger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.FormParam;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/cdee")

public class Swagger {

  @GET
  @Path("/display")
	@Produces(MediaType.TEXT_HTML)

    public String displayMessage() {
        return "Restful example";
    }
  }