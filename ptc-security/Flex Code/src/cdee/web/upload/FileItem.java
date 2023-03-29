package cdee.web.upload;



import java.io.InputStream;
import javax.ws.rs.core.StreamingOutput;

public class FileItem
{
  String fileName;
  InputStream inputStream;
  StreamingOutput streamingOutput;
  
  public StreamingOutput getStreamingOutput()
  {
    return this.streamingOutput;
  }
  
  public void setStreamingOutput(StreamingOutput streamingOutput)
  {
    this.streamingOutput = streamingOutput;
  }
  
  public String getFileName()
  {
    return this.fileName;
  }
  
  public void setFileName(String fileName)
  {
    this.fileName = fileName;
  }
  
  public InputStream getInputStream()
  {
    return this.inputStream;
  }
  
  public void setInputStream(InputStream stream)
  {
    this.inputStream = stream;
  }
}
