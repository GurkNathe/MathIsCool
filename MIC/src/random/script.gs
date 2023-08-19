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

/**
 * FirestoreApp Library ID: 1VUSl4b1r1eoNcRWotZM3e87ygkxvXltOgyDZhixqncz9lQ3MjfT1iKFw
 * A  1: Timestamp
 * B  2: Coach Name
 * C  3: UID
 * D  4: Competition location
 * E  5: Competition Level
 * F  6: Number of Teams
 * G  7: Number of Individuals
 * H  8: School Information
 * I  9: Emails
 * J 10: Competition Id
 * K 11: Form Response Edit URL
 * L 12: Invoice
 * M 13: School ID
 * N 14: School Name
 * O 15: School City
 * P 16: School Division
 */

//  Column Variable Names
var timestamp = 1;
var coachName = 2;
var uid = 3;
var compLoc = 4;
var compLev = 5;
var numTeams = 6;
var numIndivs = 7;
var schoolInfo = 8;
var emails = 9;
var compId = 10;
var editUrl = 11;
var invoice = 12;
var schoolId = 13;
var schoolName = 14;
var schoolCity = 15;
var schoolDiv = 16;

// Used as a set up function for the spreadsheet
function setUp() {
	let sheet = SpreadsheetApp.getActiveSheet();

	// Check if there is a linked form, and alerts the user if there isn't
	let formURL = sheet.getFormUrl();
	if (!formURL) {
		SpreadsheetApp.getUi().alert(
			"No Google Form associated with this sheet. Please connect it from your Form."
		);
		return;
	}
	let form = FormApp.openByUrl(formURL);

	// Get form url column and set up the header if it doesn't exist
	let urlCol = getFormUrlColumn(sheet);
	if (!sheet.getRange(1, urlCol).getValue()) {
		sheet.getRange(1, urlCol).setValue("Form Response Edit URL");
		sheet.getRange(1, urlCol + 1).setValue("Invoice");
		sheet.getRange(1, urlCol + 2).setValue("School ID");
		sheet.getRange(1, urlCol + 3).setValue("School Name");
		sheet.getRange(1, urlCol + 4).setValue("School City");
		sheet.getRange(1, urlCol + 5).setValue("School Division");
	}

	// Get the timestamp column
	let timestampColumn = getTimestampColumn(sheet);

	let timestampRange = undefined;
	let editResponseUrlRange = undefined;

	// If there are no responses, don't get the ranges
	if (sheet.getLastRow() > 1) {
		timestampRange = sheet.getRange(
			2,
			timestampColumn,
			sheet.getLastRow() - 1,
			1
		);
		editResponseUrlRange = sheet.getRange(2, urlCol, sheet.getLastRow() - 1, 1);
	}

	// If the range isn't undefined (there are responses), continue
	if (editResponseUrlRange) {
		// Get url and timestamps
		let editResponseUrlValues = editResponseUrlRange.getValues();
		let timestampValues = timestampRange.getValues();

		// For every row, check if the url is valid
		// (i.e., there is a value there other than an empty string)
		for (let i = 0; i < editResponseUrlValues.length; i++) {
			// Get the url and timestamp for the current row
			let editResponseUrlValue = editResponseUrlValues[i][0];
			let timestampValue = timestampValues[i][0];

			// Check if the url is valid
			if (editResponseUrlValue === "") {
				// If there is no url, but there is a timestamp
				let timestamp = new Date(timestampValue);
				if (timestamp) {
					// Get the form response associated with the timestamp
					let formResponse = form.getResponses(timestamp)[0];

					// Set the url for the form response
					editResponseUrlValues[i][0] = formResponse.getEditResponseUrl();
				}
			}
		}

		editResponseUrlRange.setValues(editResponseUrlValues);
		SpreadsheetApp.flush();
	}

	// If no Form Submit trigger is added, add one
	registerNewEditResponseURLTrigger();

	// Notify user that spreadsheet is set up
	SpreadsheetApp.getUi().alert("Form is set up and ready to go. Thank you.");
}

// Automatically sets up onFormSubmit trigger upon setting up the spreasheet
function registerNewEditResponseURLTrigger() {
	// Check if form url trigger is already registered
	let existingTriggerId = PropertiesService.getUserProperties().getProperty(
		"onFormSubmitTriggerID"
	);
	if (existingTriggerId) {
		let foundExistingTrigger = false;
		ScriptApp.getProjectTriggers().forEach(function (trigger) {
			if (trigger.getUniqueId() === existingTriggerId) {
				foundExistingTrigger = true;
			}
		});
		if (foundExistingTrigger) {
			return;
		}
	}

	let trigger = ScriptApp.newTrigger("onFormSubmitEvent")
		.forSpreadsheet(SpreadsheetApp.getActive())
		.onFormSubmit()
		.create();

	PropertiesService.getUserProperties().setProperty(
		"onFormSubmitTriggerID",
		trigger.getUniqueId()
	);
}

