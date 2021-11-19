// Define variables

const ss = SpreadsheetApp.getActiveSpreadsheet();
const CLASS_SHEET = ss.getSheetByName("CLASS");
const classValues = CLASS_SHEET.getDataRange().getValues();
const ORDER_SHEET = ss.getSheetByName("Data");
const orderValues = ORDER_SHEET.getDataRange().getValues();

function main() {
  try {
    Logger.log(classValues.length);
  }
  catch(err) {
    Logger.log(err);
  }
}

function sheetNames() {
  var sheetNames = ss.getSheets()
  .map(s => s.getName());
  Logger.log(sheetNames)
}

// Inserts or updates a column to combine HQT First and Last names

function hqtFullName() {
  var hqtFirst = classValues[0].indexOf("Teacher First");
  var hqtLast = classValues[0].indexOf("Teacher Last");
  var hqtFullName = classValues[0].indexOf("HQT Full");
  var hqtFull = [];

  // Checks if HQT Full Name column exists before processing HQT Full Names

  if (hqtFullName < 0) {
    Logger.log("Inserting HQT Full Name Column");
    classValues.forEach(function (row) {
      hqtFull.push([row[hqtFirst] + " " + row[hqtLast]])
    });
    var hqtFullFinal = hqtFull.slice(1);
    hqtFullFinal.unshift(["HQT Full"])
    CLASS_SHEET.insertColumns(hqtLast+2)    
    CLASS_SHEET.getRange(1, hqtLast+2, hqtFullFinal.length, 1).setValues(hqtFullFinal);
  }
  else {
    Logger.log("HQT Full Name column already present");
    Logger.log("Writing HQT Full Names");
    classValues.forEach(function (row) {
      hqtFull.push([row[hqtFirst] + " " + row[hqtLast]])
    });
    var hqtFullFinal = hqtFull.slice(1);
    CLASS_SHEET.getRange(2, hqtFullName+1, hqtFullFinal.length, 1).setValues(hqtFullFinal);
  }
}

function hqtLookup() {
  // Check for HQT Full and Teacher School Columns
  // Set HQT Full column, row 1 formula to: =ArrayFormula(IFNA(VLOOKUP(C1:C,CLASS!C:J,{7,8},FALSE),))
  var orderDisplayValues = ORDER_SHEET.getDataRange().getDisplayValues();
  var hqtLookupColumn = orderDisplayValues[0].indexOf("HQT Full");
  var teacherByLastNameColumn = orderDisplayValues[0].indexOf("TeacherByLastName");

  if (hqtLookupColumn < 0) {
    ORDER_SHEET.insertColumns(orderDisplayValues[0].length+1, 2);
    ORDER_SHEET.getRange(1, teacherByLastNameColumn+2).setFormula("=ArrayFormula(IFNA(VLOOKUP(C1:C,CLASS!C:J,{7,8},FALSE),))");
  }
  else {
    ORDER_SHEET.getRange(1, hqtLookupColumn+1).setFormula("=ArrayFormula(IFNA(VLOOKUP(C1:C,CLASS!C:J,{7,8},FALSE),))");
  }
}
