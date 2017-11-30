try {
    var i18n  = require('live/services/i18n');
    var pt_br = require('./i18n/pt_br');
    var en_us = require('./i18n/en_us');

    var locale = (Live.settings && Live.settings.locale) ? Live.settings.locale : 'pt_br';
    var localeFiles = {
        pt_br: pt_br,
        en_us: en_us
    };

    i18n.add(localeFiles[locale]);
} catch (e) {
}
