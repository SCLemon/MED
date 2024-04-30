const sheet = SpreadsheetApp.getActive().getSheetByName('mail');
function doPost(e) {
  var data = JSON.parse(e.postData.contents).contents;
  for(var i=0;i<data.length;i++){
    send(data[i].mail,data[i].data)
  }
  return ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
}
function send(mail,data){
  var insert='';
  for(var i =0;i<data.length;i++){
    insert+=`<tr style="height:50px; line-height:50px">
              <td colspan="2">${data[i].todo.period}</td>
              <td colspan="2">${data[i].todo.title}</td>
            </tr>
           `
  }
  var html=`
    <div style="margin-bottom: 10px;">早安親愛的使用者，以下是今日的代辦事項！</div>
    <table border="1" style="border-collapse: collapse; text-align: center; width: 335px;">
        <tr style="height:50px; line-height:50px"> 
          <th colspan="4">MED 智能小助手</th>
        </tr>
        <tr style="height:50px; line-height:50px"> 
            <th>日期</th>
            <th colspan="3">${data[0].date}</th>
        </tr>
        <tr style="height:50px; line-height:50px">
            <td colspan="2">時段</td>
            <td colspan="2">標題</td>
        </tr>
        ${insert}
    </table>
    <div style="margin-top: 10px;">敬祝您有個愉快的一天！</div>
  `
  MailApp.sendEmail(mail,'MED小精靈 - 今日計畫通知',{},{
    noReply:true,
    htmlBody:html
  })
}