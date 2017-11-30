package net.intelie.datario;

import net.intelie.datario.BRT.BRTOutputWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DataRioQuerier implements Runnable {
    private static final Logger LOGGER = LoggerFactory.getLogger(DataRioQuerier.class);

    private long lastTimestamp = 0;

    private String uri;

    private int timeout_seconds;

    private BRTOutputWriter liveOutputWriter;

    private DataRioClient client;

    public DataRioQuerier(String uri, DataRioClient client, BRTOutputWriter liveOutputWriter, int timeout_seconds) {
        this.uri = uri;
        this.client = client;
        this.liveOutputWriter = liveOutputWriter;
        this.timeout_seconds = timeout_seconds;
    }

    @Override
    public void run() {
        try {
            lastTimestamp = client.request(uri, timeout_seconds);
        } catch (Exception e) {
            LOGGER.error(e.getMessage());
        }
    }
}
