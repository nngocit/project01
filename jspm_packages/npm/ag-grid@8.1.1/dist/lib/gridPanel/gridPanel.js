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
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var utils_1 = require('../utils');
var masterSlaveService_1 = require('../masterSlaveService');
var gridOptionsWrapper_1 = require('../gridOptionsWrapper');
var columnController_1 = require('../columnController/columnController');
var rowRenderer_1 = require('../rendering/rowRenderer');
var floatingRowModel_1 = require('../rowControllers/floatingRowModel');
var borderLayout_1 = require('../layout/borderLayout');
var logger_1 = require('../logger');
var context_1 = require('../context/context');
var eventService_1 = require('../eventService');
var events_1 = require('../events');
var dragService_1 = require('../dragAndDrop/dragService');
var constants_1 = require('../constants');
var selectionController_1 = require('../selectionController');
var csvCreator_1 = require('../csvCreator');
var mouseEventService_1 = require('./mouseEventService');
var focusedCellController_1 = require('../focusedCellController');
var scrollVisibleService_1 = require('./scrollVisibleService');
var beanStub_1 = require('../context/beanStub');
var rowContainerComponent_1 = require('../rendering/rowContainerComponent');
var gridHtml = '<div class="ag-root ag-font-style">' + '<div class="ag-header">' + '<div class="ag-pinned-left-header"></div>' + '<div class="ag-pinned-right-header"></div>' + '<div class="ag-header-viewport">' + '<div class="ag-header-container"></div>' + '</div>' + '<div class="ag-header-overlay"></div>' + '</div>' + '<div class="ag-floating-top">' + '<div class="ag-pinned-left-floating-top"></div>' + '<div class="ag-pinned-right-floating-top"></div>' + '<div class="ag-floating-top-viewport">' + '<div class="ag-floating-top-container"></div>' + '</div>' + '<div class="ag-floating-top-full-width-container"></div>' + '</div>' + '<div class="ag-floating-bottom">' + '<div class="ag-pinned-left-floating-bottom"></div>' + '<div class="ag-pinned-right-floating-bottom"></div>' + '<div class="ag-floating-bottom-viewport">' + '<div class="ag-floating-bottom-container"></div>' + '</div>' + '<div class="ag-floating-bottom-full-width-container"></div>' + '</div>' + '<div class="ag-body">' + '<div class="ag-pinned-left-cols-viewport">' + '<div class="ag-pinned-left-cols-container"></div>' + '</div>' + '<div class="ag-pinned-right-cols-viewport">' + '<div class="ag-pinned-right-cols-container"></div>' + '</div>' + '<div class="ag-body-viewport-wrapper">' + '<div class="ag-body-viewport">' + '<div class="ag-body-container"></div>' + '</div>' + '</div>' + '<div class="ag-full-width-viewport">' + '<div class="ag-full-width-container"></div>' + '</div>' + '</div>' + '</div>';
var gridForPrintHtml = '<div class="ag-root ag-font-style">' + '<div class="ag-header-container"></div>' + '<div class="ag-floating-top-container"></div>' + '<div class="ag-body-container"></div>' + '<div class="ag-floating-bottom-container"></div>' + '</div>';
var mainOverlayTemplate = '<div class="ag-overlay-panel">' + '<div class="ag-overlay-wrapper ag-overlay-[OVERLAY_NAME]-wrapper">[OVERLAY_TEMPLATE]</div>' + '</div>';
var defaultLoadingOverlayTemplate = '<span class="ag-overlay-loading-center">[LOADING...]</span>';
var defaultNoRowsOverlayTemplate = '<span class="ag-overlay-no-rows-center">[NO_ROWS_TO_SHOW]</span>';
var GridPanel = (function(_super) {
  __extends(GridPanel, _super);
  function GridPanel() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.requestAnimationFrameExists = typeof requestAnimationFrame === 'function';
    _this.scrollLagCounter = 0;
    _this.scrollLagTicking = false;
    _this.lastLeftPosition = -1;
    _this.lastTopPosition = -1;
    _this.animationThreadCount = 0;
    return _this;
  }
  GridPanel.prototype.agWire = function(loggerFactory) {
    this.logger = loggerFactory.create('GridPanel');
    this.forPrint = this.gridOptionsWrapper.isForPrint();
    this.scrollWidth = this.gridOptionsWrapper.getScrollbarWidth();
    this.useScrollLag = this.isUseScrollLag();
    this.enableRtl = this.gridOptionsWrapper.isEnableRtl();
    this.loadTemplate();
    this.findElements();
  };
  GridPanel.prototype.getVerticalPixelRange = function() {
    var container = this.getPrimaryScrollViewport();
    var result = {
      top: container.scrollTop,
      bottom: container.scrollTop + container.offsetHeight
    };
    return result;
  };
  GridPanel.prototype.destroy = function() {
    _super.prototype.destroy.call(this);
  };
  GridPanel.prototype.onRowDataChanged = function() {
    this.showOrHideOverlay();
  };
  GridPanel.prototype.showOrHideOverlay = function() {
    if (this.rowModel.isEmpty() && !this.gridOptionsWrapper.isSuppressNoRowsOverlay()) {
      this.showNoRowsOverlay();
    } else {
      this.hideOverlay();
    }
  };
  GridPanel.prototype.getLayout = function() {
    return this.layout;
  };
  GridPanel.prototype.init = function() {
    this.addEventListeners();
    this.addDragListeners();
    this.layout = new borderLayout_1.BorderLayout({
      overlays: {
        loading: utils_1.Utils.loadTemplate(this.createLoadingOverlayTemplate()),
        noRows: utils_1.Utils.loadTemplate(this.createNoRowsOverlayTemplate())
      },
      center: this.eRoot,
      dontFill: this.forPrint,
      name: 'eGridPanel'
    });
    this.layout.addSizeChangeListener(this.setBodyAndHeaderHeights.bind(this));
    this.layout.addSizeChangeListener(this.setLeftAndRightBounds.bind(this));
    this.addScrollListener();
    if (this.gridOptionsWrapper.isSuppressHorizontalScroll()) {
      this.eBodyViewport.style.overflowX = 'hidden';
    }
    if (this.gridOptionsWrapper.isRowModelDefault() && !this.gridOptionsWrapper.getRowData()) {
      this.showLoadingOverlay();
    }
    this.setPinnedContainersVisible();
    this.setBodyAndHeaderHeights();
    this.disableBrowserDragging();
    this.addShortcutKeyListeners();
    this.addMouseEvents();
    this.addKeyboardEvents();
    this.addBodyViewportListener();
    if (this.$scope) {
      this.addAngularApplyCheck();
    }
    this.onDisplayedColumnsWidthChanged();
  };
  GridPanel.prototype.addAngularApplyCheck = function() {
    var _this = this;
    var applyTriggered = false;
    var listener = function() {
      if (applyTriggered) {
        return;
      }
      applyTriggered = true;
      setTimeout(function() {
        applyTriggered = false;
        _this.$scope.$apply();
      }, 0);
    };
    this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_DISPLAYED_COLUMNS_CHANGED, listener);
    this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_VIRTUAL_COLUMNS_CHANGED, listener);
  };
  GridPanel.prototype.disableBrowserDragging = function() {
    this.eRoot.addEventListener('dragstart', function(event) {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault();
        return false;
      }
    });
  };
  GridPanel.prototype.addEventListeners = function() {
    this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_DISPLAYED_COLUMNS_CHANGED, this.onDisplayedColumnsChanged.bind(this));
    this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED, this.onDisplayedColumnsWidthChanged.bind(this));
    this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_SCROLL_VISIBILITY_CHANGED, this.onScrollVisibilityChanged.bind(this));
    this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_FLOATING_ROW_DATA_CHANGED, this.setBodyAndHeaderHeights.bind(this));
    this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_ROW_DATA_CHANGED, this.onRowDataChanged.bind(this));
    this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_ITEMS_ADDED, this.onRowDataChanged.bind(this));
    this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_ITEMS_REMOVED, this.onRowDataChanged.bind(this));
    this.addDestroyableEventListener(this.gridOptionsWrapper, gridOptionsWrapper_1.GridOptionsWrapper.PROP_HEADER_HEIGHT, this.setBodyAndHeaderHeights.bind(this));
  };
  GridPanel.prototype.addDragListeners = function() {
    var _this = this;
    if (this.forPrint || !this.gridOptionsWrapper.isEnableRangeSelection() || utils_1.Utils.missing(this.rangeController)) {
      return;
    }
    var containers = [this.ePinnedLeftColsContainer, this.ePinnedRightColsContainer, this.eBodyContainer, this.eFloatingTop, this.eFloatingBottom];
    containers.forEach(function(container) {
      var params = {
        dragStartPixels: 0,
        eElement: container,
        onDragStart: _this.rangeController.onDragStart.bind(_this.rangeController),
        onDragStop: _this.rangeController.onDragStop.bind(_this.rangeController),
        onDragging: _this.rangeController.onDragging.bind(_this.rangeController)
      };
      _this.dragService.addDragSource(params);
      _this.addDestroyFunc(function() {
        return _this.dragService.removeDragSource(params);
      });
    });
  };
  GridPanel.prototype.addMouseEvents = function() {
    var _this = this;
    var eventNames = ['click', 'mousedown', 'dblclick', 'contextmenu', 'mouseover', 'mouseout'];
    eventNames.forEach(function(eventName) {
      var listener = _this.processMouseEvent.bind(_this, eventName);
      _this.eAllCellContainers.forEach(function(container) {
        container.addEventListener(eventName, listener);
        _this.addDestroyFunc(function() {
          return container.removeEventListener(eventName, listener);
        });
      });
    });
  };
  GridPanel.prototype.addKeyboardEvents = function() {
    var _this = this;
    var eventNames = ['keydown', 'keypress'];
    eventNames.forEach(function(eventName) {
      var listener = _this.processKeyboardEvent.bind(_this, eventName);
      _this.eAllCellContainers.forEach(function(container) {
        _this.addDestroyableEventListener(container, eventName, listener);
      });
    });
  };
  GridPanel.prototype.addBodyViewportListener = function() {
    var _this = this;
    if (this.gridOptionsWrapper.isForPrint()) {
      return;
    }
    var listener = function(mouseEvent) {
      var target = utils_1.Utils.getTarget(mouseEvent);
      if (target === _this.eBodyViewport) {
        _this.onContextMenu(mouseEvent);
        _this.preventDefaultOnContextMenu(mouseEvent);
      }
    };
    this.addDestroyableEventListener(this.eBodyViewport, 'contextmenu', listener);
  };
  GridPanel.prototype.getRowForEvent = function(event) {
    var domDataKey = this.gridOptionsWrapper.getDomDataKey();
    var sourceElement = utils_1.Utils.getTarget(event);
    while (sourceElement) {
      var domData = sourceElement[domDataKey];
      if (domData && domData.renderedRow) {
        return domData.renderedRow;
      }
      sourceElement = sourceElement.parentElement;
    }
    return null;
  };
  GridPanel.prototype.processKeyboardEvent = function(eventName, keyboardEvent) {
    var renderedCell = this.mouseEventService.getRenderedCellForEvent(keyboardEvent);
    if (!renderedCell) {
      return;
    }
    switch (eventName) {
      case 'keydown':
        var pageScrollingKeys = [constants_1.Constants.DIAGONAL_SCROLL_KEYS, constants_1.Constants.HORIZONTAL_SCROLL_KEYS, constants_1.Constants.VERTICAL_SCROLL_KEYS];
        var result = testKeyboardBindingGroups(pageScrollingKeys, keyboardEvent);
        if (result) {
          this.handlePageScrollingKey(result.trappedKeyboardBindingGroup.id, result.trappedKeyboardBinding.id, keyboardEvent);
        } else {
          renderedCell.onKeyDown(keyboardEvent);
        }
        break;
      case 'keypress':
        renderedCell.onKeyPress(keyboardEvent);
        break;
    }
  };
  GridPanel.prototype.handlePageScrollingKey = function(pagingKeyGroup, pagingKey, keyboardEvent) {
    switch (pagingKeyGroup) {
      case constants_1.Constants.DIAGONAL_SCROLL_KEYS_ID:
        this.pageDiagonally(pagingKey);
        break;
      case constants_1.Constants.VERTICAL_SCROLL_KEYS_ID:
        this.pageVertically(pagingKey);
        break;
      case constants_1.Constants.HORIZONTAL_SCROLL_KEYS_ID:
        this.pageHorizontally(pagingKey);
        break;
    }
    keyboardEvent.preventDefault();
  };
  GridPanel.prototype.pageHorizontally = function(pagingKey) {
    var allColumns = this.columnController.getAllDisplayedColumns();
    var columnToSelect = pagingKey === constants_1.Constants.KEY_CTRL_LEFT_NAME ? allColumns[0] : allColumns[allColumns.length - 1];
    var horizontalScroll = {
      type: ScrollType.HORIZONTAL,
      columnToScrollTo: columnToSelect,
      columnToFocus: columnToSelect
    };
    this.performScroll(horizontalScroll);
  };
  GridPanel.prototype.pageDiagonally = function(pagingKey) {
    var pageSize = this.getPrimaryScrollViewport().offsetHeight;
    var selectionTopDelta = pagingKey === constants_1.Constants.KEY_PAGE_HOME_NAME ? 0 : pageSize;
    var rowIndexToScrollTo = pagingKey === constants_1.Constants.KEY_PAGE_HOME_NAME ? 0 : this.rowModel.getRowCount() - 1;
    var rowToScrollTo = this.rowModel.getRow(rowIndexToScrollTo);
    var allColumns = this.columnController.getAllDisplayedColumns();
    var columnToSelect = pagingKey === constants_1.Constants.KEY_PAGE_HOME_NAME ? allColumns[0] : allColumns[allColumns.length - 1];
    var diagonalScroll = {
      focusedRowTopDelta: selectionTopDelta,
      type: ScrollType.DIAGONAL,
      rowToScrollTo: rowToScrollTo,
      columnToScrollTo: columnToSelect
    };
    this.performScroll(diagonalScroll);
  };
  GridPanel.prototype.pageVertically = function(pagingKey) {
    if (pagingKey === constants_1.Constants.KEY_CTRL_UP_NAME) {
      this.performScroll({
        rowToScrollTo: this.rowModel.getRow(0),
        focusedRowTopDelta: 0,
        type: ScrollType.VERTICAL
      });
      return;
    }
    if (pagingKey === constants_1.Constants.KEY_CTRL_DOWN_NAME) {
      this.performScroll({
        rowToScrollTo: this.rowModel.getRow(this.rowModel.getRowCount() - 1),
        focusedRowTopDelta: this.getPrimaryScrollViewport().offsetHeight,
        type: ScrollType.VERTICAL
      });
      return;
    }
    var focusedCell = this.focusedCellController.getFocusedCell();
    var focusedRowNode = this.rowModel.getRow(focusedCell.rowIndex);
    var focusedAbsoluteTop = focusedRowNode.rowTop;
    var selectionTopDelta = focusedAbsoluteTop - this.getPrimaryScrollViewport().scrollTop;
    var pageSize = this.getPrimaryScrollViewport().offsetHeight;
    var currentTopmostPixel = this.getPrimaryScrollViewport().scrollTop;
    var currentTopmostRow = this.rowModel.getRow(this.rowModel.getRowIndexAtPixel(currentTopmostPixel));
    var currentTopmostRowTop = currentTopmostRow.rowTop;
    var toScrollUnadjusted = pagingKey == constants_1.Constants.KEY_PAGE_DOWN_NAME ? pageSize + currentTopmostRowTop : currentTopmostRowTop - pageSize;
    var nextScreenTopmostRow = this.rowModel.getRow(this.rowModel.getRowIndexAtPixel(toScrollUnadjusted));
    var verticalScroll = {
      rowToScrollTo: nextScreenTopmostRow,
      focusedRowTopDelta: selectionTopDelta,
      type: ScrollType.VERTICAL
    };
    this.performScroll(verticalScroll);
  };
  GridPanel.prototype.performScroll = function(scroll) {
    var verticalScroll;
    var diagonalScroll;
    var horizontalScroll;
    var focusedCellBeforeScrolling = this.focusedCellController.getFocusedCell();
    switch (scroll.type) {
      case ScrollType.VERTICAL:
        verticalScroll = scroll;
        this.getPrimaryScrollViewport().scrollTop = verticalScroll.rowToScrollTo.rowTop;
        break;
      case ScrollType.DIAGONAL:
        diagonalScroll = scroll;
        this.getPrimaryScrollViewport().scrollTop = diagonalScroll.rowToScrollTo.rowTop;
        this.getPrimaryScrollViewport().scrollLeft = diagonalScroll.columnToScrollTo.getLeft();
        break;
      case ScrollType.HORIZONTAL:
        horizontalScroll = scroll;
        this.getPrimaryScrollViewport().scrollLeft = horizontalScroll.columnToScrollTo.getLeft();
        break;
    }
    var refreshViewParams = {
      onlyBody: true,
      suppressKeepFocus: true
    };
    this.rowRenderer.refreshView(refreshViewParams);
    var focusedRowIndex;
    var focusedColumn;
    switch (scroll.type) {
      case ScrollType.VERTICAL:
        focusedRowIndex = this.rowModel.getRowIndexAtPixel(this.getPrimaryScrollViewport().scrollTop + verticalScroll.focusedRowTopDelta);
        focusedColumn = focusedCellBeforeScrolling.column;
        break;
      case ScrollType.DIAGONAL:
        focusedRowIndex = this.rowModel.getRowIndexAtPixel(this.getPrimaryScrollViewport().scrollTop + diagonalScroll.focusedRowTopDelta);
        focusedColumn = diagonalScroll.columnToScrollTo;
        break;
      case ScrollType.HORIZONTAL:
        focusedRowIndex = focusedCellBeforeScrolling.rowIndex;
        focusedColumn = horizontalScroll.columnToScrollTo;
        break;
    }
    this.focusedCellController.setFocusedCell(focusedRowIndex, focusedColumn, null, true);
  };
  GridPanel.prototype.processMouseEvent = function(eventName, mouseEvent) {
    var renderedCell = this.mouseEventService.getRenderedCellForEvent(mouseEvent);
    if (renderedCell) {
      renderedCell.onMouseEvent(eventName, mouseEvent);
    }
    var renderedRow = this.getRowForEvent(mouseEvent);
    if (renderedRow) {
      renderedRow.onMouseEvent(eventName, mouseEvent);
    }
    this.preventDefaultOnContextMenu(mouseEvent);
  };
  GridPanel.prototype.onContextMenu = function(mouseEvent) {
    if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
      return;
    }
    if (this.contextMenuFactory && !this.gridOptionsWrapper.isSuppressContextMenu()) {
      this.contextMenuFactory.showMenu(null, null, null, mouseEvent);
      mouseEvent.preventDefault();
    }
  };
  GridPanel.prototype.preventDefaultOnContextMenu = function(mouseEvent) {
    if (this.gridOptionsWrapper.isSuppressMiddleClickScrolls() && mouseEvent.which === 2) {
      mouseEvent.preventDefault();
    }
  };
  GridPanel.prototype.addShortcutKeyListeners = function() {
    var _this = this;
    this.eAllCellContainers.forEach(function(container) {
      container.addEventListener('keydown', function(event) {
        var renderedCell = _this.mouseEventService.getRenderedCellForEvent(event);
        if (renderedCell && renderedCell.isEditing()) {
          return;
        }
        if (event.ctrlKey || event.metaKey) {
          switch (event.which) {
            case constants_1.Constants.KEY_A:
              return _this.onCtrlAndA(event);
            case constants_1.Constants.KEY_C:
              return _this.onCtrlAndC(event);
            case constants_1.Constants.KEY_V:
              return _this.onCtrlAndV(event);
            case constants_1.Constants.KEY_D:
              return _this.onCtrlAndD(event);
          }
        }
      });
    });
  };
  GridPanel.prototype.onCtrlAndA = function(event) {
    if (this.rangeController && this.rowModel.isRowsToRender()) {
      var rowEnd;
      var floatingStart;
      var floatingEnd;
      if (this.floatingRowModel.isEmpty(constants_1.Constants.FLOATING_TOP)) {
        floatingStart = null;
      } else {
        floatingStart = constants_1.Constants.FLOATING_TOP;
      }
      if (this.floatingRowModel.isEmpty(constants_1.Constants.FLOATING_BOTTOM)) {
        floatingEnd = null;
        rowEnd = this.rowModel.getRowCount() - 1;
      } else {
        floatingEnd = constants_1.Constants.FLOATING_BOTTOM;
        rowEnd = this.floatingRowModel.getFloatingBottomRowData().length = 1;
      }
      var allDisplayedColumns = this.columnController.getAllDisplayedColumns();
      if (utils_1.Utils.missingOrEmpty(allDisplayedColumns)) {
        return;
      }
      this.rangeController.setRange({
        rowStart: 0,
        floatingStart: floatingStart,
        rowEnd: rowEnd,
        floatingEnd: floatingEnd,
        columnStart: allDisplayedColumns[0],
        columnEnd: allDisplayedColumns[allDisplayedColumns.length - 1]
      });
    }
    event.preventDefault();
    return false;
  };
  GridPanel.prototype.onCtrlAndC = function(event) {
    if (!this.clipboardService) {
      return;
    }
    var focusedCell = this.focusedCellController.getFocusedCell();
    this.clipboardService.copyToClipboard();
    event.preventDefault();
    if (focusedCell) {
      this.focusedCellController.setFocusedCell(focusedCell.rowIndex, focusedCell.column, focusedCell.floating, true);
    }
    return false;
  };
  GridPanel.prototype.onCtrlAndV = function(event) {
    if (!this.rangeController) {
      return;
    }
    this.clipboardService.pasteFromClipboard();
    return false;
  };
  GridPanel.prototype.onCtrlAndD = function(event) {
    if (!this.clipboardService) {
      return;
    }
    this.clipboardService.copyRangeDown();
    event.preventDefault();
    return false;
  };
  GridPanel.prototype.createOverlayTemplate = function(name, defaultTemplate, userProvidedTemplate) {
    var template = mainOverlayTemplate.replace('[OVERLAY_NAME]', name);
    if (userProvidedTemplate) {
      template = template.replace('[OVERLAY_TEMPLATE]', userProvidedTemplate);
    } else {
      template = template.replace('[OVERLAY_TEMPLATE]', defaultTemplate);
    }
    return template;
  };
  GridPanel.prototype.createLoadingOverlayTemplate = function() {
    var userProvidedTemplate = this.gridOptionsWrapper.getOverlayLoadingTemplate();
    var templateNotLocalised = this.createOverlayTemplate('loading', defaultLoadingOverlayTemplate, userProvidedTemplate);
    var localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();
    var templateLocalised = templateNotLocalised.replace('[LOADING...]', localeTextFunc('loadingOoo', 'Loading...'));
    return templateLocalised;
  };
  GridPanel.prototype.createNoRowsOverlayTemplate = function() {
    var userProvidedTemplate = this.gridOptionsWrapper.getOverlayNoRowsTemplate();
    var templateNotLocalised = this.createOverlayTemplate('no-rows', defaultNoRowsOverlayTemplate, userProvidedTemplate);
    var localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();
    var templateLocalised = templateNotLocalised.replace('[NO_ROWS_TO_SHOW]', localeTextFunc('noRowsToShow', 'No Rows To Show'));
    return templateLocalised;
  };
  GridPanel.prototype.ensureIndexVisible = function(index) {
    this.logger.log('ensureIndexVisible: ' + index);
    var lastRow = this.rowModel.getRowCount();
    if (typeof index !== 'number' || index < 0 || index >= lastRow) {
      console.warn('invalid row index for ensureIndexVisible: ' + index);
      return;
    }
    var nodeAtIndex = this.rowModel.getRow(index);
    var rowTopPixel = nodeAtIndex.rowTop;
    var rowBottomPixel = rowTopPixel + nodeAtIndex.rowHeight;
    var vRange = this.getVerticalPixelRange();
    var vRangeTop = vRange.top;
    var vRangeBottom = vRange.bottom;
    var scrollShowing = this.isHorizontalScrollShowing();
    if (scrollShowing) {
      vRangeBottom -= this.scrollWidth;
    }
    var viewportScrolledPastRow = vRangeTop > rowTopPixel;
    var viewportScrolledBeforeRow = vRangeBottom < rowBottomPixel;
    var eViewportToScroll = this.getPrimaryScrollViewport();
    if (viewportScrolledPastRow) {
      eViewportToScroll.scrollTop = rowTopPixel;
      this.rowRenderer.drawVirtualRowsWithLock();
    } else if (viewportScrolledBeforeRow) {
      var viewportHeight = vRangeBottom - vRangeTop;
      var newScrollPosition = rowBottomPixel - viewportHeight;
      eViewportToScroll.scrollTop = newScrollPosition;
      this.rowRenderer.drawVirtualRowsWithLock();
    }
  };
  GridPanel.prototype.getPrimaryScrollViewport = function() {
    if (this.enableRtl && this.columnController.isPinningLeft()) {
      return this.ePinnedLeftColsViewport;
    } else if (!this.enableRtl && this.columnController.isPinningRight()) {
      return this.ePinnedRightColsViewport;
    } else {
      return this.eBodyViewport;
    }
  };
  GridPanel.prototype.getCenterWidth = function() {
    return this.eBodyViewport.clientWidth;
  };
  GridPanel.prototype.isHorizontalScrollShowing = function() {
    var result = utils_1.Utils.isHorizontalScrollShowing(this.eBodyViewport);
    return result;
  };
  GridPanel.prototype.isVerticalScrollShowing = function() {
    if (this.columnController.isPinningRight()) {
      return utils_1.Utils.isVerticalScrollShowing(this.ePinnedRightColsViewport);
    } else {
      return utils_1.Utils.isVerticalScrollShowing(this.eBodyViewport);
    }
  };
  GridPanel.prototype.isBodyVerticalScrollShowing = function() {
    if (!this.enableRtl && this.columnController.isPinningRight()) {
      return false;
    }
    if (this.enableRtl && this.columnController.isPinningLeft()) {
      return false;
    }
    return utils_1.Utils.isVerticalScrollShowing(this.eBodyViewport);
  };
  GridPanel.prototype.periodicallyCheck = function() {
    if (this.forPrint) {
      return;
    }
    this.setBottomPaddingOnPinnedRight();
    this.setMarginOnFullWidthCellContainer();
    this.setScrollShowing();
  };
  GridPanel.prototype.setScrollShowing = function() {
    var params = {
      vBody: false,
      hBody: false,
      vPinnedLeft: false,
      vPinnedRight: false
    };
    if (this.enableRtl) {
      if (this.columnController.isPinningLeft()) {
        params.vPinnedLeft = this.forPrint ? false : utils_1.Utils.isVerticalScrollShowing(this.ePinnedLeftColsViewport);
      } else {
        params.vBody = utils_1.Utils.isVerticalScrollShowing(this.eBodyViewport);
      }
    } else {
      if (this.columnController.isPinningRight()) {
        params.vPinnedRight = this.forPrint ? false : utils_1.Utils.isVerticalScrollShowing(this.ePinnedRightColsViewport);
      } else {
        params.vBody = utils_1.Utils.isVerticalScrollShowing(this.eBodyViewport);
      }
    }
    params.hBody = utils_1.Utils.isHorizontalScrollShowing(this.eBodyViewport);
    this.scrollVisibleService.setScrollsVisible(params);
  };
  GridPanel.prototype.setBottomPaddingOnPinnedRight = function() {
    if (this.forPrint) {
      return;
    }
    if (this.columnController.isPinningRight()) {
      var bodyHorizontalScrollShowing = this.eBodyViewport.clientWidth < this.eBodyViewport.scrollWidth;
      if (bodyHorizontalScrollShowing) {
        this.ePinnedRightColsContainer.style.marginBottom = this.scrollWidth + 'px';
      } else {
        this.ePinnedRightColsContainer.style.marginBottom = '';
      }
    }
  };
  GridPanel.prototype.setMarginOnFullWidthCellContainer = function() {
    if (this.forPrint) {
      return;
    }
    if (this.enableRtl) {
      if (this.isVerticalScrollShowing()) {
        this.eFullWidthCellViewport.style.borderLeft = this.scrollWidth + 'px solid transparent';
      } else {
        this.eFullWidthCellViewport.style.borderLeft = '';
      }
    } else {
      if (this.isVerticalScrollShowing()) {
        this.eFullWidthCellViewport.style.borderRight = this.scrollWidth + 'px solid transparent';
      } else {
        this.eFullWidthCellViewport.style.borderRight = '';
      }
    }
    if (this.isHorizontalScrollShowing()) {
      this.eFullWidthCellViewport.style.borderBottom = this.scrollWidth + 'px solid transparent';
    } else {
      this.eFullWidthCellViewport.style.borderBottom = '';
    }
  };
  GridPanel.prototype.ensureColumnVisible = function(key) {
    var column = this.columnController.getGridColumn(key);
    if (!column) {
      return;
    }
    if (column.isPinned()) {
      console.warn('calling ensureIndexVisible on a ' + column.getPinned() + ' pinned column doesn\'t make sense for column ' + column.getColId());
      return;
    }
    if (!this.columnController.isColumnDisplayed(column)) {
      console.warn('column is not currently visible');
      return;
    }
    var colLeftPixel = column.getLeft();
    var colRightPixel = colLeftPixel + column.getActualWidth();
    var viewportWidth = this.eBodyViewport.clientWidth;
    var scrollPosition = this.getBodyViewportScrollLeft();
    var bodyWidth = this.columnController.getBodyContainerWidth();
    var viewportLeftPixel;
    var viewportRightPixel;
    if (this.enableRtl) {
      viewportLeftPixel = bodyWidth - scrollPosition - viewportWidth;
      viewportRightPixel = bodyWidth - scrollPosition;
    } else {
      viewportLeftPixel = scrollPosition;
      viewportRightPixel = viewportWidth + scrollPosition;
    }
    var viewportScrolledPastCol = viewportLeftPixel > colLeftPixel;
    var viewportScrolledBeforeCol = viewportRightPixel < colRightPixel;
    if (viewportScrolledPastCol) {
      if (this.enableRtl) {
        var newScrollPosition = bodyWidth - viewportWidth - colLeftPixel;
        this.setBodyViewportScrollLeft(newScrollPosition);
      } else {
        this.setBodyViewportScrollLeft(colLeftPixel);
      }
    } else if (viewportScrolledBeforeCol) {
      if (this.enableRtl) {
        var newScrollPosition = bodyWidth - colRightPixel;
        this.setBodyViewportScrollLeft(newScrollPosition);
      } else {
        var newScrollPosition = colRightPixel - viewportWidth;
        this.setBodyViewportScrollLeft(newScrollPosition);
      }
    } else {}
    this.setLeftAndRightBounds();
  };
  GridPanel.prototype.showLoadingOverlay = function() {
    if (!this.gridOptionsWrapper.isSuppressLoadingOverlay()) {
      this.layout.showOverlay('loading');
    }
  };
  GridPanel.prototype.showNoRowsOverlay = function() {
    if (!this.gridOptionsWrapper.isSuppressNoRowsOverlay()) {
      this.layout.showOverlay('noRows');
    }
  };
  GridPanel.prototype.hideOverlay = function() {
    this.layout.hideOverlay();
  };
  GridPanel.prototype.getWidthForSizeColsToFit = function() {
    var availableWidth = this.eBody.clientWidth;
    var removeVerticalScrollWidth = this.isVerticalScrollShowing();
    if (removeVerticalScrollWidth) {
      availableWidth -= this.scrollWidth;
    }
    return availableWidth;
  };
  GridPanel.prototype.sizeColumnsToFit = function(nextTimeout) {
    var _this = this;
    var availableWidth = this.getWidthForSizeColsToFit();
    if (availableWidth > 0) {
      this.columnController.sizeColumnsToFit(availableWidth);
    } else {
      if (nextTimeout === undefined) {
        setTimeout(function() {
          _this.sizeColumnsToFit(100);
        }, 0);
      } else if (nextTimeout === 100) {
        setTimeout(function() {
          _this.sizeColumnsToFit(-1);
        }, 100);
      } else {
        console.log('ag-Grid: tried to call sizeColumnsToFit() but the grid is coming back with ' + 'zero width, maybe the grid is not visible yet on the screen?');
      }
    }
  };
  GridPanel.prototype.getBodyContainer = function() {
    return this.eBodyContainer;
  };
  GridPanel.prototype.getDropTargetBodyContainers = function() {
    if (this.forPrint) {
      return [this.eBodyContainer, this.eFloatingTopContainer, this.eFloatingBottomContainer];
    } else {
      return [this.eBodyViewport, this.eFloatingTopViewport, this.eFloatingBottomViewport];
    }
  };
  GridPanel.prototype.getBodyViewport = function() {
    return this.eBodyViewport;
  };
  GridPanel.prototype.getDropTargetLeftContainers = function() {
    if (this.forPrint) {
      return [];
    } else {
      return [this.ePinnedLeftColsViewport, this.ePinnedLeftFloatingBottom, this.ePinnedLeftFloatingTop];
    }
  };
  GridPanel.prototype.getDropTargetPinnedRightContainers = function() {
    if (this.forPrint) {
      return [];
    } else {
      return [this.ePinnedRightColsViewport, this.ePinnedRightFloatingBottom, this.ePinnedRightFloatingTop];
    }
  };
  GridPanel.prototype.getHeaderContainer = function() {
    return this.eHeaderContainer;
  };
  GridPanel.prototype.getHeaderOverlay = function() {
    return this.eHeaderOverlay;
  };
  GridPanel.prototype.getRoot = function() {
    return this.eRoot;
  };
  GridPanel.prototype.getPinnedLeftHeader = function() {
    return this.ePinnedLeftHeader;
  };
  GridPanel.prototype.getPinnedRightHeader = function() {
    return this.ePinnedRightHeader;
  };
  GridPanel.prototype.queryHtmlElement = function(selector) {
    return this.eRoot.querySelector(selector);
  };
  GridPanel.prototype.loadTemplate = function() {
    var template = this.forPrint ? gridForPrintHtml : gridHtml;
    this.eRoot = utils_1.Utils.loadTemplate(template);
    var scrollClass = this.forPrint ? 'ag-no-scrolls' : 'ag-scrolls';
    utils_1.Utils.addCssClass(this.eRoot, scrollClass);
  };
  GridPanel.prototype.findElements = function() {
    if (this.forPrint) {
      this.eHeaderContainer = this.queryHtmlElement('.ag-header-container');
      this.eBodyContainer = this.queryHtmlElement('.ag-body-container');
      this.eFloatingTopContainer = this.queryHtmlElement('.ag-floating-top-container');
      this.eFloatingBottomContainer = this.queryHtmlElement('.ag-floating-bottom-container');
      this.eAllCellContainers = [this.eBodyContainer, this.eFloatingTopContainer, this.eFloatingBottomContainer];
      var containers = {
        body: new rowContainerComponent_1.RowContainerComponent({
          eContainer: this.eBodyContainer,
          useDocumentFragment: true
        }),
        fullWidth: null,
        pinnedLeft: null,
        pinnedRight: null,
        floatingTop: new rowContainerComponent_1.RowContainerComponent({eContainer: this.eFloatingTopContainer}),
        floatingTopPinnedLeft: null,
        floatingTopPinnedRight: null,
        floatingTopFullWidth: null,
        floatingBottom: new rowContainerComponent_1.RowContainerComponent({eContainer: this.eFloatingBottomContainer}),
        floatingBottomPinnedLeft: null,
        floatingBottomPinnedRight: null,
        floatingBottomFullWith: null
      };
      this.rowContainerComponents = containers;
      containers.fullWidth = containers.body;
      containers.floatingBottomFullWith = containers.floatingBottom;
      containers.floatingTopFullWidth = containers.floatingTop;
    } else {
      this.eBody = this.queryHtmlElement('.ag-body');
      this.eBodyContainer = this.queryHtmlElement('.ag-body-container');
      this.eBodyViewport = this.queryHtmlElement('.ag-body-viewport');
      this.eBodyViewportWrapper = this.queryHtmlElement('.ag-body-viewport-wrapper');
      this.eFullWidthCellContainer = this.queryHtmlElement('.ag-full-width-container');
      this.eFullWidthCellViewport = this.queryHtmlElement('.ag-full-width-viewport');
      this.ePinnedLeftColsContainer = this.queryHtmlElement('.ag-pinned-left-cols-container');
      this.ePinnedRightColsContainer = this.queryHtmlElement('.ag-pinned-right-cols-container');
      this.ePinnedLeftColsViewport = this.queryHtmlElement('.ag-pinned-left-cols-viewport');
      this.ePinnedRightColsViewport = this.queryHtmlElement('.ag-pinned-right-cols-viewport');
      this.ePinnedLeftHeader = this.queryHtmlElement('.ag-pinned-left-header');
      this.ePinnedRightHeader = this.queryHtmlElement('.ag-pinned-right-header');
      this.eHeader = this.queryHtmlElement('.ag-header');
      this.eHeaderContainer = this.queryHtmlElement('.ag-header-container');
      this.eHeaderOverlay = this.queryHtmlElement('.ag-header-overlay');
      this.eHeaderViewport = this.queryHtmlElement('.ag-header-viewport');
      this.eFloatingTop = this.queryHtmlElement('.ag-floating-top');
      this.ePinnedLeftFloatingTop = this.queryHtmlElement('.ag-pinned-left-floating-top');
      this.ePinnedRightFloatingTop = this.queryHtmlElement('.ag-pinned-right-floating-top');
      this.eFloatingTopContainer = this.queryHtmlElement('.ag-floating-top-container');
      this.eFloatingTopViewport = this.queryHtmlElement('.ag-floating-top-viewport');
      this.eFloatingTopFullWidthCellContainer = this.queryHtmlElement('.ag-floating-top-full-width-container');
      this.eFloatingBottom = this.queryHtmlElement('.ag-floating-bottom');
      this.ePinnedLeftFloatingBottom = this.queryHtmlElement('.ag-pinned-left-floating-bottom');
      this.ePinnedRightFloatingBottom = this.queryHtmlElement('.ag-pinned-right-floating-bottom');
      this.eFloatingBottomContainer = this.queryHtmlElement('.ag-floating-bottom-container');
      this.eFloatingBottomViewport = this.queryHtmlElement('.ag-floating-bottom-viewport');
      this.eFloatingBottomFullWidthCellContainer = this.queryHtmlElement('.ag-floating-bottom-full-width-container');
      this.eAllCellContainers = [this.ePinnedLeftColsContainer, this.ePinnedRightColsContainer, this.eBodyContainer, this.eFloatingTop, this.eFloatingBottom, this.eFullWidthCellContainer];
      this.rowContainerComponents = {
        body: new rowContainerComponent_1.RowContainerComponent({
          eContainer: this.eBodyContainer,
          eViewport: this.eBodyViewport,
          useDocumentFragment: true
        }),
        fullWidth: new rowContainerComponent_1.RowContainerComponent({
          eContainer: this.eFullWidthCellContainer,
          hideWhenNoChildren: true,
          eViewport: this.eFullWidthCellViewport
        }),
        pinnedLeft: new rowContainerComponent_1.RowContainerComponent({
          eContainer: this.ePinnedLeftColsContainer,
          eViewport: this.ePinnedLeftColsViewport,
          useDocumentFragment: true
        }),
        pinnedRight: new rowContainerComponent_1.RowContainerComponent({
          eContainer: this.ePinnedRightColsContainer,
          eViewport: this.ePinnedRightColsViewport,
          useDocumentFragment: true
        }),
        floatingTop: new rowContainerComponent_1.RowContainerComponent({eContainer: this.eFloatingTopContainer}),
        floatingTopPinnedLeft: new rowContainerComponent_1.RowContainerComponent({eContainer: this.ePinnedLeftFloatingTop}),
        floatingTopPinnedRight: new rowContainerComponent_1.RowContainerComponent({eContainer: this.ePinnedRightFloatingTop}),
        floatingTopFullWidth: new rowContainerComponent_1.RowContainerComponent({
          eContainer: this.eFloatingTopFullWidthCellContainer,
          hideWhenNoChildren: true
        }),
        floatingBottom: new rowContainerComponent_1.RowContainerComponent({eContainer: this.eFloatingBottomContainer}),
        floatingBottomPinnedLeft: new rowContainerComponent_1.RowContainerComponent({eContainer: this.ePinnedLeftFloatingBottom}),
        floatingBottomPinnedRight: new rowContainerComponent_1.RowContainerComponent({eContainer: this.ePinnedRightFloatingBottom}),
        floatingBottomFullWith: new rowContainerComponent_1.RowContainerComponent({
          eContainer: this.eFloatingBottomFullWidthCellContainer,
          hideWhenNoChildren: true
        })
      };
      this.addMouseWheelEventListeners();
    }
  };
  GridPanel.prototype.getRowContainers = function() {
    return this.rowContainerComponents;
  };
  GridPanel.prototype.addMouseWheelEventListeners = function() {
    this.addDestroyableEventListener(this.eBodyViewport, 'mousewheel', this.centerMouseWheelListener.bind(this));
    this.addDestroyableEventListener(this.eBodyViewport, 'DOMMouseScroll', this.centerMouseWheelListener.bind(this));
    if (this.enableRtl) {
      this.addDestroyableEventListener(this.ePinnedRightColsViewport, 'mousewheel', this.genericMouseWheelListener.bind(this));
      this.addDestroyableEventListener(this.ePinnedRightColsViewport, 'DOMMouseScroll', this.genericMouseWheelListener.bind(this));
    } else {
      this.addDestroyableEventListener(this.ePinnedLeftColsViewport, 'mousewheel', this.genericMouseWheelListener.bind(this));
      this.addDestroyableEventListener(this.ePinnedLeftColsViewport, 'DOMMouseScroll', this.genericMouseWheelListener.bind(this));
    }
  };
  GridPanel.prototype.getHeaderViewport = function() {
    return this.eHeaderViewport;
  };
  GridPanel.prototype.centerMouseWheelListener = function(event) {
    var bodyVScrollShowing = this.isBodyVerticalScrollActive();
    if (!bodyVScrollShowing) {
      var targetPanel = this.enableRtl ? this.ePinnedLeftColsViewport : this.ePinnedRightColsViewport;
      return this.generalMouseWheelListener(event, targetPanel);
    }
  };
  GridPanel.prototype.genericMouseWheelListener = function(event) {
    var targetPanel;
    var bodyVScrollActive = this.isBodyVerticalScrollActive();
    if (bodyVScrollActive) {
      targetPanel = this.eBodyViewport;
    } else {
      targetPanel = this.enableRtl ? this.ePinnedLeftColsViewport : this.ePinnedRightColsViewport;
    }
    return this.generalMouseWheelListener(event, targetPanel);
  };
  GridPanel.prototype.generalMouseWheelListener = function(event, targetPanel) {
    var wheelEvent = utils_1.Utils.normalizeWheel(event);
    if (Math.abs(wheelEvent.pixelX) > Math.abs(wheelEvent.pixelY)) {
      var newLeftPosition = this.eBodyViewport.scrollLeft + wheelEvent.pixelX;
      this.eBodyViewport.scrollLeft = newLeftPosition;
    } else {
      var newTopPosition = targetPanel.scrollTop + wheelEvent.pixelY;
      targetPanel.scrollTop = newTopPosition;
    }
    if (!this.gridOptionsWrapper.isSuppressPreventDefaultOnMouseWheel()) {
      event.preventDefault();
    }
    return false;
  };
  GridPanel.prototype.onDisplayedColumnsChanged = function() {
    this.setPinnedContainersVisible();
    this.setBodyAndHeaderHeights();
    this.setLeftAndRightBounds();
  };
  GridPanel.prototype.onDisplayedColumnsWidthChanged = function() {
    this.setWidthsOfContainers();
    this.setLeftAndRightBounds();
    if (this.enableRtl) {
      this.horizontallyScrollHeaderCenterAndFloatingCenter();
    }
  };
  GridPanel.prototype.onScrollVisibilityChanged = function() {
    this.setWidthsOfContainers();
  };
  GridPanel.prototype.setWidthsOfContainers = function() {
    var mainRowWidth = this.columnController.getBodyContainerWidth() + 'px';
    this.eBodyContainer.style.width = mainRowWidth;
    if (this.forPrint) {
      return;
    }
    this.eFloatingBottomContainer.style.width = mainRowWidth;
    this.eFloatingTopContainer.style.width = mainRowWidth;
    this.setPinnedLeftWidth();
    this.setPinnedRightWidth();
  };
  GridPanel.prototype.setPinnedLeftWidth = function() {
    var pinnedLeftWidth = this.scrollVisibleService.getPinnedLeftWidth() + 'px';
    var pinnedLeftWidthWithScroll = this.scrollVisibleService.getPinnedLeftWithScrollWidth() + 'px';
    this.ePinnedLeftColsViewport.style.width = pinnedLeftWidthWithScroll;
    this.eBodyViewportWrapper.style.marginLeft = pinnedLeftWidthWithScroll;
    this.ePinnedLeftFloatingBottom.style.width = pinnedLeftWidthWithScroll;
    this.ePinnedLeftFloatingTop.style.width = pinnedLeftWidthWithScroll;
    this.ePinnedLeftColsContainer.style.width = pinnedLeftWidth;
  };
  GridPanel.prototype.setPinnedRightWidth = function() {
    var pinnedRightWidth = this.scrollVisibleService.getPinnedRightWidth() + 'px';
    var pinnedRightWidthWithScroll = this.scrollVisibleService.getPinnedRightWithScrollWidth() + 'px';
    this.ePinnedRightColsViewport.style.width = pinnedRightWidthWithScroll;
    this.eBodyViewportWrapper.style.marginRight = pinnedRightWidthWithScroll;
    this.ePinnedRightFloatingBottom.style.width = pinnedRightWidthWithScroll;
    this.ePinnedRightFloatingTop.style.width = pinnedRightWidthWithScroll;
    this.ePinnedRightColsContainer.style.width = pinnedRightWidth;
  };
  GridPanel.prototype.setPinnedContainersVisible = function() {
    if (this.forPrint) {
      return;
    }
    var changeDetected = false;
    var showLeftPinned = this.columnController.isPinningLeft();
    if (showLeftPinned !== this.pinningLeft) {
      this.pinningLeft = showLeftPinned;
      this.ePinnedLeftHeader.style.display = showLeftPinned ? 'inline-block' : 'none';
      this.ePinnedLeftColsViewport.style.display = showLeftPinned ? 'inline' : 'none';
      changeDetected = true;
    }
    var showRightPinned = this.columnController.isPinningRight();
    if (showRightPinned !== this.pinningRight) {
      this.pinningRight = showRightPinned;
      this.ePinnedRightHeader.style.display = showRightPinned ? 'inline-block' : 'none';
      this.ePinnedRightColsViewport.style.display = showRightPinned ? 'inline' : 'none';
      changeDetected = true;
    }
    if (changeDetected) {
      var bodyVScrollActive = this.isBodyVerticalScrollActive();
      this.eBodyViewport.style.overflowY = bodyVScrollActive ? 'auto' : 'hidden';
      var scrollTop = Math.max(this.eBodyViewport.scrollTop, this.ePinnedLeftColsViewport.scrollTop, this.ePinnedRightColsViewport.scrollTop);
      if (bodyVScrollActive) {
        this.eBodyContainer.style.top = '0px';
      } else {
        this.eBodyViewport.scrollTop = 0;
      }
      var primaryScrollViewport = this.getPrimaryScrollViewport();
      primaryScrollViewport.scrollTop = scrollTop;
      this.fakeVerticalScroll(scrollTop);
    }
  };
  GridPanel.prototype.setBodyAndHeaderHeights = function() {
    if (this.forPrint) {
      return;
    }
    var heightOfContainer = this.layout.getCentreHeight();
    if (!heightOfContainer) {
      return;
    }
    var headerHeight = this.gridOptionsWrapper.getHeaderHeight();
    var numberOfRowsInHeader = this.columnController.getHeaderRowCount();
    var totalHeaderHeight = headerHeight * numberOfRowsInHeader;
    this.eHeader.style['height'] = totalHeaderHeight + 'px';
    var floatingTopHeight = this.floatingRowModel.getFloatingTopTotalHeight();
    var paddingTop = totalHeaderHeight + floatingTopHeight;
    var floatingBottomHeight = this.floatingRowModel.getFloatingBottomTotalHeight();
    var floatingBottomTop = heightOfContainer - floatingBottomHeight;
    var heightOfCentreRows = heightOfContainer - totalHeaderHeight - floatingBottomHeight - floatingTopHeight;
    this.eBody.style.top = paddingTop + 'px';
    this.eBody.style.height = heightOfCentreRows + 'px';
    this.eFloatingTop.style.top = totalHeaderHeight + 'px';
    this.eFloatingTop.style.height = floatingTopHeight + 'px';
    this.eFloatingBottom.style.height = floatingBottomHeight + 'px';
    this.eFloatingBottom.style.top = floatingBottomTop + 'px';
    this.ePinnedLeftColsViewport.style.height = heightOfCentreRows + 'px';
    this.ePinnedRightColsViewport.style.height = heightOfCentreRows + 'px';
  };
  GridPanel.prototype.setHorizontalScrollPosition = function(hScrollPosition) {
    this.eBodyViewport.scrollLeft = hScrollPosition;
  };
  GridPanel.prototype.scrollHorizontally = function(pixels) {
    var oldScrollPosition = this.eBodyViewport.scrollLeft;
    this.setHorizontalScrollPosition(oldScrollPosition + pixels);
    var newScrollPosition = this.eBodyViewport.scrollLeft;
    return newScrollPosition - oldScrollPosition;
  };
  GridPanel.prototype.addScrollListener = function() {
    var _this = this;
    if (this.forPrint) {
      return;
    }
    var wrapWithDebounce = function(func) {
      if (_this.useScrollLag) {
        return _this.debounce.bind(_this, func);
      } else {
        return func;
      }
    };
    var bodyScrollListener = wrapWithDebounce(this.onBodyScroll.bind(this));
    this.addDestroyableEventListener(this.eBodyViewport, 'scroll', bodyScrollListener);
    var onPinnedLeftVerticalScroll = this.onVerticalScroll.bind(this, this.ePinnedLeftColsViewport);
    var onPinnedRightVerticalScroll = this.onVerticalScroll.bind(this, this.ePinnedRightColsViewport);
    if (this.enableRtl) {
      var pinnedScrollListener = wrapWithDebounce(onPinnedLeftVerticalScroll);
      this.addDestroyableEventListener(this.ePinnedLeftColsViewport, 'scroll', pinnedScrollListener);
      var suppressRightScroll = function() {
        return _this.ePinnedRightColsViewport.scrollTop = 0;
      };
      this.addDestroyableEventListener(this.ePinnedRightColsViewport, 'scroll', suppressRightScroll);
    } else {
      var pinnedScrollListener = wrapWithDebounce(onPinnedRightVerticalScroll);
      this.addDestroyableEventListener(this.ePinnedRightColsViewport, 'scroll', pinnedScrollListener);
      var suppressLeftScroll = function() {
        return _this.ePinnedLeftColsViewport.scrollTop = 0;
      };
      this.addDestroyableEventListener(this.ePinnedLeftColsViewport, 'scroll', suppressLeftScroll);
    }
    var suppressCenterScroll = function() {
      if (_this.getPrimaryScrollViewport() !== _this.eBodyViewport) {
        _this.eBodyViewport.scrollTop = 0;
      }
    };
    this.addDestroyableEventListener(this.eBodyViewport, 'scroll', suppressCenterScroll);
    this.addIEPinFix(onPinnedRightVerticalScroll, onPinnedLeftVerticalScroll);
  };
  GridPanel.prototype.onBodyScroll = function() {
    this.onBodyHorizontalScroll();
    this.onBodyVerticalScroll();
  };
  GridPanel.prototype.onBodyHorizontalScroll = function() {
    var newLeftPosition = this.eBodyViewport.scrollLeft;
    if (newLeftPosition !== this.lastLeftPosition) {
      this.eventService.dispatchEvent(events_1.Events.EVENT_BODY_SCROLL, {direction: 'horizontal'});
      this.lastLeftPosition = newLeftPosition;
      this.horizontallyScrollHeaderCenterAndFloatingCenter();
      this.masterSlaveService.fireHorizontalScrollEvent(newLeftPosition);
      this.setLeftAndRightBounds();
    }
  };
  GridPanel.prototype.onBodyVerticalScroll = function() {
    var bodyVScrollActive = this.isBodyVerticalScrollActive();
    if (bodyVScrollActive) {
      this.onVerticalScroll(this.eBodyViewport);
    }
  };
  GridPanel.prototype.onVerticalScroll = function(sourceElement) {
    var newTopPosition = sourceElement.scrollTop;
    if (newTopPosition !== this.lastTopPosition) {
      this.eventService.dispatchEvent(events_1.Events.EVENT_BODY_SCROLL, {direction: 'vertical'});
      this.lastTopPosition = newTopPosition;
      this.fakeVerticalScroll(newTopPosition);
      this.rowRenderer.drawVirtualRowsWithLock();
    }
  };
  GridPanel.prototype.isBodyVerticalScrollActive = function() {
    var pinningRight = this.columnController.isPinningRight();
    var pinningLeft = this.columnController.isPinningLeft();
    var centerHasScroll = this.enableRtl ? !pinningLeft : !pinningRight;
    return centerHasScroll;
  };
  GridPanel.prototype.addIEPinFix = function(onPinnedRightScroll, onPinnedLeftScroll) {
    var _this = this;
    var listener = function() {
      if (_this.columnController.isPinningRight()) {
        setTimeout(function() {
          if (_this.enableRtl) {
            onPinnedLeftScroll();
          } else {
            onPinnedRightScroll();
          }
        }, 0);
      }
    };
    this.addDestroyableEventListener(this.eventService, events_1.Events.EVENT_MODEL_UPDATED, listener);
  };
  GridPanel.prototype.setLeftAndRightBounds = function() {
    if (this.gridOptionsWrapper.isForPrint()) {
      return;
    }
    var scrollWidth = this.eBodyViewport.clientWidth;
    var scrollPosition = this.getBodyViewportScrollLeft();
    this.columnController.setVirtualViewportPosition(scrollWidth, scrollPosition);
  };
  GridPanel.prototype.isUseScrollLag = function() {
    if (this.gridOptionsWrapper.isSuppressScrollLag()) {
      return false;
    } else if (this.gridOptionsWrapper.getIsScrollLag()) {
      return this.gridOptionsWrapper.getIsScrollLag()();
    } else {
      return utils_1.Utils.isBrowserIE() || utils_1.Utils.isBrowserSafari();
    }
  };
  GridPanel.prototype.debounce = function(callback) {
    var _this = this;
    if (this.requestAnimationFrameExists && utils_1.Utils.isBrowserSafari()) {
      if (!this.scrollLagTicking) {
        this.scrollLagTicking = true;
        requestAnimationFrame(function() {
          callback();
          _this.scrollLagTicking = false;
        });
      }
    } else {
      this.scrollLagCounter++;
      var scrollLagCounterCopy = this.scrollLagCounter;
      setTimeout(function() {
        if (_this.scrollLagCounter === scrollLagCounterCopy) {
          callback();
        }
      }, 50);
    }
  };
  GridPanel.prototype.getBodyViewportScrollLeft = function() {
    if (this.forPrint) {
      return 0;
    }
    return utils_1.Utils.getScrollLeft(this.eBodyViewport, this.enableRtl);
  };
  GridPanel.prototype.setBodyViewportScrollLeft = function(value) {
    if (this.forPrint) {
      return;
    }
    utils_1.Utils.setScrollLeft(this.eBodyViewport, value, this.enableRtl);
  };
  GridPanel.prototype.horizontallyScrollHeaderCenterAndFloatingCenter = function() {
    var scrollLeft = this.getBodyViewportScrollLeft();
    var offset = this.enableRtl ? scrollLeft : -scrollLeft;
    this.eHeaderContainer.style.left = offset + 'px';
    this.eFloatingBottomContainer.style.left = offset + 'px';
    this.eFloatingTopContainer.style.left = offset + 'px';
  };
  GridPanel.prototype.fakeVerticalScroll = function(position) {
    if (this.enableRtl) {
      var pinningLeft = this.columnController.isPinningLeft();
      if (pinningLeft) {
        this.eBodyContainer.style.top = -position + 'px';
      }
      this.ePinnedRightColsContainer.style.top = -position + 'px';
    } else {
      var pinningRight = this.columnController.isPinningRight();
      if (pinningRight) {
        this.eBodyContainer.style.top = -position + 'px';
      }
      this.ePinnedLeftColsContainer.style.top = -position + 'px';
    }
    this.eFullWidthCellContainer.style.top = -position + 'px';
  };
  GridPanel.prototype.addScrollEventListener = function(listener) {
    this.eBodyViewport.addEventListener('scroll', listener);
  };
  GridPanel.prototype.removeScrollEventListener = function(listener) {
    this.eBodyViewport.removeEventListener('scroll', listener);
  };
  return GridPanel;
}(beanStub_1.BeanStub));
__decorate([context_1.Autowired('masterSlaveService'), __metadata("design:type", masterSlaveService_1.MasterSlaveService)], GridPanel.prototype, "masterSlaveService", void 0);
__decorate([context_1.Autowired('gridOptionsWrapper'), __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)], GridPanel.prototype, "gridOptionsWrapper", void 0);
__decorate([context_1.Autowired('columnController'), __metadata("design:type", columnController_1.ColumnController)], GridPanel.prototype, "columnController", void 0);
__decorate([context_1.Autowired('rowRenderer'), __metadata("design:type", rowRenderer_1.RowRenderer)], GridPanel.prototype, "rowRenderer", void 0);
__decorate([context_1.Autowired('floatingRowModel'), __metadata("design:type", floatingRowModel_1.FloatingRowModel)], GridPanel.prototype, "floatingRowModel", void 0);
__decorate([context_1.Autowired('eventService'), __metadata("design:type", eventService_1.EventService)], GridPanel.prototype, "eventService", void 0);
__decorate([context_1.Autowired('rowModel'), __metadata("design:type", Object)], GridPanel.prototype, "rowModel", void 0);
__decorate([context_1.Optional('rangeController'), __metadata("design:type", Object)], GridPanel.prototype, "rangeController", void 0);
__decorate([context_1.Autowired('dragService'), __metadata("design:type", dragService_1.DragService)], GridPanel.prototype, "dragService", void 0);
__decorate([context_1.Autowired('selectionController'), __metadata("design:type", selectionController_1.SelectionController)], GridPanel.prototype, "selectionController", void 0);
__decorate([context_1.Optional('clipboardService'), __metadata("design:type", Object)], GridPanel.prototype, "clipboardService", void 0);
__decorate([context_1.Autowired('csvCreator'), __metadata("design:type", csvCreator_1.CsvCreator)], GridPanel.prototype, "csvCreator", void 0);
__decorate([context_1.Autowired('mouseEventService'), __metadata("design:type", mouseEventService_1.MouseEventService)], GridPanel.prototype, "mouseEventService", void 0);
__decorate([context_1.Autowired('focusedCellController'), __metadata("design:type", focusedCellController_1.FocusedCellController)], GridPanel.prototype, "focusedCellController", void 0);
__decorate([context_1.Autowired('$scope'), __metadata("design:type", Object)], GridPanel.prototype, "$scope", void 0);
__decorate([context_1.Autowired('scrollVisibleService'), __metadata("design:type", scrollVisibleService_1.ScrollVisibleService)], GridPanel.prototype, "scrollVisibleService", void 0);
__decorate([context_1.Optional('contextMenuFactory'), __metadata("design:type", Object)], GridPanel.prototype, "contextMenuFactory", void 0);
__decorate([context_1.Autowired('frameworkFactory'), __metadata("design:type", Object)], GridPanel.prototype, "frameworkFactory", void 0);
__decorate([__param(0, context_1.Qualifier('loggerFactory')), __metadata("design:type", Function), __metadata("design:paramtypes", [logger_1.LoggerFactory]), __metadata("design:returntype", void 0)], GridPanel.prototype, "agWire", null);
__decorate([context_1.PreDestroy, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], GridPanel.prototype, "destroy", null);
__decorate([context_1.PostConstruct, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], GridPanel.prototype, "init", null);
GridPanel = __decorate([context_1.Bean('gridPanel')], GridPanel);
exports.GridPanel = GridPanel;
var ScrollType;
(function(ScrollType) {
  ScrollType[ScrollType["HORIZONTAL"] = 0] = "HORIZONTAL";
  ScrollType[ScrollType["VERTICAL"] = 1] = "VERTICAL";
  ScrollType[ScrollType["DIAGONAL"] = 2] = "DIAGONAL";
})(ScrollType || (ScrollType = {}));
function testKeyboardBindingGroups(keyboardBindingGroups, event) {
  for (var i = 0; i < keyboardBindingGroups.length; i++) {
    var keyboardBindingGroup = keyboardBindingGroups[i];
    for (var j = 0; j < keyboardBindingGroup.bindings.length; j++) {
      var keyboardBinding = keyboardBindingGroup.bindings[j];
      if (testKeyboardBinding(keyboardBinding, event)) {
        return {
          trappedKeyboardBinding: keyboardBinding,
          trappedKeyboardBindingGroup: keyboardBindingGroup
        };
      }
    }
  }
  return null;
}
function testKeyboardBinding(keyboardBinding, event) {
  var key = event.which || event.keyCode;
  return (keyboardBinding.ctlRequired === event.ctrlKey) && (keyboardBinding.keyCode === key) && (keyboardBinding.altRequired === event.altKey);
}
