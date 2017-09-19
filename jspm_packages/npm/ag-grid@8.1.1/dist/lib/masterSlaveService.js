/* */ 
(function(process) {
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
  var gridOptionsWrapper_1 = require('./gridOptionsWrapper');
  var columnController_1 = require('./columnController/columnController');
  var gridPanel_1 = require('./gridPanel/gridPanel');
  var eventService_1 = require('./eventService');
  var logger_1 = require('./logger');
  var events_1 = require('./events');
  var context_1 = require('./context/context');
  var context_2 = require('./context/context');
  var context_3 = require('./context/context');
  var context_4 = require('./context/context');
  var MasterSlaveService = (function() {
    function MasterSlaveService() {
      this.consuming = false;
    }
    MasterSlaveService.prototype.setBeans = function(loggerFactory) {
      this.logger = loggerFactory.create('MasterSlaveService');
    };
    MasterSlaveService.prototype.init = function() {
      this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_MOVED, this.fireColumnEvent.bind(this));
      this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_VISIBLE, this.fireColumnEvent.bind(this));
      this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_PINNED, this.fireColumnEvent.bind(this));
      this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_GROUP_OPENED, this.fireColumnEvent.bind(this));
      this.eventService.addEventListener(events_1.Events.EVENT_COLUMN_RESIZED, this.fireColumnEvent.bind(this));
    };
    MasterSlaveService.prototype.fireEvent = function(callback) {
      if (this.consuming) {
        return;
      }
      var slaveGrids = this.gridOptionsWrapper.getSlaveGrids();
      if (slaveGrids) {
        slaveGrids.forEach(function(slaveGridOptions) {
          if (slaveGridOptions.api) {
            var slaveService = slaveGridOptions.api.__getMasterSlaveService();
            callback(slaveService);
          }
        });
      }
    };
    MasterSlaveService.prototype.onEvent = function(callback) {
      this.consuming = true;
      callback();
      this.consuming = false;
    };
    MasterSlaveService.prototype.fireColumnEvent = function(event) {
      this.fireEvent(function(slaveService) {
        slaveService.onColumnEvent(event);
      });
    };
    MasterSlaveService.prototype.fireHorizontalScrollEvent = function(horizontalScroll) {
      this.fireEvent(function(slaveService) {
        slaveService.onScrollEvent(horizontalScroll);
      });
    };
    MasterSlaveService.prototype.onScrollEvent = function(horizontalScroll) {
      var _this = this;
      this.onEvent(function() {
        _this.gridPanel.setHorizontalScrollPosition(horizontalScroll);
      });
    };
    MasterSlaveService.prototype.getMasterColumns = function(event) {
      var result = [];
      if (event.getColumn()) {
        result.push(event.getColumn());
      }
      if (event.getColumns()) {
        event.getColumns().forEach(function(column) {
          result.push(column);
        });
      }
      return result;
    };
    MasterSlaveService.prototype.getColumnIds = function(event) {
      var result = [];
      if (event.getColumn()) {
        result.push(event.getColumn().getColId());
      } else if (event.getColumns()) {
        event.getColumns().forEach(function(column) {
          result.push(column.getColId());
        });
      }
      return result;
    };
    MasterSlaveService.prototype.onColumnEvent = function(event) {
      var _this = this;
      this.onEvent(function() {
        var masterColumn = event.getColumn();
        var slaveColumn;
        if (masterColumn) {
          slaveColumn = _this.columnController.getPrimaryColumn(masterColumn.getColId());
        }
        if (masterColumn && !slaveColumn) {
          return;
        }
        var masterColumnGroup = event.getColumnGroup();
        var slaveColumnGroup;
        if (masterColumnGroup) {
          var colId = masterColumnGroup.getGroupId();
          var instanceId = masterColumnGroup.getInstanceId();
          slaveColumnGroup = _this.columnController.getColumnGroup(colId, instanceId);
        }
        if (masterColumnGroup && !slaveColumnGroup) {
          return;
        }
        var columnIds = _this.getColumnIds(event);
        var masterColumns = _this.getMasterColumns(event);
        switch (event.getType()) {
          case events_1.Events.EVENT_COLUMN_PIVOT_CHANGED:
            console.warn('ag-Grid: pivoting is not supported with Master / Slave grids. ' + 'You can only use one of these features at a time in a grid.');
            break;
          case events_1.Events.EVENT_COLUMN_MOVED:
            _this.logger.log('onColumnEvent-> processing ' + event + ' toIndex = ' + event.getToIndex());
            _this.columnController.moveColumns(columnIds, event.getToIndex());
            break;
          case events_1.Events.EVENT_COLUMN_VISIBLE:
            _this.logger.log('onColumnEvent-> processing ' + event + ' visible = ' + event.isVisible());
            _this.columnController.setColumnsVisible(columnIds, event.isVisible());
            break;
          case events_1.Events.EVENT_COLUMN_PINNED:
            _this.logger.log('onColumnEvent-> processing ' + event + ' pinned = ' + event.getPinned());
            _this.columnController.setColumnsPinned(columnIds, event.getPinned());
            break;
          case events_1.Events.EVENT_COLUMN_GROUP_OPENED:
            _this.logger.log('onColumnEvent-> processing ' + event + ' expanded = ' + masterColumnGroup.isExpanded());
            _this.columnController.setColumnGroupOpened(slaveColumnGroup, masterColumnGroup.isExpanded());
            break;
          case events_1.Events.EVENT_COLUMN_RESIZED:
            masterColumns.forEach(function(masterColumn) {
              _this.logger.log('onColumnEvent-> processing ' + event + ' actualWidth = ' + masterColumn.getActualWidth());
              _this.columnController.setColumnWidth(masterColumn.getColId(), masterColumn.getActualWidth(), event.isFinished());
            });
            break;
        }
      });
    };
    return MasterSlaveService;
  }());
  __decorate([context_3.Autowired('gridOptionsWrapper'), __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)], MasterSlaveService.prototype, "gridOptionsWrapper", void 0);
  __decorate([context_3.Autowired('columnController'), __metadata("design:type", columnController_1.ColumnController)], MasterSlaveService.prototype, "columnController", void 0);
  __decorate([context_3.Autowired('gridPanel'), __metadata("design:type", gridPanel_1.GridPanel)], MasterSlaveService.prototype, "gridPanel", void 0);
  __decorate([context_3.Autowired('eventService'), __metadata("design:type", eventService_1.EventService)], MasterSlaveService.prototype, "eventService", void 0);
  __decorate([__param(0, context_2.Qualifier('loggerFactory')), __metadata("design:type", Function), __metadata("design:paramtypes", [logger_1.LoggerFactory]), __metadata("design:returntype", void 0)], MasterSlaveService.prototype, "setBeans", null);
  __decorate([context_4.PostConstruct, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], MasterSlaveService.prototype, "init", null);
  MasterSlaveService = __decorate([context_1.Bean('masterSlaveService')], MasterSlaveService);
  exports.MasterSlaveService = MasterSlaveService;
})(require('process'));