/* */ 
"use strict";
var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p))
      d[p] = b[p];
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var component_1 = require('../../widgets/component');
var column_1 = require('../../entities/column');
var utils_1 = require('../../utils');
var columnGroup_1 = require('../../entities/columnGroup');
var columnController_1 = require('../../columnController/columnController');
var gridOptionsWrapper_1 = require('../../gridOptionsWrapper');
var horizontalDragService_1 = require('../horizontalDragService');
var context_1 = require('../../context/context');
var cssClassApplier_1 = require('../cssClassApplier');
var dragAndDropService_1 = require('../../dragAndDrop/dragAndDropService');
var setLeftFeature_1 = require('../../rendering/features/setLeftFeature');
var componentProvider_1 = require('../../componentProvider');
var HeaderGroupWrapperComp = (function(_super) {
  __extends(HeaderGroupWrapperComp, _super);
  function HeaderGroupWrapperComp(columnGroup, eRoot, dragSourceDropTarget, pinned) {
    var _this = _super.call(this, HeaderGroupWrapperComp.TEMPLATE) || this;
    _this.childColumnsDestroyFuncs = [];
    _this.columnGroup = columnGroup;
    _this.eRoot = eRoot;
    _this.dragSourceDropTarget = dragSourceDropTarget;
    _this.pinned = pinned;
    return _this;
  }
  HeaderGroupWrapperComp.prototype.postConstruct = function() {
    cssClassApplier_1.CssClassApplier.addHeaderClassesFromColDef(this.columnGroup.getColGroupDef(), this.getGui(), this.gridOptionsWrapper, null, this.columnGroup);
    var displayName = this.columnController.getDisplayNameForColumnGroup(this.columnGroup, 'header');
    var headerComponent = this.appendHeaderGroupComp(displayName);
    this.setupResize();
    this.addClasses();
    this.setupMove(headerComponent.getGui(), displayName);
    this.setupWidth();
    this.addFeature(this.context, new setLeftFeature_1.SetLeftFeature(this.columnGroup, this.getGui()));
  };
  HeaderGroupWrapperComp.prototype.appendHeaderGroupComp = function(displayName) {
    var _this = this;
    var params = {
      displayName: displayName,
      columnGroup: this.columnGroup,
      setExpanded: function(expanded) {
        _this.columnController.setColumnGroupOpened(_this.columnGroup, expanded);
      }
    };
    var headerComp = this.componentProvider.newHeaderGroupComponent(params);
    this.appendChild(headerComp);
    return headerComp;
  };
  HeaderGroupWrapperComp.prototype.addClasses = function() {
    if (this.columnGroup.isPadding()) {
      this.addCssClass('ag-header-group-cell-no-group');
    } else {
      this.addCssClass('ag-header-group-cell-with-group');
    }
  };
  HeaderGroupWrapperComp.prototype.setupMove = function(eHeaderGroup, displayName) {
    var _this = this;
    if (!eHeaderGroup) {
      return;
    }
    if (this.isSuppressMoving()) {
      return;
    }
    if (eHeaderGroup) {
      var dragSource = {
        type: dragAndDropService_1.DragSourceType.HeaderCell,
        eElement: eHeaderGroup,
        dragItemName: displayName,
        dragItem: this.getAllColumnsInThisGroup(),
        dragSourceDropTarget: this.dragSourceDropTarget
      };
      this.dragAndDropService.addDragSource(dragSource, true);
      this.addDestroyFunc(function() {
        return _this.dragAndDropService.removeDragSource(dragSource);
      });
    }
  };
  HeaderGroupWrapperComp.prototype.getAllColumnsInThisGroup = function() {
    var allColumnsOriginalOrder = this.columnGroup.getOriginalColumnGroup().getLeafColumns();
    var allColumnsCurrentOrder = [];
    this.columnController.getAllDisplayedColumns().forEach(function(column) {
      if (allColumnsOriginalOrder.indexOf(column) >= 0) {
        allColumnsCurrentOrder.push(column);
        utils_1.Utils.removeFromArray(allColumnsOriginalOrder, column);
      }
    });
    allColumnsOriginalOrder.forEach(function(column) {
      return allColumnsCurrentOrder.push(column);
    });
    return allColumnsCurrentOrder;
  };
  HeaderGroupWrapperComp.prototype.isSuppressMoving = function() {
    var childSuppressesMoving = false;
    this.columnGroup.getLeafColumns().forEach(function(column) {
      if (column.getColDef().suppressMovable) {
        childSuppressesMoving = true;
      }
    });
    var result = childSuppressesMoving || this.gridOptionsWrapper.isSuppressMovableColumns() || this.gridOptionsWrapper.isForPrint();
    return result;
  };
  HeaderGroupWrapperComp.prototype.setupWidth = function() {
    this.addListenersToChildrenColumns();
    this.addDestroyableEventListener(this.columnGroup, columnGroup_1.ColumnGroup.EVENT_DISPLAYED_CHILDREN_CHANGED, this.onDisplayedChildrenChanged.bind(this));
    this.onWidthChanged();
    this.addDestroyFunc(this.destroyListenersOnChildrenColumns.bind(this));
  };
  HeaderGroupWrapperComp.prototype.onDisplayedChildrenChanged = function() {
    this.addListenersToChildrenColumns();
    this.onWidthChanged();
  };
  HeaderGroupWrapperComp.prototype.addListenersToChildrenColumns = function() {
    var _this = this;
    this.destroyListenersOnChildrenColumns();
    var widthChangedListener = this.onWidthChanged.bind(this);
    this.columnGroup.getLeafColumns().forEach(function(column) {
      column.addEventListener(column_1.Column.EVENT_WIDTH_CHANGED, widthChangedListener);
      column.addEventListener(column_1.Column.EVENT_VISIBLE_CHANGED, widthChangedListener);
      _this.childColumnsDestroyFuncs.push(function() {
        column.removeEventListener(column_1.Column.EVENT_WIDTH_CHANGED, widthChangedListener);
        column.removeEventListener(column_1.Column.EVENT_VISIBLE_CHANGED, widthChangedListener);
      });
    });
  };
  HeaderGroupWrapperComp.prototype.destroyListenersOnChildrenColumns = function() {
    this.childColumnsDestroyFuncs.forEach(function(func) {
      return func();
    });
    this.childColumnsDestroyFuncs = [];
  };
  HeaderGroupWrapperComp.prototype.onWidthChanged = function() {
    this.getGui().style.width = this.columnGroup.getActualWidth() + 'px';
  };
  HeaderGroupWrapperComp.prototype.setupResize = function() {
    var _this = this;
    this.eHeaderCellResize = this.getRefElement('agResize');
    if (!this.gridOptionsWrapper.isEnableColResize()) {
      utils_1.Utils.removeFromParent(this.eHeaderCellResize);
      return;
    }
    this.dragService.addDragHandling({
      eDraggableElement: this.eHeaderCellResize,
      eBody: this.eRoot,
      cursor: 'col-resize',
      startAfterPixels: 0,
      onDragStart: this.onDragStart.bind(this),
      onDragging: this.onDragging.bind(this)
    });
    if (!this.gridOptionsWrapper.isSuppressAutoSize()) {
      this.eHeaderCellResize.addEventListener('dblclick', function(event) {
        var keys = [];
        _this.columnGroup.getDisplayedLeafColumns().forEach(function(column) {
          if (!column.getColDef().suppressAutoSize) {
            keys.push(column.getColId());
          }
        });
        if (keys.length > 0) {
          _this.columnController.autoSizeColumns(keys);
        }
      });
    }
  };
  HeaderGroupWrapperComp.prototype.onDragStart = function() {
    var _this = this;
    this.groupWidthStart = this.columnGroup.getActualWidth();
    this.childrenWidthStarts = [];
    this.columnGroup.getDisplayedLeafColumns().forEach(function(column) {
      _this.childrenWidthStarts.push(column.getActualWidth());
    });
  };
  HeaderGroupWrapperComp.prototype.onDragging = function(dragChange, finished) {
    var _this = this;
    var dragChangeNormalised = this.normaliseDragChange(dragChange);
    var newWidth = this.groupWidthStart + dragChangeNormalised;
    var minWidth = this.columnGroup.getMinWidth();
    if (newWidth < minWidth) {
      newWidth = minWidth;
    }
    var changeRatio = newWidth / this.groupWidthStart;
    var pixelsToDistribute = newWidth;
    var displayedColumns = this.columnGroup.getDisplayedLeafColumns();
    displayedColumns.forEach(function(column, index) {
      var notLastCol = index !== (displayedColumns.length - 1);
      var newChildSize;
      if (notLastCol) {
        var startChildSize = _this.childrenWidthStarts[index];
        newChildSize = startChildSize * changeRatio;
        if (newChildSize < column.getMinWidth()) {
          newChildSize = column.getMinWidth();
        }
        pixelsToDistribute -= newChildSize;
      } else {
        newChildSize = pixelsToDistribute;
      }
      _this.columnController.setColumnWidth(column, newChildSize, finished);
    });
  };
  HeaderGroupWrapperComp.prototype.normaliseDragChange = function(dragChange) {
    var result = dragChange;
    if (this.gridOptionsWrapper.isEnableRtl()) {
      if (this.pinned !== column_1.Column.PINNED_LEFT) {
        result *= -1;
      }
    } else {
      if (this.pinned === column_1.Column.PINNED_RIGHT) {
        result *= -1;
      }
    }
    return result;
  };
  return HeaderGroupWrapperComp;
}(component_1.Component));
HeaderGroupWrapperComp.TEMPLATE = '<div class="ag-header-group-cell">' + '<div ref="agResize" class="ag-header-cell-resize"></div>' + '</div>';
__decorate([context_1.Autowired('gridOptionsWrapper'), __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)], HeaderGroupWrapperComp.prototype, "gridOptionsWrapper", void 0);
__decorate([context_1.Autowired('columnController'), __metadata("design:type", columnController_1.ColumnController)], HeaderGroupWrapperComp.prototype, "columnController", void 0);
__decorate([context_1.Autowired('horizontalDragService'), __metadata("design:type", horizontalDragService_1.HorizontalDragService)], HeaderGroupWrapperComp.prototype, "dragService", void 0);
__decorate([context_1.Autowired('dragAndDropService'), __metadata("design:type", dragAndDropService_1.DragAndDropService)], HeaderGroupWrapperComp.prototype, "dragAndDropService", void 0);
__decorate([context_1.Autowired('context'), __metadata("design:type", context_1.Context)], HeaderGroupWrapperComp.prototype, "context", void 0);
__decorate([context_1.Autowired('componentProvider'), __metadata("design:type", componentProvider_1.ComponentProvider)], HeaderGroupWrapperComp.prototype, "componentProvider", void 0);
__decorate([context_1.PostConstruct, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], HeaderGroupWrapperComp.prototype, "postConstruct", null);
exports.HeaderGroupWrapperComp = HeaderGroupWrapperComp;
