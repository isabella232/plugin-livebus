document.addEventListener('DOMContentLoaded', () => {
    try {
        let Widget = require('./map/impl');

        Widget({
            id: 'bus-map',
            name: 'Bus Map',
            assetsUrl: '/content/plugin-livebus/'
        });
    }
    catch (e) {
        console.log('failed loading map:', e.message);
    }
});
