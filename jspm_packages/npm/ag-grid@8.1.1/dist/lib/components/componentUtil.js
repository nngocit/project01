/* */ 
(function(process) {
  "use strict";
  var events_1 = require('../events');
  var utils_1 = require('../utils');
  var ComponentUtil = (function() {
    function ComponentUtil() {}
    ComponentUtil.getEventCallbacks = function() {
      if (!ComponentUtil.EVENT_CALLBACKS) {
        ComponentUtil.EVENT_CALLBACKS = [];
        ComponentUtil.EVENTS.forEach(function(eventName) {
          ComponentUtil.EVENT_CALLBACKS.push(ComponentUtil.getCallbackForEvent(eventName));
        });
      }
      return ComponentUtil.EVENT_CALLBACKS;
    };
    ComponentUtil.copyAttributesToGridOptions = function(gridOptions, component) {
      checkForDeprecated(component);
      if (typeof gridOptions !== 'object') {
        gridOptions = {};
      }
      var pGridOptions = gridOptions;
      ComponentUtil.ARRAY_PROPERTIES.concat(ComponentUtil.STRING_PROPERTIES).concat(ComponentUtil.OBJECT_PROPERTIES).concat(ComponentUtil.FUNCTION_PROPERTIES).forEach(function(key) {
        if (typeof(component)[key] !== 'undefined') {
          pGridOptions[key] = component[key];
        }
      });
      ComponentUtil.BOOLEAN_PROPERTIES.forEach(function(key) {
        if (typeof(component)[key] !== 'undefined') {
          pGridOptions[key] = ComponentUtil.toBoolean(component[key]);
        }
      });
      ComponentUtil.NUMBER_PROPERTIES.forEach(function(key) {
        if (typeof(component)[key] !== 'undefined') {
          pGridOptions[key] = ComponentUtil.toNumber(component[key]);
        }
      });
      ComponentUtil.getEventCallbacks().forEach(function(funcName) {
        if (typeof(component)[funcName] !== 'undefined') {
          pGridOptions[funcName] = component[funcName];
        }
      });
      return gridOptions;
    };
    ComponentUtil.getCallbackForEvent = function(eventName) {
      if (!eventName || eventName.length < 2) {
        return eventName;
      } else {
        return 'on' + eventName[0].toUpperCase() + eventName.substr(1);
      }
    };
    ComponentUtil.processOnChange = function(changes, gridOptions, api, columnApi) {
      if (!changes) {
        return;
      }
      checkForDeprecated(changes);
      var pGridOptions = gridOptions;
      ComponentUtil.ARRAY_PROPERTIES.concat(ComponentUtil.OBJECT_PROPERTIES).concat(ComponentUtil.STRING_PROPERTIES).forEach(function(key) {
        if (changes[key]) {
          pGridOptions[key] = changes[key].currentValue;
        }
      });
      ComponentUtil.BOOLEAN_PROPERTIES.forEach(function(key) {
        if (changes[key]) {
          pGridOptions[key] = ComponentUtil.toBoolean(changes[key].currentValue);
        }
      });
      ComponentUtil.NUMBER_PROPERTIES.forEach(function(key) {
        if (changes[key]) {
          pGridOptions[key] = ComponentUtil.toNumber(changes[key].currentValue);
        }
      });
      ComponentUtil.getEventCallbacks().forEach(function(funcName) {
        if (changes[funcName]) {
          pGridOptions[funcName] = changes[funcName].currentValue;
        }
      });
      if (changes.showToolPanel) {
        api.showToolPanel(ComponentUtil.toBoolean(changes.showToolPanel.currentValue));
      }
      if (changes.quickFilterText) {
        api.setQuickFilter(changes.quickFilterText.currentValue);
      }
      if (changes.rowData) {
        api.setRowData(changes.rowData.currentValue);
      }
      if (changes.floatingTopRowData) {
        api.setFloatingTopRowData(changes.floatingTopRowData.currentValue);
      }
      if (changes.floatingBottomRowData) {
        api.setFloatingBottomRowData(changes.floatingBottomRowData.currentValue);
      }
      if (changes.columnDefs) {
        api.setColumnDefs(changes.columnDefs.currentValue);
      }
      if (changes.datasource) {
        api.setDatasource(changes.datasource.currentValue);
      }
      if (changes.headerHeight) {
        api.setHeaderHeight(ComponentUtil.toNumber(changes.headerHeight.currentValue));
      }
      if (changes.pivotMode) {
        columnApi.setPivotMode(ComponentUtil.toBoolean(changes.pivotMode.currentValue));
      }
    };
    ComponentUtil.toBoolean = function(value) {
      if (typeof value === 'boolean') {
        return value;
      } else if (typeof value === 'string') {
        return value.toUpperCase() === 'TRUE' || value == '';
      } else {
        return false;
      }
    };
    ComponentUtil.toNumber = function(value) {
      if (typeof value === 'number') {
        return value;
      } else if (typeof value === 'string') {
        return Number(value);
      } else {
        return undefined;
      }
    };
    return ComponentUtil;
  }());
  ComponentUtil.EVENTS = [];
  ComponentUtil.STRING_PROPERTIES = ['sortingOrder', 'rowClass', 'rowSelection', 'overlayLoadingTemplate', 'overlayNoRowsTemplate', 'headerCellTemplate', 'quickFilterText', 'rowModelType', 'editType'];
  ComponentUtil.OBJECT_PROPERTIES = ['rowStyle', 'context', 'groupColumnDef', 'localeText', 'icons', 'datasource', 'viewportDatasource', 'groupRowRendererParams', 'aggFuncs', 'fullWidthCellRendererParams', 'defaultColGroupDef', 'defaultColDef'];
  ComponentUtil.ARRAY_PROPERTIES = ['slaveGrids', 'rowData', 'floatingTopRowData', 'floatingBottomRowData', 'columnDefs', 'excelStyles'];
  ComponentUtil.NUMBER_PROPERTIES = ['rowHeight', 'rowBuffer', 'colWidth', 'headerHeight', 'groupDefaultExpanded', 'minColWidth', 'maxColWidth', 'viewportRowModelPageSize', 'viewportRowModelBufferSize', 'layoutInterval', 'autoSizePadding', 'maxPagesInCache', 'maxConcurrentDatasourceRequests', 'paginationOverflowSize', 'paginationPageSize', 'paginationInitialRowCount', 'scrollbarWidth'];
  ComponentUtil.BOOLEAN_PROPERTIES = ['toolPanelSuppressRowGroups', 'toolPanelSuppressValues', 'toolPanelSuppressPivots', 'toolPanelSuppressPivotMode', 'suppressRowClickSelection', 'suppressCellSelection', 'suppressHorizontalScroll', 'debug', 'enableColResize', 'enableCellExpressions', 'enableSorting', 'enableServerSideSorting', 'enableFilter', 'enableServerSideFilter', 'angularCompileRows', 'angularCompileFilters', 'angularCompileHeaders', 'groupSuppressAutoColumn', 'groupSelectsChildren', 'groupIncludeFooter', 'groupUseEntireRow', 'groupSuppressRow', 'groupSuppressBlankHeader', 'forPrint', 'suppressMenuHide', 'rowDeselection', 'unSortIcon', 'suppressMultiSort', 'suppressScrollLag', 'singleClickEdit', 'suppressLoadingOverlay', 'suppressNoRowsOverlay', 'suppressAutoSize', 'suppressParentsInRowNodes', 'showToolPanel', 'suppressColumnMoveAnimation', 'suppressMovableColumns', 'suppressFieldDotNotation', 'enableRangeSelection', 'suppressEnterprise', 'rowGroupPanelShow', 'pivotPanelShow', 'suppressTouch', 'suppressContextMenu', 'suppressMenuFilterPanel', 'suppressMenuMainPanel', 'suppressMenuColumnPanel', 'enableStatusBar', 'rememberGroupStateWhenNewData', 'enableCellChangeFlash', 'suppressDragLeaveHidesColumns', 'suppressMiddleClickScrolls', 'suppressPreventDefaultOnMouseWheel', 'suppressUseColIdForGroups', 'suppressCopyRowsToClipboard', 'pivotMode', 'suppressAggFuncInHeader', 'suppressColumnVirtualisation', 'suppressFocusAfterRefresh', 'functionsPassive', 'functionsReadOnly', 'suppressRowHoverClass', 'animateRows', 'groupSelectsFiltered', 'groupRemoveSingleChildren', 'enableRtl', 'suppressClickEdit', 'enableGroupEdit', 'embedFullWidthRows', 'suppressTabbing'];
  ComponentUtil.FUNCTION_PROPERTIES = ['headerCellRenderer', 'localeTextFunc', 'groupRowInnerRenderer', 'groupRowInnerRendererFramework', 'dateComponent', 'dateComponentFramework', 'groupRowRenderer', 'groupRowRendererFramework', 'isScrollLag', 'isExternalFilterPresent', 'getRowHeight', 'doesExternalFilterPass', 'getRowClass', 'getRowStyle', 'getHeaderCellTemplate', 'traverseNode', 'getContextMenuItems', 'getMainMenuItems', 'processRowPostCreate', 'processCellForClipboard', 'getNodeChildDetails', 'groupRowAggNodes', 'getRowNodeId', 'isFullWidthCell', 'fullWidthCellRenderer', 'fullWidthCellRendererFramework', 'doesDataFlower', 'processSecondaryColDef', 'processSecondaryColGroupDef', 'getBusinessKeyForNode', 'sendToClipboard', 'navigateToNextCell', 'tabToNextCell', 'processCellFromClipboard', 'getDocument'];
  ComponentUtil.ALL_PROPERTIES = ComponentUtil.ARRAY_PROPERTIES.concat(ComponentUtil.OBJECT_PROPERTIES).concat(ComponentUtil.STRING_PROPERTIES).concat(ComponentUtil.NUMBER_PROPERTIES).concat(ComponentUtil.FUNCTION_PROPERTIES).concat(ComponentUtil.BOOLEAN_PROPERTIES);
  exports.ComponentUtil = ComponentUtil;
  utils_1.Utils.iterateObject(events_1.Events, function(key, value) {
    ComponentUtil.EVENTS.push(value);
  });
  function checkForDeprecated(changes) {
    if (changes.ready || changes.onReady) {
      console.warn('ag-grid: as of v3.3 ready event is now called gridReady, so the callback should be onGridReady');
    }
    if (changes.rowDeselected || changes.onRowDeselected) {
      console.warn('ag-grid: as of v3.4 rowDeselected no longer exists. Please check the docs.');
    }
  }
})(require('process'));
