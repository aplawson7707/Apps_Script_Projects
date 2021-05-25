// A quick script to see who owns a folder

function folderOwner() {
    var rootFolder = DriveApp.getFolderById("folder-id");
    var folders = rootFolder.getFolders();
    var rootOwner = rootFolder.getOwner();
  
    Logger.log(rootFolder.getId() + " " + rootOwner.getEmail());
  
    while (folders.hasNext()) {
      var folder = folders.next();
      var owner = folder.getOwner();
      Logger.log(folder.getId() + " " + owner.getEmail());
    }
  }
  