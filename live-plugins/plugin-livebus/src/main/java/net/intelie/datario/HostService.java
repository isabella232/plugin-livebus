package net.intelie.datario;

import org.apache.http.HttpHost;

public interface HostService {
    HttpHost host();

    String hostname();

    String scheme();

    int port();
}
