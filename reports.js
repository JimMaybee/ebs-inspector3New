
"use strict";


var pageNumber;
var numberOfPages;
var currentPageMask;
var pageMasks ={};


validationErrorCount = 0;
param1 = "";
param2 = "";

var pageNo = 0;

function pdfTest() {
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    for (var iPage = 0; iPage < 10; iPage++) {
        startNewPage();
        for (var i=0; i<10; i++) {
            drawText("Text" + iPage + "  " + i);
        }
    }
    ctx.closePath();
}

function pdfTest2() {
    cursor.x = 20;
    cursor.y = 20;
    var doc = new jsPDF();
    drawText("Text1");
    cursor.x = 10;
    cursor.y = 30;
    drawText("Text2");
    //doc.save('Test.pdf');
    doc.output('datauristring');
}

function drawText(s) {
    //ctx.text(cursor.x, pageTop + cursor.y, s);
    ctx.fillText(s,cursor.x, pageTop + cursor.y);
    cursor.y += 20;
}

function startNewPage() {
    pageNo += 1;
    ctx.strokeStyle = "lightGray";
    ctx.lineWidth = 4;
    pageTop = (pageNo - 1) * (pageHeight + 20);
    ctx.moveTo(0, pageTop);
    ctx.lineTo(800, pageTop);
    ctx.lineTo(800, pageTop + pageHeight);
    ctx.lineTo(0, pageTop + pageHeight);
    ctx.lineTo(0, pageTop);
    ctx.stroke();
    cursor.x = 10;
    cursor.y = 10;
}


function createPDF(template, sectionName) {

    if (reportType.length > 0) {
        defineVars["#ReportType#"] = reportType;
    }
    
    formType = "";

    noGraphicsOutput = false;
    noControlGeneration = true;
    useDefaults = true;
    cursor.x = marginLeft + indentLeft;

    // Set the PDF file name
    //   - If can be specified as an option in the template file.
    //   - Fields specs are replaced  i.e. "#project.ProjectName#-#inspection.InspectionNumber#"  --> "ABCReRoof-001.pdf"
    //   - Fields can specify values from the user, project or inspection entities.

    templateSectionName = sectionName;
    var xmlString = template.templateXML;

    ///var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
    ///var documentsDirectory = [paths objectAtIndex:0];
    ///var pdfTempPath = [documentsDirectory stringByAppendingPathComponent:"EBSInspectorReport.pdf"];

    // Run the report, suppressing output, to calculate the number of pages.

    if (!template.onePassReports) {
        showErrorMessages = false;
        ///UIGraphicsBeginPDFContextToFile(pdfTempPath, CGRectZero, nil);
        startNewGenerate();
        ///UIGraphicsBeginPDFPageWithInfo(CGRectMake(0, 0, pageWidth, pageHeight), nil);
        noGraphicsOutput = true;
        pageNumber = 1;  
        numberOfPages = 1;
        executeDirectives(getSection(xmlString, templateSectionName));
        pageCountSave = numberOfPages;
        ///UIGraphicsEndPDFContext();
    }

    // Run again, with the number of pages available.
    showErrorMessages = true;
    ///UIGraphicsBeginPDFContextToFile(pdfTempPath, CGRectZero, nil);
    startNewGenerate();
    ///UIGraphicsBeginPDFPageWithInfo(CGRectMake(0, 0, pageWidth, pageHeight), nil);
    pageNumber = 1;
    noGraphicsOutput = false;
    numberOfPages = pageCountSave;
    executeDirectives(getSection(xmlString, templateSectionName));
    ///UIGraphicsEndPDFContext();

    // Set the file name - from the config section or from the <SetPDFFileNameTemplate> directive

    var pdfNamingTemplate;
    if (pdfNamingTemplateOverride.length > 0) {
        pdfNamingTemplate = pdfNamingTemplateOverride;
        
    } else {
        pdfNamingTemplate = template.pdfNamingTemplate;
    }
    if (pdfNamingTemplate.length == 0) {
        pdfNamingTemplate = "InspectionReport";
    }

    pdfFileName = replaceFieldnamesIn(pdfNamingTemplate);
    pdfFileName = pdfFileName.trim() + ".pdf";
    pdfFileName = replaceAll(pdfFileName,"%23");
    pdfFileName = replaceAll(pdfFileName,"'");
    pdfFileName = replaceAll(pdfFileName,"/");
    pdfFileName = replaceAll(pdfFileName,"\\");
    // Rename the PDF file
    ///NSFileManager *fileMgr = [NSFileManager defaultManager];
    ///var filePath2 = [documentsDirectory stringByAppendingPathComponent:pdfFileName];

    ///[EBUtil deleteFile:pdfFileName];
    ///NSError *error;
    ///if ([fileMgr moveItemAtPath:pdfTempPath toPath:filePath2 error:&error] != true) {
    ///    var msg = [NSString stringWithFormat:"Error renaming PDF file\nwith requested name\n%",pdfFileName];
    ///    displayErrorMessage(msg , "Invalid directive");
    ///    pdfFileName = pdfTempPath;  // Revert the PDF file name back to the temp name
    ///}

    // Save CSV data (if any)
    if (csv.length > 0) {
        var csvName = replaceFieldnamesIn(template.csvNamingTemplate);
        csvName = csvName.trim();
        if (csvName.length == 0) csvName = "CSVData";
        csvName = csvName + ".csv";
        ///[EBUtil  saveString: csv toFile:csvName];
    }
}


function replaceFieldnamesIn(template) {
    // This method replaced field names that are encloded in #  i.e. #InspectionNumber#
    // This is used for the pdf file name template (from the XML config) and for the
    // EMail subject and message templates (obtained from the EMail settings form)
    // and for custom cell fields on the project and inspection tables.

    var done = false;
    var fieldName;

    var locnToday = template.indexOf("#Today#");
    if (locnToday.location != -1) {
        ///NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
        ///[dateFormat setDateFormat:"yyyy.MM.dd"];
        template = template.replaceAll(template,"#Today#");
    }

    var locnNow = template.indexOf("#now#");
    if (locnNow.location != -1) {
        ///NSDateFormatter *timeFormat = [[NSDateFormatter alloc] init];
        ///[timeFormat setDateFormat:"hh:mm a"];
        var temp;  /// = [timeFormat stringFromDate:[NSDate date]];
        temp = replaceAll(temp, ":");  // File names can't have ":"
        template = replaceAll(template,"#now#");
    }

    while (!done) {
        // find the next #
        var locn1 = template.indexOf("#");
        if (locn1.location == -1) break;

        // Find the ending # and extract the fieldname
        fieldName = template.substring(locn1.location+1);
        var locn2 = fieldName.indexOf("#");
        if (locn2.location == -1) break;
        fieldName = fieldName.substring(0, locn2.location);

        // Replace #fieldname# with the value
        var replacementValue = getDataValue(fieldName, true);
        replacementValue = replaceAll(replacementValue,"#");

        if (replacementValue.length == 0) done = true;  // End the loop if a missing fieldName is found
        fieldName = "#" + fieldName + "#";
        template = template.replaceAll(template,fieldName);
    }
    template = replaceAll(template,"%23");
    return template;
}


