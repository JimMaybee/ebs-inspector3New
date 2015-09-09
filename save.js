
"use strict";


/*
function update(xmlOriginalData) {
    xmlSaveData = xmlOriginalData;       // This causes the save function to update rather than creating a new xmlData string
    updateMethodUsed = true;
    var newXmlData = [self save];
    xmlSaveData = "";
    updateMethodUsed = false;
    return newXmlData;
}

function save() {
    var xmlValue = xmlSaveData;
    var fieldName;
    var fieldName2;
    var fieldType;
    var val;
    var val2;
    var iTemplate = 0;
    var iProject = 0;
    var iInspection = 0;
    var iPhoto = 0;
    var iPhotoGroup = 0;
    var iDeviceSetup = 0;
    var iUserSetup = 0;
    var iPhotoSetup = 0;
    var iEMailSetup = 0;
    var iCloudSetup = 0;
    var lastPhotoControl = -1;
    var nextCanvasPhotoSequenceNumber = EBUtil.nextImageNumber();

    var controlListSaveName, controlListSaveValue;
    var saveImageNumber = EBUtil.nextImageNumber();

    for (UIView *v in view.subviews) {
        fieldName2 = "";
        val2 = "";

        if ([v isKindOfClass:[UITextField class]] || [v isKindOfClass:[UITextView class]]) {

            UITextField *t = (UITextField *)v;
            fieldName = inputControls[v.tag].FieldName;
            val = t.text;
            if ([v isKindOfClass:[UITextView class]] && val.length > 0) {
                if (![val hasSuffix:"\n"]) {
                    val = val + "\n";
                }
            }
            var listKey = inputControls[v.tag]["ListKey"];
            if (listKey.length > 0) {
                controlListSaveName = fieldName.substring(8);  //  *** Only allows for the project table !!
                if (controlListSaveValue.length == 0) {
                    controlListSaveValue = "List:" + listKey + ":" + val + ";
                } else {
                    controlListSaveValue = controlListSaveValue + "," listKey " + ":" +val;
                }
                continue;
            }

        } else if ([v isKindOfClass:[EBCanvas class]]) {

            // The canvas control can do 3 saves:
            //   - The Markup  (FieldName / val)
            //   - The Image   (FieldName2/ val2)
            //   - The Photo locations - Done after validation
            EBCanvas *canvas = (EBCanvas *) v;
            fieldName = inputControls[v.tag].FieldName;
            var imageFieldName = inputControls[v.tag].ImageFieldName;

            if (canvas.drawPhotoLocations) {
                savePhotoLocns = true;
                savePhotoLocnsCanvas = canvas;
            }

            // get markup data
            if (savePhotoLocns) {
                saveMarkupToInspectionFieldName = EBUtil.removeTableName(fieldName);
                saveMarkupToInspectionData = [canvas getMarkupData];
                fieldName = "";
                val = "";
            } else {
                val = [canvas getMarkupData];
            }

            // Save the image, if changed.
            if (canvas.imageChanged) {
                fieldName2 = EBUtil.removeTableName.imageFieldName();
                val2 = EBUtil.nextImageName(nextCanvasPhotoSequenceNumber);
                nextCanvasPhotoSequenceNumber = EBUtil.nextImageNumber(nextCanvasPhotoSequenceNumber+1);
                saveCanvasImages = true;  // Save after validation
            }

        } else if ([v isKindOfClass:[EBPhotoMarkup class]]) {

            EBPhotoMarkup *photoCtl = (EBPhotoMarkup *) v;
            fieldName = inputControls[v.tag]["FieldName"];
            var fileName = inputControls[v.tag]["FileName"];
            //var originalFileName = inputControls[v.tag]["FileName"];  // Name of the photo file at start of edit
            var action = inputControls[v.tag]["Action"];
            UIImage *image = photoCtl.image;

            if (action == "") {
                val = photoCtl.photoFileName;

            } else if (action == "ImageReplaced") {
                if (fileName.trim().length > 0) {
                    [EBUtil deleteFile:[NSString stringWithFormat:"Photos/%",fileName]];
                }
                val = [EBUtil nextImageName];
                [EBUtil saveImage: image];

            } else if (action == "ImageCleared") {
                if (fileName.trim().length > 0) {
                    [EBUtil deleteFile:[NSString stringWithFormat:"Photos/%",fileName]];
                }
                val = "";

            } else {
                val = photoCtl.photoFileName;
            }

            lastPhotoControl = (int) v.tag;  // Used to skip the 3 associated buttons

        } else if ([v isKindOfClass:[UIButton class]]) {

            // Skip 'command' buttons.
            UIButton *btn = (UIButton *) v;
            fieldType = inputControls[btn.tag]["FieldType"];
            if (fieldType == "Button") continue;

            // Skip the photo control buttons
            if (v.tag == lastPhotoControl) continue;

            fieldName = inputControls[btn.tag]["FieldName"];
            val = btn.accessibilityHint;

        } else if ([v isKindOfClass:[CheckBox class]]) {
            CheckBox *chk = (CheckBox *) v;
            fieldName = inputControls[chk.tag]["FieldName"];
            if (chk.currentState == 1) {
                val = "true";
            } else {
                val = "false";
            }

        } else {  // UILabel or other falsen-input control
            continue;
        }

        // If this control is for an edit region, then update the XML
        var editRegionName = inputControls[v.tag]["EditRegionName"];
        if (editRegionName.length > 0) {
            var nLine = [inputControls[v.tag]["EditRegionLine"] - 1;
            var iPt = fieldName.indexOf(".");
            var nColumn = fieldName.substring(iPt+1) - 1;

            var aLines = (NSMutableArray *) editRegions[editRegionName].split("\n");
            var thisLine = aLines[nLine];
            iPt = (int) thisLine.indexOf("with='");
            var prefix = thisLine.substring(0, iPt + 6);
            var theRest = thisLine.substring(prefix.length);
            iPt = (int) theRest.indexOf("'");
            var suffix = theRest.substring(iPt );
            theRest = theRest.substring(0, theRest.length - suffix.length);

            var sepChar = ";";
            var iPt2 = theRest.indexOf(";");
            if (iPt2 == -1) sepChar = ",";

            var aColumns = theRest.split(sepChar);
            aColumns[nColumn] = val;
            aLines[nLine] = prefix + aColumns.join(";") + suffix;
            editRegions[editRegionName] = [aLines.join("\n");
            continue; // Skip xml updating
        }

        if (fieldName.hasPrefix("template.")) {
            fieldName= fieldName.substring(9);
            iTemplate = 1;

        } else if (fieldName.hasPrefix("project.")) {
            fieldName= fieldName.substring(8);
            iProject = 1;

        } else if (fieldName.hasPrefix("inspection.")) {
            fieldName= fieldName.substring(11);
            iInspection = 1;

        } else if (fieldName.hasPrefix("photo.")) {
            fieldName= fieldName.substring(6);
            iPhoto = 1;

        } else if (fieldName.hasPrefix("photogroup.")) {
            fieldName= fieldName.substring(11);
            iPhotoGroup = 1;

        } else if (fieldName.hasPrefix("devicesetup.")) {
            fieldName= fieldName.substring(12);
            iDeviceSetup=1;

        } else if (fieldName.hasPrefix("device.")) {
            fieldName= fieldName.substring(7);
            iDeviceSetup=1;

        } else if (fieldName.hasPrefix("usersetup.")) {
            fieldName= fieldName.substring(10);
            iUserSetup = 1;

        } else if (fieldName.hasPrefix("user.")) {
            fieldName= fieldName.substring(5);
            iUserSetup = 1;

        } else if (fieldName.hasPrefix("photosetup.")) {
            fieldName= fieldName.substring(11);
            iPhotoSetup = 1;

        } else if (fieldName.hasPrefix("emailsetup.")) {
            fieldName= fieldName.substring(11);
            iEMailSetup = 1;

        } else if (fieldName.hasPrefix("cloudsetup.")) {
            fieldName= fieldName.substring(11);
            iCloudSetup = 1;

        } else {
            if (fieldName.length > 0) alert([NSString stringWithFormat:"Invalid field name = %",fieldName]);
        }

        if (fieldName.length > 0) {
            if (updateMethodUsed) {
                xml = [EBxml xmlUpdate:fieldName with:val usingXML: xml];

            } else {
                xml = [EBxml xmlAdd:fieldName with:val usingXML: xml];
            }
        }
        if (fieldName2.length > 0) {
            if (updateMethodUsed) {
                xml = [EBxml xmlUpdate:fieldName2 with:val2 usingXML: xml];

            } else {
                xml = [EBxml xmlAdd:fieldName2 with:val2 usingXML: xml];
            }
        }
    }

    if (controlListSaveValue.length > 0) {
        xml = xml + "<" + controlListSaveName + " value='" + controlListSaveValue + "' />";
    }

    var iTotal = iTemplate + iProject + iInspection + iPhoto + + iPhotoGroup + iDeviceSetup + iUserSetup + iPhotoSetup + iEMailSetup + iCloudSetup;
    if (iTotal > 1) {
        displayErrorMessage("Invalid form - contains fields from multiple entities", "Form XML error");
    }
    xml = replaceAll(xml,"(null)");
    formXMLData = xml; // Used by getDataValue method in form.fieldName refs

    // Validate
    validationErrorCount = 0;
    var validationError = false;
    if (validateDirectives.length > 0) {
        clearBackground();
        executeDirectives(validateDirectives);  // Sets validationErrorCount - which is checked by caller.
        if (validationErrorCount > 0) {
            var heading = validationErrorCount + " Validation Errors";
            alert( "Please correct errors\nshown in red\n\nand Save again.", heading);
            validationError = true;
            EBUtil.restoreImageNumber(saveImageNumber);
        }
    }

    if (!validationError && savePhotoLocns) {
        [savePhotoLocnsCanvas savePhotoLocations];

        // The location for the photo that is being edited also needs to be update to the xml string.
        var thisPhotoNumber = [EBxml xmlData:"PhotoNumber" usingXML:xml];
        var thisGroupNumber = [EBxml xmlData:"PhotoGroupNumber" usingXML:xml];
        for (Photo *photo in savePhotoLocnsCanvas.photos) {
            var match = false;
            var photoMatch = false;
            var groupMatch = false;
            var insMatch = false;
            var canvasGroupNumber = photo.PhotoGroupNumber;
            var canvasPhotoNumber = photo.PhotoNumber;
            groupMatch = (canvasGroupNumber == thisGroupNumber);
            photoMatch = (canvasPhotoNumber == thisPhotoNumber);
            insMatch = (photo.InspectionNumber == photo.inspection.InspectionNumber;
            if (photo.inspection.project.template.enablePhotoGroups) {
                if (photoMatch && groupMatch && insMatch) {
                    match = true;
                }
            } else if (photoMatch && insMatch) {
                match = true;
            }
            if (match) {
                if (updateMethodUsed) {
                    xml = [EBxml xmlUpdate:"MapLocn" with:photo.MapLocn usingXML: xml];
                } else {
                    xml = [EBxml xmlAdd:fieldName2 with:val2 usingXML: xml]; // falset sure what this does ??
                }
            }
        }
    }

    if (!validationError && saveCanvasImages) {
        for (UIView *v in view.subviews) {
            if ([v isKindOfClass:[EBCanvas class]]) {

                EBCanvas *canvas = (EBCanvas *) v;
                fieldName = inputControls[v.tag]["ImageFieldName"];
                var imageFilename = inputControls[v.tag]["ImageFilename"];

                // Save the image, if changed.
                if (canvas.imageChanged) {
                    [EBUtil saveImage: canvas.image];

                    // Delete the previous image, if any
                    if (imageFilename.trim().length > 0) {
                        [EBUtil deleteFile:[NSString stringWithFormat:"Photos/%",imageFilename]];
                    }
                }
            }
        }
    }

    if (!validationError && editRegions.length > 0) {
        for (var editRegionName in [editRegions allKeys]) {
            // Update to Parse
            PFQuery *query = [PFQuery queryWithClassName:"EBA.length"];
            PFObject *pfAccount2 = [query getObjectWithId:[Device a.lengthID]];
            var xml = pfAccount2["SharedXML"];
            var startString = "//EditRegion " + editRegionName;
            var endString = "//EndEditRegion " + editRegionName;

            var iStart = (xml.indexOf(startString);
            var startText = xml.substring(0, iStart + 1 + startString.length);
            var editRegionContent = xml.substring(iStart + 1 + startString.length);

            var iEnd = editRegionContent.indexOf(endString);
            var endText = editRegionContent.substring(iEnd);

            pfAccount2.SharedXML = startText + editRegions[editRegionName] + endText;
            [pfAccount2 save];

            // Update to CoreData - Device table

            xml = device.sharedXML;
            iStart = xml.indexOf(startString);
            startText = xml.substring(0, iStart + 1 + startString.length);
            editRegionContent = xml.substring(iStart + 1 + startString.length);

            iEnd = editRegionContent.indexOf(endString);
            endText = editRegionContent.substring(iEnd);

            device.sharedXML = startText + editRegions[editRegionName] + endText;
            [moc MR_save];
        }
    }

    savePhotoLocns = false;
    saveCanvasImages = false;
    return xml;
}

function validation() {
    validateDirectives = activeEnclosedXML;
}

function validateRequired() {
    var val, fieldName, validation, relatedControl;
    var code =getStringAttribute("code",  true);
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UITextField class]]) {
            fieldName = inputControls[v.tag]["FieldName"];
            validation = inputControls[v.tag]["Validation"];

            if ([EBUtil contains:code in:validation]) {

                UITextField *tf = (UITextField *)v;
                val = tf.text;
                if (val.length == 0) {
                    relatedControl = inputControls[v.tag]["RelatedControl"];
                    var relatedValueEntered = true;
                    if (relatedControl.length > 0) {
                        var relatedValue =getDataValue(relatedControl, true);
                        if (relatedValue.length == 0) relatedValueEntered = false;
                        if (relatedValue == "N/A") relatedValueEntered = false;
                    }
                    if (relatedValueEntered) {
                        v.backgroundColor = [[UIColor alloc] initWithRed:1 green:.5 blue:.5 alpha:1];
                        validationErrorCount += 1;
                    }
                }
            }
        }
        if ([v isKindOfClass:[UITextView class]]) {
            validation = inputControls[v.tag]["Validation"];
            if (validation == code) {
                UITextView *tv = (UITextView *)v;
                val = tv.text;
                if (val.length == 0) {
                    v.backgroundColor = [[UIColor alloc] initWithRed:1 green:.5 blue:.5 alpha:1];
                    validationErrorCount += 1;
                }
            }
        }
    }
}

function validateDate() {
    var val, fieldName, validation;
    var code =getStringAttribute("code",  true);
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UITextField class]]) {
            fieldName = inputControls[v.tag]["FieldName"];
            validation = inputControls[v.tag]["Validation"];

            if ([EBUtil contains:code in:validation]) {
                UITextField *tf = (UITextField *)v;
                val =cleanDate(tf.text);
                if (val.length > 0) {
                    NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
                    [dateFormat setDateFormat:"MM/dd/yyyy"];
                    NSDate *date = [dateFormat dateFromString:val];
                    var error = false;
                    if (val.length != 8) error = true;
                    if (date == nil ) error = true;
                    if (!error) {
                        var iYear = (int) [val.substring(6] integerValue);
                        if (iYear < 10 || iYear > 29) error = true;
                    }

                    if (error) {
                        v.backgroundColor = [[UIColor alloc] initWithRed:1 green:.5 blue:.5 alpha:1];
                        validationErrorCount += 1;
                    }
                }
            }
        }
    }
}

function validateEMail() {

    var val, fieldName, validation;
    var code = getStringAttribute("code", true);
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UITextField class]]) {
            fieldName = inputControls[v.tag]["FieldName"];
            validation = inputControls[v.tag]["Validation"];

            if ([EBUtil contains:code in:validation]) {
                UITextField *tf = (UITextField *)v;
                val = tf.text;
                if (val.length > 0) {
                    var iPt1 = (int) val.indexOf("");
                    var iPt2 = (int) val.indexOf(".");
                    if (iPt1 == (int) -1 || iPt2 == (int) -1) {
                        v.backgroundColor = [[UIColor alloc] initWithRed:1 green:.5 blue:.5 alpha:1];
                        validationErrorCount += 1;
                    }
                }
            }
        }
    }
}

function validateInOptions() {
    var val, validation, options;
    var code = getStringAttribute("code",  true);

    var found;
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UITextField class]]) {
            validation = inputControls[v.tag]["Validation"];
            if ([EBUtil contains:code in:validation]) {
                options = inputControls[v.tag]["Options"];
                var aOptions  = [NSArray alloc] initWithArray:[options.split(","]);
                UITextField *tf = (UITextField *)v;
                val = tf.text.trim();
                if (val.length > 0) {
                    found = false;
                    for (var listValue in aOptions) {
                        if (val == listValue.trim()) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        v.backgroundColor = [[UIColor alloc] initWithRed:1 green:.5 blue:.5 alpha:1];
                        validationErrorCount += 1;
                    }
                }
            }
        }
    }
}

function validateMemoHeight() {

    var fieldName, validation;
    var code = getStringAttribute("code",  true);
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UITextView class]]) {
            fieldName = inputControls[v.tag]["FieldName"];
            validation = inputControls[v.tag]["Validation"];
            if (validations.contains(code)) {

                var height =getFloatAttributeInPoints("height",  true);
                var cursorXSave = cursorX;
                var cursorYSave = cursorY;
                noGraphicsOutput = true;
                keepTogetherTestActive = true;

                // Run the report, suppressing output, to calculate the rendered height
                var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
                var documentsDirectory = [paths objectAtIndex:0];
                var pdfTempPath = [documentsDirectory stringByAppendingPathComponent:"EBSTempReport.pdf"];

                // Run the report, suppressing output, to calculate the number of pages.
                showErrorMessages = false;
                UIGraphicsBeginPDFContextToFile(pdfTempPath, CGRectZero, nil);
                //[self startNewGenerate];
                UIGraphicsBeginPDFPageWithInfo(CGRectMake(0, 0, pageWidth, pageHeight), nil);
                cursorY = marginTop;
                var startCursorY = cursorY;
                memoHeightValidationActive = true;
                validationField = fieldName;
                executeDirectives( activeEnclosedXML);
                validationField = "";
                memoHeightValidationActive = false;
                UIGraphicsEndPDFContext();
                var renderedHeight = cursorY - startCursorY;
                keepTogetherTestActive = false;

                cursorX = cursorXSave;
                cursorY = cursorYSave;
                noGraphicsOutput = false;
                if (renderedHeight > height) {
                    v.backgroundColor = [[UIColor alloc] initWithRed:1 green:.5 blue:.5 alpha:1];
                    validationErrorCount += 1;
                }
            }
        }
    }
}

function validationError() {
    var message = getStringAttribute("message",  true);
    alert(message, "Validation Error");
    validationErrorCount += 1;
}

function validateMacro() {
    executeDirectives(activeEnclosedXML);
}

function showErrorMessage() {
    var errorNumber =getIntAttribute("errornumber", true);
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UILabel class]]) {
            UILabel *lbl = (UILabel *)v;

            if (lbl.tag == errorNumber) {
                lbl.textColor = [UIColor redColor];
                validationErrorCount += 1;
                break;
            }
        }
    }
}

function clearErrorMessage() {
    var errorNumber =getIntAttribute("errornumber", true);
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UILabel class]]) {
            UILabel *lbl = (UILabel *)v;

            if (lbl.tag == errorNumber) {
                lbl.textColor = [UIColor clearColor];
                break;
            }
        }
    }
}

function clearBackground() {
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UITextField class]] || [v isKindOfClass:[UITextView class]] ) {
            v.backgroundColor = [UIColor whiteColor];
        }
    }
}

*/

