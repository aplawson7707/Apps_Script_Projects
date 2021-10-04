/**
 * @OnlyCurrentDoc
*/ 
const SENDER_EMAIL = ""
const SENDER_NAME = ""

const RECIPIENT_COL  = "Recipient_Email"
const EMAIL_SENT_COL = "Sent"
const CC_COL = "CC_Email"

const SENDGRID_KEY ='{{api key here}}'

const TEMPLATES = {
  "{{Sendgrid Template 1 Name}}": "{{Template ID Number}}",
  "{{Sendgrid Template 2 Name}}": "{{Template ID Number}}",
  "{{Sendgrid Template 3 Name}}": "{{Template ID Number}}",
  "{{Sendgrid Template 4 Name}}": "{{Template ID Number}}",
}
 
// Create menu uption in Header of Spreadsheet
function onOpen() {
  const ui = SpreadsheetApp.getUi()
  ui.createMenu('Top Level Menu Title')
      .addItem('Send Test Email', 'sendTestEmail')
      .addSeparator()
      .addItem('Send All Emails', 'sendAllEmails')
      .addToUi()
}

/**
 * Use the first row of the sheet to send an email to the logged in user
 * @param {Sheet} sheet to read data from
 */
function sendTestEmail(sheet=SpreadsheetApp.getActiveSheet()) {
  var recipient = Session.getActiveUser().getEmail()

  var ok = Browser.msgBox(
    "Send Test Email", 
    "Send a test email using the first row's data to " + recipient + " Ready?", 
    Browser.Buttons.OK_CANCEL
  )

  if (ok === "cancel"){
    return
  }

  sendEmails(sheet, true)
  Browser.msgBox("Test email sent", "Check the inbox for " + recipient + " to see the test message.", Browser.Buttons.OK)
}

/**
 * @param {Sheet} sheet to read data from
*/
function sendAllEmails(sheet=SpreadsheetApp.getActiveSheet()) {
  var ok = Browser.msgBox("Send All Email", "Are you ready to Send?", Browser.Buttons.OK_CANCEL)

  if (ok === "cancel"){
    return
  }

  sendEmails(sheet, false)
}

function sendEmails(sheet, testEmail) {
  var sheet_name = sheet.getName()

  if (sheet_name in TEMPLATES) {
    template = TEMPLATES[sheet_name]
  } else {
    Browser.msgBox("Template error", "No template set for this sheet", Browser.Buttons.OK)
    return
  }
  
  const dataRange = sheet.getDataRange()
  const data = dataRange.getDisplayValues() // Fetch displayed values for each row in the Range
  const headers = data.shift() // Header must be in Row 1
  const emailSentColIdx = headers.indexOf(EMAIL_SENT_COL) + 1 // get the index of "Sent" column

  var heads = []
  headers.forEach(function(h, index){
    heads.push(h.replace(/ /g, "_"))
  })
  const obj = data.map(r => (heads.reduce((o, k, i) => (o[k] = r[i] || '', o), {}))) // convert 2d array into object array
  var skip = false

  obj.forEach(function(row, rowIdx) {
    if (!skip) {
      var recipient = row[RECIPIENT_COL]
      var cc = false

      if (testEmail) {
        recipient = Session.getActiveUser().getEmail()
      } else {
        if (CC_COL in row && row[CC_COL] != '') {
          cc = row[CC_COL]
        }
      }

      var row_number = rowIdx + 2

      if (testEmail || row[EMAIL_SENT_COL] == '') { // only send emails if "Sent" is blank and not hidden by filter
        try {
          sendViaSendGrid(
            recipient,
            cc,
            template,
            row
          )

          if (!testEmail) { sheet.getRange(row_number, emailSentColIdx).setValue(new Date()) }
        } catch(e) {
          if (!testEmail) { sheet.getRange(row_number, emailSentColIdx).setValue(e.message) }
        }
        SpreadsheetApp.flush()
      }
      if (testEmail) {
        skip = true 
      }
    }
  })
}

/**
 * Send email via SendGrid
 * @param {string} recipient of the email.
 * @param {string} template name to use
 * @param {object} replacements variables to send
 */
function sendViaSendGrid(recipient, cc, template, replacements){
  body = {
    "from":{
      "email": SENDER_EMAIL,
      "name": SENDER_NAME,
    },
    "personalizations":[
      {
        "to":[
          {
            "email": recipient,
          }
        ],
        "dynamic_template_data": replacements,
      }
    ],
    "template_id":template,
  }

  if (cc) {
    body['personalizations'][0]["cc"] = [{
      "email": cc,
    }]
  }

  var headers = {
    "Authorization" : "Bearer " + SENDGRID_KEY, 
    "Content-Type": "application/json" 
  }

  var options = {
    'method':'post',
    'headers':headers,
    'payload':JSON.stringify(body)
  }

  var response = UrlFetchApp.fetch("https://api.sendgrid.com/v3/mail/send", options)
  Logger.log(response)
}