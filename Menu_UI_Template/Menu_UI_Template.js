function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Top Level')
        .addItem('Option1', 'function1_name')
        .addItem('Option2', 'function2_name')
        .addToUi();
  }