//@OnlyCurrentDoc
function onOpen(e) {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("Import Redash Query")
      .addItem("Select Redash Query", "importCSVFromUrl")
  //    .addItem("Import from Drive", "importCSVFromDrive")
      .addToUi();
  }
  
  //Displays an alert as a Toast message
  function displayToastAlert(message) {
    SpreadsheetApp.getActive().toast(message, "*** Status ***"); 
  }
  
  //Placeholder function to import CSV files from a URL
  function importCSVFromUrl() {
    var url = promptUserForInput("Please Enter the API Key (CSV Format) for you Redash Query:");
    var contents = Utilities.parseCsv(UrlFetchApp.fetch(url));
    var sheetName = writeDataToSheet(contents);
  //  displayToastAlert("The CSV file was successfully imported into " + sheetName + ".");
  }
  
  //Placeholder function to import CSV files from Google Drive
  function importCSVFromDrive() {
    var fileName = promptUserForInput("Please enter the name of the CSV file to import from Google Drive:");
    var files = findFilesInDrive(fileName);
    if(files.length === 0) {
      displayToastAlert("No files with name \"" + fileName + "\" were found in Google Drive.");
      return;
    } else if(files.length > 1) {
      displayToastAlert("Multiple files with name " + fileName +" were found. This program does not support picking the right file yet.");
      return;
    }
    var file = files[0];
    var contents = Utilities.parseCsv(file.getBlob().getDataAsString());
    var sheetName = writeDataToSheet(contents);
  //  displayToastAlert("The CSV file was successfully imported into " + sheetName + ".");
  }
  
  //Returns files in Google Drive that have a certain name.
  function findFilesInDrive(filename) {
    var files = DriveApp.getFilesByName(filename);
    var result = [];
    while(files.hasNext())
      result.push(files.next());
    return result;
  }
  
  //Prompts the user for input and returns their response
  function promptUserForInput(promptText) {
    var ui = SpreadsheetApp.getUi();
    var prompt = ui.prompt(promptText);
    var response = prompt.getResponseText();
    return response;
  }
  
  //Clears the active sheet and writes a 2D array of data in its place
  function writeDataToSheet(data) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var range = ss.getSheetByName("Full Report");
    sheet = range.clearContents().clearFormats();
    sheet.getRange(1,1,data.length,data[0].length).setValues(data);
    return sheet.getName();
  }