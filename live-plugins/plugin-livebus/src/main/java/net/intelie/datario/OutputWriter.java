package net.intelie.datario;

import java.util.List;

public interface OutputWriter<T extends EventData> {
    void events(List<T> data);
}
