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
var rowRenderer_1 = require('./rowRenderer');
var gridPanel_1 = require('../gridPanel/gridPanel');
var context_1 = require('../context/context');
var context_2 = require('../context/context');
var headerRenderer_1 = require('../headerRendering/headerRenderer');
var renderedHeaderCell_1 = require('../headerRendering/deprecated/renderedHeaderCell');
var gridOptionsWrapper_1 = require('../gridOptionsWrapper');
var headerWrapperComp_1 = require('../headerRendering/header/headerWrapperComp');
var AutoWidthCalculator = (function() {
  function AutoWidthCalculator() {}
  AutoWidthCalculator.prototype.getPreferredWidthForColumn = function(column) {
    var eHeaderCell = this.getHeaderCellForColumn(column);
    if (!eHeaderCell) {
      return -1;
    }
    var eDummyContainer = document.createElement('span');
    eDummyContainer.style.position = 'fixed';
    var eBodyContainer = this.gridPanel.getBodyContainer();
    eBodyContainer.appendChild(eDummyContainer);
    this.putRowCellsIntoDummyContainer(column, eDummyContainer);
    this.cloneItemIntoDummy(eHeaderCell, eDummyContainer);
    var dummyContainerWidth = eDummyContainer.offsetWidth;
    eBodyContainer.removeChild(eDummyContainer);
    var autoSizePadding = this.gridOptionsWrapper.getAutoSizePadding();
    if (typeof autoSizePadding !== 'number' || autoSizePadding < 0) {
      autoSizePadding = 4;
    }
    return dummyContainerWidth + autoSizePadding;
  };
  AutoWidthCalculator.prototype.getHeaderCellForColumn = function(column) {
    var comp = null;
    this.headerRenderer.forEachHeaderElement(function(headerElement) {
      if (headerElement instanceof renderedHeaderCell_1.RenderedHeaderCell) {
        var currentCell = headerElement;
        if (currentCell.getColumn() === column) {
          comp = currentCell;
        }
      } else if (headerElement instanceof headerWrapperComp_1.HeaderWrapperComp) {
        var headerWrapperComp = headerElement;
        if (headerWrapperComp.getColumn() === column) {
          comp = headerWrapperComp;
        }
      }
    });
    return comp ? comp.getGui() : null;
  };
  AutoWidthCalculator.prototype.putRowCellsIntoDummyContainer = function(column, eDummyContainer) {
    var _this = this;
    var eOriginalCells = this.rowRenderer.getAllCellsForColumn(column);
    eOriginalCells.forEach(function(eCell, index) {
      _this.cloneItemIntoDummy(eCell, eDummyContainer);
    });
  };
  AutoWidthCalculator.prototype.cloneItemIntoDummy = function(eCell, eDummyContainer) {
    var eCellClone = eCell.cloneNode(true);
    eCellClone.style.width = '';
    eCellClone.style.position = 'static';
    eCellClone.style.left = '';
    var eCloneParent = document.createElement('div');
    eCloneParent.style.display = 'table-row';
    eCloneParent.appendChild(eCellClone);
    eDummyContainer.appendChild(eCloneParent);
  };
  return AutoWidthCalculator;
}());
__decorate([context_2.Autowired('rowRenderer'), __metadata("design:type", rowRenderer_1.RowRenderer)], AutoWidthCalculator.prototype, "rowRenderer", void 0);
__decorate([context_2.Autowired('headerRenderer'), __metadata("design:type", headerRenderer_1.HeaderRenderer)], AutoWidthCalculator.prototype, "headerRenderer", void 0);
__decorate([context_2.Autowired('gridPanel'), __metadata("design:type", gridPanel_1.GridPanel)], AutoWidthCalculator.prototype, "gridPanel", void 0);
__decorate([context_2.Autowired('gridOptionsWrapper'), __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)], AutoWidthCalculator.prototype, "gridOptionsWrapper", void 0);
AutoWidthCalculator = __decorate([context_1.Bean('autoWidthCalculator')], AutoWidthCalculator);
exports.AutoWidthCalculator = AutoWidthCalculator;
