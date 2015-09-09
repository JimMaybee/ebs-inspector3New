// generator.js

"use strict";

// Directive parsing
var validActions = "" +
    ",setUnits,setPageSize,setFormSize,setMargins,setIndent,clearIndent," +
    "moveTop,moveBottom,moveRight,moveLeft,moveUp,moveDown,moveTo,moveAbsolute," +
    "saveCursor,saveMaxCursor,restoreCursor," +
    "startNewLine,setAutoNewLine,definePageMask,drawPageMask,startNewPage," +
    "defineTextStyle,defineLineStyle,defineBoxStyle,defineArrowStyle,defineCanvasStyle,defineDrawingStyle," +
    "drawLineRight,drawLineLeft,drawLineUp,drawLineDown,drawLineAcross,drawLines,drawBox,drawPageBorder," +
    "drawText,drawMemo,drawTabbedMemo,drawDataWithLabel,drawImage,drawPDF,drawReport," +
    "drawPageNumber,drawPhotos,drawPhoto,drawCanvas,csvLine,prompt," +
    "defineMacro,runMacro,clearMacro,execute,javascript," +
    "setMemoHeight,setPhotoHeight,setPhotoWidth,keepTogether,keepTogether1,keepTogether2,keepTogether3,testForNewPage,verticalCenter," +

    "if,if1,if2,if3,if4,if5,if6,else,generatorTrace," +
    "setCondition,clearCondition,ifCondition,exit,skip,nothing,repeat,repeat1,repeat2,repeat3,repeat4," +
    "trace,traceOn,traceOff,evaluate,defineDirectives,runDirectives,runFile,run," +
    "backupProject,restoreProject,import,importProject,importInspection,importPhoto,setEMailSignature," +
    "set,setVar,incVar,define,warning,clearParseArrays,setPDFNamingTemplate,renamePhotos,listXml,checkXml,fixXml,deleteParseData,resetSyncReqd," +
    "setViewSize,defineControlStyle,defineSelectMemoSet,defineSelectMemo,loadSelectMemos," +
    "drawLabel,drawTextBox,drawNumericControl,drawDateControl,drawMemoControl,drawCheckBox,drawButton,drawRadioButton," +
    "drawImageControl,drawPhotoControl,drawCanvasControl,drawControlList,drawProgressBar,setFormTitle,setFormButton,progressMessage,save,alert," +
    "validation,validateRequired,validateDate,validateEMail,validateInOptions,validateMemoHeight,validationError,validateMacro,showErrorMessage,clearErrorMessage,";


// Active directive information - previously properties
var activeDirective = "";    // Used in error messages
var activeAttributes = {};   // Used by directive functions to get attributes
var activeEnclosedXML;       // Used by directives that have enclosed directives - to execute these directives
var recursionLevel;          // Recursion level - starts with 0.  Max 10.

var showErrorMessages;       // Error messages are displayed at various times - such as the first pass on report generation
var maxErrorMessageCount;    // Sets the max number of errors to be displayed.
var numberOfErrorMessages;   // The number of error messages generated.  Compared against max to determine when no more error messages should be displayed.
var traceMode;               // Set by TraceOn/ TraceOff directives.  Controls directive tracing to the console.

