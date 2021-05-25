// A quick script to grant viewing permissions to a file

function grantViewingPermissions() {
    file = DriveApp.getFileById('file-id');
    file.addViewer('email-address')
  }