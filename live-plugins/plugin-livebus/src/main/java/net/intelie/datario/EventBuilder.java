package net.intelie.datario;

import java.text.ParseException;
import java.util.Map;

public interface EventBuilder<T> {
    Map<String, Object> eventOf(T data) throws ParseException;
}
