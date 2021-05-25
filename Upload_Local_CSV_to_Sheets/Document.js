function writeDataToDoc(data) {
    var doc = DocumentApp.create('Imported CSV (' + new Date() + ')');
    table = doc.getBody().insertTable(0, data);
    return doc.getUrl();
  }
  
  function writeDataToSheets(data) {
    var ss = SpreadsheetApp.create('Imported CSV (' + new Date() + ')');
    ss.getActiveSheet().getRange(1, 1, data.length, data[0].length).setValues(data);
    return ss.getUrl();
  }