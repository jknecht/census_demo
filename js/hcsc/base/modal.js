dojo.provide("hcsc.base.modal");

dojo.require("dojo.window");

(function() {
  /* Only one modal can be open at a time- this will clobber existing data if it exists */
  /*A place to manage modals*/
  var modal = hcsc.base.modal = function(data, options) {
    return modal.impl.init(data, options);
  };

  modal.defaults = {
    zIndex: 1000,
    displayClose: true,
    closeHTML: '<a class="modal_close_img" title="Close"></a>'
  };

  modal.impl = {
    current: {},
    init: function(data, options) {
      this.options = dojo.mixin(modal.defaults, options);
      this.initialized = true;
      this.create(data);
      return this;
    },
    create: function(data) {
      this.createOverlay();
      this.createContainer();
      this.createWrapper();
      this.createData(data);
      this.doBindings();
      this.setDimensions();
      this.createOrphanage();
    },
    getDimensions: function() {
      var dims = dojo.window.getBox();
      return {
        height: dims.h,
        width: dims.w
      };
    },

    createOrphanage: function() {
      if (!this.current.orphanage) {
        this.current.orphanage = dojo.create("div", {id:"modalOrphanage",style:"display:none;"}, dojo.body());
      }
    },

    createOverlay: function() {
      if (this.current.overlay) {
        return;
      }

      var dim = this.getDimensions(), ol = this.current.overlay = dojo.create("div", null, dojo.body(), "last");
      dojo.addClass(ol, "modal_overlay");
      dojo.style(ol, {
        display: "none",
        opacity: 0.5,
        height: "100%",
        width: "100%",
        position: "fixed",
        backgroundColor: "#000",
        left: 0,
        top: 0,
        zIndex: this.options.zIndex + 1
      });
    },

    createContainer: function() {
      if (this.current.container) {
        return;
      }
      var el = this.current.container = dojo.create("div", {
          className: "modal_container",
          style: {
            display: "none",
            position: "fixed",
            zIndex: this.options.zIndex + 2
          }
        },
        dojo.body(), "last");
      if (this.options.displayClose) {
        dojo.place(this.options.closeHTML, el, "first");
      }
    },

    createWrapper: function() {
      if (this.current.wrapper) {
        return;
      }
      var el = this.current.wrapper = dojo.create("div", {
          className: "modal_wrap",
          tabIndex: -1,
          style: {
            height: "100%",
            outline: 0
          }
        },
        this.current.container, "last");
    },

    createData: function(data) {
      //only destroy if the data for the modal is not the same object
      if (this.current.data && (this.current.data != data)) {
        dojo.place(this.current.data, this.current.orphanage);
      }
      var el = this.current.data = dojo.place(data, this.current.wrapper, "first"), dims = dojo.coords(el);
      dojo.addClass(el, "modal_data");
      dojo.attr(el, {
        style: {
          display: "none"
        }
      });
    },

    doBindings: function() {
      dojo.query('a.modal_close_img', this.current.container).onclick(dojo.hitch(this, "hide"));
    },

    setDimensions: function() {
      var container = this.current.container, windowDims = this.getDimensions(), containerDims = dojo.coords(this.current.data), left = windowDims.width / 2 - containerDims.w / 2, top = windowDims.height / 2 - containerDims.h / 2, height, bottom;
      if (top <= 15) {
        top = 15;
        height = windowDims.height - top * 3;
      }

      dojo.style(this.current.container, {
        left: left + "px",
        top: top + "px"
      });

      if (height) {
        dojo.style(this.current.wrapper, {
          height: height + "px",
          overflowY: "auto",
          overflowX: "hidden"
        });
      } else {
        dojo.style(this.current.wrapper, {
          height: "auto",
          overflow: "hidden"
        });
      }
    },

    show: function() {
      dojo.style(this.current.overlay, "display", "block");
      dojo.style(this.current.container, "display", "block");
      dojo.style(this.current.data, "display", "block");
      this.setDimensions();

      dojo.behavior.apply();
    },

    hide: function() {
      dojo.style(this.current.container, "display", "none");
      dojo.style(this.current.overlay, "display", "none");
      dojo.style(this.current.data, "display", "none");
    }
  };

  modal.hide = function() {
    modal.impl.hide();
  };
})();
