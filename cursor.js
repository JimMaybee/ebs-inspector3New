
"use strict";

var unitsConversion = 72;
var pagesize = {width:0, height:0};
var margin = {left:0, right:0, top:0, bottom:0};
var indent = {left: 0, right: 0};
var cursor = {x:0, y:0};
var lastLineHeight, autoNewLineSpacing;
var savedCursors = {};
var prevAtValue;       // Last column position from an "at" attribute

function setUnits() {
    var units = getStringAttribute("units",true).toLowerCase();
    if (units == "inches") {
        unitsConversion = 72;

    } else if (units == "cm") {
        unitsConversion = 72 * .3937;

    } else if (units == "points") {
        unitsConversion = 1;

    } else {
        unitsConversion = 72;
    }
}

function setPageSize() {
    var size = getStringAttribute("size", false).toLowerCase();
    var width = getFloatAttribute("width", false);
    var height = getFloatAttribute("height", false);

    if (size == "letter") {
        pagesize.Width = 612;  //  7.5"
        pagesize.height = 792; //  11"

    } else if (size == "legal") {
        pagesize.width = 612;   //  7.5"
        pagesize.height = 1008; //  14"

    } else if (width>0 && height>0) {
        pagesize.Width = cvtUnitsToPoints(width);
        pagesize.height = cvtUnitsToPoints(height);

    } else {
        displayErrorMessage("Invalid attributes", "SetPageSize error");
    }
}


function setMargins() {
    var newMarginLeft   = getFloatAttributeInPoints("left", false);
    var newMarginRight  = getFloatAttributeInPoints("right", false);
    var newMarginTop    = getFloatAttributeInPoints("top", false);
    var newMarginBottom = getFloatAttributeInPoints("bottom", false);

    if (newMarginLeft   != 0)   margin.left   = newMarginLeft;
    if (newMarginRight  != 0)   margin.right  = newMarginRight;
    if (newMarginTop    != 0)  {margin.top    = newMarginTop;    moveTop();}
    if (newMarginBottom != 0)   margin.bottom = newMarginBottom;
}

function setIndent() {
    indent.left  = getFloatAttributeInPoints("left", false);
    indent.right = getFloatAttributeInPoints("right", false);
}

function clearIndent() {
    indent.left  = 0;
    indent.right = 0;
}

function moveTop() {
    cursor.x = margin.left + indent.left;
    cursor.y = margin.top;
}

function moveBottom() {
    cursor.x = margin.left + indent.left;
    cursor.y = pagesize.height - margin.bottom;
}

function moveLeft() {
    // MoveLeft with no distance returns to the left margin plus indent.
    var distance = getFloatAttributeInPoints("distance", false);
    if (distance == 0) {
        cursor.x = margin.left + indent.left;
    } else {
        cursor.x -= distance;
    }
}

function moveRight() {
    var distance = getFloatAttributeInPoints("distance", false);
    if (distance == 0) {
        cursor.x = pagesize.width - margin.right - indent.right;
    } else {
        cursor.x += distance;
    }
}

function moveUp() {
    var distance = getFloatAttributeInPoints("distance", false);
    cursor.y -= distance;
}

function moveDown() {
    var d1 = getStringAttribute("distance",false);
    var distance = getDataValue(d1, true);
    distance = cvtUnitsToPoints(distance);
    var to = getFloatAttributeInPoints("to",false);

    if (distance > 0) {
        cursor.y += distance;

    } else if (to > 0) {
        cursor.x = margin.left + indent.left;
        cursor.y = Math.max(cursor.y, to);

    } else {
        displayErrorMessage("Missing 'distance' or 'to' value","Directive error - MoveDown");
    }
}

function moveTo() {
    var across = getFloatAttributeInPoints("across", true);
    var down = getFloatAttributeInPoints("down", true);
    cursor.x += across;
    cursor.y += down2;
}

function moveAbsolute() {
    var across = getFloatAttributeInPoints("across", true);
    var down = getFloatAttributeInPoints("down", true);
    cursor.x= across;
    cursor.y = down;
}

function saveCursor() {
    // Cursor positions are saved as 2-value arrays in dictionary cursorPositions
    var name = getStringAttribute("name", false);
    if (name.length == 0) name = "DefaultCursorName";
    savedCursors[name] = cursor;
}

function saveMaxCursor() {
    var name = getStringAttribute("name",false);
    if (name.length == 0) name = "DefaultCursorName";
    if (savedCursors[name] == undefined) savedCursor[name] = [0,0];

    if (cursor.y > savedCursor[name][1]) {
        savedCursors[name] = [cursor.x, cursor.y];
    }
}

function restoreCursor() {
    var name = getStringAttribute("name",false);
    if (name.length == 0) name ="DefaultCursorName";
    cursor = savedCursors[name];
}

