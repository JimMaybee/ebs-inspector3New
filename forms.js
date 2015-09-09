
"use strict";

var tfText = "";
var tfTag = 0;
var tfAccessibilityHint="Test";
var tfHidden = false;
var tfAlignment = "Left";
var tfFontName;
var tfFontSize;
var inputControls = [];
var formType;   // Saves the form type for timer method and for <if
var nextTagToAssign = 0;
var noGraphicsOutput;
var noControlGeneration;
var useDefaults;

/*
function showDisplayForm() {
    formType = "Display";
    noGraphicsOutput = true;
    noControlGeneration = false;
    useDefaults = false;
    enabled = false;
    showForm(template);
}

function showAddForm() {
    formType = "Add";
    noGraphicsOutput = true;
    noControlGeneration = false;
    useDefaults = true;
    enabled = true;
    showForm(template);
}

function showEditForm() {
    formType = "Edit";
    noGraphicsOutput = true;
    noControlGeneration = false;
    useDefaults = false;
    enabled = true;
    showForm(template);
}

function showEditFormUsingXML() {
    formType = "Edit";
    noGraphicsOutput = true;
    noControlGeneration = false;
    useDefaults = false;
    enabled = true;
    //[self startNewGenerate];
    inputControls = {};
    nextTagToAssign = 0;
    executeDirectives(xmlString);
}

function showForm() {
    startNewGenerate();

    nextTagToAssign = 0;
    var xmlString;
    if (template) {
        //template = template;
        parseID = template.parseID.trimTo(10);  // Used in design refresh
        xmlString = template.templateXML;

    } else {
        //template = nil;
        //parseID = nil;
        ///xmlString = device.settingsFormsXML;
    }
    executeDirectives(getSection(xmlString, templateSectionName));
}
*/
function drawLabel() {
    var style = getStringAttribute("style", false);
    var errorNumber = getStringAttribute("errornumber", false);
    var progressMessage = getStringAttribute("progressmessage", false);
    if (style == "") style = "DefaultTextStyle";
    var selectedStyle = textStyles[style];
    if (selectedStyle == undefined) {
        var msg = "TextStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawLabel");
        return;
    }

    var data = getStringAttribute("data", true);
    var value = getDataValue(data, true);
    value = addPrefixAndSuffix(value);
    var labelwidth = getFloatAttributeInPoints("width", false);
    var lbl = createLabelFieldWithStyle(style, data, labelwidth);
    if (errorNumber.length > 0) {
        lbl.tag = errorNumber;
    }
    if (progressMessage == "Yes") {
        lbl.tag = 1;
    }
}

function addPrefixAndSuffix(value) {
    var prefix = getStringAttribute("prefix", false);
    if (prefix.length > 0) {
        prefix = getDataValue(prefix, true);
        value = prefix + value;
    }

    var suffix = getStringAttribute("suffix", false);
    if (suffix.length > 0) {
        suffix = getDataValue(suffix, true);
        value = value + suffix;
    }
    return value;
}

function createLabelFieldWithStyle(style, data, labelWidth) {

    // Determine the width and create the control
    // width is set to the Width in the directive, from the style, or 2".
    //console.log("Label " + data + " " + cursor.x + "," + cursor.y);
    var lbl = {};
    if (style == "") style = "DefaultTextStyle";
    var selectedStyle = textStyles[style];
    if (!selectedStyle) {
        var msg = "TextStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error");
    }

    lbl.width = 0;
    if (selectedStyle.width > 0) lbl.width = selectedStyle.width;
    if (labelWidth > 0) lbl.width = labelWidth;
    if (lbl.width == 0) lbl.width = 1*72;         // ********** Should be revised to set to actual width ************

    var rectWidth = lbl.width - selectedStyle.paddingLeft - selectedStyle.paddingRight;
    lbl.height = lbl.fontSize * 1.4;
    lbl.x = cursor.x + selectedStyle.paddingLeft;
    lbl.y = cursor.y;

    // Set the text property from the data attribute
    lbl.text = getDataValue(data, true);
    lbl.text = addPrefixAndSuffix(lbl.text);
    lbl.fontName = selectedStyle.fontName;
    lbl.fontSize = selectedStyle.fontSize
    lbl.textColor = selectedStyle.fontColor;
    lbl.backgroundColor = selectedStyle.backgroundColor;
    lbl.align = selectedStyle.align;

    var html = "<div style='position:absolute; top:#y#px; left:#x#px; height:#height#px; width:#width#px; " +
        "font-family:#fontName# font-size:#fontSize#px; text-align:#align#'>#text#</div>";

    html = html.replace("#x#", cursor.x).replace("#y#",cursor.y).replace("#text#",lbl.text);
    html = html.replace("#width#", lbl.width).replace("#height#", lbl.height);
    html = html.replace("#fontName#", lbl.fontName).replace("#fontSize#",lbl.fontSize).replace("#align#",lbl.align);
    $("#formtest").append(html);
    cursor.x += selectedStyle.paddingLeft + lbl.width + selectedStyle.paddingRight;
    return lbl;
}

