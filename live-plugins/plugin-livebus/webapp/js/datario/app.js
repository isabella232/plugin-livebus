try {
    document.addEventListener('DOMContentLoaded', function() {
        require('./init');
    });

    var Form = require('./form');
    var ExtensionService = require('live/services/extension');

    const bus = {
        name: 'data.rio',
        type: 'livebus-datario',
        origin: 'Livebus plugin',
        roles: ['input'],
        icon: '/content/plugin-livebus/datario.png',
        ui: {
            form: Form,
            view: null
        }
    };

    ExtensionService.register(bus);
}
catch (e) {
}
