dojo.provide('hcsc.dijit.ConfirmDialog');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.declare('hcsc.dijit.ConfirmDialog', [ dijit._Widget, dijit._Templated ], {
  templateString : dojo.cache("hcsc.dijit", "templates/confirmDialog.html"),
  okayCallback : undefined,
  cancelCallback : undefined,
  title : undefined,
  message : undefined,
  okayText : undefined,
  cancelText : undefined,

  postMixInProperties : function() {
    if(this.title === undefined || this.title === null) {
      this.title = "";
    }

    if(this.message === undefined || this.message === null) {
      this.message = "";
    }

    if(this.okayText === undefined || this.okayText === null) {
      this.okayText = "OK";
    }

	if(this.cancelText === undefined || this.cancelText === null) {
      this.cancelText = "Cancel";
    }

  },

  _closeDialog : function() {
    dojo.query("a.modal_close_img")[0].click();
  },

  submitOKCallback : function(ev) {
    if(typeof this.okayCallback === 'function') {
      this.okayCallback(ev);
    }
  },
  
  submitCancelCallback : function(ev) {
    if(typeof this.cancelCallback === 'function') {
      this.cancelCallback(ev);
    }
  }
  
});
