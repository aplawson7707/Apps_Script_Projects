function myFunction() {
    const sheetName = "Sheet1"; // Please set the sheet name.
    const a1Notation = "A1:C10"; // Please set the sort range as a1Notation.
  
    // 1. Retrieve the background colors from the cells.
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    const range = sheet.getRange(a1Notation);
    const backgrounds = range.getBackgroundObjects();
  
    // 2. Create the request body for using the batchUpdate method of Sheets API.
    const backgroundColors = Object.values(
      backgrounds.reduce((o, [a]) => {
        const rgb = a.asRgbColor();
        return Object.assign(o, {
          [rgb.asHexString()]: {
            red: rgb.getRed() / 255,
            green: rgb.getGreen() / 255,
            blue: rgb.getBlue() / 255,
          },
        });
      }, {})
    );
    const startRow = range.getRow() - 1;
    const startColumn = range.getColumn() - 1;
    const srange = {
      sheetId: sheet.getSheetId(),
      startRowIndex: startRow,
      endRowIndex: startRow + range.getNumRows(),
      startColumnIndex: startColumn,
      endColumnIndex: startColumn + range.getNumColumns(),
    };
    const requests = [
      {
        sortRange: {
          range: srange,
          sortSpecs: [{ dimensionIndex: 0, sortOrder: "ASCENDING" }],
        },
      },
      {
        sortRange: {
          range: srange,
          sortSpecs: backgroundColors.map((rgb) => ({ backgroundColor: rgb })),
        },
      },
    ];
  
    // 3. Request to Sheets API using the request body.
    Sheets.Spreadsheets.batchUpdate({ requests: requests }, ss.getId());
  }