function drawLineRight() {
    var distance = getFloatAttributeInPoints("distance", true);
    drawLineWithDirection("Right", distance);
}

function drawLineLeft() {
    var distance = getFloatAttributeInPoints("distance", true);
    drawLineWithDirection("Left", distance);
}

function drawLineUp() {
    var distance = getFloatAttributeInPoints("distance", true);
    drawLineWithDirection("Up", distance);
}

function drawLineDown() {
    var d1 = getStringAttribute("distance", true);
    var distance = getDataValue(d1, true);
    distance = cvtUnitsToPoints(distance);
    drawLineWithDirection("Down", distance);
}

function drawLineAcross() {
    cursor.x = marginLeft + indentLeft;
    var distance = pageWidth - marginLeft - indentLeft - marginRight - indentRight;
    drawLineWithDirection("Right",  distance);
}

function drawLines() {
    var commands = getStringAttribute("commands", true);
    var direction;
    var distance;
    var cursorSave = cursor;
    for (var cmdIndex in commands.split(",")) {
        var cmd = commands[cmdIndex];
        if (cmd[0] == "M") {
            direction = cmd.substring(0,2);
            distance = cmd.substring(2);
        } else {
            direction = cmd.substring(0,1);
            distance = cmd.substring(1);
        }
        distance =cvtUnitsToPoints(distance);

        if (direction == "L") {
            drawLineWithDirection("Left", distance);

        } else if (direction == "R") {
            drawLineWithDirection("Right", distance);

        } else if (direction == "U") {
            drawLineWithDirection("Up", distance);

        } else if (direction == "D") {
            drawLineWithDirection("Down", distance);

        } else if (direction == "V") {
            // "Vdistance;col1;col2;col3'..."
            var locns = cmd.substring(1).split(";");
            distance = locns[0];
            distance = cvtUnitsToPoints(distance);
            var first = true;
            for (var locn in locns) {
                if (first) {
                    first = false;
                    continue;
                }
                var fLocn =cvtUnitsToPoints(locn);
                cursor.x = marginLeft + indentLeft + fLocn;
                cursor.ySave = cursor.y;
                drawLineWithDirection("Down",  distance);
                cursor.y = cursor.ySave;
            }
            drawLineWithDirection("Down",  distance);
            cursor = cursorSave;

        } else if (direction == "ML") {
            cursor.x -= distance;

        } else if (direction == "MR") {
            cursor.x += distance;

        } else if (direction == "MU") {
            cursor.y -= distance;

        } else if (direction == "MD") {
            cursor.y += distance;

        } else {
            var msg = "Invalid direction = '" + direction + "' (must be U,D,L,R,MU,MD,ML,MR)";
            displayErrorMessage(msg, "Directive error - DrawLines");
        }
    };
    cursor = cursorSave;
}

function drawLineWithDirection(direction, distance) {
    var style = getStringAttribute("style",  false);
    if (style == "") style = "DefaultLineStyle";
    var selectedStyle = lineStyles[style];
    if (!selectedStyle) {
        var msg = "LineStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawLine" + direction);
        return;
    }
    var width = getFloatAttribute("width",  false);
    if (width > 0) selectedStyle.width = width;
    var targetX = cursor.x;
    var targetY = cursor.y;
    if (direction == "Right") targetX += distance;
    if (direction == "Left")  targetX -= distance;
    if (direction == "Up")    targetY -= distance;
    if (direction == "Down")  targetY += distance;
    drawLineX( targetX,  targetY, selectedStyle);
}

function drawBox() {
    var styleAttr = getStringAttribute("style", false);
    var style = getDataValue(styleAttr, false);
    if (style == "") style = "DefaultBoxStyle";
    var selectedStyle = boxStyles[style];
    if (!selectedStyle) {
        var msg = "BoxStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawBox");
        return;
    }
    var h1 = getStringAttribute("height", true);
    var height = getDataValue(h1, true);
    height = cvtUnitsToPoints(height);

    var w1 = getStringAttribute("width",  true);
    var width = getDataValue(w1, true);
    width = cvtUnitsToPoints(width);

    ////var height =getFloatAttributeInPoints("height",  true);
    //var width =getFloatAttributeInPoints("width",  true);
    drawBoxWithWidth(width, height, selectedStyle);
}

function drawPageBorder() {
    var style = getStringAttribute("style",  false);
    if (style == "") style = "DefaultBoxStyle";

    var selectedStyle = boxStyles[style];
    if (!selectedStyle) {
        var msg = "BoxStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawBox");
        return;
    }
    cursor.x = marginLeft;
    cursor.y = marginTop;
    var width = pageWidth - marginLeft - marginRight;
    var height = pageHeight - marginTop - marginBottom;
    drawBoxWithWidth(width, height, selectedStyle);
}

