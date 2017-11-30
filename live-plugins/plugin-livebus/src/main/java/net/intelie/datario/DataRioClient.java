package net.intelie.datario;

public interface DataRioClient {
    long request(String uri, int timeout_seconds) throws Exception;
}
