// GLOBALS
//Array of file extension which you would like to extract to Drive
var fileTypesToExtract = ['xlsx', 'csv'];
//Name of the folder in google drive in which files will be put
var folderName = 'COS Attachments';
//Name of the label which will be applied after processing the mail message
var labelName = 'Imported';



function fetchAttachments(){
  //build query to search emails
  var query = '';
  //filename:jpg OR filename:tif OR filename:gif OR fileName:png OR filename:bmp OR filename:svg'; //'after:'+formattedDate+
  for(var i in fileTypesToExtract){
 query += (query === '' ?('filename:'+fileTypesToExtract[i]) : (' OR filename:'+fileTypesToExtract[i]));
  }
  query = 'is:unread in:inbox label:COS_Reports ' + query;
  var threads = GmailApp.search(query);
  var label = getGmailLabel_("Imported");
  var parentFolder;
  if(threads.length > 0){
    parentFolder = getFolder_(folderName);
  }
  var root = DriveApp.getRootFolder();
  for(var i in threads){
    var mesgs = threads[i].getMessages();
 for(var j in mesgs){
      //get attachments
      var attachments = mesgs[j].getAttachments();
      for(var k in attachments){
        var attachment = attachments[k];
        var isDefinedType = checkIfDefinedType_(attachment);
     if(!isDefinedType) continue;
     var attachmentBlob = attachment.copyBlob();
        var file = DriveApp.createFile(attachmentBlob);
        parentFolder.addFile(file);
        root.removeFile(file);
      }
 }
 threads[i].addLabel(label);
 threads[i].markRead();
  }
}

//This function will get the parent folder in Google drive
function getFolder_(folderName){
  var folder;
  var fi = DriveApp.getFoldersByName(folderName);
  if(fi.hasNext()){
    folder = fi.next();
  }
  else{
    folder = DriveApp.createFolder(folderName);
  }
  return folder;
}

//getDate n days back
// n must be integer
function getDateNDaysBack_(n){
  n = parseInt(n);
  var date = new Date();
  date.setDate(date.getDate() - n);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy/MM/dd');
}

function getGmailLabel_(name){
  var label = GmailApp.getUserLabelByName(name);
  if(!label){
 label = GmailApp.createLabel(name);
  }
  return label;
}

//this function will check for filextension type and return boolean
function checkIfDefinedType_(attachment){
  var fileName = attachment.getName();
  var temp = fileName.split('.');
  var fileExtension = temp[temp.length-1].toLowerCase();
  if(fileTypesToExtract.indexOf(fileExtension) !== -1) return true;
  else return false;
}