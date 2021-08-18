function docFromSheet() {
    var dataRange = SpreadsheetApp.getActive().getDataRange();
    var data = dataRange.getValues();
    var header = data.shift();
   
    var updatedData = [];
   
    updatedData.push(header);
   
    // If row 3 (for example) is blank, create a doc using first column as a title
    data.forEach(function(row) {
      if(row[2] === "") {
        var document = DocumentApp.create(row[0]);
        var documentId = document.getId();
        var documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
        row[2] = documentUrl;
        updatedData.push(row);
      }
    });
   
    dataRange.setValues(updatedData);
   }