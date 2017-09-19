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
var aurelia_framework_1 = require('aurelia-framework');
var main_1 = require('ag-grid/main');
var aureliaFrameworkFactory_1 = require('./aureliaFrameworkFactory');
var agUtils_1 = require('./agUtils');
var AgGridAurelia = (function() {
  function AgGridAurelia(element, taskQueue, auFrameworkFactory, container, viewResources) {
    var _this = this;
    this.taskQueue = taskQueue;
    this.auFrameworkFactory = auFrameworkFactory;
    this.container = container;
    this.viewResources = viewResources;
    this._initialised = false;
    this._destroyed = false;
    this.columns = [];
    this._nativeElement = element;
    main_1.ComponentUtil.EVENTS.forEach(function(eventName) {
      _this[eventName] = function() {};
    });
  }
  AgGridAurelia.prototype.attached = function() {
    this.taskQueue.queueTask(this.initGrid.bind(this));
  };
  AgGridAurelia.prototype.initGrid = function() {
    this._initialised = false;
    this._destroyed = false;
    this.auFrameworkFactory.setContainer(this.container);
    this.auFrameworkFactory.setViewResources(this.viewResources);
    this.gridOptions = main_1.ComponentUtil.copyAttributesToGridOptions(this.gridOptions, this);
    this.gridParams = {
      globalEventListener: this.globalEventListener.bind(this),
      frameworkFactory: this.auFrameworkFactory
    };
    if (this.columns && this.columns.length > 0) {
      this.gridOptions.columnDefs = this.columns.map(function(column) {
        return column.toColDef();
      });
    }
    new main_1.Grid(this._nativeElement, this.gridOptions, this.gridParams);
    this.api = this.gridOptions.api;
    this.columnApi = this.gridOptions.columnApi;
    this._initialised = true;
  };
  AgGridAurelia.prototype.propertyChanged = function(propertyName, newValue, oldValue) {
    var changes = {};
    changes[propertyName] = {
      currentValue: newValue,
      previousValue: oldValue
    };
    if (this._initialised) {
      main_1.ComponentUtil.processOnChange(changes, this.gridOptions, this.api, this.columnApi);
    }
  };
  AgGridAurelia.prototype.detached = function() {
    if (this._initialised) {
      this._destroyed = true;
      this.api.destroy();
    }
  };
  AgGridAurelia.prototype.globalEventListener = function(eventType, event) {
    if (this._destroyed) {
      return;
    }
    var emitter = this[eventType];
    if (emitter) {
      emitter(event);
    } else {
      console.log('ag-Grid-aurelia: could not find EventEmitter: ' + eventType);
    }
  };
  return AgGridAurelia;
}());
__decorate([aurelia_framework_1.bindable(), __metadata("design:type", Object)], AgGridAurelia.prototype, "gridOptions", void 0);
__decorate([aurelia_framework_1.bindable(), __metadata("design:type", Object)], AgGridAurelia.prototype, "context", void 0);
__decorate([aurelia_framework_1.children('ag-grid-column'), __metadata("design:type", Array)], AgGridAurelia.prototype, "columns", void 0);
AgGridAurelia = __decorate([aurelia_framework_1.customElement('ag-grid-aurelia'), agUtils_1.generateBindables(main_1.ComponentUtil.ALL_PROPERTIES.filter(function(property) {
  return property !== 'gridOptions';
})), agUtils_1.generateBindables(main_1.ComponentUtil.EVENTS), aurelia_framework_1.inlineView("<template><slot></slot></template>"), aurelia_framework_1.autoinject(), __metadata("design:paramtypes", [Element, aurelia_framework_1.TaskQueue, aureliaFrameworkFactory_1.AureliaFrameworkFactory, aurelia_framework_1.Container, aurelia_framework_1.ViewResources])], AgGridAurelia);
exports.AgGridAurelia = AgGridAurelia;
