// A quick script to create Folders for each cell in a range (emails, names, etc...)

function createFoldersFromRange() {
    const parentFolder = DriveApp.getFolderById('xxxxxxxx'); //Insert Parent Folder ID
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    // or
    // var ss = SpreadsheetApp.openById('xxxxxxx'); //Insert a Spreadsheet ID
    // var sheet = ss.getSheetByName('xxxxxxxx'); //Insert the name of a sheet
    var last = sheet.getLastRow();
  
    for(var i=0; i<last; i++){
      var folderName = sheet.getRange(i+1,1).getValue();
      var childFolders = parentFolder.createFolder(folderName);
      Logger.log(childFolders.getName() + " " + childFolders.getId())
    }  
  }