package net.intelie.datario.BRT;

import net.intelie.datario.EventBuilder;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

public class BRTEventBuilder implements EventBuilder<BRTData> {
    @Override
    public Map<String, Object> eventOf(BRTData brtData) throws ParseException {
        Map<String, Object> event = new HashMap<>();

        event.put("Code", brtData.getCode());
        event.put("Line", brtData.getLine());
        event.put("Latitude", brtData.getLatitude());
        event.put("Longitude", brtData.getLongitude());
        event.put("Timestamp", brtData.getTimestamp());
        event.put("Speed", brtData.getSpeed());

        event.put("__type", "BRTGPS");

        return event;
    }
}
