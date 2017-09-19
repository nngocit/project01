/* */ 
"use strict";
var utils_1 = require('../utils');
var RowContainerComponent = (function() {
  function RowContainerComponent(params) {
    this.childCount = 0;
    this.eContainer = params.eContainer;
    this.eViewport = params.eViewport;
    if (params.useDocumentFragment) {
      this.setupDocumentFragment();
    }
    this.hideWhenNoChildren = params.hideWhenNoChildren;
    this.checkVisibility();
  }
  RowContainerComponent.prototype.setupDocumentFragment = function() {
    var browserSupportsDocumentFragment = !!document.createDocumentFragment;
    if (browserSupportsDocumentFragment) {
      this.eDocumentFragment = document.createDocumentFragment();
    }
  };
  RowContainerComponent.prototype.setHeight = function(height) {
    this.eContainer.style.height = height + "px";
  };
  RowContainerComponent.prototype.appendRowElement = function(eRow) {
    var eTarget = this.eDocumentFragment ? this.eDocumentFragment : this.eContainer;
    eTarget.appendChild(eRow);
    this.childCount++;
    this.checkVisibility();
  };
  RowContainerComponent.prototype.removeRowElement = function(eRow) {
    this.eContainer.removeChild(eRow);
    this.childCount--;
    this.checkVisibility();
  };
  RowContainerComponent.prototype.flushDocumentFragment = function() {
    if (utils_1.Utils.exists(this.eDocumentFragment)) {
      utils_1.Utils.prependDC(this.eContainer, this.eDocumentFragment);
    }
  };
  RowContainerComponent.prototype.checkVisibility = function() {
    if (!this.hideWhenNoChildren) {
      return;
    }
    var eGui = this.eViewport ? this.eViewport : this.eContainer;
    var visible = this.childCount > 0;
    if (this.visible !== visible) {
      this.visible = visible;
      utils_1.Utils.setVisible(eGui, visible);
    }
  };
  return RowContainerComponent;
}());
exports.RowContainerComponent = RowContainerComponent;