/*

// Properties - can be set/ retrieved externally
var currentDirective;   // Not used - replaced with activeDirective
var pdfFileName;
var request;
var requestValue1;
var requestValue2;

var templateSectionName;

var instanceName;
var validationErrorCount;
var param1;
var param2;
var csv;
var reportType;

var drawingStyles = {};
var textStyles = {};

var repeatParagraph;      // Value set by <Repeat paragraphs='memoName' ... />
var validationField;      // Set in ValidateMemoHeight

//
var traceDirectives;
var editRegions = {};
var activeEditRegion;
var activeEditRegionLine;
var aEditRegionLine = [];

var selectMemoSets = {};
var saveControls = {};    // ??
var selectMemos = [];

//   FieldName, FieldType, Validation
var enabled;
var useGroupPhotos;
var groupPhotos = [];
var repeatMemoLine;
var pdfSizeReductionFactor;

var validateDirectives;

var parseID;
var pageCountSave;     //??

var keepTogetherTestActive;  // Used in DrawPhotos - to only draw first photo.

var currentPhotoControl;   // int  ??
var formXMLData;
var xmlSaveData;
var controlListKey;
var controlListValue;

var pdfNamingTemplateOverride;
var updateMethodUsed;
var fatalImportError;   // ??
var memoHeightValidationActive;  // Set during the ValidateMemoHeight directive.  Causes data references (project., inspection., photo.) to get redirected for form.


// Form refresh fields - Used when the form is refreshed after an option select.
var formRefreshXMLData;
var formRefresh;

var includeNotUsedPhotos;

var nSize;             // ??
var exitRequested;
var savePhotoLocns;    // ?
var saveCanvasImages;  // ?
var formButtonXML;     // ?


function init() {
    nSize = 0;
    showErrorMessages = true;
    useGroupPhotos = false;
    formType = "";
    maxErrorMessageCount = 3;
    numberOfErrorMessages = 0;
    pdfSizeReductionFactor = 1;
    traceMode = false;
    traceDirectives = "";
    instanceName = "";
    currentPhotoControl = 0;
    xmlSaveData = "";
    request = "";
    requestValue1 = "";
    requestValue2 = "";
    updateMethodUsed = false;
    repeatParagraph = "";
    repeatMemoLine = "";
    validationField = "";
    memoHeightValidationActive = false;
    reportType = "";
    formRefreshXMLData = "";
    formRefresh = false;
    includeNotUsedPhotos = false;
}


function startNewGenerate() {
    unitsConversion = 72;
    pagesize = {width: 612, height:792};
    margin   = {left:0, right:0, top:0, bottom:0};
    cursor   = {x:0, y:0};
    lastLineHeight = 0;
    autoNewLineSpacing = 0;

    currentPageMask = "";
    numberOfErrorMessages = 0;

    savedCursors  = {};
    textStyles       = {};
    lineStyles       = {};
    boxStyles        = {};
    arrowStyles      = {};
    canvasStyles     = {};
    drawingStyles    = {};
    controlStyles    = {};
    macros           = {};
    defineDirectiveValues = {};
    pageMasks        = {};
    inputControls    = [];
    selectMemoSets   = {};
    selectMemos      = [];
    editRegions      = {};
    aEditRegionLine  = [];

    setDefaultStyles();

    //
    prevAtValue = 0;
    recursionLevel = -1;
    validateDirectives = "";
    ifConditionValue = false;
    keepTogetherTestActive = false;
    setMemoHeightValue = 0;
    setPhotoHeightValue = 0;
    setPhotoWidthValue = 0;
    varValue = "";
    lastIfResult = false;
    //nextPhoto = nil;
    currentPhotoControl = 0;
    controlListKey = "";
    controlListValue = "";

    pdfNamingTemplateOverride = "";
    csv = "";
    activeDirective = "";
    activeAttributes = {};
    activeEnclosedXML = "";
    exitRequested = false;  // Set by <exit /> directive.  Used to exit out of nested directives.
}
 */

// executeDirectives
//   - parses and executes a string of directives.
//   - Comments and blank lines are ignored.
//   - Called initially for the form or report.
//   - And then by directives such as <if> and <repeat> that execute enclosed directives

