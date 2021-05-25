//@OnlyCurrentDoc

//Import CSV files from a URL
function importCSVFromUrl() {
    var url = "Redash CSV URL"
    var contents = Utilities.parseCsv(UrlFetchApp.fetch(url));
    var sheetName = writeDataToSheet(contents);
  //  displayToastAlert("The CSV file was successfully imported into " + sheetName + ".");
  }
  
  //Clear the active sheet and write a 2D array of data in its place
  function writeDataToSheet(data) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var range = ss.getSheetByName("Full Report");
    sheet = range.clearContents();
    sheet.getRange(1,1,data.length,data[0].length).setValues(data);
    return sheet.getName();
  }