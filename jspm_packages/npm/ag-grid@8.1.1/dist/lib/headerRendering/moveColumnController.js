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
var context_1 = require('../context/context');
var logger_1 = require('../logger');
var columnController_1 = require('../columnController/columnController');
var column_1 = require('../entities/column');
var utils_1 = require('../utils');
var dragAndDropService_1 = require('../dragAndDrop/dragAndDropService');
var gridPanel_1 = require('../gridPanel/gridPanel');
var gridOptionsWrapper_1 = require('../gridOptionsWrapper');
var MoveColumnController = (function() {
  function MoveColumnController(pinned, eContainer) {
    this.needToMoveLeft = false;
    this.needToMoveRight = false;
    this.pinned = pinned;
    this.eContainer = eContainer;
    this.centerContainer = !utils_1.Utils.exists(pinned);
  }
  MoveColumnController.prototype.init = function() {
    this.logger = this.loggerFactory.create('MoveColumnController');
  };
  MoveColumnController.prototype.getIconName = function() {
    return this.pinned ? dragAndDropService_1.DragAndDropService.ICON_PINNED : dragAndDropService_1.DragAndDropService.ICON_MOVE;
  };
  MoveColumnController.prototype.onDragEnter = function(draggingEvent) {
    var columns = draggingEvent.dragSource.dragItem;
    this.columnController.setColumnsVisible(columns, true);
    this.columnController.setColumnsPinned(columns, this.pinned);
    this.onDragging(draggingEvent, true);
  };
  MoveColumnController.prototype.onDragLeave = function(draggingEvent) {
    var hideColumnOnExit = !this.gridOptionsWrapper.isSuppressDragLeaveHidesColumns() && !draggingEvent.fromNudge;
    if (hideColumnOnExit) {
      var columns = draggingEvent.dragSource.dragItem;
      this.columnController.setColumnsVisible(columns, false);
    }
    this.ensureIntervalCleared();
  };
  MoveColumnController.prototype.onDragStop = function() {
    this.ensureIntervalCleared();
  };
  MoveColumnController.prototype.normaliseX = function(x) {
    var flipHorizontallyForRtl = this.gridOptionsWrapper.isEnableRtl();
    if (flipHorizontallyForRtl) {
      var clientWidth = this.eContainer.clientWidth;
      x = clientWidth - x;
    }
    var adjustForScroll = this.centerContainer;
    if (adjustForScroll) {
      x += this.gridPanel.getBodyViewportScrollLeft();
    }
    return x;
  };
  MoveColumnController.prototype.workOutNewIndex = function(displayedColumns, allColumns, dragColumn, hDirection, xAdjustedForScroll) {
    if (hDirection === dragAndDropService_1.HDirection.Left) {
      return this.getNewIndexForColMovingLeft(displayedColumns, allColumns, dragColumn, xAdjustedForScroll);
    } else {
      return this.getNewIndexForColMovingRight(displayedColumns, allColumns, dragColumn, xAdjustedForScroll);
    }
  };
  MoveColumnController.prototype.checkCenterForScrolling = function(xAdjustedForScroll) {
    if (this.centerContainer) {
      var firstVisiblePixel = this.gridPanel.getBodyViewportScrollLeft();
      var lastVisiblePixel = firstVisiblePixel + this.gridPanel.getCenterWidth();
      if (this.gridOptionsWrapper.isEnableRtl()) {
        this.needToMoveRight = xAdjustedForScroll < (firstVisiblePixel + 50);
        this.needToMoveLeft = xAdjustedForScroll > (lastVisiblePixel - 50);
      } else {
        this.needToMoveLeft = xAdjustedForScroll < (firstVisiblePixel + 50);
        this.needToMoveRight = xAdjustedForScroll > (lastVisiblePixel - 50);
      }
      if (this.needToMoveLeft || this.needToMoveRight) {
        this.ensureIntervalStarted();
      } else {
        this.ensureIntervalCleared();
      }
    }
  };
  MoveColumnController.prototype.onDragging = function(draggingEvent, fromEnter) {
    if (fromEnter === void 0) {
      fromEnter = false;
    }
    this.lastDraggingEvent = draggingEvent;
    if (utils_1.Utils.missing(draggingEvent.hDirection)) {
      return;
    }
    var xNormalised = this.normaliseX(draggingEvent.x);
    if (!fromEnter) {
      this.checkCenterForScrolling(xNormalised);
    }
    var hDirectionNormalised = this.normaliseDirection(draggingEvent.hDirection);
    var columnsToMove = draggingEvent.dragSource.dragItem;
    this.attemptMoveColumns(columnsToMove, hDirectionNormalised, xNormalised, fromEnter);
  };
  MoveColumnController.prototype.normaliseDirection = function(hDirection) {
    if (this.gridOptionsWrapper.isEnableRtl()) {
      switch (hDirection) {
        case dragAndDropService_1.HDirection.Left:
          return dragAndDropService_1.HDirection.Right;
        case dragAndDropService_1.HDirection.Right:
          return dragAndDropService_1.HDirection.Left;
        default:
          console.error("ag-Grid: Unknown direction " + hDirection);
      }
    } else {
      return hDirection;
    }
  };
  MoveColumnController.prototype.attemptMoveColumns = function(allMovingColumns, hDirection, xAdjusted, fromEnter) {
    var displayedColumns = this.columnController.getDisplayedColumns(this.pinned);
    var gridColumns = this.columnController.getAllGridColumns();
    var draggingLeft = hDirection === dragAndDropService_1.HDirection.Left;
    var draggingRight = hDirection === dragAndDropService_1.HDirection.Right;
    var dragColumn;
    var displayedMovingColumns = utils_1.Utils.filter(allMovingColumns, function(column) {
      return displayedColumns.indexOf(column) >= 0;
    });
    if (draggingLeft) {
      dragColumn = displayedMovingColumns[0];
    } else {
      dragColumn = displayedMovingColumns[displayedMovingColumns.length - 1];
    }
    var newIndex = this.workOutNewIndex(displayedColumns, gridColumns, dragColumn, hDirection, xAdjusted);
    var oldIndex = gridColumns.indexOf(dragColumn);
    if (!fromEnter && draggingLeft && newIndex >= oldIndex) {
      return;
    }
    if (!fromEnter && draggingRight && newIndex <= oldIndex) {
      return;
    }
    if (draggingRight) {
      newIndex = newIndex - allMovingColumns.length + 1;
    }
    this.columnController.moveColumns(allMovingColumns, newIndex);
  };
  MoveColumnController.prototype.getNewIndexForColMovingLeft = function(displayedColumns, allColumns, dragColumn, x) {
    var usedX = 0;
    var leftColumn = null;
    for (var i = 0; i < displayedColumns.length; i++) {
      var currentColumn = displayedColumns[i];
      if (currentColumn === dragColumn) {
        continue;
      }
      usedX += currentColumn.getActualWidth();
      if (usedX > x) {
        break;
      }
      leftColumn = currentColumn;
    }
    var newIndex;
    if (leftColumn) {
      newIndex = allColumns.indexOf(leftColumn) + 1;
      var oldIndex = allColumns.indexOf(dragColumn);
      if (oldIndex < newIndex) {
        newIndex--;
      }
    } else {
      newIndex = 0;
    }
    return newIndex;
  };
  MoveColumnController.prototype.getNewIndexForColMovingRight = function(displayedColumns, allColumns, dragColumnOrGroup, x) {
    var dragColumn = dragColumnOrGroup;
    var usedX = dragColumn.getActualWidth();
    var leftColumn = null;
    for (var i = 0; i < displayedColumns.length; i++) {
      if (usedX > x) {
        break;
      }
      var currentColumn = displayedColumns[i];
      if (currentColumn === dragColumn) {
        continue;
      }
      usedX += currentColumn.getActualWidth();
      leftColumn = currentColumn;
    }
    var newIndex;
    if (leftColumn) {
      newIndex = allColumns.indexOf(leftColumn) + 1;
      var oldIndex = allColumns.indexOf(dragColumn);
      if (oldIndex < newIndex) {
        newIndex--;
      }
    } else {
      newIndex = 0;
    }
    return newIndex;
  };
  MoveColumnController.prototype.ensureIntervalStarted = function() {
    if (!this.movingIntervalId) {
      this.intervalCount = 0;
      this.failedMoveAttempts = 0;
      this.movingIntervalId = setInterval(this.moveInterval.bind(this), 100);
      if (this.needToMoveLeft) {
        this.dragAndDropService.setGhostIcon(dragAndDropService_1.DragAndDropService.ICON_LEFT, true);
      } else {
        this.dragAndDropService.setGhostIcon(dragAndDropService_1.DragAndDropService.ICON_RIGHT, true);
      }
    }
  };
  MoveColumnController.prototype.ensureIntervalCleared = function() {
    if (this.moveInterval) {
      clearInterval(this.movingIntervalId);
      this.movingIntervalId = null;
      this.dragAndDropService.setGhostIcon(dragAndDropService_1.DragAndDropService.ICON_MOVE);
    }
  };
  MoveColumnController.prototype.moveInterval = function() {
    var pixelsToMove;
    this.intervalCount++;
    pixelsToMove = 10 + (this.intervalCount * 5);
    if (pixelsToMove > 100) {
      pixelsToMove = 100;
    }
    var pixelsMoved;
    if (this.needToMoveLeft) {
      pixelsMoved = this.gridPanel.scrollHorizontally(-pixelsToMove);
    } else if (this.needToMoveRight) {
      pixelsMoved = this.gridPanel.scrollHorizontally(pixelsToMove);
    }
    if (pixelsMoved !== 0) {
      this.onDragging(this.lastDraggingEvent);
      this.failedMoveAttempts = 0;
    } else {
      this.failedMoveAttempts++;
      this.dragAndDropService.setGhostIcon(dragAndDropService_1.DragAndDropService.ICON_PINNED);
      if (this.failedMoveAttempts > 7) {
        var columns = this.lastDraggingEvent.dragSource.dragItem;
        var pinType = this.needToMoveLeft ? column_1.Column.PINNED_LEFT : column_1.Column.PINNED_RIGHT;
        this.columnController.setColumnsPinned(columns, pinType);
        this.dragAndDropService.nudge();
      }
    }
  };
  return MoveColumnController;
}());
__decorate([context_1.Autowired('loggerFactory'), __metadata("design:type", logger_1.LoggerFactory)], MoveColumnController.prototype, "loggerFactory", void 0);
__decorate([context_1.Autowired('columnController'), __metadata("design:type", columnController_1.ColumnController)], MoveColumnController.prototype, "columnController", void 0);
__decorate([context_1.Autowired('gridPanel'), __metadata("design:type", gridPanel_1.GridPanel)], MoveColumnController.prototype, "gridPanel", void 0);
__decorate([context_1.Autowired('dragAndDropService'), __metadata("design:type", dragAndDropService_1.DragAndDropService)], MoveColumnController.prototype, "dragAndDropService", void 0);
__decorate([context_1.Autowired('gridOptionsWrapper'), __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)], MoveColumnController.prototype, "gridOptionsWrapper", void 0);
__decorate([context_1.PostConstruct, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], MoveColumnController.prototype, "init", null);
exports.MoveColumnController = MoveColumnController;
