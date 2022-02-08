const sourceSS = SpreadsheetApp.openById("");
const responseSheet = sourceSS.getSheetByName("");
const values = responseSheet.getDataRange().getValues();

var condition1 = values[0].indexOf("");
var assignedTo = values[0].indexOf("Assigned To");
var subDate = values[0].indexOf("Submission Date");

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

function main() {
  try {
    gMailNotifications();
  }
  catch(err) {
    Logger.log(err)
  }
}

function gMailNotifications() {
  var assignedBatch = [];
  var unassignedBatch = [];
  
  values.forEach(function (row) {
    if (row[condition1] !== "Complete" && row[assignedTo] === "Alex") {
      assignedBatch.push([row[subDate]]);
    }
    else if (row[condition1] !== "Complete" && row[assignedTo] === "") {
      unassignedBatch.push([row[subDate]]);
    }
  });

  let link = "Link-To-Spreadsheet";
  let htmlContent = "<body><p>" + assignedBatch.length + " assigned rows.</p><p>" + unassignedBatch.length + " unassigned rows.</p><a href='" + link + "'>Here is a link to the spreadsheet.</a></body>";
  let message = {
    to: "alex.lawson@theaxiagroup.com",
    subject: "Login/Permission Requests",
    htmlBody: htmlContent,
    name: "Auto-Mailer"
  }


  if (!assignedBatch.length && !unassignedBatch.length) {
    Logger.log("No data at this time.")
  }
  else {
    MailApp.sendEmail(message);
    Logger.log(assignedBatch.length + " Assigned and not complete.");
    Logger.log(unassignedBatch.length + " Unassigned and not complete.");
    Logger.log("Email Sent");
  }
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