function executeDirectives(directives) {
    var iNext = 0;          // Current position within directives.
    var directive;          // The current directive, extracted from directives.
    var action;             // The action - following the opening "<".
    var attributes = {};    // A dictionary of attribute names and values.
    var attributeString;
    var methodName;
    var at;
    var strings = [" ", "/>", ">"];
    var actionEnd;
    var enclosedXMLFound;
    var enclosedXML;
    var directiveStart;
    var endTag;
    var endLocn;
    var locn1;
    var locn2;

    var saveActiveDirective = activeDirective;
    var saveActiveEnclosedXML = activeEnclosedXML;
    var saveActiveAttributes = activeAttributes;

    if (directives.length == 0) return;
    recursionLevel += 1;
    if (recursionLevel == 0) {
        var exitRequested = false;
    }

    directives = directives.trim();
    while (iNext < directives.length) {
        if (exitRequested) {
            break;
        }

        directive = directives.substring(iNext);
        directiveStart = directive.indexOf("<");

        if (directiveStart == -1) {
            showError("Directive start tag not found",directive);
            break;

        } else {
            iNext += directiveStart;
            directive = directives.substring(iNext);
        }

        // ==== Extract the action - terminated by " ", "/>" or ">"

        actionEnd = findFirstCharOf(strings,directive);
        if (actionEnd == -1) {
            showError("Directive end tag not found",directive);
            break;
        }
        action = directive.substring(1);
        action = action.substring(0,actionEnd-1).trim();

        // ==== Determine type of directive - based on whether ">" is found before "/>"
        //      xml directives have 2 formats:
        //      <action attributes/>  or  <action attributes>  enclosed XML </action>

        locn1 = directive.indexOf("/>");
        locn2 = directive.indexOf(">");

        if (locn2 == -1) {
            showError("Directive end tag not found",directive);
            break;
        }

        enclosedXMLFound = (locn2 < locn1 || locn1 == -1);

        // ==== Extract directive, attributes, and enclosedXML for each type
        var traceDirective;
        if (!enclosedXMLFound) {
            directive = directive.substring(0,locn1 + 2);
            attributeString = directive.substring(actionEnd);
            attributeString = attributeString.substring(0,locn1 - actionEnd);
            enclosedXML = "";
            traceDirective = directive;

        } else {
            endTag = "</" + action + ">";
            endLocn = directive.indexOf(endTag);
            if (endLocn == -1) {
                showError("Missing closing tag",directive);
                break;
            }
            directive = directive.substring(0, endLocn + action.length + 3);
            attributeString = directive.substring(actionEnd);
            attributeString = attributeString.substring(0, locn2 - actionEnd).trim();

            enclosedXML = directive.substring(locn2 + 1);
            enclosedXML = enclosedXML.substring(0, directive.length - locn2 - action.length - 4).trim();
            traceDirective = directive.substring(0,locn2+1);
        }
        attributes = extractAttributesFrom(attributeString);

        // ==== Advance the current location
        iNext += directive.length;

        if (traceMode) {
            var dashes = "===";
            for (var i=0; i<recursionLevel; i++) {
                dashes = dashes + "===";
            }
            console.log(dashes + traceDirective);
        }

        // Validate the action against the action strings - ignoring case.
        // If match found, then extract the method name from the original string, so that the case is correct.
        ///NSString *action = directive1.name; //[[directive attributeForName:@"action"] stringValue];

        var actionLowerCase = "," + action.toLowerCase() + ",";
        var range = validActions.toLowerCase().indexOf(actionLowerCase);
        activeDirective = directive;
        activeEnclosedXML = enclosedXML;
        activeAttributes = attributes;

        if (range == -1) {
            displayErrorMessage("Invalid action =" + actionLowerCase, "Error");

        } else {
            methodName = validActions.substring(range + 1,range + actionLowerCase.length-1);
            at = getStringAttribute("at",false);

            if (at.length > 0) {
                var atVal = 0;
                if (at[0] == "+") {
                    atVal = at.substring(1);
                    atVal = prevAtValue + cvtUnitsToPoints(atVal);
                } else {
                    atVal = getFloatAttributeInPoints("at",false);
                }
                cursor.x = margin.left + indent.left + atVal;
                prevAtValue = atVal;
            }

            if (methodName == "exit") {
                var message = getStringAttribute("message",false);
                if (message.length > 0) {
                    alert(message);
                }
                exitRequested = YES;
                break;
            }
            if (methodName == "if") methodName = "if0";
            if (methodName == "else") methodName = "else0";
            eval(methodName + "()");
        }
    }
    recursionLevel -= 1;
    activeDirective = saveActiveDirective;
    activeEnclosedXML = saveActiveEnclosedXML;
    activeAttributes = saveActiveAttributes;
}


function getSection(xmlString, section) {
    return (xmlString);

    var xmlSave = xmlString;
    if (sectionName.length == 0) {
        alert("Invalid call to getSection");
        return "";
    }

    var xmlShared = extractSection("shared", xmlString);
    xmlString = extractSection(sectionName, xmlString);
    xmlString = device.sharedXML + "\n" + xmlShared + "\n" + xmlString;
    xmlString = preProcess(xmlString);

    // Remove #SectionName# lines, replace Merge directives with section contents,
    var aLines = xmlString.split("\n");
    xmlString = "";

    for (var iLine in aLines) {
        var line = aLines[iLine];
        var line2 = line.trim();

        if (line2.toLowerCase().substring(0,4) == "merge") {
            var mergeStart = line2.substring(6);
            var mergeEnd = "#End " + mergeStart.substr(1);
            var start;
            var end;

            start = xmlSave.indexOf(mergeStart);
            if (start == -1) {
                displayErrorMessage("Section not found");
                return "";

            } else {
                end = xmlSave.indexOf(mergeEnd);
                if (end == -1) {
                    displayErrorMessage("Section end not found", line);
                    return "";
                }
            }
            var mergeXML = xmlSave.substring(0,end - 1);
            mergeXML = mergeXML.substring(start + mergeStart.length);
            xmlString = xmlString + mergeXML;

        } else if (line2[0] != "#") {
            xmlString = xmlString + line + "\n";
        }
    }

    // Remove comment lines and trailing comments
    aLines = xmlString.split("\n");
    xmlString = "";
    var line2;
    for (var iLine in aLines) {
        var line = aLines[iLine];
        line2 = line;
        var locn = line2.indexOf("//");
        if (locn != -1) {
            line2 = line2.substring(0,locn);
        }
        line2 = line2.trim();  // Other chars???

        if (line2.length > 0 ) {
            xmlString = xmlString + line2 + "\n";
        }
    }
    return xmlString.trim();
}


