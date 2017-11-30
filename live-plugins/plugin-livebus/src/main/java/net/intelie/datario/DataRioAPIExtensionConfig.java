package net.intelie.datario;

import net.intelie.datario.BRT.BRTEventBuilder;
import net.intelie.datario.BRT.BRTGPSClient;
import net.intelie.datario.BRT.BRTHostService;
import net.intelie.datario.BRT.BRTOutputWriter;
import net.intelie.live.*;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class DataRioAPIExtensionConfig implements ExtensionConfig {
    private String url;

    private String uri_prefix;

    private int query_interval_seconds;

    private int query_timeout_seconds;

    @Override
    public String summarize() {
        return url;
    }

    @Override
    public Set<ExtensionRole> roles() {
        return Collections.singleton(ExtensionRole.INPUT);
    }

    @Override
    public ValidationBuilder validate(ValidationBuilder validationBuilder) {
        return validationBuilder
                .requiredValue(url, "url")
                .requiredValue(uri_prefix, "uri_prefix")
                .required(query_interval_seconds > 0, "Query interval must be greater than 0\n")
                .required(query_timeout_seconds > 0, "Timeout must be greater than 0\n");
    }

    public ElementHandle create(PrefixedLive live, ExtensionQualifier qualifier) throws Exception {
        ScheduledExecutorService executor = live.system().requestScheduledExecutor(8, qualifier.fullQualifier());

        BRTOutputWriter writer = new BRTOutputWriter(new BRTEventBuilder(), live.engine().getEventLobby(), qualifier); // TODO: Allow different EventBuilders (Bus GPS, City occurences, weather, etc.)

        BRTGPSClient client = new BRTGPSClient(new WebServiceClient(new BRTHostService(url)), writer);

        executor.scheduleAtFixedRate(new DataRioQuerier(uri_prefix, client, writer, query_timeout_seconds), 0, query_interval_seconds, TimeUnit.SECONDS);

        return new ElementHandle.Default(live);
    }

    public ElementState test(ExtensionQualifier qualifier) {
        // TODO: TEST
        return ElementState.OK;
    }
}
