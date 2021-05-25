// This file has several problems - requires further development


/* Send Spreadsheet in an email as PDF, automatically */
function emailSpreadSheetAsPDF() {
    // Send the PDF of the spreadsheet to this email address
    const email = Session.getActiveUser().getEmail() || 'your_email_address';
  
    // Get the currently active spreadsheet URL (link)
    // Or use SpreadsheetApp.openByUrl("<>");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
  
    // Subject of email message
    const subject = "PDF generated from spreadsheet ${ss.getName()}";
  
    // Email Body can  be HTML too with your logo image - see ctrlq.org/html-mail
    const body = "Sent with [Email Google Sheets]";
  
    // Base URL
    const url = 'https://docs.google.com/spreadsheets/d/xxxxxxxxxxxxx'
  //  .replace('SS_ID', ss.getId());
  
    const exportOptions =
      'exportFormat=pdf&format=pdf' + // export as pdf / csv / xls / xlsx
      '&size=letter' + // paper size legal / letter / A4
      '&portrait=true' + // orientation, false for landscape
      '&fitw=true&source=labnol' + // fit to page width, false for actual size
      '&sheetnames=false&printtitle=false' + // hide optional headers and footers
      '&pagenumbers=false&gridlines=false' + // hide page numbers and gridlines
      '&fzr=false' + // do not repeat row headers (frozen rows) on each page
        '&gid=2'; // the sheet's Id - {Dashboard = 2, Victoria = 6, SR = 7}
  
    const token = ScriptApp.getOAuthToken();
    const sheets = ss.getSheets();
  
    // make an empty array to hold your fetched blobs
    const blobs = [];
  
    for (let i = 0; i < sheets.length; i += 1) {
      // Convert individual worksheets to PDF
      const response = UrlFetchApp.fetch(url + exportOptions + sheets[i].getSheetId(), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // convert the response to a blob and store in our array
      blobs[i] = response.getBlob().setName(`${sheets[i].getName()}.pdf`);
    }
  
    // create new blob that is a zip file containing our blob array
    const zipBlob = Utilities.zip(blobs).setName(`${ss.getName()}.zip`);
  
    // optional: save the file to the root folder of Google Drive
    DriveApp.createFile(zipBlob);
  
    // Define the scope
    Logger.log(`Storage Space used: ${DriveApp.getStorageUsed()}`);
  
    // If allowed to send emails, send the email with the PDF attachment
    if (MailApp.getRemainingDailyQuota() > 0)
      GmailApp.sendEmail(email, subject, body, {
        htmlBody: body,
        attachments: [zipBlob]
      });
  }