function extractSection(sectionName, xmlString) {
    var startTag = "<" + sectionName + ">";
    var startLocn = xmlString.toUpperCase().indexOf(startTag.toUpperCase());
    if (startLocn == -1) {
        if (sectionName.stringEqual("Shared")) {
            var errMsg = "Missing section start tag " + startTag;
            displayErrorMessage(errMsg,"EBGenerator error");
        }
        return "";
    }

    var endTag = "<" + sectionName + ">";
    var endLocn = xmlString.toUpperCase().indexOf(endTag.toUpperCase());
    if (endLocn == -1) {
        displayErrorMessage("Missing section end tag " + endTag,"EBGenerator error");
        return "";
    }

    var temp = xmlString.substring(startLocn + sectionName.length+2);
    temp = temp.substr(0, endLocn - startLocn - sectionName.length - 2);
    return temp.trim();
}


function extractAttributesFrom(xml) {
    var key;
    var value;
    var xml2;
    var attr = {};
    var locn1, locn2, locn3;
    // xml2 has double quotes replaced with xx and is used when looking for quotes.
    // Data is extracted from xml and '' is replaced with '

    while (xml.length > 0) {
        locn1 = xml.indexOf("=");
        if (locn1 == -1) break;
        key = xml.substring(0,locn1);
        key = key.trim(); // stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]];
        key = key.toLowerCase();
        xml = xml.substring(locn1)+1;    // Contents after =
        locn2 = xml.indexOf("'");
        if (locn2 == -1) break;
        xml = xml.substring(locn2+1);    // Contents from start of value (opening ')
        ///xml2 = [xml stringByReplacingOccurrencesOfString:@"''" withString:@"xx"];
        xml2 = xml;
        locn3 = xml2.indexOf("'");                 // Find closing quote, after '' removed.
        if (locn3 == -1) break;
        value = xml.substring(0,locn3);
        ///value = value stringByReplacingOccurrencesOfString:@"''" withString:@"'"];
        xml = xml.substring(locn3 + 1);
        attr[key] = value;
    }
    return attr;
}

function showError(errMsg, xml) {
    var iLen = 80;
    if (iLen > xml.length) iLen = xml.length;
    var msg = xml.substring(0,iLen);
    alert(msg); // withHeading:errMsg];
}

function findFirstCharOf(strings, xml) {
    var iRange;
    var iLocn = 999;
    for (var iString in strings) {
        iRange = xml.indexOf(strings[iString]);
        if (iRange != -1) {
            if (iRange < iLocn) {
                iLocn = iRange;
            }
        }
    }
    if (iLocn == 999) iLocn = 0;
    return iLocn;
}

function getStringAttribute(attrib, required) {
    var val = activeAttributes[attrib.toLowerCase()];
    if (required && val == undefined) {
        var msg = "Missing " + attrib + " parameter\nDirective=\n" + activeDirective;
        displayErrorMessage(msg,"Invalid directive");
    }
    if (val == undefined) val = "";
    return val;
}

function getFloatAttribute(attrib,required) {
    var val = activeAttributes[attrib.toLowerCase()];
    if (required && val == undefined) {
        var msg = "Missing " + attrib +" parameter\nDirective=\n" + activeDirective;
        displayErrorMessage(msg,"Invalid directive");
    }
    var val = activeAttributes[attrib.toLowerCase()];
    if (val == undefined) val = 0;
    return val;
}

function getFloatAttributeInPoints(attrib, required) {
    var value = getFloatAttribute(attrib,required);
    return cvtUnitsToPoints(value);
}

function getIntAttribute(attrib, required, defaultVal) {
    var val = activeAttributes[attrib.toLowerCase()];
    if (val == undefined && defaultVal != undefined) val = defaultVal;
    if (required && val == undefined) {
        var msg = "Missing " + attrib + " parameter\nDirective=\n" + activeDirective;
        displayErrorMessage(msg,"Invalid directive");
    }
    return val;
}

