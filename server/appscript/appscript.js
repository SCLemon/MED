const sheet = SpreadsheetApp.getActive().getSheetByName('mail');
function doPost(e) {
  var user = JSON.parse(e.postData.contents).user
  sheet.appendRow([user])
  return ContentService.createTextOutput(user).setMimeType(ContentService.MimeType.TEXT);
}
function send(){
  var datas = sheet.getDataRange().getValues();
  for(var i in datas){
    MailApp.sendEmail(datas[i][0],'[通知] Med智能小助手','Med智能小助手提醒您別忘了查看今日事項，快到APP查看詳情吧！',{
      noReply:true,
    })
  }
}