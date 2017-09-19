/* */ 
"use strict";
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function(k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(k, v);
};
var column_1 = require('./column');
var eventService_1 = require('../eventService');
var context_1 = require('../context/context');
var gridOptionsWrapper_1 = require('../gridOptionsWrapper');
var ColumnGroup = (function() {
  function ColumnGroup(originalColumnGroup, groupId, instanceId) {
    this.displayedChildren = [];
    this.localEventService = new eventService_1.EventService();
    this.groupId = groupId;
    this.instanceId = instanceId;
    this.originalColumnGroup = originalColumnGroup;
  }
  ColumnGroup.createUniqueId = function(groupId, instanceId) {
    return groupId + '_' + instanceId;
  };
  ColumnGroup.prototype.reset = function() {
    this.parent = null;
    this.children = null;
    this.displayedChildren = null;
  };
  ColumnGroup.prototype.getParent = function() {
    return this.parent;
  };
  ColumnGroup.prototype.setParent = function(parent) {
    this.parent = parent;
  };
  ColumnGroup.prototype.getUniqueId = function() {
    return ColumnGroup.createUniqueId(this.groupId, this.instanceId);
  };
  ColumnGroup.prototype.checkLeft = function() {
    this.displayedChildren.forEach(function(child) {
      if (child instanceof ColumnGroup) {
        child.checkLeft();
      }
    });
    if (this.displayedChildren.length > 0) {
      if (this.gridOptionsWrapper.isEnableRtl()) {
        var lastChild = this.displayedChildren[this.displayedChildren.length - 1];
        var lastChildLeft = lastChild.getLeft();
        this.setLeft(lastChildLeft);
      } else {
        var firstChildLeft = this.displayedChildren[0].getLeft();
        this.setLeft(firstChildLeft);
      }
    } else {
      this.setLeft(null);
    }
  };
  ColumnGroup.prototype.getLeft = function() {
    return this.left;
  };
  ColumnGroup.prototype.getOldLeft = function() {
    return this.oldLeft;
  };
  ColumnGroup.prototype.setLeft = function(left) {
    this.oldLeft = left;
    if (this.left !== left) {
      this.left = left;
      this.localEventService.dispatchEvent(ColumnGroup.EVENT_LEFT_CHANGED);
    }
  };
  ColumnGroup.prototype.addEventListener = function(eventType, listener) {
    this.localEventService.addEventListener(eventType, listener);
  };
  ColumnGroup.prototype.removeEventListener = function(eventType, listener) {
    this.localEventService.removeEventListener(eventType, listener);
  };
  ColumnGroup.prototype.getGroupId = function() {
    return this.groupId;
  };
  ColumnGroup.prototype.getInstanceId = function() {
    return this.instanceId;
  };
  ColumnGroup.prototype.isChildInThisGroupDeepSearch = function(wantedChild) {
    var result = false;
    this.children.forEach(function(foundChild) {
      if (wantedChild === foundChild) {
        result = true;
      }
      if (foundChild instanceof ColumnGroup) {
        if (foundChild.isChildInThisGroupDeepSearch(wantedChild)) {
          result = true;
        }
      }
    });
    return result;
  };
  ColumnGroup.prototype.getActualWidth = function() {
    var groupActualWidth = 0;
    if (this.displayedChildren) {
      this.displayedChildren.forEach(function(child) {
        groupActualWidth += child.getActualWidth();
      });
    }
    return groupActualWidth;
  };
  ColumnGroup.prototype.getMinWidth = function() {
    var result = 0;
    this.displayedChildren.forEach(function(groupChild) {
      result += groupChild.getMinWidth();
    });
    return result;
  };
  ColumnGroup.prototype.addChild = function(child) {
    if (!this.children) {
      this.children = [];
    }
    this.children.push(child);
  };
  ColumnGroup.prototype.getDisplayedChildren = function() {
    return this.displayedChildren;
  };
  ColumnGroup.prototype.getLeafColumns = function() {
    var result = [];
    this.addLeafColumns(result);
    return result;
  };
  ColumnGroup.prototype.getDisplayedLeafColumns = function() {
    var result = [];
    this.addDisplayedLeafColumns(result);
    return result;
  };
  ColumnGroup.prototype.getDefinition = function() {
    return this.originalColumnGroup.getColGroupDef();
  };
  ColumnGroup.prototype.getColGroupDef = function() {
    return this.originalColumnGroup.getColGroupDef();
  };
  ColumnGroup.prototype.isPadding = function() {
    return this.originalColumnGroup.isPadding();
  };
  ColumnGroup.prototype.isExpandable = function() {
    return this.originalColumnGroup.isExpandable();
  };
  ColumnGroup.prototype.isExpanded = function() {
    return this.originalColumnGroup.isExpanded();
  };
  ColumnGroup.prototype.setExpanded = function(expanded) {
    this.originalColumnGroup.setExpanded(expanded);
  };
  ColumnGroup.prototype.addDisplayedLeafColumns = function(leafColumns) {
    this.displayedChildren.forEach(function(child) {
      if (child instanceof column_1.Column) {
        leafColumns.push(child);
      } else if (child instanceof ColumnGroup) {
        child.addDisplayedLeafColumns(leafColumns);
      }
    });
  };
  ColumnGroup.prototype.addLeafColumns = function(leafColumns) {
    this.children.forEach(function(child) {
      if (child instanceof column_1.Column) {
        leafColumns.push(child);
      } else if (child instanceof ColumnGroup) {
        child.addLeafColumns(leafColumns);
      }
    });
  };
  ColumnGroup.prototype.getChildren = function() {
    return this.children;
  };
  ColumnGroup.prototype.getColumnGroupShow = function() {
    return this.originalColumnGroup.getColumnGroupShow();
  };
  ColumnGroup.prototype.getOriginalColumnGroup = function() {
    return this.originalColumnGroup;
  };
  ColumnGroup.prototype.calculateDisplayedColumns = function() {
    var _this = this;
    this.displayedChildren = [];
    if (!this.originalColumnGroup.isExpandable()) {
      this.displayedChildren = this.children;
    } else {
      this.children.forEach(function(abstractColumn) {
        var headerGroupShow = abstractColumn.getColumnGroupShow();
        switch (headerGroupShow) {
          case ColumnGroup.HEADER_GROUP_SHOW_OPEN:
            if (_this.originalColumnGroup.isExpanded()) {
              _this.displayedChildren.push(abstractColumn);
            }
            break;
          case ColumnGroup.HEADER_GROUP_SHOW_CLOSED:
            if (!_this.originalColumnGroup.isExpanded()) {
              _this.displayedChildren.push(abstractColumn);
            }
            break;
          default:
            _this.displayedChildren.push(abstractColumn);
            break;
        }
      });
    }
    this.localEventService.dispatchEvent(ColumnGroup.EVENT_DISPLAYED_CHILDREN_CHANGED);
  };
  return ColumnGroup;
}());
ColumnGroup.HEADER_GROUP_SHOW_OPEN = 'open';
ColumnGroup.HEADER_GROUP_SHOW_CLOSED = 'closed';
ColumnGroup.EVENT_LEFT_CHANGED = 'leftChanged';
ColumnGroup.EVENT_DISPLAYED_CHILDREN_CHANGED = 'leftChanged';
__decorate([context_1.Autowired('gridOptionsWrapper'), __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)], ColumnGroup.prototype, "gridOptionsWrapper", void 0);
exports.ColumnGroup = ColumnGroup;
