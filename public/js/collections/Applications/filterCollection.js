﻿define([
    'models/ApplicationsModel',
    'common'
],
    function (ApplicationModel, common) {
        var TasksCollection = Backbone.Collection.extend({
            model: ApplicationModel,
            url: "/Applications/",
            page: 1,
            namberToShow: null,
            contentType: null,
            viewType: null,

            initialize: function (options) {
                var that = this;
                this.startTime = new Date();
                this.contentType = options.contentType;
                this.viewType = options.viewType;
                this.wfStatus = [];
                this.wfStatus = options.status;
                this.namberToShow = options.count;

                if (options && options.viewType) {
                    this.url += options.viewType;
                   // delete options.viewType;
                }

                this.fetch({
                    data: options,
                    reset: true,
                    success: function() {
                        that.page ++;

                    },
                    error: function (models, xhr) {
                        if (xhr.status == 401) Backbone.history.navigate('#login', { trigger: true });
                    }
                });
            },

            showMore: function (options) {
                var that = this;

                var filterObject = options || {};

                filterObject['page'] = (options && options.page) ? options.page: this.page;
                filterObject['count'] = (options && options.count) ? options.count: this.namberToShow;
                filterObject['contentType'] = (options && options.contentType) ? options.contentType: this.contentType;
                filterObject['viewType'] = (options && options.viewType) ? options.viewType: this.viewType;
                this.fetch({
                    data: filterObject,
                    waite: true,
                    success: function (models) {
                        that.page ++;
                        that.trigger('showmore', models);
                    },
                    error: function() {
                        alert('Some Error');
                    }
                });

            },

            parse: true,
            parse: function (response) {
                return response.data;
            }
        });

        return TasksCollection;
    });
