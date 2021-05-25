/**
 * Multiplies the input value by 2.
 *
 * @param {number|Array<Array<number>>} input The value or range of cells
 *     to multiply.
 * @return The input multiplied by 2.
 * @customfunction
 */
 function DOUBLE(input) {
    return Array.isArray(input) ?
        input.map(row => row.map(cell => cell * 2)) :
        input * 2;
  }
  
  /**
   * Imitates a Vlookup function.
   * 
   * @param {search_term} search_term The desired value to look for in the column.
   * @param {column} colNum The number of the column the lookup should begin from
   * @param {index} numCols The number of columns the lookup should cover.
   * @customfunction
   */
  function FAKELOOKUP(search_term, column, index) {
  
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow=sheet.getLastRow();
    var data=sheet.getRange(1,column,lastRow,column+index).getValues();
  
    for(i=0;i<data.length;++i){
      if (data[i][0]==search_term){
        return data[i][index];
      }
    }
  }