
// ReportPaging.js

"use strict";


function testForNewPage() {
    var testDirectives = activeEnclosedXML;
    var cursorXSave = cursorX;
    var cursorYSave = cursorY;
    var marginBottomSv = marginBottom;
    var noGraphicsOutputSv = noGraphicsOutput;
    marginBottom = -99999;  // Suppress page eject during test.
    noGraphicsOutput = true;
    executeDirectives( testDirectives);

    if (cursorY > pageHeight - marginBottomSv) {
        defineVars["#NewPageStarted#"] = true;

    } else {
        defineVars["#NewPageStarted#"] = false;
    }
    cursorX = cursorXSave;
    cursorY = cursorYSave;
    marginBottom = marginBottomSv;
    noGraphicsOutput = noGraphicsOutputSv;
}

function verticalCenter() {
    var verticalCenterDirectives = activeEnclosedXML;

    var height =getFloatAttributeInPoints("height",  true);
    var cursorXSave = cursorX;
    var cursorYSave = cursorY;
    noGraphicsOutput = true;
    keepTogetherTestActive = true;
    executeDirectives( verticalCenterDirectives);
    keepTogetherTestActive = false;
    var newcursorY = cursorY;

    // Reset values, space down 1/2 the extra height and execute the directives

    cursorX = cursorXSave;
    cursorY = cursorYSave;
    noGraphicsOutput = false;
    var renderedHeight = newcursorY - cursorY;
    cursorY += (height - renderedHeight) / 2.0;
    executeDirectives( verticalCenterDirectives);
    cursorY = cursorYSave + height;
}

function definePageMask() {
    var name = getStringAttribute("name",  true);
    pageMasks[name] = activeEnclosedXML;
    currentPageMask = name;
}

function drawPageMask() {
    var pageHeightSave = pageHeight;
    pageHeight = 9999;
    executeDirectives( [pageMasks, currentPageMask]);
    pageHeight = pageHeightSave;
}

/*
function startNewPage() {

    if (cursorY == marginTop) return;  // If already at top of page, igfalsere.

    var newPageRequired = false;

    var withinVal = "";
    if (activeEnclosedXML.length > 0) {
        var testDirectives = activeEnclosedXML;

        // Save cursor, reset bottom margin to avoid page breaks, and execute with suppressed output
        // to determine if page eject required.
        var cursorXSave = cursorX;
        var cursorYSave = cursorY;
        var pageHeightSave = pageHeight;
        pageHeight = 9999;

        noGraphicsOutput = true;
        keepTogetherTestActive = true;
        executeDirectives( testDirectives);
        keepTogetherTestActive = false;

        // Reset values, start new page if required, and execute
        var newcursorY = cursorY;
        pageHeight = pageHeightSave;
        cursorX = cursorXSave;
        cursorY = cursorYSave;
        noGraphicsOutput = false;

        if (newcursorY > pageHeight - marginBottom) {
            newPageRequired = true;
        }

    } else {
        var withVal =getStringAttribute("within",  false);
        var within = [[self getDataValue:withVal required:true] floatValue];
        within =cvtUnitsToPoints(within);

        if (cursorY + within > pageHeight - marginBottom || within == 0.0) {
            newPageRequired = true;
        }
    }

    if (newPageRequired) {
        UIGraphicsBeginPDFPageWithInfo(CGRectMake(0, 0, pageWidth, pageHeight), nil);
        pageNumber += 1;
        numberOfPages = MAX(numberOfPages, pageNumber);  // Don't change on 2nd pass when the numberOfPages has been set.
        var pageHeightSave = pageHeight;
        pageHeight = 9999;  // Avoids a page eject while drawing the mask.
        executeDirectives( [pageMasks, currentPageMask]);
        pageHeight = pageHeightSave;
        cursorX = marginLeft + indentLeft;
        cursorY = marginTop;

    }

    if (withinVal.length > 0) {
        if (newPageRequired) {
            [defineVars setValue:"true" forKey:"#NewPageStarted#"];
        } else {
            [defineVars setValue:"false" forKey:"#NewPageStarted#"];
        }
    }
}

function keepTogether1() {keepTogether(); }
function keepTogether2() {keepTogether(); }
function keepTogether3() {keepTogether(); }

function keepTogether() {

    // Extract the "keeptogether" directives
    var keepTogetherDirectives = activeEnclosedXML;

    // Save cursor, reset bottom margin to avoid page breaks, and execute with suppressed output
    // to determine if page eject required.
    var cursorXSave = cursorX;
    var cursorYSave = cursorY;
    var pageHeightSave = pageHeight;
    var ifConditionSave = ifConditionValue;
    pageHeight = 9999;
    noGraphicsOutput = true;

    // If a KeepTogether test is already active (from an outer keeptogether directive), then this test is falset required.
    if (keepTogetherTestActive) {
        executeDirectives( keepTogetherDirectives);
    } else {
        keepTogetherTestActive = true;
        executeDirectives( keepTogetherDirectives);
        keepTogetherTestActive = false;

        // Reset values, start new page if required, and execute
        var newCursorY = cursorY;
        pageHeight = pageHeightSave;
        cursorX = cursorXSave;
        cursorY = cursorYSave;
        ifConditionValue = ifConditionSave;
        noGraphicsOutput = false;
        if (newCursorY > pageHeight - marginBottom) {
            startNewPage();
        }
        executeDirectives(keepTogetherDirectives);
    }
}

function startNewLine() {
    var spacing = getFloatAttribute("spacing", false);
    if (spacing==0) spacing=1;
    cursorX = marginLeft + indentLeft;
    cursorY += lastLineHeight * 1.1 * spacing;
}

function setAutoNewLine {
    var status = getStringAttribute("status",  false);
    if (!status.equalString("Off")) status = "On";
    var spacing = getFloatAttribute("spacing",  false);
    if (spacing == 0) {
        spacing = 1;
    }
    if (status.equalString("On")) {
        autoNewLineSpacing = spacing;
    } else {
        autoNewLineSpacing = 0;
    }
}

 */