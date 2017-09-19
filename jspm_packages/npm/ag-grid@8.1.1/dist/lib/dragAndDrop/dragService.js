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
var utils_1 = require('../utils');
var eventService_1 = require('../eventService');
var events_1 = require('../events');
var gridOptionsWrapper_1 = require('../gridOptionsWrapper');
var DragService = (function() {
  function DragService() {
    this.onMouseUpListener = this.onMouseUp.bind(this);
    this.onMouseMoveListener = this.onMouseMove.bind(this);
    this.onTouchEndListener = this.onTouchUp.bind(this);
    this.onTouchMoveListener = this.onTouchMove.bind(this);
    this.dragEndFunctions = [];
    this.dragSources = [];
  }
  DragService.prototype.init = function() {
    this.logger = this.loggerFactory.create('DragService');
  };
  DragService.prototype.destroy = function() {
    this.dragSources.forEach(this.removeListener.bind(this));
    this.dragSources.length = 0;
  };
  DragService.prototype.removeListener = function(dragSourceAndListener) {
    var element = dragSourceAndListener.dragSource.eElement;
    var mouseDownListener = dragSourceAndListener.mouseDownListener;
    element.removeEventListener('mousedown', mouseDownListener);
    if (dragSourceAndListener.touchEnabled) {
      var touchStartListener = dragSourceAndListener.touchStartListener;
      element.removeEventListener('touchstart', touchStartListener);
    }
  };
  DragService.prototype.removeDragSource = function(params) {
    var dragSourceAndListener = utils_1.Utils.find(this.dragSources, function(item) {
      return item.dragSource === params;
    });
    if (!dragSourceAndListener) {
      return;
    }
    this.removeListener(dragSourceAndListener);
    utils_1.Utils.removeFromArray(this.dragSources, dragSourceAndListener);
  };
  DragService.prototype.setNoSelectToBody = function(noSelect) {
    var usrDocument = this.gridOptionsWrapper.getDocument();
    var eBody = usrDocument.querySelector('body');
    if (utils_1.Utils.exists(eBody)) {
      utils_1.Utils.addOrRemoveCssClass(eBody, 'ag-body-no-select', noSelect);
    }
  };
  DragService.prototype.addDragSource = function(params, includeTouch) {
    if (includeTouch === void 0) {
      includeTouch = false;
    }
    var mouseListener = this.onMouseDown.bind(this, params);
    params.eElement.addEventListener('mousedown', mouseListener);
    var touchListener = null;
    var suppressTouch = this.gridOptionsWrapper.isSuppressTouch();
    var reallyIncludeTouch = includeTouch && !suppressTouch;
    if (reallyIncludeTouch) {
      touchListener = this.onTouchStart.bind(this, params);
      params.eElement.addEventListener('touchstart', touchListener);
    }
    this.dragSources.push({
      dragSource: params,
      mouseDownListener: mouseListener,
      touchStartListener: touchListener,
      touchEnabled: includeTouch
    });
  };
  DragService.prototype.onTouchStart = function(params, touchEvent) {
    var _this = this;
    this.currentDragParams = params;
    this.dragging = false;
    var touch = touchEvent.touches[0];
    this.touchLastTime = touch;
    this.touchStart = touch;
    touchEvent.preventDefault();
    params.eElement.addEventListener('touchmove', this.onTouchMoveListener);
    params.eElement.addEventListener('touchend', this.onTouchEndListener);
    params.eElement.addEventListener('touchcancel', this.onTouchEndListener);
    this.dragEndFunctions.push(function() {
      params.eElement.removeEventListener('touchmove', _this.onTouchMoveListener);
      params.eElement.removeEventListener('touchend', _this.onTouchEndListener);
      params.eElement.removeEventListener('touchcancel', _this.onTouchEndListener);
    });
    if (params.dragStartPixels === 0) {
      this.onCommonMove(touch, this.touchStart);
    }
  };
  DragService.prototype.onMouseDown = function(params, mouseEvent) {
    var _this = this;
    if (mouseEvent.button !== 0) {
      return;
    }
    this.currentDragParams = params;
    this.dragging = false;
    this.mouseEventLastTime = mouseEvent;
    this.mouseStartEvent = mouseEvent;
    var usrDocument = this.gridOptionsWrapper.getDocument();
    usrDocument.addEventListener('mousemove', this.onMouseMoveListener);
    usrDocument.addEventListener('mouseup', this.onMouseUpListener);
    this.dragEndFunctions.push(function() {
      usrDocument.removeEventListener('mousemove', _this.onMouseMoveListener);
      usrDocument.removeEventListener('mouseup', _this.onMouseUpListener);
    });
    if (params.dragStartPixels === 0) {
      this.onMouseMove(mouseEvent);
    }
  };
  DragService.prototype.isEventNearStartEvent = function(currentEvent, startEvent) {
    var requiredPixelDiff = utils_1.Utils.exists(this.currentDragParams.dragStartPixels) ? this.currentDragParams.dragStartPixels : 4;
    return utils_1.Utils.areEventsNear(currentEvent, startEvent, requiredPixelDiff);
  };
  DragService.prototype.getFirstActiveTouch = function(touchList) {
    for (var i = 0; i < touchList.length; i++) {
      var matches = touchList[i].identifier === this.touchStart.identifier;
      if (matches) {
        return touchList[i];
      }
    }
    return null;
  };
  DragService.prototype.onCommonMove = function(currentEvent, startEvent) {
    if (!this.dragging) {
      var toEarlyToDrag = !this.dragging && this.isEventNearStartEvent(currentEvent, startEvent);
      if (toEarlyToDrag) {
        return;
      } else {
        this.dragging = true;
        this.eventService.dispatchEvent(events_1.Events.EVENT_DRAG_STARTED);
        this.currentDragParams.onDragStart(startEvent);
        this.setNoSelectToBody(true);
      }
    }
    this.currentDragParams.onDragging(currentEvent);
  };
  DragService.prototype.onTouchMove = function(touchEvent) {
    var touch = this.getFirstActiveTouch(touchEvent.touches);
    if (!touch) {
      return;
    }
    this.onCommonMove(touch, this.touchStart);
  };
  DragService.prototype.onMouseMove = function(mouseEvent) {
    this.onCommonMove(mouseEvent, this.mouseStartEvent);
  };
  DragService.prototype.onTouchUp = function(touchEvent) {
    var touch = this.getFirstActiveTouch(touchEvent.targetTouches);
    if (!touch) {
      touch = this.touchLastTime;
    }
    this.onUpCommon(touch);
  };
  DragService.prototype.onMouseUp = function(mouseEvent) {
    this.onUpCommon(mouseEvent);
  };
  DragService.prototype.onUpCommon = function(eventOrTouch) {
    if (this.dragging) {
      this.dragging = false;
      this.currentDragParams.onDragStop(eventOrTouch);
      this.eventService.dispatchEvent(events_1.Events.EVENT_DRAG_STOPPED);
    }
    this.setNoSelectToBody(false);
    this.mouseStartEvent = null;
    this.mouseEventLastTime = null;
    this.touchStart = null;
    this.touchLastTime = null;
    this.currentDragParams = null;
    this.dragEndFunctions.forEach(function(func) {
      return func();
    });
    this.dragEndFunctions.length = 0;
  };
  return DragService;
}());
__decorate([context_1.Autowired('loggerFactory'), __metadata("design:type", logger_1.LoggerFactory)], DragService.prototype, "loggerFactory", void 0);
__decorate([context_1.Autowired('eventService'), __metadata("design:type", eventService_1.EventService)], DragService.prototype, "eventService", void 0);
__decorate([context_1.Autowired('gridOptionsWrapper'), __metadata("design:type", gridOptionsWrapper_1.GridOptionsWrapper)], DragService.prototype, "gridOptionsWrapper", void 0);
__decorate([context_1.PostConstruct, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], DragService.prototype, "init", null);
__decorate([context_1.PreDestroy, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], DragService.prototype, "destroy", null);
DragService = __decorate([context_1.Bean('dragService')], DragService);
exports.DragService = DragService;
