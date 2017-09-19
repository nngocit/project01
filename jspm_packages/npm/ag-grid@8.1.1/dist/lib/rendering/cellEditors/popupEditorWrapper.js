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
var component_1 = require('../../widgets/component');
var PopupEditorWrapper = (function(_super) {
  __extends(PopupEditorWrapper, _super);
  function PopupEditorWrapper(cellEditor) {
    var _this = _super.call(this, '<div class="ag-popup-editor"/>') || this;
    _this.getGuiCalledOnChild = false;
    _this.cellEditor = cellEditor;
    _this.addDestroyFunc(function() {
      return cellEditor.destroy();
    });
    _this.addDestroyableEventListener(_super.prototype.getGui.call(_this), 'keydown', _this.onKeyDown.bind(_this));
    return _this;
  }
  PopupEditorWrapper.prototype.onKeyDown = function(event) {
    this.params.onKeyDown(event);
  };
  PopupEditorWrapper.prototype.getGui = function() {
    if (!this.getGuiCalledOnChild) {
      this.appendChild(this.cellEditor.getGui());
      this.getGuiCalledOnChild = true;
    }
    return _super.prototype.getGui.call(this);
  };
  PopupEditorWrapper.prototype.init = function(params) {
    this.params = params;
  };
  PopupEditorWrapper.prototype.afterGuiAttached = function() {
    if (this.cellEditor.afterGuiAttached) {
      this.cellEditor.afterGuiAttached();
    }
  };
  PopupEditorWrapper.prototype.getValue = function() {
    return this.cellEditor.getValue();
  };
  PopupEditorWrapper.prototype.isPopup = function() {
    return true;
  };
  PopupEditorWrapper.prototype.isCancelBeforeStart = function() {
    if (this.cellEditor.isCancelBeforeStart) {
      return this.cellEditor.isCancelBeforeStart();
    }
  };
  PopupEditorWrapper.prototype.isCancelAfterEnd = function() {
    if (this.cellEditor.isCancelAfterEnd) {
      return this.cellEditor.isCancelAfterEnd();
    }
  };
  PopupEditorWrapper.prototype.focusIn = function() {
    if (this.cellEditor.focusIn) {
      this.cellEditor.focusIn();
    }
  };
  PopupEditorWrapper.prototype.focusOut = function() {
    if (this.cellEditor.focusOut) {
      this.cellEditor.focusOut();
    }
  };
  return PopupEditorWrapper;
}(component_1.Component));
exports.PopupEditorWrapper = PopupEditorWrapper;