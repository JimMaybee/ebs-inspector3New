

"use strict";

/*
function drawImageControl() {
    var width       =getFloatAttributeInPoints("width",  true);
    var height      =getFloatAttributeInPoints("height",  true);
    var data    =getStringAttribute("data",  true);

    var bundle1 =getStringAttribute("bundle",  false);
    var bundle = bundle1 == "true";

    photoMarkup  = [EBPhotoMarkup buttonWithType:UIButtonTypeCustom];
    photoMarkup.frame = CGRectMake(cursorX, cursorY, width, height);

    if (bundle) {
        var paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, true);
        var documentsPath = [paths objectAtIndex:0];

        var fullName = [NSString stringWithFormat:"Images/%",data];
        var filePath = [documentsPath stringByAppendingPathComponent:fullName];
        UIImage *image = [UIImage imageWithContentsOfFile:filePath];

        UIButton *btn = [UIButton buttonWithType: UIButtonTypeCustom];
        btn.frame = CGRectMake(cursorX , cursorY , width,height);
        [btn setImage:image forState:UIControlStatefalsermal];
        [view addSubview: btn];

    } else {

        photoMarkup.photoFileName     = [photo xmlData:"FileName"];
        photoMarkup.accessibilityHvar = photoMarkup.photoFileName;
        if ([photo xmlData:"Markup"].length == 0) {
            photoMarkup.arrowStyle  = [arrowStyles objectForKey:[device xmlPhotoData:"PhotoMarkupArrowStyle"]];
            if ([device xmlPhotoData:"PhotoMarkupColor"].length == 0) {
                photoMarkup.color       = [EBUtil cvtColor:"Yellow"];
                photoMarkup.colorName   = "Yellow";
            } else {
                photoMarkup.color       = [EBUtil cvtColor:[device xmlPhotoData:"PhotoMarkupColor"]];
                photoMarkup.colorName   = [device xmlPhotoData:"PhotoMarkupColor"];
            }
            photoMarkup.numberOfPoints = 0;

        } else {

            loadv02MarkupToPhotoMarkup( [photo, "Markup"]);
        }

        [inputControls addObject:@{"FieldName":data,"FieldType":"Image"}];
        photoMarkup.tag = nextTagToAssign;

        nextTagToAssign += 1;
        [view addSubview: photoMarkup];

        if (numberOfTapsRequired > 0) {
            recognizer = [[UITapGestureRecognizer alloc]
                initWithTarget: self
            action: @selector(tapRequest:)];
            recognizer.delegate = self;
            recognizer.numberOfTapsRequired = numberOfTapsRequired;
            [photoMarkup addGestureRecognizer: recognizer];
        }
    }
}
*/