function drawControlLabel() {
    var label = getStringAttribute("label", false);
    if (label.length > 0) label = getDataValue(label, false);
    var labelWidth = getFloatAttributeInPoints("labelWidth", false);

    if (label.length > 0 && labelWidth > 0) {
        if (macros.LabelMacro != undefined) {
            var macro = macros.LabelMacro;
            macro = macro.replaceAll("#label#",label);

            // Move the cursor to the start of the control, run the macro, and then move back
            var style = getStringAttribute("style", false);
            if (style == "") style = "DefaultControlStyle";
            var selectedStyle = controlStyles[style];
            if (!selectedStyle) {
                var msg = "ControlStyle '" + style + "' not defined";
                displayErrorMessage(msg, "Directive error - in LabelMacro");
            }

            cursor.x += selectedStyle.paddingLeft;
            executeDirectives(macro);
            cursor.x -= selectedStyle.paddingLeft;

        } else {
            createLabelFieldWithStyle("DefaultLabelStyle", label, labelWidth);
        }
    }
}

function drawTextBox() {
    var hidden = getStringAttribute("hidden", false);
    if (hidden != "Yes") drawControlLabel();

    // Determine the width and create the control
    // width is set to the Width in the directive, from the style, or 2".

    var style = getStringAttribute("style", false);
    if (style == "") style = "DefaultControlStyle";

    var selectedStyle = controlStyles[style];
    if (selectedStyle != undefined) {
        var msg = "ControlStyle '" + style + "' not defined";
        displayErrorMessage(msg,"Directive error");
    }
    var width = getFloatAttributeInPoints("width", false);
    if (width == 0) width = selectedStyle.width;
    if (width == 0) width = 144;  // 2"
    var rectWidth = width - selectedStyle.paddingLeft - selectedStyle.paddingRight;

    tfFontName = selectedStyle.fontName;
    tfFontSize = selectedStyle.fontSize;

    var height = getFloatAttributeInPoints("height", false);
    if (height == 0) {
        height = selectedStyle.height;
    }
    if (height == 0) {
        height = font.pointSize * 1.5;
    }

    var rectX = cursor.x + selectedStyle.paddingLeft;

    // Set the text property from the default or data attribute
    var tfText = "";
    var data = getStringAttribute("data", true);
    var value = getDataValue(data, true);
    var defaultParam = getStringAttribute("default",false);
    var useDefaultsOnThisInput = false; ///useDefaults;

    //if ([self.formType == "Edit"] && value.length == 0  && defaultParam.length > 0)  useDefaultsOnThisInput = YES;
    if (defaultParam.length == 0) useDefaultsOnThisInput = false;

    //var refreshValue = [EBxml xmlData:[EBUtil removeTableName:data] usingXML:formRefreshXMLData];
    //if (formRefresh && refreshValue.length > 0) useDefaultsOnThisInput = NO;

    if (useDefaultsOnThisInput) {

        // Defaults of last and next and merged into the data spec - i.e. 'next' --> 'inspection.next.inspectionNumber'
        // Which is then interpreted in the model method (i.e. in Inspection.m
        if (defaultParam.toLowerCase() == "last") {
            defaultParam = replaceAll(defaultParam,".",".last."); // [data stringByReplacingOccurrencesOfString:"." withString:".last."];

        } else if (defaultParam.toLowerCase() == "next") {
            //defaultParam = [data stringByReplacingOccurrencesOfString:"." withString:".next."];
            defaultParam = "next";

        } else if (defaultParam.toLowerCase == "today") {
            //NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
            //[dateFormat setDateFormat:"MMM d yyyy"];
            //defaultParam = [dateFormat stringFromDate:[NSDate date]];
            defaultParam = "today";

        } else if (defaultParam.toLowerCase == "todaymmddyy") {
            //NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
            //[dateFormat setDateFormat:"MM/dd/yy"];
            //defaultParam = [dateFormat stringFromDate:[NSDate date]];
            defaultParam = "todaymmddyy";

        } else if (defaultParam.toLowerCase == "now") {
            //NSDateFormatter *timeFormat = [[NSDateFormatter alloc] init];
            //[timeFormat setDateFormat:"HH:mm"];
            //[timeFormat setDateFormat:"hh:mm a"];
            //defaultParam = [timeFormat stringFromDate:[NSDate date]];
            defaultParam = "now";
        }
        tfText = getDataValue(defaultParam, true);

        //} else if (formRefresh) {
        //    tfText = refreshValue;

        //} else if (![self.formType == "Add"]) {
        //    tfText = value;
    }

    if (tfText == undefined) tfText = "";  // Replace nil with empty string

    tfFontName = selectedStyle.fontName;
    tfFontSize = selectedStyle.fontSize;
    var tfTextColor = selectedStyle.fontColor;
    var tfBackgroundColor = selectedStyle.fillColor;

    var disabledVal = getStringAttribute("disabled", false);
    var disabled = false;
    if (disabledVal.length > 0) disabled = (disabledVal == "Yes");

    //if (!enabled || disabled) {
    //   tfBackgroundColor = selectedStyle.displayFillColor;
    //}

    ///var tfAutoresizingMask = autoresizingMask;
    ///var tfBorderStyle = UITextBorderStyleRoundedRect;
    ///var tfEnabled = (enabled && !disabled);

    cursor.x += selectedStyle.paddingLeft + rectWidth + selectedStyle.paddingRight;

    var validation = getStringAttribute("validation",false);
    ///var relatedControl = getStringAttribute("relatedcontrol",false);
    options = getStringAttribute("options",false);
    if (options.length > 0) options = getDataValue(options);
    if (validation.length > 0) validation = getDataValue(validation,false);
    if (false) { ///activeEditRegion.length > 0) {
        inputControls.push({
            FieldName: data,
            FieldType: "TextBox",
            OriginalValue: tfText,
            Options: options,
            Validation: validation,
            /// RelatedControl: relatedControl,
            ///ListKey: controlListKey,
            ///EditRegionName: activeEditRegion,
            ///EditRegionLine: activeEditRegionLine
        });

    } else {
        inputControls.push({
            FieldName:data,
            FieldType:"TextBox",
            OriginalValue:tfText,
            Options:options,
            Validation:validation,
            ///RelatedControl:relatedControl,
            ///ListKey:controlListKey
        });
    }

    tfAlignment = "Left";
    tfTag = nextTagToAssign;
    tfAccessibilityHint="Test";
    tfHidden = (hidden == "Yes");
    nextTagToAssign += 1;

    // If options provided, display a select list button.
    var options = getStringAttribute("options",false);

    options = options.trim();
    if (options != "" && options != "-") {
        options = getDataValue(options, true);
        if (options[0] == "#") {
            alert("Invalid options=" + options);
            return;
        }

        if (!options.substring(0,3) == ".csv") {
            var temp = options.split(",");
            //if (temp.count < 2 && options != "Accounts" && options != "Devices" &&
            //    options.hasPrefix("Inspections ") && ![options.hasPrefix:"Projects "] && ![options.hasPrefix("Files") && ![options hasPrefix:"Unique project."]) {
            //    alert("Invalid options=" + options + ".\nAt least 2 options required.");
            //}
        }
        //var textBoxName = getStringAttribute("data", true);
        //drawSelectListButtonForTextBox(textBoxName);
    }

    var html = "<input type='textbox' style='position:absolute; top:#y#px; left:#x#px; height:30px; width:100px; font-size: 16px;'>#data#</input>";
    html = html.replace("#x#", cursor.x).replace("#y#",cursor.y).replace("#data#",tfText);
    $("#test1").append(html);
}


