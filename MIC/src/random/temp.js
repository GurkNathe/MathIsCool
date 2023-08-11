/**
 * @license MIT
 *
 * © 2019-2020 xfanatical.com. All Rights Reserved.
 *
 * @since 1.1.2 interface fix
 * @since 1.1.1 Optimize performance (continued)
 * @since 1.1.0 Optimize performance
 * @since 1.0.0 Add all edit response urls and update new urls for new submissions
 */

//  Column Variable Names
var timestampCol = 1;
var coachCol = 2;
var uid = 3;
var siteCol = 4;
var gradeCol = 5;
var teamsCol = 6;
var individualsCol = 7;
var schoolcatCol = 8;
var emailCol = 9;
var compId = 10;
var editurlCol = 11;
var invoiceCol = 12;
var schoolidCol = 13;
var schoolCol = 14;
var cityCol = 15;
var divisionCol = 16;

function parseSchool(schoolInfo) {
	let info = [];
	info.push(schoolInfo.substring(0, 5));
	info.push(schoolInfo.substring(5, schoolInfo.indexOf("~")));
	info.push(
		schoolInfo.substring(schoolInfo.indexOf("~") + 1, schoolInfo.length - 4)
	);
	info.push(schoolInfo.substring(schoolInfo.length - 1, schoolInfo.length));
	return info;
}

function onOpen() {
	var sheet = SpreadsheetApp.getActiveSheet();
	var spreadsheet = SpreadsheetApp.getActive();

	// Check if there is a linked form, and alerts the user if there isn't
	var formURL = sheet.getFormUrl();
	if (!formURL) {
		SpreadsheetApp.getUi().alert(
			"No Google Form associated with this sheet. Please connect it from your Form."
		);
		return;
	}
	var form = FormApp.openByUrl(formURL);

	// Setup the header if not existed
	var headerFormEditResponse = sheet.getRange(1, getFormUrlColumn(sheet));
	var title = headerFormEditResponse.getValue();
	if (!title) {
		headerFormEditResponse.setValue("Form Response Edit URL");
	}

	// Get the timestamp and form url column
	var timestampColumn = getTimestampColumn(sheet);
	var editResponseUrlColumn = getFormUrlColumn(sheet);

	var timestampRange = undefined;
	var editResponseUrlRange = undefined;

	// If there are no responses, don't get the ranges
	if (sheet.getLastRow() > 1) {
		timestampRange = sheet.getRange(
			2,
			timestampColumn,
			sheet.getLastRow() - 1,
			1
		);
		editResponseUrlRange = sheet.getRange(
			2,
			editResponseUrlColumn,
			sheet.getLastRow() - 1,
			1
		);
	}

	// If the range isn't undefined (there are responses), continue
	if (editResponseUrlRange) {
		var editResponseUrlValues = editResponseUrlRange.getValues();
		var timestampValues = timestampRange.getValues();
		for (var i = 0; i < editResponseUrlValues.length; i += 1) {
			var editResponseUrlValue = editResponseUrlValues[i][0];
			var timestampValue = timestampValues[i][0];
			if (editResponseUrlValue === "") {
				var timestamp = new Date(timestampValue);
				if (timestamp) {
					var formResponse = form.getResponses(timestamp)[0];
					editResponseUrlValues[i][0] = formResponse.getEditResponseUrl();
					var row = i + 2;
					if (row % 10 === 0) {
						spreadsheet.toast("processing rows " + row + " to " + (row + 10));
						editResponseUrlRange.setValues(editResponseUrlValues);
						SpreadsheetApp.flush();
					}
				}
			}
		}

		editResponseUrlRange.setValues(editResponseUrlValues);
		SpreadsheetApp.flush();
	}

	// If no Form Submit trigger is added, add one
	registerNewEditResponseURLTrigger();
}

function registerNewEditResponseURLTrigger() {
	// Check if form url trigger is already registered
	var existingTriggerId = PropertiesService.getUserProperties().getProperty(
		"onFormSubmitTriggerID"
	);
	if (existingTriggerId) {
		var foundExistingTrigger = false;
		ScriptApp.getProjectTriggers().forEach(function (trigger) {
			if (trigger.getUniqueId() === existingTriggerId) {
				foundExistingTrigger = true;
			}
		});
		if (foundExistingTrigger) {
			return;
		}
	}

	var trigger = ScriptApp.newTrigger("onFormSubmitEvent")
		.forSpreadsheet(SpreadsheetApp.getActive())
		.onFormSubmit()
		.create();

	PropertiesService.getUserProperties().setProperty(
		"onFormSubmitTriggerID",
		trigger.getUniqueId()
	);
}

