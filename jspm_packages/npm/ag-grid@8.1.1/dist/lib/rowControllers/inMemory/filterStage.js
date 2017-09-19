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
var context_1 = require('../../context/context');
var context_2 = require('../../context/context');
var gridOptionsWrapper_1 = require('../../gridOptionsWrapper');
var filterManager_1 = require('../../filter/filterManager');
var FilterStage = (function() {
  function FilterStage() {}
  FilterStage.prototype.execute = function(params) {
    var rowNode = params.rowNode;
    var filterActive;
    if (this.gridOptionsWrapper.isEnableServerSideFilter()) {
      filterActive = false;
    } else {
      filterActive = this.filterManager.isAnyFilterPresent();
    }
    this.recursivelyFilter(rowNode, filterActive);
  };
  FilterStage.prototype.recursivelyFilter = function(rowNode, filterActive) {
    var _this = this;
    rowNode.childrenAfterGroup.forEach(function(child) {
      if (child.group) {
        _this.recursivelyFilter(child, filterActive);
      }
    });
    var filterResult;
    if (filterActive) {
      filterResult = [];
      rowNode.childrenAfterGroup.forEach(function(childNode) {
        if (childNode.group) {
          if (childNode.childrenAfterFilter.length > 0) {
            filterResult.push(childNode);
          }
        } else {
          if (_this.filterManager.doesRowPassFilter(childNode)) {
            filterResult.push(childNode);
          }
        }
      });
    } else {
      filterResult = rowNode.childrenAfterGroup;
    }
    rowNode.childrenAfterFilter = filterResult;
    this.setAllChildrenCount(rowNode);
  };
  FilterStage.prototype.setAllChildrenCount = function(rowNode) {
    var allChildrenCount = 0;
    rowNode.childrenAfterFilter.forEach(function(child) {
      if (child.group) {
        allChildrenCount += child.allChildrenCount;
      } else {
        allChildrenCount++;
      }
    });
    rowNode.allChildrenCount = allChildrenCount;
  };
  return FilterStage;
}());
__decorate([context_2.Autowired('gridOptionsWrapper'), __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)], FilterStage.prototype, "gridOptionsWrapper", void 0);
__decorate([context_2.Autowired('filterManager'), __metadata("design:type", filterManager_1.FilterManager)], FilterStage.prototype, "filterManager", void 0);
FilterStage = __decorate([context_1.Bean('filterStage')], FilterStage);
exports.FilterStage = FilterStage;
