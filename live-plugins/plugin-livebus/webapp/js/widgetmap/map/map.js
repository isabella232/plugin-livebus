module.exports = (CHART) => {
    var _ = window._;

    if ((typeof _) == 'undefined') {
        _ = require('lodash');
    }

    require('../dependencies/leaflet/leaflet.css');
    require('../dependencies/leaflet/leaflet');
    require('../dependencies/leaflet/leaflet-rotate-marker');

    var colors = require('live/services/colors');

    var Widget = function (options) {
        options || (options = {});

        this.options = options;
        this.cfg = options.cfg || {};
        this.chartOpts = options.chartOpts || {};

        if (typeof this.initialize == 'function')
            this.initialize.apply(this, arguments);
    };

    Widget.prototype = new Widget();
    Widget.prototype.constructor = Widget;


    _.extend(Widget.prototype, {

        initialize: function () {

        },

        onceReady: function (fn) {
            this.options.onReady = fn;
            return this;
        },

        setMap: function () {
            var layers = this.getTileLayers();

            L.Icon.Default.imagePath = CHART.assetsUrl + 'images/';

            this.MAP = L.map('map', {
                maxZoom: 18,
                layers: layers
            });
            this.state = {
                markers: {},
                lastPosMarker: {}
            };

            var map = this.MAP;
            map.setView([-22.902134, -43.280383], 12);

            this.setAttr();
            this.setLayers();
        },

        getTileLayers: function () {
            var tiles = {
                streets: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                light: 'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                dark: 'http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                esri: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
            };

            return [
                L.tileLayer(tiles.dark),
                L.tileLayer(tiles.light),
                L.tileLayer(tiles.streets),
                L.tileLayer(tiles.esri, {
                    attribution: 'Tiles &copy; Esri &mdash'
                })
            ]
        },

        setLayers: function () {
            var tileLayers = this.getTileLayers();
            var baseLayers = {
                Default: tileLayers[3],
                Dark: tileLayers[0],
                Light: tileLayers[1],
                Streets: tileLayers[2]
            };

            L.control.layers(baseLayers).addTo(this.MAP);
        },

        setAttr: function () {
            var attr = 'Map tiles by <a href="https://cartodb.com/" target="_blank">CartoDB</a>, under ' +
                '<a href="https://creativecommons.org/licenses/by/3.0/" target="_blank">CC BY 3.0</a>.<br />' +
                'Data by <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a>, ' +
                'under <a href="http://opendatacommons.org/licenses/odbl/" target="_blank">ODbL</a>.';

            this.MAP.attributionControl.setPrefix(attr);
        },

        chooseIcon: function (course) {
            return 'fa fa-arrow-circle-o-up';
        },

        addLastPositionMarker: function (code, latlng, popupContent, image) {
            var map = this.MAP;

            var lastPosMarker = this.state.lastPosMarker;

            var marker;

            if(code >= 0)
            {
                marker = lastPosMarker[code];
            }

            if (_.isEmpty(marker)) {
                marker = L.marker(latlng, {
                    rotationAngle: 0,
                    rotationOrigin: 'center center',
                    icon: L.icon({
                        iconSize: [14, 14],
                        iconUrl: CHART.assetsUrl + 'images/' + image
                    })
                });

                if(code >= 0)
                {
                    this.state.lastPosMarker[code] = marker;
                }
            } else {
                marker.setIcon(L.icon({
                    iconSize: [14, 14],
                    iconUrl: CHART.assetsUrl + 'images/' + image
                }));
                marker.setRotationAngle(0); // course
                marker.setLatLng(latlng);
            }

            var markerPopup;

            marker.on('mouseover', (e) => {
                markerPopup = L.popup({minWidth: 130})
                    .setLatLng(latlng)
                    .setContent(popupContent)
                    .openOn(map);
            }).on('mouseout', () => {
                setTimeout(() => {
                    map.removeLayer(markerPopup);
                }, 1300);
            });
        },

        render: function () {
            var self = this;

            if (_.isFunction(self.options.onReady))
                self.options.onReady.apply(self);

            var $map = $('<div/>').attr('id', 'map');
            $map.addClass('map-container');
            this.$el.html($map);

            this.setMap();

            this.$el.on('content.resize', _.bind(this.onResize, this));

            return this;
        },

        onResize: function () {
            this.MAP._onResize();
        },

        onStartQuery: function (events, layer) {
            if (typeof this.isFollowing == 'undefined')
                this.isFollowing = false;

            this.isFollowing = false;
            this.MAP.remove();
            this.setMap();
        },

        addStation: function(event, stationType, image) {
            var txt = '';
            if(event.name) txt += event.name;
            txt += '<br /> ' + stationType;
            txt += '<br /> Bairro: ';
            txt += event.address_neighborhood;

            var latlng = L.latLng(event.latitude, event.longitude);

            this.addLastPositionMarker(-1, latlng, txt, image);
        },

        addTranscariocaStation: function(event) {
            this.addStation(event, 'Transcarioca', 'transcarioca.png');
        },

        addTransoesteStation: function(event) {
            this.addStation(event, 'Transoeste', 'transoeste.png');
        },

        addBusMarker: function (event) {
            if (!event.Line)
            {
                return;
            }

            var timestampToDate = function (timestamp) {
                var d = new Date(timestamp);
                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1;
                var curr_year = d.getFullYear();
                return curr_year + "/" + curr_month + "/" + curr_date + ' ' + (new Date(timestamp) + '').split(' ')[4];
            };

            var txt = '';
            if(event.Name) txt += event.Name;
            txt += event.Line;
            txt += '<br /> Código: ' + event.Code;
            txt += '<br />Última atualização: ' + timestampToDate(event.Timestamp);

            var latlng = L.latLng(event.Latitude, event.Longitude);

            this.addLastPositionMarker(event.Code, latlng, txt, 'circle_bus_small.svg');
        },

        processEvents: function (events, layer) {
            var self = this;
            _.map(events, function (event) {
                if(event.type == "TransoesteStation") {
                    self.addTransoesteStation(event);
                }
                else if(event.type == "TranscariocaStation") {
                    self.addTranscariocaStation(event);
                }
                else
                {
                    self.addBusMarker(event);
                }
            });
        },

        onNewEvents: function (events, layer) {
            this.processEvents(events, layer);
        },

        plotMap: function () {
            var map = this.MAP;

            let lastPosMarker = this.state.lastPosMarker;

            Object.keys(lastPosMarker).forEach((busCode) => {
                lastPosMarker[busCode].addTo(map);
            });
        },

        setEl: function (el) {
            if (typeof el.get == 'function') {
                this.el = el.get(0);
            } else {
                this.el = el;
            }
            if (typeof $ !== 'undefined')
                this.$el = $(el);

            return this;
        },

        flow: function (type, events, layer) {
            if (typeof this.isFollowing == 'undefined')
                this.isFollowing = false;

            switch (type) {
                case 'event':
                    this.onNewEvents(events, layer);
                    break;
                case 'start':
                    this.onStartQuery(events, layer);
                    break;
                case 'endHistory':
                    this.isFollowing = true;
                    this.plotMap();
                    break;
                default:
                    break;
            }
        }
    });

    return Widget;
};
