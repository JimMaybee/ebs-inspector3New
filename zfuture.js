

"use strict";

/*

// This method is used the EBCanvas to shift form controls when the canvas is resized during import







function clearControlsExp() {
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[CheckBox class]]) {
            var fieldName = [inputControls objectAtIndex:v.tag]["FieldName"];
            fieldName = [EBUtil removeTableName:fieldName];
            if ([fieldName isMatch:RX(clearControlsExp)]) {
                CheckBox *chk = (CheckBox *)v;
                [chk uncheck];
            }
        }
    }
}

function disableControlsExp {

    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[CheckBox class]]) {
            var fieldName = [inputControls objectAtIndex:v.tag]["FieldName"];
            fieldName = [EBUtil removeTableName:fieldName];
            if ([fieldName isMatch:RX(disableControlsExp)]) {
                CheckBox *chk = (CheckBox *)v;
                [chk uncheck];
                [chk disable];
            }
        }
    }
}

function disableControlsExp {
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[CheckBox class]]) {
            var fieldName = [inputControls objectAtIndex:v.tag]["FieldName"];
            fieldName = [EBUtil removeTableName:fieldName];
            if ([fieldName isMatch:RX(disableControlsExp)]) {
                CheckBox *chk = (CheckBox *)v;
                [chk enable];
            }
        }
    }
}


function appendMemo(ctlIndex, string) {
    UITextView *tv;
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UITextView class]]) {

            tv = (UITextView *)v;
            if (v.tag == ctlIndex) {
                if (tv.text.length == 0) {
                    tv.text = string;
                } else {
                    tv.text = [NSString stringWithFormat:"%@\n%",tv.text,string];
                }
            }
        }
    }
}


function appendMemoWithName(ctlName, string) {
    UITextView *tv;
    var fieldName;
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UITextView class]]) {

            tv = (UITextView *)v;
            fieldName = [inputControls objectAtIndex:v.tag]["FieldName"];
            if (fieldName == ctlName) {
                if (tv.text.length == 0) {
                    tv.text = string;
                } else {
                    tv.text = [NSString stringWithFormat:"%@\n%",tv.text,string];
                }
            }
        }
    }
}


function clearMemo(ctlIndex) {
    UITextView *tv;
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UITextView class]]) {
            tv = (UITextView *)v;
            if (v.tag == ctlIndex) {
                tv.text = "";
            }
        }
    }
}


function drawControlList() {
    var forValue =getStringAttribute("for",  true);
    forValue =getDataValue(forValue, true);
    var aKeyValues = forValue.split(",");
    for (var controlListKeyValue in aKeyValues) {
        var aTemp = controlListKeyValue.split(":");
        controlListKey = aTemp[0];
        controlListValue = aTemp[1];
        executeDirectives(activeEnclosedXML);
    }
    controlListKey = "";
    controlListValue = "";
}


function setFormTitle() {
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
        var title =getStringAttribute("title",  true);
        var value =getDataValue(title, true);
        if (instanceName == "Template Form") {
            EBTemplateViewController *vc = (EBTemplateViewController *) viewController;
            [vc.navBarItem setTitle:value];
        } if (instanceName == "Project Form") {
            EBProjectViewController *vc = (EBProjectViewController *) viewController;
            [vc.navBarItem setTitle:value];
        } if (instanceName == "Inspection Form") {
            EBInspectionViewController *vc = (EBInspectionViewController *) viewController;
            [vc.navBarItem setTitle:value];
        } if (instanceName == "Photo Form") {
            EBPhotoViewController *vc = (EBPhotoViewController *) viewController;
            [vc.navBarItem setTitle:value];
        } else {
            return;
        }
    }
}

function setFormButton() {
    // Currently only used for the Backup button on the project form on the iPad
     //if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad && formType == "Display") {
     //EBProjectViewController *vc = (EBProjectViewController *) viewController;
     //UIBarButtonItem *btn = [[UIBarButtonItem alloc] initWithTitle:"Backup/Restore"  style:UIBarButtonItemStyleDone target:self action:@selector(backupRestoreRequest)];
     //[vc.navBarItem setLeftBarButtonItem:btn];
     //}

    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad && formType == "Display") {
        var label  =getStringAttribute("label",  true);
        label =getDataValue(label, false);
        formButtonXML = activeEnclosedXML;
        EBProjectViewController *vc = (EBProjectViewController *) viewController;
        UIBarButtonItem *btn = [[UIBarButtonItem alloc] initWithTitle:label  style:UIBarButtonItemStyleDone target:self action:@selector(formButtonRequest)];
        [vc.navBarItem setLeftBarButtonItem:btn];

    }
}

function formButtonRequest(sender) {
    //[sender setSelected:true];
    //[sender setHighlighted:true];
    executeDirectives( formButtonXML);
    //[sender setSelected:false];
    //[sender setHighlighted:false];
}

function buttonRequest(sender) {

    var executeXML = [inputControls objectAtIndex:sender.tag]["ExecuteXML"];
    [sender setSelected:true];
    [sender setHighlighted:true];
    ///[sender setBackgroundColor:[UIColor blackColor]];
    ///[sender setTintColor:[UIColor blueColor]];

    if (sender.currentTitle == "?") {
        alert("Memo tags:\n <b> - Bold            \n <r> - Red             \nPlace at start of line." withHeading:"Help Form");

    } else if (executeXML.length > 0) {
        exitRequested = false;
        executeDirectives(executeXML);

    } else {
        var requestNumber = [inputControls objectAtIndex:sender.tag]["RequestNumber"];
        if (requestNumber == "1") requestValue1 = sender.accessibilityIdentifier;
        if (requestNumber == "2") requestValue2 = sender.accessibilityIdentifier;
        [delegate generatedButtonRequest: sender.currentTitle withValue:sender.accessibilityIdentifier];
    }
    [sender setSelected:false];
    [sender setHighlighted:false];
}



function setEMailSignature() {
    eMailSignatureFileName =getStringAttribute("Filename",  true);
}

function getEMailList() {
    if (!defineVars["#EMailList#"]) {
        return "";
    } else {
        return defineVars["#EMailList#"];
    }
}

function getEMailSubject() {
    returnreplaceFieldnamesIn([device, "Subject"]);
}

function getEMailMessage() {
    var messageStart =replaceFieldnamesIn([device, "Message"]);
    var messageBody;
    if (eMailSignatureFileName.length > 0) {
        UIImage *emailImage = [UIImage imageNamed:eMailSignatureFileName];
        NSData *imageData = [NSData dataWithData:UIImagePNGRepresentation(emailImage)];
        var base64String = [imageData base64EncodedString];
        messageBody = [NSString stringWithFormat:"<html><body>%@<br /><p><b><img src='data:image/png;base64,%@'></b></p>",messageStart,base64String];
    } else {
        messageBody = messageStart;
    }
    return messageBody;
}




// Processes choice expressions  '?table.fieldName,choice1:value1,choice2:value2,...,else:elsevalue


*/