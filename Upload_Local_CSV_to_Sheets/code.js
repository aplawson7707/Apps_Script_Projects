function doGet() {
    var ui = HtmlService.createHtmlOutputFromFile('index')
        .setTitle('CSV Upload to Docs/Spreadsheets');
    return ui;
  }
  
  function serverUpload(form) {
    var fileBlob = form.thefile;
    var values = []
    var rows = fileBlob.contents.split('\n');
    for(var r=0, max_r=rows.length; r<max_r; ++r) {
      var row = rows[r].split('","');
      row[0] = row[0].replace('"', '');
      row[row.length-1] = row[row.length-1].replace('"', '');
      values.push( row.toString().split(',') );
    }
    if (form.format == 'sheet') {
      return writeDataToSheets(values);
    } else if (form.format == 'doc'){
      return writeDataToDoc(values);
    }
    return 'oops';
  }