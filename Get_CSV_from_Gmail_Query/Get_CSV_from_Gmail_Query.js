function getCsvFromGmail() {
    // Get the newest Gmail thread based on sender and subject
    var gmailThread = GmailApp.search("from:noreply@example.com subject:\"My daily report\"", 0, 1)[0];
    
    // Get the attachments of the latest mail in the thread.
    var attachments = gmailThread.getMessages()[gmailThread.getMessageCount() - 1].getAttachments();
    
    // Get and and parse the CSV from the first attachment
    var csv = Utilities.parseCsv(attachments[0].getDataAsString());
    return csv;
  }