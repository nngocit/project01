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
var utils_1 = require('../utils');
var context_1 = require('../context/context');
var cellRendererFactory_1 = require('./cellRendererFactory');
var CellRendererService = (function() {
  function CellRendererService() {}
  CellRendererService.prototype.useCellRenderer = function(cellRendererKey, eTarget, params) {
    var cellRenderer = this.lookUpCellRenderer(cellRendererKey);
    if (utils_1.Utils.missing(cellRenderer)) {
      return;
    }
    var resultFromRenderer;
    var iCellRendererInstance = null;
    this.checkForDeprecatedItems(cellRenderer);
    var rendererIsAComponent = this.doesImplementICellRenderer(cellRenderer);
    if (rendererIsAComponent) {
      var CellRendererClass = cellRenderer;
      iCellRendererInstance = new CellRendererClass();
      this.context.wireBean(iCellRendererInstance);
      if (iCellRendererInstance.init) {
        iCellRendererInstance.init(params);
      }
      resultFromRenderer = iCellRendererInstance.getGui();
    } else {
      var cellRendererFunc = cellRenderer;
      resultFromRenderer = cellRendererFunc(params);
    }
    if (resultFromRenderer === null || resultFromRenderer === '') {
      return;
    }
    if (utils_1.Utils.isNodeOrElement(resultFromRenderer)) {
      eTarget.appendChild(resultFromRenderer);
    } else {
      eTarget.innerHTML = resultFromRenderer;
    }
    return iCellRendererInstance;
  };
  CellRendererService.prototype.checkForDeprecatedItems = function(cellRenderer) {
    if (cellRenderer && cellRenderer.renderer) {
      console.warn('ag-grid: colDef.cellRenderer should not be an object, it should be a string, function or class. this ' + 'changed in v4.1.x, please check the documentation on Cell Rendering, or if you are doing grouping, look at the grouping examples.');
    }
  };
  CellRendererService.prototype.doesImplementICellRenderer = function(cellRenderer) {
    return cellRenderer.prototype && 'getGui' in cellRenderer.prototype;
  };
  CellRendererService.prototype.lookUpCellRenderer = function(cellRendererKey) {
    if (typeof cellRendererKey === 'string') {
      return this.cellRendererFactory.getCellRenderer(cellRendererKey);
    } else {
      return cellRendererKey;
    }
  };
  return CellRendererService;
}());
__decorate([context_1.Autowired('cellRendererFactory'), __metadata("design:type", cellRendererFactory_1.CellRendererFactory)], CellRendererService.prototype, "cellRendererFactory", void 0);
__decorate([context_1.Autowired('context'), __metadata("design:type", context_1.Context)], CellRendererService.prototype, "context", void 0);
CellRendererService = __decorate([context_1.Bean('cellRendererService')], CellRendererService);
exports.CellRendererService = CellRendererService;
