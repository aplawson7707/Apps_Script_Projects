
//   /$$$$$$$$                                           /$$            /$$$$$$   /$$$$$$  /$$    /$$
//  | $$_____/                                          | $$           /$$__  $$ /$$__  $$| $$   | $$
//  | $$       /$$   /$$  /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$        | $$  \__/| $$  \__/| $$   | $$
//  | $$$$$   |  $$ /$$/ /$$__  $$ /$$__  $$ /$$__  $$|_  $$_/        | $$      |  $$$$$$ |  $$ / $$/
//  | $$__/    \  $$$$/ | $$  \ $$| $$  \ $$| $$  \__/  | $$          | $$       \____  $$ \  $$ $$/ 
//  | $$        >$$  $$ | $$  | $$| $$  | $$| $$        | $$ /$$      | $$    $$ /$$  \ $$  \  $$$/  
//  | $$$$$$$$ /$$/\  $$| $$$$$$$/|  $$$$$$/| $$        |  $$$$/      |  $$$$$$/|  $$$$$$/   \  $/   
//  |________/|__/  \__/| $$____/  \______/ |__/         \___/         \______/  \______/     \_/    
//                      | $$                                                                         
//                      | $$                                                                         
//                      |__/                                                                         

///////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                               //
// * script to export data in all sheets in the current spreadsheet as individual csv files      //
//                    Files will be named according to the name of the sheets                    //
//                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Export Sheets as CSV Files')
      .addItem('Export All Sheets', 'exportCSV')
      .addToUi();
}
  
function exportCSV() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy/MM/dd')
//  create a folder from the name of the spreadsheet (optional)
  var folder = DriveApp.createFolder(ss.getName() + " " + date);
//  select Destination Folder ID
  // var folder = DriveApp.getFolderById(<"Folder ID">)
  for (var i = 0 ; i < sheets.length ; i++) {
    var sheet = sheets[i];
    fileName = sheet.getName() + " " + date + ".csv";
    var csvFile = convertRangeToCsvFile_(fileName, sheet);
    folder.createFile(fileName, csvFile);
  }
  Browser.msgBox('Files are waiting in a folder named ' + folder.getName());
}
  
function convertRangeToCsvFile_(csvFileName, sheet) {
  // get available data range in the spreadsheet
  var activeRange = sheet.getDataRange();
  try {
    var data = activeRange.getDisplayValues();
    var csvFile = undefined;

    // loop through the data in the range and build a string with the csv data
    if (data.length > 1) {
      var csv = "";
      for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row].length; col++) {
          if (data[row][col].toString().indexOf(",") != -1) {
            data[row][col] = "\"" + data[row][col] + "\"";
          }
        }

        // join each row's columns
        // add a carriage return to end of each row, except for the last one
        if (row < data.length-1) {
          csv += data[row].join(",") + "\r\n";
        }
        else {
          csv += data[row];
        }
      }
      csvFile = csv;
    }
    return csvFile;
  }
  catch(err) {
    Logger.log(err);
    Browser.msgBox(err);
  }
}