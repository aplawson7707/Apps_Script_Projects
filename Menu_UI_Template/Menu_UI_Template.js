/**
 * The event handler triggered when opening the spreadsheet.
 * THIS WILL NOT RUN ON OPEN IF THERE ARE VARIABLES OUTSIDE OF FUNCTIONS
 * @param {Event} e The onOpen event.
 */
 function onOpen(e) {
    SpreadsheetApp.getUi() 
        .createMenu('Top Level')
        .addItem('Option1', 'function1_name')
        .addItem('Option2', 'function2_name')
        .addToUi();
  }