var ss = SpreadsheetApp.getActiveSpreadsheet()
var sheet = ss.getSheets();

function onOpen() {
  const ui = SpreadsheetApp.getUi();
    ui.createMenu('Custom Functions')
      .addItem('Reset Named Ranges','replaceNamedRanges')
      .addToUi();
}

function replaceNamedRanges() {
  var decision = Browser.msgBox("WARNING", "Are you sure you want to update all Named Ranges?", Browser.Buttons.YES_NO);
    if (decision == 'yes') {
      for(i=0;i<sheet.length;i++) {
        var namedRanges = sheet[i].getNamedRanges();
        var dataRange = sheet[i].getDataRange();
        var data = dataRange
        if (namedRanges.length > 0) {
          Logger.log(sheet[i].getName());
          ss.removeNamedRange(namedRanges[0].getName());
          ss.setNamedRange("New_Named_Range"+[i],data);
        }
        else {
          SpreadsheetApp.getUi().alert("Sheet Name: '" + sheet[i].getName() + "' Has No Named Ranges");
        }
      }
      SpreadsheetApp.getUi().alert("All Named Ranges Replaced");
    }
    else {
      SpreadsheetApp.getUi().alert('Well okie dokie, then.')
    }
}