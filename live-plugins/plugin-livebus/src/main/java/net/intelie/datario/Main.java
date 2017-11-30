package net.intelie.datario;

import net.intelie.live.HtmlTag;
import net.intelie.live.Live;
import net.intelie.live.LivePlugin;

public class Main implements LivePlugin {
    @Override
    public void start(Live live) throws Exception {
        live.engine().addExtensionType(new DataRioAPIExtension(live));

        live.web().addContent("", Main.class.getResource("/webcontent"));
        live.web().addTag(HtmlTag.Position.BEGIN, new HtmlTag.JsFile(live.web().resolveContent("bundle.js")));
    }
}
