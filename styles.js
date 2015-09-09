
"use strict";

var controlStyles = {};
var textStyles = {};
var lineStyles = {};
var boxStyles = {};
var arrowStyles = {};
var canvasStyles = {};
var drawingStyles = {};


function setDefaultStyles() {

    var mColor = 230. / 255.;
    controlStyles.DefaultControlStyle = {
        fontName: "Helvetica",
        fontSize: 14,
        fontColor: "black",
        fillColor: "white",
        displayFillColor: "", //[[UIColor alloc] initWithRed:mColor green:mColor blue:mColor alpha:1]
        height: 30,
        width: 200,
        align: "Left",
        borderlineWidth: 1,
        borderlineColor: "black",
        paddingLeft: .2,
        paddingRight: 0
    };

    textStyles.DefaultTextStyle = {
        fontName: "Helvetica",
        fontSize: 14,
        fontColor: "black",
        backgroundColor: "clear",
        width: 0,
        align: "Left",
        underline: false,
        paddingLeft: 0,
        paddingRight: 0
    };

    textStyles.DefaultLabelStyle = {
        fontName: "ArialMT",
        fontSize: 18,
        fontColor: "black",
        backgroundColor: "clear",
        width: 4,
        align: "Left",
        underline: false,
        paddingLeft: 0,
        paddingRight: 0
    };

    lineStyles.DefaultLineStyle = {
        width: 1,
        color: "black"
    };

    boxStyles.DefaultBoxStyle = {
        lineWidth: 1,
        lineColor: "black",
        fillColor: "clear",
        fillPattern: false,
    };

    arrowStyles.DefaultArrowStyle = {
        lineWidth: 2,
        arrowLength: 35,
        arrowIndent: 10,
        arrowWidth: 10
    };

    canvasStyles.DefaultCanvasStyle = {
        backgroundColor: "white",
        borderWidth: 2,
        borderColor: "black",
        allowCamera: false,
        allowImport: false,
        allowMaps: false,
    };

    drawingStyles.DefaultDrawingStyle = {
        lineColor: "black",
        lineWidth: 2,
        fillColor: "yellow",
        fillPattern: false,
        blend: false,
        selectorColor: "blue"
    };
}

function defineControlStyle() {
    var name = getStringAttribute("name", true);
    controlStyles[name] = {
        fontName: getStringAttribute("fontname", true),
        fontSize: getIntAttribute("fontsize", true),
        fontColor: getColorAttribute("fontcolor", "Black"),
        fillColor: getColorAttribute("fillcolor", "Clear"),
        displayFillColor: getColorAttribute("displayfillcolor", "230,230,230"),
        height: getFloatAttributeInPoints("height", true),
        width: getFloatAttributeInPoints("width", true),
        align: getStringAttribute("align", false),
        borderlineWidth: getIntAttribute("borderlinewidth", true),
        borderlineColor: getColorAttribute("borderlinecolor", "Black"),
        paddingLeft: getFloatAttributeInPoints("paddingleft", false),
        paddingRight:getFloatAttributeInPoints("paddingright", false)
    };
}

function defineTextStyle() {
    var name = getStringAttribute("name", true);
    textStyles[name] = {
        name: name,
        fontName: getStringAttribute("fontname", true),
        fontSize: getIntAttribute("fontsize", true),
        fontColor: getColorAttribute("fontcolor", "Black"),
        backgroundColor: getColorAttribute("backgroundcolor", "Clear"),
        align: getStringAttribute("align"),
        underline: getStringAttribute("underline").isEqual("Yes"),
        width: getFloatAttributeInPoints("width", false),
        paddingLeft: getFloatAttributeInPoints("paddingleft", false),
        paddingRight: getFloatAttributeInPoints("paddingright", false)
    };
}

function defineLineStyle() {
    var name = getStringAttribute("name", true);
    lineStyles[name] = {
        width: getFloatAttribute("width", true),
        color: getColorAttribute("color", "black")
    };
}

function defineBoxStyle() {
    var name = getStringAttribute("name", true);
    boxStyles[name] = {
        lineWidth: getFloatAttribute("linewidth", true),
        lineColor: getColorAttribute("linecolor", "Black"),
        fillColor: getColorAttribute("fillcolor", "White")
    };
}

function defineArrowStyle() {
    var name = getStringAttribute("name", true);
    arrowStyles[name] = {
        lineWidth: getIntAttribute("LineWidth", true),
        arrowLength: getIntAttribute("ArrowLength", true),
        arrowIndent: getIntAttribute("ArrowIndent", true),
        arrowWidth: getIntAttribute("ArrowWidth", true)
    };
}

function defineCanvasStyle() {
    var name = getStringAttribute("name", true);
    canvasStyles[name] = {
        backgroundColor: getColorAttribute("backgroundcolor","White"),
        borderWidth: getIntAttribute("borderwidth", false, 2),
        borderColor: getColorAttribute("bordercolor","Black"),
        allowCamera: getStringAttribute("allowcamera", false).isEqual("Yes"),
        allowImport: getStringAttribute("allowimport", false).isEqual("Yes"),
        allowMaps: getStringAttribute("allowmaps", false).isEqual("Yes"),
        allowFillOnly: getStringAttribute("allowfillonly", false).isEqual("Yes"),
        allowMarkup: getStringAttribute("allowmarkup", false).isEqual("Yes")
    };
}

function defineDrawingStyle() {
    var name = getStringAttribute("name", true);
    drawingStyles[name] = {
        name: name,
        lineColor: getColorAttribute("linecolor","Black"),
        lineWidth: getIntAttribute("linewidth", false, 2),
        fillColor: getColorAttribute("fillcolor","Yellow"),
        fillPattern: getStringAttribute("fillpattern", false).isEqual("Yes"),
        textColor: getColorAttribute("textcolor","Black"),
        selectorColor: getColorAttribute("selectorcolor","Blue"),
        blend: getStringAttribute("transparent", false).isEqual("Yes"),
        fontName: getStringAttribute("fontname", false),
        fontSize: getIntAttribute("fontsize", false)
    };
}
