// Support.js

"use strict";


function arrayCopy(a) {
    return JSON.parse(JSON.stringify(a))
}

function zFill(n) {
    var s = "" + n;
    if (n < 1000) s = "0" + n;
    if (n < 100)  s = "00" + n;
    if (n < 10)   s = "000" + n;
    return s;
}

String.prototype.isEqual = function(str) {
    return this.toLowerCase() == str.toLowerCase();
}

String.prototype.hasPrefix = function(prefix) {
    return this.substr(0,prefix.length).toLowerCase() == prefix.toLowerCase();
}

String.prototype.hasSuffix = function(suffix) {
    return this.substr(this.length - suffix.length, suffix.length).toLowerCase() == suffix.toLowerCase();
}

String.prototype.replaceAll = function (search, replace) {
    var s = this;
    if (s == undefined) s = "";
    if (s.length == 0) return "";
    return s.split(search).join(replace);
}

function supportTests() {
    // Array “deep” copy - creating a complete copy of the array - vs a reference
    var a = ["a","b","c"];
    var b = arrayCopy(a);
    a[0] = "d";
    console.log("b=" + b[0] + "," + b[1] + "," + b[2]);  // Displays  b=a,b,c

// Add leading zeros to 4 digits
    console.log("zFill=" + zFill(12));  // returns "0012"

// Case insensitive string comparisons
    var s = "abcd";
    console.log ("hasPrefix=" + s.hasPrefix("aB"));    // Returns true
    console.log ("hasSuffix=" + s.hasSuffix("Cd"));    // Returns true
    console.log ("isEqual=" + s.isEqual("AbCd"));    // Returns true


// String replace all - case sensitive
    console.log("replaceAll=" + "1a2a3a".replaceAll("a","x"));    // Returns 1x2x3x
}

