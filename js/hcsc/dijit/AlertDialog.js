dojo.provide('hcsc.dijit.AlertDialog');

dojo.require('dijit._Widget');
dojo.require('dijit._Templated');

dojo.declare('hcsc.dijit.AlertDialog', [ dijit._Widget, dijit._Templated ], {
  templateString : dojo.cache("hcsc.dijit", "templates/alertDialog.html"),
  submitCallback : undefined,
  okayCallback : undefined,
  standardCallback : undefined,
  alertTitle : undefined,
  alertMessage : undefined,
  okayText : undefined,

  postMixInProperties : function() {
    if(this.alertTitle === undefined || this.alertTitle === null) {
      this.alertTitle = "";
    }

    if(this.alertMessage === undefined || this.alertMessage === null) {
      this.alertMessage = "";
    }

    if(this.okayText === undefined || this.okayText === null) {
      this.okayText = "OK";
    }

    if(this.standardCallback === undefined || this.standardCallback === null) {
      this.standardCallback = this.defaultOkayAction;
    }
  },

  defaultOkayAction : function() {
    dojo.query("a.modal_close_img")[0].click();
  },

  submitCallback : function(ev) {
    this.standardCallback(ev);
    if(typeof this.okayCallback === 'function') {
      this.okayCallback(ev);
    }
  }
});