function getColorAttribute(att, defaultVal) {
    var colorAtt = activeAttributes[att];
    if (colorAtt == undefined) {
        colorAtt = defaultVal;
    } else {
        colorAtt = getDataValue(colorAtt);
    }
    ///return EBUtilcvtColor(colorAtt);
    return colorAtt;
}

function displayErrorMessage(msg, hdg) {
    if (hdg == undefined) {
        numberOfErrorMessages += 1;
        if (numberOfErrorMessages <= maxErrorMessageCount) {
            msg = msg + "\n\nDirective=" + activeDirective;
            alert(msg);
        }
    } else {
        numberOfErrorMessages += 1;
        if (numberOfErrorMessages <= maxErrorMessageCount) {
            msg = msg + "\n\nDirective=" + activeDirective;
            alert(hdg + "\n\n" + msg);
        }
    }
}

function skip() {

}

function trace() {
    //if (!showErrorMessages) return;
    var message = getStringAttribute("message", true);
    NSLog("Message=%",message);
    message =getDataValue( message);
    var title =getStringAttribute("title", false);
    if (title.length == 0) title = "Trace Message";
    //alert([self getDataValue:message required:true] withHeading:title);
    NSLog("%@Trace:",message);
}

function traceOn() {
    traceMode = true;
}

function traceOff() {
    traceMode = false;

}


function javascript() {
    eval(activeEnclosedXML);
}
/*
function evaluate() {
    var exp = getStringAttribute("expression", true);
    if (exp.length > 0) eval(exp);
}

function execute() {
    var section = getStringAttribute("section", true);
    executeDirectives(getSection(template.templateXML, section));
}


function executeMacro() {
    executeDirectives( directives);
    return defineVars["#Result#"];
}

function runDirectives() {
    executeDirectives(defineDirectives[name]);
}
*/
function showStyles() {
    showObject("controlStyles.DefaultControlStyle");
    showObject("textStyles.DefaultTextStyle");
    showObject("lineStyles.DefaultLineStyle");
    showObject("boxStyles.DefaultBoxStyle");
    showObject("arrowStyles.DefaultArrowStyle");
    showObject("canvasStyles.DefaultCanvasStyle");
    showObject("drawingStyles.DefaultDrawingStyle");
}

function showObject(obj) {
    console.log("\n" + obj + ":");
    var keys = eval("Object.keys(" + obj + ")");
    for (var iKey in keys) {
        var key = keys[iKey];
        console.log("  " + key + "=" + eval(obj + "." + key));
    }
}

function cvtUnitsToPoints(val) {
    return val * 72;
}

function cvtPointsToUnits(val) {
    return val / 72;
}

function decode(value) {
    value = replaceAll(value,"%.");
    value = replaceAll(value,"% ");
    ///value = [value stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    value = replaceAll(value,"*cr*");
    value = replaceAll(value,"*qt*");
    value = replaceAll(value,"*dqt*");
    value = replaceAll(value,"%lt;");
    value = replaceAll(value,"%gt;");
    value = replaceAll(value,"%eq;");
    value = replaceAll(value,"%qt;");
    value = replaceAll(value,"%dqt;");
    value = replaceAll(value,"%cr;");
    value = replaceAll(value,"*pt*");
    value = replaceAll(value,"(null)");
    return value;
}

function warning() {

    if (showErrorMessages) {
        alert(getStringAttribute("message", true), "Warning"); /// ???
    }
}

function formatFilename(fileName) {
    return fileName = fileName.replaceAll(".xml", "") + ".xml";
}


function getMemoHeight(memo, style) {
    alert("getMemoHeight not implemented");
    //UIFont *font = [UIFont fontWithName:style.fontName size:style.fontSize];
    //CGSize stringSize = [memo sizeWithFont:font constrainedToSize:CGSizeMake(style.width, 2000)
    //lineBreakMode:NSLineBreakByWordWrapping];
    //return stringSize.height ;
}

function cleanDate(date) {
    // Remove commas, "/" and multiple spaces.
    date = date.trim();
    date = date.replaceAll("/");
    date = date.replaceAll(",");
    date = date.replaceAll("    ");
    date = date.replaceAll("  ");
    date = date.replaceAll("  ");
    return date;
}

/*
function sortAllPhotoSet(photos) {
    if (includefalsetUsedPhotos) {
        return [EBUtil sortPhotoSet:photos];
    } else {
        return [EBUtil sortUsedPhotoSet:photos];
    }
}
*/
