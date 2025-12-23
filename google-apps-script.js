/**
 * BeanLog - Google Apps Script Web App
 * 
 * このスクリプトをGoogle Apps Scriptにデプロイして、Web Appとして公開してください。
 * 公開URLを .env ファイルの VITE_GOOGLE_APPS_SCRIPT_URL に設定してください。
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { action, spreadsheetId, sheetName, row } = data;

    if (action === 'append') {
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      let sheet = spreadsheet.getSheetByName(sheetName);
      
      // シートが存在しない場合は作成
      if (!sheet) {
        sheet = spreadsheet.insertSheet(sheetName);
        // ヘッダー行を追加
        const headers = [
          'ID', 'タイプ', '日付', '時刻', '木番号', '説明', '数量', '単位',
          '写真数', '天気', '気温', '湿度', 'AI診断-病気', 'AI診断-害虫',
          'AI診断-熟度', 'AI診断-アドバイス', '作成日時', '更新日時'
        ];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
        sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      }

      // データを追加
      sheet.appendRow(row);

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Data appended successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    message: 'BeanLog Google Apps Script is running',
    version: '1.0.0'
  })).setMimeType(ContentService.MimeType.JSON);
}

