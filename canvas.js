"use strict";

/*
 Canvas

 Rendering
 Circle - open and filled.
 Square - open and filled.
 Polygon - open and filled.
 Arrow.
 Photo Locn.
 Direction indicator.

 Drawing
 Point capture.


 */

/*
var arrowStyles = {};
arrowStyles.Normal = {
    name: "Normal",
    lineWidth: 3,
    arrowLength: 35,
    arrowIndent: 10,
    arrowWidth: 10
};

arrowStyles.Large = {
    name: "Large",
    lineWidth: 10,
    arrowLength: 70,
    arrowIndent: 0,
    arrowWidth: 20
};

var canvasStyles = {};
canvasStyles.ImportAllObjects = {
    name: "ImportAllObjects",
    borderWidth: 1,
    borderColor: "Black",
    allowMaps: false,
    allowImport: true,
    allowFillOnly: false,
    allowMarkup: true
};

var drawingStyles = {};
drawingStyles.Urgent = {
    name: "Urgent",
    lineWidth: 1,
    lineColor: "Black",
    fillColor: "Red",
    transparent: true,
    fillPattern: false,
    textColor: "Black",
    selectorColor: "Yellow",
    fontName: "",
    fontSize: 0
};
drawingStyles.Maintenance = {
    name: "Maintenance",
    lineWidth: 1,
    lineColor: "Black",
    fillColor: "Blue",
    transparent: true,
    fillPattern: false,
    textColor: "Black",
    selectorColor: "Yellow",
    fontName: "",
    fontSize: 0
};
drawingStyles.Progress = {
    name: "Progress",
    lineWidth: 1,
    lineColor: "Black",
    fillColor: "Yellow",
    transparent: true,
    fillPattern: false,
    textColor: "Black",
    selectorColor: "Yellow",
    fontName: "",
    fontSize: 0
};
drawingStyles.Arial20 = {
    name: "Arial20",
    lineWidth: 2,
    lineColor: "Clear",
    fillColor: "Clear",
    transparent: true,
    fillPattern: false,
    textColor: "Yellow",
    selectorColor: "Black",
    fontName: "Arial-BoldMT",
    fontSize: 20
};

var drawingStyle = drawingStyles.Maintenance;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

canvasTests();

var points = [];

function arrowTests() {
    var arrowStyle = arrowStyles.Normal;
    drawArrow({x: 10, y: 10}, {x: 200, y: 350});
    var arrowStyle = arrowStyles.Large;
    drawArrow({x: 100, y: 10}, {x: 420, y: 350});
}

function polygonTests() {
    var p1 = {x: 167, y: 280};
    var p2 = {x: 204, y: 282};
    var p3 = {x: 219, y: 308};
    var p4 = {x: 197, y: 336};
    var p5 = {x: 155, y: 338};
    var p6 = {x: 132, y: 301};
    ctx.globalAlpha = 0.4;
    drawPolygon([p1, p2, p3, p4, p5, p6]);

    var p1 = {x: 67, y: 120};
    var p2 = {x: 104, y: 122};
    var p3 = {x: 119, y: 188};
    var p4 = {x: 97, y: 236};
    var p5 = {x: 55, y: 238};
    var p6 = {x: 32, y: 201};
    ctx.globalAlpha = 1;
    drawPolygon([p1, p2, p3, p4, p5, p6]);
}

function canvasTests() {
    ctx.beginPath();
    ctx.arc(100, 75, 50, 0, 2 * Math.PI);
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "yellow";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    return;

    // Drawing lines
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 2;
    ctx.moveTo(10, 10);
    ctx.lineTo(100, 100);
    ctx.lineTo(100, 50);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    ctx.moveTo(100, 10);
    ctx.lineTo(200, 100);
    ctx.lineTo(200, 50);
    ctx.stroke();
    ctx.closePath();

    // Drawing shapes
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.fillStyle = "yellow";
    ctx.lineWidth = 1;
    ctx.moveTo(200, 10);
    ctx.lineTo(300, 100);
    ctx.lineTo(300, 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function addPoint(tapPoint) {

    if (this.type == "Arrow" && this.points.length > 1) return;
    if (this.type == "Circle" && this.points.length > 1) return;
    if (this.type == "Square" && this.points.length > 3) return;
    if (this.type == "Text" && this.points.length > 3) return;
    if (this.type == "PhotoLocn" && this.points.length > 0) return;

    if (this.type == "Square")        addPointSquare(tapPoint);
    if (this.type == "Text")          addPointSquare(tapPoint);
    if (this.type == "Rect")          addPointRect(tapPoint);
    if (this.type == "Polygon")       addPointPolygon(tapPoint);
    if (this.type == "Arrow")         addPointArrow(tapPoint);
    if (this.type == "Circle")        addPointCircle(tapPoint);
    if (this.type == "PhotoLocn")     addPointPhotoLocn(tapPoint);
    if (this.type == "Symbol")        addPointSymbol(tapPoint);
    if (this.type == "DynamicSymbol") addPointDynamicSymbol(tapPoint);
}

function addPointSquare(tapPoint) {

    // If this is not the 1st point, then force the line to vertical or horizontal
    var vertical;
    if (this.points.length > 0) {
        var last = points[points.length - 1];
        var diffX = Math.abs(tapPoint.x - last.x);
        var diffY = Math.abs(tapPoint.y - last.y);
        if (diffX > diffY) {
            tapPoint = {x: tapPoint.x, y: last.y};
            vertical = false;
        } else {
            tapPoint = CGPointMake(last.x, tapPoint.y);
            vertical = true;
        }
    }

    ///[this.points addObject

    ///[NSValue valueWithCGPoint

    ///tapPoint


    // If this is the 3rd point, then create a 4th
    if (this.points.length == 3) {
        // Add the 4th point when the 3rd this.points is added.
        var p1 = points[0];
        var lastPoint;
        if (vertical) {
            lastPoint = {x: p1.x, y: tapPoint.y};
        } else {
            lastPoint = {x: tapPoint.x, y: p1.y};
        }
        points.push(tapPoint);
    }
}

function addPointRect(tapPoint) {

    // If this is not the 1st point, then force the line to vertical or horizontal

    if (this.points.length > 0) {
        var vertical;
        var last = points[points.length - 1];
        var diffX = Math.abs(tapPoint.x - last.x);
        var diffY = Math.abs(tapPoint.y - last.y);
        if (diffX > diffY) {
            tapPoint = {x: tapPoint.x, y: last.y};
            vertical = false;
        } else {
            tapPoint = CGPointMake(last.x, tapPoint.y);
            vertical = true;
        }
    }
    points.push(tapPoint);
}

function addPointPolygon(tapPoint {
    points.push(tapPoint);
}

function addPointCircle(tapPoint {
    // The second point (circle edge) is forced to same y
    if (this.points.length == 1) {
        var p1 = points[0];
        tapPoint = CGPointMake(tapPoint.x, p1.y);
        var radius = ABS(tapPoint.x - p1.x);

        // Ignore the tap if the radius is less than 10.
        if (radius < 10) {
            return;
        }
    }
    points.push(tapPoint);
}

function addPointArrow(tapPoint) {
    points.push(tapPoint);
}

function addPointPhotoLocn(tapPoint) {
    points.push(tapPoint);
}

function addPointSymbol(tapPoint) {
    points.push(tapPoint);
}

function addPointDynamicSymbol(tapPoint) {
    points.push(tapPoint);
}

function moveToOrigin(origin) {
    for (var n = 0; n < this.points.length; n++) {
        var p = points[n];
        p.x += origin.x;
        p.y += origin.y;
        points[n] = p;
    }
}

function drawPolygon(points) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.fillStyle = "yellow";
    //ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    //ctx.globalAlpha = 0.4;
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 0; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function draw() {
    if (points.length == 0) return;
    ctx.lineWidth = drawingStyle.lineWidth;
    ctx.strokeStyle = drawingStyle.lineColor;

    if (this.fill || this.type == "Text") {
        if (this.drawingStyle.fillPattern) {
            //CGContextSetFillColorWithColor(currentContext, [[UIColor colorWithPatternImage:[UIImage imageNamed:"FillPattern.png"]] CGColor]);
        } else {
            //CGContextSetFillColorWithColor(currentContext, this.drawingStyle.fillColor.CGColor);
        }

    } else {
        ctx.fillColor = "clear";
    }

    if (this.drawingStyle.blend) {
        //CGContextSetBlendMode(currentContext, kCGBlendModeMultiply);
    } else {
        //CGContextSetBlendMode(currentContext, kCGBlendModeNormal);
    }

    if (this.type == "Circle") {
        if (this.points.length == 2) {
            drawCircleAtPoint(points[0], Math.abs(points[0].x - points[1].x));
        }
        drawSelectors();

    } else if (this.type == "Arrow") {
        if (this.points.length == 2) {
            drawArrow();
        }
        drawSelectors();

    } else if (this.type == "PhotoLocn") {
        drawPhotoLocn();

    } else if (this.type == "Symbol") {
        drawSymbol();

    } else if (this.type == "DynamicSymbol") {
        drawDynamicSymbol();

    } else {  // Square, Rectangle, Polygon, Text
        moveToPoint(points[0]);
        for (var n = 1; n < this.points.length; n++) {
            drawLineToPoint(points[n]);
        }
        if (this.points.length > 2) ctx.closePath();
        ;
        //[self render];

        if ([this.type == "Text"] && (this.drawingPDF || !this.allowMove) && this.points.length > 2) {

            // The text is rendered if drawing the PDF or the object is not in edit mode
            // If in edit mode, then UITextViews are rendered by EBCanvas in drawRect.
            var p0 = points[0];
            var p1 = points[1];
            var p2 = points[2];
            var p3 = points[3];
            var x0 = MIN(p0.x, MIN(p1.x, MIN(p2.x, p3.x)));
            var y0 = MIN(p0.y, MIN(p1.y, MIN(p2.y, p3.y)));

            ///UIFont * font = [UIFont fontWithName

            ///this.drawingStyle.fontName
            ///size: this.drawingStyle.fontSize * this.arrowScale

            //CGContextSetFillColorWithColor(currentContext, [this.drawingStyle.textColor CGColor]);
            ///CGContextSetFillColorWithColor(currentContext, [this.drawingStyle.textColor CGColor]);
            ///CGContextSetBlendMode(currentContext, kCGBlendModeNormal);
            //[this.label drawInRect

            ///CGRectMake(x0, y0 + this.menuHeight, ABS(p2.x - p0.x), ABS(p2.y - p0.y))
            ///withFont:font
            ///lineBreakMode:NSLineBreakByWordWrapping
            ///alignment:NSTextAlignmentLeft


            //
        }
        drawSelectors();
    }
    render();
}

function drawCircleAtPoint(p, radius) {
    var diameter = radius * 2;
    ///var circleRect = CGRectMake(p.x - radius  p.y - radius + this.menuHeight , diameter, diameter


    ///circleRect = CGRectInset(circleRect, 2, 2);
    ///CGContextFillEllipseInRect(currentContext, circleRect);
    ///CGContextStrokeEllipseInRect(currentContext, circleRect);
}

function drawPhotoLocn() {
    CGContextSetBlendMode(currentContext, kCGBlendModeNormal);    // PhotoLocn objects are always solid
    // Draw the circle
    CGPoint
    p = points[0];

    var radius = 10.0;
    var lineWidth = 2;  // 1
    UIColor * borderColor = [UIColor blackColor];
    if (!this.photoDirections) {
        radius = 10.0;
        lineWidth = 1;
        borderColor = [UIColor blackColor];

    } else if (this.photoLocnIsActive) {
        radius = 12.0;
        lineWidth = 4;
        borderColor = [UIColor blueColor];

    } else {
        radius = 10.0;
        lineWidth = 2;  // 1
        borderColor = [UIColor blackColor];
    }

    //CGContextSetStrokeColorWithColor(currentContext, [UIColor whiteColor].CGColor);
    //CGContextSetFillColorWithColor(currentContext, [UIColor whiteColor].CGColor);

    // Set line width and colors
    CGContextSetLineWidth(currentContext, lineWidth);
    CGContextSetStrokeColorWithColor(currentContext, borderColor.CGColor);
    CGContextSetFillColorWithColor(currentContext, this.drawingStyle.fillColor.CGColor);

    // Draw the direction indicator
    //   Calculate the points for the direction indicator
    //   Returns point is relative to an origin of (0,0) and in standard co-ordinate system
    //   In 'up facing' indicator:  p1 - left side, p2 - top, p3 - right side
    if (this.photoDirections) {
        var length = Math.sqrt(2.0 * radius * radius);
        var direction1 = this.direction - 45;
        if (direction1 < 0) direction1 = direction1 + 360;
        var direction2 = this.direction + 45;
        if (direction2 > 359) direction2 = direction2 - 360;

        var radius2 = radius - 2.0;
        var p0 = {x: p.x, y: p.y + this.menuHeight};
        var p1 = {x: radius2 * Math.sin(direction1 / 57.2957795), y: radius2 * Math.cos(direction1 / 57.2957795)};
        var p2 = CGPointMake(length * Math.sin(this.direction / 57.2957795), length * Math.cos(this.direction / 57.2957795)
    }
    ;
    var p3 = CGPointMake(radius2 * Math.sin(direction2 / 57.2957795), radius2 * Math.cos(direction2 / 57.2957795)
};

//CGContextSetLineWidth(currentContext,1);
CGContextSetFillColorWithColor(currentContext, borderColor.CGColor);
CGContextMoveToPoint(currentContext, p0.x + p1.x, p0.y - p1.y);
CGContextAddLineToPoint(currentContext, p0.x + p2.x, p0.y - p2.y);
CGContextAddLineToPoint(currentContext, p0.x + p3.x, p0.y - p3.y);
CGContextAddLineToPoint(currentContext, p0.x + p1.x, p0.y - p1.y);
CGContextDrawPath(currentContext, kCGPathFillStroke);
}

// Draw the circle
CGContextSetFillColorWithColor(currentContext, this.drawingStyle.fillColor.CGColor);
var diameter = radius * 2.0;
var circleRect = CGRectMake(p.x - radius, p.y - radius + this.menuHeight, diameter, diameter);
circleRect = CGRectInset(circleRect, 2, 2);
CGContextFillEllipseInRect(currentContext, circleRect);
CGContextStrokeEllipseInRect(currentContext, circleRect);

// Draw the label
CGContextSetFillColorWithColor(currentContext, this.drawingStyle.textColor.CGColor);
var font = {
        fontName: "Helvetica",
        fontSize: 12
    };


var xShift = [this.label integerValue] > 9 ? 7 : 4;
var yShift = (this.drawingPDF) ? 7 : 8;  // For some unknown reason the PDF renders one pixel higher ??

var label = this.label;
NSRange
locn = [label rangeOfString
:
"-"
]
;
if (locn.location != NSNotFound) {
    label = [label substringFromIndex
:
    locn.location + 1
]
    ;
}

[label drawInRect
:
CGRectMake(p.x - xShift, p.y - yShift + this.menuHeight, 20, 20)
withFont:font
lineBreakMode:NSLineBreakByWordWrapping
alignment:NSTextAlignmentLeft
]
;
CGContextDrawPath(currentContext, kCGPathFillStroke);
}


function drawArrow(p1, p2) {

    // Calculate the points for the arrow, Draw the line and arrow
    //   p1->p2              - The line
    //   p2->p3->p5->p4->p2  - The arrow

    // Following comments are for a line that moves down    |
    //   p1  - Line start                                   |
    //   p2  - Line end  (the end with arrow)               V

    var p3 = {};  // Right arrow point
    var p4 = {};  // left arrow point
    var p5 = {};  // Point where arrow joins the line
    var p6 = {};  // Point on the line that is perpendicular to arrow points

    var xDist = (p2.x - p1.x);
    var yDist = (p2.y - p1.y);
    if (xDist == 0 && yDist == 0) return;
    var lineLength = Math.sqrt((xDist * xDist) + (yDist * yDist));
    //if (this.arrowScale == 0) this.arrowScale = 1;
    var arrowScale = 1;
    var lineWidth = arrowStyle.lineWidth * arrowScale;
    var arrowLength = arrowStyle.arrowLength * arrowScale;
    var arrowIndent = arrowStyle.arrowIndent * arrowScale;
    var arrowWidth = arrowStyle.arrowWidth * arrowScale;

    // p5 - The point where the arrow meets the line
    var ratio1 = (arrowLength - arrowIndent) / lineLength;
    p5.x = p2.x - xDist * ratio1;
    p5.y = p2.y - yDist * ratio1;

    // p6 - The point on the line that is perpendicular to the arrow ends
    var ratio2 = arrowLength / lineLength;
    p6.x = p2.x - xDist * ratio2;
    p6.y = p2.y - yDist * ratio2;

    // p3 - Right side arrow point (for downward arrow)
    // p4 - Left side arrow point (for downward arrow)
    var dx = xDist / lineLength;
    var dy = yDist / lineLength;
    p3.x = p6.x + arrowWidth * dy;
    p3.y = p6.y - arrowWidth * dx;
    p4.x = p6.x - arrowWidth * dy;
    p4.y = p6.y + arrowWidth * dx;

    ctx.beginPath();
    ctx.strokeStyle = drawingStyle.fillColor;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineWidth = lineWidth;
    ctx.lineTo(p5.x, p5.y);
    ctx.stroke();
    ctx.fill();

    // Draw the arrow
    ctx.lineWidth = 1;
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p5.x, p5.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.fillStyle = drawingStyle.fillColor
    ctx.fill();
}

function drawSymbol()
{
    var p = points[0];

    // Get from bundle
    //UIImage *image = [UIImage imageNamed:this.label];
    //CGRect rect = CGRectMake(p.x - image.size.width/4, p.y + this.menuHeight - image.size.height/4, image.size.width/2, image.size.height/2);
    //CGContextSetBlendMode(currentContext, kCGBlendModeMultiply);
    //[image drawInRect:rect];
}

function drawDynamicSymbol() {

    CGContextSetBlendMode(currentContext, kCGBlendModeNormal);
    // Draw the circle
    var p = points[0];
    var radius = 10;
    var diameter = radius * 2;
    var circleRect = CGRectMake((int)
    p.x - radius, (int)
    p.y - radius + this.menuHeight, diameter, diameter
)
    ;
    circleRect = CGRectInset(circleRect, 2, 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "black";
    ctx.fillColor = drawingStyle.fillColor;
    //CGContextFillEllipseInRect(currentContext, circleRect);
    //CGContextStrokeEllipseInRect(currentContext, circleRect);

    // Draw the label
    //CGContextSetFillColorWithColor(currentContext, this.drawingStyle.textColor.CGColor);

    //UIFont *font = [UIFont fontWithName:"Helvetica" size:10];
    //int xShift = (this.label.length == 2) ? 7:4;
    //int yShift = (this.drawingPDF) ? 6:7;  // For some unknown reason the PDF renders one pixel higher ??

    //UIFont *font = [UIFont fontWithName:"Helvetica" size:8;

    var xShift = 7;
    var yShift = (this.drawingPDF) ? 4 : 5;  // For some unknown reason the PDF renders one pixel higher ??

    //[this.label drawInRect:CGRectMake(p.x-xShift , p.y-yShift+this.menuHeight, 15, 20) withFont:font lineBreakMode:NSLineBreakByWordWrapping alignment:NSTextAlignmentCenter];

    //CGContextDrawPath(currentContext, kCGPathFillStroke);
}

function drawSelectors() {

    if (!this.allowMove || this.viewOnly) return;

    if (this.points.length > 0 && ![this.type == "PhotoLocn"]) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = drawingStyle.selectorColor;
        ctx.fillStyle = drawingStyle.selectorColor;
        //CGContextSetBlendMode(currentContext, kCGBlendModeNormal);
        var p0 = points[points.length - 1]; // Save previous point for mid-point calcs.

        for (var n = 0; n < points.length; n++) {
            var p = points[n];
            drawCircleAtPoint(p, 10);
            if ([this.type == "Polygon"] && this.points.length > 1) {
                var midPoint = {x: (p0.x + p.x) / 2, y: (p0.y + p.y) / 2};
                drawCircleAtPoint(midPoint, 8);
            }
            p0 = p;
        }
        // Draw center selector (moves)
        if (this.points.length > 1 && this.type != "Circle") {
            drawCircleAtPoint(objectCenterPoint(), 10);
        }
    }
}

*/