function onFormSubmitEvent(e) {
	let sheet = e.range.getSheet();
	let formResponse = FormApp.openByUrl(sheet.getFormUrl()).getResponses().pop();

	addEditResponseURLToSheet({
		sheet: sheet,
		formResponse: formResponse,
		row: e.range.getRow(),
		col: getFormUrlColumn(sheet),
	});

	getFireStore({
		sheet: sheet,
		row: e.range.getRow(),
	});
}

/**
 * params: { sheet, formResponse, row, col }
 */
function addEditResponseURLToSheet(params) {
	// Get form url cell and set it to the form response url
	let formResponseEditUrlRange = params.sheet.getRange(params.row, params.col);
	formResponseEditUrlRange.setValue(params.formResponse.getEditResponseUrl());

	// Get school information
	let info = params.sheet.getRange(params.row, schoolInfo).getValue();

	// Parse school info
	let schoolinfo = parseSchool(info);

	// Set cells with parsed school info
	params.sheet.getRange(params.row, schoolId).setValue(schoolinfo[0]);
	params.sheet.getRange(params.row, schoolName).setValue(schoolinfo[1]);
	params.sheet.getRange(params.row, schoolCity).setValue(schoolinfo[2]);
	params.sheet.getRange(params.row, schoolDiv).setValue(schoolinfo[3]);

	// ?? might remove, seems redundant
	params.sheet
		.getRange(params.row, emails)
		.setValue(params.sheet.getRange(params.row, emails).getValue().trim());

	const invoiceValue = params.sheet.getRange(params.row, invoiceCol).getValue();
	let invoiceId =
		invoiceValue === ""
			? Math.floor(params.sheet.getRange(params.row, 1).getValue() / 1000) %
			  1000000000
			: invoiceValue;

	// Object to store all the message values
	let messageVals = {
		coachName: params.sheet.getRange(params.row, coachName).getValue(),
		numTeams: params.sheet.getRange(params.row, numTeams).getValue(),
		compLev: params.sheet.getRange(params.row, compLev).getValue(),
		numIndivs: params.sheet.getRange(params.row, numIndivs).getValue(),
		schoolName: params.sheet.getRange(params.row, schoolName).getValue(),
		compLoc: params.sheet.getRange(params.row, compLoc).getValue(),
		formUrl: params.formResponse.getEditResponseUrl(),
		schoolLinkName: params.sheet
			.getRange(params.row, schoolName)
			.getValue()
			.replace(/ /g, "%20"),
		timestamp: params.sheet.getRange(params.row, 1).getValue().getTime(),
		compLinkLoc: params.sheet
			.getRange(params.row, compLoc)
			.getValue()
			.replace(/ /g, "%20"),
	};

	/**
	 * Link for invoice
	 * ?? May need to change in the future
	 * c4: School Name
	 * c6: Number of Teams
	 * c1: Timestamp
	 * c7: Number of Individuals
	 * c8: Competition Level
	 * c12: Invoice ID
	 * site: Competition Site
	 */
	let invoiceLink = `http://www.academicsarecool.com/oldsite/invoice1.php?c4=${messageVals.schoolLinkName}&c6=${messageVals.numTeams}&c1=${messageVals.timestamp}&c7=${messageVals.numIndivs}&c8=${messageVals.compLev}&c12=${invoiceId}&site=${messageVals.compLinkLoc}`;

	// Create body of email
	let message = `Hello ${messageVals.coachName},\n\nThank you for registering ${messageVals.numTeams} ${messageVals.compLev}th grade teams and ${messageVals.numIndivs} individuals, from ${messageVals.schoolName} at ${messageVals.compLoc}\n\nIf you need to change your registration, please use the link: ${messageVals.formUrl}.\n\nDo not share the link as anyone can change the registration with it.\n\nThe invoice can be viewed and paid using the link:\n${invoiceLink}\n\n`;

	// Set invoice id in spreadsheet
	params.sheet.getRange(params.row, invoice).setValue(invoiceId);

	// Create subject for email
	let subject = `${params.sheet
		.getRange(params.row, compLev)
		.getValue()}th Grade Math is Cool Registration`;

	// Send invoice emails to all given emails
	params.sheet
		.getRange(params.row, emails)
		.getValue()
		.split(", ")
		.forEach((value) => {
			MailApp.sendEmail(value, subject, message);
		});
}

function getTimestampColumn(sheet) {
	for (let i = 1; i <= sheet.getLastColumn(); i += 1) {
		if (sheet.getRange(1, i).getValue() === "Timestamp") {
			return i;
		}
	}
	return 1;
}

function getFormUrlColumn(sheet) {
	let form = FormApp.openByUrl(sheet.getFormUrl());
	for (let i = 1; i <= sheet.getLastColumn(); i += 1) {
		if (sheet.getRange(1, i).getValue() === "Form Response Edit URL") {
			return i;
		}
	}
	// get the last column at which the url can be placed.
	return Math.max(sheet.getLastColumn() + 1, form.getItems().length + 2);
}

