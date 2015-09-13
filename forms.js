
"use strict";


function drawLabel() {
    var style = getStringAttribute("style", false);
    var data = getStringAttribute("data", true);
    var width = getFloatAttributeInPoints("width", false);
    drawLabel2(data, style, width);
}

// drawLabel2 is used for the <DrawLabel> directive and <DrawTextBox label='xxx' .../>
function drawLabel2(data, style, width) {

    // Attributes:  x,y,height,width,fontName,fontSize,align
    var html = "<div style='position:absolute; top:#y#px; left:#x#px; height:#height#px; width:#width#px; " +
        "font-family:#fontName# font-size:#fontSize#px;color:blue; text-align:#align#; border:1px solid;'>#text#</div>";

    var ctl = {};
    if (style == undefined) style = "";
    if (style == "") style = "DefaultTextStyle";
    var selectedStyle = textStyles[style];
    if (selectedStyle == undefined) {
        var msg = "TextStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawLabel");
        return;
    }

    ctl.text = getDataValue(data, true);
    ctl.text = addPrefixAndSuffix(ctl.text);
    ctl.width = width;

    if (selectedStyle.width > 0) ctl.width = selectedStyle.width;
    if (ctl.width == 0) ctl.width = 1*72;         // ********** Should be revised to set to actual width ************

    ctl.width = ctl.width - selectedStyle.paddingLeft - selectedStyle.paddingRight;
    ctl.height = ctl.fontSize * .8; //1.4;
    ctl.x = cursor.x + selectedStyle.paddingLeft;
    ctl.y = cursor.y;
    ctl.fontName = "Arial";
    ctl.fontSize = "8";
    ctl.align = selectedStyle.align;

    $("#formtest").append(replaceAttributes(html, ctl));
    cursor.x += selectedStyle.paddingLeft + ctl.width + selectedStyle.paddingRight;
}

function drawTextBox() {

    var labelStyle = "DefaultLabelStyle";
    var labelData = getStringAttribute("label", false);
    var labelWidth = getFloatAttributeInPoints("labelWidth", false);
    if (labelData.length > 0) {
        drawLabel2(labelData, labelStyle, labelWidth);
        cursor.x += labelWidth;
    }

    // Attributes:  x,y,height,width,fontName,fontSize,align
    var html = "<input type='textbox' style='position:absolute; top:#y#px; left:#x#px; height:#height#px; width:#width#px; " +
               "font-size: #fontSize#px;'>#data#</input>";

    var ctl = {};
    var style = getStringAttribute("style", false);
    if (style == undefined) style = "";
    if (style == "") style = "DefaultControlStyle";
    var selectedStyle = controlStyles[style];
    if (selectedStyle == undefined) {
        var msg = "ControlStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawTextBox");
        return;
    }

    var data = getStringAttribute("data", true);
    ctl.text = getDataValue(data, true);
    ctl.text = addPrefixAndSuffix(ctl.text);
    ctl.width = getFloatAttributeInPoints("width", false);

    if (selectedStyle.width > 0) ctl.width = selectedStyle.width;
    if (ctl.width == 0) ctl.width = 1*72;         // ********** Should be revised to set to actual width ************

    ctl.width = ctl.width - selectedStyle.paddingLeft - selectedStyle.paddingRight;
    ctl.height = ctl.fontSize * .8; //1.4;
    ctl.x = cursor.x + selectedStyle.paddingLeft;
    ctl.y = cursor.y;
    ctl.fontName = "Arial";
    ctl.fontSize = "8";
    ctl.align = selectedStyle.align;
    html = replaceAttributes(html, ctl);
    $("#formtest").append(html);
    cursor.x += selectedStyle.paddingLeft + ctl.width + selectedStyle.paddingRight;
}

function drawCheckBox() {



}

function drawMemoControl() {
    // Attributes:  x,y,height,width,fontName,fontSize,border

    var html = "<textArea style='position:absolute; top:#y#px; left:#x#px; height:#height#px; width:#width#px; " +
        "font-family:#fontName# font-size:#fontSize#px;color:blue; border:1px solid;'>#text#</textArea>";
    
    var ctl = {};
    var style = getStringAttribute("style", false);
    if (style == undefined) style = "";
    if (style == "") style = "DefaultTextStyle";
    var selectedStyle = textStyles[style];
    if (selectedStyle == undefined) {
        var msg = "TextStyle '" + style + "' not defined";
        displayErrorMessage(msg, "Directive error - DrawLabel");
        return;
    }

    var data = getStringAttribute("data", true);
    ctl.text = getDataValue(data, true);
    ctl.text = addPrefixAndSuffix(ctl.text);

    ctl.x = cursor.x + selectedStyle.paddingLeft;
    ctl.y = cursor.y;

    ctl.width = getFloatAttributeInPoints("width", false);
    if (selectedStyle.width > 0 && ctl.width == 0) ctl.width = selectedStyle.width;
    if (ctl.width == 0) ctl.width = 6*72;  // Default width is 6"
    ctl.width = ctl.width - selectedStyle.paddingLeft - selectedStyle.paddingRight;

    ctl.height = getFloatAttributeInPoints("height", false);
    if (ctl.height == 0) ctl.height = 4*72;  // Default height is 4"

    ctl.fontName = selectedStyle.fontName;
    ctl.fontSize = selectedStyle.fontSize;
    ctl.color = selectedStyle.fontColor;

    ctl.align = selectedStyle.align;
    html = replaceAttributes(html, ctl);
    $("#formtest").append(html);
    cursor.x += margin.left + indent.left;
    cursor.y += ctl.height + 72/4;
}

function drawCanvasControl() {

    // Attributes:  x,y,height,width

    var html = "<div style='position:absolute; top:#y#px; left:#x#px; height:#height#px; width:#width#px; border:1px solid;'></div>";
    var ctl = {};

    ctl.x = cursor.x;
    ctl.y = cursor.y;

    ctl.width = getFloatAttributeInPoints("width", false);
    if (ctl.width == 0) ctl.width = 6*72;  // Default width is 6"
    ctl.width = ctl.width - selectedStyle.paddingLeft - selectedStyle.paddingRight;

    ctl.height = getFloatAttributeInPoints("height", false);
    if (ctl.height == 0) ctl.height = 4*72;  // Default height is 4"

    html = replaceAttributes(html, ctl);
    $("#formtest").append(html);
    cursor.x += margin.left + indent.left;
    cursor.y += ctl.height + 72/4; // Move cursor to 1/4" after canvas
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

function replaceAttributes(html, obj) {
    var keys = Object.keys(obj);
    for (var iKey in keys) {
        var key = keys[iKey];
        html = html.replace("#" + key + "#" ,obj[key]);
    }
    return html;
}
