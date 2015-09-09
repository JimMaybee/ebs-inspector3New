
// repeat.js


"use strict";



function repeat1() {repeat()}
function repeat2() {repeat()}
function repeat3() {repeat()}
function repeat4() {repeat()}

function repeat() {
    var countValue = getIntAttribute("count", false);
    var start = 0;
    var start1 = getStringAttribute("start", false);
    if (start1.length > 0) {
        start1 = getDataValue(start1, false);
        start =  start1;
    }
    var memoLines    = getStringAttribute("memolines", false);
    var controlArray = getStringAttribute("controlarray", false);
    var paragraphs   = getStringAttribute("paragraphs", false);
    ///var files        = getStringAttribute("files", false);
    var editRegion   = getStringAttribute("editregion", false);
    var untilWithin  = getStringAttribute("untilwithin", false);

    var forReqd = true;
    if (countValue > 0 || memoLines.length > 0 || controlArray.length > 0 || paragraphs.length > 0 || files.length > 0 || editRegion.length > 0 || untilWithin.length > 0) forReqd = false;
    var forValue = getStringAttribute("for", forReqd );
    if (memoLines.length > 0)    forValue = "MemoLines";
    if (controlArray.length > 0) forValue = "ControlArray";
    if (paragraphs.length > 0)   forValue = "Paragraphs";
    //if (files.length > 0)        forValue = "Files";
    if (editRegion.length > 0)   forValue = "EditRegion";
    if (untilWithin.length > 0)  forValue = "UntilWithin";

    // Extract directives

    var repeatDirectives = activeEnclosedXML;
    //var repeatCount;
    //var tempDirectives;

    if (countValue > 0) {
        for (var i=start; i<countValue; i++) {
            var repeatCount = i + 1;
            var tempDirectives = repeatDirectives.replaceAll("#repeatCount#", repeatCount);
            executeDirectives(tempDirectives);
        }
/*
    } else if (forValue == "ControlArray") {
        var nEmptyLines = getStringAttribute("emptylines", false);
        var nMaxLines   = getStringAttribute("maxlines", false);
        if (nMaxLines == 0) nMaxLines = 999;
        if (formType == "Display") nEmptyLines = 0;
        var nEmptyDisplayed = 0;
        for (var i = 0; i < nMaxLines; i++) {
            repeatCount = i+1;
            var tempControl = controlArray + i + 1;
            if (getDataValue(tempControl, false).length == 0) {
                if (nEmptyDisplayed >= nEmptyLines) break;
                nEmptyDisplayed += 1;
            }
            var tempDirectives = templateDirectives.replaceAll("#repeatCount#",repeatCount);
            executeDirectives(tempDirectives);
        }


    } else if (forValue.hasPrefix("Files")) {
        NSFileManager *fm = [NSFileManager defaultManager];
        var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
        var path = [NSString stringWithFormat:"%@/%",[paths objectAtIndex:0],files];
        var files = [fm contentsOfDirectoryAtPath:path error:nil];
        files = [EBUtil sortArray:files];
        repeatCount;
        var tempDirectives;
        var fileType = [forValue.substring(8] lowercaseString);
        var count = 0;
        for (var file in files) {
            if (![[file lowercaseString] hasSuffix:fileType]) continue;
            countValue += 1;
            repeatCount = [NSString stringWithFormat:"%i",count];
            tempDirectives = replaceAll(repeatDirectives,"#repeatCount#");
            tempDirectives = replaceAll(tempDirectives,"#RepeatFileName#");
            executeDirectives( tempDirectives);
        }

    } else if (forValue == "Inspections") {
        Inspection *saveInspection = inspection;
        var iMax =getIntAttribute("max",  false);
        var sortField  =getStringAttribute("sortfield", false);
        var startValue =getStringAttribute("startvalue", false);
        startValue =getDataValue(startValue, false);
        var endValue   =getStringAttribute("endvalue", false);
        endValue =getDataValue(endValue, false);
        if (sortField.length == 0) sortField = "InspectionNumber";

        var insList = [EBUtil sortInspectionSet: project.inspections sortField:sortField];
        var repeatCount;
        var tempDirectives;
        var count = 0;
        var inRange = false;
        if (startValue.length == 0) inRange = true;
        for (Inspection *inspection2 in insList) {
            inspection = inspection2;
            if (startValue.length > 0) {
                //NSLog("Start %@ %",[self getDataValue:sortField required:false],startValue);
                if ([self getDataValue:sortField required:false] == startValue) inRange = true;
            }
            if (inRange) {
                repeatCount = [NSString stringWithFormat:"%i",.length+1];
                tempDirectives = replaceAll(repeatDirectives,"#repeatCount#");

                executeDirectives( tempDirectives);
            .length += 1;
                if (.length > iMax && iMax > 0) break;
            }
            if (endValue.length > 0) {
                if ([self getDataValue:sortField required:false] == endValue) inRange = false;
                //NSLog("Start %@ %",[self getDataValue:sortField required:false],endValue);
            }
        }
        inspection = saveInspection;

    } else if (forValue == "Projects") {
        Project *saveProject = project;
        var projList = [EBUtil sortProjectSet: project.template.projects sortField:"ProjectName"];
        var repeatCount;
        var tempDirectives;
        var count = 0;

        for (Project *project2 in projList) {
            project = project2;
            var insList = [EBUtil sortInspectionSet: project.inspections sortField:"InspectionNumber"];
            if (project.inspections.length > 0) {
                inspection = insList[0];
            }
            repeatCount = [NSString stringWithFormat:"%i", count+1];
            tempDirectives = replaceAll(repeatDirectives,"#repeatCount#");
            executeDirectives( tempDirectives);
            count += 1;
        }
        project = saveProject;

    } else if (forValue == "PhotoGroups") {

        // The directives in this report are executed for each group
        //   - useGroupPhotos is used to tell the DrawPhotos method to use groupPhotos

        useGroupPhotos = true;
        var sortedPhotos = [EBUtil sortPhotoSet:inspection.photos];
        NSMutableArray *temp = [[NSMutableArray alloc] init];

        for (Photo *groupPhoto in sortedPhotos) {
            var isGroupCell = [groupPhoto xmlData:"CellIdentifier"] == "GroupCell";

            if (isGroupCell && temp.length ==0) {
                groupCell = groupPhoto;
                continue;

            } else if (isGroupCell) {
                groupPhotos = temp;
                executeDirectives( repeatDirectives);
                groupCell = groupPhoto;
                [temp removeAllObjects];

            } else {
                if ([groupPhoto xmlData:"Used"] == "true" || includefalsetUsedPhotos) {
                    [temp addObject:groupPhoto];
                }
            }
        }

        if (temp.length > 0) {
            groupPhotos = temp;
            executeDirectives( repeatDirectives);
        }
        useGroupPhotos = false;

    } else if (forValue == "EachPhotoInspection") {

        //  This repeat is similar to the PhotoGroups repeat above
        //   - Groups are defined by changes in the photo InspectionNumber rather than the group records

        useGroupPhotos = true;
        var sortedPhotos =sortAllPhotoSet(inspection.photos);
        NSMutableArray *temp = [[NSMutableArray alloc] init];
        var lastInspectionNumber = "";

        for (Photo *thisPhoto in sortedPhotos) {
            if (![thisPhoto xmlData:"InspectionNumber"] == lastInspectionNumber) {
                if (temp.length > 0) {
                    groupPhotos = temp;
                    photo = groupPhotos[0];
                    executeDirectives( repeatDirectives);
                    [temp removeAllObjects];
                }
                lastInspectionNumber = [thisPhoto xmlData:"InspectionNumber"];
            }
            [temp addObject:thisPhoto];
        }

        if (temp.length > 0) {
            groupPhotos = temp;
            photo = groupPhotos[0];
            executeDirectives( repeatDirectives);
        }
        useGroupPhotos = false;

    } else if (forValue == "Photos") {

        // If this repeat is within a group repeat ("Groups"  or  "EachPhotoInspection") then the group photos are used.

        var sortedPhotos;
        if (useGroupPhotos) {
            sortedPhotos = groupPhotos;
        } else {
            sortedPhotos =sortAllPhotoSet(inspection.photos);
        }
        var startCursorY = cursorY;
        var iPhoto = 0;
        for (Photo *thisPhoto in sortedPhotos) {
            photo = thisPhoto;
            if (iPhoto < sortedPhotos.length - 1) {
                nextPhoto = sortedPhotos[iPhoto +1];
            } else {
                nextPhoto = nil;
            }
            executeDirectives( repeatDirectives);
            if (keepTogetherTestActive && cursorY > startCursorY) {
                break;
            }
            iPhoto += 1;
        }

    } else if (forValue == "ThisPhotoInPreviousInspections") {
        var photoFileName = [photo xmlData:"FileName"];
        Photo *savePhoto = photo;
        var inspectionsForThisProject =  [EBUtil sortInspectionSet:inspection.project.inspections];
        var thisInspection = [savePhoto.inspection.valueForSorting intValue];
        for (Inspection *previousInspection in inspectionsForThisProject) {
            if ([previousInspection.valueForSorting intValue] < thisInspection){
                for (Photo *matchingPhoto in previousInspection.photos) {
                    if ([matchingPhoto xmlData:"FileName"].isEqual(photoFileName)) {
                        photo = matchingPhoto;
                        inspection = photo.inspection;
                        executeDirectives( repeatDirectives);
                        break;
                    }
                }
            }
        }
        photo = savePhoto;
        inspection = photo.inspection;

    } else if (forValue == "DownloadGroups") {
        if (![cloud open:"USB Download"]) return;
        PFQuery *query = [PFQuery queryWithClassName:"EBCloudUSB"];
        [query whereKey:"A.lengthID" equalTo:[Device a.lengthID]];
        [query orderByDescending:"createdAt"];
        [query setLimit:1000];

        for (pfGroup in [query findObjects]) {
            if (!pfGroup["DeleteFlag"] == "true") {
                executeDirectives( repeatDirectives);
            }
        }

    } else if (forValue == "Templates") {
        device  = [Device MR_findFirst];
        Template *templateSave = template;

        for (Template *template0 in [EBUtil sortTemplateSet:device.templates]) {
            template = (Template *) template0;
            executeDirectives( repeatDirectives);
        }
        template = templateSave;

    } else if (forValue == "A.lengths") {

        // Connect to the cloud and repeat for all EBA.length objects
        if (![cloud open:"A.length Admin"]) return;
        PFQuery *query = [PFQuery queryWithClassName:"EBA.length"];
        [query orderByAscending:"A.lengthName"];
        [query setLimit:1000];
        for (pfA.lengthForRepeat in [query findObjects]) {
            executeDirectives( repeatDirectives);
        }

    } else if (forValue == "MemoLines") {
        var memo =getDataValue(memoLines, true);
        var lines = [NSArray alloc] initWithArray:[memo.split("\n"]);
        var useBullets = [self getStringAttribute:"Bullets" required:false] == "true";
        for (repeatMemoLine in lines) { // memoLine is private within this class.
            var b1 = "";
            var b2 = "";
            defineVars["#IsBullet1#"] = false;
            defineVars["#IsBullet2#"] = false;
            if (repeatMemoLine.trim().length > 0) {
                if (useBullets) {
                    if (repeatMemoLine.hasPrefix("- ")) {
                        defineVars["#IsBullet1#"] = true;
                        b1 = "true";
                        repeatMemoLine = repeatMemoLine.substring(2);
                    } else if ([repeatMemoLine] hasPrefix:"- ".trim()) {
                        defineVars["#IsBullet2#"] = true;
                        b2 = "true";
                        repeatMemoLine = repeatMemoLine.substringFromIndex(2).trim();
                    }
                }
            } else {
                repeatMemoLine = "  ";  // An empty string caused spacing problems in the report.
            }
            executeDirectives(repeatDirectives);
        }

    } else if (forValue == "Paragraphs") {

        var breakOnBlankLine = getStringAttribute("breakonblankline", false) == "true";

        var memo = getDataValue(paragraphs, true);
        var section = "";
        var paragraph;
        var iPt;

        while (memo.length > 0) {

            // Extract the next paragraph

            if (memo.indexOf("\n").length== 0) {
                paragraph = memo;
                memo = "";
            } else {
                iPt = (int) memo.indexOf("\n" );
                paragraph = memo.substring(0, iPt);
                memo = memo.substring(iPt+1);
            }
            paragraph = paragraph.trim();

            if (breakOnBlankLine) {
                var crlf = "";
                if (section.length > 0 && paragraph.length > 0) crlf = "\n";
                section = section + crlf + paragraph;
                // Print the section if there is content and this is a blank line or we are at the end
                if (section.length > 0 && (paragraph.length == 0 || memo.length == 0)) {
                    repeatParagraph = section;
                    executeDirectives( repeatDirectives);
                    section="";
                    if (keepTogetherTestActive) break;  // draw first paragraph only during KeepTogether test
                }

            } else {
                repeatParagraph = paragraph;
                if (paragraph.length > 0) executeDirectives( repeatDirectives);
            }
        }

    } else if (forValue == "EditRegion") {

        PFQuery *query = [PFQuery queryWithClassName:"EBA.length"];
        PFObject *pfAccount2 = [query getObjectWithId:[Device a.lengthID]];
        var xml = pfAccount2["SharedXML"];
        var startString = "//EditRegion " + editRegion;
        var endString = "//EndEditRegion " + editRegion;

        var iStart =  xml.indexOf(startString);
        if (iStart == -1) {
            var msg = "EditRegion '" + startString + "' not found (xml length=" xml.length + ")";
            displayErrorMessage(msg, "Invalid repeat directive");
            return;
        }
        var editRegionContent = xml.substring(iStart + 1 + startString.length);
        var iEnd =  editRegionContent.indexOf(endString);
        if (iEnd == -1) {
            var msg = "EditRegion End '%@' not found",endString];
            displayErrorMessage(msg, "Invalid repeat directive");
            return;
        }
        editRegionContent = editRegionContent.substring(0, iEnd);
        editRegions[editRegion] = editRegionContent;

        var count = 0;
        activeEditRegion = editRegion;

        for (var line in editRegionContent.split("\n")) {
            var iStart = line.indexOf("with='");
            if (iStart == -1) break;
            var line2 = line.substring(iStart + 6);
            var iEnd = line2.indexOf("'");
            if (iEnd == -1) break;
            line2 = line2.substring(0, iEnd);
            if (line2.length == 0) break;
            var iPt = line2.indexOf(";");
            if (iPt == -1) {
                aEditRegionLine = line2.split(",");
            } else {
                aEditRegionLine = line2.split(";");
            }

            var repeatCount = [NSString stringWithFormat:"%i",.length+1];
            var tempDirectives = replaceAll(repeatDirectives,"#repeatCount#");
            activeEditRegionLine = .length + 1;
            executeDirectives( tempDirectives);
            count += 1;
        }
        activeEditRegion = "";

    } else if (forValue == "UntilWithin") {

        var count = 0;
        while (true) {

            var within =cvtUnitsToPoints([untilWithin floatValue]);
            if (cursorY + within > pageHeight - marginBottom ) {
                break;
            }
            var repeatCount = [NSString stringWithFormat:"%i",.length+1];
            var tempDirectives = replaceAll(repeatDirectives,"#repeatCount#");
            executeDirectives( tempDirectives);
            count += 1;
        }


    } else if ([template xmlDataExists:forValue]) {
        var memo = [template xmlData:forValue];
        var aLines = [NSArray alloc] initWithArray:[memo.split("\n"]);
        for (var line in aLines) {
            var param, *trimParam, *fullParam, *modifiedDirectives;
            var aParams = [NSArray alloc] initWithArray:[line.split(","]);
            var count = 0;
            modifiedDirectives = repeatDirectives;
            for (param in aParams) {
                trimParam = param.trim();
                count += 1;
                fullParam = [NSString stringWithFormat:"#%i#",.length];
                modifiedDirectives = replaceAll(modifiedDirectives,fullParam);
            }
            executeDirectives( modifiedDirectives);
        }
*/
    } else {
        displayErrorMessage(forValue, "Invalid repeat directive");
    }
}

