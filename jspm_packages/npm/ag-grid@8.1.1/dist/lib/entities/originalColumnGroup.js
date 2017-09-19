/* */ 
"use strict";
var columnGroup_1 = require('./columnGroup');
var column_1 = require('./column');
var eventService_1 = require('../eventService');
var OriginalColumnGroup = (function() {
  function OriginalColumnGroup(colGroupDef, groupId, padding) {
    this.localEventService = new eventService_1.EventService();
    this.expandable = false;
    this.colGroupDef = colGroupDef;
    this.groupId = groupId;
    this.expanded = colGroupDef && !!colGroupDef.openByDefault;
    this.padding = padding;
  }
  OriginalColumnGroup.prototype.isPadding = function() {
    return this.padding;
  };
  OriginalColumnGroup.prototype.setExpanded = function(expanded) {
    this.expanded = expanded;
    this.localEventService.dispatchEvent(OriginalColumnGroup.EVENT_EXPANDED_CHANGED);
  };
  OriginalColumnGroup.prototype.isExpandable = function() {
    return this.expandable;
  };
  OriginalColumnGroup.prototype.isExpanded = function() {
    return this.expanded;
  };
  OriginalColumnGroup.prototype.getGroupId = function() {
    return this.groupId;
  };
  OriginalColumnGroup.prototype.getId = function() {
    return this.getGroupId();
  };
  OriginalColumnGroup.prototype.setChildren = function(children) {
    this.children = children;
  };
  OriginalColumnGroup.prototype.getChildren = function() {
    return this.children;
  };
  OriginalColumnGroup.prototype.getColGroupDef = function() {
    return this.colGroupDef;
  };
  OriginalColumnGroup.prototype.getLeafColumns = function() {
    var result = [];
    this.addLeafColumns(result);
    return result;
  };
  OriginalColumnGroup.prototype.addLeafColumns = function(leafColumns) {
    this.children.forEach(function(child) {
      if (child instanceof column_1.Column) {
        leafColumns.push(child);
      } else if (child instanceof OriginalColumnGroup) {
        child.addLeafColumns(leafColumns);
      }
    });
  };
  OriginalColumnGroup.prototype.getColumnGroupShow = function() {
    if (!this.padding) {
      return this.colGroupDef.columnGroupShow;
    } else {
      return this.children[0].getColumnGroupShow();
    }
  };
  OriginalColumnGroup.prototype.calculateExpandable = function() {
    var atLeastOneShowingWhenOpen = false;
    var atLeastOneShowingWhenClosed = false;
    var atLeastOneChangeable = false;
    for (var i = 0,
        j = this.children.length; i < j; i++) {
      var abstractColumn = this.children[i];
      var headerGroupShow = abstractColumn.getColumnGroupShow();
      if (headerGroupShow === columnGroup_1.ColumnGroup.HEADER_GROUP_SHOW_OPEN) {
        atLeastOneShowingWhenOpen = true;
        atLeastOneChangeable = true;
      } else if (headerGroupShow === columnGroup_1.ColumnGroup.HEADER_GROUP_SHOW_CLOSED) {
        atLeastOneShowingWhenClosed = true;
        atLeastOneChangeable = true;
      } else {
        atLeastOneShowingWhenOpen = true;
        atLeastOneShowingWhenClosed = true;
      }
    }
    this.expandable = atLeastOneShowingWhenOpen && atLeastOneShowingWhenClosed && atLeastOneChangeable;
  };
  OriginalColumnGroup.prototype.addEventListener = function(eventType, listener) {
    this.localEventService.addEventListener(eventType, listener);
  };
  OriginalColumnGroup.prototype.removeEventListener = function(eventType, listener) {
    this.localEventService.removeEventListener(eventType, listener);
  };
  return OriginalColumnGroup;
}());
OriginalColumnGroup.EVENT_EXPANDED_CHANGED = 'expandedChanged';
exports.OriginalColumnGroup = OriginalColumnGroup;
