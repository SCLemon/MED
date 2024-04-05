const sheet = SpreadsheetApp.getActive().getSheetByName('mail');
function doPost(e) {
  var user = JSON.parse(e.postData.contents).user
  sheet.appendRow([user])
  return ContentService.createTextOutput(user).setMimeType(ContentService.MimeType.TEXT);
}
