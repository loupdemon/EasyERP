define([
    'text!templates/Opportunities/list/ListHeader.html',
    'views/Opportunities/CreateView',
    'views/Opportunities/list/ListItemView',
    "common"
],

    function (ListTemplate, CreateView, ListItemView, common) {
        var OpportunitiesListView = Backbone.View.extend({
            el: '#content-holder',

            initialize: function (options) {
                this.collection = options.collection;
				this.stages = [];
                this.collection.bind('reset', _.bind(this.render, this));
                this.defaultItemsNumber = this.collection.namberToShow;
                this.deleteCounter = 0;
                this.render();
            },

            events: {
                "click .itemsNumber": "switchPageCounter",
                "click .showPage": "showPage",
                "change #currentShowPage": "showPage",
                "click #previousPage": "previousPage",
                "click #nextPage": "nextPage",
                "click .checkbox": "checked",
                "click  .list td:not(:has('input[type='checkbox']'))": "gotoForm",
				"click #itemsButton": "itemsNumber",
				"click .currentPageList": "itemsNumber",
				"click":"hideItemsNumber",
				"click .filterButton":"showfilter",
				"click .filter-check-list li":"checkCheckbox"


            },
			checkCheckbox:function(e){
				if(!$(e.target).is("input")){
					$(e.target).closest("li").find("input").prop("checked", !$(e.target).closest("li").find("input").prop("checked"))
				}
			},
            showFilteredPage: function (event) {
                var workflowIdArray = [];
                $('.filter-check-list input:checked').each(function(){
                    workflowIdArray.push($(this).val());
                })
                this.collection.status = workflowIdArray;
                var itemsNumber = $("#itemsNumber").text();

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: 1, status: workflowIdArray });
            },

			showfilter:function(e){
				$(".filter-check-list").toggle();
				return false;
			},

 			hideItemsNumber:function(e){
				$(".allNumberPerPage").hide();
				if (!$(e.target).closest(".filter-check-list").length){
					$(".allNumberPerPage").hide();
					if ($(".filter-check-list").is(":visible")){
						$(".filter-check-list").hide();
						this.showFilteredPage();
					}
				}
			},
			itemsNumber:function(e){
				$(e.target).closest("button").next("ul").toggle();
				return false;
			},

            render: function () {
				var self=this;
                console.log('Opportunities render');
                $('.ui-dialog ').remove();
                this.$el.html(_.template(ListTemplate));
				var itemView = new ListItemView({ collection: this.collection });
                itemView.bind('incomingSatges', itemView.pushStages, itemView);
                this.$el.append(itemView.render());
                $('#check_all').click(function () {
                    $(':checkbox').prop('checked', this.checked);
                    if ($("input.checkbox:checked").length > 0)
                        $("#top-bar-deleteBtn").show();
                    else
                        $("#top-bar-deleteBtn").hide();
                });

                $("#pageList").empty();
                if (this.defaultItemsNumber) {
                    var itemsNumber = this.defaultItemsNumber;
                    this.defaultItemsNumber = false;
                    $("#itemsNumber").text(itemsNumber);
                } else {
                    var itemsNumber = $("#itemsNumber").text();
                }
                $("#currentShowPage").val(1);
                var pageNumber = Math.ceil(this.collection.listLength/itemsNumber);
                for (var i=1;i<=pageNumber;i++) {
                    $("#pageList").append('<li class="showPage">'+ i +'</li>')
                }

                $("#lastPage").text(pageNumber);
                $("#previousPage").prop("disabled",true);

                if ((this.collection.listLength == 0) || this.collection.listLength == undefined) {
                    $("#grid-start").text(0);
                    $("#nextPage").prop("disabled",true);
                } else {
                    $("#grid-start").text(1);
                }

                if (this.collection.listLength) {
                    if (this.collection.listLength <= itemsNumber) {
                        $("#grid-end").text(this.collection.listLength - this.deleteCounter );
                    } else {
                        $("#grid-end").text(itemsNumber - this.deleteCounter );
                    }
                    $("#grid-count").text(this.collection.listLength);
                } else {
                    $("#grid-end").text(0);
                    $("#grid-count").text(0);
                }

                if (pageNumber <= 1) {
                    $("#nextPage").prop("disabled",true);
                }
                common.populateWorkflowsList("Opportunity", ".filter-check-list", App.ID.workflowNamesDd, "/Workflows", null, function(stages) {
					self.stages = stages;
                    itemView.trigger('incomingSatges', stages);
                });
                this.deleteCounter = 0;
                $(document).on("click", function (e) {
                    self.hideItemsNumber(e);
                });
            },

            previousPage: function (event) {
                event.preventDefault();
                var itemsNumber = $("#itemsNumber").text();
                var page = parseInt($("#currentShowPage").val()) - 1;
                $("#currentShowPage").val(page);

                if (this.collection.listLength == 0) {
                    $("#grid-start").text((page - 1)*itemsNumber);
                } else {
                    $("#grid-start").text((page - 1)*itemsNumber+1);
                }

                if (this.collection.listLength <= page*itemsNumber ) {
                    $("#grid-end").text(this.collection.listLength);
                } else {
                    $("#grid-end").text(page*itemsNumber);
                }
                $("#grid-count").text(this.collection.listLength);

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: page});
                $("#nextPage").prop("disabled",false);
            },

            nextPage: function (event) {
                event.preventDefault();
                var itemsNumber = $("#itemsNumber").text();
                var page =  parseInt($("#currentShowPage").val()) + 1;
                $("#currentShowPage").val(page);

                if (this.collection.listLength == 0) {
                    $("#grid-start").text((page - 1)*itemsNumber);
                } else {
                    $("#grid-start").text((page - 1)*itemsNumber+1);
                }

                if (this.collection.listLength <= page*itemsNumber ) {
                    $("#grid-end").text(this.collection.listLength);
                } else {
                    $("#grid-end").text(page*itemsNumber);
                }
                $("#grid-count").text(this.collection.listLength);

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: page});
                $("#previousPage").prop("disabled",false);
            },

            switchPageCounter: function (event) {
                event.preventDefault();
                $("#previousPage").prop("disabled",true);
                var itemsNumber = event.target.textContent;
                $("#itemsNumber").text(itemsNumber);
                $("#currentShowPage").val(1);

                if ((this.collection.listLength == 0) || this.collection.listLength == undefined) {
                    $("#grid-start").text(0);
                    $("#nextPage").prop("disabled",true);
                } else {
                    $("#grid-start").text(1);
                }

                if (this.collection.listLength) {
                    if (this.collection.listLength <= itemsNumber) {
                        $("#grid-end").text(this.collection.listLength);
                        $("#nextPage").prop("disabled",true);
                    } else {
                        $("#grid-end").text(itemsNumber);
                        $("#nextPage").prop("disabled",false);
                    }
                } else {
                    $("#grid-end").text(0);
                    $("#nextPage").prop("disabled",true);
                }

                $("#grid-count").text(this.collection.listLength);

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: 1});
            },

            showPage: function (event) {
                event.preventDefault();
                var itemsNumber = $("#itemsNumber").text();
                var page = event.target.textContent;
                if (!page) {
                    page = $(event.target).val();
                }
                var adr = /^\d+$/;
                var lastPage = $('#lastPage').text();

                if (!adr.test(page) || (parseInt(page) <= 0) || (parseInt(page) > parseInt(lastPage))) {
                    page = 1;
                }

                $("#itemsNumber").text(itemsNumber);
                $("#currentShowPage").val(page);

                if (this.collection.listLength == 0) {
                    $("#grid-start").text((page - 1)*itemsNumber);

                } else {
                    $("#grid-start").text((page - 1)*itemsNumber+1);
                }

                if (this.collection.listLength <= page*itemsNumber ) {
                    $("#grid-end").text(this.collection.listLength);
                } else {
                    $("#grid-end").text(page*itemsNumber);
                }

                $("#grid-count").text(this.collection.listLength);

                _.bind(this.collection.showMore, this.collection);
                this.collection.showMore({count: itemsNumber, page: page});
            },

            showMoreContent: function (newModels) {
				var self = this;
                $("#listTable").empty();
                var itemView = new ListItemView({ collection: newModels });
				itemView.render();
				itemView.undelegateEvents();
                itemView.trigger('incomingSatges', self.stages);
                $("#pageList").empty();
                var itemsNumber = $("#itemsNumber").text();
                var pageNumber;

                if (this.collection.listLength) {
                    pageNumber = Math.ceil(this.collection.listLength/itemsNumber);
                } else {
                    pageNumber = 0;
                }

                var currentPage = $("#currentShowPage").val();
                for (var i=currentPage;i<=pageNumber;i++) {
                    $("#pageList").append('<li class="showPage">'+ i +'</li>')
                }
                $("#lastPage").text(pageNumber);

                if (currentPage <= 1) {
                    $("#previousPage").prop("disabled",true);
                } else {
                    $("#previousPage").prop("disabled",false);
                }

                if ((currentPage == pageNumber) || (pageNumber <= 1)) {
                    $("#nextPage").prop("disabled",true);
                } else {
                    $("#nextPage").prop("disabled",false);
                }
                if ((this.collection.listLength == 0) || this.collection.listLength == undefined) {
                    $("#grid-start").text(0);
                    $("#nextPage").prop("disabled",true);
                } else {
                    $("#grid-start").text(1);
                }

                if (this.collection.listLength) {
                    if (this.collection.listLength <= itemsNumber) {
                        $("#grid-end").text(this.collection.listLength - this.deleteCounter );
                    } else {
                        $("#grid-end").text(itemsNumber - this.deleteCounter );
                    }
                    $("#grid-count").text(this.collection.listLength);
                } else {
                    $("#grid-end").text(0);
                    $("#grid-count").text(0);
                }
            },
            gotoForm: function (e) {
                App.ownContentType = true;
                var id = $(e.target).closest("tr").data("id");
                window.location.hash = "#easyErp/Opportunities/form/" + id;
            },

            createItem: function () {
                //create editView in dialog here
                new CreateView();
            },

            checked: function () {
                if (this.collection.length > 0) {
                    if ($("input.checkbox:checked").length > 0)
                        $("#top-bar-deleteBtn").show();
                    else
                    {
                        $("#top-bar-deleteBtn").hide();
                        $('#check_all').prop('checked', false);
                    }
                }
            },

            deleteItems: function () {
                var that = this,
                    mid = 39,
                    model;
                var localCounter = 0;
                $.each($("tbody input:checked"), function (index, checkbox) {
                    model = that.collection.get(checkbox.value);
                    model.destroy({
                        headers: {
                            mid: mid
                        }
                    });
                    that.collection.listLength--;
                    localCounter++
                });
                $("#grid-count").text(this.collection.listLength);
                this.defaultItemsNumber = $("#itemsNumber").text();
                this.deleteCounter = localCounter;
                this.collection.trigger('reset');
            }

    });

        return OpportunitiesListView;
    });
