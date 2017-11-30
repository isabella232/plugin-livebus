package net.intelie.datario.BRT;

import com.google.gson.Gson;
import net.intelie.datario.DataRioClient;
import net.intelie.datario.DataRioQuerier;
import net.intelie.datario.OutputWriter;
import net.intelie.datario.WebServiceClient;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;

public class BRTGPSClient implements DataRioClient {
    private static final Logger LOGGER = LoggerFactory.getLogger(DataRioQuerier.class);

    private static final Gson GSON = new Gson();

    private final WebServiceClient webService;
    private final OutputWriter<BRTData> outputWriter;

    public BRTGPSClient(WebServiceClient webService, OutputWriter<BRTData> outputWriter) {
        this.webService = webService;
        this.outputWriter = outputWriter;
    }

    public long request(String uri, int timeout_seconds) throws Exception {
        String response = webService.get(uri, new WhenResponse());
        BRTGPSResponse brtgpsResponse = GSON.fromJson(response, BRTGPSResponse.class);
        List<BRTData> events = brtgpsResponse.getVehicles();

        outputWriter.events(events);

        if (events.size() > 0) {
            return events.get(0).getTimestamp();
        }

        return 0;
    }

    private class WhenResponse implements ResponseHandler<String> {
        @Override
        public String handleResponse(
                final HttpResponse response) throws IOException {
            LOGGER.warn("HTTP Request returned HTTP status {}", response.getStatusLine());
            int status = response.getStatusLine().getStatusCode();
            if (status >= 200 && status < 300) {
                HttpEntity entity = response.getEntity();
                return entity != null ? EntityUtils.toString(entity) : null;
            } else {
                LOGGER.warn("unexpected response status: ", status);
                throw new ClientProtocolException("Unexpected response status: " + status);
            }
        }
    }
}
