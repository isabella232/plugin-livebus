'use strict';

import React from 'react';
import _ from 'lodash';
import i18n from 'live/services/i18n';
import { Checkbox, Radio } from 'react-bootstrap';

var ValidationMixin = require('live/components/forms/mixins/validation-mixin'),
    ObjectInitializerMixin = require('live/components/forms/mixins/object-initializer')('/rest/extension', {
        type: 'livebus-datario',
        active: true,
        config: {
            enableForInput: true,
            url: 'webapibrt.rio.rj.gov.br',
            uri_prefix: '/api/v1/brt',
            query_interval_seconds: 60,
            query_timeout_seconds: 10
        },
        fullQualifier: null,
        qualifier: null,
        status: {}
    });

var FormBase = require('live/components/extensions/ui/form');

var FormGroup = require('live/components/forms/ui/form-group');

var DataRioConfig = React.createClass({
    getInitialState: function () {
        return ({
            showPassword: false
        });
    },
    showOrHidePassword: function () {
        this.setState({
            showPassword: !this.state.showPassword
        });
    },
    render: function () {
        let config = this.props.config;
        let fns = this.props.fns;
        let showPassword = this.state.showPassword;

        return (
            <div className="form-area">
                <FormGroup type="text"
                           label={i18n('URL')}
                           name="url" value={config.url}
                           onChange={fns.onChangeInfo}
                           bsStyle={fns.validationState('config.url')}
                           hasFeedback help={fns.errorsFor('config.url')}/>

                <FormGroup type="text"
                           label={i18n('URI Prefix')}
                           name="uri_prefix" value={config.uri_prefix}
                           onChange={fns.onChangeInfo}
                           bsStyle={fns.validationState('config.uri_prefix')}
                           hasFeedback help={fns.errorsFor('config.uri_prefix')}/>

                <FormGroup type="text"
                           label={i18n('Query Interval (seconds)')}
                           name="query_interval_seconds" value={config.query_interval_seconds}
                           onChange={fns.onChangeInfo}
                           bsStyle={fns.validationState('config.query_interval_seconds')}
                           hasFeedback help={fns.errorsFor('config.query_interval_seconds')}/>

                <FormGroup type="text"
                           label={i18n('Query Timeout (seconds)')}
                           name="query_timeout_seconds" value={config.query_timeout_seconds}
                           onChange={fns.onChangeInfo}
                           bsStyle={fns.validationState('config.query_timeout_seconds')}
                           hasFeedback help={fns.errorsFor('config.query_timeout_seconds')}/>

            </div>
        );
    }
});

module.exports = React.createClass({
    mixins: [ObjectInitializerMixin, ValidationMixin],
    validations: {
        properties: {
            config: {
                properties: {
                    url: {
                        required: true,
                        allowEmpty: false,
                        message: i18n('URL') + ' ' + i18n('must not be empty')
                    },
                    uri_prefix: {
                        required: true,
                        allowEmpty: false,
                        message: i18n('URI Prefix') + ' ' + i18n('must not be empty')
                    },
                    query_interval_seconds: {
                        required: true,
                        allowEmpty: false,
                        message: i18n('Query Interval (seconds)') + ' ' + i18n('must not be empty')
                    },
                    query_timeout_seconds: {
                        required: true,
                        allowEmpty: false,
                        message: i18n('Query Timeout (seconds)') + ' ' + i18n('must not be empty')
                    }
                }
            }
        }
    },

    getInitialState: function () {
        return ({});
    },

    _onSuccess: function () {
        window.location.href = '#/integrations/' + this.state.object.type + '/' + this.state.object.id;
    },

    _onDelete: function () {
        window.location.href = '#/integrations/';
    },

    componentWillMount: function () {

    },

    onChangeName: function (e) {
        let val = e.target.value;

        this.handleValidation(e);

        let fn = this.handleValidation;
        let fieldsToUpdate = ['qualifier'];

        fieldsToUpdate.map((name) => {
            let value = val;
            setTimeout(() => {
                fn({target: {name, value}});
            }, 10);
        });
    },

    onChangeInfo: function (event) {
        let object = this.state.object;
        let config = object.config;

        let field = event.target.name;
        let value = event.target.value;

        config[field] = value;

        object.config = config;

        this.setState(config);
    },

    render: function () {
        let object = (this.state.object);
        let config = (object.config);

        const uiCfg = {
            newInstanceTitle: i18n('New query'),
            hideQualifier: false,
            hideDivider: true
        };

        let dataRioConfigFns = {
            onChangeName: this.onChangeName,
            validationState: this.validationState,
            errorsFor: this.errorsFor,
            onChangeInfo: this.onChangeInfo,
            handleValidation: this.handleValidation
        };


        return (
            <FormBase self={this} uiCfg={uiCfg} test={true}>
                <div className="bus">
                    <DataRioConfig config={config} fns={dataRioConfigFns}/>
                </div>
            </FormBase>
        );
    }
});
