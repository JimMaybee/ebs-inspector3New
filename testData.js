
// The data model with templates --> projects --> inspections --> photos

"use strict";

var templates = [{templateName: 'Inspection Report', projects:
    [{projectName: 'Project1', clientName: 'Client1', inspections:
        [{inspectionNumber: 1, inspectorName: 'Ins1', photos:[
            {photoNumber: 1, fileName:"Photo1.jpg"},
            {photoNumber: 2, fileName:"Photo2.jpg"}
        ]},
            {inspectionNumber: 2, inspectorName: 'Ins2',photos:[
                {photoNumber: 1, fileName:"Photo3.jpg"},
                {photoNumber: 2, fileName:"Photo4.jpg"}
            ]},
            {inspectionNumber: 3, inspectorName: 'Ins3',photos:[]}]},
        {projectName: 'Project2', clientName: 'Client2', inspections:
            [{inspectionNumber: 1, inspectorName: 'Ins2-1',photos:[]},
                {inspectionNumber: 2, inspectorName: 'Ins2-2',photos:[]},
                {inspectionNumber: 3, inspectorName: 'Ins2-3',photos:[]}]}
    ]}];


// Active row numbers
var iTemplate = 0;
var iProject = 0;
var iInspection = 0;
var iPhoto = 0;

// Pointers for active lists
var projects = templates[iTemplate].projects;
var inspections = projects[iProject].inspections;
var photos = inspections[iInspection].photos;

// Pointers for active forms
var template = templates[iTemplate];
var project = projects[iProject];
var inspection = inspections[iInspection];
var photo = photos[iPhoto];

// End