/*
function drawText() {
    var style = getStringAttribute("style",  false);
    if (style == "") style = "DefaultTextStyle";

    // Extract the style  (There must be a better way to clone an object?? )

    var sourceStyle = textStyles[style];
    if (!sourceStyle) {
        var msg = "TextStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawText");
        return;
    }
    var selectedStyle = {};

    selectedStyle.fontName        = sourceStyle.fontName;
    selectedStyle.fontSize        = sourceStyle.fontSize ;
    selectedStyle.fontColor       = sourceStyle.fontColor;
    selectedStyle.backgroundColor = sourceStyle.backgroundColor;
    selectedStyle.align           = sourceStyle.align;
    selectedStyle.underline       = sourceStyle.underline;
    selectedStyle.width           = sourceStyle.width;
    selectedStyle.paddingLeft     = sourceStyle.paddingLeft;
    selectedStyle.paddingRight    = sourceStyle.paddingRight;

    getTextStyleOverrides(selectedStyle);
    var data  = getStringAttribute("data",  true);
    var value = getDataValue(data, true);
    var case1 = getStringAttribute("case",  false);

    if (case1.isEqual("Upper")) {
        value = value.toUppercase();

    } else if (case1.isEqual("Lower")) {
        value = value.toLowercase();
    }

    value = addPrefixAndSuffix(value);

    // Check for a style tag at the start of the data
    if (value.hasPrefix("<")) {
        var endTag = value.indexOf(">");
        if (endTag != -1) {
            var styleTag = value.substring(0, endTag);
            styleTag = styleTag.substring(1);
            selectedStyle = textStyles[styleTag];
            value = value.substring(endTag + 1);
        }
    }

    // var width =getFloatAttributeInPoints("width",  false);

    // if (width > 0) selectedStyle.width = width;
    if (cursor.y > pageHeight - marginBottom) {
        startNewPage();
    }
    //NSLog("DrawText (%i,%i) %",(int) cursor.x, (int) cursor.y, activeDirective);
    drawText(value, selectedStyle);
    if (autoNewLineSpacing > 0) {
        // Same as StartNewLine logic - except the autoNewLineSpacing is applied.
        cursor.x = marginLeft + indentLeft;
        cursor.y += lastLineHeight * 1.1 * autoNewLineSpacing;
    }
}

function drawReport() {
    var dir = getStringAttribute("directives",  false);
    var lines = dir.split("\n");
    var style = textStyles["DefaultTextStyle"];
    cursor.x = 50;
    cursor.y = 20;
    for (var s in lines) {
        var params = s.split(",");
        if (params.length < 2) {
            cursor.y += 16;
        } else {
            cursor.x = params[0] * 72.0;
            drawText(params[1], style);
        }
    }
}

function getStylesOverrides(style) {

    // The fontSize, fontColor, backgroundColor, align and underline style properties may be overridden in
    // the DrawText directive

    var fontSize = getIntAttribute("fontsize",  false);
    if (fontSize > 0) style.fontSize = fontSize;

    var fontColor =getStringAttribute("fontcolor", false);
    if (fontColor.length > 0) {
        fontColor = getDataValue(fontColor);
        style.fontColor = fontColor;
    }
    //style.fontColor =getColorAttribute("fontcolor", "Black");

    var backgroundColor = getStringAttribute("backgroundcolor", false);
    if (backgroundColor.length > 0) style.backgroundColor = getColorAttribute("backgroundcolor", "Clear");

    var align  = getStringAttribute("align", false);
    if (align.length > 0) style.align = align;

    var underline = getStringAttribute("underline", false);
    if (underline.length > 0) style.underline = underline.isEqual("Yes");

    var w1 = getStringAttribute("width", false);

    if (w1.length > 0) {
        var w2 = getDataValue(w1, true);
        style.width = cvtUnitsToPoints(w2);
    }
}

function drawMemo() {
    var style = getStringAttribute("style", false);
    if (style.length ==0)  style = "DefaultTextStyle";
    var data = getStringAttribute("data", true);
    var value = getDataValue(data, true);
    value = addPrefixAndSuffix(value);

    var w1 = getStringAttribute("width", true);
    var width = getDataValue(w1, true);
    width = cvtUnitsToPoints(width);

    if (cursor.y > pageHeight - marginBottom) {
        startNewPage();
    }

    var selectedStyle = textStyles[style];;
    if (!selectedStyle) {
        var msg = "TextStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawMemo");
        return;
    }

    var max = pageHeight - marginBottom - cursor.y;
    //var remainingMemo =drawMemo(value, selectedStyle,  max);

    if (width > 0) selectedStyle.width = width;
    //if (selectedStyle.width == 0) selectedStyle.width = width;
    if (selectedStyle.width == 0) selectedStyle.width = pageWidth - marginLeft - marginRight;

    var remainingMemo = drawMemo(value, selectedStyle,  max);
    if (autoNewLineSpacing > 0) {
        cursor.x = marginLeft + indentLeft;
        cursor.y += lastLineHeight * 1.1 * autoNewLineSpacing;
    }
    // If memo didn't fit on the page - Draw the remaining memo until it is all drawn.
    while (!remainingMemo == "") {
        startNewPage();
        max = pageHeight - marginTop - marginBottom;
        remainingMemo = drawMemo(remainingMemo, selectedStyle,  max);
        if (autoNewLineSpacing > 0) {
            cursor.x = marginLeft + indentLeft;
            cursor.y += lastLineHeight * 1.1 * autoNewLineSpacing;
        }
    }
}


function drawTabbedMemo() {
    var style     = getStringAttribute("style",  false);
    var data      = getStringAttribute("data",  true);
    var value     = getDataValue(data, true);
    var tabStops  = getStringAttribute("tabstops", false);
    var separator = getStringAttribute("separator", false);

    if (style == "") style = "DefaultTextStyle";
    var selectedStyle = textStyles[style];
    if (!selectedStyle) {
        var msg = "TextStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawTabbedMemo");
        return;
    }
    var saveX = cursor.x;
    var aTabStops = tabStops.split(",");
    var lines = value.split("\n");

    var autoNumber = 0;
    //NSArray columnTotals[10];

    for (var line1Index in lines) { /// Fix
        var line1 = lines[line1Index];
        var line = line1.trim();
        if (line.length > 0) {
            if (cursor.y > pageHeight - marginBottom) {
                startNewPage();
            }
            var aColumns = line.split(",");
            if (aTabStops.length >1) {
                var iTab = 0;
                for (var colIndex in aColumns) {
                    var col = aColumns[colIndex];
                    var thisCol = col;
                    if (iTab == 0 && col.hasPrefix("#")) {
                        autoNumber += 1;
                        thisCol = replaceAll(thisCol,"#");
                    }
                    if (iTab >= aTabStops.length) {
                        var msg = "Extra column ignored\n" + data +"\nentered as\n%",data,value]; // ????
                        displayErrorMessage(msg, "Error in TabbedMemo data");

                    } else {
                        cursor.x = marginLeft + indentLeft + cvtUnitsToPoints(aTabStops[iTab]);
                        drawText(thisCol, selectedStyle);
                    }
                    iTab += 1;
                }

            } else {
                if (separator.length == 0) {
                    separator = " ";
                }
                var outputLine = "";
                var iCol = 0;
                for (colIndex in aColumns) {
                    var col = aColumns[colIndex];
                    if (iCol > 0) {
                        outputLine = outputLine + separator + col;
                    } else {
                        outputLine = col;
                    }
                    iCol += 1;
                }
                drawText(outputLine, selectedStyle);
            }
            cursor.x = saveX;
            cursor.y += lastLineHeight;
        }
    }
}

function drawDataWithLabel() {
    var label = getStringAttribute("label",  true);
    var data  = getStringAttribute("data", true);
    var value = getDataValue(data, true);
    value     = addPrefixAndSuffix(value);

    var spacing = getFloatAttributeInPoints("spacing",  true);
    if (cursor.y > pageHeight - marginBottom) {
        startNewPage();
    }

    var style = textStyles["LabelStyle"];
    if (style == undefined) {
        style = textStyles["DefaultLabelStyle"];
    }

    var labelData = getDataValue(label, true);
    drawText(labelData, style);
    cursor.x += spacing;

    style = textStyles["DataStyle"];
    if (!style) {
        style = textStyles["DefaultTextStyle"];
    }

    var widthSave = style.width;
    var width = getFloatAttributeInPoints("width",  false);
    if (width != 0) style.width = width;
    drawText(value, style);
    if (autoNewLineSpacing >0) {
        cursor.x = marginLeft + indentLeft;
        cursor.y +=  lastLineHeight * 1.1 * autoNewLineSpacing;
    }
    style.width = widthSave;
}

function drawImage() {
    var name =getStringAttribute("name",  true);
    name = getDataValue(name, true);
    name = addPrefixAndSuffix(name);
    var folder = getStringAttribute("folder",  false);
    var width  = getFloatAttributeInPoints("width",  false);
    var height = getFloatAttributeInPoints("height",  false);

    var reqd = false;
    if (width==0 || height==0) reqd=true;  // If the width or height is falset given, then the actual dimensions are used and a scale must be given.
    var scale =getFloatAttribute("scale",  reqd);
    //[self drawImage:name width: width height: height];
    ///drawImageFromBundle:name width: width height( height,  scale ,  folder);
}

function drawPDF() {
    if (!noGraphicsOutput) {
        var name = getStringAttribute("name",  true);
        name = getDataValue(name, true);

        var page = getStringAttribute("page",  false);
        var folder = getStringAttribute("folder",  false);
        if (folder.length == 0) folder = "Images";
        //if (page.length == 0) page = "1";
        var nPage = page;

        ///CGContextRef currentContext = UIGraphicsGetCurrentContext();
        ///CGContextTranslateCTM(currentContext, 0, pageHeight);
        ///CGContextScaleCTM(currentContext, 1.0, -1.0);
        //var pdfPath = [[NSBundle mainBundle] pathForResource:name ofType:"pdf"];
        //NSURL *pdfUrl = [NSURL fileURLWithPath:pdfPath];

        ///var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
        ///var pdfPath = [NSString stringWithFormat:"%@/%@/%",paths[0],folder,name];
        ///if (![pdfPath hasSuffix:".pdf"]) {
        ///    pdfPath = pdfPath + ".pdf";
        ///}
        ///NSURL *pdfUrl = [NSURL fileURLWithPath:pdfPath];

        ///CGPDFDocumentRef newDocument = CGPDFDocumentCreateWithURL((__bridge CFURLRef)pdfUrl);
        if (page.length == 0) {
            var pag.length = (int) CGPDFDocumentGetNumberOfPages(newDocument);
            for (var iPage = 1; iPage <= pag.length; iPage++) {
                CGPDFPageRef newPage = CGPDFDocumentGetPage (newDocument, iPage);
                CGContextDrawPDFPage (currentContext, newPage);
                if (iPage < pag.length) {
                    cursor.y = 500;  // Required to force new page
                    //pdfDisplayView.layer.geometryFlipped = true;
                    [self startNewPage];
                    CGContextRef currentContext = UIGraphicsGetCurrentContext();
                    CGContextTranslateCTM(currentContext, 0, pageHeight);
                    CGContextScaleCTM(currentContext, 1.0, -1.0);
                }

            }
        } else {
            CGPDFPageRef newPage = CGPDFDocumentGetPage (newDocument, nPage);
            CGContextDrawPDFPage (currentContext, newPage);
        }
    }
}

function drawPageNumber() {
    if (template.onePassReports) {
        displayErrorMessage("Page numbering falset available with OnePassReports", "Directive error - DrawPageNumber");
        return;
    }
    var style =getStringAttribute("style",  true);
    EBTextStyle *style2 = [textStyles objectForKey:style];
    if (!style2) {
        var msg = [NSString stringWithFormat:"TextStyle '%@' not defined",style];
        displayErrorMessage(msg, "Directive error - DrawPageNumber");
        return;
    }

    var format =getStringAttribute("format",  false);
    var fLength = (int) format.length;  // Coded this way to strange defect or something!!  format.length in the if stmt didn't work!!po formatsdsdsd
    if (fLength == 0) {
        var t = [NSString stringWithFormat:"Page %i of %i",pageNumber, numberOfPages];
        drawText(t, style2);
    } else {
        var sPageNumber = [NSString stringWithFormat:"%i",pageNumber];
        var sNumberOfPages = [NSString stringWithFormat:"%i",numberOfPages];
        format = replaceAll(format,"#PageNumber#");
        format = replaceAll(format,"#NumberOfPages#");
        style2.width = 72;  // Override the width
        drawText(format, style2);
    }
}

function drawPhoto() {
    var width      =getFloatAttributeInPoints("width",  true);
    var height     =getFloatAttributeInPoints("height",  true);
    var align  =getStringAttribute("align",  false);
    var data   =getStringAttribute("data",  true);
    var markup =getStringAttribute("markup",  false);
    var fn =getDataValue(data, true);

    if (fn.length == 0) return;

    // Get the adjusted height  - for page eject check
    var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
    var filePath = paths[0] + "/Photos/%" + fn;

    ///UIImage *image = [UIImage imageWithContentsOfFile:filePath];

    var photoRatio = image.size.width / image.size.height;
    var areaRatio = width / height;
    var height1 = height;
    if (photoRatio > areaRatio) {
        height1 = width / photoRatio;
    }

    if (cursor.y + height1 > pageHeight - marginBottom) {
        startNewPage();
    }

    // Get border style
    var style = getStringAttribute("borderstyle",  false);
    var selectedStyle;
    if (!style == "") {
        selectedStyle = boxStyles[style];
        if (!selectedStyle) {
            var msg = "BoxStyle '" + style + "' not defined";
            displayErrorMessage(msg, "Directive error - DrawPhoto");
            return;
        }
    } else {
        selectedStyle = nil;
    }
    var center = align == "Center";

    drawPhoto(fn, width, height, selectedStyle, center);
    if (!markup == "false") {
        drawMarkup();
    }
}

function drawCanvas() {
    var width        = getFloatAttributeInPoints("width", true);
    var height       = getFloatAttributeInPoints("height", true);
    var markupData   = getStringAttribute("markupdata", false);
    var markupValue  = getDataValue(markupData, false);
    var markupDataViewOnly   = getStringAttribute("markupdataviewonly", false);
    var markupValueViewOnly  = getDataValue(markupDataViewOnly, false);
    var markupDataViewOnly2  = getStringAttribute("markupdataviewonly2", false);
    var markupValueViewOnly2 = getDataValue(markupDataViewOnly2, false);
    var image                = getStringAttribute("image", false);
    var drawingStyle         = getStringAttribute("drawingStyle", false);
    var arrowStyle           = getStringAttribute("arrowStyle", false);
    var fillColorMacro       = getStringAttribute("fillcolormacro", false);
    var dofalsetIncludeMacro = getStringAttribute("dofalsetincludemacro", false);
    var objects              = getStringAttribute("objects", false);
    var label                = getStringAttribute("label", false);
    if (label.length > 0) label = getDataValue(label, false);
    var labelColor           = getStringAttribute("labelcolor", false);
    labelColor               = getDataValue(labelColor, false);
    var center               = getStringAttribute("center", false);
    var centerHorizontal     = getStringAttribute("centerhorizontal", false);
    var centerVertical       = getStringAttribute("centervertical", false);

    var drawPhotoLocations   = getStringAttribute("drawPhotolocations",false) == "true";
    var dynamicSymbols       = getStringAttribute("dynamicsymbols", false);
    var directions           = getStringAttribute("photodirections", false);
    var photoDirections = directions == "true";

    if (drawingStyle == "") drawingStyle = "DefaultDrawingStyle";
    var selectedStyle2 = drawingStyles[drawingStyle];
    if (!selectedStyle2) {
        var msg = "DrawingStyle '" + drawingStyle + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawCanvas");
        return;
    }

    var canvas; ///  = [[EBCanvas alloc] initWithFrame:CGRectMake(cursor.x, cursor.y, width, height)];
    canvas.menu = false;

    canvas.drawingStyle   = selectedStyle2;
    canvas.fillColorMacro = fillColorMacro;
    canvas.dofalsetIncludeMacro = dofalsetIncludeMacro;
    canvas.drawPhotoLocations = drawPhotoLocations;
    canvas.photoDirections = photoDirections;
    canvas.pdfObjects = objects;
    canvas.label = label;
    canvas.labelColor = labelColor;
    if (centerHorizontal.length) canvas.centerHorizontal = centerHorizontal;
    if (centerVertical.length) canvas.centerVertical = centerVertical;
    if (center == "true") {
        canvas.centerHorizontal = "true";
        canvas.centerVertical = "true";
    }
    canvas.generator = self;

    if (drawPhotoLocations) {
        canvas.photos = [EBUtil sortPhotoSet:inspection.photos];
    }
    if (dynamicSymbols.length) {
        canvas.dynamicSymbols = dynamicSymbols;
    }

    // Set arrow style from Settings--> Photo form

    if (arrowStyle.length > 0) {
        EBArrowStyle *selectedStyle3 = [arrowStyles objectForKey:arrowStyle];
        if (!selectedStyle3) {
            var msg = "ArrowStyle '" + arrowStyle + "' not defined";
            displayErrorMessage(msg, "Directive error - DrawCanvas");
            return;
        }
        canvas.arrowStyle = selectedStyle3;

    } else {
        canvas.arrowStyle = arrowStyles[device xmlPhotoData:"PhotoMarkupArrowStyle"];
    }

    // Get the image, if defined
    if (image.length > 0) {
        var fn = getDataValue(image, true);
        var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
        var filePath = [NSString stringWithFormat:"%@/Photos/%",paths[0],fn];
        canvas.image = [UIImage imageWithContentsOfFile:filePath];
    }
    canvas.pdfRect = CGRectMake(cursor.x, cursor.y, width, height);
    canvas.markupData = markupValue;
    canvas.markupDataViewOnly = markupValueViewOnly;
    canvas.markupDataViewOnly2 = markupValueViewOnly2;

    canvas.drawPDF();

}

function drawPhotos() {

    // var numbering    =getStringAttribute("numbering",  true);

    // Get common attributes - type and styles
    var type         =getStringAttribute("type", true);
    var textStyle    =getStringAttribute("textstyle", false);
    if (textStyle == "") textStyle = "DefaultTextStyle";
    var selectedTextStyle = textStyles[textStyle];
    if (selectedTextStyle == undefined) {
        var msg = "TextStyle '" + textStyle + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawPhotos");
        return;
    }

    var boxStyle = getStringAttribute("boxstyle", false);
    if (boxStyle == "") boxStyle = "DefaultBoxStyle";
    var selectedBoxStyle = boxStyles[boxStyle];
    if (selectedBoxStyle == undefined) {
        var msg = "BoxStyle '" + boxStyle + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawPhotos");
        return;
    }

    cursor.x = marginLeft + indentLeft;
    var photoCarryForward = template.photoCarryForward;
    var photoCarryForwardCopyAnnotation = template.photoCarryForwardCopyAnnotation;

    // If a repeat for PhotoGroups directive is active, then use the array of photos that has been set by the repeat directive
    var sortedPhotos;
    if (useGroupPhotos) {
        sortedPhotos = groupPhotos;
    } else {
        sortedPhotos = [EBUtil sortPhotoSet:inspection.photos];
    }

    if (type to:"PhotosLeft"] || [EBUtil stringEqual:type.isEqual("PhotosRight")) {

         // LOGIC:
         // - The photo table always extends across the available width (pageWidth - margins - indents)
         // - The Annotation width is set to use available space after the photonumber and photo columns.
         // - Calculations are done to check for an Annotation that is higher than the photo, and a page
         // eject is done if required.


        var photoNumberWidth = getFloatAttributeInPoints("photonumberwidth", true);
        var photoMargin      = getFloatAttributeInPoints("photomargin", true);
        var photoWidth       = getFloatAttributeInPoints("photowidth" , true);
        var photoHeight      = getFloatAttributeInPoints("photoheight", true);
        var totalPhotoHeight = photoHeight + 2*photoMargin;

        var totalWidth  = pageWidth - marginLeft - indentLeft - marginRight - indentRight;
        var AnnotationMargin =getFloatAttributeInPoints("Annotationmargin", true);
        var AnnotationWidth  = totalWidth - photoNumberWidth - photoWidth - 2*photoMargin - 2*AnnotationMargin;

        var nPhoto = -1;

        for (Photo *photo0 in sortedPhotos) {

            if (nPhoto != -1 && keepTogetherTestActive) break;  // draw first photo only during KeepTogether test

            ///photo = photo0;
            if (photo.Used == "Yes") continue;
            if (photo.CellIdentifier == "GroupCell") continue;
            nPhoto += 1;
            var topX = cursor.x;
            var topY = cursor.y;
            selectedTextStyle.width = AnnotationWidth;

            // Calculate the height required, allowing for an expanded memo, and page eject if necessary.
            var actualAnnotationHeight;
            if (photoCarryForward && !photoCarryForwardCopyAnnotation) {
                actualAnnotationHeight = [self showAllAnnotationsForPhotoHeight];
            } else {
                actualAnnotationHeight = getMemoHeight(photo, "Annotation", selectedTextStyle);
            }
            var totalAnnotationHeight = actualAnnotationHeight + 2*AnnotationMargin;
            var AnnotationExtraHeight = 0;
            if (totalAnnotationHeight > totalPhotoHeight) {
                AnnotationExtraHeight = totalAnnotationHeight - totalPhotoHeight;
            }
            var totalHeight = totalPhotoHeight + AnnotationExtraHeight;
            if (cursor.y + totalHeight > pageHeight - marginBottom) {
                startNewPage();
                topX = cursor.x;
                topY = cursor.y;
            }
            // Draw box around everything
            drawBoxWithWidth(totalWidth, totalHeight, selectedBoxStyle);

            if (type.isEqual("PhotosLeft")) {

                // Draw boxes around photos
                cursor.x += photoNumberWidth;
                var boxWidth = 2*photoMargin + photoWidth;
                drawBoxWithWidth(boxWidth, totalHeight, selectedBoxStyle);

                // Draw Photo number
                cursor.x = topX + 10;
                cursor.y = topY + 10;

                var photoNumber = [photo photoDisplayNumber];
                drawText(photoNumber, selectedTextStyle);

                // Draw Photo
                cursor.x = topX + (photoNumberWidth + photoMargin);
                cursor.y = topY + photoMargin;
                var fn = photo.FileName;
                drawPhoto( fn, photoWidth, photoHeight);
                drawMarkup ();

                // Draw Annotation
                cursor.x = topX + photoNumberWidth + 2*photoMargin + photoWidth + AnnotationMargin;
                cursor.y = topY + AnnotationMargin;
                selectedTextStyle.width = AnnotationWidth;

                // If the copy option is used, then the Annotation has been copied to the current photo.
                // Otherwise, they need to be retrieved from previous inspections
                if (photoCarryForward && !photoCarryForwardCopyAnnotation) {
                    showAllAnnotationsForPhoto();
                } else {
                    drawMemo(photo.Annotation, selectedTextStyle, photoHeight + AnnotationExtraHeight);
                }
                // Move to position for next photos
                cursor.x = topX;
                cursor.y = topY + totalHeight;

            } else {
                // Draw boxes around photos
                cursor.x += photoNumberWidth;
                var boxWidth = 2*AnnotationMargin + AnnotationWidth;
                drawBoxWithWidth(boxWidth, totalHeight, selectedBoxStyle);

                // Photo number
                cursor.x = topX + 10;
                cursor.y = topY + 10;

                var photoNumber = photo.PhotoDisplayNumber;  // ????
                drawText(photoNumber, selectedTextStyle);

                // Annotation
                cursor.x = topX + photoNumberWidth + AnnotationMargin;
                cursor.y = topY + AnnotationMargin;
                selectedTextStyle.width = AnnotationWidth;

                if (photoCarryForward) {
                    showAllAnnotationsForPhoto();

                } else {
                    drawMemo(photo.Annotation, selectedTextStyle, photoHeight + AnnotationExtraHeight);
                }

                // Photo

                cursor.x = topX + photoNumberWidth + 2*AnnotationMargin + AnnotationWidth + photoMargin;
                cursor.y = topY + photoMargin;
                var fn = photo.FileName;
                var optionalPhoto = getStringAttribute("optionalphoto", false);
                var optionalPhotoName = getDataValue(optionalPhoto, false);
                if (optionalPhotoName.length != 0) fn = optionalPhotoName;
                drawPhoto(fn, photoWidth, photoHeight);
                drawMarkup();

                // Move to position for next photos
                cursor.x = topX;
                cursor.y = topY + totalHeight;
            }
        }
    }

    if (type.isEqual("PhotosAbove")) {

         //  <DrawPhotos type='PhotosAbove' numberOfColumns='2' columnWidth='4' totalHeight='4.4'
         //   photoWidth='3.4'  photoHeight='2.6' photoMargin='.1'
         //   AnnotationPosition='3.1' AnnotationMargin='.1' AnnotationHeight='1' AnnotationWidth='3.4'
         //   numbering='project.inspection' boxstyle='Photos1' textstyle='Std'
         //   photoNumberWidth='.5'  />


         //  vars:
         //  - currentColumn - starts at 1.
         //  - xPosition, yPosition

         //  logic:
         //  - photo at xPosition+PhotoMargin, yPosition+PhotoMargin
         //  - comments at xPosition, yPosition+Anfalsetatiofalseffset
         //  - xPosition += ColumnWidth
         //  - if last column  xPosition = 0; yPosition += TotalHeight
         //  - page eject if required
         //  - Does falset allow for expanding Annotation.
         //  - Any required lines or fixed text are drawn using macro "PhotoMacro"
         //


        var numberofcolumns     = getIntAttribute("numberofcolumns", true);
        var AnnotationPosition  = getFloatAttributeInPoints("Annotationposition", true);
        var columnWidth         = getFloatAttributeInPoints("columnwidth", true);
        var totalHeight         = getFloatAttributeInPoints("totalheight", true);

        var photoMargin         = getFloatAttributeInPoints("photomargin", true);
        var photoWidth          = getFloatAttributeInPoints("photowidth" , true);
        var photoHeight         = getFloatAttributeInPoints("photoheight", true);

        var annotationMargin    = getFloatAttributeInPoints("Annotationmargin", true);
        var annotationWidth     = getFloatAttributeInPoints("Annotationwidth" , true);
        var annotationHeight    = getFloatAttributeInPoints("Annotationheight", true);
        var originalTotalHeight = totalHeight;
        var originalAnnotationHeight = AnnotationHeight;

        var currentColumn = 1;
        var xPosition = marginLeft + indentLeft;
        var yPosition = cursor.y;
        var numberOfPhotos = sortedPhotos.length;
        var currentPhoto = 0;

        var iToPhoto = Math.min(numberofcolumns, sortedPhotos.length) -1 ;

        var maxHeight = getMaxAnnotationHeight(sortedPhotos, 0, iToPhoto,  selectedTextStyle);
        if (maxHeight > AnnotationHeight) {
            //totalHeight += (maxHeight - AnnotationHeight);
            //AnnotationHeight = maxHeight;
        }

        var iCurrentIndex = 0;
        for (Photo *photo0 in sortedPhotos) {
            var photo = photo0;
            currentPhoto + =1;
            if (photo.Used != "Yes") continue;
            if (photo.CellIdentifier == "GroupCell") continue;

            if (macros["PhotoMacro"] != undefined) {
                cursor.x = xPosition;
                cursor.y = yPosition;
                var macro = macros["PhotoMacro"];
                var box2Height = cvtPointsToUnits(AnnotationHeight + 2*AnnotationMargin);
                macro = macro.replaceAll(macro,"#Box2Height#");
                executeDirectives(macro);
            }

            // Photo
            var filename = photo.FileName;
            cursor.x = xPosition + photoMargin;
            cursor.y = yPosition + photoMargin;
            drawPhoto(filename , photoWidth, photoHeight);
            drawMarkup();

            // Annotation
            cursor.x = xPosition + AnnotationMargin;
            cursor.y = yPosition + AnnotationPosition + AnnotationMargin;
            selectedTextStyle.width = AnnotationWidth;
            drawMemo(photo.Annotation, selectedTextStyle, AnnotationHeight);
            showAllAnnotationsForPhoto();
            //cursor.y = yPosition + AnnotationPosition + AnnotationMargin;  // Fix for RAM

            if (currentColumn == numberofcolumns) {
                currentColumn = 1;
                xPosition = marginLeft + indentLeft;
                yPosition += totalHeight;

                //var iFromPhoto = iCurrentIndex + 1;
                //var iToPhoto = MIN(sortedPhotos.length, iFromPhoto + numberofcolumns) -1;

                //var maxHeight =getMaxAnnotationHeight:sortedPhotos from(iFromPhoto, iToPhoto,  selectedTextStyle);

                //var maxHeight=0;
                //AnnotationHeight = originalAnnotationHeight;

                //if (maxHeight > originalAnnotationHeight) {
                //    totalHeight += (maxHeight - AnnotationHeight);
                //    AnnotationHeight = maxHeight;
                //} else {
                annotationHeight = originalAnnotationHeight;
                totalHeight = originalTotalHeight;
                //}

                // Page eject if not enough room for next photo, and not at last photo
                if (yPosition + totalHeight > pageHeight - marginBottom) {
                    if (currentPhoto < numberOfPhotos) {
                        // New Page logic
                        startNewPage();
                        yPosition = marginTop;
                    }
                }
            } else {
                currentColumn += 1;
                xPosition += columnWidth;
            }
            iCurrentIndex += 1;
        }
    }
}


function getMaxAnnotationHeight(sortedPhotos, iFirst, iList, selectedTextStyle {
    var maxHeight = 0;
    for (var iPhoto = iFirst; iPhoto <= iLast; iPhoto++) {
        var photo2 = sortedPhotos[iPhoto];
        maxHeight = Math.max(maxHeight, getMemoHeight(photo2.Annotation), selectedTextStyle);
    }
    return maxHeight;
}


function showAllAnnotationsForPhoto() {
    var photoFileName = photo.FileName;
    var savePhoto = photo;
    var inspectionsForThisProject = sortInspectionSet(inspection.project.inspections);
    var thisInspection = savePhoto.inspection.valueForSorting;

    for (Inspection *previousInspection in inspectionsForThisProject) {
        if ([previousInspection.valueForSorting intValue] <= thisInspection){
            for (Photo *matchingPhoto in previousInspection.photos) {
                if (matchingPhoto.FileName.isEqual(photoFileName)) {
                    if (macros.AnnotationMacro != undefined) {
                        photo = matchingPhoto;
                        inspection = matchingPhoto.inspection;
                        if (matchingPhoto.Annotation.length > 0) {
                            executeDirectives(macros.AnnotationMacro);
                        }
                    }
                    break;
                }
            }
        }
    }
    photo = savePhoto;
    inspection = photo.inspection;
}


function showAllAnnotationsForPhotoHeight() {
    var cursor.xSave = cursor.x;
    var cursor.ySave = cursor.y;
    var pageHeightSave = pageHeight;
    var ifConditionSave = ifConditionValue;
    pageHeight = 9999;
    noGraphicsOutput = true;
    cursor.y = 0;
    var newcursor.y;
    var photoFileName = [photo.FileName"];
    var savePhoto = photo;
    var inspectionsForThisProject =  [EBUtil sortInspectionSet:inspection.project.inspections];
    var thisInspection = [savePhoto.inspection.valueForSorting intValue];
    for (Inspection *previousInspection in inspectionsForThisProject) {
        if ([previousInspection.valueForSorting intValue] <= thisInspection){
            for (Photo *matchingPhoto in previousInspection.photos) {
                if (matchingPhoto.FileName.isEqual(photoFileName)) {
                    if (macros.AnnotationMacro != undefined) {
                        photo = matchingPhoto;
                        var inspection = matchingPhoto.inspection;
                        if (matchingPhoto.Annotation.length > 0) {
                            executeDirectives(macros.AnnotationMacro);
                        }
                    }
                    break;
                }
            }
        }
    }
    photo = savePhoto;
    inspection = photo.inspection;

    // Reset values
    newcursor.y = cursor.y;
    pageHeight = pageHeightSave;
    newcursor.y = cursor.y;
    cursor.x = cursor.xSave;
    cursor.y = cursor.ySave;
    ifConditionValue = ifConditionSave;
    noGraphicsOutput = false;
    return newcursor.y;
}

function drawMemo2(memo1, style, maxHeight) {


    // Logic:
    // - Extracts paragraphs from a memo and prints until the maxHeight is filled.
    // - If the first paragraph doesn't fit then it is truncated.
    // - Any remaining content is returned.
    // - Paragraphs can start with styles tags... i.d  <bold> that are defined in the template.


    var memo = memo1;
    var memoSave;

    var font;
    var paragraph;
    var paragraphSize;
    var iPt, endTag;
    var widthInOriginalStyle = originalStyle.width;
    var totalHeight = 0;
    var style;

    // Format paragraphs until max space is filled
    while (memo.length > 0) {
        // Extract the next paragraph
        memoSave = memo;
        if (memo.indexOf("\n").length== 0) {
            paragraph = memo;
            memo = "";

        } else {
            iPt = memo.indexOf("\n" );
            paragraph = memo.substring(0, iPt);
            memo = memo.substring(iPt+1);
        }

        //if (paragraph.length == 0) paragraph = "----" + paragraph;

        // Extract the style tag, if present
        var styleTag = "";
        if (paragraph.hasPrefix("<")) {
            endTag = (int) paragraph.indexOf(">");
            if (endTag != -1) {
                styleTag = paragraph.substring(0, endTag);
                styleTag = styleTag.substring(1);
                style = textStyles[styleTag];
                style.width = widthInOriginalStyle;
                paragraph = paragraph.substring(endTag + 1);
            }
        } else {
            style = originalStyle;
        }

        font = {fontName:style.fontName,  fontSize:style.fontSize};
        if (paragraph.length ==0) paragraph = " ";  // Required to get the height correct.
        ///paragraphSize = [paragraph sizeWithFont:font constrainedToSize:CGSizeMake(style.width, 2000)
        ///lineBreakMode:NSLineBreakByWordWrapping];

        // Check if this paragraph will fit on the page
        if (totalHeight + paragraphSize.height > maxHeight && totalHeight > 0) {
            memo = memoSave;
            break;
        }

        if (!noGraphicsOutput) {

            // Draw a box to get the background color
            var bStyle;;
            bStyle.lineWidth   = 1;
            bStyle.lineColor   = "Clear";
            bStyle.fillColor   = style.backgroundColor;
            //[self drawBoxWithWidth: style.width height: paragraphSize.height + 100 style: bStyle];

            var renderingRect = CGRectMake(cursor.x, cursor.y, style.width, maxHeight); //font.pointSize);
            //CGContextRef currentContext = UIGraphicsGetCurrentContext();
            //CGContextSetRGBFillColor(currentContext, 0.0, 0.0, 0.0, 1.0);
            //CGContextSetStrokeColorWithColor(currentContext, [style.fontColor CGColor]);
            //CGContextSetFillColorWithColor(currentContext, [style.fontColor CGColor]);
            //CGContextSetFillColorWithColor(currentContext, [[UIColor clearColor] CGColor]);
            var align = "Left";
            if (style.align.isEqual("Center")) {
                align = "Center";
            }
            if (style.align.isEqual("Right")) {
                align = "Right";
            }

            ///[paragraph drawInRect:renderingRect withFont:font lineBreakMode:NSLineBreakByWordWrapping alignment:align];
            if (style.underline) {
                var saveX = cursor.x;
                var saveY = cursor.y;
                var style2;
                ///var stringSize = [paragraph sizeWithFont:font
                ///constrainedToSize:CGSizeMake(1000, font.pointSize)
                ///lineBreakMode:NSLineBreakByTruncatingTail];
                style2.width = .5;
                style2.color = style.fontColor;
                cursor.y += font.pointSize + 1;
                drawLineX(cursor.x + stringSize.width, cursor.y, style2);
                cursor.x = saveX;
                cursor.y = saveY;
            }
        }
        cursor.y += paragraphSize.height;
        totalHeight += paragraphSize.height;
    }
    return memo;
}

function drawImage2(fileName, width, height) {

    var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
    var documentsPath = paths[0];

    //var fullName = "Images/" + fileName;
    //var filePath = [documentsPath stringByAppendingPathComponent:fullName];
    //NSData *jpgData = [NSData dataWithContentsOfFile:filePath];
    ///UIImage *image = [UIImage imageWithContentsOfFile:filePath];

    var photoRatio = image.size.width / image.size.height;
    var areaRatio = width / height;
    if (photoRatio > areaRatio) {
        height = width / photoRatio;
    } else {
        width = height * photoRatio;
    }
    if (!noGraphicsOutput) {
        ///[image drawInRect:CGRectMake(cursor.x, cursor.y, width, height)];
    }
}

function drawPhoto2(fileName, width, height)  {
    drawPhoto(fileName, width, height, nil, false);
}

function drawPhoto3(fileName, width, height, borderStyle, center)    {

    var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
    var filePath = [NSString stringWithFormat:"%@/Photos/%",[paths objectAtIndex:0],fileName];
    if (!noGraphicsOutput) {
        if (![EBUtil fileExists:fileName inFolder:"Photos"]) {
            var msg = [NSString stringWithFormat:"Missing photo %",fileName];
            displayErrorMessage(msg, "Missing photo");
            return;
        }
    }

    UIImage *image = [UIImage imageWithContentsOfFile:filePath];

    if (pdfSizeReductionFactor < 1.0) {
        // Compress the image and save
        CGSize newSize;
        newSize.width = image.size.width * pdfSizeReductionFactor;
        newSize.height = image.size.height * pdfSizeReductionFactor;
        UIGraphicsBeginImageContext(newSize);
        [image drawInRect:CGRectMake(0,0,newSize.width,newSize.height)];
        UIImage *compressedImage = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();

        //NSData *jpgDataCompressed = UIImageJPEGRepresentation(compressedImage, 0);
        //[jpgDataCompressed writeToFile:filePath atomically:true];
        image = [UIImage imageWithData: UIImageJPEGRepresentation(compressedImage, 0)];
    }
    var photoRatio = image.size.width / image.size.height;
    var areaRatio = width / height;
    var saveHeight = height;
    var saveWidth = width;

    if (photoRatio > areaRatio) {
        height = width / photoRatio;
        if (center) cursor.y += (saveHeight - height) / 2;
    } else {
        width = height * photoRatio;
        if (center) cursor.x += (saveWidth - width) / 2;
    }
    if (!noGraphicsOutput) {
        [image drawInRect:CGRectMake(cursor.x, cursor.y, width, height)];
        // Draw border
        if (borderStyle) {
            drawBoxWithWidth(width, height, borderStyle);
        }
    }

    lastPhotoWidth = width;
    lastPhotoHeight = height;
}

function drawImageFromBundle(fileName, width, height, scale, folder) {

    // Use the image from the Images folder, or from the bundle, if falset present.
    var image;
    if (folder.length == 0) folder = "Images";
    if ([EBUtil fileExists:fileName  inFolder: folder]) {
        var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
        var filePath = [NSString stringWithFormat:"%@/%@/%",paths[0],folder,fileName];
        image = [UIImage imageWithContentsOfFile:filePath];

    } else {
        image = [UIImage imageNamed:fileName];
    }
    if (image.size.width == 0) {
        displayErrorMessage(fileName, "DrawImage - Missing image");
        return;
    }

    if (width==0 || height==0) {
        width = image.size.width * scale;
        height = image.size.height * scale;
    }

    var photoRatio = image.size.width / image.size.height;
    var areaRatio = width / height;
    if (photoRatio > areaRatio) {
        height = width / photoRatio;
    } else {
        width = height * photoRatio;
    }
    if (!noGraphicsOutput) {
        [image drawInRect:CGRectMake(cursor.x, cursor.y, width, height)];
    }
}


 */


