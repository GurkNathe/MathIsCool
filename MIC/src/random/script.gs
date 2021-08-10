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
 * To use:  designate a 'Form Response Edit URL' column
 *          Number of Teams in Column F
 *          
 *  
 *
 */
function registerNewEditResponseURLTrigger() {
  // check if an existing trigger is set
  var existingTriggerId = PropertiesService.getUserProperties().getProperty('onFormSubmitTriggerID')
  if (existingTriggerId) {
    var foundExistingTrigger = false
    ScriptApp.getProjectTriggers().forEach(function (trigger) {
      if (trigger.getUniqueId() === existingTriggerId) {
        foundExistingTrigger = true
      }
    })
    if (foundExistingTrigger) {
      return
    }
  }

  var trigger = ScriptApp.newTrigger('onFormSubmitEvent')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit()
    .create()

  PropertiesService.getUserProperties().setProperty('onFormSubmitTriggerID', trigger.getUniqueId())
}

function getTimestampColumn(sheet) {
  for (var i = 1; i <= sheet.getLastColumn(); i += 1) {
    if (sheet.getRange(1, i).getValue() === 'Timestamp') {
      return i
    }
  }
  return 1
}

function getFormResponseEditUrlColumn(sheet) {
  var form = FormApp.openByUrl(sheet.getFormUrl())
  for (var i = 1; i <= sheet.getLastColumn(); i += 1) {
    if (sheet.getRange(1, i).getValue() === 'Form Response Edit URL') {
      return i
    }
  }
  // get the last column at which the url can be placed.
  return Math.max(sheet.getLastColumn() + 1, form.getItems().length + 2)
}

/**
 * params: { sheet, form, formResponse, row }
 */
function addEditResponseURLToSheet(params) {
  if (!params.col) {
    params.col = getFormResponseEditUrlColumn(params.sheet)
  }
  var formResponseEditUrlRange = params.sheet.getRange(params.row, params.col)
  formResponseEditUrlRange.setValue(params.formResponse.getEditResponseUrl()) ;
  var invoice = Math.floor(params.sheet.getRange(params.row, 1).getValue()/1000) % 1000000000 ;
  var message = 'Hello ' + params.sheet.getRange(params.row, 3).getValue() + ',\n\nThank you for registering ' ;
  message = message + params.sheet.getRange(params.row, 6).getValue() + '  ' + params.sheet.getRange(params.row, 8).getValue() ;
  message = message +  'th grade teams and ' + params.sheet.getRange(params.row, 7).getValue() ;
  message = message + ' individuals, \nfrom ' + params.sheet.getRange(params.row, 4).getValue() + ' in ' ;
  message = message + params.sheet.getRange(params.row, 5).getValue() + '\n\nIf you need to change your registration, please use the link ' 
  message = message + params.formResponse.getEditResponseUrl() + '.\nDo not share the link as anyone can change the registration with it.\n\n'
  
  message = message + 'The invoice can be viewed and paid using the link:\nhttp://www.academicsarecool.com/oldsite/invoice1.php?c4='
  message = message + params.sheet.getRange(params.row, 4).getValue().replace(/ /g,'%20') + '&c6=' + params.sheet.getRange(params.row, 6).getValue()
  message = message + '&c1=' + params.sheet.getRange(params.row, 1).getValue().getTime()
  message = message + '&c7=' + params.sheet.getRange(params.row, 7).getValue()
  message = message + '&c8=' + params.sheet.getRange(params.row, 8).getValue() + '&c12=' + invoice + '\n\n' ;
  params.sheet.getRange(params.row, 12).setValue(invoice); 

  
  var subject = params.sheet.getRange(params.row, 8).getValue()+'th Grade Math is Cool Registration'
  MailApp.sendEmail(params.sheet.getRange(params.row, 10).getValue(), subject, message);
  
  
  /* http://www.academicsarecool.com/oldsite/invoice1.php?c4=Marvista&c6=3&c1=42111.2&c7=1&c8=6  */
}


function onOpen() {
  var menu = [{ name: 'Add Form Edit Response URLs', functionName: 'setupFormEditResponseURLs' }]
  SpreadsheetApp.getActive().addMenu('Forms', menu)
}

function setupFormEditResponseURLs() {
  var sheet = SpreadsheetApp.getActiveSheet()
  var spreadsheet = SpreadsheetApp.getActive()
  var formURL = sheet.getFormUrl()
  if (!formURL) {
    SpreadsheetApp.getUi().alert('No Google Form associated with this sheet. Please connect it from your Form.')
    return
  }
  var form = FormApp.openByUrl(formURL)

  // setup the header if not existed
  var headerFormEditResponse = sheet.getRange(1, getFormResponseEditUrlColumn(sheet))
  var title = headerFormEditResponse.getValue()
  if (!title) {
    headerFormEditResponse.setValue('Form Response Edit URL')
  }

  var timestampColumn = getTimestampColumn(sheet)
  var editResponseUrlColumn = getFormResponseEditUrlColumn(sheet)
  
  var timestampRange = sheet.getRange(2, timestampColumn, sheet.getLastRow() - 1, 1)
  var editResponseUrlRange = sheet.getRange(2, editResponseUrlColumn, sheet.getLastRow() - 1, 1)
  if (editResponseUrlRange) {
    var editResponseUrlValues = editResponseUrlRange.getValues()
    var timestampValues = timestampRange.getValues()
    for (var i = 0; i < editResponseUrlValues.length; i += 1) {
      var editResponseUrlValue = editResponseUrlValues[i][0]
      var timestampValue = timestampValues[i][0]
      if (editResponseUrlValue === '') {
        var timestamp = new Date(timestampValue)
        if (timestamp) {
          var formResponse = form.getResponses(timestamp)[0]
          editResponseUrlValues[i][0] = formResponse.getEditResponseUrl()
          var row = i + 2
          if (row % 10 === 0) {
            spreadsheet.toast('processing rows ' + row + ' to ' + (row + 10))
            editResponseUrlRange.setValues(editResponseUrlValues)
            SpreadsheetApp.flush()
          }
        }
      }
    }
    
    editResponseUrlRange.setValues(editResponseUrlValues)
    SpreadsheetApp.flush()
  }

  registerNewEditResponseURLTrigger()
  SpreadsheetApp.getUi().alert('You are all set! Please check the Form Response Edit URL column in this sheet. Future responses will automatically sync the form response edit url.')
}

function onFormSubmitEvent(e) {
  var sheet = e.range.getSheet()
  var form = FormApp.openByUrl(sheet.getFormUrl())
  var formResponse = form.getResponses().pop()
  addEditResponseURLToSheet({
    sheet: sheet,
    form: form,
    formResponse: formResponse,
    row: e.range.getRow(),
  })
}