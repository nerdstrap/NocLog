define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone');

    var CompositeView = function (options) {
        this.children = _([]);
        Backbone.View.apply(this, [options]);
    };

    _.extend(CompositeView.prototype, Backbone.View.prototype, {
        leave: function () {
            this.trigger('leave');
            this.unbind();
            this.stopListening();
            this.remove();
            this._leaveChildren();
            this._removeFromParent();
        },
        renderChild: function (view) {
            view.render();
            this.children.push(view);
            view.parent = this;
        },
        renderChildInto: function (view, container) {
            this.renderChild(view);
            this.$(container).html(view.el);
        },
        replaceChild: function (view, container) {
            this.renderChild(view);
            this.$(container).replaceWith(view.el);
        },
        appendChild: function (view) {
            this.renderChild(view);
            this.$el.append(view.el);
        },
        appendChildTo: function (view, container) {
            this.renderChild(view);
            this.$(container).append(view.el);
        },
        prependChild: function (view) {
            this.renderChild(view);
            this.$el.prepend(view.el);
        },
        prependChildTo: function (view, container) {
            this.renderChild(view);
            this.$(container).prepend(view.el);
        },
        swapped: function () {
            this.trigger('swapped');
        },
        _leaveChildren: function () {
            this.children.chain().clone().each(function (view) {
                if (view.leave) {
                    view.leave();
                }
            });
        },
        _removeFromParent: function () {
            if (this.parent) {
                this.parent._removeChild(this);
            }
        },
        _removeChild: function (view) {
            var index = this.children.indexOf(view);
            this.children.splice(index, 1);
        },
        listenToWindowResize: function() {
            var resizeEvent = $._data($(window)[0], 'events').resize;
            if (resizeEvent) {
                this.calculateScrollClassHeight();
            } else {
                $(window).on("resize", this.calculateScrollClassHeight);
                this.calculateScrollClassHeight();
            }
        },
        calculateScrollClassHeight: function() {
            if ($(".scroll")) {
                var header_height = $("#header-view").outerHeight();
                var filter_height = $("#filter-and-list-header-area").outerHeight();
                var personnel_open_entry_height = $("#personnel-open-entry-area").outerHeight();
                var footer_height = $("#footer-view").outerHeight();
                var plus_padding = 20; //just needs to be large enough to prevent normal vertical scroll bar for window
                var height = $(window).height() - (((header_height + footer_height) + filter_height) + plus_padding);
                if (personnel_open_entry_height !== null) {
                    height = $(window).height() - ((((header_height + footer_height) + filter_height) + personnel_open_entry_height ) + plus_padding);
                }
                if (height < 250) {
                    height = 250; //this prevents the scroll list from being too small to show
                }
                $(".scroll").css("height", height + "px");
            }
        }
    });

    CompositeView.extend = Backbone.View.extend;

    return CompositeView;
});
