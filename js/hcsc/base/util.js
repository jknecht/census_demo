dojo.provide("hcsc.base.util");
dojo.provide("hcsc.util");

dojo.require("dojo.date.locale");
dojo.require("dojox.validate");

/* Some global functions that we can use for basic stuff */

(function() {

  var util = hcsc.base.util;
  hcsc.util = hcsc.base.util;

  // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

  Array.prototype.indexOf = function(obj) {
    for ( var i = 0; i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  };

  String.prototype.chomp = function() {
    this.replace(/(\n|\r)+$/, '');
  };

  window.addCommas = function(numberString) {
    numberString += '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(numberString)) {
      numberString = numberString.replace(rgx, '$1' + ',' + '$2');
    }
    return numberString;
  };

  window.formatCurrency = hcsc.base.util.formatCurrency = function(value, /* Boolean */includeDec) {
    if (includeDec == undefined) {
      includeDec = true;
    }

    var numberString = value + '', lvParts = numberString.split("."), intPart = lvParts[0], decPart = (lvParts.length > 1 ? lvParts[1]
        : '');

    decPart = (decPart + '00').substr(0, 2);
    return addCommas(intPart) + (includeDec ? ("." + decPart) : "");
  };

  util.getDollars = function(dollarValue) {
    var dollars = String(dollarValue).split('.')[0] || "0";
    return dollars;
  };

  util.getCents = function(dollarValue) {
    var cents = String(dollarValue).split('.')[1] || "00";
    return util.padRight(cents, "0", 2);
  };
  
  util.padRight = function(string, padValue, length){
    while(string.length < length){
      string += padValue;
    }
    return string;
  };
  
  util.isEmptyObject = function(obj) {
    for ( var prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  };
  
  window.isEmptyObject = util.isEmptyObject;

  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        size++;
      }
    }
    return size;
  };

  window.getRadioValue = function( /* string - input name or domNode */radio) {
    var elements, i;

    if (typeOf(radio) == 'array') {
      elements = radio;
    } else {
      elements = document.getElementsByName(radio);
    }

    for (i = 0; i < elements.length; i++) {
      if (elements[i].checked) {
        return elements[i].value;
      }
    }
    return undefined;
  };

  window.getDropdownValue = function( /* domNode or string */e) {
    var element;
    if (!e.options) {
      var elements = document.getElementsByTagName('select');
      for (i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute('name') === e) {
          element = elements[i];
        }
      }
    } else {
      element = e;
    }
    return element.options[e.selectedIndex].value;
  };

  window.typeOf = function(value) {
    var s = typeof value;
    if (s === 'object') {
      if (value) {
        if (value instanceof Array) {
          s = 'array';
        }
      } else {
        s = 'null';
      }
    }
    return s;
  };

  window.isVisible = function(elem) {
    return !isHidden(elem);
  };

  window.isHidden = function(elem) {
    var width = elem.offsetWidth, height = elem.offsetHeight;
    return (width === 0 && height === 0 || elem.style === undefined);
  };

  util.formatPercentage = function(percentage) {
    return percentage + "%";
  };

  // use this for cross-browser compatibility
  // TODO: migrate all browser compatability functions to compatibility.js
  util.stopEvent = function(event) {
    try { //non IE browsers
      dojo.stopEvent(event);
    } catch (ecx) {
      try{
        dojo.stopEvent(window.event); // IE needs to use window.event
      }
      catch(ecx2) {
        // will be caught in everything except IE
      }
    }
  };
  
  util.getInputValueFromEvent = function(event) {
    if (!event) {
        event = window.event; // IE 7 hack
        return event.srcElement.value;
    } else {
        return event.target.value;
    }
  };
  
  util.uniqueFilter = function(array) {
    var unique = {};
    return dojo.filter(array, function(item){
      if(!unique[item]){
        unique[item] = true;
        return true;
      }
      return false;
    });
  };

  /*
  * Zero out the hours, minutes, seconds, milliseconds on a date object.
   */
  util.getFlooredDateTime = function(date) {
    var clonedDate = dojo.clone(date);
    clonedDate.setHours(0);
    clonedDate.setMinutes(0);
    clonedDate.setSeconds(0);
    clonedDate.setMilliseconds(0);
    return clonedDate;
  };

  util.getEmailRegex = function() {
    return dojox.validate.regexp.emailAddress();
  };

  util.getPhoneRegex = function() {
    return "\\W?\\d{3}\\W?\\d{3}\\W?\\d{4}";
  };

  util.getZipRegex = function() {
    return "\\d{5}(-\\d{4})?";
  };
  
})();

(function(d) {
  // wrapped in this function to keep a local copy of some vars:
  var globalId, id_count = 0, base = "djid_";
  // the function:
  d.uniqueId = function(altBase) {
    do {
      globalId = (altBase || base) + (++id_count);
    } while (d.byId(globalId));
    return globalId;
  };
})(dojo);

dojo.mixin(dojo, {
  arrayMatch : function(array1, array2) {
    if (typeOf(array1) != "array" || typeOf(array2) != "array") {
      return false;
    }
    if (array1.length !== array2.length) {
      return false;
    }
    array1.sort();
    array2.sort();
    for ( var i = 0, len = array1.length; i < len; i++) {
      if (typeof (array1) === "object" || typeof (array2) === "object") {
        if (dojo.toJson(array1[i]) !== dojo.toJson(array2[i])) {
          return false;
        }
      } else if (array1[i] !== array2[i]) {
        return false;
      }
    }
    return true;
  },

  areObjectsEqual : function(object1, object2) {
    // This only supports simple objects - can have nested objects, but no nested functions.

    function compareProperty(ob1, ob2, p) {
      if (typeof (ob2[p]) === "undefined") {
        return false;
      }

      if (ob1.hasOwnProperty(p)) {
        if (typeof (ob1[p]) === typeof (ob2[p]) && typeof (ob1[p]) === "object") {
          if (!isEqual(ob1[p], ob2[p])) {
            return false;
          }
        } else if (typeof (ob1[p]) === "function") {
          return false; // not supporting functions
        } else {
          if (ob1[p] !== ob2[p]) {
            return false;
          }
        }
      }
      return true;
    }

    function isEqual(ob1, ob2) {
      var p;
      for (p in ob1) {
        if (!compareProperty(ob1, ob2, p)) {
          return false;
        }
      }

      for (p in ob2) {
        if (!compareProperty(ob2, ob1, p)) {
          return false;
        }
      }
      return true;
    }
    return isEqual(object1, object2);
  }
});