// Parses the submitted school format
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

/**
 * params: { sheet, row, cols }
 */
function getFireStore(params) {
	//Firestore config variables
	const config = {
		email: "email",
		key: "key",
		id: "id",
	};

	let firestore = FirestoreApp.getFirestore(
		config.email,
		config.key,
		config.id
	);

	// Gets the competition data for the competition signed up for
	let competitions = firestore.getDocument(
		"competitions/" + params.sheet.getRange(params.row, compId).getValue()
	);

	// Create an object holding the form submitted information
	let newData = {
		level: String(params.sheet.getRange(params.row, compLev).getValue()),
		numIndividuals: params.sheet.getRange(params.row, numIndivs).getValue(),
		numTeams: params.sheet.getRange(params.row, numTeams).getValue(),
		schoolID: params.sheet.getRange(params.row, schoolId).getValue(),
		uid: params.sheet.getRange(params.row, uid).getValue(),
	};

	// Reformatting registration map, so no errors occur
	let registrations = {};
	let alreadySignedUp = false;
	if (competitions.fields.registration.mapValue !== undefined) {
		// Registration map containing every individual registration
		const regComp = competitions.fields.registration.mapValue.fields;

		// Every registration for the signed up competition
		for (const i in regComp) {
			// Individual registration map for every sign up
			const regSchool = regComp[i].mapValue.fields;

			// Every student for the registration
			let names = [];
			if (regSchool.names !== undefined) {
				const numStudents = newData.numTeams * 4 + newData.numIndividuals - 1;

				// Adding in alternatives, if a registration can have them
				if (newData.numTeams > 0) {
					numStudents += 2;
				}

				for (let j in regSchool.names.arrayValue.values) {
					j = Number(j);
					// Checks if a new submission decreased the number of people signed up
					if (j > numStudents) {
						break;
					}

					// Each student in the list of names
					const regTeam = regSchool.names.arrayValue.values[j].mapValue.fields;

					// Recreating the student map
					let student = {
						grade: regTeam.grade.stringValue,
						name: regTeam.name.stringValue,
						id: j,
						level: regTeam.level.stringValue,
						pos: regTeam.pos.stringValue,
					};

					names.push(student);

					// Checks if a new submission increased the number of people signed up
					if (
						j === regSchool.names.arrayValue.values.length - 1 &&
						j < numStudents
					) {
						for (let newIndex = 1; newIndex < numStudents - j + 1; newIndex++) {
							names.push({
								grade: "",
								name: "",
								id: j + newIndex,
								level: "",
								pos: "",
							});
						}
					}
				}
			}

			// Checking if already signed up and adding values accordingly
			if (newData.schoolID !== Number(regSchool.schoolID.integerValue)) {
				// Checking if they already started entering names
				if (regSchool.names === undefined) {
					registrations[i] = {
						level: regSchool.level.stringValue,
						schoolID: Number(regSchool.schoolID.integerValue),
						numIndividuals: Number(regSchool.numIndividuals.integerValue),
						uid: regSchool.uid.stringValue,
						numTeams: Number(regSchool.numTeams.integerValue),
					};
				} else {
					registrations[i] = {
						level: regSchool.level.stringValue,
						schoolID: Number(regSchool.schoolID.integerValue),
						numIndividuals: Number(regSchool.numIndividuals.integerValue),
						uid: regSchool.uid.stringValue,
						numTeams: Number(regSchool.numTeams.integerValue),
						names: names,
					};
				}
			} else {
				if (regSchool.names === undefined) {
					registrations[i] = {
						level: regSchool.level.stringValue,
						schoolID: Number(regSchool.schoolID.integerValue),
						numIndividuals: Number(newData.numIndividuals),
						uid: regSchool.uid.stringValue,
						numTeams: Number(newData.numTeams),
					};
				} else {
					registrations[i] = {
						level: regSchool.level.stringValue,
						schoolID: Number(regSchool.schoolID.integerValue),
						numIndividuals: Number(newData.numIndividuals),
						uid: regSchool.uid.stringValue,
						numTeams: Number(newData.numTeams),
						names: names,
					};
				}

				alreadySignedUp = true;
			}
		}
	}

	// Adding new registration id
	if (!alreadySignedUp) {
		let regId = randString(16);
		registrations[regId] = newData;
	}

	// Creating data object to use update mask
	let data = {
		registration: registrations,
	};

	// Updating competition signed up for
	firestore.updateDocument(
		"competitions/" + params.sheet.getRange(params.row, compId).getValue(),
		data,
		true
	);
}

function randString(len) {
	let text = "";

	//Check if numbers
	if (typeof len !== "number") {
		return (text = "NaN");
	}

	let charString =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < len; i++)
		text += charString.charAt(Math.floor(Math.random() * charString.length));

	return text;
}
