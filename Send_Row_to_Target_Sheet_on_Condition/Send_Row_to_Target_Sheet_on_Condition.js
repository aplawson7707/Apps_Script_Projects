function onEdit(event) {
    // assumes source data in sheet named Tracker
    // target sheet of move to named Enrollment Tracker
    // test column with condition is col 1 or A
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var s = event.source.getActiveSheet();
    var r = event.source.getActiveRange();
    
    if(s.getName() == "Tracker" && r.getColumn() == 1 && r.getValue() == "Enrollment Tracker") {
    var row = r.getRow();
    var numColumns = s.getLastColumn();
    var targetSheet = ss.getSheetByName("Enrollment Tracker");
    var target = targetSheet.getRange(targetSheet.getLastRow() + 1, 1);
    s.getRange(row, 1, 1, numColumns).moveTo(target);
    }
    }