function drawCheckBox() {
    var data = getStringAttribute("data", true);
    var value = getDataValue(data, true);
    var associatedValue = getStringAttribute("associatedvalue", false);
    var disabled = getStringAttribute("disabled", false);
    disabled = getDataValue(disabled);

    if (value == undefined) value = "";

    var defaultParam = getStringAttribute("default", false);
    if (defaultParam == undefined) defaultParam = false;
    var useDefaultsOnThisInput = useDefaults;
    if (defaultParam == undefined0) useDefaultsOnThisInput = false;
    if (useDefaultsOnThisInput && !formRefresh) {

        // Default of last is merged into the data spec - i.e. 'next' --> 'inspection.next.inspectionNumber'
        // Which is then interpreted in the model method (i.e. in Inspection.m)
        if (defaultParam.toLowerCase() == "last") {
            ///defaultParam = [data stringByReplacingOccurrencesOfString:@"." withString:@".last."];
        }
        value = getDataValue(defaultParam, false);

    } else if (formRefresh) {
        //value = [EBxml xmlData:[EBUtil removeTableName:data] usingXML:formRefreshXMLData];
    }

    //CheckBox *chk = [[CheckBox alloc] initWithFrame:CGRectMake(cursor.x, cursor.y-6, 40, 30) AndEnabled:enabled];
    //[chk setID:0 AndSelected:[EBUtil stringEqual:value to:@"Yes"] AndTitle:@"" ];
    if (activeEditRegion.length > 0) {
        inputControls.push({
            FieldName:data,
            FieldType:"CheckBox",
            OriginalValue:value,
            AssociatedValue:associatedValue,
            EditRegionName:activeEditRegion,
            EditRegionLine:activeEditRegionLine
        });
    } else {
        inputControls.push({
            FieldName:data,
            FieldType:"CheckBox",
            OriginalValue:value,
            AssociatedValue:associatedValue
        });
    }

    var chkTag = nextTagToAssign;
    var chkClearControls   = getStringAttribute("clearcontrols", false);
    var chkDisableControls = getStringAttribute("disablecontrols", false);
    var chkEnableControls  = getStringAttribute("enablecontrols", false);
    ///if (disabled == "Yes"]) [chk disable];

    nextTagToAssign += 1;
    cursor.x += 40;
}

