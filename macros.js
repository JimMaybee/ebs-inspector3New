
// macros.js

var macros = {};
var defineDirectiveValues = {};
var defineVars = {};
var setMemoHeightValue;   // Value from SetMemoHeight directive
var setPhotoHeightValue;  // Value from SetPhotoHeight directive
var setPhotoWidthValue;   // Value from SetPhotoHeight directive
var varValue;             // Value set by SetVar directive

"use strict";

function set() {
    alert("set directive is not implemented");
}

function setVar() {
    varValue = getIntAttribute("value", true);
}

function incVar() {
    var name = getStringAttribute("name", false);
    var by = +getIntAttribute("by", false);
    if (by == 0) by = 1;
    //  "%.02f"

    if (name.length == 0) {
        varValue = +varValue + by ;
        var max = getIntAttribute("max",  false);
        if (max == 0) max = 999999;
        if (varValue > max) varValue = 1;

    } else {
        if (defineVars[name] != undefined) {
            var byVal = 1;
            if (by.length > 0) byVal= by;
            defineVars[name] = +defineVars[name] + byVal;

        } else {
            displayErrorMessage(name, "Variable '" + name + "' is not defined");
        }
    }
}


function define() {
    var name  = getStringAttribute("name", true);
    var value = getStringAttribute("value", false);

    if (value.length == 0) {
        var data = getStringAttribute("data", true);
        value = getDataValue(data, true);
    }

    if (name[0] == "#" && name.hasSuffix("#")) {
        defineVars[name] = addPrefixAndSuffix(value);

    } else {
        displayErrorMessage("Name must be in #var# format", "Invalid Define directive");
    }
}

function defineMacro() {
    var name = getStringAttribute("name", true);
    var value = activeEnclosedXML;
    macros[name] = value;
}

function runMacro() {
    var name =getStringAttribute("name", true);

    if (macros[name] == undefined) {
        displayErrorMessage(name, "Invalid RunMacro name");

    } else {
        var repeat = getIntAttribute("repeat", false);
        if (repeat == undefined) repeat = 1;
        if (repeat == 0) repeat = 1;
        while (repeat > 0) {
            executeDirectives(macros[name]);
            repeat -= 1;
        }
    }
}

function clearMacro() {
    var name = getStringAttribute("name", true);
    delete macros[name];
}

function defineDirectives() {
    var name =getStringAttribute("name", false);
    if (name.length == 0) name = "DefaultRunDirectivesName";
    defineDirectives[name] = activeEnclosedXML;
}

function runDirectives() {
    var name = getStringAttribute("name", false);
    if (name.length == 0) name = "DefaultRunDirectivesName";

    if (defineDirectives[name] == undefined) {
        displayErrorMessage(name, "Invalid RunDirectives name");

    } else {
        var directives = defineDirectives[name];
        if (directives.length > 0) {
            var keyword;
            var value;
            var value2;
            var with1 = getStringAttribute("with", false);
            var with2 = getDataValue(with1, false);
            var modifiedDirectives = directives;

            if (with2.length > 0) {
                var char1 = ",";
                if (with2.indexOf(";") != -1) char1 = ";";

                var aValues = with2.split(char1);
                var iCount = 0;

                for (value2 in aValues) {
                    var subValue = aValues[value2];
                    iCount += 1;
                    keyword = "#" + iCount + "#";
                    modifiedDirectives = modifiedDirectives.replaceAll(keyword, subValue.trim());
                }
            }
            var withString = getStringAttribute("withstring", false);
            if (withString.length > 0) {
                modifiedDirectives = modifiedDirectives.replaceAll("#1#", withString);
            }

            executeDirectives(modifiedDirectives);
        }
    }
}

/*

function setMemoHeight() {
    var style = getStringAttribute("style",  false);
    var data  = getStringAttribute("data",  true);
    var value = getDataValue(data, true);
    value = addPrefixAndSuffix(value);

    //var width =getFloatAttributeInPoints("width", true);
    var w1 = getStringAttribute("width", true);
    var width = getDataValue(w1, true);
    width = cvtUnitsToPoints(width);

    var height = getFloatAttributeInPoints("height", true);
    var margin = getFloatAttributeInPoints("margin", false);

    if (style == "") style = "DefaultTextStyle";
    var selectedStyle = textStyles[style];
    if (!selectedStyle) {
        var msg = "TextStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - SetMemoHeight");
        return;
    }
    selectedStyle.width = width;
    setMemoHeightValue = getMemoHeight(value, selectedStyle);
    setMemoHeightValue = MAX(setMemoHeight, height) + margin;
    setMemoHeightValue = cvtPointsToUnits(setMemoHeight);

    var nColumns = getIntAttribute("NumberOfColumns",  false);
    if (nColumns > 1 && nextPhoto) {
        ///Photo *photoSave = photo;
        ///photo = nextPhoto;         // nextphoto is set in the Repeat loop

        var value =getDataValue(data, true);
        var setMemoHeight2 =getMemoHeight(value, selectedStyle);
        setMemoHeight2 = MAX(setMemoHeight2, height) + margin;
        setMemoHeight2 =cvtPointsToUnits(setMemoHeight2);
        setMemoHeightValue = MAX(setMemoHeight, setMemoHeight2);
        ///photo = photoSave;
    }
}

function setPhotoHeight() {
    var width  = getFloatAttributeInPoints("width", true);
    var height = getFloatAttributeInPoints("height", true);
    var data   = getStringAttribute("data",  true);
    var fn     = getDataValue(data, true);
    ///var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
    ///var filePath = [NSString stringWithFormat:"%@/Photos/%",paths[0],fn];
    ///UIImage *image = [UIImage imageWithContentsOfFile:filePath];

    var photoRatio = image.size.width / image.size.height;
    var areaRatio = width / height;
    var height1 = height;
    if (photoRatio > areaRatio) {
        height1 = width / photoRatio;
    }
    setPhotoHeight = height1;

    var nColumns =getIntAttribute("NumberOfColumns",  false);
    if (nColumns > 1 && nextPhoto) {
        var height2 = height;
        Photo *photoSave = photo;
        photo = nextPhoto;         // nextphoto is set in the Repeat loop
        var fn2 = getDataValue(data, true);
        ///var filePath2 = paths[0] + "/Photos/%",paths[0],fn2];
        ///UIImage *image = [UIImage imageWithContentsOfFile:filePath2];
        var photoRatio = image.size.width / image.size.height;
        var areaRatio = width / height;
        if (photoRatio > areaRatio) {
            height2 = width / photoRatio;
        }
        photo = photoSave;
        setPhotoHeight = MAX(setPhotoHeight, height2);
    }
    setPhotoHeight =cvtPointsToUnits(setPhotoHeight);
}

function setPhotoWidth() {
    var width =getFloatAttributeInPoints("width", true);
    var height =getFloatAttributeInPoints("height", true);
    var data =getStringAttribute("data",  true);
    var fn = getDataValue(data, true);
    var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
    var filePath = [NSString stringWithFormat:"%@/Photos/%",paths[0],fn];
    UIImage *image = [UIImage imageWithContentsOfFile:filePath];

    var photoRatio = image.size.width / image.size.height;
    var areaRatio = width / height;
    var width1 = width;

    if (photoRatio <= areaRatio) {
        width1 = height * photoRatio;
    }

    setPhotoWidth = width1;
    setPhotoWidth =cvtPointsToUnits(setPhotoWidth);
}

*/