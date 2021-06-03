/**
 * The event handler triggered when opening the spreadsheet.
 * @param {Event} e The onOpen event.
 */
 function onOpen(e) {
    SpreadsheetApp.getUi() 
        .createMenu('Scripts')
        .addItem('Refresh Data', 'refreshData')
        .addToUi();
  }
  
  function refreshData() {
    // Source Data variables
    var ss = SpreadsheetApp.openById('Source_Sheet_ID'); //Select source data worksheet
    var studentOrders = ss.getSheetByName('Source_Sheet_Name_1'); //Source
    var classOrders = ss.getSheetByName('Source_Sheet_Name_2'); //Source
  
    // Destination Data variables
    var destSS = SpreadsheetApp.openById('Dest_Sheet_ID'); //Select dest worksheet
    var destStudentOrders = destSS.getSheetByName('Dest_Sheet_Name_1'); //Dest
    var destClassOrders = destSS.getSheetByName('Dest_Sheet_Name_2'); //Dest
    
    var orderRange = destStudentOrders.getRangeList(['A:AB']);
    orderRange.clear();
    var orders = studentOrders.getDataRange().getValues();
    destStudentOrders.getRange(1, 1, orders.length, 28).setValues(orders);
  
    var classRange = destClassOrders.getRangeList(['A:J']);
    classRange.clear();
    var classes = classOrders.getDataRange().getValues();
    destClassOrders.getRange(1, 1, classes.length, 10).setValues(classes);
  
    SpreadsheetApp.getUi().alert(orders.length + " Student Orders and " + classes.length + " Class Orders Updated")
  }