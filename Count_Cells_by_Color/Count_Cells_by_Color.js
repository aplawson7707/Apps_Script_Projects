/**
* @param {range} countRange Range to be evaluated
* @param {range} colorRef Cell with background color to be searched for in countRange
* @return {number}
* @customfunction
*/

function countColoredCells(countRange,colorRef) {
    var activeRange = SpreadsheetApp.getActiveRange();
    var activeSheet = activeRange.getSheet();
    var formula = activeRange.getFormula();
    
    var rangeA1Notation = formula.match(/\((.*)\,/).pop();
    var range = activeSheet.getRange(rangeA1Notation);
    var bg = range.getBackgrounds();
    var values = range.getValues();
    
    var colorCellA1Notation = formula.match(/\,(.*)\)/).pop();
    var colorCell = activeSheet.getRange(colorCellA1Notation);
    var color = colorCell.getBackground();
    
    var count = 0;
    
    for(var i=0;i<bg.length;i++)
      for(var j=0;j<bg[0].length;j++)
        if( bg[i][j] == color )
          count=count+1;
    return count;
  };