/**
 * @OnlyCurrentDoc
*/
 
// TODOs
// *** Create "Help" menu item and HTML sidebar for FAQ/Tips/Instructions
// ***DONE*** Only send to recipients with "Pending 21-22 Agreement" in Status column on 21-22 Central Onboarding tab

const RECIPIENT_COL  = "Email Address for Mail Merge"; // The column names need to match exactly what is in quotes
const EMAIL_SENT_COL = "Sent";
const VENDOR_STATUS_COL = "Status";
 
// Create menu uption in Header of Spreadsheet
// If this is published as an Editor Add on this will need to use Ui.createAddonMenu() and Menu.addItem()
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Send Vendor Emails')
      .addItem('Email Vendors: Pending 21-22 Agreement', 'sendEmails')
      .addSeparator()
      .addItem('Remaining Quota', 'showQuota')
      .addToUi();
}

// This is just an estimated remaining quota. It seems to be message-size dependent.
function showQuota() {
  var emailQuotaRemaining = MailApp.getRemainingDailyQuota() 
  SpreadsheetApp.getUi().alert("You can send about " + emailQuotaRemaining + " more messages with this tool today.");
}

/**
 * @param {string} subjectLine (optional) for the email draft message
 * @param {Sheet} sheet to read data from
*/
function sendEmails(subjectLine, sheet=SpreadsheetApp.getActiveSheet()) {
  if (!subjectLine){
    subjectLine = Browser.inputBox("Mail Merge", 
                                      "Enter the subject line of the Gmail " +
                                      "draft message you would like to send:",
                                      Browser.Buttons.OK_CANCEL);
                                      
    if (subjectLine === "cancel" || subjectLine == ""){ 
    // if no subject line finish up
    return;
    }
  }
  
  const emailTemplate = getGmailTemplateFromDrafts_(subjectLine); // get the draft Gmail message to use as a template
  const dataRange = sheet.getDataRange();
  const data = dataRange.getDisplayValues(); // Fetch displayed values for each row in the Range
  const heads = data.shift(); // Header must be in Row 1
  const emailSentColIdx = heads.indexOf(EMAIL_SENT_COL); // get the index of "Sent" column
  
  const obj = data.map(r => (heads.reduce((o, k, i) => (o[k] = r[i] || '', o), {}))); // convert 2d array into object array
  
  const out = []; // Build empty array to house output from each iteration
  const count = []; // Build empty array to count sent emails

  obj.forEach(function(row, rowIdx){    
    if (row[EMAIL_SENT_COL] == '' && row[VENDOR_STATUS_COL] == "Pending 21-22 Agreement"){ // only send emails if "Sent" is blank and not hidden by filter
      try {
        const msgObj = fillInTemplateFromObject_(emailTemplate.message, row);

        // TODO: Create columns to feed advanced parameters for CC, BCC, etc...
        GmailApp.sendEmail(row[RECIPIENT_COL], msgObj.subject, msgObj.text, {
          htmlBody: msgObj.html,
          // bcc: 'a.bbc@email.com',
          // cc: 'a.cc@email.com',
          // from: 'an.alias@email.com',
          // name: 'name of the sender',
          // replyTo: 'a.reply@email.com',
          // noReply: true,
          attachments: emailTemplate.attachments
        });
        out.push([new Date()]); // Log sent-on date to "Sent" column
        count.push(row[RECIPIENT_COL]);
      } catch(e) {
        out.push([e.message]); // Log error message to "Sent" column
      }
    } else {
      out.push([row[EMAIL_SENT_COL]]);
    }
  });
  
  sheet.getRange(2, emailSentColIdx+1, out.length).setValues(out); // Update the "Sent" column
  
  /**
   * Get a Gmail draft message by matching the subject line.
   * @param {string} subject_line to search for draft message
   * @return {object} containing the subject, plain and html message body and attachments
  */
  function getGmailTemplateFromDrafts_(subject_line){
    try {
      const drafts = GmailApp.getDrafts(); // get drafts
      const draft = drafts.filter(subjectFilter_(subject_line))[0]; // filter the drafts that match subject line
      const msg = draft.getMessage(); // get the message object
      const attachments = msg.getAttachments(); // getting attachments so they can be included in the merge
      return {message: {subject: subject_line, text: msg.getPlainBody(), html:msg.getBody()}, 
              attachments: attachments};
    } catch(e) {
      throw new Error("Oops - can't find a draft in your inbox with that subject line");
    }

    /**
     * Filter draft objects with the matching subject linemessage by matching the subject line.
     * @param {string} subject_line to search for draft message
     * @return {object} GmailDraft object
    */
    function subjectFilter_(subject_line){
      return function(element) {
        if (element.getMessage().getSubject() === subject_line) {
          return element;
        }
      }
    }
  }
  
  /**
   * Add variable capability with curly braces and column headers
   * Yes, I shamelessly pulled this function from https://stackoverflow.com/a/378000/1027723
   * @param {string} template string containing {{}} markers which are replaced with data
   * @param {object} data object used to replace {{}} markers
   * @return {object} message replaced with data
  */
  function fillInTemplateFromObject_(template, data) {
    // we have two templates one for plain text and the html body
    // stringifing the object means we can do a global replace
    let template_string = JSON.stringify(template);

    // token replacement
    template_string = template_string.replace(/{{[^{}]+}}/g, key => {
      return data[key.replace(/[{}]+/g, "")] || "";
    });
    return JSON.parse(template_string);
  }
  if (count.length == 0) {
    SpreadsheetApp.getUi().alert(
      "No Emails Sent...", 
      "No vendors were found who met the criteria to be contacted.", 
      SpreadsheetApp.getUi().ButtonSet.OK);
  }
  else {
    SpreadsheetApp.getUi().alert(
      "All Finished!", 
      "Emails sent to vendors: " + count.length, 
      SpreadsheetApp.getUi().ButtonSet.OK);
  }
}