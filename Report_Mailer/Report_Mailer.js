function reportMailer() {

    var date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy/MM/dd')
      
    file = DriveApp.getFilesByName('LVCS' + " " + date + '.csv');
    file2 = DriveApp.getFilesByName('FRCS' + " " + date + '.csv');
    file3 = DriveApp.getFilesByName('WCS' + " " + date + '.csv');
    file4 = DriveApp.getFilesByName('CLA' + " " + date + '.csv');
    file5 = DriveApp.getFilesByName('TCS' + " " + date + '.csv');
    
    if (file.hasNext()) {
      MailApp.sendEmail('sender email address', 
                        'subject', 
                        'body', {
        attachments: [
          file.next().getAs('text/csv'),
          file2.next().getAs('text/csv'),
          file3.next().getAs('text/csv'),
          file4.next().getAs('text/csv'),
          file5.next().getAs('text/csv')],
        name: 'Sender Name'
       }
     )}
    }