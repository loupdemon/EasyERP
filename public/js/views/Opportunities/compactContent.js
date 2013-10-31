﻿define([
    "text!templates/Opportunities/compactContentTemplate.html",
    "common"
],
    function (compactContentTemplate, common) {
        var compactContentView = Backbone.View.extend({

            className: "form",
            initialize: function (options) {
                this.customer = options.customers
            },

            events: {
                "click #opportunities p > a": "gotoOpportunitieForm"
            },

            template: _.template(compactContentTemplate),

            gotoOpportunitieForm: function (e) {
                e.preventDefault();
                var itemIndex = $(e.target).closest("a").attr("id");
                window.location.hash = "#home/content-Opportunities/form/" + itemIndex;
            },

            render: function (options) {
                var collection = this.collection.toJSON();
                if (options) {
                    var company = this.model.get("company");
                } else {
                    company = this.model.toJSON();
                }
                var customers = this.customer.toJSON();
                this.$el.html(this.template({
                    collection: collection,
                    company: company
                }));
                common.contentHolderHeightFixer();
                return this;
            }
        });

        return compactContentView;
    });