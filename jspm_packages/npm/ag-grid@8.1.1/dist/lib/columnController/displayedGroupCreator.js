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
var columnUtils_1 = require('./columnUtils');
var columnGroup_1 = require('../entities/columnGroup');
var originalColumnGroup_1 = require('../entities/originalColumnGroup');
var context_1 = require('../context/context');
var utils_1 = require('../utils');
var context_2 = require('../context/context');
var DisplayedGroupCreator = (function() {
  function DisplayedGroupCreator() {}
  DisplayedGroupCreator.prototype.createDisplayedGroups = function(sortedVisibleColumns, balancedColumnTree, groupInstanceIdCreator, oldDisplayedGroups) {
    var _this = this;
    var result = [];
    var previousRealPath;
    var previousOriginalPath;
    var oldColumnsMapped = this.mapOldGroupsById(oldDisplayedGroups);
    sortedVisibleColumns.forEach(function(currentColumn) {
      var currentOriginalPath = _this.getOriginalPathForColumn(balancedColumnTree, currentColumn);
      var currentRealPath = [];
      var firstColumn = !previousOriginalPath;
      for (var i = 0; i < currentOriginalPath.length; i++) {
        if (firstColumn || currentOriginalPath[i] !== previousOriginalPath[i]) {
          var newGroup = _this.createColumnGroup(currentOriginalPath[i], groupInstanceIdCreator, oldColumnsMapped);
          currentRealPath[i] = newGroup;
          if (i == 0) {
            result.push(newGroup);
          } else {
            currentRealPath[i - 1].addChild(newGroup);
          }
        } else {
          currentRealPath[i] = previousRealPath[i];
        }
      }
      var noColumnGroups = currentRealPath.length === 0;
      if (noColumnGroups) {
        result.push(currentColumn);
      } else {
        var leafGroup = currentRealPath[currentRealPath.length - 1];
        leafGroup.addChild(currentColumn);
      }
      previousRealPath = currentRealPath;
      previousOriginalPath = currentOriginalPath;
    });
    this.setupParentsIntoColumns(result, null);
    return result;
  };
  DisplayedGroupCreator.prototype.createColumnGroup = function(originalGroup, groupInstanceIdCreator, oldColumnsMapped) {
    var groupId = originalGroup.getGroupId();
    var instanceId = groupInstanceIdCreator.getInstanceIdForKey(groupId);
    var uniqueId = columnGroup_1.ColumnGroup.createUniqueId(groupId, instanceId);
    var columnGroup = oldColumnsMapped[uniqueId];
    if (columnGroup && columnGroup.getOriginalColumnGroup() !== originalGroup) {
      columnGroup = null;
    }
    if (utils_1.Utils.exists(columnGroup)) {
      columnGroup.reset();
    } else {
      columnGroup = new columnGroup_1.ColumnGroup(originalGroup, groupId, instanceId);
      this.context.wireBean(columnGroup);
    }
    return columnGroup;
  };
  DisplayedGroupCreator.prototype.mapOldGroupsById = function(displayedGroups) {
    var result = {};
    var recursive = function(columnsOrGroups) {
      columnsOrGroups.forEach(function(columnOrGroup) {
        if (columnOrGroup instanceof columnGroup_1.ColumnGroup) {
          var columnGroup = columnOrGroup;
          result[columnOrGroup.getUniqueId()] = columnGroup;
          recursive(columnGroup.getChildren());
        }
      });
    };
    if (displayedGroups) {
      recursive(displayedGroups);
    }
    return result;
  };
  DisplayedGroupCreator.prototype.setupParentsIntoColumns = function(columnsOrGroups, parent) {
    var _this = this;
    columnsOrGroups.forEach(function(columnsOrGroup) {
      columnsOrGroup.setParent(parent);
      if (columnsOrGroup instanceof columnGroup_1.ColumnGroup) {
        var columnGroup = columnsOrGroup;
        _this.setupParentsIntoColumns(columnGroup.getChildren(), columnGroup);
      }
    });
  };
  DisplayedGroupCreator.prototype.createFakePath = function(balancedColumnTree) {
    var result = [];
    var currentChildren = balancedColumnTree;
    var index = 0;
    while (currentChildren && currentChildren[0] && currentChildren[0] instanceof originalColumnGroup_1.OriginalColumnGroup) {
      result.push(new originalColumnGroup_1.OriginalColumnGroup(null, 'FAKE_PATH_' + index, true));
      currentChildren = currentChildren[0].getChildren();
      index++;
    }
    return result;
  };
  DisplayedGroupCreator.prototype.getOriginalPathForColumn = function(balancedColumnTree, column) {
    var result = [];
    var found = false;
    recursePath(balancedColumnTree, 0);
    if (found) {
      return result;
    } else {
      return this.createFakePath(balancedColumnTree);
    }
    function recursePath(balancedColumnTree, dept) {
      for (var i = 0; i < balancedColumnTree.length; i++) {
        if (found) {
          return;
        }
        var node = balancedColumnTree[i];
        if (node instanceof originalColumnGroup_1.OriginalColumnGroup) {
          var nextNode = node;
          recursePath(nextNode.getChildren(), dept + 1);
          result[dept] = node;
        } else {
          if (node === column) {
            found = true;
          }
        }
      }
    }
  };
  return DisplayedGroupCreator;
}());
__decorate([context_2.Autowired('columnUtils'), __metadata("design:type", columnUtils_1.ColumnUtils)], DisplayedGroupCreator.prototype, "columnUtils", void 0);
__decorate([context_2.Autowired('context'), __metadata("design:type", context_1.Context)], DisplayedGroupCreator.prototype, "context", void 0);
DisplayedGroupCreator = __decorate([context_1.Bean('displayedGroupCreator')], DisplayedGroupCreator);
exports.DisplayedGroupCreator = DisplayedGroupCreator;
