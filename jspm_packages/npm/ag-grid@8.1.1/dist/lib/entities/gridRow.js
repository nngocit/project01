/* */ 
"use strict";
var constants_1 = require('../constants');
var utils_1 = require('../utils');
var gridCell_1 = require('./gridCell');
var GridRow = (function() {
  function GridRow(rowIndex, floating) {
    this.rowIndex = rowIndex;
    this.floating = utils_1.Utils.makeNull(floating);
  }
  GridRow.prototype.isFloatingTop = function() {
    return this.floating === constants_1.Constants.FLOATING_TOP;
  };
  GridRow.prototype.isFloatingBottom = function() {
    return this.floating === constants_1.Constants.FLOATING_BOTTOM;
  };
  GridRow.prototype.isNotFloating = function() {
    return !this.isFloatingBottom() && !this.isFloatingTop();
  };
  GridRow.prototype.equals = function(otherSelection) {
    return this.rowIndex === otherSelection.rowIndex && this.floating === otherSelection.floating;
  };
  GridRow.prototype.toString = function() {
    return "rowIndex = " + this.rowIndex + ", floating = " + this.floating;
  };
  GridRow.prototype.getGridCell = function(column) {
    var gridCellDef = {
      rowIndex: this.rowIndex,
      floating: this.floating,
      column: column
    };
    return new gridCell_1.GridCell(gridCellDef);
  };
  GridRow.prototype.before = function(otherSelection) {
    var otherFloating = otherSelection.floating;
    switch (this.floating) {
      case constants_1.Constants.FLOATING_TOP:
        if (otherFloating !== constants_1.Constants.FLOATING_TOP) {
          return true;
        }
        break;
      case constants_1.Constants.FLOATING_BOTTOM:
        if (otherFloating !== constants_1.Constants.FLOATING_BOTTOM) {
          return false;
        }
        break;
      default:
        if (utils_1.Utils.exists(otherFloating)) {
          if (otherFloating === constants_1.Constants.FLOATING_TOP) {
            return false;
          } else {
            return true;
          }
        }
        break;
    }
    return this.rowIndex <= otherSelection.rowIndex;
  };
  return GridRow;
}());
exports.GridRow = GridRow;
