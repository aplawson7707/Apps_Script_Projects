/*
 * script to export data in all sheets in the current spreadsheet as individual csv files
 * files will be named according to the name of the sheets
*/

function onOpen() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var csvMenuEntries = [{name: "Export All Sheets As CSV Files", functionName: "saveAsCSV"}];
    ss.addMenu("Export CSV Files", csvMenuEntries);
  };
  
  function exportCSV() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy/MM/dd')
  //  create a folder from the name of the spreadsheet (optional)
  //  var folder = DriveApp.createFolder(ss.getName() + " " + date);
  //  select Destination Folder ID
    var folder = DriveApp.getFolderById(<"Folder ID">)
    for (var i = 0 ; i < sheets.length ; i++) {
      var sheet = sheets[i];
      // append ".csv" extension to the sheet name
      fileName = sheet.getName() + " " + date + ".csv";
      // convert all available sheet data to csv format
      var csvFile = convertRangeToCsvFile_(fileName, sheet);
      // create a file in destination folder with the given name and the csv data
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