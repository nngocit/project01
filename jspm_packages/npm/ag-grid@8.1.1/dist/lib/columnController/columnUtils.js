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
var gridOptionsWrapper_1 = require('../gridOptionsWrapper');
var columnGroup_1 = require('../entities/columnGroup');
var originalColumnGroup_1 = require('../entities/originalColumnGroup');
var context_1 = require('../context/context');
var context_2 = require('../context/context');
var ColumnUtils = (function() {
  function ColumnUtils() {}
  ColumnUtils.prototype.calculateColInitialWidth = function(colDef) {
    if (!colDef.width) {
      return this.gridOptionsWrapper.getColWidth();
    } else if (colDef.width < this.gridOptionsWrapper.getMinColWidth()) {
      return this.gridOptionsWrapper.getMinColWidth();
    } else {
      return colDef.width;
    }
  };
  ColumnUtils.prototype.getOriginalPathForColumn = function(column, originalBalancedTree) {
    var result = [];
    var found = false;
    recursePath(originalBalancedTree, 0);
    if (found) {
      return result;
    } else {
      return null;
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
  ColumnUtils.prototype.depthFirstOriginalTreeSearch = function(tree, callback) {
    var _this = this;
    if (!tree) {
      return;
    }
    tree.forEach(function(child) {
      if (child instanceof originalColumnGroup_1.OriginalColumnGroup) {
        _this.depthFirstOriginalTreeSearch(child.getChildren(), callback);
      }
      callback(child);
    });
  };
  ColumnUtils.prototype.depthFirstAllColumnTreeSearch = function(tree, callback) {
    var _this = this;
    if (!tree) {
      return;
    }
    tree.forEach(function(child) {
      if (child instanceof columnGroup_1.ColumnGroup) {
        _this.depthFirstAllColumnTreeSearch(child.getChildren(), callback);
      }
      callback(child);
    });
  };
  ColumnUtils.prototype.depthFirstDisplayedColumnTreeSearch = function(tree, callback) {
    var _this = this;
    if (!tree) {
      return;
    }
    tree.forEach(function(child) {
      if (child instanceof columnGroup_1.ColumnGroup) {
        _this.depthFirstDisplayedColumnTreeSearch(child.getDisplayedChildren(), callback);
      }
      callback(child);
    });
  };
  return ColumnUtils;
}());
__decorate([context_2.Autowired('gridOptionsWrapper'), __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)], ColumnUtils.prototype, "gridOptionsWrapper", void 0);
ColumnUtils = __decorate([context_1.Bean('columnUtils')], ColumnUtils);
exports.ColumnUtils = ColumnUtils;
