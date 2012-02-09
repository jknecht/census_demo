dojo.provide("hcsc.dijit.ShopperDisplay");

dojo.require("dijit._Widget");
dojo.require("dojox.dtl._Templated");

dojo.declare('hcsc.dijit.ShopperDisplay', [dijit._Widget, dojox.dtl._Templated], {
	templateString: dojo.cache("hcsc.dijit", "templates/shopper.html"),
	
	shopper: undefined,
	
	postMixInProperties : function() {
		this.inherited(arguments);
		for (var i = 0; i < this.shopper.applicants.length; i++) {
			console.log(this.shopper.applicants[i].requiresReview);
		}
	}

});
