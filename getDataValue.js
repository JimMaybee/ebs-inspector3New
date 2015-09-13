// getDataValue.js

"use strict";


function getDataValue(fieldName, required) {


    //  This method gets the data value for the data parameter
    //  Database references must start with template.  project.  inspection.   photo.  or  photogroup.
    //  Settings form references can also be made using  device.   user.   photos.   and   email.
    //

    if (fieldName == "#ValidationField#") fieldName = validationField;

    /*
     if (memoHeightValidationActive) {
     fieldName = replaceAll(fieldName, "project.");
     fieldName = replaceAll(fieldName, "inspection.");
     fieldName = replaceAll(fieldName, "photo.");
     }
     */
    var formatSpecifierType;
    var formatSpecifier = "";
    var value = "";
    var fmtLocn;

    // Set formatSpecifierType if a format specified is present
    formatSpecifierType = "string";
    fmtLocn = fieldName.indexOf(":string ");

    if (fmtLocn == -1) {
        formatSpecifierType = "memotrim";
        fmtLocn = fieldName.indexOf(":memotrim");
    }
    if (fmtLocn == -1) {
        formatSpecifierType = "memoconcat";
        fmtLocn = fieldName.indexOf(":memoconcat");
    }
    if (fmtLocn == -1) {
        formatSpecifierType = "integer";
        fmtLocn = fieldName.indexOf(":integer ");
    }
    if (fmtLocn == -1) {
        formatSpecifierType = "date";
        fmtLocn = fieldName.indexOf(":date ");
    }
    if (fmtLocn == -1) {
        formatSpecifierType = "time";
        fmtLocn = fieldName.indexOf(":time ");
    }
    if (fmtLocn == -1) {
        formatSpecifierType = "bool";
        fmtLocn = fieldName.indexOf(":var ");
    }
    if (fmtLocn == -1) {
        formatSpecifierType = "mask";
        fmtLocn = fieldName.indexOf(":mask ");
    }

    if (fmtLocn == -1) {
        formatSpecifierType = "";

    } else {
        if (!formatSpecifierType.hasPrefix("memo")) formatSpecifier = fieldName.substring(fmtLocn) + formatSpecifierType.length + 2;
        fieldName = fieldName.substring(0, fmtLocn);
    }


    if (fieldName.hasPrefix("?")) return getDataValueFromChoices(fieldName);


    if (fieldName.hasPrefix("#")) {
        if (fieldName.toLowerCase() == "#var#") {
            return +varValue;

        } else if (fieldName.toLowerCase() == "#paragraph#") {
            return repeatParagraph;

        } else if (fieldName.toLowerCase() == "#documentsfolder#") {
            //var dir = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true)[0];
            //dir = dir.replaceAll("/Users/jmaybee/Library/Developer/CoreSimulator/Devices/");
            //return dir;
            alert("#documentsfolder# not supported.");
            return "";

        } else if (fieldName == "#FormType#") {
            return "Display";
            //return formType;

        } else {
            var name = fieldName.trim();
            if (defineVars[name] != undefined) return defineVars[name];
            if (name.length == 3) return "";   // Undefined parameters (i.e. #1#) are returned as blank.
        }
    }

    var value = "";
    if (fieldName == "MemoHeight") {
        //value = [NSString stringWithFormat:"%.04f", setMemoHeight];

    } else if (fieldName == "PhotoHeight") {
        //value = [NSString stringWithFormat:"%.04f", setPhotoHeight];

    } else if (fieldName == "PhotoWidth") {
        //value = [NSString stringWithFormat:"%.04f", setPhotoWidth];

    } else if (fieldName == "PDFFileName") {
        //value = pdfFileName;
        //if (value.length > 4) {
        //    value = value.substring(0, value.length-4);
        //}

    } else if (fieldName == "MemoLine") {
        //value = repeatMemoLine;

    } else if (fieldName.hasPrefix("MemoLine.")) {
        //var fields = repeatMemoLine.split(",");
        //var idx = (int) [fieldName.substring(9] integerValue);
        //if (idx < 1 || idx > fields.length) {
        //    value = "";
        //} else {
        //    value = fields[idx-1];
        //}

    } else if (fieldName.hasPrefix("EditRegion.")) {

        //var idx = (int) [fieldName.substring(11] integerValue);
        //if (idx < 1 || idx > aEditRegionLine.length) {
        //    value = "";
        //} else {
        //    value = aEditRegionLine[idx-1].trim();
        // }

    } else if (fieldName == "PageNumber") {
        //value = [NSString stringWithFormat:"%i",pageNumber];

    } else if (fieldName == "PageCount") {
        //value = [NSString stringWithFormat:"%i",numberOfPages];

    } else if (fieldName == "Year") {
        //NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
        //[dateFormat setDateFormat:"yyyy"];
        //value = [dateFormat stringFromDate:[NSDate date]];

    } else if (fieldName == "SystemDate") {
        //NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
        //[dateFormat setDateFormat:"MMM d yyyy"];
        //value = [dateFormat stringFromDate:[NSDate date]];

    } else if (fieldName.hasPrefix("ArrowStyles")) {
        //var styleNames = [arrowStyles allKeys];
        //value = [styleNames componentsJoinedByString:","];

    } else if (fieldName == "ListKey") {
        //value = controlListKey;

    } else if (fieldName == "ListValue") {
        //value = controlListValue;

    } else if (fieldName.hasPrefix("project.xml")) {
        //value = template.templateXML;

    } else if (fieldName.hasPrefix("project.next.")) {
        fieldName = fieldName.substring(13);
        //value = [template xmlNext:fieldName];

    } else if (fieldName.hasPrefix("project.last.")) {
        fieldName = fieldName.substring(13);
        //value = [template xmlLast:fieldName];

    } else if (fieldName.hasPrefix("project.serverID")) {
        value = project.serverID;

    } else if (fieldName.hasPrefix("project.HasInspections")) {
        //value = (project.inspections.length > 0) ? "true":"false";

    } else if (fieldName.hasPrefix("inspection.next.")) {
        fieldName = fieldName.substring(16);
        //value = [project xmlNext:fieldName];

    } else if (fieldName.hasPrefix("inspection.last.")) {
        fieldName = fieldName.substring(16);
        //value = [project xmlLast:fieldName];

    } else if (fieldName.hasPrefix("inspection.serverID")) {
        value = inspection.serverID;

    } else if (fieldName.hasPrefix("photo.next.")) {
        fieldName = fieldName.substring(11);
        //value = [inspection xmlNext:fieldName];

    } else if (fieldName.hasPrefix("photo.last.")) {
        fieldName = fieldName.substring(11);
        //value =  [inspection xmlLast:fieldName];

    } else if (fieldName.hasPrefix("photo.InsAndPhotoNumber")) {
        //value = [NSString stringWithFormat:"%@-%",[photo xmlData:"InspectionNumber"],[photo xmlData:"PhotoNumber"]];

    } else if (fieldName.hasPrefix("photo.serverID")) {
        value = photo.serverID;

    } else if (fieldName.hasPrefix("photo.DateAdded")) {
        //NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
        //[dateFormat setDateFormat:"MMM d yyyy"];
        //value = [dateFormat stringFromDate:photo.dateAdded];

    } else if (fieldName.hasPrefix("form.")) {  // Used within the validation directives to reference form fields.
        //fieldName = fieldName.substring(5);
        //value = [EBxml xmlData:fieldName usingXML:formXMLData];

    } else if (fieldName.hasPrefix("ctl.")) {
        /*
         fieldName = fieldName.substring(4);
         for (UIView *v in view.subviews) {
         var ctlFieldName = inputControls[v.tag]["FieldName"];
         if ([v isKindOfClass:[UITextField class]]) {

         if ([ctlFieldName hasSuffix: fieldName]) {
         UITextField *tf = (UITextField *)v;
         value = tf.text;
         break;
         }

         } else if ([v isKindOfClass:[UITextView class]]) {

         if ([ctlFieldName hasSuffix: fieldName]) {
         UITextView *tv = (UITextView *)v;
         value = tv.text;
         break;
         }

         } else if ([v isKindOfClass:[CheckBox class]]) {
         CheckBox *chk = (CheckBox *)v;
         if ([ctlFieldName hasSuffix: fieldName]) {
         if (chk.currentState == 1) {
         value = "true";
         } else {
         value = "false";
         }
         break;
         }
         }
         }
         fieldName = fieldName.substring(1);
         */

    } else if (fieldName.hasPrefix("template.")) {
        fieldName = fieldName.substring(9);
        if (fieldName.isEqual("count")) {
            value = templates.length;
        } else {
            value = template[fieldName];
        }

    } else if (fieldName.hasPrefix("project.")) {
        fieldName = fieldName.substring(8);
        if (fieldName.isEqual("count")) {
            value = projects.length;
        } else {
            value = project[fieldName];
        }

    } else if (fieldName.hasPrefix("inspection.")) {
        fieldName = fieldName.substring(11);
        if (fieldName.isEqual("count")) {
            value = inspections.length;
        } else {
            value = inspection[fieldName];
        }

    } else if (fieldName.hasPrefix("photo.")) {
        fieldName = fieldName.substring(6);
        if (fieldName.isEqual("count")) {
            value = photo.length;

        } else if (fieldName == "lowrescount") {
            //var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
            //var photosDirectory = [NSString stringWithFormat:"%@/Photos",paths[0]];
            //var directoryContent = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:photosDirectory error:nil];
            //value =  [NSString stringWithFormat:"%i",(int) directoryContent.length];

        } else if (fieldName == "hirescount") {
            // var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
            // var photosDirectory = [NSString stringWithFormat:"%@/HiResPhotos",paths[0]];
            // var directoryContent = [[NSFileManager defaultManager] contentsOfDirectoryAtPath:photosDirectory error:nil];
            // value = [NSString stringWithFormat:"%i",(int) directoryContent.length];

        } else {
            if (fieldName.isEqual("PhotoDisplayNumber")) {
                //value = photo.photoDisplayNumber;
            } else {
                value = photo[fieldName];
            }
        }

        /*
         } else if (fieldName.hasPrefix("photogroup.")) {
         if (useGroupPhotos) {  // Is this a reporting "repeat for photogroups" directive?
         fieldName = fieldName.substring(11);
         if (fieldName == "PhotoGroupDisplayNumber") {
         value = [groupCell photoGroupDisplayNumber];
         } else {
         value = [groupCell xmlData:fieldName];
         }
         } else if ([photo xmlData:"CellIdentifier"] == "GroupCell") {
         fieldName = fieldName.substring(11);
         value = [photo xmlData:fieldName];
         } else {
         var msg = [NSString stringWithFormat:"Invalid reference to photogroup data = %",fieldName];
         displayErrorMessage(msg , "Invalid directive");
         value = "* Error *";
         }

         } else if (fieldName.hasPrefix("downloadgroup.")) {
         fieldName= fieldName.substring(14);
         if (fieldName == "objectId") {
         value = pfGroup.objectId;

         } else if (fieldName == "CreatedAt") {
         NSDateFormatter *dateFormat = [[NSDateFormatter alloc] init];
         [dateFormat setDateFormat:"MMM d yyyy HH:mm"];
         var dateString = [dateFormat stringFromDate:pfGroup.createdAt];
         value = dateString;

         } else if (fieldName == "CreatedBy") {
         PFQuery *query2 = [PFQuery queryWithClassName:"EBDevice"];
         PFObject *pfDevice2 = [query2 getObjectWithId:pfGroup["CreateDeviceID"]];
         value = pfDevice2["DisplayName"];

         } else {
         value = pfGroup[fieldName];
         }


         } else if (fieldName.hasPrefix("account.")) {
         fieldName = fieldName.substring(8);
         if (fieldName == "A.lengthName") {
         value = [Device a.lengthName];
         } else if (cloud.opened) {
         value = cloud.pfA.length[fieldName];
         } else {
         value = "";
         }

         } else if (fieldName.hasPrefix("accounts.")) {
         fieldName= fieldName.substring(9);
         if (fieldName == "objectId") {
         value = pfA.lengthForRepeat.objectId;
         } else {
         value = [pfA.lengthForRepeat[fieldName] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
         }

         } else if (fieldName.hasPrefix("devices.")) {
         fieldName= fieldName.substring(8);
         if (fieldName == "objectId") {
         value = pfDevice.objectId;
         } else {
         value = [pfDevice[fieldName] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
         }

         } else if (fieldName.hasPrefix("templates.")) {
         fieldName= fieldName.substring(10);
         if (fieldName == "objectId") {
         value = pfDevice.objectId;
         } else {
         value = [pfTemplate[fieldName] stringByReplacingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
         }

         } else if (fieldName.hasPrefix("devicesetup.")) {
         fieldName = fieldName.substring(12);
         value = [device xmlDeviceData:fieldName];

         } else if (fieldName.hasPrefix("device.")) {
         fieldName = fieldName.substring(7);
         var fieldName2 = [fieldName lowercaseString];
         if (fieldName2 == "builddate") {
         value = [Device buildDate];
         } else if (fieldName2 == "dropboxfolder") {
         value = [Device dropboxFolder];
         } else {
         value = [device xmlDeviceData:fieldName];
         }

         } else if (fieldName.hasPrefix("user.")) {
         fieldName = fieldName.substring(5);
         value = [device xmlUserData:fieldName];

         } else if (fieldName.hasPrefix("photosetup.")) {
         fieldName = fieldName.substring(11);
         value = [device xmlPhotoData:fieldName];

         } else if (fieldName.hasPrefix("email.")) {
         fieldName = fieldName.substring(6);
         value = [device xmlEMailData:fieldName];

         } else if (fieldName.hasPrefix("emailsetup.")) {
         fieldName = fieldName.substring(11);
         value = [device xmlEMailData:fieldName];

         } else if (fieldName.hasPrefix("cloud.")) {
         fieldName = fieldName.substring(6);
         if (fieldName == "ActivityLog") {
         cloud = [EBCloud shared];
         value = cloud.activityLog;
         } else {
         value = [device xmlCloudData:fieldName];
         }
         */
    } else {
        value = fieldName;
    }

    /*
     if (value.hasPrefix("List:") && controlListKey.length > 0) {
     // While in a <DrawControlList> loop, extract the matching value
     var matchingValue = "";
     var aValues = value.substring(5).split(",");
     if (aValues.length > 0) {
     for (var thisValue in aValues) {
     if (thisValue.hasPrefix(controlListKey)) {
     matchingValue = thisValue.split(":"][1);
     }
     }
     value = matchingValue;
     }
     }
     */

    if (value == undefined) value = "";
    //value = value.replaceAll("&quot;", "'");

    /*
     if (formatSpecifierType.length > 0 && value.length > 0) {
     if (formatSpecifierType == "string") {
     if (formatSpecifier == "RemoveFileType") {
     value = value.substring(0, value.length-4);
     } else {
     value = [NSString stringWithFormat:formatSpecifier,value];
     }

     } else if (formatSpecifierType == "memotrim") {
     var done = false;
     while (!done) {
     if ([value hasSuffix:"\n"] || [value hasSuffix:" "]) {
     value = value.substring(0, value.length-1);
     } else {
     done = true;
     }
     }
     value = value + "\n\n";

     } else if (formatSpecifierType == "memoconcat") {
     var result = "";
     var lines = [NSArray alloc] initWithArray:[value.split("\n"]);
     var first = true;
     for (var line in lines) {
     if (line.trim().length > 0) {
     if (first) {
     result = line;
     first = false;
     } else {
     result = [NSString stringWithFormat:"%@ %",result,line].trim();
     }
     }
     }
     value = result;

     } else if (formatSpecifierType == "mask") {
     value = [EBUtil sortVal:value usingSortMask: formatSpecifier];

     } else if (formatSpecifierType == "integer"){
     if ([EBUtil isNumeric:value]) {
     value = [NSString stringWithFormat:formatSpecifier,[value integerValue]];
     }

     } else if (formatSpecifierType == "date") {
     value =cleanDate(value);
     if (formatSpecifier == "yymmdd") {
     if (value.length == 8) {  // Date in mm/dd/yy format?
     value = replaceAll(value,"/");

     } else {
     var d = [NSArray alloc] initWithArray:[value.split(" "]);
     if (d.length != 3) {
     value="";
     } else {
     NSRange locn3 = "JanFebMarAprMayJunJulAugSepOctfalsevDec".indexOf(d[0]);
     if (locn3.location == -1 || ((var ) d[0]).length!=3) {
     value="";
     } else {
     var iMonth = (int) locn3.location/3 + 1;
     var iDay = [(var ) d[1] intValue];
     var iYear = [(var ) d[2] intValue];
     iYear = iYear - 2000;  // Will fail in 87 years :)
     value = [NSString stringWithFormat:"%02d%02d%02d",iYear,iMonth,iDay];
     }
     }
     }

     } else if (formatSpecifier == "yyyymmdd") {
     var d = [NSArray alloc] initWithArray:[value.split(" "]);
     if (d.length != 3) {
     value="";

     } else {
     NSRange locn3 = "JanFebMarAprMayJunJulAugSepOctfalsevDec".indexOf(d[0]);
     if (locn3.location == -1 || ((var ) d[0]).length!=3) {
     value="";
     } else {
     var iMonth = (int) locn3.location/3 + 1;
     var iDay = [(var ) d[1] intValue];
     var iYear = [(var ) d[2] intValue];
     //iYear = iYear - 2000;  // Will fail in 87 years :)
     value = [NSString stringWithFormat:"%04d-%02d-%02d",iYear,iMonth,iDay];
     }
     }

     } else if (formatSpecifier == "long") {

     var d = [NSArray alloc] initWithArray:[value.split(" "]);
     if (d.length != 3) {
     value="";
     } else {
     NSRange locn3 = "JanFebMarAprMayJunJulAugSepOctfalsevDec".indexOf(d[0]);
     if (locn3.location == -1 || ((var ) d[0]).length!=3) {
     value="";
     } else {
     var iMonth = (int) locn3.location/3 + 1;
     var iDay = [(var ) d[1] intValue];
     var iYear = [(var ) d[2] intValue];
     //iYear = iYear - 2000;  // Will fail in 87 years :)
     var months = @["January", "February","March","April","May","June","July","August","September","October","falsevember","December"];
     value = [NSString stringWithFormat:"%@ %i, %04d",months[iMonth-1],iDay,iYear];
     }
     }

     } else {

     NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
     [dateFormatter setDateFormat:"MMM d yyyy"];
     NSDate *dateValue = [dateFormatter dateFromString:value];
     [dateFormatter setDateFormat:formatSpecifier];
     value = [dateFormatter stringFromDate:dateValue];
     }
     }

     } else if (formatSpecifierType == "time") {

     } else if (formatSpecifierType == "bool") {

     }
     */
    return value; //[EBUtil decode:value];
}


function getDataValuesFromChoices(fieldName) {
    /*
     var s = fieldName.substring(1);
     var aValues  = s.split(";");
     var last = aValues.length - 1;
     if (!aValues[last].hasPrefix("else")) {
     displayErrorMessage("Missing 'else' value", "Report XML error");
     return "";
     }
     var testValue = getDataValue(aValues[0], true);

     for (var idx=1; idx < last; idx++) {
     var aVal = [NSArray alloc] initWithArray:[aValues[idx].split(":"]);
     if (testValue == aVal[0]]) return [self getDataValue:aVal[1] required:true;
     }
     var aVal = [NSArray alloc] initWithArray:[aValues[last].split(":"]);
     return aVal[1];
     */
    return fieldName;
}
/*
function getDataValue(fieldName) {
    return getDataValue(fieldName, false);
}
*/
