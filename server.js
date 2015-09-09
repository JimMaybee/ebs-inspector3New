/*

 Server functions
   Purpose:
     	Provides CRUD plus renumber capabilities to backend server, currently implemented using Parse.com.
   
   
   Methods:   
   	 	serverLoadTable(tableName, fieldList, onSuccess) 	
   	 	serverListResult(msg,fieldList)
   	 	serverLoadRow(tableName, id, fieldList, onSuccess)
   	 	serverListRow(msg, fieldList)
   	 	serverUpdateRow(tableName, id, value, onSuccess)
   	 	serverAddRow(tableName, values, onSuccess)
   	 	serverDeleteRow(tableName, id, onSuccess)
   	 	serverRenumber(onSuccess)
*/ 

// Variables used by methods
var serverSortField = "";
var serverSortDescending = false;
var serverFilter = "";

// Variables set by methods
var serverTable = [];
var serverTableName = "";
var serverFieldList = [];
var serverSortField = "";
var serverFilter = "";

var serverRow = {}
var serverAddedRowID = 0;

Parse.initialize("gUHSeIQuYLKkgfAgYFd45PeM4HyZ13jBazLgm2dJ", "Vn4koodZ6470PEf3mgm2XbjuhpvLJTJTaaVXW55n");
	
function serverLoadTable(tableName, fieldList, onSuccess) {
	var ebTables = Parse.Object.extend(tableName);
	var query = new Parse.Query(ebTables);
	query.limit(1000);
	if (serverSortField.length > 0) {
		if (serverSortDescending) {
			query.descending(serverSortField);
		} else {
			query.ascending(serverSortField);
		}
	}
	
	serverTable = [];

	if (tableName == "EBProject") {
		serverFilter = "TemplateID=" + templateID;
	}

	if (serverFilter.length > 0) {
		params = serverFilter.split("=");
		query.equalTo(params[0], params[1]);
	}
		
	query.find({
    	success: function(results) {
    	    serverTableName = tableName;
			serverFieldList = arrayCopy(fieldList);
    		var row = {};
    		for (var iRow = 0; iRow < results.length; iRow++) {
    			var object = results[iRow];
    			for (var iField = 0; iField < fieldList.length; iField++) {
    				fieldName = fieldList[iField];
    				if (fieldName == "objectId") {
    					value = object.id;
    				} else {
    					value = object.get(fieldName);
    				}
    				row[fieldList[iField]] = value;
					if (tableName == "EBProject" || tableName == "EBInspection" || tableName == "EBPhoto") {
						var imageFile = object.get('image');
						if (imageFile) row["image"] = imageFile.url();
					}
					if (tableName == "EBInspection") {
						var reportFile = object.get('Report');
						if (reportFile) {
							row["report"] = reportFile.url();
							console.log("PDF=" + reportFile.url());
						}
					}
    			}

    			serverTable.push(arrayCopy(row));
    		}
    		eval(onSuccess);
    	},
    	error: function (error) {
        	alert("serverLoadTable() failed: " + error.code + " " + error.message);
		}
	});
}

function serverListTable(msg,fieldList) {
	console.log("SERVER TABLE: " + msg + " TableName=" + serverTableName + "  Sort field=" + serverSortField + "  Filter=" + serverFilter);
	for (iRow = 0; iRow < serverTable.length; iRow++) {
		s = iRow + ". ";
		nFields = fieldList.length;
		for (iField = 0; iField < nFields; iField++) {
			fieldName = fieldList[iField];
			s += fieldName + "=" + serverTable[iRow][fieldName] + "  ";
		}
		console.log(s);
	}
}
	
function serverLoadRow(tableName, id, fieldList, onSuccess) {
	var ebTables = Parse.Object.extend(tableName);
	var query = new Parse.Query(ebTables);
		
	query.get(id, {
  		success: function(object) {
  			serverRow = {};
  			for (var iField = 0; iField < fieldList.length; iField++) {
    			fieldName = fieldList[iField];
    			if (fieldName == "objectId") {
    				value = object.id;
    			} else {
    				value = object.get(fieldName);
    			}
    			key = fieldList[iField];
    			serverRow[key] = value;
    		}
    		eval(onSuccess);
  		},
  		error: function(object, error) {
  			alert("serverLoadRow() failed: " + error.code + " " + error.message);
  		}
	});
}

