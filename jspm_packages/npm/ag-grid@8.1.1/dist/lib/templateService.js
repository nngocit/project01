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
  var context_1 = require('./context/context');
  var context_2 = require('./context/context');
  var TemplateService = (function() {
    function TemplateService() {
      this.templateCache = {};
      this.waitingCallbacks = {};
    }
    TemplateService.prototype.getTemplate = function(url, callback) {
      var templateFromCache = this.templateCache[url];
      if (templateFromCache) {
        return templateFromCache;
      }
      var callbackList = this.waitingCallbacks[url];
      var that = this;
      if (!callbackList) {
        callbackList = [];
        this.waitingCallbacks[url] = callbackList;
        var client = new XMLHttpRequest();
        client.onload = function() {
          that.handleHttpResult(this, url);
        };
        client.open("GET", url);
        client.send();
      }
      if (callback) {
        callbackList.push(callback);
      }
      return null;
    };
    TemplateService.prototype.handleHttpResult = function(httpResult, url) {
      if (httpResult.status !== 200 || httpResult.response === null) {
        console.warn('Unable to get template error ' + httpResult.status + ' - ' + url);
        return;
      }
      this.templateCache[url] = httpResult.response || httpResult.responseText;
      var callbacks = this.waitingCallbacks[url];
      for (var i = 0; i < callbacks.length; i++) {
        var callback = callbacks[i];
        callback();
      }
      if (this.$scope) {
        var that = this;
        setTimeout(function() {
          that.$scope.$apply();
        }, 0);
      }
    };
    return TemplateService;
  }());
  __decorate([context_2.Autowired('$scope'), __metadata("design:type", Object)], TemplateService.prototype, "$scope", void 0);
  TemplateService = __decorate([context_1.Bean('templateService')], TemplateService);
  exports.TemplateService = TemplateService;
})(require('process'));
