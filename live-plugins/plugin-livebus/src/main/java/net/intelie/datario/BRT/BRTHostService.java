package net.intelie.datario.BRT;

import net.intelie.datario.HostService;
import org.apache.http.HttpHost;

public class BRTHostService implements HostService {

    private final HttpHost host;

    public BRTHostService(String url) {
        host = new HttpHost(url);
    }

    @Override
    public HttpHost host() {
        return host;
    }

    @Override
    public String hostname() {
        return host.getHostName();
    }

    @Override
    public String scheme() {
        return host.getSchemeName();
    }

    @Override
    public int port() {
        return host.getPort();
    }
}
