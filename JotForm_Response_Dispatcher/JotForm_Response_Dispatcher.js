// Define Source Variables
const sourceSS = SpreadsheetApp.openById("");
const responseSheet = sourceSS.getSheetByName("");
const values = responseSheet.getDataRange().getValues();

// Define Destination Variables
const destSS = SpreadsheetApp.openById("");
const destSheet = destSS.getSheetByName("");

// Define Header Index Values
var  = values[0].indexOf("");
var  = values[0].indexOf("");
var  = values[0].indexOf("")
var  = values[0].indexOf("")
var  = values[0].indexOf("");
var  = values[0].indexOf("");
var  = values[0].indexOf("")
var  = values[0].indexOf("");
var  = values[0].indexOf("");
var  = values[0].indexOf("");
var  = values[0].indexOf("")

function main() {
    try {
      GetResponses();
    }
    catch(err) {
      Logger.log(err);
      
      var body = Logger.getLog();
      MailApp.sendEmail(
        "alex.lawson@theaxiagroup.com",
        "Error Detected",
        body
      );
    }
  }
    
function GetResponses() {
  var destHeader = destSheet.getDataRange().getValues();
//   var destHeader = values.unshift();
  var insert = destHeader[0].indexOf("")+1;
  var finalHeader = [];
  finalHeader.push([
    "",
    "",
    "",
    "",
    "",
    "",
    "", 
    "",
    "",
    "" 
  ]);
  var responseData = [];
  values.filter (function (row) {
    return (
      row[condition] === "Yes");
  })
  .forEach(function (row) {
    responseData.push([
      row[],
      row[],
      row[],
      row[].toString(),
      row[],
      row[],
      row[], 
      row[],
      row[],
      row[]
    ]);
  });
  if (!responseData.length) {
    Logger.log("No Response Data.");
  }
  else {
    destSheet.getRange(1, insert, responseData.length, responseData[0].length).clear();
    destSheet.getRange(2, insert, responseData.length, responseData[0].length).setValues(responseData);
    destSheet.getRange(1, insert, 1, finalHeader[0].length).setValues(finalHeader);
    destSheet.setFrozenRows(1);
    destSheet.autoResizeColumns(insert, responseData[0].length);
    destSheet.getRange(2, insert, responseData.length, responseData[0].length).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    Logger.log(responseData.length + " Responses Delivered.");
  }
}
    