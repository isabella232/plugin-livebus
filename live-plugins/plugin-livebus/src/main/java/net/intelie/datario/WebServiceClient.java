package net.intelie.datario;

import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class WebServiceClient {
    private static final Logger LOGGER = LoggerFactory.getLogger(WebServiceClient.class);

    private final HostService host;
    private final HttpClientContext localContext;
    private final Map<String, String> headers;

    public WebServiceClient(HostService hostService) {
        this.host = hostService;
        this.localContext = HttpClientContext.create();
        this.headers = new HashMap<>();
    }

    public <T> T get(String uri, ResponseHandler<T> handler) throws Exception {
        try (CloseableHttpClient httpclient = HttpClients.custom().build()) {
            HttpGet httpget = new HttpGet(uri);

            if (!headers.isEmpty())
                for (Map.Entry<String, String> h : headers.entrySet())
                    httpget.setHeader(h.getKey(), h.getValue());

            LOGGER.warn("Executing request {} to {}://{}:{}", httpget.getRequestLine(), host.scheme(), host.hostname(), host.port());
            return httpclient.execute(host.host(), httpget, handler, localContext);
        } catch (Exception e) {
            LOGGER.error("Could not perform request", e);
            throw e;
        }
    }

    public void setHeader(String name, String value) {
        headers.put(name, value);
    }
}