function drawMemoControl() {
    var tv = {};
    drawControlLabel();
    // Determine the width and create the control
    // width is set to the Width in the directive, from the style, or 2".

    var style = getStringAttribute("style", false);
    if (style == "") style = "DefaultControlStyle";

    var selectedStyle = controlStyles[style];
    if (selectedStyle != undefined) {
        msg = "ControlStyle '" +style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawMemoControl");
        return;
    }
    var width = getFloatAttributeInPoints("width", true);
    var height = getFloatAttributeInPoints("height", true);
    var rectX = cursor.x + selectedStyle.paddingLeft;
    //UITextView *tv = [[UITextView alloc] initWithFrame: CGRectMake(rectX, cursor.y, width, height)];
    tv.BorderColor = "Black";
    tv.BorderWidth = 2.;

    // Set the text property from the default or data attribute

    var data = getStringAttribute("data", true);

    if (useDefaults && !formRefresh) {
        var defaultParam = getStringAttribute("default", false);
        // Defaults of last and next are merged into the data spec - i.e. 'next' --> 'inspection.next.inspectionNumber'
        // Which is then interpretted in the model method (i.e. in Inspection.m
        if (defaultParam.toLowerCase == "last") {
            defaultParam = replaceAll(defaultParam,".", ".last.");
        }
        tv.text = getDataValue(defaultParam, true);

    } else if (formRefresh) {
        ///tv.text = [EBxml xmlData:[EBUtil removeTableName:data] usingXML:formRefreshXMLData];

    } else {
        tv.text = getDataValue(data, true);
    }
    if (!tv.text) tv.text="";  // Replace nulls

    tv.fontName = selectedStyle.fontName;
    tv.fontSize = selectedStyle.fontSize;
    tv.textColor = selectedStyle.fontColor;
    tv.backgroundColor = selectedStyle.fillColor;
    if (!enabled) {
        tv.BackgroundColor = selectedStyle.displayFillColor;
    }

    //cursor.x += selectedStyle.paddingLeft + rectWidth + selectedStyle.paddingRight;

    var validation = getStringAttribute("validation", false);
    if (validation.length > 0) validation = getDataValue(validation, false);
    inputControls.push({
        FieldName:data,
        FieldType:"Memo",
        OriginalValue:tv.text,
        Validation:validation
    });

    tv.textAlignment = "Left";
    tv.tag = nextTagToAssign;
    tv.editable = enabled;
    tv.scrollEnabled = !(getStringAttribute("scrolling", false) == "No");
    tv.showsVerticalScrollIndicator = tv.scrollEnabled;

    nextTagToAssign += 1;
    //[view addSubview: tv];

    // If selectMemoSet provided, display a select button.

    var selectMemoSetName = getStringAttribute("selectmemoset", false);
    selectMemoSetName = selectMemoSetName.trim();
    if (selectMemoSetName != "" && selectMemoSetName !="-" && formType != "Display") {
        if (selectMemoSets[selectMemoSetName] == undefined) {
            var msg = "Invalid SelectMemoSetName ='" + selectMemoSetName + "'";
            displayErrorMessage(msg);

        } else {
            /// var cursor.xSave = cursor.x;
            var memoName = getStringAttribute("data", true);
            cursor.x += width + 10;
            drawSelectListButtonForMemo(memoName, selectMemoSetName);
            /// cursor.x = cursor.xSave;
        }
    }
}