function onFormSubmitEvent(e) {
	var sheet = e.range.getSheet();
	var form = FormApp.openByUrl(sheet.getFormUrl());
	var formResponse = form.getResponses().pop();
	addEditResponseURLToSheet({
		sheet: sheet,
		form: form,
		formResponse: formResponse,
		row: e.range.getRow(),
		col: getFormUrlColumn(sheet),
	});
}

function getTimestampColumn(sheet) {
	for (var i = 1; i <= sheet.getLastColumn(); i += 1) {
		if (sheet.getRange(1, i).getValue() === "Timestamp") {
			return i;
		}
	}
	return 1;
}

function getFormUrlColumn(sheet) {
	var form = FormApp.openByUrl(sheet.getFormUrl());
	for (var i = 1; i <= sheet.getLastColumn(); i += 1) {
		if (sheet.getRange(1, i).getValue() === "Form Response Edit URL") {
			return i;
		}
	}
	// get the last column at which the url can be placed.
	return Math.max(sheet.getLastColumn() + 1, form.getItems().length + 2);
}

/**
 * params: { sheet, form, formResponse, row }
 */
function addEditResponseURLToSheet(params) {
	// If the column for the form url isn't present, add it
	if (!params.col) {
		params.col = getFormUrlColumn(params.sheet);
	}
	var formResponseEditUrlRange = params.sheet.getRange(params.row, params.col);
	formResponseEditUrlRange.setValue(params.formResponse.getEditResponseUrl());

	var schoolCat = params.sheet.getRange(params.row, schoolcatCol).getValue();
	var schoolinfo = schoolCat.split("~");
	params.sheet.getRange(params.row, schoolidCol).setValue(schoolinfo[0]);
	params.sheet.getRange(params.row, schoolCol).setValue(schoolinfo[1]);
	params.sheet.getRange(params.row, cityCol).setValue(schoolinfo[2]);
	params.sheet.getRange(params.row, divisionCol).setValue(schoolinfo[3]);
	params.sheet
		.getRange(params.row, emailCol)
		.setValue(params.sheet.getRange(params.row, emailCol).getValue().trim());

	var invoice =
		Math.floor(params.sheet.getRange(params.row, 1).getValue() / 1000) %
		1000000000;
	var message =
		"Hello " +
		params.sheet.getRange(params.row, coachCol).getValue() +
		",\n\nThank you for registering ";
	message =
		message +
		params.sheet.getRange(params.row, teamsCol).getValue() +
		"  " +
		params.sheet.getRange(params.row, gradeCol).getValue();
	message =
		message +
		"th grade teams and " +
		params.sheet.getRange(params.row, individualsCol).getValue();
	message =
		message +
		" individuals, \nfrom " +
		params.sheet.getRange(params.row, schoolCol).getValue() +
		" at ";
	message =
		message +
		params.sheet.getRange(params.row, siteCol).getValue() +
		"\n\nIf you need to change your registration, please use the link ";
	message =
		message +
		params.formResponse.getEditResponseUrl() +
		".\nDo not share the link as anyone can change the registration with it.\n\n";

	message =
		message +
		"The invoice can be viewed and paid using the link:\nhttp://www.academicsarecool.com/oldsite/invoice1.php?c4=";
	message =
		message +
		params.sheet
			.getRange(params.row, schoolCol)
			.getValue()
			.replace(/ /g, "%20") +
		"&c6=" +
		params.sheet.getRange(params.row, teamsCol).getValue();
	message =
		message +
		"&c1=" +
		params.sheet.getRange(params.row, 1).getValue().getTime();
	message =
		message +
		"&c7=" +
		params.sheet.getRange(params.row, individualsCol).getValue();
	message =
		message +
		"&c8=" +
		params.sheet.getRange(params.row, gradeCol).getValue() +
		"&c12=" +
		invoice;
	message =
		message +
		"&site=" +
		params.sheet.getRange(params.row, siteCol).getValue().replace(/ /g, "%20") +
		"\n\n";
	params.sheet.getRange(params.row, invoiceCol).setValue(invoice);

	var subject =
		params.sheet.getRange(params.row, gradeCol).getValue() +
		"th Grade Math is Cool Registration";
	MailApp.sendEmail(
		params.sheet.getRange(params.row, emailCol).getValue(),
		subject,
		message
	);

	/* http://www.academicsarecool.com/oldsite/invoice1.php?c4=Marvista&c6=3&c1=42111.2&c7=1&c8=6  */
}
