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
var __param = (this && this.__param) || function(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
};
var utils_1 = require('../../utils');
var context_1 = require('../../context/context');
var eventService_1 = require('../../eventService');
var events_1 = require('../../events');
var logger_1 = require('../../logger');
var virtualPage_1 = require('./virtualPage');
var VirtualPageCache = (function() {
  function VirtualPageCache(cacheSettings) {
    this.pages = {};
    this.activePageLoadsCount = 0;
    this.pagesInCacheCount = 0;
    this.maxRowFound = false;
    this.active = true;
    this.cacheParams = cacheSettings;
    this.virtualRowCount = cacheSettings.paginationInitialRowCount;
  }
  VirtualPageCache.prototype.setBeans = function(loggerFactory) {
    this.logger = loggerFactory.create('VirtualPageCache');
  };
  VirtualPageCache.prototype.init = function() {
    this.getRow(0);
  };
  VirtualPageCache.prototype.getRowCombinedHeight = function() {
    return this.virtualRowCount * this.cacheParams.rowHeight;
  };
  VirtualPageCache.prototype.forEachNode = function(callback) {
    var _this = this;
    var index = 0;
    utils_1.Utils.iterateObject(this.pages, function(key, cachePage) {
      var start = cachePage.getStartRow();
      var end = cachePage.getEndRow();
      for (var rowIndex = start; rowIndex < end; rowIndex++) {
        if (rowIndex < _this.virtualRowCount) {
          var rowNode = cachePage.getRow(rowIndex);
          callback(rowNode, index);
          index++;
        }
      }
    });
  };
  VirtualPageCache.prototype.getRowIndexAtPixel = function(pixel) {
    if (this.cacheParams.rowHeight !== 0) {
      var rowIndexForPixel = Math.floor(pixel / this.cacheParams.rowHeight);
      if (rowIndexForPixel >= this.virtualRowCount) {
        return this.virtualRowCount - 1;
      } else {
        return rowIndexForPixel;
      }
    } else {
      return 0;
    }
  };
  VirtualPageCache.prototype.moveItemsDown = function(page, moveFromIndex, moveCount) {
    var startRow = page.getStartRow();
    var endRow = page.getEndRow();
    var indexOfLastRowToMove = moveFromIndex + moveCount;
    for (var currentRowIndex = endRow - 1; currentRowIndex >= startRow; currentRowIndex--) {
      if (currentRowIndex < indexOfLastRowToMove) {
        continue;
      }
      var indexOfNodeWeWant = currentRowIndex - moveCount;
      var nodeForThisIndex = this.getRow(indexOfNodeWeWant, true);
      if (nodeForThisIndex) {
        page.setRowNode(currentRowIndex, nodeForThisIndex);
      } else {
        page.setBlankRowNode(currentRowIndex);
        page.setDirty();
      }
    }
  };
  VirtualPageCache.prototype.insertItems = function(page, indexToInsert, items) {
    var pageStartRow = page.getStartRow();
    var pageEndRow = page.getEndRow();
    var newRowNodes = [];
    for (var index = 0; index < items.length; index++) {
      var rowIndex = indexToInsert + index;
      var currentRowInThisPage = rowIndex >= pageStartRow && rowIndex < pageEndRow;
      if (currentRowInThisPage) {
        var dataItem = items[index];
        var newRowNode = page.setNewData(rowIndex, dataItem);
        newRowNodes.push(newRowNode);
      }
    }
    return newRowNodes;
  };
  VirtualPageCache.prototype.insertItemsAtIndex = function(indexToInsert, items) {
    var _this = this;
    var pageIds = Object.keys(this.pages).map(function(str) {
      return parseInt(str);
    }).sort().reverse();
    var newNodes = [];
    pageIds.forEach(function(pageId) {
      var page = _this.pages[pageId];
      var pageEndRow = page.getEndRow();
      if (pageEndRow <= indexToInsert) {
        return;
      }
      _this.moveItemsDown(page, indexToInsert, items.length);
      var newNodesThisPage = _this.insertItems(page, indexToInsert, items);
      newNodesThisPage.forEach(function(rowNode) {
        return newNodes.push(rowNode);
      });
    });
    if (this.maxRowFound) {
      this.virtualRowCount += items.length;
    }
    this.dispatchModelUpdated();
    this.eventService.dispatchEvent(events_1.Events.EVENT_ITEMS_ADDED, newNodes);
  };
  VirtualPageCache.prototype.getRowCount = function() {
    return this.virtualRowCount;
  };
  VirtualPageCache.prototype.onPageLoaded = function(event) {
    if (!this.active) {
      return;
    }
    this.logger.log("onPageLoaded: page = " + event.page.getPageNumber() + ", lastRow = " + event.lastRow);
    this.activePageLoadsCount--;
    this.checkPageToLoad();
    if (event.success) {
      this.checkVirtualRowCount(event.page, event.lastRow);
    }
  };
  VirtualPageCache.prototype.destroy = function() {
    this.active = false;
  };
  VirtualPageCache.prototype.getRow = function(rowIndex, dontCreatePage) {
    if (dontCreatePage === void 0) {
      dontCreatePage = false;
    }
    var pageNumber = Math.floor(rowIndex / this.cacheParams.pageSize);
    var page = this.pages[pageNumber];
    if (!page) {
      if (dontCreatePage) {
        return null;
      } else {
        page = this.createPage(pageNumber);
      }
    }
    return page.getRow(rowIndex);
  };
  VirtualPageCache.prototype.createPage = function(pageNumber) {
    var newPage = new virtualPage_1.VirtualPage(pageNumber, this.cacheParams);
    this.context.wireBean(newPage);
    newPage.addEventListener(virtualPage_1.VirtualPage.EVENT_LOAD_COMPLETE, this.onPageLoaded.bind(this));
    this.pages[pageNumber] = newPage;
    this.pagesInCacheCount++;
    var needToPurge = utils_1.Utils.exists(this.cacheParams.maxPagesInCache) && this.pagesInCacheCount > this.cacheParams.maxPagesInCache;
    if (needToPurge) {
      var lruPage = this.findLeastRecentlyUsedPage(newPage);
      this.removePageFromCache(lruPage);
    }
    this.checkPageToLoad();
    return newPage;
  };
  VirtualPageCache.prototype.removePageFromCache = function(pageToRemove) {
    if (!pageToRemove) {
      return;
    }
    delete this.pages[pageToRemove.getPageNumber()];
    this.pagesInCacheCount--;
  };
  VirtualPageCache.prototype.printCacheStatus = function() {
    this.logger.log("checkPageToLoad: activePageLoadsCount = " + this.activePageLoadsCount + ", pages = " + JSON.stringify(this.getPageState()));
  };
  VirtualPageCache.prototype.checkPageToLoad = function() {
    this.printCacheStatus();
    if (this.activePageLoadsCount >= this.cacheParams.maxConcurrentDatasourceRequests) {
      this.logger.log("checkPageToLoad: max loads exceeded");
      return;
    }
    var pageToLoad = null;
    utils_1.Utils.iterateObject(this.pages, function(key, cachePage) {
      if (cachePage.getState() === virtualPage_1.VirtualPage.STATE_DIRTY) {
        pageToLoad = cachePage;
      }
    });
    if (pageToLoad) {
      pageToLoad.load();
      this.activePageLoadsCount++;
      this.logger.log("checkPageToLoad: loading page " + pageToLoad.getPageNumber());
      this.printCacheStatus();
    } else {
      this.logger.log("checkPageToLoad: no pages to load");
    }
  };
  VirtualPageCache.prototype.findLeastRecentlyUsedPage = function(pageToExclude) {
    var lruPage = null;
    utils_1.Utils.iterateObject(this.pages, function(key, page) {
      if (page === pageToExclude) {
        return;
      }
      if (utils_1.Utils.missing(lruPage) || page.getLastAccessed() < lruPage.getLastAccessed()) {
        lruPage = page;
      }
    });
    return lruPage;
  };
  VirtualPageCache.prototype.checkVirtualRowCount = function(page, lastRow) {
    if (typeof lastRow === 'number' && lastRow >= 0) {
      this.virtualRowCount = lastRow;
      this.maxRowFound = true;
      this.dispatchModelUpdated();
    } else if (!this.maxRowFound) {
      var lastRowIndex = (page.getPageNumber() + 1) * this.cacheParams.pageSize;
      var lastRowIndexPlusOverflow = lastRowIndex + this.cacheParams.paginationOverflowSize;
      if (this.virtualRowCount < lastRowIndexPlusOverflow) {
        this.virtualRowCount = lastRowIndexPlusOverflow;
        this.dispatchModelUpdated();
      }
    }
  };
  VirtualPageCache.prototype.dispatchModelUpdated = function() {
    if (this.active) {
      this.eventService.dispatchEvent(events_1.Events.EVENT_MODEL_UPDATED);
    }
  };
  VirtualPageCache.prototype.getPageState = function() {
    var result = [];
    utils_1.Utils.iterateObject(this.pages, function(pageNumber, page) {
      result.push({
        pageNumber: pageNumber,
        startRow: page.getStartRow(),
        endRow: page.getEndRow(),
        pageStatus: page.getState()
      });
    });
    return result;
  };
  VirtualPageCache.prototype.refreshVirtualPageCache = function() {
    utils_1.Utils.iterateObject(this.pages, function(pageId, page) {
      page.setDirty();
    });
    this.checkPageToLoad();
  };
  VirtualPageCache.prototype.purgeVirtualPageCache = function() {
    var _this = this;
    var pagesList = utils_1.Utils.values(this.pages);
    pagesList.forEach(function(virtualPage) {
      return _this.removePageFromCache(virtualPage);
    });
    this.dispatchModelUpdated();
  };
  VirtualPageCache.prototype.getVirtualRowCount = function() {
    return this.virtualRowCount;
  };
  VirtualPageCache.prototype.isMaxRowFound = function() {
    return this.maxRowFound;
  };
  VirtualPageCache.prototype.setVirtualRowCount = function(rowCount, maxRowFound) {
    this.virtualRowCount = rowCount;
    if (utils_1.Utils.exists(maxRowFound)) {
      this.maxRowFound = maxRowFound;
    }
    if (!this.maxRowFound) {
      if (this.virtualRowCount % this.cacheParams.pageSize === 0) {
        this.virtualRowCount++;
      }
    }
    this.dispatchModelUpdated();
  };
  return VirtualPageCache;
}());
__decorate([context_1.Autowired('eventService'), __metadata("design:type", eventService_1.EventService)], VirtualPageCache.prototype, "eventService", void 0);
__decorate([context_1.Autowired('context'), __metadata("design:type", context_1.Context)], VirtualPageCache.prototype, "context", void 0);
__decorate([__param(0, context_1.Qualifier('loggerFactory')), __metadata("design:type", Function), __metadata("design:paramtypes", [logger_1.LoggerFactory]), __metadata("design:returntype", void 0)], VirtualPageCache.prototype, "setBeans", null);
__decorate([context_1.PostConstruct, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], VirtualPageCache.prototype, "init", null);
exports.VirtualPageCache = VirtualPageCache;