function setPDFNamingTemplate() {
    pdfNamingTemplateOverride = getStringAttribute("value", true);
}


/*
function drawLineWIthX(x, y, style) {

    if (!noGraphicsOutput) {
        CGContextRef currentContext = UIGraphicsGetCurrentContext();
        CGContextSetLineWidth(currentContext,style.width);
        CGContextSetStrokeColorWithColor(currentContext, [style.color CGColor]);//[UIColor blackColor].CGColor);
        CGContextBeginPath(currentContext);
        CGContextMoveToPoint(currentContext, cursor.x,cursor.y);
        CGContextAddLineToPoint(currentContext, x, y);
        CGContextClosePath(currentContext);
        CGContextDrawPath(currentContext, kCGPathFillStroke);
    }
    cursor.x = x;
    cursor.y = y;
}

function drawBoxWithWidth(width, height, style) {

    if (!noGraphicsOutput) {
        CGContextRef currentContext = UIGraphicsGetCurrentContext();
        UIColor *borderColor = style.lineColor;
        UIColor *fillColor = style.fillColor;
        CGRect rectFrame = CGRectMake(cursor.x, cursor.y, width, height);
        CGContextSetStrokeColorWithColor(currentContext, borderColor.CGColor);
        CGContextSetLineWidth(currentContext, style.lineWidth);
        CGContextSetFillColorWithColor(currentContext, fillColor.CGColor);
        CGContextStrokeRect(currentContext, rectFrame);

        CGPovar p1,p2,p3,p4;
        p1.x = cursor.x;        // Current location
        p1.y = cursor.y;
        p2.x = p1.x + width;   // Over width
        p2.y = p1.y;
        p3.x = p2.x;           // Down height
        p3.y = p2.y + height;
        p4.x = p1.x;
        p4.y = p1.y + height;

        // Draw the line
        //CGContextRef currentContext = UIGraphicsGetCurrentContext();
        CGContextSetLineWidth(currentContext,1);
        CGContextSetStrokeColorWithColor(currentContext, borderColor.CGColor);
        //CGContextBeginPath(currentContext);
        //CGContextMoveToPoint(currentContext, p1.x, p1.y);
        //CGContextAddLineToPoint(currentContext, p5.x,p5.y);  // Draw to start of arrow - falset end of line - to get a 'sharp' arrow
        //CGContextClosePath(currentContext);
        //CGContextDrawPath(currentContext, kCGPathFillStroke);

        // Draw the box
        CGMutablePathRef path = CGPathCreateMutable();
        CGPathMoveToPoint(path, NULL,p1.x, p1.y);
        CGPathAddLineToPoint(path, NULL,p2.x, p2.y);
        CGPathAddLineToPoint(path, NULL,p3.x, p3.y);
        CGPathAddLineToPoint(path, NULL,p4.x,p4.y);
        CGPathAddLineToPoint(path, NULL,p1.x, p1.y);
        CGPathCloseSubpath(path);
        CGContextSetFillColorWithColor(currentContext, fillColor.CGColor);
        CGContextAddPath(currentContext, path);
        CGContextFillPath(currentContext);
    }
}
*/
