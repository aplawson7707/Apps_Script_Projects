// Assumes a tabular data source set up with three columns:
// Column 1: "This is a long column header name (eg. A question field from Jotform, etc...)"
// Column 2: "First Name"
// Column 3: "Last Name"


// Create a dictionary to map long column names to shorter, more manageable names
const column_mapping = {
    "This is a long column header name (eg. A question field from Jotform, etc...)": 'long_question',
    "First Name": "first_name",
    'Last Name': 'last_name',
}
  
const values = SpreadsheetApp.getActiveSheet().getDataRange().getDisplayValues()
const headers = values.shift()
  
const lookups = []
  
for (let [key, value] of Object.entries(column_mapping)) {
  headers.forEach(function(row, row_index) {
    if (row == key) {
      lookups.push({
        'index': row_index,
        'key': value,
      })
    }
  })
}
  
function get_values(row) {  
  const row_data = {}
  for (let lookup of lookups) {
    row_data[lookup.key] = row[lookup.index]
  }
  return row_data
}
  
function main() {
  values.forEach(function(row_values) {
    let row = get_values(row_values, headers)
    Logger.log(row['first_name'])
    Logger.log(row['last_name'])
    Logger.log(row['long_question'])
  })
}