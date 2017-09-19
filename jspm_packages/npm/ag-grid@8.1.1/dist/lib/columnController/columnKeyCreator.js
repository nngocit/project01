/* */ 
"use strict";
var utils_1 = require('../utils');
var ColumnKeyCreator = (function() {
  function ColumnKeyCreator() {
    this.existingKeys = [];
  }
  ColumnKeyCreator.prototype.getUniqueKey = function(colId, colField) {
    colId = utils_1.Utils.toStringOrNull(colId);
    var count = 0;
    while (true) {
      var idToTry;
      if (colId) {
        idToTry = colId;
        if (count !== 0) {
          idToTry += '_' + count;
        }
      } else if (colField) {
        idToTry = colField;
        if (count !== 0) {
          idToTry += '_' + count;
        }
      } else {
        idToTry = '' + count;
      }
      if (this.existingKeys.indexOf(idToTry) < 0) {
        this.existingKeys.push(idToTry);
        return idToTry;
      }
      count++;
    }
  };
  return ColumnKeyCreator;
}());
exports.ColumnKeyCreator = ColumnKeyCreator;