/*

function drawCanvasControl() {
    var width               = getFloatAttributeInPoints("width", true);
    var height              = getFloatAttributeInPoints("height", true);
    var markupData          = getStringAttribute("markupdata", true);
    var markupValue         = getDataValue(markupData, true);
    var markupDataViewOnly  = getStringAttribute("markupdataviewonly", false);
    var markupValueViewOnly = getDataValue(markupDataViewOnly, false);
    var markupDataViewOnly2 = getStringAttribute("markupdataviewonly2", false);
    var markupValueViewOnly2= getDataValue(markupDataViewOnly2, false);
    var image               = getStringAttribute("image", false);
    var canvasStyle         = getStringAttribute("canvasStyle", false);
    var drawingStyle        = getStringAttribute("drawingStyle", false);
    var fillColorMacro      = getStringAttribute("fillcolormacro", false);
    var doNottIncludeMacro= getStringAttribute("doNottIncludeMacro", false);
    var dynamicSymbols      = getStringAttribute("dynamicsymbols", false);
    var drawingTools        = getStringAttribute("drawingtools", false);
    var drawPhotoLocations  = getStringAttribute:"drawphotolocations", false) == "true";
    var editMode = getStringAttribute("editmode", false) == "true";
    var symbols1 = getStringAttribute("symbols", false);
    symbols1 = getDataValue(symbols1, false);
    var symbols = (symbols1 == "Yes");
    var directions = getStringAttribute("photodirections", false);
    var photoDirections = (directions == "Yes");

    // Set Styles
    if (canvasStyle == "") canvasStyle = "DefaultCanvasStyle";
    var selectedStyle1 = canvasStyles[canvasStyle];
    if (selectedStyle1 == undefined) {
        var msg = "CanvasStyle '" + canvasStyle + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawCanvasControl");
        return;
    }

    if (drawingStyle == "") drawingStyle = "DefaultDrawingStyle";
    var selectedStyle2 = drawingStyles[drawingStyle];
    if (!selectedStyle2) {
        var msg = "DrawingStyle '" + drawingStyle + ' not defined";
        displayErrorMessage(msg, "Directive error - DrawDrawingControl");
        return;
    }

    var canvas = {}; // initWithFrame:CGRectMake(cursor.x, cursor.y, width, height)];
    canvas.viewController = viewController;
    canvas.menu           = (formType != "Display");
    canvas.canvasStyle    = selectedStyle1;
    canvas.drawingStyle   = selectedStyle2;
    canvas.fillColorMacro = fillColorMacro;
    canvas.doNottIncludeMacro = doNottIncludeMacro;
    canvas.drawPhotoLocations = drawPhotoLocations;
    canvas.photoDirections = photoDirections;
    canvas.symbols = symbols;
    canvas.drawingTools = drawingTools;
    canvas.generator = self;
    if (drawPhotoLocations) {
        canvas.photos =  inspection.photos; //[EBUtil sortPhotoSet:inspection.photos];
    }
    if (formType == "Display") {
        canvas.editMode = false;
    } else {
        canvas.editMode = editMode;

    }

    // Set arrow style from Settings--> Photo form
    canvas.arrowStyle = "Normal"; //arrowStyles[ objectForKey:[device xmlPhotoData:"PhotoMarkupArrowStyle"]];

    // Get the image, if defined
    var imageFilename = "";
    var filePath = "";
    if (image.length > 0) {
        imageFilename = getDataValue(image, true);
        ///var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
        ///filePath = [NSString stringWithFormat:"%@/Photos/%",paths[0],imageFilename];
    }

    // Set Default markup if 'last' requested
    canvas.markupData = markupValue;
    canvas.markupDataViewOnly = markupValueViewOnly;
    canvas.markupDataViewOnly2 = markupValueViewOnly2;
    if (dynamicSymbols.length) {
        canvas.dynamicSymbols = dynamicSymbols;
    }

    if (formType == "Add") {
        // The image, markupData and viewonlyMarkupData is cleared if from the same table
        var currentTable =[EBUtil tableName:markupData];
        if ([EBUtil tableName:image] == currentTable) {filePath = ""; imageFilename = "";}
        if ([EBUtil tableName:markupValueViewOnly] == currentTable) canvas.markupDataViewOnly = "";
        if ([EBUtil tableName:markupValueViewOnly2] == currentTable) canvas.markupDataViewOnly2 = "";

        var defaultParam =getStringAttribute("default", false);
        var defaultSet = false;
        if (defaultParam.length > 0)  {
            if (defaultParam.isEqual("last")) {
                var lastField = replaceAll(markupData,".");
                canvas.markupData =getDataValue(lastField);
                defaultSet = true;
            }
        }
        if (!defaultSet) canvas.markupData = "";
    }
    if (filePath.length > 0) {
        canvas.image = [UIImage imageWithContentsOfFile:filePath];
    }
    [canvas drawControl];

    [inputControls addObject:@{"FieldName":markupData,"ImageFieldName":image,"ImageFilename":imageFilename}];
    canvas.tag = nextTagToAssign;
    [view addSubview: canvas];

    nextTagToAssign += 1;

    cursor.x = marginLeft + indentLeft;
    cursor.y += canvas.menuHeight + canvas.canvasHeight + 36;   // falset sure why the 36 is required

    CGSize s;
    s.height = MAX(view.contentSize.height, cursor.y + 200);
    s.width = view.contentSize.width;
    view.contentSize = s;
}

function drawButton() {
    var width         = getFloatAttributeInPoints("width", true);
    var height        = getFloatAttributeInPoints("height", false);
    if (height < 10 || height > 150) height = 50;
    var title         = getStringAttribute("title", true);
    var value         = getStringAttribute("value", false);
    var requestNumber = getStringAttribute("requestnumber", false);

    var style         = getStringAttribute("style", false);
    if (style == "") style = "DefaultControlStyle";

    var selectedStyle = controlStyles[style];
    if (!selectedStyle) {
        var msg = "ControlStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawButton");
    }

    value = getDataValue(value, false);
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    btn.frame = CGRectMake(cursor.x, cursor.y, width, height);
    [btn setTitle:title forState:(UIControlState)UIControlStatefalsermal];
    //[btn setTitleColor: [UIColor grayColor]  forState:(UIControlState) UIControlStatefalsermal];
    //btn.showsTouchWhenHighlighted = true;
    //btn.reversesTitleShadowWhenHighlighted = true;
    btn.accessibilityIdentifier = value;

    btn.tag = nextTagToAssign;
    nextTagToAssign += 1;
    [view addSubview: btn];

    [btn addTarget:self action:@selector(buttonRequest:)  forControlEvents:(UIControlEvents)UIControlEventTouchDown];

    [inputControls addObject:@{"FieldName":title, "FieldType":"Button", "RequestNumber":requestNumber, "ExecuteXML":activeEnclosedXML}];

    if (autoNewLineSpacing > 0) {
        cursor.x = marginLeft + indentLeft;
        cursor.y += height * 1.1 * autoNewLineSpacing;
    } else {
        cursor.x += width + 10;
    }
}


function shiftFormAfter(startm dist) {

    //for (UIView *v in view.subviews) {
    var fieldName = "";
    //if ([v isKindOfClass:[UITextField class]]) {
    fieldName = inputControls[v.tag]["FieldName"];
    //}

    //CGRect r = v.frame;
    if (r.origin.y > start) {
        r.origin.y += dist;
        v.frame = r;
    }
    //}

}
 */