
"use strict";

/*

function defineSelectMemoSet() {
    // Process the enclosed <SelectMemo> directives - creating dictionary selectMemos
    selectMemos = [[NSMutableArray alloc] init];
    executeDirectives( activeEnclosedXML);

    // Add this dictionary to selectMemoSets
    var name =getStringAttribute("name",  true);
    selectMemoSets[name] = selectMemos;
}

function defineSelectMemo() {
    var name =getStringAttribute("name",  true);
    var value =getStringAttribute("value",  true);
    selectMemos.push({Name:name, Value:value});
}

function loadSelectMemos() {
    var file =getStringAttribute("file",  true);
    file =getDataValue( file);
    if (!file hasSuffix:(".xml")  file = file + ".xml";
    EBMSExcel *excel = [[EBMSExcel alloc] init];
    [excel loadSelectMemos: file toSelectMemoSets: selectMemoSets toSelectMemos: selectMemos];
}



function drawSelectListButtonForTextBox(textBoxName) {
    if (!enabled) {
        cursorX += 36;   // Move right by the width of the select button that is displayed during input.
        return;
    }

    var options =getStringAttribute("options", true);
    var fillFieldName;
    var sortField;
    options =getDataValue(options, true);
    var csvOptionsFile = "";

    if (options == "Devices") {
        options="";
        PFQuery *query = [PFQuery queryWithClassName:"EBDevice"];
        [query setLimit:1000];
        [query orderByAscending:"Simulator"];

        for (pfDevice in [query findObjects]) {
            var val = pfDevice["Simulator"];
            if (val.length > 0) options = [NSString stringWithFormat:"%@,%@-%",options,pfDevice.objectId,val];
        }
        options = options.substring(1);

    } else if (options == "A.lengths") {
        options="";
        PFQuery *query = [PFQuery queryWithClassName:"EBA.length"];
        [query orderByAscending:"A.lengthName"];

        for (PFObject *pfA.length in [query findObjects]) {
            options = [NSString stringWithFormat:"%@,%@-%",options,pfA.length.objectId,pfA.length["A.lengthName"]];
        }
        options = options.substring(1);

    } else if (options.hasPrefix("Inspections ")) {
        fillFieldName = options.substring(12);
        sortField =getStringAttribute("optionssort", true);
        //sortField = "inspection." + fillFieldName;
        options = ",";
        var insList = [EBUtil sortInspectionSet: project.inspections sortField:sortField];

        Inspection *inspectionSave = inspection;
        for (Inspection *ins in insList) {
            //options = options + [ins xmlData:fillFieldName];
            inspection = ins;
            options = options +replaceFieldnamesIn(fillFieldName);
            options = options + ",";
        }
        inspection = inspectionSave;

    } else if (options.hasPrefix("Projects ")) {
        fillFieldName = options.substring(9);
        sortField =getStringAttribute("optionssort", true);
        options = ",";
        var projList = [EBUtil sortProjectSet: template.projects sortField:sortField];

        Project *projectSave = project;
        for (Project *proj in projList) {
            project = proj;
            options = options +replaceFieldnamesIn(fillFieldName);
            options = options + ",";
        }
        project = projectSave;

    } else if (options.hasPrefix("Files")) {
        //  "Files folder/*.ft"   or  "Files *.ft"
        if (options.indexOf("*.") == -1) {
            displayErrorMessage("Invalid options - must contain *.filetype", "Directive error - DrawText");
            return;
        }
        options = options.substring(6);
        options = options.trim();
        var folderName = "";
        var fileType = "";
        if (options.hasPrefix("*.")) {
            fileType = options.substring(2);
        } else {
            var iStart = options.indexOf("*.");
            folderName = options.substring(0, iStart - 1);
            fileType = options.substring(iStart + 2);
        }
        fileType = [fileType lowercaseString];
        //var photoPath1 = [NSString stringWithFormat:"%@/HiResPhotos",[paths objectAtIndex:0]];
        //var files1 = [fm contentsOfDirectoryAtPath:photoPath1 error:nil];

        NSFileManager *fm = [NSFileManager defaultManager];
        var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
        var path = paths[0];
        if (folderName.length > 0) path = [NSString stringWithFormat:"%@/%",path,folderName];
        var files = [fm contentsOfDirectoryAtPath:path error:nil];

        options = "";
        for (var file in files) {
            if (file.hasPrefix(".DS_")) continue;
            if (![[file lowercaseString] hasSuffix:fileType]) continue;
            // For unkfalsewn reasons, files in the format ".xml" and ".pdf" show up in the file list - igfalsere them
            if (file == "." + fileType) continue;
            if (options.length > 0) options = options + ",";
            options = options + file;
        }

    } else if (options.hasPrefix("FilesOld")) {
        var folder = options.substring(6).trim();
        NSFileManager *fm = [NSFileManager defaultManager];
        var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
        var path = [NSString stringWithFormat:"%@/%",[paths objectAtIndex:0],folder];
        var files = [fm contentsOfDirectoryAtPath:path error:nil];
        options = "";
        for (var file in files) {
            if (!file.hasPrefix(".DS_")) {  // Skip file .DS_Store (got generated somehow ??)
                if (options.length > 0) options = options + ",";
                options = options + file;
            }
        }

    } else if (options.hasPrefix("Unique project.")) {
        var fieldName = options.substring(15).trim();
        NSMutableArray *aOptions = [[NSMutableArray alloc] init];
        options = "";
        for (Project *project in template.projects) {
            if (options.length > 0) options = options + ",";
            [aOptions addObject:[project xmlData:fieldName]];
        }
        options = [[EBUtil sortUniqueValues:aOptions] componentsJoinedByString:","];

    } else if ([options hasSuffix:".csv"]) {
        csvOptionsFile = options;
        options = [EBUtil getCSVKeys:options withController:viewController];
    }

    UIButton *btn = [UIButton buttonWithType: UIButtonTypeDetailDisclosure]; //UIButtonTypeRoundedRect];
    btn.frame = CGRectMake(cursorX, cursorY-7, 38, 30);  // width,height
    btn.tag = nextTagToAssign;
    [btn addTarget:self action:@selector(showSelectList:) forControlEvents:(UIControlEvents)UIControlEventTouchDown];

    nextTagToAssign += 1;
    [view addSubview: btn];
    var fieldName =getStringAttribute("data",  true);
    var fillFields =getStringAttribute("fillfields",  false);
    var optionsSort =getStringAttribute("optionssort",  false);
    var refresh =getStringAttribute("refresh",  false);
    if (fillFields.length > 0) {
        [inputControls addObject:@{"FieldName":fieldName, "FieldType":"Button" ,"Options":options ,"FillFieldName":fillFieldName, "FillFields":fillFields, "OptionsSort":optionsSort, "Refresh":refresh}];
    } else {
        [inputControls addObject:@{"FieldName":fieldName, "FieldType":"Button" ,"Options":options, "Refresh":refresh, "CSVOptionsFile":csvOptionsFile}];
    }
    cursorX += 38;
    return;
}

function showSelectList(sender)  {
    [view endEditing:true];
    var options = inputControls[sender.tag]["Options"];

    EBSelectList *selectList = [[EBSelectList alloc] init];
    selectList.options = options;
    selectList.controlNumber = (int) sender.tag;
    selectList.delegate = self;

    if ([Device iPhone]) {
        [viewController.navigationController pushViewController: selectList animated: true];

    } else {
        var aSelectList = selectList.options.split(",");

        //var listHeight = selectList.options.split(",").length * 45 + 20;

        var sepChar = ",";
        if (selectList.options.indexOf(";") != -1) sepChar = ";";
        var listHeight = (int) selectList.options.split(sepChar).length * 45 + 20;


        var maxChars = 0;
        for (var option in aSelectList ){
            maxChars = MAX(maxChars,(int) option.length);
        }
        var listWidth = MIN(500,maxChars * 15);
        listWidth = MAX(200,listWidth);
        popoverController = [[UIPopoverController alloc] initWithContentViewController: selectList];
        [popoverController setPopoverContentSize: CGSizeMake(listWidth, listHeight) animated:true]; // width, height - Select list frame

        if (sender.frame.origin.x < view.frame.size.width /2) {
            // Display list to right of the control
            var listWidth = MIN(500,maxChars * 15);
            listWidth = MAX(200,listWidth);
            popoverController = [[UIPopoverController alloc] initWithContentViewController: selectList];
            [popoverController setPopoverContentSize: CGSizeMake(listWidth, listHeight) animated:true]; // width, height - Select list fram
            [popoverController presentPopoverFromRect: CGRectMake(sender.frame.origin.x+30, sender.frame.origin.y+15, 1, 1)  // x,y Anchor position
            inView: view
            permittedArrowDirections: UIPopoverArrowDirectionLeft
            animated: true];
        } else {
            // Display list to the left of the control
            var listWidth = MIN(500,maxChars * 15);
            listWidth = MAX(200,listWidth);
            popoverController = [[UIPopoverController alloc] initWithContentViewController: selectList];
            [popoverController setPopoverContentSize: CGSizeMake(listWidth, listHeight) animated:true]; // width, height - Select list fram
            [popoverController presentPopoverFromRect: CGRectMake(sender.frame.origin.x, sender.frame.origin.y+15, 1, 1)  // x,y Anchor position
            inView: view
            permittedArrowDirections: UIPopoverArrowDirectionRight
            animated: true];
        }
    }
    return;
}


function drawSelectListButtonForMemo(memoName, selectMemoSetName) {
    if (!enabled) {
        cursorX += 36;   // Move right by the width of the select button that is displayed during input.
        return;
    }

    UIButton *btn = [UIButton buttonWithType: UIButtonTypeDetailDisclosure];
    btn.frame = CGRectMake(cursorX, cursorY-7, 38, 30);  // width,height
    btn.tag = nextTagToAssign;
    [btn addTarget:self action:@selector(showSelectListMemo:) forControlEvents:(UIControlEvents)UIControlEventTouchDown];

    nextTagToAssign += 1;
    [view addSubview: btn];
    var fieldName =getStringAttribute("data",  true);
    [inputControls addObject:@{"FieldName":fieldName, "FieldType":"Button" ,"SelectMemoSetName":selectMemoSetName}];
    cursorX += 38;
    return;
}

function showSelectListMemo(sender) {
    [view endEditing:true];
    EBSelectListMemo *selectList = [[EBSelectListMemo alloc] init];
    var selectMemoSetName = inputControls[sender.tag]["SelectMemoSetName"];

    selectList.selectMemos = selectMemoSets[selectMemoSetName];
    selectList.delegate = self;
    selectList.controlNumber = (int) sender.tag;

    if ([Device iPhone]) {
        [viewController.navigationController pushViewController: selectList animated: true];

    } else {

        var listHeight = 700; //selectList.options.split(",").length * 45 + 20;
        var listWidth = 600;
        //if (template.selectMemoSetType == "2") listWidth = 500;
        popoverController = [[UIPopoverController alloc] initWithContentViewController: selectList];
        [popoverController setPopoverContentSize: CGSizeMake(listWidth, listHeight) animated:true]; // width, height - Select list frame


        if (sender.frame.origin.x < view.frame.size.width /2) {

            popoverController = [[UIPopoverController alloc] initWithContentViewController: selectList];
            [popoverController setPopoverContentSize: CGSizeMake(listWidth, listHeight) animated:true]; // width, height - Select list fram
            [popoverController presentPopoverFromRect: CGRectMake(sender.frame.origin.x+30, sender.frame.origin.y+15, 1, 1)  // x,y Anchor position
            inView: view
            permittedArrowDirections: UIPopoverArrowDirectionLeft
            animated: true];
        } else {
            // Display list to the left of the control
            var shiftLeft = 0;
            if (template.selectMemoSetType == "2") shiftLeft = 550;

            popoverController = [[UIPopoverController alloc] initWithContentViewController: selectList];
            [popoverController setPopoverContentSize: CGSizeMake(listWidth, listHeight) animated:true]; // width, height - Select list fram
            [popoverController presentPopoverFromRect: CGRectMake(sender.frame.origin.x - shiftLeft, sender.frame.origin.y+15, 1, 1)  // x,y Anchor position
            inView: view
            permittedArrowDirections: UIPopoverArrowDirectionRight
            animated: true];
        }
    }
    return;
}


function selectListValueSelected(value, controlNumber) {

    // Multiple values can be provided as "val1:val2:val3" in which case the additional values are placed
    // in subsequent text boxes.

    var found = false;
    var aValues;
    var iIndex = 0;  // Index into aValues

    UITextField *tf;
    var fillFieldName;
    var optionsSort;
    var fillFields;
    var refresh;
    var csvOptionsFile;
    for (UIView *v in view.subviews) {
        if ([v isKindOfClass:[UITextField class]] || [v isKindOfClass:[UITextView class]]) {
            tf = (UITextField *)v;
            if (v.tag == controlNumber-1) {
                aValues = value.split(":");
                tf.text = aValues[0].trim();
                fillFieldName = inputControls[v.tag+1]["FillFieldName"];
                optionsSort = inputControls[v.tag+1]["OptionsSort"];
                fillFields = inputControls[v.tag+1]["FillFields"];
                refresh = inputControls[v.tag+1]["Refresh"];
                csvOptionsFile = inputControls[v.tag+1]["CSVOptionsFile"];
                found = true;

            } else if (found) {
                iIndex += 1;
                if (iIndex < aValues.length) {
                    tf.text = aValues[iIndex].trim();
                }
            }
        }
    }

    // If fill fields are specified, then get them.

    //if (fillFields.length > 0) {
    if (optionsSort.hasPrefix("inspection.")) {
        fillFields = [NSString stringWithFormat:",%@,",fillFields];
        Inspection *inspectionSave = inspection;
        for (Inspection *ins in project.inspections) {
            inspection = ins;
            if ([self replaceFieldnamesIn:fillFieldName] == aValues[0]) {
                for (UIView *v in view.subviews) {
                    if ([v isKindOfClass:[UITextField class]] || [v isKindOfClass:[UITextView class]]) {
                        var fieldName = inputControls[v.tag]["FieldName"];
                        if (fieldName.hasPrefix("inspection."]) fieldName = [fieldName substringFromIndex:11);
                        var findValue = [NSString stringWithFormat:",%@,",fieldName];
                        var iPt = (int) fillFields.indexOf(findValue);
                        if (iPt != (int) -1) {
                            tf = (UITextField *)v;
                            tf.text = [ins xmlData:fieldName];
                        }
                    }
                }
            }
        }
        inspection = inspectionSave;
    }

    if (optionsSort.hasPrefix("project.")) {
        fillFields = [NSString stringWithFormat:",%@,",fillFields];
        Project *projectSave = project;
        for (Project *proj in template.projects) {
            project = proj;
            if ([self replaceFieldnamesIn:fillFieldName] == aValues[0]) {
                for (UIView *v in view.subviews) {
                    if ([v isKindOfClass:[UITextField class]] || [v isKindOfClass:[UITextView class]]) {
                        var fieldName = inputControls[v.tag]["FieldName"];
                        if (fieldName.hasPrefix("project."]) fieldName = [fieldName substringFromIndex:8);
                        var findValue = [NSString stringWithFormat:",%@,",fieldName];
                        var iPt = (int) fillFields.indexOf(findValue);
                        if (iPt != (int) -1) {
                            tf = (UITextField *)v;
                            tf.text = [proj xmlData:fieldName];
                        }
                    }
                }
            }
        }
        project = projectSave;
    }

    if (csvOptionsFile.length > 0) {
        var key = aValues[0];
        NSDictionary *dFields = [EBUtil getCSVValues:csvOptionsFile forKey:key withController:viewController];
        for (UIView *v in view.subviews) {
            if ([v isKindOfClass:[UITextField class]]) {
                var fieldName = inputControls[v.tag]["FieldName"];
                fieldName = [EBUtil removeTableName:fieldName];
                if (dFields[fieldName] != nil) {
                    tf = (UITextField *)v;
                    tf.text = dFields[fieldName];
                }
            }
        }
    }

    if (refresh == "true") {
        var updateMethodSave = updateMethodUsed;
        formRefresh = true;
        updateMethodUsed = true;
        formRefreshXMLData = [self save];

        [[view subviews] makeObjectsPerformSelector:@selector(removeFromSuperview)];
        showForm(template);
        updateMethodUsed = updateMethodSave;
        formRefresh = false;
    }

    [popoverController dismissPopoverAnimated:true];
}


function selectListValueSelectedMemo(value, controlNumber) {

    if (controlNumber != -1) {  // falset cancelled?
        UITextView *tv;
        for (UIView *v in view.subviews) {
            if ([v isKindOfClass:[UITextField class]] || [v isKindOfClass:[UITextView class]]) {
                tv = (UITextView *)v;
                if (v.tag == controlNumber-1) {
                    if (tv.text.length == 0) {
                        tv.text = value;
                    } else {
                        var beforeInsertPovar = tv.text.substring(0, tv.selectedRange.location);
                        var afterInsertPovar = tv.text.substring(tv.selectedRange.location + tv.selectedRange.length);
                        tv.text = [NSString stringWithFormat:"%@%@%",beforeInsertPoint,value,afterInsertPoint];
                    }
                }
            }
        }
    } else {
        [popoverController dismissPopoverAnimated:true];
    }
    if (!template.selectMemoSetType == "2"]) [popoverController dismissPopoverAnimated:true;  // Remove to retain the select list.
}
*/