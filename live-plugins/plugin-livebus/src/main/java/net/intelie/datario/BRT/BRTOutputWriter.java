package net.intelie.datario.BRT;

import net.intelie.datario.EventBuilder;
import net.intelie.datario.OutputWriter;
import net.intelie.live.EventLobby;
import net.intelie.live.ExtensionQualifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

public class BRTOutputWriter implements OutputWriter<BRTData> {

    private static final Logger LOGGER = LoggerFactory.getLogger(BRTOutputWriter.class);

    private final EventBuilder<BRTData> eventBuilder;
    private final EventLobby lobby;
    private final ExtensionQualifier qualifier;

    public BRTOutputWriter(EventBuilder<BRTData> eventBuilder, EventLobby lobby, ExtensionQualifier qualifier) {
        this.eventBuilder = eventBuilder;
        this.lobby = lobby;
        this.qualifier = qualifier;
    }

    @Override
    public void events(List<BRTData> eventData) {
        if (eventData == null) return;

        LOGGER.warn("Sending {} events to Live", eventData.size());

        for (BRTData data : eventData) {
            Map<String, Object> event = Collections.emptyMap();
            try {
                event = eventBuilder.eventOf(data);
            } catch (ParseException e) {
                LOGGER.warn("Could not parse event data", e);
            }
            if (event.isEmpty())
                continue;

            lobby.enter((String) event.get("__type"), qualifier.fullQualifier(), event);
        }
    }
}
