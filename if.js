
// if.js

var ifConditionValue;
var lastIfResult;


"use strict";

function if0()  {
    ifDirective();
}

function if1() {
    ifDirective();
}

function if2() {
    ifDirective();
}

function if3() {
    ifDirective();
}

function if4() {
    ifDirective();
}

function if5() {
    ifDirective();
}

function if6() {
    ifDirective();
}

function setCondition() {
    ifConditionValue = true;
}

function clearCondition() {
    ifConditionValue = false;
}

function ifCondition() {
    if (ifConditionValue) {
        executeDirectives(activeEnclosedXML);
        lastIfResult = true;
    } else {
        lastIfResult = false;
    }
    ifConditionValue = false;
}

function ifDirective() {
    var simulator     = getStringAttribute("simulator",  false);
    var deviceType    = getStringAttribute("device",  false);
    var role          = getStringAttribute("role", false);
    var photos        = getStringAttribute("photos", false);
    var condition     = getStringAttribute("condition",  false);
    var within        = getStringAttribute("within",  false);
    var empty         = getStringAttribute("empty",false).trim();
    var notEmpty      = getStringAttribute("notEmpty",false).trim();
    var fileExists    = getStringAttribute("fileexists",false).trim();
    var fileNotFound  = getStringAttribute("filenotfound",false).trim();
    ///var filetype   = getStringAttribute("filetype", false).trim();
    var folder        = getStringAttribute("folder", false).trim();
    var form          = getStringAttribute("form",  false);
    var request       = getStringAttribute("request",  false);
    var requestValue1 = getStringAttribute("requestvalue1", false);
        requestValue1 = getDataValue(requestValue1, false);
    var requestValue2 = getStringAttribute("requestvalue2", false);
        requestValue2 = getDataValue(requestValue2, false);
    var varTestValue  = getIntAttribute("var",  false);
    var executeIf = false;
    var fieldName;
    var fieldValue;
    var testValue;
    var iLocn;

    if (simulator.length > 0) {
        alert("'Simulator' not supported in <if> directive");
        executeIf = false;
        return;
    }

    if (deviceType.length > 0) {
        alert("'Device' not supported in <if> directive");
        executeIf = false;
        return;
    }

    if (role.length > 0) {
        alert("'Role' not supported in <if> directive");
        executeIf = false;
        return;
    }

    if (photos.length > 0) {
        var photosPresent = false;
        for (var testPhotoIndex in inspection.photos) {
            var testPhoto = inspection.photos[testPhotoIndex];
            if (testPhoto.CellIdentifier == "PhotoCell") {
                if (testPhoto.Used == "true" || includeNotUsedPhotos) {
                    photosPresent = true;
                    break;
                }
            }
        }
        if (photos == "true" && photosPresent)  executeIf = true;
        if (photos == "false" && !photosPresent)  executeIf = true;
    }

    if (condition.length > 0) {
        var equalComparison = false;
        var temp = condition.split("!=");
        if (temp.length != 2) {
            temp = condition.split("=");
            equalComparison = true;
        }

        if (temp.length !=2) {
            displayErrorMessage(condition, "Invalid if condition");

        } else {
            fieldValue = getDataValue(temp[0], true).trim();
            testValue = getDataValue(temp[1], true).trim();
            if (equalComparison) {
                executeIf = fieldValue.isEqual(testValue);
            } else {
                executeIf = !fieldValue.isEqual(testValue);
            }
        }
    }

    if (empty.length > 0 || empty == "-") {

        iLocn = empty.indexOf(",");
        if (iLocn != -1) {
            executeIf = true;
            // Multiple field names provided - check the values until a falsen-empty field is found
            aFields = empty.split(",");
            for (var fieldNameIndex in aFields) {
                fieldName = aFields[fieldNameIndex];
                fieldValue = getDataValue(fieldName, true);
                if (fieldValue.trim().length != 0) {
                    executeIf = false;
                    break;
                }
            }

        } else {

            // Single field only
            if (empty == "-") {
                executeIf = true;
            } else {
                fieldValue = getDataValue(empty, true);
                if (fieldValue.trim().length == 0) executeIf = true;
            }
        }
    }
    if (notEmpty.length > 0) {
        //var fieldValue = getDataValue(notEmpty, true);
        //if (fieldValue.trim().length > 0) executeIf = true;

        var msg = "";

        iLocn = notEmpty.indexOf(",");
        if (iLocn != -1) {

            // Multiple field names provided - check the values until a falsen-empty field is found
            var aFields = notEmpty.split(",");

            for (fieldNameIndex in aFields) {
                fieldName = aFields[fieldNameIndex];

                fieldValue = getDataValue(fieldName, true);
                if (fieldValue.trim().length != 0) {
                    executeIf = true;
                    msg = msg + "Field " + fieldName + " = true\n";
                    break;
                }
            }

            msg = msg + "Field " + fieldName + " = false\n";

        } else {

            // Single field only
            fieldValue = getDataValue(notEmpty, true);
            if (fieldValue.trim().length != 0) executeIf = true;
        }
    }

    if (fileExists.length > 0) {
        fileExists = getDataValue(fileExists);
        filename = fileExists;

        if (filetype.length > 0) {
            filename = fileExists + "." + filetype;
        }
        executeIf = EBUtil.fileExists(filename,folder);
    }

    if (fileNotFound.length > 0) {
        fileNotFound = getDataValue(fileNotFound);
        var filename = fileNotFound;
        if (filetype.length > 0) {
            filename = fileNotFound + "." + filetype;
        }
        executeIf = EBUtil.fileExists(filename,folder);
    }

    if (within.length > 0) {
        var within2 = cvtUnitsToPoints(within);
        if (cursorY + within2 > pageHeight - marginBottom) {
            executeIf = true;
        }
    }

    if (form.length > 0) {
        if (formType == form) executeIf = true;
    }
    if (request.length > 0) {
        if (request == request) executeIf = true;
    }
    if (requestValue1.length > 0) {
        if (requestValue1 == requestValue1) executeIf = true;
    }
    if (requestValue2.length > 0) {
        if (requestValue2 == requestValue2) executeIf = true;
    }
    if (varTestValue > 0) {
        if (varTestValue == varValue) executeIf = true;
    }

    if (executeIf) {
        executeDirectives(activeEnclosedXML);
        lastIfResult = true;
    } else {
        lastIfResult = false;
    }
}

function else0() {
    if (!lastIfResult) {
        executeDirectives(activeEnclosedXML);
    }
}