function serverLoadImage(tableName, id, fieldName, onSuccess) {

}

function serverListRow(msg,fieldList) {
	console.log("SERVER ROW: " + msg);
	nFields = fieldList.length;
	s = "";
	for (iField = 0; iField < nFields; iField++) {
		fieldName = fieldList[iField];
		s += fieldName + "=" + serverRow[fieldName] + "  ";
	}
	console.log(s);
}

function serverUpdateRow(tableName, id, values, onSuccess) {
	var ebTables = Parse.Object.extend(tableName);
	var ebTable = new ebTables();
    ebTable.set();
    ebTable.set("objectId", id);
    ebTable.save(null, {
	   	success: function(ebTable) {
	    	for (iValue = 0; iValue < Object.keys(values).length; iValue++) {
	    		key = Object.keys(values)[iValue];
				ebTable.set(key,values[key]);
			}
			ebTable.save();
			eval(onSuccess);
		},
		error: function(object, error) {
  			alert("ServerUpdateRow() failed: " + error.code + " " + error.message);
  		}
	});
}

function serverAddRow(tableName, values, onSuccess) {
	var ebTables = Parse.Object.extend(tableName);
	var ebTable = new ebTables();
	for (iValue = 0; iValue < Object.keys(values).length; iValue++) {
	 	key = Object.keys(values)[iValue];
		ebTable.set(key,values[key]);
	}

	ebTable.save(null, {
 		success: function(ebTable) {
  			serverAddedRowID = ebTable.id;
    		eval(onSuccess);
 		},
  		error: function(ebTable, error) {
			alert("serverAddRow() failed: " + error.code + " " + error.message);
		}
	});
}
	
function serverDeleteRow(tableName, id, onSuccess) {
	var ebTables = Parse.Object.extend(tableName);
	var query = new Parse.Query(ebTables);
	query.get(id, {
  		success: function(object) {
			object.destroy({
  				success: function(myObject) {
    				eval(onSuccess);
  				},
  				error: function(object, error) {
					alert("serverDeleteRow() failed: " + error.code + " " + error.message);
  				}
			});
  		},
  		error: function(object, error) {
    		alert("serverDeleteRow() failed (row " + id + " not found): " + error.code + " " + error.message);
  		}
	});
}
	
function serverRenumber(tableName,onSuccess) {

	var ebTables = Parse.Object.extend(tableName);
	var query = new Parse.Query(ebTables);
	query.ascending("Seq");
	var newSeq = 0;
	query.find({
    	success: function(results) {
    		error = false;
    		for (var i = 0; i < results.length; i++) {
    			var object = results[i];
    			var name = object.get("Name");
    			newSeq += 10;    				
    			object.set("Seq",zFill(newSeq));
    			object.save(null, {
					success: function(object) {

					},
					error: function(object, error) {
						alert("Server renumber failed: " + error.code + " " + error.message);
						error = true;
					}
				});
   			}
   			setTimeout(function() {
 				if (!error) eval(onSuccess);
			}, 1000);
		
    	},
    	error: function (error) {
        	alert("Server renumber failed: " + error.code + " " + error.message);
		}
	});
}

function xmlData(fieldName) {
	var s;
	var i;
	var value;
	i = activeXmlData.indexOf("<" + fieldName + " ");
	if (i<0) {
		//alert("Invalid Field name=" + fieldName + "\n" + activeXmlData);
		return "";
	}
	s = activeXmlData.substring(i + fieldName.length + 2);
	i = s.indexOf("value='");
	s = s.substring(i+7);
	i = s.indexOf("' /");
	value = s.substring(0,i);
	value = replaceAll(value,"%20"," ");
	return value;
}

function xmlDataUpdate(fieldName, value, xml) {
	var iPt1;
	var iPt2;
	var part1;
	var part2;
	if (xml == "") return "";
	value = replaceAll(value,"'", "''");
	iPt1 = xml.indexOf("<" + fieldName + " value='");

	if (iPt1 < 0) {
		xml += "<" + fieldName + " value='" + value + "' />\n";

	} else {
		part1 = xml.substring(0,iPt1 + fieldName.length + 9);
		xml = xml.substring(part1.length);
		iPt2 = xml.indexOf("' />");
		part2 = xml.substring(iPt2);
		xml = part1 + value + part2;
	}
	return xml;
}
