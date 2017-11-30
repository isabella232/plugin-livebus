package net.intelie.datario;

import net.intelie.live.*;

import java.util.Collections;
import java.util.Set;

public class DataRioAPIExtension implements ExtensionType<DataRioAPIExtensionConfig> {
    private final Live live;

    public DataRioAPIExtension(Live live) {
        this.live = live;
    }

    @Override
    public String typename() {
        return "livebus-datario";
    }

    @Override
    public Set<ExtensionRole> roles() {
        return Collections.singleton(ExtensionRole.INPUT);
    }

    @Override
    public ExtensionArea area() {
        return ExtensionArea.INTEGRATION;
    }

    @Override
    public ElementHandle register(ExtensionQualifier qualifier, DataRioAPIExtensionConfig config) throws Exception {
        return SafeElement.create(live, qualifier, config::create);
    }

    @Override
    public ElementState test(ExtensionQualifier qualifier, DataRioAPIExtensionConfig config) throws Exception {
        return config.test(qualifier);
    }

    @Override
    public DataRioAPIExtensionConfig parseConfig(String config) throws Exception {
        return LiveJson.fromJson(config, DataRioAPIExtensionConfig.class);
    }
}
