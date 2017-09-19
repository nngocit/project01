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
  var logger_1 = require('./logger');
  var utils_1 = require('./utils');
  var context_1 = require('./context/context');
  var context_2 = require('./context/context');
  var EventService = EventService_1 = (function() {
    function EventService() {
      this.allListeners = {};
      this.globalListeners = [];
    }
    EventService.prototype.agWire = function(loggerFactory, globalEventListener) {
      if (globalEventListener === void 0) {
        globalEventListener = null;
      }
      this.logger = loggerFactory.create('EventService');
      if (globalEventListener) {
        this.addGlobalListener(globalEventListener);
      }
    };
    EventService.prototype.getListenerList = function(eventType) {
      var listenerList = this.allListeners[eventType];
      if (!listenerList) {
        listenerList = [];
        this.allListeners[eventType] = listenerList;
      }
      return listenerList;
    };
    EventService.prototype.addEventListener = function(eventType, listener) {
      var listenerList = this.getListenerList(eventType);
      if (listenerList.indexOf(listener) < 0) {
        listenerList.push(listener);
      }
    };
    EventService.prototype.addModalPriorityEventListener = function(eventType, listener) {
      this.addEventListener(eventType + EventService_1.PRIORITY, listener);
    };
    EventService.prototype.addGlobalListener = function(listener) {
      this.globalListeners.push(listener);
    };
    EventService.prototype.removeEventListener = function(eventType, listener) {
      var listenerList = this.getListenerList(eventType);
      utils_1.Utils.removeFromArray(listenerList, listener);
    };
    EventService.prototype.removeGlobalListener = function(listener) {
      utils_1.Utils.removeFromArray(this.globalListeners, listener);
    };
    EventService.prototype.dispatchEvent = function(eventType, event) {
      if (!event) {
        event = {};
      }
      var p1ListenerList = this.getListenerList(eventType + EventService_1.PRIORITY);
      p1ListenerList.forEach(function(listener) {
        listener(event);
      });
      var listenerList = this.getListenerList(eventType);
      listenerList.forEach(function(listener) {
        listener(event);
      });
      this.globalListeners.forEach(function(listener) {
        listener(eventType, event);
      });
    };
    return EventService;
  }());
  EventService.PRIORITY = '-P1';
  __decorate([__param(0, context_2.Qualifier('loggerFactory')), __param(1, context_2.Qualifier('globalEventListener')), __metadata("design:type", Function), __metadata("design:paramtypes", [logger_1.LoggerFactory, Function]), __metadata("design:returntype", void 0)], EventService.prototype, "agWire", null);
  EventService = EventService_1 = __decorate([context_1.Bean('eventService')], EventService);
  exports.EventService = EventService;
  var EventService_1;
})(require('process'));
