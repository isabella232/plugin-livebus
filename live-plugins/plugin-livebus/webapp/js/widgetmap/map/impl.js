module.exports = (CHART) => {
    require('../../../scss/map.scss');
    var Widget = require('./map')(CHART);

    var policies = {
        output: 'snapshot',
        grouping: 'grouping',
        baseline: 'no-baseline'
    };

    var widgetsService = require('live/services/widgets');

    widgetsService.name(CHART.id, CHART.name);
    widgetsService.impl(CHART.id, Widget);
    widgetsService.policies(CHART.id, policies);
    widgetsService.config(CHART.id, {});
    widgetsService.properties(CHART.id, {});
};
